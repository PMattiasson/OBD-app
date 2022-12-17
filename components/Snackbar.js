// https://snack.expo.dev/@macfanatic/react-native-paper-snackbar-provider

import { useEffect, useState } from 'react';
import { Snackbar, Text } from 'react-native-paper';

import { useToast } from '../context/ToastContext';

const SnackBar = () => {
    const { toast, dispatch } = useToast();
    const [toastStyle, setToastStyle] = useState({
        backgroundColor: 'blue',
    });

    useEffect(() => {
        switch ((!!toast && toast.toastType) || 'default') {
        case 'info':
            setToastStyle({
                backgroundColor: 'blue',
            });
            break;
        case 'error':
            setToastStyle({
                backgroundColor: 'red',
            });
            break;
        case 'success':
            setToastStyle({
                backgroundColor: 'green',
            });
            break;
        default:
            setToastStyle({
                backgroundColor: 'purple',
            });
        }
    }, [toast]);

    const closeMe = () => {
        dispatch({ type: 'close' });
    };

    return (
        <>
            {!!toast && toast.open && (
                <Snackbar
                    style={[toastStyle, { height: 60, borderRadius: 10 }]}
                    wrapperStyle={{ top: 40 }}
                    visible
                    onDismiss={closeMe}
                    action={{
                        label: 'Ok',
                        onPress: closeMe,
                        textColor: 'white',
                    }}
                >
                    <Text style={{ color: 'white' }}>{!!toast && toast.message}</Text>
                </Snackbar>
            )}
        </>
    );
};

export default SnackBar;
