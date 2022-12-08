import { getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import BluetoothScreen from '../screens/BluetoothScreen';
import DeviceScreen from '../screens/DeviceScreen';
import SettingsScreen from '../screens/SettingsScreens';
import { theme } from '../styles/theme';
import CustomNavigationBar from './CustomNavigationBar';

const NavigationBarOption = {
    headerMode: 'screen',
    header: (props) => <CustomNavigationBar {...props} />,
};

const Tab = createMaterialBottomTabNavigator();

function TabStack() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: () => {
                        return <Icon name="speedometer" size={24} />;
                    },
                    tabBarColor: theme.colors.tabs[0],
                }}
            />
            <Tab.Screen
                name="Bluetooth"
                component={BluetoothScreen}
                options={{
                    tabBarLabel: 'Connect',
                    tabBarIcon: () => {
                        return <Icon name="bluetooth" size={24} />;
                    },
                    tabBarColor: theme.colors.tabs[1],
                }}
            />
        </Tab.Navigator>
    );
}

const Stack = createStackNavigator();

export default function StackNavigator() {
    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator screenOptions={NavigationBarOption}>
                <Stack.Screen name="Root" component={TabStack} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="Devices" component={DeviceScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
