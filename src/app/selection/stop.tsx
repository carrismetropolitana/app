/* * */

import { CloseButton } from '@/components/common/CloseButton';
import { StopSelection } from '@/components/selection/stop/StopSelection';
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

	const { t } = useTranslation('translation', { keyPrefix: '_app.sitemap.selection/stop' });

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => <CloseButton />,
			headerShown: true,
			headerTitle: t('title'),
			presentation: 'modal',
		});
	}, [navigation]);

	const handleSelect = (stopId: string) => {
		router.dismissTo({
			params: { ...localSearchParams, return_to: undefined, stop_id: stopId },
			pathname: localSearchParams.return_to,
		} as unknown as Route); // FIXME: TypeScript issue
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
