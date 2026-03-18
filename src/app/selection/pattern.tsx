/* * */

import { CloseButton } from '@/components/common/CloseButton';
import { PatternSelection } from '@/components/selection/pattern/PatternSelection';
import { type OperationalDate } from '@tmlmobilidade/types';
import { type Route, router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const localSearchParams = useLocalSearchParams<{ line_id: string, operational_date: OperationalDate, pattern_id: string, return_to: Route }>();

	const { t } = useTranslation();

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => <CloseButton />,
			headerShown: true,
			headerTitle: t($ => $._app.sitemap['selection/pattern'].title),
			presentation: 'modal',
		});
	}, [navigation, t]);

	const handleSelect = (patternId: string) => {
		router.dismissTo({
			params: { ...localSearchParams, pattern_id: patternId, return_to: undefined },
			pathname: localSearchParams.return_to,
		} as unknown as Route); // FIXME: TypeScript issue
	};

	//
	// C. Render components

	return (
		<PatternSelection
			onSelect={handleSelect}
			selectedLineId={localSearchParams.line_id}
			selectedOperationalDate={localSearchParams.operational_date}
			selectedPatternId={localSearchParams.pattern_id}
		/>
	);

	//
}
