import 'expo-dev-client';
import { Provider as PaperProvider } from 'react-native-paper';
import { BluetoothProvider } from './context/BluetoothContext';
import { DataProvider } from './components/DataContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigator from './navigation/StackNavigator';
import BluetoothManager from './components/BluetoothManager';
import { theme } from './styles/theme';

export default function App() {
    return (
        <PaperProvider theme={theme}>
            <BluetoothProvider>
                <DataProvider>
                    <SafeAreaProvider>
                        <StackNavigator />
                        <BluetoothManager />
                    </SafeAreaProvider>
                </DataProvider>
            </BluetoothProvider>
        </PaperProvider>
    );
}
