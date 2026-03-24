/* * */

import { SearchBar } from '@/components/common/SearchBar';
import { useStopSelectionContext } from '@/components/selection/stop/context/StopSelection.context';
import { useSystemVariables } from '@/theme/global';
import { IconListSearch, IconMapSearch } from '@tabler/icons-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface StopSelectionMainToolbarProps {
	withSafeArea?: boolean
	withSearchAutoFocus?: boolean
}

/* * */

export function StopSelectionMainToolbar({ withSafeArea, withSearchAutoFocus }: StopSelectionMainToolbarProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	const stopsSelectionContext = useStopSelectionContext();

	const { t } = useTranslation();

	//
	// B. Handle actions

	const handleToggleViewMode = (mode: 'list' | 'map') => {
		stopsSelectionContext.actions.toggleViewMode(mode);
		void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
	};

	//
	// C. Render components

	return (
		<View style={[
			styles.row,
			withSafeArea && styles.withSafeArea,
			stopsSelectionContext.flags.view_mode === 'map' && styles.rowMapOverlay,
		]}
		>
			<SearchBar
				autoFocus={withSearchAutoFocus}
				onChange={stopsSelectionContext.actions.updateFilterBySearch}
				value={stopsSelectionContext.filters.by_search}
			/>
			{stopsSelectionContext.flags.view_mode === 'list' && (
				<TouchableOpacity
					accessibilityLabel={t($ => $.selection.StopSelectionMainToolbar.toggle_to_map)}
					onPress={() => handleToggleViewMode('map')}
					style={styles.toggle}
				>
					<IconMapSearch color={systemVariables.text[100]} size={32} />
				</TouchableOpacity>
			)}
			{stopsSelectionContext.flags.view_mode === 'map' && (
				<TouchableOpacity
					accessibilityLabel={t($ => $.selection.StopSelectionMainToolbar.toggle_to_list)}
					onPress={() => handleToggleViewMode('list')}
					style={styles.toggle}
				>
					<IconListSearch color={systemVariables.text[100]} size={32} />
				</TouchableOpacity>
			)}
		</View>
	);

	//
}
