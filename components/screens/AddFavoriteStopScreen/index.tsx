/* * */

import StopsListChooserModal from '@/app/(modal)/StopsListChooserModal';
import { Section } from '@/components/common/layout/Section';
import { LineBadge } from '@/components/lines/LineBadge';
import { useLinesContext } from '@/contexts/Lines.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Routes } from '@/utils/routes';
import { Pattern, Stop } from '@carrismetropolitana/api-types/network';
import { Button, ListItem, Text } from '@rn-vui/themed';
import { IconArrowRight, IconBusStop, IconCircle, IconCircleCheckFilled, IconNotification, IconPlayerPlayFilled, IconSearch, IconX } from '@tabler/icons-react-native';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import styles from './styles';

/* * */

export default function AddFavoriteStopScreen() {
	//

	//
	// A. Setup Variables

	const [stopChooserVisibility, setStopChooserVisibility] = useState(false);
	const [selectedStopPatterns, setStopPatterns] = useState<string[]>([]);
	const [selectedStop, setSelectedStop] = useState<Stop | undefined>(undefined);
	const [selectedStopId, setSelectedStopId] = useState<string>('');
	const [patternNames, setPatternNames] = useState<Record<string, string>>({});

	const themeContext = useThemeContext();
	const profileContext = useProfileContext();
	const linesContext = useLinesContext();

	const addFavoriteStopStyles = styles();
	const navigation = useNavigation();

	//
	// B. Handle Actions

	useEffect(() => {
		navigation.setOptions({
			headerTitle: 'Paragem Favorita',
		});
	}, [navigation]);

	const handleSelectedStop = (stopData: Stop) => {
		setSelectedStopId(stopData.id);
		setSelectedStop(stopData);
		const favoriteStopWidget = profileContext.data.widget_stops?.find(widget => widget.data && widget.data.type === 'stops' && widget.data.stop_id === stopData.id);
		const favoritedPatterns = favoriteStopWidget?.data.type === 'stops' ? favoriteStopWidget.data.pattern_ids : [];
		setStopPatterns(favoritedPatterns);
	};

	const clearSelection = () => {
		setSelectedStop(undefined);
		setStopPatterns([]);
		setSelectedStopId('');
		setPatternNames({});
		navigation.goBack();
	};

	//
	// C. Fetch Data

	const fetchPattern = async (patternId: string) => {
		try {
			const response = await fetch(`${Routes.API}/patterns/${patternId}`);
			const data: Pattern = await response.json();
			return data;
		}
		catch (error) {
			console.error(`Error fetching pattern ${patternId}:`, error);
			return null;
		}
	};

	useEffect(() => {
		if (!selectedStop || !selectedStop.pattern_ids) return;

		const fetchPatterns = async () => {
			const patternName: Record<string, string> = {};
			await Promise.all(
				selectedStop.pattern_ids.map(async (pattern) => {
					const data = await fetchPattern(pattern);
					if (data) {
						patternName[pattern] = data[0].headsign;
					}
				}),
			);
			setPatternNames(patternName);
		};
		fetchPatterns();
	}, [selectedStop]);

	//
	// D. Render Components

	function togglePattern(patternId: string, selectedPatterns: string[], setSelectedPatterns: (patterns: string[]) => void) {
		if (selectedPatterns.includes(patternId)) {
			setSelectedPatterns(selectedPatterns.filter(id => id !== patternId));
		}
		else {
			setSelectedPatterns([...selectedPatterns, patternId]);
		}
	}

	return (

		<ScrollView style={addFavoriteStopStyles.container}>

			<View style={addFavoriteStopStyles.firstHeader}>
				<Section
					heading="Paragem Favorita"
					subheading="Adicione a paragem da sua casa ou do seu trabalho como favorita. Assim, sempre que precisar, basta abrir a app para ver quais as próximas chegadas."
				/>
			</View>
			<View style={addFavoriteStopStyles.videoContainer}>
				<TouchableOpacity>
					<ListItem>
						<IconPlayerPlayFilled color="#3D85C6" fill="#3D85C6" size={24} />
						<ListItem.Content>
							<ListItem.Title style={addFavoriteStopStyles.listTitle}>
								<Text>Ver Vídeo Explicativo</Text>
							</ListItem.Title>
						</ListItem.Content>
						<ListItem.Chevron />
					</ListItem>
				</TouchableOpacity>
			</View>

			<Section
				heading="1. Selecionar Paragem "
				subheading="Escolha uma paragem para visualizar na página principal"
			/>
			<View>
				{selectedStop && (
					<ListItem>
						<IconBusStop color="#FF6900" size={24} />
						<ListItem.Content>
							<ListItem.Title style={addFavoriteStopStyles.listTitle}>
								<Text>{selectedStop.long_name}</Text>
							</ListItem.Title>
						</ListItem.Content>
						<IconX color="#9696A0" onPress={clearSelection} size={24} />
					</ListItem>
				)}
				<ListItem onPress={() => setStopChooserVisibility(true)}>
					<IconSearch color="#9696A0" size={24} />
					<ListItem.Content>
						<ListItem.Title style={addFavoriteStopStyles.listTitle}>
							<Text>Alterar Paragem Selecionada</Text>
						</ListItem.Title>
					</ListItem.Content>
					<ListItem.Chevron />
				</ListItem>
			</View>

			<View style={{ marginBottom: 20, marginTop: 20 }}>
				<Section
					heading="2. Escolher destinos "
					subheading="Pode escolher apenas os destinos que lhe interessam a partir desta paragem. Personalize o seu painel de informação único."
				/>
				<View>
					{selectedStop && selectedStop.pattern_ids.length > 0 ? (
						Object.entries(
							selectedStop.pattern_ids.reduce((acc: Record<string, string[]>, patternId: string) => {
								const lineId = patternId.split('_')[0];
								if (!acc[lineId]) acc[lineId] = [];
								acc[lineId].push(patternId);
								return acc;
							}, {}),
						).map(([lineId, patternIds]) => {
							const line = linesContext.data.lines.find(line => line.id === lineId);
							const lineColor = line?.color;
							return (
								<View key={lineId} style={{ marginBottom: 16 }}>
									<Text style={[addFavoriteStopStyles.listTitle, { marginBottom: 4 }]}>Linha {lineId}{line?.long_name ? ` - ${line.long_name}` : ''}</Text>
									{patternIds.map((patternId) => {
										const isSelected = selectedStopPatterns.includes(patternId);
										return (
											<ListItem
												key={patternId}
												onPress={() => togglePattern(patternId, selectedStopPatterns, setStopPatterns)}
											>
												<LineBadge
													color={lineColor}
													lineId={lineId}
													size="lg"
												/>
												<IconArrowRight size={10} />
												<ListItem.Content>
													<ListItem.Title style={addFavoriteStopStyles.listTitle}>
														{patternNames[patternId] || 'Sem destino'}
													</ListItem.Title>
												</ListItem.Content>
												{isSelected ? (
													<IconCircleCheckFilled
														fill="#3CB43C"
														size={24}
														color={
															themeContext.theme.mode === 'light'
																? theming.colorSystemBackgroundLight100
																: theming.colorSystemBackgroundDark100
														}
													/>
												) : (
													<IconCircle color="grey" size={24} />
												)}
											</ListItem>
										);
									})}
								</View>
							);
						})
					) : (
						<ListItem>
							<ListItem.Content>
								<ListItem.Title style={addFavoriteStopStyles.listTitle}>
									<Text>Selecione uma paragem para ver os destinos.</Text>
								</ListItem.Title>
							</ListItem.Content>
						</ListItem>
					)}
				</View>
			</View>

			<View style={{ marginBottom: 30 }}>
				<Section
					heading="3. Notificações "
					subheading="Pode escolher receber uma notificação sempre que existir um alerta para a paragem e para os destinos que selecionou."
				/>
				<ListItem onPress={() => setStopChooserVisibility(true)}>
					<IconNotification color="#E64B23" size={24} />
					<ListItem.Content>
						<ListItem.Title style={addFavoriteStopStyles.listTitle}>
							<Text>Ativar Notificações</Text>
						</ListItem.Title>
					</ListItem.Content>
					<ListItem.Chevron />
				</ListItem>
			</View>

			<View>
				<Button
					buttonStyle={addFavoriteStopStyles.saveButton}
					disabled={!selectedStopId}
					title="Guardar"
					titleStyle={addFavoriteStopStyles.saveButtonText}
					onPress={async () => {
						if (selectedStopId && selectedStopPatterns.length > 0) {
							await profileContext.actions.toggleWidget({ type: 'stops', stopId: selectedStopId, pattern_ids: selectedStopPatterns });
							clearSelection();
						}
					}}
				/>
				<Button
					buttonStyle={addFavoriteStopStyles.saveButton}
					onPress={clearSelection}
					title="Fechar"
					titleStyle={addFavoriteStopStyles.saveButtonText}
				/>
			</View>
			<StopsListChooserModal
				isVisible={stopChooserVisibility}
				onBackdropPress={() => setStopChooserVisibility(!stopChooserVisibility)}
				selectedStopData={stopData => handleSelectedStop(stopData)}
			/>
		</ScrollView>
	);

	//
}
