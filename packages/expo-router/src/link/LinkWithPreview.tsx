'use client';

import React, {
  isValidElement,
  useEffect,
  useState,
  type PropsWithChildren,
  type ReactElement,
} from 'react';
import { Button, type ButtonProps } from 'react-native';

import { useRouter } from '../hooks';
import { BaseExpoRouterLink } from './BaseExpoRouterLink';
import { Link } from './Link';
import { HrefPreview } from './preview/HrefPreview';
import { useLinkPreviewContext } from './preview/LinkPreviewContext';
import {
  PeekAndPopActionView,
  PeekAndPopPreviewView,
  PeekAndPopTriggerView,
  PeekAndPopView,
} from './preview/native';
import { useScreenPreload } from './preview/useScreenPreload';
import { LinkProps } from './useLinkHooks';
import { shouldLinkExternally } from '../utils/url';

export function LinkWithPreview({ experimentalPreview, children, ...rest }: LinkProps) {
  const router = useRouter();
  const { setIsPreviewOpen } = useLinkPreviewContext();
  const [isCurrentPreviewOpen, setIsCurrenPreviewOpen] = useState(false);
  const [previewSize, setPreviewSize] = useState<{ width: number; height: number } | undefined>(
    undefined
  );

  const { preload, updateNavigationKey, navigationKey } = useScreenPreload(rest.href);

  useEffect(() => {
    if (shouldLinkExternally(String(rest.href))) {
      console.warn('External links previews are not supported');
    }
    if (rest.replace) {
      console.warn('Using replace links with preview is not supported');
    }
  }, [rest.href, rest.replace]);

  const triggerElement = React.useMemo(
    () => getFirstChildOfType(children, LinkTrigger),
    [children]
  );
  const menuElement = React.useMemo(() => getFirstChildOfType(children, LinkMenu), [children]);
  const previewElement = React.useMemo(
    () => getFirstChildOfType(children, LinkPreview),
    [children]
  );

  const trigger = React.useMemo(
    () =>
      triggerElement ??
      React.Children.toArray(children).filter(
        (child) =>
          !isValidElement(child) ||
          !([Link.Menu, Link.Trigger, Link.Preview] as unknown[]).includes(child.type)
      ),
    [triggerElement, children]
  );
  const buttons = React.useMemo(
    () =>
      menuElement?.props.children
        ? Array.isArray(menuElement?.props.children)
          ? menuElement.props.children
          : [menuElement?.props.children]
        : [],
    [menuElement]
  );

  const actionsHandlers = React.useMemo(
    () =>
      buttons
        .filter(
          (button) =>
            isValidElement(button) && (button.type === Button || button.type === LinkMenuItem)
        )
        .reduce(
          (acc, action) => ({
            ...acc,
            [action.props.title]: action.props.onPress as () => void,
          }),
          {} as Record<string, () => void>
        ),
    [buttons]
  );
  const preview = React.useMemo(
    () =>
      previewElement && previewElement.props.children ? (
        previewElement
      ) : (
        <HrefPreview href={rest.href} />
      ),
    [previewElement, rest.href]
  );

  const contentSize = {
    width: previewElement?.props.width ?? 0,
    height: previewElement?.props.height ?? 0,
  };

  if (shouldLinkExternally(String(rest.href)) || rest.replace) {
    return <BaseExpoRouterLink children={children} {...rest} />;
  }

  return (
    <PeekAndPopView
      nextScreenId={navigationKey}
      preferredContentSize={contentSize}
      onActionSelected={({ nativeEvent: { id } }) => {
        actionsHandlers[id]?.();
      }}
      onWillPreviewOpen={() => {
        preload();
        setIsPreviewOpen(true);
        setIsCurrenPreviewOpen(true);
        // We need to wait here for the screen to preload. This will happen in the next tick
        setTimeout(updateNavigationKey);
      }}
      onPreviewWillClose={() => {}}
      onPreviewDidClose={() => {
        setIsPreviewOpen(false);
        setIsCurrenPreviewOpen(false);
      }}
      onPreviewTapped={() => {
        router.navigate(rest.href, { __internal__PreviewKey: navigationKey });
      }}>
      <PeekAndPopTriggerView>
        <BaseExpoRouterLink {...rest} children={trigger} ref={rest.ref} />
      </PeekAndPopTriggerView>
      <PeekAndPopPreviewView
        onSetSize={({ nativeEvent: size }) => setPreviewSize(size)}
        style={{ position: 'absolute', ...previewSize }}>
        {(isCurrentPreviewOpen || rest.experimentalDisableLazyPreview) && preview}
      </PeekAndPopPreviewView>
      {menuElement}
    </PeekAndPopView>
  );
}

function getFirstChildOfType<PropsT>(
  children: React.ReactNode | React.ReactNode[],
  type: (props: PropsT) => unknown
) {
  return React.Children.toArray(children).find(
    (child): child is ReactElement<PropsT> => isValidElement(child) && child.type === type
  );
}

interface LinkMenuItemProps {
  title: string;
  onPress: () => void;
}

export function LinkMenuItem(_: LinkMenuItemProps) {
  return null;
}
interface LinkMenuProps {
  children:
    | ReactElement<ButtonProps | LinkMenuItemProps>
    | ReactElement<ButtonProps | LinkMenuItemProps>[];
}

export function LinkMenu({ children }: LinkMenuProps) {
  return React.Children.map(children, (child) => {
    if (isValidElement(child) && (child.type === Button || child.type === LinkMenuItem)) {
      return <PeekAndPopActionView title={child.props.title} id={child.props.title} />;
    }
    return null;
  });
}

interface LinkPreviewProps extends PropsWithChildren {
  width?: number;
  height?: number;
}

export function LinkPreview({ children, width, height }: LinkPreviewProps) {
  return children;
}

export function LinkTrigger({ children }: PropsWithChildren) {
  return children;
}
