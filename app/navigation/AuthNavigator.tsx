import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from '../Routes';
import { TestAuthScreen } from '../screens/TestScreen';

const Stack = createStackNavigator();

export function AuthNavigator() {
	return (
		<Stack.Navigator>
			<Stack.Screen name={Routes.AUTH} component={TestAuthScreen} />
		</Stack.Navigator>
	);
}
