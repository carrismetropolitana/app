/* * */

import { SelectPatternExplainer } from '@/components/lines/SelectPatternExplainer';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Routes } from '@/utils/routes';
import { Pattern } from '@carrismetropolitana/api-types/network';
import { IconArrowBarToRight, IconArrowRight } from '@tabler/icons-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

/* * */

export function SelectPattern() {
	//
	// A. Setup variables
	const linesDetailContext = useLinesDetailContext();
	const { theme } = useThemeContext();
	const [patternNames, setPatternNames] = useState<Record<string, string>>({});
	const [patternVersionIds, setPatternVersionIds] = useState<Record<string, string>>({});
	const [selectedPatternId, setSelectedPatternId] = useState<null | string>(null);
	const [selectedVersionId, setSelectedVersionId] = useState<null | string>(null);
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

	const fetchPattern = async (patternId: string) => {
		try {
			const response = await fetch(`${Routes.API}/patterns/${patternId}`);
			const data: Pattern | Pattern[] = await response.json();
			if (Array.isArray(data)) {
				return data[0];
			}
			return data;
		}
		catch (error) {
			console.error(`Error fetching pattern ${patternId}:`, error);
			return null;
		}
	};

	useEffect(() => {
		if (!linesDetailContext.data.line?.pattern_ids) return;
		const fetchPatterns = async () => {
			const patternName: Record<string, string> = {};
			const patternVersionId: Record<string, string> = {};
			let patternId = '';
			const patterns = linesDetailContext.data.line?.pattern_ids;

			if (patterns) {
				await Promise.all(
					patterns.map(async (pattern) => {
						const data = await fetchPattern(pattern);
						if (data) {
							patternName[pattern] = data.headsign;
							patternVersionId[pattern] = data.version_id;
							patternId = data.id;
						}
					}),
				);
				setPatternNames(patternName);
				setPatternVersionIds(patternVersionId);
				setSelectedPatternId(patternId);
				setSelectedVersionId(patternVersionId[patternId] || null);
			}
			else {
				return;
			}
		};
		fetchPatterns();
	}, [linesDetailContext.data.line?.pattern_ids]);

	useEffect(() => {
		if (selectedVersionId) {
			linesDetailContext.actions.setActivePattern(selectedVersionId);
		}
		else {
			linesDetailContext.actions.resetActivePattern();
		}
	}, [selectedVersionId, linesDetailContext.data.line?.id]);

	const dropdownData = linesDetailContext.data.line?.pattern_ids?.map(patternId => ({
		label: patternNames[patternId] || 'Sem destino',
		value: patternId,
	})) ?? [];

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
				value={selectedPatternId}
				valueField="value"
				activeColor={theme.mode === 'light'
					? theming.colorSystemBackgroundLight100
					: theming.colorSystemBackgroundDark100}
				onChange={(item) => {
					setSelectedPatternId(item.value);
					setSelectedVersionId(patternVersionIds[item.value] || null);
					setIsFocus(false);
				}}
				search
			/>
		</View>
	);
}
