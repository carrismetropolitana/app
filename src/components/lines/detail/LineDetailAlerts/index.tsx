/* * */

import { AlertsCarousel } from '@/components/common/AlertsCarousel';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { Text } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

export function LineDetailAlerts() {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'lines.LineDetailAlerts' });
	const lineDetailsAlertStyles = styles();
	const lineDetailContext = useLineDetailContext();

	//
	// B. Render components

	if (!lineDetailContext.data.line || !lineDetailContext.data.active_alerts || lineDetailContext.data.active_alerts?.length === 0) {
		return null;
	}

	return (
		<View style={lineDetailsAlertStyles.alertWrapper}>
			<Text style={lineDetailsAlertStyles.titleText}>{t('heading')}</Text>
			<AlertsCarousel alerts={lineDetailContext.data.active_alerts} />
		</View>
	);

	//
}
