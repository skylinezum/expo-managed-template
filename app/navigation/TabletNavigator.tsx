import * as React from 'react';
import { StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Routes } from '../Routes';
import { TestScreen } from '../screens/TestScreen';

const DrawerNav = createDrawerNavigator();

export function TabletNavigator({ navigation, route }) {
	return (
		<DrawerNav.Navigator drawerType='permanent' drawerStyle={styles.drawer}>
			<DrawerNav.Screen name={Routes.HOME_A} component={TestScreen} />
			<DrawerNav.Screen name={Routes.HOME_B} component={TestScreen} />
		</DrawerNav.Navigator>
	);
}

const styles = StyleSheet.create({
	drawer: {
		width: 200,
	},
});
