/* * */

import { LineBadge } from '@/components/lines/LineBadge';
import { useFavoritesContext } from '@/contexts/Favorites.context';
import { useLinesContext } from '@/contexts/Lines.context';
import { type Line } from '@carrismetropolitana/api-types/network';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
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

	//
	// B. Transform data

	const favoriteLinesData = useMemo(() => {
		const result: Line[] = [];
		favoritesContext.data.line_ids.forEach((lineId) => {
			const foundLineData = linesContext.actions.getLineDataById(lineId);
			if (foundLineData) result.push(foundLineData);
		});
		return result;
	}, [favoritesContext.data.line_ids, linesContext.data.lines]);

	//
	// C. Handle actions

	const handlePress = (lineId: string) => {
		router.push(`/lines/${lineId}`, { withAnchor: true });
	};

	//
	// D. Render components

	if (!favoriteLinesData.length) {
		return null;
	}

	return (
		<ScrollView style={styles.container} horizontal>
			{favoriteLinesData.map(item => (
				<TouchableOpacity key={item.id} onPress={() => handlePress(item.id)}>
					<LineBadge
						color={item.color}
						lineId={item.id}
						shortName={item.short_name}
						size="lg"
						textColor={item.text_color}
						withAlertIcon={true}
					/>
				</TouchableOpacity>
			))}
		</ScrollView>
	);

	//
}
