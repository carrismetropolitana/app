import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';

// This will handle messages received when the app is in the background or terminated
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
	console.log('📥 [BackgroundMessage] Received background FCM:', remoteMessage);

	await Notifications.scheduleNotificationAsync({
		content: {
			body: remoteMessage.notification?.body ?? 'Mensagem recebida',
			sound: true,
			title: remoteMessage.notification?.title ?? 'Notificação',
		},
		trigger: null,
	});
});
