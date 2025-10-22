/* * */

import { ArrivalRow } from '@/components/arrivals/ArrivalRow';
import { ListFootnote } from '@/components/list/ListFootnote';
import { ListTitle } from '@/components/list/ListTitle';
import { useArrivalsContext } from '@/contexts/Arrivals.context';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function StopDetailArrivalsList() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const { t } = useTranslation();

	const arrivalsContext = useArrivalsContext();

	//
	// B. Render components

	if (!arrivalsContext.data.arrivals.length) {
		return null;
	}

	return (
		<>
			<ListTitle title={t('stops.StopDetailArrivalsList.title')} />
			<View style={styles.container}>
				{arrivalsContext.data.arrivals.map((arrival, index) => (
					<ArrivalRow key={index} data={arrival} />
				))}
			</View>
			<ListFootnote text={t('stops.StopDetailArrivalsList.footnote')} />
		</>
	);

	//
}
