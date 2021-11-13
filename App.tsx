import { StatusBar } from 'expo-status-bar';
import { Provider, useSelector } from 'react-redux';
import React from 'react';
import { BirdComp } from './components/bird';
import DeviceReader, { toggleModal } from './components/ble'
import {Store} from './reducers/reducers'
import { StyleSheet, Text, View, Image } from 'react-native';
import { HeaderComp } from './components/header';

export default function App() {
  

  return (
    <Provider store={Store}>
      <View style={styles.container}>
        <HeaderComp />
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
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headerText: {
    fontFamily: "Times New Roman",
    fontSize: 20,
  },
  img: {
    height: "60%",
    width: "10%"
  }
});
