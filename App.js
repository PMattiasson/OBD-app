import React, { useState } from 'react';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider, BottomNavigation, Text } from 'react-native-paper';
// import OBD from './Components/OBD';
import Bluetooth from './components/Bluetooth';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  version: 3,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    secondary: '#f1c40f',
    tertiary: '#a1b2c3'
  },
};

const ConnectRoute = () => <Bluetooth/>;
const ChartRoute = () => <Text>Charts</Text>;
const TableRoute = () => <Text>Tables</Text>;

export default function App() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'connect', title: 'Connect', focusedIcon: 'bluetooth'},
    { key: 'chart', title: 'Charts', focusedIcon: 'chart-line'},
    { key: 'table', title: 'Table', focusedIcon: 'table'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    connect: ConnectRoute,
    chart: ChartRoute,
    table: TableRoute,
  });

  return (
    <PaperProvider theme={theme}>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </PaperProvider>
  );
}


