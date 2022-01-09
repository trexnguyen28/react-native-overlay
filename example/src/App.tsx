import * as React from 'react';
import { StyleSheet, View, StatusBar, Pressable, Text } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  OverlayProvider,
  OverlayPresenter,
} from '@trexnguyen28/react-native-overlay';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 200,
    height: 200,
    backgroundColor: 'red',
  },
});

export default function App() {
  const onPress = () => {
    OverlayPresenter.present({
      component: () => {
        return <View style={styles.box} />;
      },
      alignment: 'auto',
      props: {},
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} />
        <Pressable onPress={onPress}>
          <Text>Press me to do some text</Text>
        </Pressable>
        <OverlayProvider />
      </View>
    </GestureHandlerRootView>
  );
}
