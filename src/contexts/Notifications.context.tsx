/* * */

import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

/* * */

interface NotificationsContextState {
	actions: {
		askForPermission: () => void
	}
	data: {
		token: string | undefined
	}
	flags: {
		enabled: boolean
	}
}

/* * */

const NotificationsContext = createContext<NotificationsContextState | undefined>(undefined);

export function useNotificationsContext() {
	const context = useContext(NotificationsContext);
	if (!context) {
		throw new Error('useNotificationsContext must be used within a NotificationsContextProvider');
	}
	return context;
}

/* * */

export const NotificationsContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Setup variables

	const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
	const [permissionStatus, setPermissionStatus] = useState<Notifications.PermissionStatus | undefined>();

	//
	// B. Handle actions

	useEffect(() => {
		// This handler defines how notifications are shown when received.
		// For example, you can choose to show an alert, play a sound, or set a badge on the app icon.
		// If you don't set this handler, notifications will not be shown when the app is in the foreground.
		Notifications.setNotificationHandler({
			handleNotification: async () => ({
				shouldPlaySound: true,
				shouldSetBadge: true,
				shouldShowBanner: true,
				shouldShowList: true,
			}),
		});
	}, []);

	useEffect(() => {
		// Register for push notifications
		// This function also creates a channel on Android
		// (channels are required for Android 8.0 and above)
		registerForPushNotificationsAsync()
			.then(token => setExpoPushToken(token))
			.catch(error => console.log(`${error}`));
		// This listener is fired whenever a notification is received while the app is foregrounded
		// (when the app is open and in use). You can use this to update your UI in response
		// to the notification (for example, by showing an in-app banner or updating a notifications list).
		const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
			console.log(notification);
		});
		// This listener is fired whenever a user taps on or interacts with a notification
		// (works when the app is foregrounded, backgrounded, or killed).
		// You can use this to navigate the user to a specific screen or perform
		// an action in response to the notification.
		const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
			console.log(response);
		});
		// Clean up the notification listeners
		// when the component unmounts.
		return () => {
			notificationListener.remove();
			responseListener.remove();
		};
	}, []);

	async function registerForPushNotificationsAsync() {
		// Android remote notification permissions are granted during the app install,
		// so this will only ask on iOS and it will only ask once.
		// Subsequent calls to this function will return the existing permission status.
		// On Android, we create a channel to categorize notifications.
		// We use the 'default' channel name here, but you can create custom channels for different
		// types of notifications and then specify the channelId when sending a notification.
		if (Platform.OS === 'android') {
			await Notifications.setNotificationChannelAsync('default', {
				importance: Notifications.AndroidImportance.MAX,
				lightColor: '#FFDD00',
				name: 'default',
				vibrationPattern: [0, 250, 250, 250],
			});
		}
		// iOS and Android devices require
		// a physical device for push notifications.
		if (Device.isDevice) {
			// Check for existing permissions
			const existingPermissions = await Notifications.getPermissionsAsync();
			let finalStatus = existingPermissions.status;
			// If no existing permission, ask for permission
			if (existingPermissions.status !== 'granted') {
				const permissionRequestStatus = await Notifications.requestPermissionsAsync();
				finalStatus = permissionRequestStatus.status;
			}
			// Update the permission status state
			setPermissionStatus(finalStatus);
			// If no permission, exit the function
			if (finalStatus !== 'granted') {
				console.log('Permission not granted to get push token for push notification!');
				return;
			}
			// Get the token that identifies this device for push notifications
			// This requires the project ID from EAS or Expo Go
			const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
			if (!projectId) console.log('Project ID not found');
			try {
				const expoPushToken = await Notifications.getExpoPushTokenAsync({ projectId });
				console.log(`Expo push token: ${expoPushToken.data}`);
				return expoPushToken.data;
			}
			catch (e: unknown) {
				console.log(`${e}`);
			}
		}
		else {
			console.log('Must use physical device for push notifications');
		}
	}

	function askForPermission() {
		// If permission is already granted, exit the function
		if (permissionStatus === 'granted') return;
		// Otherwise, ask for permission
		registerForPushNotificationsAsync();
	}

	//
	// C. Context value

	const contextValue: NotificationsContextState = useMemo(() => ({
		actions: {
			askForPermission,
		},
		data: {
			token: expoPushToken,
		},
		flags: {
			enabled: permissionStatus === 'granted' && expoPushToken !== undefined,
		},
	}), [
		expoPushToken,
		permissionStatus,
	]);

	//
	// D. Render components

	return (
		<NotificationsContext.Provider value={contextValue}>
			{children}
		</NotificationsContext.Provider>
	);

	//
};
