import { Text } from '@rneui/themed';
import { Dialog } from '@rneui/themed';

interface SelectPatternExplainerModalProps {
	isVisible: boolean
	onBackdropPress: () => void
}

export const SelectPatternExplainerModal = ({ isVisible, onBackdropPress }: SelectPatternExplainerModalProps) => {
	return (
		<Dialog
			isVisible={isVisible}
			onBackdropPress={onBackdropPress}
		>
			<Dialog.Title title="Dialog Title" />
			<Text>Dialog body text. Add relevant information here.</Text>
		</Dialog>
	);
};
