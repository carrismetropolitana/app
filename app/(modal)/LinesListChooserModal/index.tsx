/* * */

import Counter from '@/components/common/Counter';
import { VirtualizedListingLines } from '@/components/common/VitualizedListLines';
import { useLinesContext } from '@/contexts/Lines.context';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Line } from '@carrismetropolitana/api-types/network';
import { Input, Overlay, Text } from '@rn-vui/themed';
import { IconCirclePlusFilled } from '@tabler/icons-react-native';
import { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './styles';

/* * */

interface Props {
	isVisible: boolean
	onBackdropPress: () => void
}

/* * */

export default function LinesListChooserModal({ isVisible, onBackdropPress }: Props) {
	//

	//
	// A. Setup Variables

	const linesDetailContext = useLinesDetailContext();
	const linesContext = useLinesContext();
	const themeContext = useThemeContext();
	const [allLines] = useState<Line[]>(linesContext.data.lines);
	const [allMunicipalities] = useState(linesContext.data.municipalities);
	const [linesMunicipalities, setLineMunicipalities] = useState<string[]>();
	const [lineSearch, setLineSearch] = useState('');
	const [selectedLine, setSelectedLine] = useState('');

	//
	// B.Fetch Data

	useEffect(() => {
		if (!selectedLine) return;
		linesDetailContext.actions.setLineId(selectedLine);
	}, [selectedLine]);

	const getMunicipalityNames = (ids: (number | string)[]) => {
		return ids
			.map((id) => {
				const municipality = allMunicipalities.find(m => String(m.id) === String(id));
				if (!municipality) {
					console.warn(`Municipality with ID ${id} not found`);
					return null;
				}
				return municipality.name;
			})
			.filter((name): name is string => name !== null);
	};

	const filteredLines = useMemo(() => {
		return allLines.filter(line =>
			line.long_name.toLowerCase().includes(lineSearch.toLowerCase())
			|| String(line.id).includes(lineSearch),
		);
	}, [allLines, lineSearch]);

	//
	// C. Handle Actions

	const handleLineClick = (item: Line) => {
		if (!allMunicipalities) return;

		const municipalityNames = getMunicipalityNames(item.municipality_ids);
		setLineMunicipalities(municipalityNames);
		setSelectedLine(item.id);
		onBackdropPress();
	};

	//
	// D. Render Components

	return (
		<Overlay animationType="slide" isVisible={isVisible} onBackdropPress={onBackdropPress}>
			<SafeAreaView style={{ flex: 1 }}>
				<View style={styles.container}>
					<View style={styles.header}>
						<TouchableOpacity onPress={onBackdropPress} style={styles.backButton}>
							<Text style={styles.arrow}>←</Text>
							<Text style={styles.backText}>Voltar</Text>
						</TouchableOpacity>
					</View>

					<View>
						<Input
							clearButtonMode="while-editing"
							onChangeText={text => setLineSearch(text)}
							placeholder="Pesquisar por número ou nome"
							value={lineSearch}
						/>
						<Counter quantity={filteredLines.length} text="Encontradas" type="linhas" />
					</View>
					<VirtualizedListingLines
						data={filteredLines}
						itemClick={handleLineClick}
						municipality={linesMunicipalities}
						size="lg"
						icon={(
							<IconCirclePlusFilled
								fill="#3CB43C"
								size={24}
								color={
									themeContext.theme.mode === 'light'
										? theming.colorSystemBackgroundLight100
										: theming.colorSystemBackgroundDark100
								}
							/>
						)}
					/>
				</View>
			</SafeAreaView>
		</Overlay>
	);

	//
}
