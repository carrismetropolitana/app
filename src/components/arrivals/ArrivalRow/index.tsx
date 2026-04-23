/* * */

import { ArrivalTime } from '@/components/arrivals/ArrivalTime';
import { LineBadge } from '@/components/lines/LineBadge';
import { useLinesContext } from '@/contexts/Lines.context';
import { type Arrival } from '@/schemas/realtime-arrival';
import { useSystemVariables } from '@/theme/global';
import { IconChevronRight } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { useStyles } from './styles';

/* * */

interface ArrivalRowProps {
	data: Arrival
}

/* * */

export function ArrivalRow({ data }: ArrivalRowProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	const linesContext = useLinesContext();

	const router = useRouter();

	//
	// B. Transform data

	const lineData = useMemo(() => {
		// Skip if no data
		if (!data) return;
		// Get line data from context
		const foundLine = linesContext.actions.getLineDataById(data.line_id);
		// Return found line
		return foundLine;
	}, [data]);

	//
	// C. Handle actions

	const handleRealtimePress = () => {
		if (!data.vehicle_id) return;
		router.push(`/(modals)/(vehicle-modal)/${data.vehicle_id}`);
	};

	const handleScheduledPress = () => {
		if (!data.trip_id) return;
		router.push(`/(modals)/(line-modal)/${data.line_id}?pattern_id=${data.pattern_id}`);
	};

	//
	// D. Render components

	if (data.status === 'realtime') {
		return (
			<TouchableOpacity onPress={handleRealtimePress} style={styles.container}>
				<LineBadge lineId={lineData?.id} size="sm" />
				<Text numberOfLines={1} style={styles.title}>{data.headsign}</Text>
				<ArrivalTime status="realtime" time={data.estimated_arrival_unix} />
				<IconChevronRight color={systemVariables.text[400]} size={24} />
			</TouchableOpacity>
		);
	}

	if (data.status === 'scheduled') {
		return (
			<TouchableOpacity activeOpacity={1} onPress={handleScheduledPress} style={styles.container}>
				<LineBadge lineId={lineData?.id} size="sm" />
				<Text numberOfLines={1} style={styles.title}>{data.headsign}</Text>
				<ArrivalTime status="scheduled" time={data.scheduled_arrival_unix} />
				<IconChevronRight color={systemVariables.text[400]} size={24} />
			</TouchableOpacity>
		);
	}

	//
};
