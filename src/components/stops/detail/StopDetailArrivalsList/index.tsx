/* * */

import { ArrivalRow } from '@/components/arrivals/ArrivalRow';
import { useArrivalsContext } from '@/contexts/Arrivals.context';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function StopDetailArrivalsList() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const arrivalsContext = useArrivalsContext();

	//
	// B. Render components

	if (!arrivalsContext.data.arrivals.length) {
		return null;
	}

	return (
		<View style={styles.container}>
			{arrivalsContext.data.arrivals.map((arrival, index) => (
				<ArrivalRow key={index} data={arrival} />
			))}
		</View>
	);

	//
}
