/* * */

import { ListSection } from '@/components/list/ListSection';
import { useStopsContext } from '@/contexts/Stops.context';
import { useSystemVariables } from '@/theme/global';
import { IconArrowsRightLeft, IconBusStop } from '@tabler/icons-react-native';
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

interface StopSelectionTriggerProps {
	description?: string
	onSelect?: (stopId: string) => void
	selectedStopId?: string
	title?: string
}

/* * */

export function StopSelectionTrigger({ description, onSelect, selectedStopId, title }: StopSelectionTriggerProps) {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();

	const stopsContext = useStopsContext();

	const pathname = usePathname();
	const localSearchParams = useLocalSearchParams<{ stop_id: string }>();

	const { t } = useTranslation('translation', { keyPrefix: 'stops.StopSelectionTrigger' });

	//
	// B. Transform data

	const selectedStopData = useMemo(() => {
		if (!localSearchParams.stop_id) return;
		return stopsContext.actions.getStopById(localSearchParams.stop_id);
	}, [localSearchParams.stop_id]);

	//
	// C. Handle actions

	useEffect(() => {
		// Skip if no stop is selected or if
		// the selected stop is the same as the param value
		if (!selectedStopId) return;
		if (selectedStopId === localSearchParams.stop_id) return;
		// Update the URL param to match the selected stop
		router.setParams({ stop_id: selectedStopId });
	}, [selectedStopId]);

	useEffect(() => {
		// Skip if no stop was selected
		if (!localSearchParams.stop_id) return;
		// Trigger the onSelect callback with the selected stop ID
		if (onSelect) onSelect(localSearchParams.stop_id);
	}, [localSearchParams.stop_id]);

	const handleShowList = () => {
		router.navigate({
			params: { return_to: pathname },
			pathname: '/selection/stop',
		});
	};

	//
	// D. Render components

	return (
		<>

			{!selectedStopData && (
				<ListSection
					description={description}
					title={title}
					items={[{
						icon: <IconBusStop color="#FF6900" />,
						key: 'select-stop',
						label: t('label'),
						onPress: handleShowList,
					}]}
				/>
			)}

			{selectedStopData && (
				<ListSection
					description={description}
					title={title}
					items={[{
						accessibilityHint: t('selected.accessibility_hint'),
						accessibilityLabel: t('selected.accessibility_label', { tts_name: selectedStopData.tts_name }),
						description: selectedStopData.id,
						key: 'selected-stop',
						label: selectedStopData.long_name,
						onPress: handleShowList,
						replaceChevron: <IconArrowsRightLeft color={systemVariables.text[100]} />,
					}]}
				/>
			)}

		</>
	);

	//
}
