import { Section } from '@/components/common/layout/Section';
import { LineBadge } from '@/components/lines/LineBadge';
import { useProfileContext } from '@/contexts/Profile.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { useStopsDetailContext } from '@/contexts/StopsDetail.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Routes } from '@/utils/routes';
import { Pattern, Stop } from '@carrismetropolitana/api-types/network';
import { Button, ListItem, Overlay, Text } from '@rneui/themed';
import { IconArrowLoopRight, IconArrowRight, IconBusStop, IconCircle, IconCircleCheckFilled, IconNotification, IconPlayerPlayFilled, IconSearch } from '@tabler/icons-react-native';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import useSWR from 'swr';

import StopsListChooserModal from '../StopsListChooserModal';
import styles from './styles';

interface Props {
	isVisible: boolean
	onBackdropPress: () => void
}

export default function AddFavoriteStop({ isVisible = false, onBackdropPress }: Props) {
	// A. Setup Variables
	const [stopChooserVisibility, setStopChooserVisibility] = useState(false);
	const [selectedStopPatterns, setStopPatterns] = useState<string[]>([]);
	const [selectedStop, setSelectedStop] = useState<Stop | undefined>(undefined);
	const [selectedStopId, setSelectedStopId] = useState<string>('');
	const [patternNames, setPatternNames] = useState<Record<string, string>>({});

	const themeContext = useThemeContext();
	const profileContext = useProfileContext();

	const addFavoriteStopStyles = styles();

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

	// B. Handle Actions
	const handleSelectedStop = (stopData: Stop) => {
		setSelectedStopId(stopData.id);
		setStopPatterns(stopData.pattern_ids);
		setSelectedStop(stopData);
	};

	useEffect(() => {
		if (!selectedStopPatterns) return;

		const fetchPatterns = async () => {
			const patternName: Record<string, string> = {};

			await Promise.all(
				selectedStopPatterns.map(async (pattern) => {
					const data = await fetchPattern(pattern);
					if (data) {
						patternName[pattern] = data[0].headsign;
					}
				}),
			);

			setPatternNames(patternName);
			console.log(patternName);
		};

		fetchPatterns();
	}, [selectedStopPatterns]);

	// C. Render Components
	return (
		<Overlay
			animationType="slide"
			isVisible={isVisible}
			onBackdropPress={onBackdropPress}
			style={addFavoriteStopStyles.overlay}
		>
			<SafeAreaView>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={addFavoriteStopStyles.container}>
						<View style={addFavoriteStopStyles.header}>
							<TouchableOpacity onPress={onBackdropPress} style={addFavoriteStopStyles.backButton}>
								<Text style={addFavoriteStopStyles.arrow}>←</Text>
								<Text style={addFavoriteStopStyles.backText}>Voltar</Text>
							</TouchableOpacity>
						</View>

						<Section
							heading="Paragem Favorita"
							subheading="Adicione a paragem da sua casa ou do seu trabalho como favorita. Assim, sempre que precisar, basta abrir a app para ver quais as próximas chegadas."
						/>
						<View style={addFavoriteStopStyles.videoContainer}>
							<TouchableOpacity>
								<ListItem>
									<IconPlayerPlayFilled color="#3D85C6" fill="#3D85C6" size={24} />
									<ListItem.Content>
										<ListItem.Title style={addFavoriteStopStyles.listTitle}>
											Ver Vídeo Explicativo
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
											{selectedStop.long_name}
										</ListItem.Title>
									</ListItem.Content>
								</ListItem>
							)}
							<ListItem onPress={() => setStopChooserVisibility(true)}>
								<IconSearch color="#9696A0" size={24} />
								<ListItem.Content>
									<ListItem.Title style={addFavoriteStopStyles.listTitle}>
										Alterar Paragem Selecionada
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
								{selectedStopPatterns.length > 0 ? (
									selectedStopPatterns.map((patternId) => {
										const lineId = patternId.split('_')[0];
										const isFavorite = profileContext.data.profile?.widgets?.some(
											favorite =>
												favorite.data
												&& favorite.data.type === 'stops'
												&& 'pattern_id' in favorite.data.pattern_ids,
										);

										return (
											<ListItem
												key={patternId}
												onPress={() => {
													profileContext.actions.toggleFavoriteStop(selectedStopId, patternId);
												}}
											>
												<LineBadge
													color="#FF6900"
													lineId={lineId}
													size="lg"
												/>
												<IconArrowRight size={10} />
												<ListItem.Content>
													<ListItem.Title style={addFavoriteStopStyles.listTitle}>
														{patternNames[patternId] || 'Sem destino'}
													</ListItem.Title>
												</ListItem.Content>
												{isFavorite ? (
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
									})
								) : (
									<ListItem>
										<ListItem.Content>
											<ListItem.Title style={addFavoriteStopStyles.listTitle}>
												Selecione uma paragem para ver os destinos.
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
										Notificações Intiligentes
									</ListItem.Title>
								</ListItem.Content>
								<ListItem.Chevron />
							</ListItem>
						</View>

						<View>
							<Button
								buttonStyle={addFavoriteStopStyles.saveButton}
								onPress={onBackdropPress}
								title="Fechar"
								titleStyle={addFavoriteStopStyles.saveButtonText}
							/>
						</View>
					</View>
					<StopsListChooserModal
						isVisible={stopChooserVisibility}
						onBackdropPress={() => setStopChooserVisibility(!stopChooserVisibility)}
						selectedStopData={stopData => handleSelectedStop(stopData)}
					/>
				</ScrollView>
			</SafeAreaView>
		</Overlay>
	);
}
