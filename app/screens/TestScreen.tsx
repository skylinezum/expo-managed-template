import * as React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../Store';

export function TestScreen() {
	const { t } = useTranslation();
	const { setAuth } = useAppContext();

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{t('test_screen')}</Text>
			<Button title={t('sign_out')} onPress={() => setAuth(false)} />
		</View>
	);
}

export function TestAuthScreen() {
	const { t } = useTranslation();
	const { setAuth } = useAppContext();

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{t('test_screen')}</Text>
			<Button title={t('sign_in')} onPress={() => setAuth(true)} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		textAlign: 'center',
		textAlignVertical: 'center',
	},
});
