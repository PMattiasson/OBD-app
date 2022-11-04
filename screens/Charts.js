import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useData } from '../components/DataContext';
import DataChart from '../components/DataChart';

export default function Chart() {
  const data = useData();
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{data.description}</Text>
      <DataChart data={data}/>
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
});