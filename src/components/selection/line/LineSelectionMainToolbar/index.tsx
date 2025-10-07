/* * */

import { SearchBar } from '@/components/common/SearchBar';
import { useLineSelectionContext } from '@/components/selection/line/context/LineSelection.context';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface LineSelectionMainToolbarProps {
	withSafeArea?: boolean
	withSearchAutoFocus?: boolean
}

/* * */

export function LineSelectionMainToolbar({ withSafeArea, withSearchAutoFocus }: LineSelectionMainToolbarProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const lineSelectionContext = useLineSelectionContext();

	//
	// B. Render components

	return (
		<View style={[styles.row, withSafeArea && styles.withSafeArea]}>
			<SearchBar
				autoFocus={withSearchAutoFocus}
				onChange={lineSelectionContext.actions.updateFilterBySearch}
				value={lineSelectionContext.filters.by_search}
			/>
		</View>
	);

	//
}
