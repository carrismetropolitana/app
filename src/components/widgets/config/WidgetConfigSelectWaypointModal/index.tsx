/* * */

import { ListSection } from '@/components/list/ListSection';
import { type ListSectionItemProps } from '@/components/list/ListSectionItem';
import { WidgetConfigSelectWaypointBadge } from '@/components/widgets/config/WidgetConfigSelectWaypointBadge';
import { useStopsContext } from '@/contexts/Stops.context';
import { useSystemVariables } from '@/theme/global';
import { type Waypoint } from '@carrismetropolitana/api-types/network';
import { IconCircle, IconCircleCheckFilled, IconX } from '@tabler/icons-react-native';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, ScrollView, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetConfigSelectWaypointModalProps {
	availableWaypoints?: Waypoint[]
	description?: string
	disableFirst?: boolean
	isVisible: boolean
	onClose: () => void
	onSelectWaypoint: (waypoint: Waypoint) => void
	selectedWaypoint?: Waypoint
	title?: string
}

/* * */

export function WidgetConfigSelectWaypointModal({ availableWaypoints, description, disableFirst, isVisible, onClose, onSelectWaypoint, selectedWaypoint, title }: WidgetConfigSelectWaypointModalProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	const stopsContext = useStopsContext();

	const { t } = useTranslation();

	//
	// B. Transform data

	const handlePressItem = useCallback((item: Waypoint) => {
		onSelectWaypoint(item);
		onClose();
	}, [onSelectWaypoint, onClose]);

	const availableWaypointsList: ListSectionItemProps[] = useMemo(() => {
		// Skip if no waypoints are available
		if (!availableWaypoints?.length) return [];
		// Prepare waypoints list
		const preparedWaypoints: ListSectionItemProps[] = availableWaypoints
			.sort((a, b) => a.stop_sequence - b.stop_sequence)
			.map((item, index): ListSectionItemProps | null => {
				const stopData = stopsContext.actions.getStopById(item.stop_id);
				if (!stopData) return null;
				const isSelected = selectedWaypoint?.stop_id === item.stop_id;
				const isDisabled = disableFirst && index === 0;
				return {
					accessibilityLabel: t($ => $.widgets.WidgetConfigSelectWaypointModal.items.accessibility_label, {
						index: item.stop_sequence,
						tts_name: stopData.tts_name,
					}),
					disabled: isDisabled,
					icon: <WidgetConfigSelectWaypointBadge sequence={item.stop_sequence} />,
					key: `${item.stop_id}-${item.stop_sequence}`,
					label: stopData.long_name,
					onPress: () => !isDisabled && handlePressItem(item),
					replaceChevron: isDisabled ? <IconX color={systemVariables.text[200]} /> : isSelected ? <IconCircleCheckFilled color={systemVariables.status.ok} /> : <IconCircle color={systemVariables.text[200]} />,
				};
			})
			.filter(item => !!item);
		// Return valid waypoints only
		return preparedWaypoints;
	}, [availableWaypoints, disableFirst, handlePressItem, selectedWaypoint?.stop_id, stopsContext.actions, systemVariables.status.ok, systemVariables.text, t]);

	//
	// C. Render components

	if (!availableWaypoints || availableWaypoints.length === 0) {
		return null;
	}

	return (
		<Modal
			animationType="slide"
			onRequestClose={onClose}
			presentationStyle="formSheet"
			visible={isVisible}
		>
			<View style={styles.header}>
				<Button onPress={onClose} title={t($ => $.widgets.WidgetConfigSelectWaypointModal.close_button)} />
			</View>
			<View style={styles.content}>
				<ScrollView>
					<ListSection
						description={description}
						items={availableWaypointsList}
						title={title}
					/>
				</ScrollView>
			</View>
		</Modal>
	);

	//
}
