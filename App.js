import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useState } from 'react';

export default function App() {
  const [var1, setVar1] = useState(0); 
  return (
    <View style={styles.container}>
      <Text>Cookies: {var1}</Text>
      <Button onPress={()=>{setVar1(var1+1)}} title="Bake a Cookie!"/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
