/* * */

import { ListSection } from '@/components/list/ListSection';
import { WidgetConfigSelectWaypointBadge } from '@/components/widgets/config/WidgetConfigSelectWaypointBadge';
import { WidgetConfigSelectWaypointModal } from '@/components/widgets/config/WidgetConfigSelectWaypointModal';
import { useStopsContext } from '@/contexts/Stops.context';
import { useSystemVariables } from '@/theme/global';
import { type Waypoint } from '@carrismetropolitana/api-types/network';
import { IconArrowLoopRight, IconArrowsRightLeft } from '@tabler/icons-react-native';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

interface WidgetConfigSelectWaypointProps {
	availableWaypoints?: Waypoint[]
	description?: string
	onSelectWaypoint: (waypoint: Waypoint) => void
	selectedWaypoint?: Waypoint
	title?: string
}

/* * */

export function WidgetConfigSelectWaypoint({ availableWaypoints, description, onSelectWaypoint, selectedWaypoint, title }: WidgetConfigSelectWaypointProps) {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();

	const stopsContext = useStopsContext();

	const [modalVisible, setModalVisible] = useState(false);

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetConfigSelectWaypoint' });

	//
	// B. Transform data

	const stopData = useMemo(() => {
		// Skip if no waypoint is selected
		if (!selectedWaypoint) return null;
		// Fetch stop data
		const foundStopData = stopsContext.actions.getStopById(selectedWaypoint.stop_id);
		if (foundStopData) return foundStopData;
	}, [selectedWaypoint]);

	//
	// B. Handle actions

	const handleSelectWaypoint = (waypoint: Waypoint) => {
		onSelectWaypoint(waypoint);
		setModalVisible(false);
	};

	//
	// C. Render components

	return (
		<>

			{!selectedWaypoint && (
				<ListSection
					description={description}
					title={title}
					items={[{
						icon: <IconArrowLoopRight color="#FF6900" />,
						key: 'select-waypoint',
						label: t('label'),
						onPress: () => setModalVisible(true),
					}]}
				/>
			)}

			{selectedWaypoint && (
				<ListSection
					description={description}
					title={title}
					items={[{
						accessibilityHint: t('selected.accessibility_hint'),
						accessibilityLabel: t('selected.accessibility_label', { tts_name: stopData?.tts_name }),
						icon: <WidgetConfigSelectWaypointBadge sequence={selectedWaypoint.stop_sequence} />,
						key: 'selected-waypoint',
						label: stopData?.long_name || selectedWaypoint.stop_id,
						onPress: () => setModalVisible(true),
						replaceChevron: <IconArrowsRightLeft color={systemVariables.text[100]} />,
						size: 'sm',
					}]}
				/>
			)}

			<WidgetConfigSelectWaypointModal
				availableWaypoints={availableWaypoints}
				isVisible={modalVisible}
				onClose={() => setModalVisible(false)}
				onSelectWaypoint={handleSelectWaypoint}
				selectedWaypoint={selectedWaypoint}
				disableFirst
			/>

		</>
	);

	//
}
