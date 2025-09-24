/* * */

import { Text } from '@rn-vui/themed';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface LicensePlateProps {
	country?: string
	value?: string
}

/* * */

export function LicensePlate({ country = 'P', value }: LicensePlateProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	if (!value) {
		return null;
	}

	return (
		<View style={styles.container}>
			<View style={styles.countryWrapper}>
				<Text style={styles.country}>{country}</Text>
			</View>
			<View style={styles.plateWrapper}>
				<Text style={styles.plate}>{value}</Text>
			</View>
		</View>
	);

	//
}
