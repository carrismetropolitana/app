/* * */

import { HomeScreenGeneralStatus } from '@/components/home/HomeScreenGeneralStatus';
import { HomeScreenTopBar } from '@/components/home/HomeScreenTopBar';
import { useNotificationsContext } from '@/contexts/Notifications.context';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function HomeScreenListHeader() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const notificationsContext = useNotificationsContext();

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<HomeScreenTopBar />
			<Text>{notificationsContext.data.token}</Text>
			<HomeScreenGeneralStatus />
		</View>
	);

	//
}
