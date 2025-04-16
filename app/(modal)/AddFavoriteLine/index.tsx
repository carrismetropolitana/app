/* * */

import LinesListChooserModal from '@/app/(modal)/LinesListChooserModal';
import { Section } from '@/components/common/layout/Section';
import { LineBadge } from '@/components/lines/LineBadge';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Routes } from '@/utils/routes';
import { Pattern } from '@carrismetropolitana/api-types/network';
import { Button, ListItem, Overlay, Text } from '@rneui/themed';
import { IconArrowLoopRight, IconArrowRight, IconCircle, IconCircleCheckFilled, IconNotification, IconPlayerPlayFilled, IconSearch, IconX } from '@tabler/icons-react-native';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './styles';

/* * */

interface Props {
	isVisible: boolean
	onBackdropPress: () => void
}

/* * */

export default function AddFavoriteLine({ isVisible = false, onBackdropPress }: Props) {
	//

	//
	// A. Setup Variables

	const [lineChooserVisibility, setLineChooserVisibility] = useState(false);
	const [patternNames, setPatternNames] = useState<Record<string, string>>({});

	const linesDetailContext = useLinesDetailContext();
	const themeContext = useThemeContext();
	const profileContext = useProfileContext();

	const addFavoriteLineStyles = styles();

	//
	// B. Fetch Data

	const clearScreen = () => {
		linesDetailContext.actions.resetLineId();
		onBackdropPress();
	};

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
		if (!linesDetailContext.data.line?.pattern_ids) return;

		const fetchPatterns = async () => {
			const patternName: Record<string, string> = {};
			const patterns = linesDetailContext.data.line?.pattern_ids;

			if (patterns) {
				await Promise.all(
					patterns.map(async (pattern) => {
						const data = await fetchPattern(pattern);

						if (data) {
							patternName[pattern] = data[0].headsign;
						}
					}),
				);

				setPatternNames(patternName);
			}
			else {
				return;
			}
		};

		fetchPatterns();
	}, [linesDetailContext.data.line?.pattern_ids]);

	//
	// C. Render Components

	return (
		<Overlay animationType="slide" isVisible={isVisible} onBackdropPress={clearScreen} style={addFavoriteLineStyles.overlay}>
			<SafeAreaView>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={addFavoriteLineStyles.container}>
						<View style={addFavoriteLineStyles.header}>
							<TouchableOpacity onPress={clearScreen} style={addFavoriteLineStyles.backButton}>
								<Text style={addFavoriteLineStyles.arrow}>←</Text>
								<Text style={addFavoriteLineStyles.backText}>Voltar</Text>
							</TouchableOpacity>
						</View>

						<Section
							heading="Linha Favorita"
							subheading="Adicione a paragem da sua casa ou do seu trabalho como favorita. Assim, sempre que precisar, basta abrir a app para ver quais as próximas chegadas."
						/>
						<View style={addFavoriteLineStyles.videoContainer}>
							<TouchableOpacity>
								<ListItem>
									<IconPlayerPlayFilled color="#3D85C6" fill="#3D85C6" size={24} />
									<ListItem.Content>
										<ListItem.Title style={addFavoriteLineStyles.listTitle}>Ver Vídeo Explicativo</ListItem.Title>
									</ListItem.Content>
									<ListItem.Chevron />
								</ListItem>
							</TouchableOpacity>
						</View>

						<Section
							heading="1. Selecionar Linha "
							subheading="Escolha uma linha para visualizar na página principal"
						/>
						<View>
							{linesDetailContext.data.line && (
								<ListItem>
									<IconArrowLoopRight color="#C61D23" size={24} />
									<ListItem.Content>
										<ListItem.Title style={addFavoriteLineStyles.listTitle}>
											{linesDetailContext.data.line.long_name}
										</ListItem.Title>
									</ListItem.Content>
									<IconX color="#9696A0" onPress={linesDetailContext.actions.resetLineId} size={24} />
								</ListItem>
							)}
							<ListItem onPress={() => setLineChooserVisibility(true)}>
								<IconSearch color="#9696A0" size={24} />
								<ListItem.Content>
									<ListItem.Title style={addFavoriteLineStyles.listTitle}>
										Alterar Linha Selecionada
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
								{linesDetailContext.data.line?.pattern_ids ? (
									linesDetailContext.data.line?.pattern_ids.map((item) => {
										const isFavorite = profileContext.data.profile?.widgets?.some(
											favorite =>
												favorite.data
												&& 'pattern_id' in favorite.data
												&& favorite.data.pattern_id === item,
										);

										return (
											<ListItem
												key={item}
												onPress={() => {
													profileContext.actions.toggleFavoriteLine([item]);
												}}
											>
												<LineBadge
													color={linesDetailContext.data.line?.color}
													lineId={linesDetailContext.data.lineId}
													size="lg"
												/>
												<IconArrowRight size={10} />
												<ListItem.Content>
													<ListItem.Title style={addFavoriteLineStyles.listTitle}>
														{patternNames[item] || 'Sem destino'}
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
											<ListItem.Title style={addFavoriteLineStyles.listTitle}>
												Selecione uma linha para ver os destinos.
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
							<ListItem onPress={() => setLineChooserVisibility(true)}>
								<IconNotification color="#E64B23" size={24} />
								<ListItem.Content>
									<ListItem.Title style={addFavoriteLineStyles.listTitle}>
										Notificações Intiligentes
									</ListItem.Title>
								</ListItem.Content>
								<ListItem.Chevron />
							</ListItem>
						</View>

						<View>
							<Button
								buttonStyle={addFavoriteLineStyles.saveButton}
								onPress={clearScreen}
								title="Fechar"
								titleStyle={addFavoriteLineStyles.saveButtonText}
							/>
						</View>

					</View>
					<LinesListChooserModal
						isVisible={lineChooserVisibility}
						onBackdropPress={() => setLineChooserVisibility(!lineChooserVisibility)}
					/>
				</ScrollView>
			</SafeAreaView>
		</Overlay>
	);

	//
}
