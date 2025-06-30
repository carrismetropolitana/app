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
import { PermissionsAndroid, Platform } from 'react-native';

interface NotificationsContextState {
	actions: {
		askForPermissions: () => Promise<null | string>
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

	const msgListener = useRef<(() => void) | null>(null);
	const openedListener = useRef<(() => void) | null>(null);

	Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldPlaySound: true,
			shouldSetBadge: true,
			shouldShowAlert: true,
		}),
	});

	const askForPermissions = async (): Promise<null | string> => {
		const app = getApp();
		const messaging = getMessaging(app);

		if (Platform.OS === 'android') {
			if (Platform.Version >= 33) {
				try {
					const granted = await PermissionsAndroid.request(
						PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
						{
							buttonPositive: 'Permitir',
							message: 'A CarrisMetroplitana precisa de permissão para enviar notificações.',
							title: 'Permissão de Notificações',
						},
					);

					if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
						console.warn('❌ Permissão de notificações não concedida');
						return null;
					}
				}
				catch (err) {
					console.warn('❌ Erro ao pedir permissão de notificações', err);
					return null;
				}
			}
		}

		if (Platform.OS === 'ios') {
			try {
				await messaging.registerDeviceForRemoteMessages();
			}
			catch (err) {
				console.warn('❌ Falha a registar no APNs', err);
			}
		}

		const authStatus = await requestPermission(messaging);
		const enabled = authStatus === 1 || authStatus === 2;
		if (!enabled) {
			console.warn('❌ Permissão Firebase não concedida');
			return null;
		}

		const token = await getToken(messaging);
		setFcmToken(token);
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
			console.warn(`❌ Falha ao subscrever "${topic}"`, e);
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
			console.warn(`❌ Falha ao desinscrever "${topic}"`, e);
		}
	};

	useEffect(() => {
		askForPermissions();
	}, []);

	useEffect(() => {
		const app = getApp();
		const messaging = getMessaging(app);

		msgListener.current = onMessage(messaging, async (msg) => {
			console.log('📲 [onMessage] FCM message:', msg);
			setNotification(JSON.stringify(msg));

			try {
				await Notifications.scheduleNotificationAsync({
					content: {
						body: msg.notification?.body ?? 'Nova mensagem',
						sound: true,
						title: msg.notification?.title ?? 'Notificação',
					},
					trigger: null,
				});
				console.log('📲 [onMessage] Local notification agendada');
			}
			catch (err) {
				console.warn('❌ [onMessage] Falha a agendar local:', err);
			}
		});

		openedListener.current = onNotificationOpenedApp(messaging, (msg) => {
			console.log('🔓 [onNotificationOpenedApp]:', msg);
			setResponse(JSON.stringify(msg));
		});

		getInitialNotification(messaging).then((msg) => {
			if (msg) {
				console.log('🚀 [getInitialNotification]:', msg);
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
				actions: {
					askForPermissions,
					subscribeToTopic,
					unsubscribeFromTopic,
				},
				data: {
					fcmToken,
					notification,
					response,
				},
			}}
		>
			{children}
		</NotificationsContext.Provider>
	);
};
