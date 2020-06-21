import * as React from 'react';
import { AuthNavigator } from './AuthNavigator.tsx';
import { MobileNavigator } from './MobileNavigator';
import { TabletNavigator } from './TabletNavigator';
import { useAppContext } from '../Store';

export function MainNavigator(props) {
	const { screen, isAuth } = useAppContext();
	const isSmallScreen = screen.window.width <= 767;

	let Navigator = <TabletNavigator {...props} />;

	if (isSmallScreen) {
		Navigator = <MobileNavigator {...props} />;
	}

	if (isAuth) {
		return Navigator;
	}

	return <AuthNavigator {...props} />;
}
