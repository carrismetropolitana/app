import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';

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
