/* * */

import type { Waypoint } from '@carrismetropolitana/api-types/network';

import { IconDisplay } from '@/components/common/IconDisplay';
import { useLocationsContext } from '@/contexts/Locations.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { Text } from '@rn-vui/themed';
import { IconCheck, IconCopy } from '@tabler/icons-react-native';
import { IconArrowUpRight } from '@tabler/icons-react-native';
import * as Clipboard from 'expo-clipboard';
import { Link } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { styles } from './styles';

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
	const [stopIdClipboard, setStopIdClipboard] = useState('');
	const pathWaypointHeaderStyles = styles();

	const containerStyles = [
		pathWaypointHeaderStyles.container,
		isFirstStop && pathWaypointHeaderStyles.isFirstStop,
		isLastStop && pathWaypointHeaderStyles.isLastStop,
		isSelected && pathWaypointHeaderStyles.isSelected,
	];

	const stopIdStyles = [
		pathWaypointHeaderStyles.stopId,
		stopIdClipboard && pathWaypointHeaderStyles.isCopied,
	];

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

	//
	// D. Render components

	if (!stopData) {
		return null;
	}

	return (
		<View style={containerStyles}>
			<Text style={pathWaypointHeaderStyles.stopName}>
				{stopData.long_name}
				{isSelected && (
					<Link href={`/stop/${waypointData.stop_id}`} style={pathWaypointHeaderStyles.stopNameUrl} target="_blank">
						<IconArrowUpRight size={20} />
					</Link>
				)}
			</Text>
			<View style={pathWaypointHeaderStyles.subHeaderWrapper}>
				<Text style={pathWaypointHeaderStyles.stopLocation}>{localityData?.display || municipalityData?.name}</Text>
				<Text onPress={handleClickStopId} style={stopIdStyles}>
					#{stopData.id}
					{stopIdClipboard
						? <IconCheck style={pathWaypointHeaderStyles.stopIdCopyIcon} />
						: <IconCopy style={pathWaypointHeaderStyles.stopIdCopyIcon} />}
				</Text>
			</View>
			{isSelected && stopData.facilities.length > 0 && (
				<View style={pathWaypointHeaderStyles.facilitiesWrapper}>
					{stopData.facilities.map(facility => (<View key={facility}><IconDisplay category="facilities" name={facility} /></View>))}
				</View>
			)}
		</View>
	);

	//
}
