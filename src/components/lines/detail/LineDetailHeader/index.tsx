/* * */

import { FavoriteToggle } from '@/components/common/FavoriteToggle';
import { LineBadge } from '@/components/lines/LineBadge';
import { useAccountContext } from '@/contexts/Account.context';
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

	const accountContext = useAccountContext();
	const lineDetailContext = useLineDetailContext();

	//
	// B. Transform data

	const isFavoriteLine = useMemo(() => {
		if (!lineDetailContext.data.selected_line) return;
		return accountContext.data.ref.current?.favorites.line_ids.includes(lineDetailContext.data.selected_line.id);
	}, [accountContext.data.ref.current?.favorites.line_ids, lineDetailContext.data.selected_line]);

	//
	// C. Handle actions

	const handleToggleFavorite = (value: boolean) => {
		if (!lineDetailContext.data.selected_line) return;
		accountContext.actions.favoriteLineId(value ? 'add' : 'remove', lineDetailContext.data.selected_line.id);
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
					lineId={lineDetailContext.data.selected_line.id}
					size="lg"
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
