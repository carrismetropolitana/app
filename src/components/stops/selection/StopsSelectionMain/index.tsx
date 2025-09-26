/* * */

import { type StopsSelectionProps } from '@/components/stops/selection/StopsSelection';
import { StopsSelectionMainList } from '@/components/stops/selection/StopsSelectionMainList';
import { StopsSelectionMainMap } from '@/components/stops/selection/StopsSelectionMainMap';
import { StopsSelectionMainToolbar } from '@/components/stops/selection/StopsSelectionMainToolbar';
import { useStopsSelectionContext } from '@/contexts/StopsSelection.context';
import { type Stop } from '@carrismetropolitana/api-types/network';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function StopsSelectionMain({ addToRecentsOnPress, onPress, withSafeArea, withSearchAutoFocus, ...props }: StopsSelectionProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const stopsSelectionContext = useStopsSelectionContext();

	//
	// B. Handle actions

	const handlePress = (item: Stop) => {
		if (addToRecentsOnPress) stopsSelectionContext.actions.addToRecent(item);
		if (onPress) onPress(item);
	};

	//
	// C. Render components

	return (
		<>

			<StopsSelectionMainToolbar withSafeArea={withSafeArea} withSearchAutoFocus={withSearchAutoFocus} />

			<View style={stopsSelectionContext.flags.view_mode === 'list' ? styles.visible : styles.hidden}>
				<StopsSelectionMainList onPress={handlePress} {...props} />
			</View>

			<View style={stopsSelectionContext.flags.view_mode === 'map' ? styles.visible : styles.hidden}>
				<StopsSelectionMainMap onPress={handlePress} {...props} />
			</View>

		</>
	);

	//
}
