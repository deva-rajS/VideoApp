/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import VideoRender from './VideoRender';

function App() {
  return (
    <>
      <View style={styles.txtContainer}>
        <Text style={styles.text}>Sample Video</Text>
      </View>
      <VideoRender />
    </>
  );
}
const styles = StyleSheet.create({
  text: {
    fontWeight: '700',
    fontSize: 16,
  },
  txtContainer: {
    marginTop: 10,
    marginHorizontal: 10,
  },
});
export default App;
