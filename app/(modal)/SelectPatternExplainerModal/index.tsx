/* * */

import { Text } from '@rn-vui/themed';
import { Dialog } from '@rn-vui/themed';

/* * */

interface SelectPatternExplainerModalProps {
	isVisible: boolean
	onBackdropPress: () => void
}

/* * */

const SelectPatternExplainerModal = ({ isVisible, onBackdropPress }: SelectPatternExplainerModalProps) => {
	//

	// A. Render components

	return (
		<Dialog
			isVisible={isVisible}
			onBackdropPress={onBackdropPress}
		>
			<Dialog.Title title="Dialog Title" />
			<Text>Dialog body text. Add relevant information here.</Text>
		</Dialog>
	);

	//
};

export default SelectPatternExplainerModal;
