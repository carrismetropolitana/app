/* * */

import { ListSection } from '@/components/list/ListSection';
import { WidgetConfigSelectStopList } from '@/components/widgets/config/WidgetConfigSelectStopList';
import { type Stop } from '@carrismetropolitana/api-types/network';
import { IconArrowsLeftRight, IconBusStop } from '@tabler/icons-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

interface WidgetConfigSelectStopProps {
	description?: string
	onSelectStopId: (stopId: string) => void
	selectedStop?: Stop
	title?: string
}

/* * */

export function WidgetConfigSelectStop({ description, onSelectStopId, selectedStop, title }: WidgetConfigSelectStopProps) {
	//

	//
	// A. Setup variables

	const [modalVisible, setModalVisible] = useState(false);

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetConfigSelectStop' });

	//
	// B. Handle actions

	const handleSelectStop = (stop: Stop) => {
		onSelectStopId(stop.id);
		setModalVisible(false);
	};

	//
	// C. Render components

	return (
		<>

			{!selectedStop && (
				<ListSection
					description={description}
					title={title}
					items={[{
						icon: <IconBusStop color="#FF6900" />,
						key: 'select-stop',
						label: t('label'),
						onPress: () => setModalVisible(true),
					}]}
				/>
			)}

			{selectedStop && (
				<ListSection
					description={description}
					title={title}
					items={[{
						key: 'selected-stop',
						label: selectedStop.long_name,
						onPress: () => setModalVisible(true),
						replaceChevron: <IconArrowsLeftRight />,
					}]}
				/>
			)}

			<WidgetConfigSelectStopList
				isVisible={modalVisible}
				onClose={() => setModalVisible(false)}
				onSelectStop={handleSelectStop}
			/>

		</>
	);

	//
}
