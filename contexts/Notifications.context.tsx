import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import messagingLib from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

interface NotificationsContextState {
	askForPermissions: () => Promise<null | string>
	fcmToken: null | string
	notification: null | string
	response: null | string
	subscribeToTopic: (topic: string) => Promise<void>
	unsubscribeFromTopic: (topic: string) => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextState | undefined>(undefined);

export function useNotifications() {
	const ctx = useContext(NotificationsContext);
	if (!ctx) throw new Error('useNotifications must be used under NotificationsProvider');
	return ctx;
}

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
	const TOKEN_STORAGE_KEY = '@notifications/fcmToken';
	const [fcmToken, setFcmToken] = useState<null | string>(null);
	const [notification, setNotification] = useState<null | string>(null);
	const [response, setResponse] = useState<null | string>(null);

	const msgListener = useRef<() => void>();
	const openedListener = useRef<() => void>();

	const askForPermissions = async (): Promise<null | string> => {
		const stored = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
		if (stored) {
			setFcmToken(stored);
			return stored;
		}

		const newStatus = await messaging().requestPermission();
		const enabled = newStatus === messaging.AuthorizationStatus.AUTHORIZED || newStatus === messaging.AuthorizationStatus.PROVISIONAL;

		if (!enabled) {
			console.warn('❌ FCM messaging permission denied');
			return null;
		}

		const token = await messaging().getToken();
		setFcmToken(token);
		await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
		console.log('✅ FCM Token:', token);
		if (Platform.OS === 'android') {
			await Notifications.setNotificationChannelAsync('default', {
				importance: Notifications.AndroidImportance.MAX,
				name: 'default',
			});
		}
		return token;
	};

	const subscribeToTopic = async (topic: string) => {
		try {
			await messagingLib().subscribeToTopic(topic);
			console.log(`✅ Subscribed to topic "${topic}"`);
		}
		catch (e) {
			console.warn(`❌ Failed to subscribe to "${topic}"`, e);
		}
	};

	const unsubscribeFromTopic = async (topic: string) => {
		try {
			await messagingLib().unsubscribeFromTopic(topic);
			console.log(`✅ Unsubscribed from topic "${topic}"`);
		}
		catch (e) {
			console.warn(`❌ Failed to unsubscribe from "${topic}"`, e);
		}
	};

	useEffect(() => {
		askForPermissions();
		messaging().setBackgroundMessageHandler(async (remoteMessage) => {
			console.log('📥 Background FCM message:', remoteMessage);
		});
		msgListener.current = messagingLib().onMessage((msg) => {
			console.log('📲 Firebase foreground message:', msg);
			setNotification(JSON.stringify(msg));
		});
		openedListener.current = messagingLib().onNotificationOpenedApp((msg) => {
			console.log('🔓 Opened from background state:', msg);
			setResponse(JSON.stringify(msg));
		});
		messagingLib().getInitialNotification().then((msg) => {
			if (msg) {
				console.log('🚀 Opened from quit state:', msg);
				setResponse(JSON.stringify(msg));
			}
		});
		return () => {
			msgListener.current?.();
			openedListener.current?.();
		};
	}, []);

	return (
		<NotificationsContext.Provider
			value={{
				askForPermissions,
				fcmToken,
				notification,
				response,
				subscribeToTopic,
				unsubscribeFromTopic,
			}}
		>
			{children}
		</NotificationsContext.Provider>
	);
};
