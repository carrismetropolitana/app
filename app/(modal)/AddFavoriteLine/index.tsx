import { Section } from '@/components/common/layout/Section';
import { useLinesContext } from '@/contexts/Lines.context';
import { Button, ListItem, Overlay, Text } from '@rneui/themed';
import { IconPlayerPlayFilled, IconSearch } from '@tabler/icons-react-native';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
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

	const linesContext = useLinesContext();
	const [selectedLine, setSelectedLine] = useState('');
	const [patterns, setPatterns] = useState([]);
	const [selectedPatterns, setSelectedPatterns] = useState([]);

	//

	// B. Handle Actions
	console.log(linesContext.data.lines);
	//

	// C. Render Components

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
						<ListItem>
							<IconSearch color="#9696A0" size={24} />
							<ListItem.Content>
								<ListItem.Title style={styles.listTitle}>Alterar Linha Selecionada</ListItem.Title>
							</ListItem.Content>
							<ListItem.Chevron />
						</ListItem>
					</View>

					<Section heading="2. Escolher destinos " subheading="Pode escolher apenas os destinos que lhe interessam a partir desta paragem. Personalize o seu painel de informação único.">
						<View>
							<Text>HELLLO</Text>
						</View>
					</Section>

					<Section heading="3. Notificações " subheading="Pode escolher receber uma notificação sempre que existir um alerta para a paragem e para os destinos que selecionou.">
						<View>
							<Text>HELLLO</Text>
						</View>
					</Section>

					<Button buttonStyle={styles.saveButton} onPress={onBackdropPress} title="Guardar" titleStyle={styles.saveButtonText} />
					<Button buttonStyle={styles.deleteButton} onPress={onBackdropPress} title="Eliminar" titleStyle={styles.deleteButtonText} />
				</View>

			</SafeAreaView>
		</Overlay>
	);

	//
}
