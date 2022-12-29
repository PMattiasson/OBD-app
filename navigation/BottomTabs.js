import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import BluetoothScreen from '../screens/BluetoothScreen';
import SettingsScreen from '../screens/SettingsScreens';
import { useTheme } from 'react-native-paper';
import MapScreen from '../screens/MapScreen';
import ChartScreen from '../screens/ChartScreen';

const Tab = createMaterialBottomTabNavigator();

export default function BottomTabs() {
    const theme = useTheme();
    return (
        <Tab.Navigator
            activeColor={theme.colors.primary}
            barStyle={{ backgroundColor: theme.colors.elevation.level1 }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: 'speedometer',
                }}
            />
            <Tab.Screen
                name="Bluetooth"
                component={BluetoothScreen}
                options={{
                    tabBarLabel: 'Connect',
                    tabBarIcon: 'bluetooth',
                }}
            />
            <Tab.Screen
                name="Maps"
                component={MapScreen}
                options={{
                    tabBarLabel: 'Maps',
                    tabBarIcon: 'map-outline',
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarLabel: 'Settings',
                    tabBarIcon: 'cog',
                }}
            />
        </Tab.Navigator>
    );
}
