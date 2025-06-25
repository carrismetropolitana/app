import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp } from '@react-native-firebase/app';
import {
	subscribeToTopic as firebaseSubscribeToTopic,
	unsubscribeFromTopic as firebaseUnsubscribeFromTopic,
	getInitialNotification,
	getMessaging,
	getToken,
	onMessage,
	onNotificationOpenedApp,
	requestPermission,
} from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
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

		const app = getApp();
		const messaging = getMessaging(app);

		const newStatus = await requestPermission(messaging);
		const authStatus = newStatus;
		const enabled = authStatus === 1 || authStatus === 2;

		if (!enabled) {
			console.warn('❌ FCM messaging permission denied');
			return null;
		}

		const token = await getToken(messaging);
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
			const app = getApp();
			const messaging = getMessaging(app);
			await firebaseSubscribeToTopic(messaging, topic);
			console.log(`✅ Subscribed to topic "${topic}"`);
		}
		catch (e) {
			console.warn(`❌ Failed to subscribe to "${topic}"`, e);
		}
	};

	const unsubscribeFromTopic = async (topic: string) => {
		try {
			const app = getApp();
			const messaging = getMessaging(app);
			await firebaseUnsubscribeFromTopic(messaging, topic);
			console.log(`✅ Unsubscribed from topic "${topic}"`);
		}
		catch (e) {
			console.warn(`❌ Failed to unsubscribe from "${topic}"`, e);
		}
	};

	useEffect(() => {
		const app = getApp();
		const modularMessaging = getMessaging(app);

		askForPermissions();

		modularMessaging.setBackgroundMessageHandler(async (remoteMessage) => {
			console.log('📥 Background FCM message:', remoteMessage);
		});

		msgListener.current = onMessage(modularMessaging, (msg) => {
			console.log('📲 Firebase foreground message:', msg);
			setNotification(JSON.stringify(msg));
		});

		openedListener.current = onNotificationOpenedApp(modularMessaging, (msg) => {
			console.log('🔓 Opened from background state:', msg);
			setResponse(JSON.stringify(msg));
		});

		getInitialNotification(modularMessaging).then((msg) => {
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
