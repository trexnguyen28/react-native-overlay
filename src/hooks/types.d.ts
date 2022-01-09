export type KeyboardLayout = {
  height: number;
};

export interface KeyboardEventHandler {
  onKeyboardHide: () => void;
  onKeyboardShow: (keyboardLayout: KeyboardLayout) => void;
}
