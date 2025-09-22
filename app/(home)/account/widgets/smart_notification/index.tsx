/* * */

import { WidgetSmartNotificationConfig } from '@/components/widgets/config/WidgetSmartNotificationConfig';
import { WidgetSmartNotificationConfigContextProvider } from '@/contexts/WidgetSmartNotificationConfig.context';
import { useSystemVariables } from '@/theme/global';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useMemo } from 'react';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const searchParams = useLocalSearchParams();
	const systemVariables = useSystemVariables();

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
			headerStyle: {
				backgroundColor: systemVariables.background[100],
			},
			headerTitle: '',
		});
	}, [navigation]);

	const preparedWidgetId = useMemo(() => {
		if (!searchParams.widget_id) return;
		if (Array.isArray(searchParams.widget_id)) return searchParams.widget_id[0];
		return searchParams.widget_id;
	}, [searchParams.widget_id]);

	//
	// C. Render components

	return (
		<WidgetSmartNotificationConfigContextProvider widgetId={preparedWidgetId}>
			<WidgetSmartNotificationConfig widgetId={preparedWidgetId} />
		</WidgetSmartNotificationConfigContextProvider>
	);

	//
}
