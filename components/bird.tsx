import React from 'react';
import { StyleSheet, FlatList, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import {useSelector} from 'react-redux'
import { Audio } from 'expo-av';
import { RootState } from '../reducers/reducers';

export function BirdComp() {
    // list of birds to display from the reducer
    let {birds} = useSelector((state: RootState) => state.birdsReducer)
    
    let {toggle} = useSelector((state: RootState) => state.refreshReducer)
    // playing the sound of the bird in question
    let clicked = async (call: any) => {
       
        const { sound } = await Audio.Sound.createAsync(call);
     
         await sound.playAsync(); 
    }
    

    return (
                // flatlist of all birds that should be displayed
                <FlatList
                    data={birds}
                    
                    contentContainerStyle={styles.flatListCenter}
                    keyExtractor={item => item.id}
                    extraData={toggle}
                    // <Image style={styles.img} source={item.img}/>
                    // displaying the list of birds & when they were heard
                    renderItem={({item}) => (
                        
                                <View style={styles.birdDataContainer}>
                                    <Image style={styles.img} source={item.img} />
                                    <View> 
                                        <Text>{item.name}</Text>
                                        <Text>{item.sciName}</Text>
                                        <Text>Heard: {item.lastHeard}</Text>
                                    </View>
                                    <TouchableOpacity activeOpacity = { .5 } onPress={() => clicked(item.call) } style={styles.speakerImg}>
                                        <Image  source={require("./../assets/imgs/speaker.png")}/>
                                    </TouchableOpacity>
                                    
                                </View>  
                            
                    )}
                    showsVerticalScrollIndicator={false}
                />
                 
    )
}


const styles = StyleSheet.create({  
    img: {
    height: "90%",
    width: "20%",
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
    },
    birdDataContainer: {
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 5,
    borderStyle: "solid",
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 10,
    width: Dimensions.get('screen').width - 20,
    height: "30%",
    },
    speakerImg: {
        position: 'absolute',
        right: 0,
        
        borderRadius: 5,
        marginLeft: 5,
        marginRight: 5,
    },
    flatListCenter: {
        alignItems: "center",
        width: "100%",
        height: "100%",
    }
});