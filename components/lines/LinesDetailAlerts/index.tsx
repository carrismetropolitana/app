/* * */

import { AlertsCarousel } from '@/components/common/AlertsCarousel';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { Text } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

export function LinesDetailAlerts() {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'lines.LinesDetailAlerts' });
	const lineDetailsAlertStyles = styles();
	const linesDetailContext = useLinesDetailContext();

	//
	// B. Render components

	if (!linesDetailContext.data.line || !linesDetailContext.data.active_alerts || linesDetailContext.data.active_alerts?.length === 0) {
		return null;
	}

	return (
		<View style={lineDetailsAlertStyles.alertWrapper}>
			<Text style={lineDetailsAlertStyles.titleText}>{t('heading')}</Text>
			<AlertsCarousel alerts={linesDetailContext.data.active_alerts} />
		</View>
	);

	//
}
