import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

//navigation
import { RouteConfig } from './Routes';
import { MainNavigator } from './navigation/MainNavigator';

/* Necessary for firebase
// Comment: https://github.com/expo/expo/issues/7507#issuecomment-605316962
//Firebase shimming for crypto and atob modules
import { decode, encode } from 'base-64';
global.crypto = require('@firebase/firestore');
global.crypto.getRandomValues = (byteArray) => {
	for (let i = 0; i < byteArray.length; i++) {
		byteArray[i] = Math.floor(256 * Math.random());
	}
};

if (!global.btoa) {
	global.btoa = encode;
}

if (!global.atob) {
	global.atob = decode;
}
*/

import { StoreProvider } from './Store';

import useCachedResources from './hooks/useCachedResources';

const linkObj = {
	prefixes: [Linking.makeUrl('/')],
	config: RouteConfig,
};

export default function App() {
	const isLoadingComplete = useCachedResources();

	if (!isLoadingComplete) {
		return null;
	}

	return (
		<React.Fragment>
			<SafeAreaProvider>
				{Platform.select({
					ios: <StatusBar barStyle='default' />,
					android: <StatusBar barStyle='dark-content' />,
				})}
				<I18nextProvider i18n={i18n}>
					<StoreProvider>
						<NavigationContainer linking={linkObj}>
							<MainNavigator />
						</NavigationContainer>
					</StoreProvider>
				</I18nextProvider>
			</SafeAreaProvider>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
