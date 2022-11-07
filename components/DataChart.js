import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';

export default function DataChart(props) {
    const data = props.data.arr;
    const chartData = data.slice(-20);

    const windowWidth = Dimensions.get('window').width;
    if (chartData.length > 0) {
        return (
            <LineChart
                data={{
                    datasets: [
                        {
                            data: chartData
                        }
                    ]
                }}
                width={windowWidth}
                height={220}
                chartConfig={{
                    backgroundColor: '#3498db',
                    backgroundGradientFrom: '#3498db',
                    backgroundGradientTo: '#1788d4',
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
  
                }}
                fromZero
                withVerticalLines={false}
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
        );
    }
    return (
        <View style={styles.rowView}>
            <Text style={styles.baseText}>No chart data!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    baseText: {
        fontSize: 15,
        fontFamily: 'Cochin',
        color: 'black'
    },
    rowView: {
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
});