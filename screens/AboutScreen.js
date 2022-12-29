import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import { styles } from '../styles/styles';

function CreditName({ children }) {
    return (
        <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
            {children}
        </Text>
    );
}

function CreditTitle({ children }) {
    return (
        <Text variant="titleLarge" style={{ textAlign: 'center' }}>
            {children}
        </Text>
    );
}

export default function AboutScreen() {
    return (
        <ScrollView style={[styles.container.base, { padding: 15 }]}>
            <Text variant="bodyLarge">
                On-board diagnostics (OBD) project with app, web server, reader with Bluetooth and
                simulator.
            </Text>
            <Text />
            <Text variant="bodyLarge">
                Created during Open Advanced Course in Embedded Systems, 5 credits and Project in
                Embedded Systems, 15 credits on Uppsala university HT-2022.
            </Text>
            <Text></Text>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Text variant="headlineLarge" style={{ textAlign: 'center' }}>
                    Credits
                </Text>
                <Text />
                <CreditTitle>React Native app and Node server</CreditTitle>
                <CreditName>Per Mattiasson</CreditName>
                <Text />
                <CreditTitle>OBD-II reader Arduino code</CreditTitle>
                <CreditName>Alexander Söderlund</CreditName>
                <CreditName>Per Mattiasson</CreditName>
                <Text />
                <CreditTitle>OBD-II reader and simulator hardware</CreditTitle>
                <CreditName>Alexander Söderlund</CreditName>
                <CreditName>Anton Lind</CreditName>
                <CreditName>Oscar Magnér</CreditName>
                <Text />
                <CreditTitle>OBD-II reader PCB design</CreditTitle>
                <CreditName>Anton Lind</CreditName>
                <Text />
                <CreditTitle>Supervisor</CreditTitle>
                <CreditName>Ping Wu</CreditName>
            </View>
        </ScrollView>
    );
}
