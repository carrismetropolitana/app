import LinesListChooserModal from '@/app/(modal)/LinesListChooserModal';
import { Section } from '@/components/common/layout/Section';
import { LineBadge } from '@/components/lines/LineBadge';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { Routes } from '@/utils/routes';
import { Button, ListItem, Overlay, Text } from '@rneui/themed';
import { IconArrowRight, IconPlayerPlayFilled, IconSearch } from '@tabler/icons-react-native';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './styles';

interface Props {
	isVisible: boolean
	onBackdropPress: () => void
}

export default function AddFavoriteLine({ isVisible = false, onBackdropPress }: Props) {
	//

	//
	// A. Setup Variables

	const [lineChooserVissibility, setLineChooseVisibility] = useState(false);
	const linesDetailContext = useLinesDetailContext();

	//
	// B. Render Components

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

					<Section heading="Linha Favorita" subheading="Adicione a paragem da sua casa ou do seu trabalho como favorita. Assim, sempre que precisar, basta abrir a app para ver quais as próximas chegadas." />
					<View style={styles.videoContainer}>
						<TouchableOpacity>
							<ListItem>
								<IconPlayerPlayFilled color="#3D85C6" fill="#3D85C6" size={24} />
								<ListItem.Content>
									<ListItem.Title style={styles.listTitle}>Ver Vídeo Explicativo</ListItem.Title>
								</ListItem.Content>
								<ListItem.Chevron />
							</ListItem>
						</TouchableOpacity>
					</View>

					<Section heading="1. Seleciona Linha " subheading="Escolha uma linha para visualizar na página principal" />
					<View>
						<ListItem onPress={() => setLineChooseVisibility(true)}>
							<IconSearch color="#9696A0" size={24} />
							<ListItem.Content>
								<ListItem.Title style={styles.listTitle}>Alterar Linha Selecionada</ListItem.Title>
							</ListItem.Content>
							<ListItem.Chevron />
						</ListItem>
					</View>

					<Section heading="2. Escolher destinos " subheading="Pode escolher apenas os destinos que lhe interessam a partir desta paragem. Personalize o seu painel de informação único." />
					<View>
						{
							linesDetailContext.data.line?.pattern_ids.map((patternId) => {
								const [patternName, setPatternName] = useState<null | string>(null);

								// Fetch pattern name
								useEffect(() => {
									const fetchPatternName = async () => {
										try {
											const response = await fetch(`/api/patterns/${patternId}`);
											const data = await response.json();
											setPatternName(data.name);
										}
										catch (error) {
											console.error(`Failed to fetch pattern name for patternId ${patternId}`, error);
										}
									};

									fetchPatternName();
								}, [patternId]);

								return (
									<ListItem key={patternId}>
										<LineBadge color={linesDetailContext.data.line?.color} lineId={linesDetailContext.data.line?.id} size="lg" />
										<ListItem.Content>
											<ListItem.Title style={styles.listTitle}>
												<IconArrowRight />
												<Text>{patternName || 'Loading...'}</Text>
											</ListItem.Title>
										</ListItem.Content>
										<ListItem.CheckBox checked={false} />
									</ListItem>
								);
							})
						}
					</View>

					<Section heading="3. Notificações " subheading="Pode escolher receber uma notificação sempre que existir um alerta para a paragem e para os destinos que selecionou.">
						<View>
							<Text>HELLLO</Text>
						</View>
					</Section>

					<Button buttonStyle={styles.saveButton} onPress={onBackdropPress} title="Guardar" titleStyle={styles.saveButtonText} />
					<Button buttonStyle={styles.deleteButton} onPress={onBackdropPress} title="Eliminar" titleStyle={styles.deleteButtonText} />
				</View>
				<LinesListChooserModal isVisible={lineChooserVissibility} onBackdropPress={() => setLineChooseVisibility(!lineChooserVissibility)} />
			</SafeAreaView>
		</Overlay>
	);

	//
}
