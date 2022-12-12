import 'expo-dev-client';
import { Provider as PaperProvider } from 'react-native-paper';
import { BluetoothProvider } from './context/BluetoothContext';
import { DataProvider } from './context/DataContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigator from './navigation/StackNavigator';
import BluetoothManager from './components/BluetoothManager';
import { theme } from './styles/theme';
import { SettingsProvider } from './context/SettingsContext';

export default function App() {
    return (
        <PaperProvider theme={theme}>
            <SettingsProvider>
                <BluetoothProvider>
                    <DataProvider>
                        <SafeAreaProvider>
                            <StackNavigator />
                            <BluetoothManager />
                        </SafeAreaProvider>
                    </DataProvider>
                </BluetoothProvider>
            </SettingsProvider>
        </PaperProvider>
    );
}
