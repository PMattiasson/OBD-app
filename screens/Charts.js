import { View, StyleSheet } from 'react-native';
import DataChart from '../components/DataChart';

export default function Chart() {
    return (
        <View style={styles.container}>
            <DataChart/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    },
  });