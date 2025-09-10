/* * */

import { LiveIcon } from '@/components/common/LiveIcon';
import { NoVehicleIcon } from '@/components/common/NoVehicleIcon';
import { useLocaleContext } from '@/contexts/Locale.context';
import { Text } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

interface Props {
	quantity?: number
	type: 'lines' | 'stops' | 'vehicles'
}

/* * */
export default function Counter({ quantity, type }: Props) {
	//

	//
	// A. Setup Variables

	const { t } = useTranslation('translation', { keyPrefix: 'common' });
	const counterStyles = styles();

	const localeContext = useLocaleContext();

	//
	// B. Render Components

	return (
		<>
			{/* Lines Counter */}
			{(quantity === undefined || quantity === null) && <Text accessibilityHint={t('lineCounterZeroHint')} accessibilityLabel={t('lineCounterZeroLabel')} accessibilityLanguage={localeContext.locale} accessibilityRole="text" style={counterStyles.text}>{t('lineCounterZero')}</Text>}
			{quantity === 0 && type === 'lines' && <Text accessibilityHint={t('lineCounterZeroHint')} accessibilityLabel={t('lineCounterZeroLabel')} accessibilityLanguage={localeContext.locale} accessibilityRole="text" style={counterStyles.text}> {t('lineCounterZero')}</Text>}
			{quantity === 1 && type === 'lines' && <Text accessibilityHint={t('lineCounterOneHint')} accessibilityLabel={t('lineCounterOneLabel')} accessibilityLanguage={localeContext.locale} accessibilityRole="text" style={counterStyles.text}>{quantity} {t('lineCounterOne')}</Text>}
			{typeof quantity === 'number' && quantity > 1 && type === 'lines' && <Text accessibilityHint={t('lineCounterOtherHint')} accessibilityLabel={t('lineCounterOtherLabel')} accessibilityLanguage={localeContext.locale} accessibilityRole="text" style={counterStyles.text}>{quantity} {t('lineCounterOther')}</Text>}

			{/* Stops Counter */}
			{(quantity === undefined || quantity === null) && <Text accessibilityHint={t('stopCounterZeroHint')} accessibilityLabel={t('stopCounterZeroLabel')} accessibilityLanguage={localeContext.locale} accessibilityRole="text" style={counterStyles.text}>{t('stopCounterZero')}</Text>}
			{quantity === 0 && type === 'stops' && <Text accessibilityHint={t('stopCounterZeroHint')} accessibilityLabel={t('stopCounterZeroLabel')} accessibilityLanguage={localeContext.locale} accessibilityRole="text" style={counterStyles.text}>{t('stopCounterZero')}</Text>}
			{quantity === 1 && type === 'stops' && <Text accessibilityHint={t('stopCounterOneHint')} accessibilityLabel={t('stopCounterOneLabel')} accessibilityLanguage={localeContext.locale} accessibilityRole="text" style={counterStyles.text}>{quantity} {t('stopCounterOne')}</Text>}
			{typeof quantity === 'number' && quantity > 1 && type === 'stops' && <Text accessibilityHint={t('stopCounterOtherHint')} accessibilityLabel={t('stopCounterOtherLabel')} accessibilityLanguage={localeContext.locale} accessibilityRole="text" style={counterStyles.text}>{quantity} {t('stopCounterOther')}</Text>}

			{/* Vehicles Counter */}
			{(quantity === undefined || quantity === null) && (
				<View style={counterStyles.zeroCount}>
					<NoVehicleIcon />
					<Text accessibilityHint={t('vehicleCounterZeroHint')} accessibilityLabel={t('vehicleCounterZeroLabel')} accessibilityLanguage={localeContext.locale} accessibilityRole="text" style={counterStyles.textMuted}>{t('vehicleCounterZero')}</Text>
				</View>
			)}
			{quantity === 0 && type === 'vehicles' && (
				<View style={counterStyles.zeroCount}>
					<NoVehicleIcon />
					<Text accessibilityHint={t('vehicleCounterZeroHint')} accessibilityLabel={t('vehicleCounterZeroLabel')} accessibilityLanguage={localeContext.locale} accessibilityRole="text" style={counterStyles.textMuted}>{t('vehicleCounterZero')}</Text>
				</View>
			)}
			{quantity === 1 && type === 'vehicles' && (
				<View style={counterStyles.vehiclesCounter}>
					<LiveIcon />
					<Text accessibilityHint={t('vehicleCounterOneHint')} accessibilityLabel={t('vehicleCounterOneLabel')} accessibilityLanguage={localeContext.locale} accessibilityRole="text" style={counterStyles.textRealtime}>{quantity} {t('vehicleCounterOne')}</Text>
				</View>
			)}
			{typeof quantity === 'number' && quantity > 1 && type === 'vehicles' && (
				<View style={counterStyles.vehiclesCounter}>
					<LiveIcon />
					<Text accessibilityHint={t('vehicleCounterOtherHint')} accessibilityLabel={t('vehicleCounterOtherLabel')} accessibilityLanguage={localeContext.locale} accessibilityRole="text" style={counterStyles.textRealtime}>{quantity} {t('vehicleCounterOther')}</Text>
				</View>
			)}
		</>
	);

	//
}
