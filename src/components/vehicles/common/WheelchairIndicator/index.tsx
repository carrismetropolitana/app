/* * */

import { useSystemVariables } from '@/theme/global';
import { IconBolt, IconDisabled2 } from '@tabler/icons-react-native';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WheelchairIndicatorProps {
	electricityPowered?: boolean
	enabled?: boolean
}

/* * */

export function WheelchairIndicator({ electricityPowered, enabled }: WheelchairIndicatorProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	//
	// B. Render components

	if (enabled) {
		return (
			<View style={styles.container}>
				<View style={[styles.main, styles.enabled]}>
					<IconDisabled2 color="#ffffff" size={32} />
				</View>
				{electricityPowered && (
					<View style={styles.bolt}>
						<IconBolt color={systemVariables.status.info} size={20} />
					</View>
				)}
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={[styles.main, styles.disabled]}>
				<IconDisabled2 color={systemVariables.text[300]} size={32} />
			</View>
			<View style={styles.strike} />
		</View>
	);

	//
}
