/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { WidgetConfigSelectStopListItem } from '@/components/widgets/common/WidgetConfigSelectStopListItem';
import { useStopsContext } from '@/contexts/Stops.context';
import { type Stop } from '@carrismetropolitana/api-types/network';
import { useTranslation } from 'react-i18next';
import { Button, Modal, SafeAreaView, View, VirtualizedList } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetConfigSelectStopListProps {
	isVisible: boolean
	onClose: () => void
	onSelectStop: (data: Stop) => void
}

/* * */

export function WidgetConfigSelectStopList({ isVisible, onClose, onSelectStop }: WidgetConfigSelectStopListProps) {
	//

	//
	// A. Setup variables

	const stopsContext = useStopsContext();

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetConfigSelectStopList' });

	//
	// B. Handle actions

	const handleStopClick = (item: Stop) => {
		onSelectStop(item);
		onClose();
	};

	//
	// C. Render components

	return (
		<Modal animationType="slide" presentationStyle="formSheet" visible={isVisible}>
			<SafeAreaView style={useStyles().safeArea}>
				<View style={useStyles().header}>
					<Button onPress={onClose} title={t('close_button')} />
				</View>
				{/* <StopSearchBar /> */}
				<VirtualizedList
					data={stopsContext.data.stops}
					getItem={(data: [], index: number) => data[index]}
					getItemCount={data => data?.length || 0}
					keyExtractor={item => item.id}
					ListEmptyComponent={(<NoDataLabel />)}
					renderItem={({ item }: { item: Stop }) => <WidgetConfigSelectStopListItem item={item} onPress={handleStopClick} />}
				/>
			</SafeAreaView>
		</Modal>
	);

	//
}
