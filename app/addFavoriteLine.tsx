/* * */

import { AddFavoriteLineScreen } from '@/components/widgets/create/AddFavoriteLineScreen';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { LinesListContextProvider } from '@/contexts/LinesList.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function AddFavoriteLine() {
	//

	//
	// A. Setup variables

	const params = useLocalSearchParams();
	const navigation = useNavigation();
	const themeContext = useThemeContext();
	const lineID = typeof params.lineId === 'string' ? params.lineId : Array.isArray(params.lineId) ? params.lineId[0] : undefined;
	const { t } = useTranslation('translation', { keyPrefix: 'addfavoriteline' });

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
			headerBackTitle: t('headerTitle'),
			headerStyle: {
				backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			},
			headerTitle: '',
		});
	}, [navigation]);

	//
	// C. Render components

	return (
		<LinesListContextProvider>
			<LinesDetailContextProvider>
				<StopsDetailContextProvider>
					<AddFavoriteLineScreen lineId={lineID} />
				</StopsDetailContextProvider>
			</LinesDetailContextProvider>
		</LinesListContextProvider>
	);

	//
}
