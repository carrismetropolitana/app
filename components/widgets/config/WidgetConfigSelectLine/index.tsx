/* * */

import { ListSection } from '@/components/list/ListSection';
import { WidgetConfigSelectLineList } from '@/components/widgets/config/WidgetConfigSelectLineList';
import { type Line } from '@carrismetropolitana/api-types/network';
import { IconArrowLoopRight, IconArrowsLeftRight } from '@tabler/icons-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

interface WidgetConfigSelectLineProps {
	description?: string
	onSelectLineId: (lineId: string) => void
	selectedLine?: Line
	title?: string
}

/* * */

export function WidgetConfigSelectLine({ description, onSelectLineId, selectedLine, title }: WidgetConfigSelectLineProps) {
	//

	//
	// A. Setup variables

	const [modalVisible, setModalVisible] = useState(false);

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetConfigSelectLine' });

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
					description={description}
					title={title}
					items={[{
						icon: <IconArrowLoopRight color="#FF6900" />,
						key: 'select-line',
						label: t('label'),
						onPress: () => setModalVisible(true),
					}]}
				/>
			)}

			{selectedLine && (
				<ListSection
					description={description}
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
