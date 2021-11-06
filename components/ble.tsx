import React from 'react';
import { Component } from 'react';
import { Platform, View, Text } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { connect } from 'react-redux';
import { actions } from '../actions/actions';
import { birdList, CharValue } from '../types/birdType';
import { PermissionsAndroid } from 'react-native';
import {Buffer} from 'buffer';




export async function requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: 'Location permission for bluetooth scanning',
          message: 'whatever',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      ); 
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission for bluetooth scanning granted');
        return true;
      } else {
        console.log('Location permission for bluetooth scanning revoked');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }


interface bleAbstractions  {
    manager?: BleManager;
    dispatch: Function;
}

function dispatchBird(charUUID: string, val: number) {

    let pl: CharValue = {
        char: charUUID,
        value: val
    }
    return {
        type: actions.UpdateList,
        payload: pl
    }
}

function refreshList() {
    
    return {
        type: actions.RefreshList,
        payload: 0,
    }
}

class DeviceReader extends Component<bleAbstractions> {
    manager: BleManager
    constructor(props: any) {
        super(props)
        this.manager = new BleManager()
        this.startBle()
    }

    // necessary for ios
    startBle() {
        console.log("Started BLE")
        if (Platform.OS === 'ios') {
            this.manager.onStateChange((state) => {
                if (state === 'PoweredOn') this.scanAndConnect()
            })
        } else {
            this.scanAndConnect()
        }
    }

    // scanning for devices and connecting to the one we want
    async scanAndConnect() {
        const permission = requestLocationPermission();
        
        
            if (await permission) {
                console.log("Scanning")
        
        

                this.manager.startDeviceScan(null, 
                    null, (error, device) => {
                    if (error) {
                        console.log(error)
                        return
                    }
                    


                    if (device !== null) {
                        

                    
                        if (device.name === "Bird Monitor") {
                            console.log("Found device")
                            this.manager.stopDeviceScan()
                            device.connect()
                            .then((device) => {
                                console.log("Connected to device")
                                return device.discoverAllServicesAndCharacteristics()
                            })
                            .then((device) => {
                                console.log("Subscribing")
                                return this.setupNotifications(device)
                            })
                            .then(() => {
                                
                            }, (error) => {
                                console.log(error)
                            })
                        }
                    }
                    return
                });
            }
        
        
    }

    // setting up notifications for the various characteristics
    async setupNotifications(device: Device) {
        
        birdList.forEach( async (bird) => {
            // if our service is on the dev, lets monitor it
            let services = device.services()
            if (await services != null) {
                 

                for (const [key, value] of (await services).entries()) {
                    if (value.uuid == bird.serviceUUID) {
                        console.log("subscribed")
                        device.monitorCharacteristicForService(bird.serviceUUID, bird.charUUID, (error, characteristic) => {
                            if (error) {
                                console.log(error.message)
                                return
                            }
                            //console.log(bird.charUUID)
                            let val = characteristic?.value?.toString()
                            if (val != undefined) {
                                
                                let decodedVal = Buffer.from(val, 'base64').toString('hex')
                                let mins = Number("0x" + decodedVal)
                                this.props.dispatch(dispatchBird(bird.charUUID, mins))
                                this.props.dispatch(refreshList())
                            }
                            
                            
                        })
                    }

                }
            }
        }
        )
    }
    render() {
        return(
            <View>
                
               
            
            </View>
        )
    }

}

export default connect()(DeviceReader)