/* * */

import type { Waypoint } from '@carrismetropolitana/api-types/network';

import { IconDisplay } from '@/components/common/IconDisplay';
import { useLocationsContext } from '@/contexts/Locations.context';
import { useOperationalDayContext } from '@/contexts/OperationalDay.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { Text } from '@rneui/themed';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { IconArrowUpRight } from '@tabler/icons-react';
import * as Clipboard from 'expo-clipboard';
import { Link } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import styles from './styles.module.css';

/* * */

interface Props {
	isFirstStop?: boolean
	isLastStop?: boolean
	isSelected: boolean
	waypointData: Waypoint
}

/* * */

export function PathWaypointHeader({ isFirstStop, isLastStop, isSelected, waypointData }: Props) {
	//

	//
	// A. Setup variables

	const stopsContext = useStopsContext();
	const locationsContext = useLocationsContext();
	const operationalDayContext = useOperationalDayContext();
	const [stopIdClipboard, setStopIdClipboard] = useState('');

	//
	// B. Fetch data

	const stopData = stopsContext.actions.getStopById(waypointData.stop_id);
	const localityData = stopData?.locality_id ? locationsContext.actions.getLocalityById(stopData.locality_id) : undefined;
	const municipalityData = stopData?.municipality_id ? locationsContext.actions.getMunicipalityById(stopData.municipality_id) : undefined;
	//
	// C. Handle actions

	const handleClickStopId = () => {
		if (!isSelected) return;
		Clipboard.setStringAsync(waypointData.stop_id);
		setStopIdClipboard(waypointData.stop_id);
	};

	// const handleOpenStopDetails = () => {
	// 	analyticsContext.actions.capture((ampli, props) => {
	// 		ampli.openedStopDetails({ ...props, stop_id: waypointData.stop_id });
	// 	});
	// };

	//
	// D. Render components

	if (!stopData) {
		return null;
	}

	return (
		<View className={`${styles.container} ${isFirstStop && styles.isFirstStop} ${isLastStop && styles.isLastStop} ${isSelected && styles.isSelected}`}>

			<Text className={styles.stopName}>
				{stopData.long_name}
				{isSelected && (
					<Link
						className={styles.stopNameUrl}
						href={`/stops/${waypointData.stop_id}?day=${operationalDayContext.data.selected_day}`}
						target="_blank"
					>
						<IconArrowUpRight onClick={handleOpenStopDetails} size={16} />
					</Link>
				)}
			</Text>

			<View className={styles.subHeaderWrapper}>
				<Text className={styles.stopLocation}>{localityData?.display || municipalityData?.name}</Text>
				<Text className={`${styles.stopId} ${stopIdClipboard && styles.isCopied}`} onPress={handleClickStopId}>
					#{stopData.id}
					{stopIdClipboard ? <IconCheck className={styles.stopIdCopyIcon} /> : <IconCopy className={styles.stopIdCopyIcon} />}
				</Text>
			</View>
			{isSelected && stopData.facilities.length > 0 && (
				<View className={styles.facilitiesWrapper}>
					{stopData.facilities.map(facility => (
						<IconDisplay key={facility} category="facilities" name={facility} />
					))}
				</View>
			)}
		</View>
	);

	//
}
