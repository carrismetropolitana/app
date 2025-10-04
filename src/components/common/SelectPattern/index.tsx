/* * */

import { useLinesContext } from '@/contexts/Lines.context';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { useOperationalDateContext } from '@/contexts/OperationalDate.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Pattern } from '@carrismetropolitana/api-types/network';
import { IconArrowBarToRight, IconArrowRight } from '@tabler/icons-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

/* * */

export function SelectPattern() {
	//

	//
	// A. Setup variables

	const linesContext = useLinesContext();
	const operationalDateContext = useOperationalDateContext();
	const lineDetailContext = useLineDetailContext();

	const { theme } = useThemeContext();
	const [selectedPatternId, setSelectedPatternId] = useState<null | string>(null);
	const [selectedVersionId, setSelectedVersionId] = useState<null | string>(null);
	const [isFocus, setIsFocus] = useState(false);

	const [availablePatternsData, setAvailablePatternsData] = useState<Pattern[]>([]);

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
			height: 60,
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
		(async () => {
			if (!lineDetailContext.data.line?.pattern_ids) return;
			const fetchResult: Pattern[] = [];
			for (const patternId of lineDetailContext.data.line.pattern_ids) {
				const validPatternData = await linesContext.actions.getValidPatternVersionForOperationalDate(patternId, operationalDateContext.data.selected_date?.operational_date || operationalDateContext.data.today.operational_date);
				if (validPatternData) fetchResult.push(validPatternData);
			}
			setAvailablePatternsData(fetchResult);
		})();
	}, [lineDetailContext.data.line?.pattern_ids]);

	useEffect(() => {
		if (selectedVersionId) {
			lineDetailContext.actions.setActivePattern(selectedVersionId);
		}
		else {
			lineDetailContext.actions.resetActivePattern();
		}
	}, [selectedVersionId, lineDetailContext.data.line?.id]);

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<Dropdown
				activeColor={theming.colorBrand}
				closeModalWhenSelectedItem={false}
				containerStyle={styles.inputContainer}
				data={availablePatternsData}
				inputSearchStyle={styles.inputSearch}
				itemContainerStyle={styles.dropdown}
				itemTextStyle={styles.dropdownText}
				labelField="headsign"
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
				value={selectedPatternId}
				valueField="version_id"
				onChange={(item) => {
					setSelectedPatternId(item.value);
					setSelectedVersionId(item.version_id || null);
					setIsFocus(false);
				}}
				search
			/>
		</View>
	);
}
