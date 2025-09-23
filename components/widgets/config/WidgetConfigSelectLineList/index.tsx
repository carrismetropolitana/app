/* * */

import { LinesSelectionList } from '@/components/lines/list/LinesSelectionList';
import { type Line } from '@carrismetropolitana/api-types/network';
import { useTranslation } from 'react-i18next';
import { Button, Modal, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetConfigSelectLineListProps {
	isVisible: boolean
	onClose: () => void
	onSelectLine: (data: Line) => void
}

/* * */

export function WidgetConfigSelectLineList({ isVisible, onClose, onSelectLine }: WidgetConfigSelectLineListProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetConfigSelectLineList' });

	//
	// B. Handle actions

	const handleLineClick = (item: Line) => {
		onSelectLine(item);
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
				<LinesSelectionList onPress={handleLineClick} />
			</View>
		</Modal>
	);

	//
}
