/* * */

import { SelectPatternExplainer } from '@/components/lines/SelectPatternExplainer';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { IconArrowBarToRight, IconArrowRight } from '@tabler/icons-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

/* * */

export function SelectPattern() {
	//

	//
	// A. Setup variables

	const lineDetailContext = useLinesDetailContext();
	const [selectedPattern, setSelectedPattern] = useState<string>();
	const [isFocus, setIsFocus] = useState(false);

	useEffect(() => {
		if (!selectedPattern) return;

		lineDetailContext.actions.setActivePattern(selectedPattern);
	}, [selectedPattern]);

	const dropdownData
    = lineDetailContext.data.valid_patterns?.map(pattern => ({ label: pattern.headsign, value: pattern.id })) ?? [];

	//
	// B. Render Components

	return (
		<View style={styles.container}>
			<SelectPatternExplainer />
			<Dropdown
				data={dropdownData}
				inputSearchStyle={styles.inputSearchStyle}
				labelField="label"
				maxHeight={300}
				onBlur={() => setIsFocus(false)}
				onFocus={() => setIsFocus(true)}
				placeholder={!isFocus ? 'Escolher um percurso/destino...' : '...'}
				renderLeftIcon={() => <IconArrowBarToRight color="#9696A0" size={24} />}
				renderRightIcon={() => <IconArrowRight color="#D2D2DC" size={20} />}
				searchPlaceholder="Pesquisar..."
				style={styles.dropdown}
				value={selectedPattern}
				valueField="value"
				onChange={(item) => {
					setSelectedPattern(item.value);
					setIsFocus(false);
				}}
				search
			/>
		</View>
	);

	//
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		color: '#9696A0',
		padding: 16,
	},
	dropdown: {
		borderColor: 'gray',
		borderRadius: 8,
		borderWidth: 0.5,
		height: 50,
		paddingHorizontal: 8,
	},
	inputSearchStyle: {
		fontSize: 16,
		height: 40,
	},

});
