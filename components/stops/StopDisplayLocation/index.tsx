/* * */

import { useLocaleContext } from '@/contexts/Locale.context';
import { useLocationsContext } from '@/contexts/Locations.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { Text } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';

import { styles } from './styles';

/* * */

interface Props {
	localityId?: string
	longName?: string
	municipalityId?: string
	size?: 'lg' | 'md'
}

/* * */

export function StopDisplayLocation({ localityId, longName, municipalityId, size = 'md' }: Props) {
	//

	//
	// A. Setup variables

	const StopDisplayLocationStyles = [size === 'lg' ? styles.lg : styles.md];
	const locationsContext = useLocationsContext();
	const localeContext = useLocaleContext();
	const { t } = useTranslation('translation', { keyPrefix: 'stop.StopDisplay' });

	//
	// B. Fetch data

	const localityData = localityId && locationsContext.actions.getLocalityById(localityId);
	const municipalityData = municipalityId && locationsContext.actions.getMunicipalityById(municipalityId);

	//
	// C. Render components

	if (localityData) {
		return (
			<Text
				accessibilityHint={t('stopDisplayLocalityAccessibilityHint')}
				accessibilityLabel={t('stopDisplayLocalityAccessibilityLabel', { stopName: longName || localityData.display })}
				accessibilityLanguage={localeContext.locale}
				accessibilityRole="search"
				style={[styles.default, StopDisplayLocationStyles]}
			>
				{localityData.display}
			</Text>
		);
	}

	if (municipalityData) {
		return (
			<Text
				accessibilityHint={t('stopDisplayMunicipalityAccessibilityHint')}
				accessibilityLabel={t('stopDisplayMunicipalityAccessibilityLabel', { stopName: longName || municipalityData.name })}
				accessibilityLanguage={localeContext.locale}
				accessibilityRole="search"
				style={[styles.default, StopDisplayLocationStyles]}
			>
				{municipalityData.name}
			</Text>
		);
	}

	return null;

	//
}
