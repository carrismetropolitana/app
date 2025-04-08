import { Button, Overlay, Text } from '@rneui/themed';

interface Props {
	isVisible: boolean
	onBackdropPress: () => void
}

export default function AddFavoriteLine({ isVisible = false, onBackdropPress }: Props) {
	return (
		<Overlay isVisible={isVisible} onBackdropPress={onBackdropPress}>
			<Text>Hello!</Text>
			<Text>
				Welcome to React Native Elements
			</Text>
			<Button
				onPress={() => !isVisible}
				title="Start Building"
			/>
		</Overlay>
	);
}
