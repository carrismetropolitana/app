/* * */

import { LinesSelectionList } from '@/components/lines/list/LinesSelectionList';
import { type Line } from '@carrismetropolitana/api-types/network';
import { router } from 'expo-router';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function LinesList() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Handle actions

	const handlePress = (item: Line) => {
		router.push(`/lines/${item.id}`);
	};

	//
	// C. Render components

	return (
		<View style={styles.container}>
			<LinesSelectionList
				onPress={handlePress}
				addToRecentsOnPress
			/>
		</View>
	);

	//
}
