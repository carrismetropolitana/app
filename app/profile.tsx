/* * */

import ProfileScreen from '@/components/screens/ProfileScreen';
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
			headerShown: false,
			headerTitle: '',
			presentation: 'formSheet',
			sheetGrabberVisible: true,
		});
	}, [navigation]);
	//
	// A. Render components
	return <ProfileScreen />;
}
