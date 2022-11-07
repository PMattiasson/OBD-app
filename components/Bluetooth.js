// Example from https://github.com/palmmaximilian/ReactNativeArduinoBLE

import React, {useState} from 'react';
import { View, StyleSheet, LogBox, PermissionsAndroid } from 'react-native';
import base64 from 'react-native-base64';
import {BleManager, Device} from 'react-native-ble-plx';
import { Text, Button, Card, Avatar } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { decodePID } from './Decoder';
import { useData, useDataDispatch } from './DataContext';
import Speedometer from './Speedometer';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const BLTManager = new BleManager();

const SERVICE_UUID = '0000FFE0-0000-1000-8000-00805F9B34FB';
const MESSAGE_UUID = '0000FFE1-0000-1000-8000-00805F9B34FB';


export default function Bluetooth() {
  //Is a device connected?
  const [status, setStatus] = useState('waiting');
  const isConnected = status === 'connected';
  const isLoading = status === 'loading';

  //What device is connected?
  const [connectedDevice, setConnectedDevice] = useState();

  const [message, setMessage] = useState();
  const [request, setRequest] = useState();

  const data = useData();
  const dispatch = useDataDispatch();

  const [showDropDown, setShowDropDown] = useState(false);

  const [items, setItems] = useState([
    {label: '0D : Vehicle speed', value: '02 01 0D'},
    {label: '0C : Engine RPM', value: '02 01 0C'}
  ]);
  

  // Scans available BLT Devices and then call connectDevice
  async function scanDevices() {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Permission Localisation Bluetooth',
        message: 'Requirement for Bluetooth',
        buttonNeutral: 'Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    ).then(answere => {
      console.log('Scanning for device');

      BLTManager.startDeviceScan(null, null, (error, scannedDevice) => {
        if (error) {
          console.warn(error);
        }

        if (scannedDevice && scannedDevice.name == 'OBD-BLE') {
          BLTManager.stopDeviceScan();
          connectDevice(scannedDevice);
        }
      });

      // stop scanning devices after 5 seconds
      setTimeout(() => {
        BLTManager.stopDeviceScan();
      }, 5000);
    });
  }

  // handle the device disconnection (poorly)
  async function disconnectDevice() {
    console.log('Disconnecting start');

    if (connectedDevice != null) {
      const isDeviceConnected = await connectedDevice.isConnected();
      if (isDeviceConnected) {
        BLTManager.cancelTransaction('messagetransaction');
        BLTManager.cancelTransaction('nightmodetransaction');

        BLTManager.cancelDeviceConnection(connectedDevice.id).then(() =>
          console.log('DC completed'),
        );
      }

      const connectionStatus = await connectedDevice.isConnected();
      if (!connectionStatus) {
        setStatus('waiting');
      }
    }
  }

  //Connect the device and start monitoring characteristics
  async function connectDevice(device) {
    console.log('connecting to Device:', device.name);

    device
      .connect()
      .then(device => {
        setConnectedDevice(device);
        setStatus('connected');
        return device.discoverAllServicesAndCharacteristics();
      })
      .then(device => {
        //  Set what to do when DC is detected
        BLTManager.onDeviceDisconnected(device.id, (error, device) => {
          console.log('Device DC');
          setStatus('waiting');
        });

        //monitor values and tell what to do when receiving an update
        //Message
        device.monitorCharacteristicForService(
          SERVICE_UUID,
          MESSAGE_UUID,
          (error, characteristic) => {
            if (characteristic?.value != null) {
              setMessage(base64.decode(characteristic?.value));
              let responseObj = decodePID(base64.decode(characteristic?.value));
              handleResponse(responseObj);
              console.log(
                'Response received : ',
                base64.decode(characteristic?.value),
              );
            }
          },
          'messagetransaction',
        );

        console.log('Connection established');
        setStatus('connected');
      });
  }

  async function sendRequest(msg) {
    BLTManager.writeCharacteristicWithResponseForDevice(
      connectedDevice?.id,
      SERVICE_UUID,
      MESSAGE_UUID,
      base64.encode(msg+"\n"),
      //Buffer.from(msg).toString('base64'),
    ).then(characteristic => {
      console.log('Request sent :', base64.decode(characteristic.value));
    });
  }

  function handleResponse(response) {
    if (response.description !== data.description) {
      dispatch({
        type: 'changed',
        description: response.description,
        unit: response.unit,
      })
    }
    dispatch({
      type: 'added',
      value: response.value,
    })
  }

  function ConnectButton() {
    return (
      <Button 
        style={styles.buttonView}
        mode="contained" 
        icon={isLoading ? "refresh" : isConnected ? "bluetooth-off" : "bluetooth"}
        loading={isLoading}
        disabled={isLoading}
        onPress={()=>{
          isConnected ? disconnectDevice() : (scanDevices(), setStatus('loading'));
        }}
        >
        {isConnected ? "Disconnect" : isLoading ? "Connecting": "Connect"}
      </Button>
    );
  }

  function DropDownMenu() {
    return (
      <DropDownPicker
        open={showDropDown}
        value={request}
        items={items}
        placeholder="Select OBD2 request message"
        setOpen={setShowDropDown}
        setValue={setRequest}
        setItems={setItems}
        onSelectItem={(item) => {isConnected && sendRequest(item.value)}}
      />
    );
  }

  return (
    <View style={styles.container}>

      {/* Title */}
      <View style={styles.rowView}>
        <Card.Title
          style={styles.cardView}
          title="On-Board Diagnostics"
          subtitle="A BLE Example"
          titleVariant='titleLarge'
          titleStyle={styles.titleText}
          subtitleStyle={styles.baseText}
          left={(props) => <Avatar.Icon {...props} icon="engine" />}
        />
      </View>

      <View style={{paddingBottom: 50}}></View>

      {/* Connect Button */}
      <ConnectButton/>

      <View style={{paddingBottom: 20}}></View>

      {/* Request Input */}
      <View style={styles.rowView}>
        <DropDownMenu/>
      </View>

      <View style={{paddingBottom: 20}}></View>

      {/* Monitored Value */}
      <View style={styles.rowView}>
        <Text style={styles.baseText}>Response: {message}</Text>
      </View>

      <View style={{paddingBottom: 20}}></View>

      {/* Decoded Value */}
      <View style={styles.rowView}>
        { data.value !== null && <Text style={styles.titleText}>{data.description}: {data.value} {data.unit}</Text> }
      </View>

      <View style={{paddingBottom: 20}}></View>

      <View style={styles.containerBottom}>
        { data.description === 'Vehicle speed' && <Speedometer speed={data.value}/> }
      </View>

    </View>
  );
}

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 16
  },
  containerBottom: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  baseText: {
    fontSize: 15,
    fontFamily: 'Cochin',
    color: 'black'
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  },
  rowView: {
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  containerInner: {
    height: 60,
    width: '100%',
    marginBottom: 16
  },
  buttonView: {
    width: '50%',
  },
  cardView: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'darkgray',
  }

});
