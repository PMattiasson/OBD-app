import React, { useReducer, createContext, useContext } from 'react';

const initialState = {
    type: 'close',
    open: false,
    toastType: 'info',
};

function reducer(state, action) {
    switch (action.type) {
    case 'close': {
        return {
            ...initialState,
        };
    }
    case 'open': {
        return {
            ...state,
            open: true,
            toastType: action.toastType,
            message: action.message,
        };
    }
    default:
        throw new Error(`unknown action from state: ${JSON.stringify(action)}`);
    }
}

export const ToastContext = createContext(null);

/**
 * Wrapper to use in App.tsx providing the value to all children
 */
export function ToastProvider({ children }) {
    const [toast, dispatch] = useReducer(reducer, initialState);

    return <ToastContext.Provider value={{ toast, dispatch }}>{children}</ToastContext.Provider>;
}

/**
 * Hook to access the context easily
 */
export function useToast() {
    return useContext(ToastContext);
}
