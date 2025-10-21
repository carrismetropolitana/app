/* * */

import { LineBadge } from '@/components/lines/LineBadge';
import { useAccessibilityContext } from '@/contexts/Accessibility.context';
import { useFavoritesContext } from '@/contexts/Favorites.context';
import { useLinesContext } from '@/contexts/Lines.context';
import { type Line } from '@carrismetropolitana/api-types/network';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { useStyles } from './styles';

/* * */

export function HomeScreenFavoriteLinesBar() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const linesContext = useLinesContext();
	const favoritesContext = useFavoritesContext();
	const accessibilityContext = useAccessibilityContext();

	const { t } = useTranslation('translation', { keyPrefix: 'home.HomeScreenFavoriteLinesBar' });

	//
	// B. Transform data

	const favoriteLinesData = useMemo(() => {
		const result: Line[] = [];
		favoritesContext.data.line_ids.forEach((lineId) => {
			const foundLineData = linesContext.actions.getLineDataById(lineId);
			if (foundLineData) result.push(foundLineData);
		});
		return result.sort((a, b) => a.id.localeCompare(b.id));
	}, [favoritesContext.data.line_ids, linesContext.data.lines]);

	//
	// C. Handle actions

	const handlePress = (lineId: string) => {
		router.push(`/lines/${lineId}`);
	};

	//
	// D. Render components

	if (!favoriteLinesData.length) {
		return null;
	}

	return (
		<ScrollView horizontal>
			<View style={styles.container}>

				{accessibilityContext.flags.screen_reader && (
					<Text style={styles.title}>{t('list', { count: favoriteLinesData.length })}</Text>
				)}

				{favoriteLinesData.map(item => (
					<LineBadge
						key={item.id}
						lineId={item.id}
						onPress={handlePress}
						withAlertIcon
					/>
				))}
			</View>
		</ScrollView>
	);

	//
}
