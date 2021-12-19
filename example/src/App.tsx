import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
// import { BackDropView } from 'react-native-overlay';

export default function App() {
  const [result] = React.useState<number | undefined>();

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      {/*<BackDropView animatedProgress={0} />*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
