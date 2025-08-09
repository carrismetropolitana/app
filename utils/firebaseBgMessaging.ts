import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
	await Notifications.scheduleNotificationAsync({
		content: {
			body: remoteMessage.notification?.body ?? 'Mensagem recebida',
			sound: true,
			title: remoteMessage.notification?.title ?? 'Notificação',
		},
		trigger: null,
	});
});
