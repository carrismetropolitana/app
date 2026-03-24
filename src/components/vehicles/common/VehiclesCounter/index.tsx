/* * */

import { LiveIcon } from '@/components/arrivals/LiveIcon';
import { useSystemVariables } from '@/theme/global';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface VehiclesCounterProps {
	qty?: number
	visibleIfZero?: boolean
}

/* * */

export function VehiclesCounter({ qty, visibleIfZero }: VehiclesCounterProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	const { t } = useTranslation();

	//
	// B. Render components

	if (qty === 0 && !visibleIfZero) {
		return null;
	}

	if (qty === 0) {
		return (
			<View style={styles.container}>
				<LiveIcon status="inactive" />
				<Text style={[styles.label, { color: systemVariables.text[300] }]}>{t($ => $.common.VehiclesCounter.label.zero)}</Text>
			</View>
		);
	}

	if (qty === 1) {
		return (
			<View style={styles.container}>
				<LiveIcon />
				<Text style={[styles.label, { color: systemVariables.status.live }]}>{t($ => $.common.VehiclesCounter.label.single)}</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<LiveIcon />
			<Text style={[styles.label, { color: systemVariables.status.live }]}>{t($ => $.common.VehiclesCounter.label.plural, {
				count: qty,
			})}
			</Text>
		</View>
	);

	//
}
