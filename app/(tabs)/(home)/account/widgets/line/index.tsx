/* * */

import { WidgetLineConfig } from '@/components/widgets/config/WidgetLineConfig';
import { WidgetLineConfigContextProvider } from '@/contexts/WidgetLineConfig.context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useMemo } from 'react';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const searchParams = useLocalSearchParams();

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
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
		<WidgetLineConfigContextProvider widgetId={preparedWidgetId}>
			<WidgetLineConfig widgetId={preparedWidgetId} />
		</WidgetLineConfigContextProvider>
	);

	//
}
