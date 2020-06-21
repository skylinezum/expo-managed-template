import * as React from 'react';
import { AppState, Dimensions, Vibration, Platform } from 'react-native';
import * as Localization from 'expo-localization';
import * as Device from 'expo-device';
import * as ScreenOrientation from 'expo-screen-orientation';
import Constants from 'expo-constants';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import constate from 'constate';
import { ScreenInfo } from 'react-native-responsive-grid';
import { useTranslation } from 'react-i18next';

/*
//Firebase
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { getEnvVars } from './env';
const { firebaseConfig } = getEnvVars();
try {
	firebase.initializeApp(firebaseConfig);
} catch (err) {
	// we skip the "already exists" message which is
	// not an actual error when we're hot-reloading
	if (!/already exists/.test(err.message)) {
		console.error('Firebase initialization error', err.stack);
	}
}
*/

function useStore() {
	/*
    #                  
   # #   #####  #####  
  #   #  #    # #    # 
 #     # #    # #    # 
 ####### #####  #####  
 #     # #      #      
 #     # #      #      
                       
*/

	const { i18n } = useTranslation();

	const [appPermissions, setAppPermissions] = React.useState({
		notifications: 'not granted',
	});

	const [appState, setAppState] = React.useState(AppState.currentState);
	const [screen, setScreen] = React.useState({
		orientation: '',
		window: {
			width: Math.round(Dimensions.get('window').width),
			height: Math.round(Dimensions.get('window').height),
		},
		width: Math.round(Dimensions.get('screen').width),
		height: Math.round(Dimensions.get('screen').height),
	});
	const [deviceType, setDeviceType] = React.useState(Device.DeviceType.PHONE);
	const [isAuth, setAuth] = React.useState(false);

	React.useEffect(() => {
		// App State
		async function handleAppState(newAppState) {
			if (appState.match(/inactive|background/) && newAppState === 'active') {
				//app is now in foreground

				//only get new localization for android
				//https://docs.expo.io/versions/v33.0.0/sdk/localization/
				if (Platform.os === 'android') {
					const newLocalization = await Localization.getLocalizationAsync();
					i18n.changeLanguage(newLocalization.locale);
				}

				//get permission status for notifications and other stuff
				if (Constants.isDevice) {
					const { status: notificationPermission } = await Permissions.getAsync(
						Permissions.NOTIFICATIONS
					);

					setAppPermissions({
						notifications: notificationPermission,
					});
				}
			}

			setAppState(newAppState);
		}

		AppState.addEventListener('change', handleAppState);

		// Screen Orientation
		const handleScreenOrientation = async () => {
			const newScreenOrientation = await ScreenOrientation.getOrientationAsync();
			setScreen({
				orientation: newScreenOrientation,
				window: screen.window,
				width: screen.width,
				height: screen.height,
			});
		};

		//init screen orientation + listen for changes
		handleScreenOrientation();

		const screenOrientationListener = ScreenOrientation.addOrientationChangeListener(
			handleScreenOrientation
		);

		// Device Type
		const handleDeviceType = async () => {
			const resDeviceType = await Device.getDeviceTypeAsync();
			setDeviceType(resDeviceType);
		};

		handleDeviceType();

		// Screen Dimensions
		function handleDimensions(newDimensions) {
			setScreen({
				orientation: screen.orientation,
				window: {
					width: Math.round(newDimensions.window.width),
					height: Math.round(newDimensions.window.height),
				},
				width: Math.round(newDimensions.screen.width),
				height: Math.round(newDimensions.screen.height),
			});
			ScreenInfo();
		}

		const dimensionsListener = Dimensions.addEventListener(
			'change',
			handleDimensions
		);

		return function cleanUp() {
			//clean up AppState listener
			AppState.removeEventListener('change', handleAppState);
			ScreenOrientation.removeOrientationChangeListener(
				screenOrientationListener
			);
			Dimensions.removeEventListener('change', dimensionsListener);
		};
	}, []);

	const appCtx = {
		appState,
		screen,
		deviceType,
		isAuth,
		setAuth,
	};

	/*
	#     #                                                             
	##    #  ####  ##### # ###### #  ####    ##   ##### #  ####  #    # 
	# #   # #    #   #   # #      # #    #  #  #    #   # #    # ##   # 
	#  #  # #    #   #   # #####  # #      #    #   #   # #    # # #  # 
	#   # # #    #   #   # #      # #      ######   #   # #    # #  # # 
	#    ## #    #   #   # #      # #    # #    #   #   # #    # #   ## 
	#     #  ####    #   # #      #  ####  #    #   #   #  ####  #    # 
																																			
	*/

	//create UI around this so ask for permission only after a login, not if auth state changes
	//when confirming an otp key
	//show a ui in account settings to set permissions if not granted
	const askNotificationsPermission = async () => {
		const { status: existingStatus } = await Permissions.getAsync(
			Permissions.NOTIFICATIONS
		);

		if (existingStatus !== 'granted') {
			const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
		}
	};

	const registerForPushNotifications = async () => {
		const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

		if (status === 'granted') {
			const pushToken = await Notifications.getExpoPushTokenAsync();
			await addPushToken(pushToken);

			if (Platform.OS === 'android') {
				Notifications.createChannelAndroidAsync('default', {
					name: 'default',
					sound: true,
					priority: 'max',
					vibrate: [0, 250, 250, 250],
				});
			}
		}
	};

	//TODO add a button in ui to register for push notifications
	const notificationCtx = {
		askNotificationsPermission,
		registerForPushNotifications,
	};

	const addPushToken = async (pushToken) => {
		console.log('add push token', pushToken);
	};

	return {
		appCtx,
		notificationCtx,
	};
}

export const [StoreProvider, useAppContext, useNotificationContext] = constate(
	useStore,
	(c) => c.appCtx,
	(c) => c.notificationCtx
);
