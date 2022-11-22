import 'expo-dev-client';
import { Provider as PaperProvider } from 'react-native-paper';
import { DataProvider } from './components/DataContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigator from './navigation/StackNavigator';
import { theme } from './styles/theme';

export default function App() {
    return (
        <PaperProvider theme={theme}>
            <DataProvider>
                <SafeAreaProvider>
                    <StackNavigator />
                </SafeAreaProvider>
            </DataProvider>
        </PaperProvider>
    );
}
