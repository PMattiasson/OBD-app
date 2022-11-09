import 'expo-dev-client';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigator from './navigation/StackNavigator';
import { theme } from './theme/styles';

export default function App() {
    return (
        <PaperProvider theme={theme}>
            <SafeAreaProvider>
                <StackNavigator />
            </SafeAreaProvider>
        </PaperProvider>
    );
}
