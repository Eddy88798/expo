"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PeekAndPopActionNativeView;
const expo_1 = require("expo");
const NativeView = (0, expo_1.requireNativeView)('ExpoRouterPeekAndPop', 'PeekAndPopActionView');
function PeekAndPopActionNativeView(props) {
    console.log('Action naitve');
    return <NativeView {...props}/>;
}
//# sourceMappingURL=PeekAndPopActionView.js.map