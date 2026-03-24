/* * */

import { CloseButton } from '@/components/common/CloseButton';
import { LineSelection } from '@/components/selection/line/LineSelection';
import { type Route, router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const localSearchParams = useLocalSearchParams<{ return_to: Route }>();

	const { t } = useTranslation();

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => <CloseButton />,
			headerShown: true,
			headerTitle: t($ => $._app.sitemap['selection/line'].title),
			presentation: 'modal',
		});
	}, [navigation, t]);

	const handleSelect = (lineId: string) => {
		router.dismissTo({
			params: { ...localSearchParams, line_id: lineId, return_to: undefined },
			pathname: localSearchParams.return_to,
		} as unknown as Route); // FIXME: TypeScript issue
	};

	//
	// C. Render components

	return (
		<LineSelection
			onSelect={handleSelect}
			addToRecentsOnPress
		/>
	);

	//
}
