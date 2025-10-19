/* * */

import { AlertActivePeriodStart } from '@/components/alerts/AlertActivePeriod';
import { type SimplifiedAlert } from '@/types/alerts.types';
import { router } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

import { useStyles } from './styles';

/* * */

interface AlertItemProps {
	data: SimplifiedAlert
}

/* * */

export function AlertItem({ data }: AlertItemProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Handle actions

	const handlePress = () => {
		if (!data.alert_id) return;
		router.push(`/alerts/${data.alert_id}`);
	};

	//
	// C. Render components

	return (
		<TouchableOpacity onPress={handlePress} style={styles.container}>
			<AlertActivePeriodStart date={data.start_date} size="sm" />
			<Text style={styles.title}>{data.title}</Text>
		</TouchableOpacity>
	);

	//
}
