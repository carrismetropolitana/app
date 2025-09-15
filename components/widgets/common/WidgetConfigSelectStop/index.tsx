/* * */

import { ListSection } from '@/components/list/ListSection';
import { WidgetConfigSelectStopList } from '@/components/widgets/common/WidgetConfigSelectStopList';
import { type Stop } from '@carrismetropolitana/api-types/network';
import { IconArrowsLeftRight, IconBusStop } from '@tabler/icons-react-native';
import { useState } from 'react';

/* * */

interface WidgetConfigSelectStopProps {
	onSelectStopId: (stopId: string) => void
	selectedStop?: Stop
	subtitle?: string
	title?: string
}

/* * */

export function WidgetConfigSelectStop({ onSelectStopId, selectedStop, subtitle, title }: WidgetConfigSelectStopProps) {
	//

	//
	// A. Setup variables

	const [modalVisible, setModalVisible] = useState(false);

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
					subtitle={subtitle}
					title={title}
					items={[{
						icon: <IconBusStop color="#FF6900" />,
						key: 'select-stop',
						label: 'Procurar paragem',
						onPress: () => setModalVisible(true),
					}]}
				/>
			)}

			{selectedStop && (
				<ListSection
					subtitle={subtitle}
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
