/* * */

import LinesListChooserModal from '@/app/(modal)/LinesListChooserModal';
import { HeaderExplainer } from '@/components/common/HeaderExplainer';
import { Section } from '@/components/common/layout/Section';
import { LineBadge } from '@/components/lines/LineBadge';
import { OpenAddSmartNotification } from '@/components/widgets/OpenAddSmartNotification';
import { WidgetActionsButtonGroup } from '@/components/widgets/WidgetsActionsButtonGroup';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Routes } from '@/utils/routes';
import { Pattern } from '@carrismetropolitana/api-types/network';
import { ListItem, Text } from '@rn-vui/themed';
import { IconArrowLoopRight, IconArrowRight, IconCircle, IconCircleCheckFilled, IconSearch, IconX } from '@tabler/icons-react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import styles from './styles';

/* * */

export default function AddFavoriteLineScreen() {
	//

	//
	// A. Setup Variables

	const [lineChooserVisibility, setLineChooserVisibility] = useState(false);
	const [patternNames, setPatternNames] = useState<Record<string, string>>({});
	const [selectedPatterns, setSelectedPatterns] = useState<string[]>([]);

	const isLight = useThemeContext().theme.mode === 'light';
	const { widgetId } = useLocalSearchParams<{ widgetId?: string }>();
	const linesDetailContext = useLinesDetailContext();
	const themeContext = useThemeContext();
	const profileContext = useProfileContext();
	const addFavoriteLineStyles = styles();
	const navigation = useNavigation();

	const backgroundColor = isLight ? theming.colorSystemBackgroundLight200 : theming.colorSystemBackgroundDark200;

	//
	// B. Fetch Data

	useEffect(() => {
		navigation.setOptions({
			headerStyle: { backgroundColor: backgroundColor },
			headerTitle: 'Linha Favorita',
		});
	}, [navigation]);

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
	// C. Handle actions

	const clearScreen = () => {
		setSelectedPatterns([]);
		linesDetailContext.actions.resetLineId();
		navigation.goBack();
	};

	function togglePattern(patternId: string) {
		setSelectedPatterns(prev =>
			prev.includes(patternId)
				? prev.filter(id => id !== patternId)
				: [...prev, patternId],
		);
	}

	useEffect(() => {
		if (widgetId && profileContext.data.widget_lines) {
			const widget = profileContext.data.widget_lines.find(w => w.data && w.data.type === 'lines' && (w.data.pattern_id === widgetId || (w.data.type === 'lines' ? String(w.settings?.display_order) === widgetId : false)));
			if (widget && widget.data.type === 'lines') {
				setSelectedPatterns([widget.data.pattern_id]);
			}
		}
	}, [widgetId, profileContext.data.widget_lines]);

	//
	// D. Render Components

	return (
		<ScrollView style={addFavoriteLineStyles.overlay}>
			<View style={addFavoriteLineStyles.container}>
				<HeaderExplainer
					heading="Linha Favorita"
					subheading="Adicione a paragem da sua casa ou do seu trabalho como favorita. Assim, sempre que precisar, basta abrir a app para ver quais as próximas chegadas."
				/>
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
									<Text>{linesDetailContext.data.line.long_name}</Text>
								</ListItem.Title>
							</ListItem.Content>
							<IconX color="#9696A0" onPress={linesDetailContext.actions.resetLineId} size={24} />
						</ListItem>
					)}
					<ListItem onPress={() => setLineChooserVisibility(true)}>
						<IconSearch color="#9696A0" size={24} />
						<ListItem.Content>
							<ListItem.Title style={addFavoriteLineStyles.listTitle}>
								<Text>Alterar Linha Selecionada</Text>
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
							<View>
								<Text style={{ fontWeight: 'bold', marginVertical: 8 }}>
									Linha {linesDetailContext.data.line.id} - {linesDetailContext.data.line.long_name}
								</Text>
								{linesDetailContext.data.line.pattern_ids.map((item) => {
									const isSelected = selectedPatterns.includes(item);
									return (
										<ListItem
											key={item}
											onPress={() => togglePattern(item)}
										>
											<LineBadge
												color={linesDetailContext.data.line?.color}
												lineId={linesDetailContext.data.lineId}
												size="lg"
											/>
											<IconArrowRight size={10} />
											<ListItem.Content>
												<ListItem.Title style={addFavoriteLineStyles.listTitle}>
													<Text>{patternNames[item] || 'Sem destino'}</Text>
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
						) : (
							<ListItem>
								<ListItem.Content>
									<ListItem.Title style={addFavoriteLineStyles.listTitle}>
										<Text>Selecione uma linha para ver os destinos.</Text>
									</ListItem.Title>
								</ListItem.Content>
							</ListItem>
						)}
					</View>
				</View>

				<OpenAddSmartNotification
					disabled={selectedPatterns.length === 0}
					heading="3. Notificações"
					subheading="Pode escolher receber uma notificação sempre que existir um alerta para a paragem e para os destinos que selecionou."
				/>

				<WidgetActionsButtonGroup
					dataToSubmit={{ data: { pattern_id: selectedPatterns[0], type: 'lines' }, settings: { is_open: true } }}
					length={selectedPatterns.length}
					onClear={() => clearScreen()}
					type="lines"
				/>

			</View>
			<LinesListChooserModal
				isVisible={lineChooserVisibility}
				onBackdropPress={() => setLineChooserVisibility(!lineChooserVisibility)}
			/>
		</ScrollView>
	);

	//
}
