/* * */

import { useStopSelectionContext } from '@/components/selection/stop/context/StopSelection.context';
import { type StopSelectionProps } from '@/components/selection/stop/StopSelection';
import { StopSelectionMainList } from '@/components/selection/stop/StopSelectionMainList';
import { StopSelectionMainMap } from '@/components/selection/stop/StopSelectionMainMap';
import { StopSelectionMainToolbar } from '@/components/selection/stop/StopSelectionMainToolbar';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function StopSelectionMain({ addToRecentsOnPress, onSelect, withSafeArea, withSearchAutoFocus, ...props }: StopSelectionProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const stopsSelectionContext = useStopSelectionContext();

	//
	// B. Handle actions

	const handleSelect = (stopId: string) => {
		onSelect?.(stopId);

		if (addToRecentsOnPress) {
			requestAnimationFrame(() => {
				stopsSelectionContext.actions.addToRecent(stopId);
			});
		}
	};

	//
	// C. Render components

	return (
		<>

			<StopSelectionMainToolbar withSafeArea={withSafeArea} withSearchAutoFocus={withSearchAutoFocus} />

			<View style={stopsSelectionContext.flags.view_mode === 'list' ? styles.visible : styles.hidden}>
				<StopSelectionMainList onSelect={handleSelect} {...props} />
			</View>

			<View style={stopsSelectionContext.flags.view_mode === 'map' ? styles.visible : styles.hidden}>
				<StopSelectionMainMap onSelect={handleSelect} {...props} />
			</View>

		</>
	);

	//
}
