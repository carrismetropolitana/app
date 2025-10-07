/* * */

import { SearchBar } from '@/components/common/SearchBar';
import { usePatternSelectionContext } from '@/components/selection/pattern/context/PatternSelection.context';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface PatternSelectionMainToolbarProps {
	withSafeArea?: boolean
	withSearchAutoFocus?: boolean
}

/* * */

export function PatternSelectionMainToolbar({ withSafeArea, withSearchAutoFocus }: PatternSelectionMainToolbarProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const patternSelectionContext = usePatternSelectionContext();

	//
	// B. Render components

	return (
		<View style={[styles.row, withSafeArea && styles.withSafeArea]}>
			<SearchBar
				autoFocus={withSearchAutoFocus}
				onChange={patternSelectionContext.actions.updateFilterBySearch}
				value={patternSelectionContext.filters.by_search}
			/>
		</View>
	);

	//
}
