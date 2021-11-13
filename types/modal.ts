import { Device } from "react-native-ble-plx";

export interface modalType {
    show: boolean
    devices: Array<Device>
    toggle: boolean
};

export var baseModal: modalType = {
    show: false,
    devices: [],
    toggle: false,
};