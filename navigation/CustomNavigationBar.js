import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useState } from 'react';
import { Appbar, Menu } from 'react-native-paper';

export default function CustomNavigationBar({ route, navigation, back }) {
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const title = getHeaderTitle(route);

    return (
        <Appbar.Header
            style={{ elevation: 10 }}
            // mode="center-aligned"
            // statusBarHeight={0}
        >
            {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title={title} />
            {title !== 'Settings' && title !== 'Devices' && (
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={<Appbar.Action icon={'dots-vertical'} onPress={openMenu} />}
                >
                    <Menu.Item
                        onPress={() => {
                            closeMenu();
                            navigation.navigate('Settings');
                        }}
                        title="Settings"
                    />
                    <Menu.Item
                        onPress={() => {
                            closeMenu();
                            navigation.navigate('About');
                        }}
                        title="About"
                    />
                </Menu>
            )}
        </Appbar.Header>
    );
}

function getHeaderTitle(route) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? route.name;

    switch (routeName) {
    case 'Root':
        return 'Home';
    default:
        return routeName;
    }
}
