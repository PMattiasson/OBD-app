import 'expo-dev-client';
import { useCallback, useMemo, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { BluetoothProvider } from './context/BluetoothContext';
import { DataProvider } from './context/DataContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigator from './navigation/StackNavigator';
import BluetoothManager from './components/BluetoothManager';
import { CombinedDefaultTheme, CombinedDarkTheme } from './styles/theme';
import { SettingsProvider } from './context/SettingsContext';
import ThemeContext from './context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

export default function App() {
    const [isThemeDark, setIsThemeDark] = useState(false);

    let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

    const toggleTheme = useCallback(() => {
        return setIsThemeDark(!isThemeDark);
    }, [isThemeDark]);

    const preferences = useMemo(
        () => ({
            toggleTheme,
            isThemeDark,
        }),
        [toggleTheme, isThemeDark],
    );

    return (
        <ThemeContext.Provider value={preferences}>
            <SettingsProvider>
                <PaperProvider theme={theme}>
                    <BluetoothProvider>
                        <DataProvider>
                            <SafeAreaProvider>
                                <StatusBar style={isThemeDark ? 'light' : 'dark'} />
                                <StackNavigator theme={theme} />
                                <BluetoothManager />
                            </SafeAreaProvider>
                        </DataProvider>
                    </BluetoothProvider>
                </PaperProvider>
            </SettingsProvider>
        </ThemeContext.Provider>
    );
}
