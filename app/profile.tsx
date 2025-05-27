/* * */

import ProfileScreen from '@/components/screens/ProfileScreen';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

/* * */

export default function Profile() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();

	useEffect(() => {
		navigation.setOptions({
			headerBackTitle: 'Editar Perfil',
			headerTitle: '',
		});
	}, [navigation]);

	//
	// B. Render components

	return (
		<LinesDetailContextProvider>
			<StopsDetailContextProvider>
				<ProfileScreen />
			</StopsDetailContextProvider>
		</LinesDetailContextProvider>
	);

	//
}
