/* * */

import { useLocationsContext } from '@/contexts/Locations.context';
import { Text } from '@rn-vui/themed';

import { styles } from './styles';

/* * */

interface Props {
	localityId?: string
	municipalityId?: string
	size?: 'lg' | 'md'
}

/* * */

export function StopDisplayLocation({ localityId, municipalityId, size = 'md' }: Props) {
	//

	//
	// A. Setup variables
	const StopDisplayLocationStyles = [
		size === 'lg' ? styles.lg : styles.md,
	];

	const locationsContext = useLocationsContext();

	//
	// B. Fetch data

	const localityData = localityId && locationsContext.actions.getLocalityById(localityId);
	const municipalityData = municipalityId && locationsContext.actions.getMunicipalityById(municipalityId);

	//
	// C. Render components

	if (localityData) {
		return (
			<Text style={[styles.default, StopDisplayLocationStyles]}>
				{localityData.display}
			</Text>
		);
	}

	if (municipalityData) {
		return (
			<Text style={[styles.default, StopDisplayLocationStyles]}>
				{municipalityData.name}
			</Text>
		);
	}

	return null;

	//
}
