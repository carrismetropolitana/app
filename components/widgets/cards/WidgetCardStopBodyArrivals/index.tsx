/* * */

import { ArrivalRow } from '@/components/arrivals/ArrivalRow';
import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { useArrivalsContext } from '@/contexts/Arrivals.context';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function WidgetCardStopBodyArrivals() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const arrivalsContext = useArrivalsContext();

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetCardStopBodyArrivals' });

	//
	// B. Render components

	if (!arrivalsContext.data.arrivals.length) {
		return (
			<View style={[styles.container, styles.noDataContainer]}>
				<NoDataLabel text={t('no_data')} />
			</View>
		);
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
