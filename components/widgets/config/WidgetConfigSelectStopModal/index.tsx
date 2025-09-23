/* * */

import { StopsSelectionList } from '@/components/stops/list/StopsSelectionList';
import { type Stop } from '@carrismetropolitana/api-types/network';
import { IconCirclePlus } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Button, Modal, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetConfigSelectStopModalProps {
	isVisible: boolean
	onClose: () => void
	onSelectStop: (data: Stop) => void
}

/* * */

export function WidgetConfigSelectStopModal({ isVisible, onClose, onSelectStop }: WidgetConfigSelectStopModalProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetConfigSelectStopModal' });

	//
	// B. Handle actions

	const handleStopClick = (item: Stop) => {
		onSelectStop(item);
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
				<StopsSelectionList
					onPress={handleStopClick}
					replaceChevron={<IconCirclePlus size={24} />}
				/>
			</View>
		</Modal>
	);

	//
}
