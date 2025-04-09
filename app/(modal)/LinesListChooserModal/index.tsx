/* * */

import Counter from '@/components/common/Counter';
import { VirtualizedListingLines } from '@/components/common/VitualizedListLines';
import { useLinesContext } from '@/contexts/Lines.context';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { Municipality } from '@carrismetropolitana/api-types/locations';
import { Line } from '@carrismetropolitana/api-types/network';
import { Overlay, Text } from '@rneui/themed';
import { IconCirclePlusFilled } from '@tabler/icons-react-native';
import { useEffect, useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
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
	const [allLines] = useState<Line[]>(linesContext.data.lines);
	const [allMunicipalities] = useState(linesContext.data.municipalities);
	const [linesMunicipalities, setLineMunicipalities] = useState<string[]>();
	const [searchedLine, setSearchedLine] = useState<Line>();
	const [lineSearch, setLineSearch] = useState('');
	const [selectedLine, setSelectedLine] = useState('');

	//
	// B.Fetch Data

	useEffect(() => {
		if (!selectedLine) return;
		linesDetailContext.actions.setLineId(selectedLine);
	}, [selectedLine]);

	const handleLineClick = (item: Line) => {
		if (!allMunicipalities) return;

		const municipalityNames = getMunicipalityNames(item.municipality_ids);
		const linePatterns = item.pattern_ids;

		console.log('linePatterns', linePatterns);

		setLineMunicipalities(municipalityNames);
		setSelectedLine(item.id);
	};

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

	//
	// D. Render Components

	return (
		<Overlay animationType="slide" isVisible={isVisible} onBackdropPress={onBackdropPress}>
			<SafeAreaView>
				<View style={styles.container}>
					<View style={styles.header}>
						<TouchableOpacity onPress={onBackdropPress} style={styles.backButton}>
							<Text style={styles.arrow}>←</Text>
							<Text style={styles.backText}>Voltar</Text>
						</TouchableOpacity>
					</View>

					<View>
						<TextInput onChangeText={text => setLineSearch(text)} placeholder="Pesquisar por número ou nome" value={lineSearch} />
						<Counter quantity={linesContext.data.lines.length} text="Encontradas" type="linhas" />
					</View>
					<VirtualizedListingLines data={allLines} icon={<IconCirclePlusFilled color="#3CB43C" />} itemClick={handleLineClick} municiplality={linesMunicipalities} size="lg" />
				</View>
			</SafeAreaView>
		</Overlay>
	);

	//
}
