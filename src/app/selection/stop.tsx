/* * */

import { CloseButton } from '@/components/common/CloseButton';
import { StopSelection } from '@/components/selection/stop/StopSelection';
import { type Href, type RoutePath, router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const localSearchParams = useLocalSearchParams<{ return_to: RoutePath }>();

	const { t } = useTranslation();

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => <CloseButton />,
			headerShown: true,
			headerTitle: t($ => $._app.sitemap['selection/stop'].title),
			presentation: 'modal',
		});
	}, [navigation, t]);

	const handleSelect = (stopId: string) => {
		router.dismissTo({
			params: { ...localSearchParams, return_to: undefined, stop_id: stopId },
			pathname: localSearchParams.return_to,
		} as unknown as Href); // FIXME: TypeScript issue
	};

	//
	// C. Render components

	return (
		<StopSelection
			onSelect={handleSelect}
			addToRecentsOnPress
			withSearchAutoFocus
		/>
	);

	//
}
