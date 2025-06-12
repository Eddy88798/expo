import ExpoModulesCore

public class PeekAndPopModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoRouterPeekAndPop")

    View(PeekAndPopView.self) {
      Prop("nextScreenId") { (view: PeekAndPopView, nextScreenId: String) in
        view.setNextScreenId(nextScreenId)
      }

      Prop("preferredContentSize") { (view: PeekAndPopView, size: [String: Int]) in
        view.setPreferredContentSize(size)
      }

      Events(
        "onPreviewTapped",
        "onWillPreviewOpen",
        "onDidPreviewOpen",
        "onPreviewWillClose",
        "onPreviewDidClose",
        "onActionSelected"
      )
    }

    View(PeekAndPopPreviewView.self) {
      Events("onSetSize")
    }

    View(PeekAndPopActionView.self) {
      Prop("id") { (view: PeekAndPopActionView, id: String) in
        view.id = id
      }
      Prop("title") { (view: PeekAndPopActionView, title: String) in
        view.title = title
      }
    }

    View(PeekAndPopTriggerView.self) {}
  }
}
