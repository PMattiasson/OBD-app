import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import BLEScreen from '../screens/BLEScreen';
import { theme } from '../styles/theme';

const Tab = createMaterialBottomTabNavigator();

function TabStack() {
    return (
        <NavigationContainer theme={theme}>
            <Tab.Navigator>
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: () => {
                            return <Icon name="home" size={24} />;
                        },
                        tabBarColor: theme.colors.tabs[0],
                    }}
                />
                <Tab.Screen
                    name="BLE"
                    component={BLEScreen}
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
