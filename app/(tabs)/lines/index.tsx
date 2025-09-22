/* * */

import { LinesScreen } from '@/components/screens/LinesScreen';
import { LinesListContextProvider } from '@/contexts/LinesList.context';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();

	const { t } = useTranslation('translation', { keyPrefix: 'lines.Page' });

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
			headerShown: false,
			headerTitle: t('title'),
		});
	}, [navigation]);

	//
	// C. Render components

	return (
		<LinesListContextProvider>
			<LinesScreen />
		</LinesListContextProvider>

	);

	//
};
