import { Button, Overlay, Text } from '@rneui/themed';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from '../AddFavoriteStop/styles';

interface Props {
	isVisible: boolean
	onBackdropPress: () => void
}

export default function AddFavoriteStop({ isVisible = false, onBackdropPress }: Props) {
	return (
		<Overlay isVisible={isVisible} onBackdropPress={onBackdropPress}>
			<SafeAreaView>
				<View style={styles.container}>
					<Button onPress={onBackdropPress} style={{ marginBottom: 10 }} title="Cancelar" />
				</View>

			</SafeAreaView>
		</Overlay>
	);
}
