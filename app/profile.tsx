/* * */

import ProfileScreen from '@/components/screens/ProfileScreen';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Profile() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const { t } = useTranslation('translation', { keyPrefix: 'layout' });

	useEffect(() => {
		navigation.setOptions({
			headerBackTitle: `${t('BackButton')}`,
			headerTitle: '',
			presentation: 'formSheet',
			sheetGrabberVisible: true,
		});
	}, [navigation]);

	//
	// A. Render components

	return (
		<LinesDetailContextProvider>
			<StopsDetailContextProvider>
				<ProfileScreen />
			</StopsDetailContextProvider>
		</LinesDetailContextProvider>
	);

	//
}
