/* * */

import { IconDisplay } from '@/components/common/IconDisplay';
import { useLocaleContext } from '@/contexts/Locale.context';
import { useLocationsContext } from '@/contexts/Locations.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { theming } from '@/theme/Variables';
import { type Waypoint } from '@carrismetropolitana/api-types/network';
import { Text } from '@rn-vui/themed';
import { IconCheck, IconCopy } from '@tabler/icons-react-native';
import { IconArrowUpRight } from '@tabler/icons-react-native';
import * as Clipboard from 'expo-clipboard';
import { Link } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

	const { t } = useTranslation('translation', { keyPrefix: 'pathWaypoint' });
	const stopsContext = useStopsContext();
	const locationsContext = useLocationsContext();
	const localeContext = useLocaleContext();
	const [stopIdClipboard, setStopIdClipboard] = useState('');
	const pathWaypointHeaderStyles = styles();
	const iconColor = isSelected ? theming.colorSystemText300 : theming.colorSystemText400;
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
			<Text accessibilityHint={t('headerLinkAccessibilityHint')} accessibilityLabel={t('headerLinkAccessibilityLabel', { stopName: stopData.long_name })} accessibilityLanguage={localeContext.data.locale} accessibilityRole="link" style={pathWaypointHeaderStyles.stopName}>
				{stopData.long_name}
				<Link href={`/stop/${waypointData.stop_id}`} style={pathWaypointHeaderStyles.stopNameUrl}>
					<IconArrowUpRight color={iconColor} size={14} />
				</Link>
			</Text>
			<View style={pathWaypointHeaderStyles.subHeaderWrapper}>
				<Text accessibilityHint={t('headerLocalityAccessibilityHint')} accessibilityLabel={t('headerLocalityAccessibilityLabel', { locality: localityData?.display || municipalityData?.name })} accessibilityLanguage={localeContext.data.locale} accessibilityRole="text" style={pathWaypointHeaderStyles.stopLocation}>{localityData?.display || municipalityData?.name}</Text>
				<Text onPress={handleClickStopId} style={stopIdStyles}>
					#{stopData.id} {stopIdClipboard ? <IconCheck style={pathWaypointHeaderStyles.stopIdCopyIcon} /> : <IconCopy style={pathWaypointHeaderStyles.stopIdCopyIcon} />}
				</Text>
			</View>
			{isSelected && stopData.facilities.length > 0 && (
				<View style={pathWaypointHeaderStyles.facilitiesWrapper}>
					{stopData.facilities.map(facility => (<View key={facility} accessibilityHint={t('headerFacilityAccessibilityHint')} accessibilityLabel={t('headerFacilityAccessibilityLabel', { facility })} accessibilityLanguage={localeContext.data.locale} accessibilityRole="link"><IconDisplay category="facilities" name={facility} /></View>))}
				</View>
			)}
		</View>
	);

	//
}
