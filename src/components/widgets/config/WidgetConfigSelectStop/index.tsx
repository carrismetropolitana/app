/* * */

import { ListSection } from '@/components/list/ListSection';
import { WidgetConfigSelectStopModal } from '@/components/widgets/config/WidgetConfigSelectStopModal';
import { useSystemVariables } from '@/theme/global';
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

	const systemVariables = useSystemVariables();

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
						accessibilityHint: t('selected.accessibility_hint'),
						accessibilityLabel: t('selected.accessibility_label', { tts_name: selectedStop.tts_name }),
						description: selectedStop.id,
						key: 'selected-stop',
						label: selectedStop.long_name,
						onPress: () => setModalVisible(true),
						replaceChevron: <IconArrowsLeftRight color={systemVariables.text[100]} />,
					}]}
				/>
			)}

			<WidgetConfigSelectStopModal
				isVisible={modalVisible}
				onClose={() => setModalVisible(false)}
				onSelectStop={handleSelectStop}
			/>

		</>
	);

	//
}
