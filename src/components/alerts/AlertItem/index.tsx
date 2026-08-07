/* * */

import type { HubAlert } from '@tmlmobilidade/go-types-public-info';

import { AlertActivePeriodStart } from '@/components/alerts/AlertActivePeriod';
import { router } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

import { useStyles } from './styles';

/* * */

interface AlertItemProps {
	data: HubAlert
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
		if (!data._id) return;
		router.push(`/alerts/${data._id}`);
	};

	//
	// C. Render components

	return (
		<TouchableOpacity onPress={handlePress} style={styles.container}>
			<AlertActivePeriodStart date={new Date(data.active_period_start_date)} size="sm" />
			<Text style={styles.title}>{data.title}</Text>
		</TouchableOpacity>
	);

	//
}
