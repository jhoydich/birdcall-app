import React from 'react';
import { Component } from 'react';
import { Platform, View, Text, Modal, StyleSheet, Button, FlatList, TouchableOpacity, ActivityIndicatorBase, ActionSheetIOS } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { connect } from 'react-redux';
import { actions } from '../actions/actions';
import { birdList, CharValue } from '../types/birdType';
import { PermissionsAndroid } from 'react-native';
import {Buffer} from 'buffer';
import { modalType } from '../types/modal';
import { RootState } from '../reducers/reducers';;




async function requestLocationPermission() {
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
    show: boolean;
    devices: Array<Device>;
    toggle: boolean;
}

export function toggleModal(bool: boolean) {
    return {
        type: actions.ToggleModal,
        payload: !bool
    }
}

function sendCnxStatus(bool: boolean) {
    return {
        type: actions.Connected,
        payload: bool
    }
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

function addDevice(dev: Device) {

    return {
        type: actions.AddDevice,
        payload: dev,
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
                if (state === 'PoweredOn') return
            })
        } else {
            return
        }
    }


    connectToDevice(device: Device) {
        console.log("Connecting to device")
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

        device.onDisconnected(() => {
            this.props.dispatch(sendCnxStatus(false))
        })
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
                        
                        this.props.dispatch(addDevice(device))
                    
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
                        this.props.dispatch(toggleModal(this.props.show))
                        this.props.dispatch(sendCnxStatus(true))
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
        
        if (this.props.devices.length == 0) {
            return(
                <Modal
                 animationType="slide"
                 transparent={true}
                 visible={this.props.show}
                 
                 onShow={() => this.scanAndConnect()}
             >
                 <View style={styles.modalStyle}>
                 
                     <Text style={styles.flatListCenter}>
                         No devices to connect to...
                     </Text>
     
                     <View style={styles.closeButton}>
                         <Button
                             onPress={() => this.props.dispatch(toggleModal(this.props.show))}
                             title="Close"
                             color="grey"
                             accessibilityLabel="Close modal button"
                         />
                     </View>
                 </View>
                </Modal>
             )

        }
        return(
           <Modal
            animationType="slide"
            transparent={true}
            visible={this.props.show}
            onShow={() => this.scanAndConnect()}
            
        >
            
            <View style={styles.modalStyle}>
            
                <FlatList
                    data={this.props.devices}
                    
                    contentContainerStyle={styles.flatListCenter}
                    keyExtractor={item => item.id}
                    extraData={this.props.toggle}
                    // <Image style={styles.img} source={item.img}/>
                    // displaying the list of birds & when they were heard
                    renderItem={({item}) => (
                            <TouchableOpacity style={styles.modalItem} onPress={() => this.connectToDevice(item)}>
                                <View>
                                    <Text>{item.name}</Text> 
                                </View>
                            </TouchableOpacity> 
                             
                            
                    )}
                    showsVerticalScrollIndicator={false}
                />

                <View style={styles.closeButton}>
                    <Button
                        onPress={() => this.props.dispatch(toggleModal(this.props.show))}
                        title="Close"
                        color="grey"
                        accessibilityLabel="Close modal button"
                    />
                </View>
            </View>
           </Modal>
        )
    }

}

const mapStatetoProps = (store: RootState) => {
    return {
        show: store.modalReducer.show,
        devices: store.modalReducer.devices,
        toggle: store.modalReducer.toggle
    }
}

export default connect(mapStatetoProps)(DeviceReader)


// add view around button to add margin
const styles = StyleSheet.create({
    
    modalStyle: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F1F1F1",
        marginVertical: "40%",
        marginHorizontal: "15%",
        borderRadius: 5,
    },
    flatListCenter: {
        textAlign:"center",
        alignItems: "center",
        width: "90%",
        height: "50%",
    },
    closeButton: {
        marginBottom: 10,
    },
    modalItem: {
        borderStyle: "solid",
        borderWidth: 1,
        width: "80%",
        borderRadius: 5,
        backgroundColor: "cyan",
        marginTop: 5,
    }
  });