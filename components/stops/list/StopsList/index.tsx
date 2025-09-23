/* * */

import { StopsSelectionList } from '@/components/stops/list/StopsSelectionList';
import { type Stop } from '@carrismetropolitana/api-types/network';
import { router } from 'expo-router';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function StopsList() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Handle actions

	const handlePress = (item: Stop) => {
		router.push(`/stops/${item.id}`);
	};

	//
	// C. Render components

	return (
		<View style={styles.container}>
			<StopsSelectionList
				onPress={handlePress}
				addToRecentsOnPress
			/>
		</View>
	);

	//
}
