import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import BluetoothScreen from '../screens/BluetoothScreen';
import DeviceScreen from '../screens/DeviceScreen';
import { theme } from '../styles/theme';
import { Appbar } from 'react-native-paper';

const HomeStack = createStackNavigator();

function HomeStackScreen() {
    return (
        <HomeStack.Navigator
            screenOptions={{
                header: (props) => <CustomNavigationBar {...props} />,
            }}
        >
            <HomeStack.Screen name="Home" component={HomeScreen} />
        </HomeStack.Navigator>
    );
}

const BluetoothStack = createStackNavigator();

function BlueToothStackScreen() {
    return (
        <BluetoothStack.Navigator
            screenOptions={{
                headerMode: 'screen',
                header: (props) => <CustomNavigationBar {...props} />,
            }}
        >
            <BluetoothStack.Screen name="Bluetooth" component={BluetoothScreen} />
            <BluetoothStack.Screen name="Devices" component={DeviceScreen} />
        </BluetoothStack.Navigator>
    );
}

function CustomNavigationBar({ route, navigation, back }) {
    const title = route.name;
    return (
        <Appbar.Header mode="center-aligned" elevated={true} statusBarHeight={0}>
            {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title={title} />
        </Appbar.Header>
    );
}

const Tab = createMaterialBottomTabNavigator();

function TabStack() {
    return (
        <NavigationContainer theme={theme}>
            <Tab.Navigator>
                <Tab.Screen
                    name="Speedometer"
                    component={HomeStackScreen}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: () => {
                            return <Icon name="speedometer" size={24} />;
                        },
                        tabBarColor: theme.colors.tabs[0],
                    }}
                />
                <Tab.Screen
                    name="BLE"
                    component={BlueToothStackScreen}
                    options={{
                        tabBarLabel: 'Connect',
                        tabBarIcon: () => {
                            return <Icon name="bluetooth" size={24} />;
                        },
                        tabBarColor: theme.colors.tabs[1],
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default function StackNavigator() {
    return <TabStack />;
}
