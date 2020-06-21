import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Routes } from '../Routes';
import { TestScreen } from '../screens/TestScreen';

const BottomTab = createBottomTabNavigator();

export function MobileNavigator({ navigation, route }) {
	return (
		<BottomTab.Navigator>
			<BottomTab.Screen name={Routes.HOME_A} component={TestScreen} />
			<BottomTab.Screen name={Routes.HOME_B} component={TestScreen} />
		</BottomTab.Navigator>
	);
}
