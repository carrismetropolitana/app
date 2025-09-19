/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { WidgetConfigSelectLineListItem } from '@/components/widgets/common/WidgetConfigSelectLineListItem';
import { useLinesContext } from '@/contexts/Lines.context';
import { type Line } from '@carrismetropolitana/api-types/network';
import { useTranslation } from 'react-i18next';
import { Button, Modal, View, VirtualizedList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

	const lineContext = useLinesContext();

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
		<Modal animationType="slide" presentationStyle="formSheet" visible={isVisible}>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.header}>
					<Button onPress={onClose} title={t('close_button')} />
				</View>
				{/* <LineSearchBar /> */}
				<VirtualizedList
					data={lineContext.data.lines}
					getItem={(data: [], index: number) => data[index]}
					getItemCount={data => data?.length || 0}
					keyExtractor={item => item.id}
					ListEmptyComponent={(<NoDataLabel />)}
					renderItem={({ item }: { item: Line }) => <WidgetConfigSelectLineListItem item={item} onPress={handleLineClick} />}
				/>
			</SafeAreaView>
		</Modal>
	);

	//
}
