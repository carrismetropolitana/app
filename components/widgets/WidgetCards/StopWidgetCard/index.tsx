/* * */

import { AccordionToggle } from '@/components/AccordionToggle';
import { useLinesContext } from '@/contexts/Lines.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { AccountWidget } from '@/types/account.types';
import { Routes } from '@/utils/routes';
import { Pattern } from '@carrismetropolitana/api-types/network';
import { ListItem } from '@rneui/themed';
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

	//
	// A. Setup variables

	const [patternIds] = useState<string[]>(
		data.data.type === 'stops' ? data.data.pattern_ids : [],
	);
	const [stopName, setStopName] = useState<string>('');
	const [stopMunicipality, setStopMunicipality] = useState<string>();

	const linesContext = useLinesContext();
	const stopsContext = useStopsContext();
	const cardStyles = styles();

	//
	// B. Fetch Data

	useEffect(() => {
		if (stopsContext.flags.is_loading || !data || !stopsContext.actions.getStopById) return;
		patternIds.forEach(id => fetchStopName(id));
		patternIds.forEach(() => fetchMunicipalities(data));
	}, [stopsContext.flags.is_loading, data]);

	const fetchStopName = async (id: string) => {
		if (!id) return;
		const response = await fetch(`${Routes.API}/patterns/${id}`);
		const data: Pattern[] = await response.json();
		if (data) {
			setStopName(data[0].headsign);
		}
	};

	const fetchMunicipalities = (data: AccountWidget) => {
		if (!data) return;
		const stopId = data.data.type === 'stops' ? data.data.stop_id : '';
		const stop = stopsContext.actions.getStopById(stopId);
		if (!stop) {
			console.error(`Stop data not found for id: ${stopId}`);
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
				<StopWidgetCardBody stopId={data.data.type === 'stops' ? data.data.stop_id : ''} />
			</View>
		</ListItem.Accordion>
	);

	//
}
