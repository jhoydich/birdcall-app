import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import React from 'react';
import { BirdComp } from './components/bird';
import DeviceReader from './components/ble'
import {Store} from './reducers/reducers'
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <Provider store={Store}>
      <View style={styles.container}>
        <View style={styles.appHeader}>
          <Text style={styles.headerText}>Bird House</Text>
        </View>
        <View style={styles.birdsContainer}>
          <BirdComp />
        </View>
          
        <StatusBar style="auto" />
        <DeviceReader />
      </View>
    </Provider>
  );
}
// <StatusBar style="auto" />
const styles = StyleSheet.create({
  birdsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#D5E7E9',
  },
  appHeader: {
    alignItems: "center",
    height: "10%",
    marginTop: 50,
  },
  headerText: {
    fontFamily: "Times New Roman",
    fontSize: 20,
  }
});
