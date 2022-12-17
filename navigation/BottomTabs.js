import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import BluetoothScreen from '../screens/BluetoothScreen';
import SettingsScreen from '../screens/SettingsScreens';

const Tab = createMaterialBottomTabNavigator();

export default function BottomTabs() {
    return (
        <Tab.Navigator>
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
