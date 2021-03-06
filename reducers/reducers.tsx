import { actions } from '../actions/actions'
import { createStore, combineReducers} from 'redux'
import {birdList, baseState, baseListState} from '../types/birdType'
import uuid from 'react-native-uuid';
import { baseModal } from '../types/modal';


// HandleTime is a string formatter for time
// haven't decided how to handle it quite yet
// need to look at limit of value arduino sends
function HandleTime(mins: number) :string {
  
  if (isNaN(mins) || mins == undefined) {
    
    return ""
  }
  
  if (mins == 0) {
    return "Just now"
  } else if (mins == 255) {
    return ""
  }


  let str = ""

  // handling hours and mins
  let hrs = Math.floor(mins /60)
  mins = mins - hrs * 60
  
  // over an hour ago?
  if (hrs != 0) {
    if (hrs == 1) {
      str += "1 Hr"
    } else { 
      str += `${hrs} Hrs`
    }

    if (mins == 0) {
      return str += " ago"
    } else {
      str += " and"
    }
  }

  // Minute string handling
  if (mins != 1) {
    str += ` ${mins} minutes`
  } else {
    str += ` ${mins} minute`
  }

  str += " ago"

  return str
}


// reducer for controlling what bird data is shown in the flat list
function birdsReducer(state = baseState, action: any) {
    switch (action.type) {
      case actions.UpdateList:
        
        // if we got a NaN value we can just return current state
        if (isNaN(action.payload.value)) {
          return state;
        }

        // creating a copy of the current state so we can access the current list of birds
        var stateCpy = Object.assign({}, state)
        var bList = stateCpy.birds
        
        

        // iterating over the list
        bList.forEach((bird, idx) => {
          // if the payload bird is in the list, we will update the value
          if (bird.charUUID == action.payload.char) {
           
            let birdCopy = Object.assign({}, bird)
            birdCopy.lastHeard = HandleTime(action.payload.value)
            
            birdCopy.id = uuid.v4().toString()
            bList[idx] = birdCopy
          } 
          
        })
          
        
        return (
          Object.assign({}, state, {
            birds: bList,
          })
        );

      default:
        return state;
    }
}

// handles refreshing the flatlist
// extraData has to be toggled for the item to be refreshed properly
function refreshReducer(state = baseListState, action: any) {
  switch (action.type) {
    case actions.RefreshList:
      var copyState = Object.assign({}, state)
     
      // toggle state to refresh
      return {
        ...state,
        toggle: !copyState.toggle
      }
    default:
      return state
  }
}

// reducer for ble modal
function modalReducer(state = baseModal, action: any) {
  
  switch (action.type) {
    // opening and closing the modal
    case actions.ToggleModal:
      if (state.toggle) {
        return {
          ...state,
          show: action.payload,
          devices: [],
        }
      }
      return {
        ...state,
        show: action.payload
      }

    // add ble device to list
    case actions.AddDevice:

      if (action.payload.name == null) {
        
        return state
      }

      
      let curState = Object.assign({}, state)
      let curList =[...curState.devices]
      var tog = curState.toggle


      // if it is already there we don't need to add it
      if (curList.some(e => e.id === action.payload.id)) {
        
        return state
      }

      
      curList.push(action.payload)

      console.log(curList.forEach((device) => {device.name} ))
      return {
        ...state,
        devices: curList,
        toggle: !tog
      }
    

    case actions.Connected:
      return {
        ...state,
        connected: action.payload
      } 
      
    default:
      return state
  }
}

 
const rootReducer = combineReducers({
    birdsReducer,
    refreshReducer,
    modalReducer,
});

export type RootState = ReturnType<typeof rootReducer>

export const Store = createStore(rootReducer);