/* * */

import { type DotPath, HttpException, type PathValue, setValueAtPath } from '@/core-replica';
import { getServiceUrl } from '@/settings/service-urls';
import { fetchData } from '@/utils/fetchData';
import { swrFetcher } from '@/utils/swr-fetcher';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Platform, Text, View } from 'react-native';

/* * */

const LOCAL_STORAGE_KEYS = {
	account_id: 'account_id',
};

/* * */

interface NotificationsContextState {
	actions: {
		update: (path: DotPath<Notification>, value: PathValue<Notification, DotPath<Notification>>) => Promise<void>
	}
	data: {
		account: Notification | undefined
		account_id: string | undefined
	}
	flags: {
		loading: boolean
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

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldPlaySound: true,
		shouldSetBadge: true,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
});

async function sendPushNotification(expoPushToken: string) {
	const message = {
		body: 'And here is the body!',
		data: { someData: 'goes here' },
		sound: 'default',
		title: 'Original Title',
		to: expoPushToken,
	};

	await fetch('https://exp.host/--/api/v2/push/send', {
		body: JSON.stringify(message),
		headers: {
			'Accept': 'application/json',
			'Accept-encoding': 'gzip, deflate',
			'Content-Type': 'application/json',
		},
		method: 'POST',
	});
}

function handleRegistrationError(errorMessage: string) {
	alert(errorMessage);
	throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
	if (Platform.OS === 'android') {
		await Notifications.setNotificationChannelAsync('default', {
			importance: Notifications.AndroidImportance.MAX,
			lightColor: '#FF231F7C',
			name: 'default',
			vibrationPattern: [0, 250, 250, 250],
		});
	}

	if (Device.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			handleRegistrationError('Permission not granted to get push token for push notification!');
			return;
		}
		const projectId
      = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
		if (!projectId) {
			handleRegistrationError('Project ID not found');
		}
		try {
			const pushTokenString = (
				await Notifications.getExpoPushTokenAsync({
					projectId,
				})
			).data;
			console.log(pushTokenString);
			return pushTokenString;
		}
		catch (e: unknown) {
			handleRegistrationError(`${e}`);
		}
	}
	else {
		handleRegistrationError('Must use physical device for push notifications');
	}
}

/* * */

export const NotificationsContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Setup variables

	const [expoPushToken, setExpoPushToken] = useState('');
	const [notification, setNotification] = useState<Notifications.Notification | undefined>(
		undefined,
	);

	//
	// B. Fetch data

	//
	// C. Handle actions

	useEffect(() => {
		registerForPushNotificationsAsync()
			.then(token => setExpoPushToken(token ?? ''))
			.catch((error: any) => setExpoPushToken(`${error}`));

		const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
			setNotification(notification);
		});

		const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
			console.log(response);
		});

		return () => {
			notificationListener.remove();
			responseListener.remove();
		};
	}, []);

	//
	// C. Context value

	const contextValue: NotificationsContextState = useMemo(() => ({
		actions: {
		},
		data: {
		},
		flags: {
		},
	}), [
	]);

	//
	// C. Render components

	return (
		<NotificationsContext.Provider value={contextValue}>
			<View style={{ alignItems: 'center', flex: 1, justifyContent: 'space-around' }}>
				<Text>Your Expo push token: {expoPushToken}</Text>
				<View style={{ alignItems: 'center', justifyContent: 'center' }}>
					<Text>Title: {notification && notification.request.content.title} </Text>
					<Text>Body: {notification && notification.request.content.body}</Text>
					<Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
				</View>
				<Button
					title="Press to Send Notification"
					onPress={async () => {
						await sendPushNotification(expoPushToken);
					}}
				/>
			</View>
			{children}
		</NotificationsContext.Provider>
	);

	//
};
