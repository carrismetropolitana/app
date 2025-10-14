/* * */

import { CloseButton } from '@/components/common/CloseButton';
import { LineSelection } from '@/components/selection/line/LineSelection';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const localSearchParams = useLocalSearchParams<{ return_to: string }>();

	const { t } = useTranslation('translation', { keyPrefix: '_app.sitemap.selection/line' });

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

	const handleSelect = (lineId: string) => {
		router.dismissTo({
			params: { line_id: lineId },
			pathname: localSearchParams.return_to,
		});
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
