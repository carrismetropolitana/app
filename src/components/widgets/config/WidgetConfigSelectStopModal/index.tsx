/* * */

import { StopsSelection } from '@/components/stops/selection/StopsSelection';
import { useSystemVariables } from '@/theme/global';
import { type Stop } from '@carrismetropolitana/api-types/network';
import { IconCirclePlusFilled } from '@tabler/icons-react-native';
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
	const systemVariables = useSystemVariables();

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
				<StopsSelection
					onPress={handleStopClick}
					replaceChevron={<IconCirclePlusFilled color={systemVariables.status.ok} size={24} />}
					withSearchAutoFocus
				/>
			</View>
		</Modal>
	);

	//
}
