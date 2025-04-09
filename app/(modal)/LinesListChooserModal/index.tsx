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
	const [allLines, setAllLines] = useState<Line[]>(linesContext.data.lines);
	const [allMuniciplaities, setAllMunicipalities] = useState<Municipality[]>(linesContext.data.municipalities);
	const [searchedLine, setSearchedLine] = useState<Line>();
	const [patterns, setPatterns] = useState([]);
	const [selectedPatterns, setSelectedPatterns] = useState([]);
	const [lineSearch, setLineSearch] = useState('');
	const [selectedLine, setSelectedLine] = useState('');

	//
	// B.Fetch Data

	useEffect(() => {
		if (!selectedLine) return;
		linesDetailContext.actions.setLineId(selectedLine);
	}, [selectedLine]);

	const handleLineClick = (item: Line) => {
		const municipalityNames = getMunicipalityNames(item.municipality_ids);
		console.log(`Selected Line: ${item.id}, Municipalities: ${municipalityNames.join(', ')}`);
		setSelectedLine(item.id);
	};

	const getMunicipalityNames = (ids: string[]) => {
		return ids
			.map((id) => {
				const municipality = allMuniciplaities.find(municipality => municipality.id === id);
				return municipality ? municipality.name : 'Unknown Municipality';
			})
			.filter(name => name !== 'Unknown Municipality');
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

					{/* <FlatList
							data={allLines}
							keyExtractor={(item, index) => index.toString()}
							renderItem={renderLines}
							scrollEnabled={false}
							showsVerticalScrollIndicator={false}
						/> */}

					<VirtualizedListingLines data={allLines} icon={<IconCirclePlusFilled color="#3CB43C" />} itemClick={handleLineClick} size="lg" />

				</View>
			</SafeAreaView>
		</Overlay>
	);

	//
}
