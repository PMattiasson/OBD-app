import React, { useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import Cookies from './Components/Cookies';

export default function App() {
  return (
    <PaperProvider>
      <Cookies/>
    </PaperProvider>
  );
}


