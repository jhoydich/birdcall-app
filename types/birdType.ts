import uuid from 'react-native-uuid';

// individual bird interface
export interface indBird {
    id: string;
    name: string;
    sciName: string;
    lastHeard: string;
    img: any;
    call: NodeRequire;
    serviceUUID: string;
    charUUID: string;
    found: boolean;
}

export interface birdState {
    birds: indBird[];
}

export interface listState {
    toggle: boolean
}

// base state for refreshReducer
export var baseListState: listState = {
    toggle: false,
}

// base state for birdsReducer
export var baseState: birdState =  {
    birds: [
        {
            id: uuid.v4().toString(),
            name: "Northern Cardinal",
            sciName: "Cardinalis Cardinalis",
            lastHeard: "",
            found: false,
            img: require("./../assets/imgs/cardinal.jpg"),
            call: require("./../assets/cardinal.wav"),
            serviceUUID: "49ac9053-75f7-4d14-b75f-19b391fbe0eb",
            charUUID: "19b10001-e8f2-537e-4f6c-d104768a1214",
        }
    ]
};

// payload for action UpdateList
export interface CharValue {
    char: string;
    value: number;
}


// static list that includes all of the birds of interest
export const birdList: indBird[] =
     [
        {
            id: uuid.v4().toString(),
            name: "Northern Cardinal",
            sciName: "Cardinalis Cardinalis",
            lastHeard: "1 minute ago",
            found: true,
            img: require("./../assets/imgs/cardinal.jpg"),
            call: require("./../assets/cardinal.wav"),
            serviceUUID: "49ac9053-75f7-4d14-b75f-19b391fbe0eb",
            charUUID: "19b10001-e8f2-537e-4f6c-d104768a1214",
        }
        
    ]
