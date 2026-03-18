/* * */

import { LineBadge } from '@/components/lines/LineBadge';
import { useAccessibilityContext } from '@/contexts/Accessibility.context';
import { useAccountContext } from '@/contexts/Account.context';
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
	const accountContext = useAccountContext();
	const accessibilityContext = useAccessibilityContext();

	const { t } = useTranslation();

	//
	// B. Transform data

	const favoriteLinesData = useMemo(() => {
		const result: Line[] = [];
		accountContext.data.account?.favorites.line_ids.forEach((lineId) => {
			const foundLineData = linesContext.actions.getLineDataById(lineId);
			if (foundLineData) result.push(foundLineData);
		});
		return result.sort((a, b) => a.id.localeCompare(b.id));
	}, [accountContext.data.account?.favorites.line_ids, linesContext.actions]);

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
					<Text style={styles.title}>{t($ => $.home.HomeScreenFavoriteLinesBar.list, {
						count: favoriteLinesData.length,
					})}
					</Text>
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
