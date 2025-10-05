/* * */

import { FavoriteToggle } from '@/components/common/FavoriteToggle';
import { LineBadge } from '@/components/lines/LineBadge';
import { useFavoritesContext } from '@/contexts/Favorites.context';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function LineDetailHeader() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const favoritesContext = useFavoritesContext();
	const lineDetailContext = useLineDetailContext();

	//
	// B. Transform data

	const isFavoriteLine = useMemo(() => {
		if (!lineDetailContext.data.selected_line) return false;
		return favoritesContext.data.line_ids.includes(lineDetailContext.data.selected_line.id);
	}, [favoritesContext.data.line_ids, lineDetailContext.data.selected_line]);

	//
	// C. Handle actions

	const handleToggleFavorite = () => {
		if (!lineDetailContext.data.selected_line) return;
		favoritesContext.actions.toggleFavoriteLineId(lineDetailContext.data.selected_line.id);
	};

	//
	// D. Render components

	if (!lineDetailContext.data.selected_line) {
		return null;
	}

	return (
		<View style={styles.container}>
			<View style={styles.row}>
				<LineBadge
					color={lineDetailContext.data.selected_line.color}
					shortName={lineDetailContext.data.selected_line.short_name}
					size="lg"
					textColor={lineDetailContext.data.selected_line.text_color}
				/>
				<FavoriteToggle
					color={lineDetailContext.data.selected_line.color}
					isActive={isFavoriteLine}
					onToggle={handleToggleFavorite}
				/>
			</View>
			<Text style={styles.lineLongName}>
				{lineDetailContext.data.selected_line.long_name}
			</Text>
		</View>
	);

	//
}
