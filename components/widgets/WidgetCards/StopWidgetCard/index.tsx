import { AccordionToggle } from '@/components/AccordionToggle';
import { Section } from '@/components/common/layout/Section';
import { useLinesContext } from '@/contexts/Lines.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { AccountWidget } from '@/types/account.types';
import { Routes } from '@/utils/routes';
import { Pattern } from '@carrismetropolitana/api-types/network';
import { ListItem, Text } from '@rneui/themed';
import { useEffect, useState } from 'react';

import { StopWidgetCardHeader } from '../StopWidgetCardHeader';

interface StopWidgetCardProps {
	data: AccountWidget
}

export function StopWidgetCard({ data }: StopWidgetCardProps) {
	//

	//
	// A. Setup variables

	const [patternIds] = useState<string[]>(
		data.data.type === 'stops' ? data.data.pattern_ids : [],
	);
	const [stopName, setStopName] = useState<string>('');
	const [stopMunicipality, setStopMunicipality] = useState<string>();
	const [expanded, setExpanded] = useState(false);

	const linesContext = useLinesContext();
	const stopsContext = useStopsContext();

	//
	// B. Fetch Data

	useEffect(() => {
		if (!data) return;
		patternIds.forEach(id => fetchStopName(id));
		patternIds.forEach(() => fetchMunicipalities(data));
	}, []);

	const toggleAccordion = () => {
		setExpanded(!expanded);
	};

	const fetchStopName = async (id: string) => {
		if (!id) return;
		const response = await fetch(`${Routes.API}/patterns/${id}`);
		const data: Pattern[] = await response.json();
		if (data) {
			setStopName(data[0].headsign);
		}
	};

	const fetchMunicipalities = async (data: AccountWidget) => {
		if (!data) return;
		const stopId = data.data.type === 'stops' ? data.data.stop_id : '';
		const stop = await stopsContext.actions.getStopById(stopId);
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
	// C. Render Components

	return (
		<ListItem.Accordion
			icon={<AccordionToggle expanded={expanded} size={24} />}
			isExpanded={expanded}
			onPress={toggleAccordion}
			content={(
				<StopWidgetCardHeader
					municipality={stopMunicipality || ''}
					title={stopName || ''}
				/>
			)}
		>
			<Section>
				<Text>LALALALALALAA</Text>
			</Section>
		</ListItem.Accordion>
	);

	//
}
