/* * */

import { ListSection } from '@/components/list/ListSection';
import { WidgetConfigSelectLineList } from '@/components/widgets/common/WidgetConfigSelectLineList';
import { type Line } from '@carrismetropolitana/api-types/network';
import { IconArrowLoopRight, IconArrowsLeftRight } from '@tabler/icons-react-native';
import { useState } from 'react';

/* * */

interface WidgetConfigSelectLineProps {
	onSelectLineId: (lineId: string) => void
	selectedLine?: Line
	subtitle?: string
	title?: string
}

/* * */

export function WidgetConfigSelectLine({ onSelectLineId, selectedLine, subtitle, title }: WidgetConfigSelectLineProps) {
	//

	//
	// A. Setup variables

	const [modalVisible, setModalVisible] = useState(false);

	//
	// B. Handle actions

	const handleSelectLine = (line: Line) => {
		onSelectLineId(line.id);
		setModalVisible(false);
	};

	//
	// C. Render components

	return (
		<>

			{!selectedLine && (
				<ListSection
					subtitle={subtitle}
					title={title}
					items={[{
						icon: <IconArrowLoopRight color="#FF6900" />,
						key: 'select-line',
						label: 'Procurar linha',
						onPress: () => setModalVisible(true),
					}]}
				/>
			)}

			{selectedLine && (
				<ListSection
					subtitle={subtitle}
					title={title}
					items={[{
						key: 'selected-line',
						label: selectedLine.long_name,
						onPress: () => setModalVisible(true),
						replaceChevron: <IconArrowsLeftRight />,
					}]}
				/>
			)}

			<WidgetConfigSelectLineList
				isVisible={modalVisible}
				onClose={() => setModalVisible(false)}
				onSelectLine={handleSelectLine}
			/>

		</>
	);

	//
}
