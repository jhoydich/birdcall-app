import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import React from 'react';
import { BirdComp } from './components/bird';
import { Feather } from '@expo/vector-icons';
import DeviceReader from './components/ble'
import {Store} from './reducers/reducers'
import { StyleSheet, Text, View, Image } from 'react-native';

export default function App() {
  return (
    <Provider store={Store}>
      <View style={styles.container}>
        <View style={styles.appHeader}>
          <Image  style={styles.img} source={require("./assets/imgs/birdhouse.png")}/>
          <Feather name="bluetooth" size={24} color="black" />
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
