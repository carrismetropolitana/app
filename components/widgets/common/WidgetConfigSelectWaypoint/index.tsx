/* * */

import { ListSection } from '@/components/list/ListSection';
import { type ListSectionItemProps } from '@/components/list/ListSectionItem';
import { WidgetConfigSelectWaypointSequence } from '@/components/widgets/common/WidgetConfigSelectWaypointSequence';
import { useStopsContext } from '@/contexts/Stops.context';
import { type Waypoint } from '@carrismetropolitana/api-types/network';
import { IconCircle, IconCircleCheckFilled } from '@tabler/icons-react-native';
import { useMemo } from 'react';

/* * */

interface WidgetConfigSelectWaypointProps {
	availableWaypoints?: Waypoint[]
	onToggleWaypoint: (waypoint: Waypoint) => void
	selectedWaypoint?: Waypoint
	subtitle?: string
	title?: string
}

/* * */

export function WidgetConfigSelectWaypoint({ availableWaypoints, onToggleWaypoint, selectedWaypoint, subtitle, title }: WidgetConfigSelectWaypointProps) {
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
			.map((item) => {
				const stopData = stopsContext.actions.getStopById(item.stop_id);
				if (!stopData) return null;
				const isSelected = selectedWaypoint?.stop_id === item.stop_id && selectedWaypoint?.stop_sequence === item.stop_sequence;
				return {
					icon: <WidgetConfigSelectWaypointSequence sequence={item.stop_sequence} />,
					key: `${item.stop_id}-${item.stop_sequence}`,
					label: stopData.long_name,
					onPress: () => onToggleWaypoint(item),
					replaceChevron: isSelected ? <IconCircleCheckFilled /> : <IconCircle />,
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
			items={availableWaypointsList}
			subtitle={subtitle}
			title={title}
		/>
	);

	//
}
