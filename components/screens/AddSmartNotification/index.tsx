/* * */

import LinesListChooserModal from '@/app/(modal)/LinesListChooserModal';
import { Section } from '@/components/common/layout/Section';
import { SelectNotificationControl } from '@/components/common/SelectNotifcationControl';
import { LineBadge } from '@/components/lines/LineBadge';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { Routes } from '@/utils/routes';
import { Pattern, Waypoint } from '@carrismetropolitana/api-types/network';
import { Button, Input, ListItem, Text } from '@rn-vui/themed';
import { IconArrowLoopRight, IconArrowRight, IconCircle, IconCircleCheckFilled, IconPlayerPlayFilled, IconSearch, IconX } from '@tabler/icons-react-native';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Svg, { Circle, Rect } from 'react-native-svg';

import styles from './styles';

/* * */

export default function AddSmartNotificationScreen() {
	//

	//
	// A. Setup Variables
	const [lineChooserVisibility, setLineChooserVisibility] = useState(false);
	const [patternNames, setPatternNames] = useState<Record<string, string>>({});
	const [selectedStopId, setSelectedStopId] = useState<null | string>(null);
	const [selectedPatternId, setSelectedPatternId] = useState<null | string>(null);
	const linesDetailContext = useLinesDetailContext();
	const stopsContext = useStopsContext();
	const addFavoriteLineStyles = styles();
	const navigation = useNavigation();

	//
	// C. Handle actions
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

	useEffect(() => {
		setSelectedPatternId(null);
		linesDetailContext.actions.resetActivePattern();
	}, [linesDetailContext.data.line?.id]);

	useEffect(() => {
		if (selectedPatternId) {
			linesDetailContext.actions.setActivePattern(selectedPatternId);
		}
		else {
			linesDetailContext.actions.resetActivePattern();
		}
	}, [selectedPatternId, linesDetailContext.data.line?.id]);

	const exitScreen = () => {
		clearScreen();
		navigation.goBack();
	};

	const clearScreen = () => {
		linesDetailContext.actions.resetLineId();
		linesDetailContext.actions.resetActivePattern();
	};

	const handlePatternSelect = (item: string) => {
		if (selectedPatternId === item) {
			setSelectedPatternId(null);
			linesDetailContext.actions.resetActivePattern();
		}
		else {
			setSelectedPatternId(item);
			linesDetailContext.actions.setActivePattern(item);
		}
	};

	//
	// D. Render Components

	return (
		<ScrollView style={addFavoriteLineStyles.overlay}>
			<View style={addFavoriteLineStyles.container}>
				<Section
					heading="Notificação Inteligente"
					subheading="Utiliza todos os dias a mesma linha? Gostava de saber exatamente quando sair de casa, ou quando acabar de tomar o café, para ir para a paragem?"
				/>
				<View style={addFavoriteLineStyles.videoContainer}>
					<TouchableOpacity>
						<ListItem>
							<IconPlayerPlayFilled color="#3D85C6" fill="#3D85C6" size={24} />
							<ListItem.Content>
								<ListItem.Title style={addFavoriteLineStyles.listTitle}><Text>Ver Vídeo Explicativo</Text></ListItem.Title>
							</ListItem.Content>
							<ListItem.Chevron />
						</ListItem>
					</TouchableOpacity>
				</View>
				<Svg fill="none" height="36" style={addFavoriteLineStyles.svg} viewBox="0 0 12 36" width="100%">
					<Circle cx="6" cy="6" fill="#BEBEC8" r="6" />
					<Rect fill="#BEBEC8" height="30" width="2" x="5" y="6" />
				</Svg>
				<Text style={addFavoriteLineStyles.text}> Notificar-me quando um autocarro da linha </Text>
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
				<View>
					{linesDetailContext.data.line?.pattern_ids ? (
						<View>
							<Text style={{ fontWeight: 'bold', marginVertical: 8 }}>
								Linha {linesDetailContext.data.line.id} - {linesDetailContext.data.line.long_name}
							</Text>
							{linesDetailContext.data.line.pattern_ids.map((item) => {
								const isSelected = selectedPatternId === item;
								return (
									<ListItem
										key={item}
										onPress={() => handlePatternSelect(item)}
										style={{ backgroundColor: isSelected ? '#e6f7ff' : undefined }}
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
										{isSelected && <IconCircleCheckFilled color="#FFFFFF" fill="#3CB43C" size={24} />}
										{!isSelected && <IconCircle color="#9696A0" size={24} />}
									</ListItem>
								);
							})}
						</View>
					) : null}
				</View>

				<Svg fill="none" height="30" style={addFavoriteLineStyles.svg} viewBox="0 0 2 30" width="100%">
					<Rect fill="#BEBEC8" height="30" width="2" />
				</Svg>

				<Text style={addFavoriteLineStyles.text}>estiver a</Text>

				<View style={addFavoriteLineStyles.selectNotificationContol}>
					<Input containerStyle={addFavoriteLineStyles.input} placeholder="Valor" />
					<SelectNotificationControl />
				</View>

				<Svg fill="none" height="30" style={addFavoriteLineStyles.svg} viewBox="0 0 2 30" width="100%">
					<Rect fill="#BEBEC8" height="30" width="2" />
				</Svg>
				<Text style={addFavoriteLineStyles.text}>da paragem</Text>
				<View>
					{selectedPatternId && linesDetailContext.data.active_pattern && (
						linesDetailContext.data.active_pattern.path.map((waypoint: Waypoint) => {
							const stop = stopsContext.actions.getStopById(waypoint.stop_id);
							const isSelected = selectedStopId === waypoint.stop_id;
							return (
								<ListItem
									key={waypoint.stop_sequence}
									onPress={() => setSelectedStopId(waypoint.stop_id)}
									style={{ backgroundColor: isSelected ? '#e6f7ff' : undefined }}
								>
									<IconArrowLoopRight color="#C61D23" size={24} />
									<ListItem.Content>
										<ListItem.Title style={addFavoriteLineStyles.listTitle}>
											{stop ? <Text>{stop.long_name}</Text> : <Text>{waypoint.stop_id}</Text>}
										</ListItem.Title>
									</ListItem.Content>
									{isSelected && <IconCircleCheckFilled color="#3CB43C" size={24} />}
								</ListItem>
							);
						})
					)}
					<ListItem>
						<IconSearch color="#9696A0" size={24} />
						<ListItem.Content>
							<ListItem.Title style={addFavoriteLineStyles.listTitle}>
								<Text style={addFavoriteLineStyles.muted}>Alterar Paragem Selecionada</Text>
							</ListItem.Title>
						</ListItem.Content>
						<ListItem.Chevron />
					</ListItem>
				</View>

				<Svg fill="none" height="30" style={addFavoriteLineStyles.svg} viewBox="0 0 2 30" width="100%">
					<Rect fill="#BEBEC8" height="30" width="2" />
				</Svg>

				<Text style={addFavoriteLineStyles.text}>no período</Text>
				<View style={addFavoriteLineStyles.selectNotificationContol}>
					<Input containerStyle={addFavoriteLineStyles.input} placeholder="Valor" />
					<SelectNotificationControl />
				</View>

			</View>

			<Section
				heading="Atenção"
				subheading="Por favor teste esta funcionalidade antes de utilizar com confiança. Poderá ser necessário ajustar os tempos para garantir que chega ao local."
			/>

			<Button
				buttonStyle={addFavoriteLineStyles.saveButton}
				// onPress={clearScreen}
				title="Guardar"
				titleStyle={addFavoriteLineStyles.saveButtonText}
			/>

			<Button
				buttonStyle={addFavoriteLineStyles.saveButton}
				onPress={exitScreen}
				title="Eliminar"
				titleStyle={addFavoriteLineStyles.saveButtonText}
			/>

			<LinesListChooserModal
				isVisible={lineChooserVisibility}
				onBackdropPress={() => setLineChooserVisibility(!lineChooserVisibility)}
			/>
		</ScrollView>
	);

	//
}
