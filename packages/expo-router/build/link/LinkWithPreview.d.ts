import React, { type PropsWithChildren, type ReactElement } from 'react';
import { type ButtonProps } from 'react-native';
import { LinkProps } from './useLinkHooks';
export declare function LinkWithPreview({ experimentalPreview, children, ...rest }: LinkProps): React.JSX.Element;
interface LinkMenuItemProps {
    title: string;
    onPress: () => void;
}
export declare function LinkMenuItem(_: LinkMenuItemProps): null;
interface LinkMenuProps {
    children: ReactElement<ButtonProps | LinkMenuItemProps> | ReactElement<ButtonProps | LinkMenuItemProps>[];
}
export declare function LinkMenu({ children }: LinkMenuProps): React.JSX.Element[];
interface LinkPreviewProps extends PropsWithChildren {
    width?: number;
    height?: number;
}
export declare function LinkPreview({ children, width, height }: LinkPreviewProps): React.ReactNode;
export declare function LinkTrigger({ children }: PropsWithChildren): React.ReactNode;
export {};
//# sourceMappingURL=LinkWithPreview.d.ts.map