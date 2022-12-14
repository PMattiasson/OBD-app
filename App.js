import 'expo-dev-client';
import { useCallback, useMemo, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { BluetoothProvider } from './context/BluetoothContext';
import { DataProvider } from './context/DataContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigator from './navigation/StackNavigator';
import BluetoothManager from './components/BluetoothManager';
import { MyLightTheme, MyDarkTheme } from './styles/theme';
import { SettingsProvider } from './context/SettingsContext';
import ThemeContext from './context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { ToastProvider } from './context/ToastContext';
import SnackBar from './components/Snackbar';
import WebSocketManager from './components/WebSocketManager';
import LocationManager from './components/LocationManager';

export default function App() {
    const [isThemeDark, setIsThemeDark] = useState(false);

    let theme = isThemeDark ? MyDarkTheme : MyLightTheme;

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
                            <ToastProvider>
                                <SafeAreaProvider>
                                    <StatusBar style={isThemeDark ? 'light' : 'dark'} />
                                    <StackNavigator theme={theme} />
                                    <BluetoothManager />
                                    <WebSocketManager />
                                    <LocationManager />
                                    <SnackBar />
                                </SafeAreaProvider>
                            </ToastProvider>
                        </DataProvider>
                    </BluetoothProvider>
                </PaperProvider>
            </SettingsProvider>
        </ThemeContext.Provider>
    );
}
