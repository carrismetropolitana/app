/* * */

import AddSmartNotificationScreen from '@/components/screens/AddSmartNotificationScreen';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { LinesListContextProvider } from '@/contexts/LinesList.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';

/* * */

export default function AddSmartNotification() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const themeContext = useThemeContext();
	const params = useLocalSearchParams();
	const smartNotificationID = typeof params.smartNotificationId === 'string' ? params.smartNotificationId : Array.isArray(params.smartNotificationId) ? params.smartNotificationId[0] : undefined;
	const lineID = typeof params.lineId === 'string' ? params.lineId : Array.isArray(params.lineId) ? params.lineId[0] : undefined;
	const patternId = typeof params.patternId === 'string' ? params.patternId : Array.isArray(params.patternId) ? params.patternId[0] : undefined;
	const id = smartNotificationID ? smartNotificationID : lineID;

	console.log(id);

	useEffect(() => {
		navigation.setOptions({
			headerBackTitle: 'Voltar',
			headerStyle: {
				backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			},
			headerTitle: '',
		});
	}, [navigation]);

	//
	// B. Render components

	return (
		<LinesListContextProvider>
			<LinesDetailContextProvider>
				<StopsDetailContextProvider>
					<AddSmartNotificationScreen Id={id} PatternId={patternId} />
				</StopsDetailContextProvider>
			</LinesDetailContextProvider>
		</LinesListContextProvider>
	);

	//
}
