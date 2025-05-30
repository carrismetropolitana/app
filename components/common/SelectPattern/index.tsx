/* * */

import { SelectPatternExplainer } from '@/components/lines/SelectPatternExplainer';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
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
	const { theme } = useThemeContext();
	const [selectedPattern, setSelectedPattern] = useState<string>();
	const [isFocus, setIsFocus] = useState(false);

	const styles = StyleSheet.create({
		container: {
			backgroundColor: theme.mode === 'light'
				? theming.colorSystemBackgroundLight100
				: theming.colorSystemBackgroundDark100,
			color: '#9696A0',
			padding: 16,
		},
		dropdown: {
			backgroundColor: theme.mode === 'light'
				? theming.colorSystemBackgroundLight100
				: theming.colorSystemBackgroundDark100,
			borderColor: 'gray',
			borderRadius: 8,
			borderWidth: 0.5,
			height: 50,
			paddingHorizontal: 8,
		},
		dropdownText: {
			color: theme.mode === 'light'
				? theming.colorSystemText100
				: theming.colorSystemText300,
			fontSize: 16,
		},
		inputContainer: {
			backgroundColor: theme.mode === 'light'
				? theming.colorSystemBackgroundLight100
				: theming.colorSystemBackgroundDark100,
		},
		inputSearch: {
			fontSize: 16,
			height: 40,
		},

	});

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
				containerStyle={styles.inputContainer}
				data={dropdownData}
				inputSearchStyle={styles.inputSearch}
				itemContainerStyle={styles.dropdown}
				itemTextStyle={styles.dropdownText}
				labelField="label"
				maxHeight={300}
				onBlur={() => setIsFocus(false)}
				onFocus={() => setIsFocus(true)}
				placeholder={!isFocus ? 'Escolher um percurso/destino...' : '...'}
				placeholderStyle={styles.dropdownText}
				renderLeftIcon={() => <IconArrowBarToRight color="#9696A0" size={24} />}
				renderRightIcon={() => <IconArrowRight color="#D2D2DC" size={20} />}
				searchPlaceholder="Pesquisar..."
				selectedTextStyle={styles.dropdownText}
				style={styles.dropdown}
				value={selectedPattern}
				valueField="value"
				activeColor={theme.mode === 'light'
					? theming.colorSystemBackgroundLight100
					: theming.colorSystemBackgroundDark100}
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
