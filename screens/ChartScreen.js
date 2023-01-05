import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Charts from '../components/Charts';
import { styles } from '../styles/styles';

export default function ChartScreen() {
    return (
        <View style={styles.container.base}>
            <Charts pidName={'engineRPM'} />
        </View>
    );
}
