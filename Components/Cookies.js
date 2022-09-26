import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { Text, Button } from 'react-native-paper';

const Cookies = () => {
    const [var1, setVar1] = useState(0); 

    const incCookies = (i=1) => {
        setVar1(var1+i)
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading} variant="titleMedium">Cookies: {var1}</Text>
            <Button mode="outlined" onPress={()=>incCookies(5)}>
                Bake a Cookie!
            </Button>
            <StatusBar style="auto" />
        </View>
    )
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
  });

  export default Cookies;