/* * */

import { SelectPatternExplainer } from '@/components/lines/SelectPatternExplainer';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { IconArrowRight } from '@tabler/icons-react-native';
import { useState } from 'react';
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

	const dropdownData
    = lineDetailContext.data.valid_patterns?.map(pattern => ({ label: pattern.headsign, value: pattern.version_id.toString() })) ?? [];

	//
	// Render Components

	return (
		<View style={styles.container}>
			<SelectPatternExplainer />
			<Dropdown
				data={dropdownData}
				// iconStyle={styles.iconStyle}
				inputSearchStyle={styles.inputSearchStyle}
				labelField="label"
				maxHeight={300}
				onBlur={() => setIsFocus(false)}
				onFocus={() => setIsFocus(true)}
				placeholder={!isFocus ? 'Select pattern' : '...'}
				// placeholderStyle={styles.placeholderStyle}
				renderLeftIcon={() => <IconArrowRight size={24} />}
				searchPlaceholder="Search patterns..."
				// selectedTextStyle={styles.selectedTextStyle}
				style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
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
