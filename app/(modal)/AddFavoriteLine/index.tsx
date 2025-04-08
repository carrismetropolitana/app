import { Section } from '@/components/common/layout/Section';
import { Button, ListItem, Overlay, Text } from '@rneui/themed';
import { IconPlayerPlayFilled } from '@tabler/icons-react-native';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './styles';

interface Props {
	isVisible: boolean
	onBackdropPress: () => void
}

export default function AddFavoriteLine({ isVisible = false, onBackdropPress }: Props) {
	return (
		<Overlay isVisible={isVisible} onBackdropPress={onBackdropPress}>
			<SafeAreaView>
				<View style={styles.container}>
					<Section heading="Linha Favorita" subheading="Adicione a paragem da sua casa ou do seu trabalho como favorita. Assim, sempre que precisar, basta abrir a app para ver quais as próximas chegadas." />
					<View style={{ marginBottom: 20, padding: 0, width: '100%' }}>
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

					<Section heading="1. Seleciona Linha " subheading="Escolha uma linha para visualizar na página principal">
						<View>
							<Text>HELLLO</Text>
						</View>
					</Section>

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
}
