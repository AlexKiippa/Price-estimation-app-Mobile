// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CameraScreen from './components/CameraScreen.js';
import ImageRecognitionScreen from './components/ImageRecognitionScreen.js';
import ConditionScreen from './components/ConditionScreen.js'; 
import ResultScreen from './components/ResultsScreen.js';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Camera">
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="ImageRecognition" component={ImageRecognitionScreen} />
        <Stack.Screen name="ConditionScreen" component={ConditionScreen} /> 
        <Stack.Screen name="ResultScreen" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
