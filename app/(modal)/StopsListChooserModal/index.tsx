/* * */

import Counter from '@/components/common/Counter';
import { VirtualizedListingStops } from '@/components/common/VitualizedListStops';
import { useStopsContext } from '@/contexts/Stops.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Stop } from '@carrismetropolitana/api-types/network';
import { Input, Overlay, Text } from '@rneui/themed';
import { IconCirclePlusFilled } from '@tabler/icons-react-native';
import { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './styles';
/* * */

interface Props {
	isVisible: boolean
	onBackdropPress: () => void
	selectedStopData: (data: Stop) => void
}

/* * */

export default function StopsListChooserModal({ isVisible, onBackdropPress, selectedStopData }: Props) {
	//

	//
	// A. Setup Variables

	const stopsContext = useStopsContext();
	const themeContext = useThemeContext();
	const [allStops] = useState<Stop[]>(stopsContext.data.stops);
	const [stopsSearch, setStopSearch] = useState('');
	const [selectedStop, setSelectedStop] = useState('');

	//
	// B.Fetch Data

	useEffect(() => {
		if (!selectedStop) return;
		const stopData: Stop | undefined = stopsContext.actions.getStopById(selectedStop);
		if (stopData) {
			selectedStopData(stopData);
		}
	}, [selectedStop]);

	const handleStopClick = (item: Stop) => {
		setSelectedStop(item.id);
		onBackdropPress();
	};

	const filteredStops = useMemo(() => {
		return allStops.filter(stop =>
			stop.long_name.toLowerCase().includes(stopsSearch.toLowerCase())
			|| String(stop.id).includes(stopsSearch),
		);
	}, [allStops, stopsSearch]);

	//
	// C. Render Components

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
							onChangeText={text => setStopSearch(text)}
							placeholder="Pesquisar por nome"
							value={stopsSearch}
						/>
						<Counter quantity={filteredStops.length} text="Encontradas" type="paragens" />
					</View>
					<VirtualizedListingStops
						data={filteredStops}
						itemClick={handleStopClick}
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
