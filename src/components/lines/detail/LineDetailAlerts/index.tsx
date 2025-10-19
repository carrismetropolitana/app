/* * */

import { AlertItem } from '@/components/alerts/AlertItem';
import { useAlertsContext } from '@/contexts/Alerts.context';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function LineDetailAlerts() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const alertsContext = useAlertsContext();
	const lineDetailContext = useLineDetailContext();

	const { t } = useTranslation('translation', { keyPrefix: 'lines.LineDetailAlerts' });

	//
	// B. Transform data

	const alertsData = useMemo(() => {
		if (!lineDetailContext.data.selected_line_id) return [];
		return alertsContext.actions.getSimplifiedAlertsByLineId(lineDetailContext.data.selected_line_id);
	}, [alertsContext.data.alerts, lineDetailContext.data.selected_line_id]);

	//
	// C. Render components

	if (!alertsData.length) {
		return null;
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{t('heading')}</Text>
			<ScrollView showsHorizontalScrollIndicator={false} horizontal>
				<View style={styles.alertsList}>
					{alertsData.map(alert => (
						<AlertItem key={alert.alert_id} data={alert} />
					))}
				</View>
			</ScrollView>
		</View>
	);

	//
}
