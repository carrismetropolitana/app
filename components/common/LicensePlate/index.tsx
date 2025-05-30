/* * */

import { Text } from '@rn-vui/themed';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

interface Props {
	country?: string
	value: string
}

/* * */

export function LicensePlate({ country = 'pt', value }: Props) {
	//

	//
	// A. Setup variables

	const licensePlateStyles = styles();

	//
	// B. Transform data

	const formattedPlate = value.split('-').join('').match(/.{1,2}/g)?.join(' ');

	//
	// B. Render components

	return (
		<View style={licensePlateStyles.container}>
			<View style={licensePlateStyles.countryContainer}>
				<Text style={licensePlateStyles.countryText}>{country}</Text>
			</View>
			<View style={licensePlateStyles.plateContainer}>
				<Text style={licensePlateStyles.plateText}>{formattedPlate}</Text>
			</View>
		</View>
	);

	//
}
