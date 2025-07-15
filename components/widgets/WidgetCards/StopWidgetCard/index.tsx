/* * */

import { AccordionToggle } from '@/components/AccordionToggle';
import { useLinesContext } from '@/contexts/Lines.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { AccountWidget } from '@/types/account.types';
import { ListItem } from '@rn-vui/themed';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { StopWidgetCardBody } from '../StopWidgetCardBody';
import { StopWidgetCardHeader } from '../StopWidgetCardHeader';
import { styles } from './styles';

/* * */

interface StopWidgetCardProps {
	data: AccountWidget
	expanded: boolean
	onToggle: () => void
}

/* * */

export function StopWidgetCard({ data, expanded, onToggle }: StopWidgetCardProps) {
	//
	// A. Setup variables

	const stopId = data.data.type === 'stops' ? data.data.stop_id : '';
	const [stopName, setStopName] = useState<string>('');
	const [stopMunicipality, setStopMunicipality] = useState<string>();

	const linesContext = useLinesContext();
	const stopsContext = useStopsContext();
	const cardStyles = styles();

	//
	// B. Fetch Data

	useEffect(() => {
		if (stopsContext.flags.is_loading || !stopId || !stopsContext.actions.getStopById) return;
		fetchStopName(stopId);
		fetchMunicipalities(stopId);
	}, [stopsContext.flags.is_loading, stopId]);

	const fetchStopName = async (id: string) => {
		if (!id) return;
		const stop = stopsContext.actions.getStopById(id);
		if (stop) {
			setStopName(stop.long_name);
			return;
		}
	};

	const fetchMunicipalities = (id: string) => {
		if (!id) return;
		const stop = stopsContext.actions.getStopById(id);
		if (!stop) {
			console.error(`Stop data not found for id: ${id}`);
			return;
		}

		if (stop.municipality_id) {
			const municipality = linesContext.data.municipalities.find(m => m.id === stop.municipality_id);
			if (municipality) {
				setStopMunicipality(municipality.name);
			}
		}
	};

	//
	// D. Render Components

	return (
		<ListItem.Accordion
			containerStyle={!expanded ? cardStyles.cardClosed : cardStyles.cardOpen}
			content={<StopWidgetCardHeader municipality={stopMunicipality || ''} title={stopName || ''} />}
			icon={<AccordionToggle expanded={expanded} size={24} />}
			isExpanded={expanded}
			onPress={onToggle}
		>
			<View style={cardStyles.cardBody}>
				<StopWidgetCardBody patternIds={data.data.type === 'stops' ? data.data.pattern_ids : []} stopId={stopId} />
			</View>
		</ListItem.Accordion>
	);

	//
}
