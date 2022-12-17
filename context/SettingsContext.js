import { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeContext from './ThemeContext';

const SettingsContext = createContext(null);

const SettingsDispatchContext = createContext(null);

export function SettingsProvider({ children }) {
    const [settings, dispatch] = useReducer(settingsReducer, {});
    const { toggleTheme } = useContext(ThemeContext);

    // Load inital state
    useEffect(() => {
        (async () => {
            const initSettings = await getSettings();
            dispatch({ type: 'ADD', settings: initSettings });
            initSettings.theme.darkMode && toggleTheme();
        })();
    }, []);

    // Update AsyncStorage when settings is updated
    useEffect(() => {
        if (settings) {
            AsyncStorage.setItem('@storage_Key', JSON.stringify(settings));
        }
    }, [settings]);

    return (
        <SettingsContext.Provider value={settings}>
            <SettingsDispatchContext.Provider value={dispatch}>
                {children}
            </SettingsDispatchContext.Provider>
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}

export function useSettingsDispatch() {
    return useContext(SettingsDispatchContext);
}

function settingsReducer(settings, action) {
    const object = action?.object;
    const property = action?.property;

    switch (action.type) {
    case 'ADD': {
        return action.settings;
    }
    case 'SET': {
        return {
            ...settings,
            [object]: { ...settings[object], [property]: action.value },
        };
    }
    case 'TOGGLE': {
        return {
            ...settings,
            [object]: { ...settings[object], [property]: !settings[object][property] },
        };
    }
    default: {
        throw Error('Unknown action: ' + action.type);
    }
    }
}

async function getSettings() {
    try {
        const jsonValue = await AsyncStorage.getItem('@storage_Key');
        let value = jsonValue != null ? JSON.parse(jsonValue) : defaultSettings;
        value = { ...defaultSettings, ...value };
        // console.log(value);
        return value;
    } catch (error) {
        console.log(error);
    }
}

const defaultSettings = {
    bluetooth: {
        deviceName: undefined,
        autoConnect: false,
        updateFrequency: 1000,
        protocol: true,
    },
    server: {
        apiURL: undefined,
        toggleUpload: false,
        uploadFrequency: 1000,
        packetSize: 1,
    },
    theme: {
        darkMode: false,
    },
    maps: {
        toggleGPS: false,
    },
    debug: {
        toggleSimulation: false,
    },
};
