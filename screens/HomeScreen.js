import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Text, Button, Switch, Card, Avatar } from 'react-native-paper';
import { styles } from '../styles/styles';
import Speedometer from '../components/Speedometer';
import { useData } from '../components/DataContext';

export default function DataScreen() {
    const data = useData();
    const [togglePostData, setTogglePostData] = useState(false);
    const onToggleSwitch = () => setTogglePostData(!togglePostData);

    const apiURL = process.env.URL;

    useEffect(() => {
        const postData = async () => {
            const response = await fetch(apiURL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: `${data.description}: ${data.value} ${data.unit}` }),
            }).catch((error) => console.log(error));
            const text = await response.text();
            return text;
        };

        // let interval;
        // if (data.value && togglePostData) {
        //     interval = setInterval(() => {
        //         postData().then((res) => console.log('Server response: ', res));
        //     }, 5000);
        // }
        if (togglePostData) {
            postData();
            // postData().then((res) => console.log('Server response: ', res));
        }

        // return () => clearInterval(interval);
    }, [data.value, data.description, data.unit, togglePostData, apiURL]);

    return (
        <View style={styles.container.base}>
            <View style={{ alignItems: 'center' }}>
                <Card.Title
                    style={styles.card.home}
                    title="On-Board Diagnostics"
                    subtitle="Project in Embedded Systems"
                    titleVariant="titleLarge"
                    titleStyle={styles.titleText}
                    subtitleStyle={styles.baseText}
                    left={(props) => <Avatar.Icon {...props} icon="engine" />}
                />
                <View style={styles.item.switch}>
                    <Text>Toggle post API</Text>
                    <Switch value={togglePostData} onValueChange={onToggleSwitch} />
                </View>
            </View>
            <View style={styles.container.center}>
                <View style={styles.item.row}>
                    {data.value !== null && (
                        <Text style={styles.text.title}>
                            {data.description}: {data.value} {data.unit}
                        </Text>
                    )}
                </View>
            </View>
            <Speedometer speedKPH={data?.value} />
        </View>
    );
}
