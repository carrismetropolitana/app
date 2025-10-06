/* * */

import { LinesSelectionList } from '@/components/lines/list/LinesSelectionList';
import { type Line, Pattern } from '@carrismetropolitana/api-types/network';
import { IconCirclePlus } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Button, Modal, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface LineDetailSelectPatternModalProps {
	isVisible: boolean
	onClose: () => void
	onSelectPattern: (patternId: string) => void
}

/* * */

export function LineDetailSelectPatternModal({ isVisible, onClose, onSelectPattern }: LineDetailSelectPatternModalProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.LineDetailSelectPatternModal' });

	//
	// B. Handle actions

	const handleSelect = (item: Pattern) => {
		onSelectPattern(item.id);
		onClose();
	};

	//
	// C. Render components

	return (
		<Modal
			animationType="slide"
			onRequestClose={onClose}
			presentationStyle="formSheet"
			visible={isVisible}
		>
			<View style={styles.header}>
				<Button onPress={onClose} title={t('close_button')} />
			</View>
			<View style={styles.content}>
				<LinesSelectionList
					onPress={handleSelect}
					replaceChevron={<IconCirclePlus size={24} />}
				/>
			</View>
		</Modal>
	);

	//
}
