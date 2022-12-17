import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabs from './BottomTabs';
import DeviceScreen from '../screens/DeviceScreen';
import CustomNavigationBar from './CustomNavigationBar';

const NavigationBarOption = {
    headerMode: 'screen',
    header: (props) => <CustomNavigationBar {...props} />,
};

const Stack = createStackNavigator();

export default function StackNavigator({ theme }) {
    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator screenOptions={NavigationBarOption}>
                <Stack.Screen name="Root" component={BottomTabs} />
                <Stack.Screen name="Devices" component={DeviceScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
