import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';

const OBD = () => {
    const modeCurrentData = '01';
    const responsePIDs = [
        { description: 'Engine RPM', PID: '0C', mode: modeCurrentData, bytes: 2, unit: 'rpm', scale: 0.25, offset: 0, min: 0, max: 16384, value: 0},
        { description: 'Vehicle speed', PID: '0D', mode: modeCurrentData, bytes: 1, unit: 'km/h', scale: 1, offset: 0, min: 0, max: 255, value: 0},
    ]

    const [message, setMessage] = useState('04 41 0C B2 54 AA AA AA');
    const [reply, setReply] = useState(null); 

    return (
        <View style={styles.container}>
            <View style={styles.containerInner}>
                <TextInput
                    mode='outlined'
                    label='OBD2 message'
                    value={message}
                    onChangeText={message => setMessage(message)}
                />
            </View>

            <Button 
                style={styles.heading} 
                mode="outlined" 
                onPress={()=>setReply(convertPID(message))}>
                Press to test
            </Button>
            
            {reply && <Text style={styles.heading} variant="titleMedium">{reply.description}: {reply.value} {reply.unit}</Text>}

        </View>
    )


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

        // Assign A, B, C, D. Ugly solution below, plz fix
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
}

const styles = StyleSheet.create({
    heading: {
        marginBottom: 16
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 16
    },
    containerInner: {
        height: 60,
        marginBottom: 16
    }
  });

  export default OBD;
