/* * */

import { ArrivalRow } from '@/components/arrivals/ArrivalRow';
import { useArrivalsContext } from '@/contexts/Arrivals.context';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function WidgetCardStopBodyArrivals() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const arrivalsContext = useArrivalsContext();

	//
	// B. Render components

	return (
		<View style={styles.container}>
			{arrivalsContext.data.arrivals.map((arrival, index) => (
				<ArrivalRow key={index} data={arrival} />
			))}
		</View>
	);

	//
}
