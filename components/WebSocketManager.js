import { useCallback, useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useData } from '../context/DataContext';
import useInterval from '../hooks/useInterval';
import objectMap from '../utils/objectMap';
import { useToast } from '../context/ToastContext';

let wsCurrent = null;

export default function WebSocketManager() {
    const settings = useSettings();
    const data = useData();
    const { dispatch: toast } = useToast();
    let ws = useRef(null);
    let connected = useRef(false);
    let authorized = useRef(false);

    const sendData = useCallback(() => {
        try {
            if (Object.keys(data).length == 0 || connected.current === false) return;

            let dataSnippet = objectMap(data, (val) => {
                return val.value;
            });
            dataSnippet = { ...dataSnippet, timestamp: Date.now() };
            const message = JSON.stringify(dataSnippet);
            ws.current.send(message);
        } catch (e) {
            console.log('WebSocket error:', e);
        }
    }, [data]);

    // Auth to server
    useEffect(() => {
        async function authorize() {
            const httpURL = settings.server.apiURL;
            const username = settings.server.username;
            const password = settings.server.password;

            return fetch(`${httpURL}login`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            })
                .then((response) => response.text())
                .then((responseData) => {
                    console.log(responseData);
                    const data = JSON.parse(responseData);
                    if (data.result === 'OK') return true;
                    else return false;
                })
                .catch((error) => console.log(error));
        }

        authorize().then((auth) => {
            if (auth) {
                console.log('Authorized to server');
                authorized.current = auth;
            } else {
                console.log('Failed to authorize to server');
                toast({
                    type: 'open',
                    message: 'Failed to authorize to server',
                    toastType: 'error',
                });
            }
        });
    }, [settings.server.apiURL, settings.server.username, settings.server.password]);

    // Connection to server WebSocket
    useEffect(() => {
        const httpURL = settings.server.apiURL;

        if (settings.server.toggleUpload && authorized.current) {
            connect();
            return () => disconnect();
        }

        async function connect() {
            try {
                ws.current = new WebSocket(httpURL);

                ws.current.onopen = () => {
                    connected.current = true;
                    console.log('ws opened');
                    toast({
                        type: 'open',
                        message: 'Connected to server WebSocket',
                        toastType: 'success',
                    });
                };

                ws.onmessage = (event) => {
                    // a message was received
                    console.log(event.data);
                };

                ws.current.onclose = (event) => {
                    console.log('ws closed', event);

                    if (event?.code === 1000) {
                        toast({
                            type: 'open',
                            message: 'Disconnected from server WebSocket',
                            toastType: 'success',
                        });
                    } else {
                        if (connected.current) {
                            toast({
                                type: 'open',
                                message: 'Lost connection to server WebSocket',
                                toastType: 'error',
                            });
                        } else {
                            toast({
                                type: 'open',
                                message: 'Could not connect to server WebSocket',
                                toastType: 'error',
                            });
                        }
                        setTimeout(() => settings.server.toggleUpload && connect(), 5000);
                    }

                    connected.current = false;
                };

                ws.onerror = (event) => {
                    // an error occurred
                    console.log(event.message);
                };

                wsCurrent = ws.current;
            } catch (e) {
                console.log(e);
            }
        }

        function disconnect() {
            wsCurrent?.close();
            fetch(`${httpURL}logout`, { method: 'DELETE' });
        }
    }, [settings.server.apiURL, settings.server.toggleUpload]);

    // Send data to server with interval
    useInterval(sendData, settings.server.toggleUpload ? settings.server.uploadFrequency : null);

    // Send data to server on data update
    useEffect(() => {
        if (settings.server.toggleUpload && settings.server.uploadFrequency === null) {
            sendData();
        }
    }, [sendData, settings.server.toggleUpload, settings.server.uploadFrequency]);
}
