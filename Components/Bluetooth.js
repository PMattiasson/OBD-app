// Example from https://github.com/palmmaximilian/ReactNativeArduinoBLE

import React, {useState} from 'react';
import { TouchableOpacity, View } from 'react-native';
import {LogBox, StyleSheet} from 'react-native';
import base64 from 'react-native-base64';
import {BleManager, Device} from 'react-native-ble-plx';
import { Text, Button, TextInput, Card, Avatar, TouchableRipple } from 'react-native-paper';
import { Buffer } from 'buffer';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const BLTManager = new BleManager();

const SERVICE_UUID = '0000FFE0-0000-1000-8000-00805F9B34FB';
const MESSAGE_UUID = '0000FFE1-0000-1000-8000-00805F9B34FB';


export default function Bluetooth() {
  //Is a device connected?
  const [isConnected, setIsConnected] = useState(false);

  //What device is connected?
  const [connectedDevice, setConnectedDevice] = useState();

  const [message, setMessage] = useState();
  const [request, setRequest] = useState('02010C');
  const [reply, setReply] = useState();
  const [isloading, setLoading] = useState(false);
  

  // Scans availbale BLT Devices and then call connectDevice
  async function scanDevices() {
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
      setLoading(false);
    }, 5000);
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
        setIsConnected(false);
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
        setIsConnected(true);
        return device.discoverAllServicesAndCharacteristics();
      })
      .then(device => {
        //  Set what to do when DC is detected
        BLTManager.onDeviceDisconnected(device.id, (error, device) => {
          console.log('Device DC');
          setIsConnected(false);
        });

        //monitor values and tell what to do when receiving an update
        //Message
        device.monitorCharacteristicForService(
          SERVICE_UUID,
          MESSAGE_UUID,
          (error, characteristic) => {
            if (characteristic?.value != null) {
              setMessage(base64.decode(characteristic?.value));
              setReply(convertPID(base64.decode(characteristic?.value)));
              console.log(
                'Response received : ',
                base64.decode(characteristic?.value),
              );
            }
          },
          'messagetransaction',
        );

        console.log('Connection established');
        setLoading(false);
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

  const modeCurrentData = '01';
  const responsePIDs = [
      { description: 'Engine RPM', PID: '0C', mode: modeCurrentData, bytes: 2, unit: 'rpm', scale: 0.25, offset: 0, min: 0, max: 16384, value: 0},
      { description: 'Vehicle speed', PID: '0D', mode: modeCurrentData, bytes: 1, unit: 'km/h', scale: 1, offset: 0, min: 0, max: 255, value: 0},
  ]

  function convertPID(hexString) {
    const messageResponse = {
        bytes: 0,
        mode: '01',
        PID: '00',
        data: {
            A: '00',
            B: '00',
            C: '00',
            D: '00',
        },
        undf: '00'
    };
    let hexBytes = [];

    // Remove spaces from hexadecimal string
    hexString = hexString.replace(/\s/g, '');

    // Split the hexadecimal string into individual bytes
    for (let i = 0; i < hexString.length; i += 2) {
        hexBytes.push(hexString.substring(i, i+2));
    }
    // Assign the corresponding bytes
    messageResponse.bytes = parseInt(hexBytes[0], 10);
    messageResponse.mode = hexBytes[1];
    messageResponse.PID = hexBytes[2];

    // Assign A, B, C, D
    Object.keys(messageResponse.data).map((key, i)=>{
        messageResponse.data[key] = hexBytes[i+3];
    })

    // Find the corresponding response PID object
    let response = responsePIDs.find(obj => obj.PID === messageResponse.PID);
    if (response == undefined) {
        return null;
    }

    // Get decimal value from message
    let hexValueString = Object.entries(messageResponse.data)
        .slice(0, response.bytes)
        .map(entry => entry[1])
        .join('');
    let value = parseInt(hexValueString, 16);

    // Calculate message value from formula
    response.value = convertFormula(response, value);
    return response;
  }

  function convertFormula(objResponse, decValue) {
      let result = objResponse.offset + objResponse.scale * decValue;
      return result;
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
      <Button 
        style={styles.buttonView}
        mode="contained" 
        icon={isloading ? "refresh" : isConnected ? "bluetooth-off" : "bluetooth"}
        loading={isloading}
        disabled={isloading}
        onPress={()=>{
          isConnected ? disconnectDevice() : (scanDevices(), setLoading(true));
        }}
        >
        {isConnected ? "Disconnect" : "Connect"}
      </Button>

      <View style={{paddingBottom: 20}}></View>

      {/* Test Input */}
      <View style={styles.containerInner}>
        <TextInput
            mode='flat'
            label='OBD2 message'
            value={request}
            onChangeText={request => setRequest(request)}
        />
      </View>

      {/* Request Button */}
      <Button 
          style={styles.buttonView} 
          mode="outlined" 
          disabled={!isConnected}
          icon={"message-arrow-right"}
          onPress={()=>sendRequest(request)}>
          Send Request
      </Button>

      <View style={{paddingBottom: 20}}></View>

      {/* Monitored Value */}
      <View style={styles.rowView}>
        <Text style={styles.baseText}>Response: {message}</Text>
      </View>

      <View style={{paddingBottom: 20}}></View>

      {/* Decoded Value */}
      <View style={styles.rowView}>
        {reply && <Text style={styles.titleText}>{reply.description}: {reply.value} {reply.unit}</Text>}
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
    padding: 16
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
