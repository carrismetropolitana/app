/* * */

import { useAccountContext } from '@/contexts/Account.context';
import { type WidgetSmartNotification } from '@/schemas/widgets';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetCardSmartNotificationBodyProps {
	data: WidgetSmartNotification
}

/* * */

export function WidgetCardSmartNotificationBody({ data }: WidgetCardSmartNotificationBodyProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const accountContext = useAccountContext();

	//
	// C. Render components

	return (
		<View style={styles.container}>
			<Text>WidgetCardSmartNotificationBody</Text>
		</View>
	);

	//
}
