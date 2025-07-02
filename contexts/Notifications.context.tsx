import { getApp } from '@react-native-firebase/app';
import {
	subscribeToTopic as firebaseSubscribeToTopic,
	unsubscribeFromTopic as firebaseUnsubscribeFromTopic,
	getInitialNotification,
	getMessaging,
	getToken,
	isDeviceRegisteredForRemoteMessages,
	onMessage,
	onNotificationOpenedApp,
	registerDeviceForRemoteMessages,
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
import { PermissionsAndroid, Platform } from 'react-native';

interface NotificationsContextState {
	actions: {
		askForPermissions: () => Promise<null | string>
		sendTestNotification: () => Promise<void>
		subscribeToTopic: (topic: string) => Promise<void>
		unsubscribeFromTopic: (topic: string) => Promise<void>
	}
	data: {
		fcmToken: null | string
		notification: null | string
		response: null | string
	}
}

const NotificationsContext = createContext<NotificationsContextState | undefined>(undefined);

export function useNotifications() {
	const ctx = useContext(NotificationsContext);
	if (!ctx) throw new Error('useNotifications must be used under NotificationsProvider');
	return ctx;
}

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
	const [fcmToken, setFcmToken] = useState<null | string>(null);
	const [notification, setNotification] = useState<null | string>(null);
	const [response, setResponse] = useState<null | string>(null);

	const expoListenerRef = useRef<Notifications.EventSubscription>();

	const app = getApp();
	const messaging = getMessaging(app);

	Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldPlaySound: true,
			shouldSetBadge: true,
			shouldShowAlert: true,
		}),
	});

	const askForPermissions = async (): Promise<null | string> => {
		if (Platform.OS === 'ios') {
			const { status } = await Notifications.requestPermissionsAsync();
			if (status !== 'granted') {
				console.warn('🔒 iOS notification permission not granted');
				return null;
			}
		}

		if (Platform.OS === 'android' && Platform.Version >= 33) {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
				{
					buttonPositive: 'Permitir',
					message: 'A Carris Metropolitana precisa de permissão para enviar notificações.',
					title: 'Permissão de Notificações',
				},
			);
			if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
				console.warn('❌ Android notification permission not granted');
				return null;
			}
		}

		if (!(await isDeviceRegisteredForRemoteMessages(messaging))) {
			await registerDeviceForRemoteMessages(messaging);
		}

		const authStatus = await requestPermission(messaging);
		const enabled = authStatus === 1 || authStatus === 2;
		if (!enabled) {
			console.warn('❌ Firebase permission not granted');
			return null;
		}

		const token = await getToken(messaging);
		return token;
	};

	const sendTestNotification = async () => {
		try {
			await Notifications.scheduleNotificationAsync({
				content: {
					body: 'Isto é um push simulado no dispositivo!',
					data: { localTest: true },
					sound: 'default',
					title: '🚀 Teste Local',
					vibrate: [100, 200, 300],
				},
				trigger: null,
			});
		}
		catch (err) {
			console.warn('❌ Error scheduling test notification:', err);
		}
	};

	const subscribeToTopic = async (topic: string) => {
		try {
			await firebaseSubscribeToTopic(messaging, topic);
			console.log(`✅ Subscribed to topic "${topic}"`);
		}
		catch (e) {
			console.warn(`❌ Failed to subscribe to "${topic}"`, e);
		}
	};

	const unsubscribeFromTopic = async (topic: string) => {
		try {
			await firebaseUnsubscribeFromTopic(messaging, topic);
			console.log(`✅ Unsubscribed from topic "${topic}"`);
		}
		catch (e) {
			console.warn(`❌ Failed to unsubscribe from "${topic}"`, e);
		}
	};

	useEffect(() => {
		let isMounted = true;

		(async () => {
			try {
				const token = await askForPermissions();
				if (!token || !isMounted) return;
				setFcmToken(token);
				// Subscribes after obtaining token
				await subscribeToTopic('test');

				// Handle tap when killed
				const initial = await getInitialNotification(messaging);
				if (initial && isMounted) {
					setResponse(JSON.stringify(initial));
				}

				// Firebase: foreground messages
				const unsubMsg = onMessage(messaging, async (msg) => {
					setNotification(JSON.stringify(msg));
					try {
						await Notifications.scheduleNotificationAsync({
							content: {
								body: msg.notification?.body ?? 'Nova mensagem',
								data: msg.data || {},
								sound: 'default',
								title: msg.notification?.title ?? 'Notificação',
							},
							trigger: null,
						});
					}
					catch (err) {
						console.error('❌ [onMessage] Failed to schedule local notification:', err);
					}
				});

				// Firebase: background/killed taps
				const unsubOpen = onNotificationOpenedApp(messaging, (msg) => {
					setResponse(JSON.stringify(msg));
				});

				// Expo listener for receipt in foreground
				expoListenerRef.current = Notifications.addNotificationReceivedListener((n) => {
					setNotification(JSON.stringify(n));
				});

				// Cleanup on unmount
				return () => {
					isMounted = false;
					unsubMsg();
					unsubOpen();
					expoListenerRef.current?.remove();
				};
			}
			catch (error) {
				console.error('❌ FCM setup failed:', error);
			}
		})();
	}, []);

	return (
		<NotificationsContext.Provider
			value={{
				actions: { askForPermissions, sendTestNotification, subscribeToTopic, unsubscribeFromTopic },
				data: { fcmToken, notification, response },
			}}
		>
			{children}
		</NotificationsContext.Provider>
	);
};
