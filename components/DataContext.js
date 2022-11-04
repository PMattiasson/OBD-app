/* 
Reducer:
State
- Object information
- Data array
Dispatch
- Current value
- Data array
- String
- Add new item
- Remove first item 
*/

// Context wrapper for components that need the data

import { createContext, useContext, useReducer } from 'react';

export const DataContext = createContext(null);
export const DataDispatchContext = createContext(null);

export function DataProvider({ children }) {
  const [data, dispatch] = useReducer(dataReducer, initialData);

  return (
    <DataContext.Provider value={data}>
      <DataDispatchContext.Provider value={dispatch}>
        {children}
      </DataDispatchContext.Provider>
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}

export function useDataDispatch() {
  return useContext(DataDispatchContext);
}

function dataReducer(data, action) {
  switch (action.type) {
    case 'added': {
      return {
        ...data,
        value: action.value,
        arr: [...data.arr, action.value]
        // Add length limit
      };
    }
    case 'changed': {
      return {
        ...data,
        description: action.description,
        unit: action.unit,
      }
    }
    case 'deleted': {
      return data.arr.filter((_, i) => i !== 0);
    }
    case 'reset': {
      return { ...initialData };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialData = {
   description: '', unit: '', value: null, arr: []
};