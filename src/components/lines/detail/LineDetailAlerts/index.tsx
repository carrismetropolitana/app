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

	const { t } = useTranslation();

	//
	// B. Transform data

	const alertsData = useMemo(() => {
		if (!lineDetailContext.data.selected_line_id) return [];
		return alertsContext.actions.getAlertsByLineId(lineDetailContext.data.selected_line_id);
	}, [alertsContext.actions, lineDetailContext.data.selected_line_id]);

	//
	// C. Render components

	if (!alertsData.length) {
		return null;
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{t($ => $.lines.LineDetailAlerts.heading)}</Text>
			<ScrollView showsHorizontalScrollIndicator={false} horizontal>
				<View style={styles.alertsList}>
					{alertsData.map(alert => (
						<AlertItem key={alert._id} data={alert} />
					))}
				</View>
			</ScrollView>
		</View>
	);

	//
}
