import { useEffect, useRef } from 'react';
import { Keyboard, KeyboardEvent, Platform, ScreenRect } from 'react-native';
//
import type { KeyboardEventHandler } from './types';

const useKeyboardEvent = (handler: KeyboardEventHandler) => {
  const isShowingKeyboard = useRef(false);
  //
  const relativeKeyboardHeight = (keyboardFrame: ScreenRect) => {
    if (!keyboardFrame) {
      return 0;
    }
    //
    return keyboardFrame.height;
  };

  const showKeyboard = (event: KeyboardEvent) => {
    if (!isShowingKeyboard.current) {
      isShowingKeyboard.current = true;
      const kHeight = relativeKeyboardHeight(event.endCoordinates);
      handler.onKeyboardShow({ height: kHeight });
    }
  };

  const hideKeyboard = (_: KeyboardEvent) => {
    if (isShowingKeyboard.current) {
      isShowingKeyboard.current = false;
      handler.onKeyboardHide();
    }
  };
  //
  const onKeyboardShow = (event: KeyboardEvent) => {
    if (Platform.OS === 'android') {
      showKeyboard(event);
    } else if (event.duration > 0) {
      showKeyboard(event);
    }
  };

  const onKeyboardHide = (event: KeyboardEvent) => {
    if (Platform.OS === 'android') {
      hideKeyboard(event);
    } else if (event.duration > 0) {
      hideKeyboard(event);
    }
  };
  //
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      onKeyboardShow
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      onKeyboardHide
    );
    //
    return () => {
      showSubscription.remove();
      hideSub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export { useKeyboardEvent };
