import React, { useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import OBD from './Components/OBD';

export default function App() {
  return (
    <PaperProvider>
      <OBD/>
    </PaperProvider>
  );
}


