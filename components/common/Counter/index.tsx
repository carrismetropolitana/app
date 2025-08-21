/* * */

import { LiveIcon } from '@/components/common/LiveIcon';
import { NoVehicleIcon } from '@/components/common/NoVehicleIcon';
import { Text } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

interface Props {
	quantity: number
	type: 'lines' | 'stops' | 'vehicles'
}

/* * */
export default function Counter({ quantity, type }: Props) {
	//

	//
	// A. Setup Variables

	const { t } = useTranslation('translation', { keyPrefix: 'common' });
	const counterStyles = styles();

	//
	// B. Setup Variables

	return (
		<>
			{/* Lines Counter */}
			{quantity === 0 && type === 'lines' && <Text accessibilityHint="" accessibilityLabel="" accessibilityLanguage="" accessibilityRole="text" style={counterStyles.text}> {t('lineCounterZero')}</Text>}
			{quantity === 1 && type === 'lines' && <Text accessibilityHint="" accessibilityLabel="" accessibilityLanguage="" accessibilityRole="text" style={counterStyles.text}>{quantity} {t('lineCounterOne')}</Text>}
			{quantity > 1 && type === 'lines' && <Text accessibilityHint="" accessibilityLabel="" accessibilityLanguage="" accessibilityRole="text" style={counterStyles.text}>{quantity} {t('lineCounterOther')}</Text>}

			{/* Stops Counter */}
			{quantity === 0 && type === 'stops' && <Text accessibilityHint="" accessibilityLabel="" accessibilityLanguage="" accessibilityRole="text" style={counterStyles.text}>{t('stopCounterZero')}</Text>}
			{quantity === 1 && type === 'stops' && <Text accessibilityHint="" accessibilityLabel="" accessibilityLanguage="" accessibilityRole="text" style={counterStyles.text}>{quantity} {t('stopCounterOne')}</Text>}
			{quantity > 1 && type === 'stops' && <Text accessibilityHint="" accessibilityLabel="" accessibilityLanguage="" accessibilityRole="text" style={counterStyles.text}>{quantity} {t('stopCounterOther')}</Text>}

			{/* Vehicles Counter */}
			{quantity === 0 && type === 'vehicles' && (
				<View style={counterStyles.zeroCount}>
					<NoVehicleIcon />
					<Text accessibilityHint="" accessibilityLabel="" accessibilityLanguage="" accessibilityRole="text" style={counterStyles.textMuted}>{t('vehicleCounterZero')}</Text>
				</View>
			)}
			{quantity === 1 && type === 'vehicles' && (
				<View style={counterStyles.vehiclesCounter}>
					<LiveIcon />
					<Text accessibilityHint="" accessibilityLabel="" accessibilityLanguage="" accessibilityRole="text" style={counterStyles.textRealtime}>{quantity} {t('vehicleCounterOne')}</Text>
				</View>
			)}
			{quantity > 1 && type === 'vehicles' && (
				<View style={counterStyles.vehiclesCounter}>
					<LiveIcon />
					<Text accessibilityHint="" accessibilityLabel="" accessibilityLanguage="" accessibilityRole="text" style={counterStyles.textRealtime}>{quantity} {t('vehicleCounterOther')}</Text>
				</View>
			)}
		</>
	);

	//
}
