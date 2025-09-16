/* * */

import { ListSection } from '@/components/list/ListSection';
import { type ListSectionItemProps } from '@/components/list/ListSectionItem';
import { WidgetConfigSelectWaypointSequence } from '@/components/widgets/common/WidgetConfigSelectWaypointSequence';
import { useStopsContext } from '@/contexts/Stops.context';
import { type Waypoint } from '@carrismetropolitana/api-types/network';
import { IconCircle, IconCircleCheckFilled, IconX } from '@tabler/icons-react-native';
import { useMemo } from 'react';

/* * */

interface WidgetConfigSelectWaypointProps {
	availableWaypoints?: Waypoint[]
	description?: string
	disableFirst?: boolean
	onToggleWaypoint: (waypoint: Waypoint) => void
	selectedWaypoint?: Waypoint
	title?: string
}

/* * */

export function WidgetConfigSelectWaypoint({ availableWaypoints, description, disableFirst, onToggleWaypoint, selectedWaypoint, title }: WidgetConfigSelectWaypointProps) {
	//

	//
	// A. Setup variables

	const stopsContext = useStopsContext();

	//
	// B. Transform data

	const availableWaypointsList: ListSectionItemProps[] = useMemo(() => {
		// Skip if no waypoints are available
		if (!availableWaypoints?.length) return [];
		// Prepare waypoints list
		const preparedWaypoints = availableWaypoints
			.sort((a, b) => a.stop_sequence - b.stop_sequence)
			.map((item, index) => {
				const stopData = stopsContext.actions.getStopById(item.stop_id);
				if (!stopData) return null;
				const isSelected = selectedWaypoint?.stop_id === item.stop_id && selectedWaypoint?.stop_sequence === item.stop_sequence;
				const isDisabled = disableFirst && index === 0;
				return {
					icon: <WidgetConfigSelectWaypointSequence sequence={item.stop_sequence} />,
					key: `${item.stop_id}-${item.stop_sequence}`,
					label: stopData.long_name,
					onPress: () => !isDisabled && onToggleWaypoint(item),
					replaceChevron: isDisabled ? <IconX /> : isSelected ? <IconCircleCheckFilled /> : <IconCircle />,
				};
			})
			.filter(item => !!item);
		// Return valid waypoints only
		return preparedWaypoints;
	}, [availableWaypoints, selectedWaypoint]);

	//
	// C. Render components

	if (!availableWaypoints || availableWaypoints.length === 0) {
		return null;
	}

	return (
		<ListSection
			description={description}
			items={availableWaypointsList}
			title={title}
		/>
	);

	//
}
