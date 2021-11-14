import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { toggleModal } from './ble';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/reducers';
import { TouchableOpacity } from 'react-native-gesture-handler';




export function HeaderComp() {
    let {show} = useSelector((state: RootState) => state.modalReducer)
    let {connected} = useSelector((state: RootState) => state.modalReducer)
    const dispatch = useDispatch()

    let color = connected? "blue": "black"

    return (
        <View style={styles.appHeader}>
        
          <Image  style={styles.img} source={require("./../assets/imgs/birdhouse.png")}/>
          <TouchableOpacity onPress={() => dispatch(toggleModal(show))}> 
            <Feather name="bluetooth" size={24} color={color} />
          </TouchableOpacity>   
        </View>
    )
}

const styles = StyleSheet.create({
    
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