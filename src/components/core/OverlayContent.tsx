import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { OverlayContentProps } from '../../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const OverlayContent: React.FC<OverlayContentProps> = ({
  children = [],
  style = {},
}) => {
  return (
    <View style={[styles.container, style]} pointerEvents={'box-none'}>
      {children}
    </View>
  );
};

export { OverlayContent };
