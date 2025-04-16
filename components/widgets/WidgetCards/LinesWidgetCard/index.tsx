/* * */

import { AccordionToggle } from '@/components/AccordionToggle';
import { Section } from '@/components/common/layout/Section';
import { useLinesContext } from '@/contexts/Lines.context';
import { AccountWidget } from '@/types/account.types';
import { Routes } from '@/utils/routes';
import { Pattern } from '@carrismetropolitana/api-types/network';
import { ListItem, Text } from '@rneui/themed';
import { useEffect, useState } from 'react';

import { LineWidgetCardHeader } from '../LineWidgetCardHeader';

/* * */

interface LineWidgetCardProps {
	data: AccountWidget
}

/* * */

export function LineWidgetCard({ data }: LineWidgetCardProps) {
	//

	//
	// A. Setup variables

	const [patternId] = useState<string>(data.data.type === 'lines' ? data.data.pattern_id : '');
	const [lineName, setLineName] = useState<string>('');
	const [expanded, setExpanded] = useState(false);

	//
	// B. Fetch Data

	useEffect(() => {
		if (!data) return;

		fetchLineName(patternId);
	}, []);

	const toggleAccordion = () => {
		setExpanded(!expanded);
	};

	const fetchLineName = async (id: string) => {
		if (!id) return;
		const response = await fetch(`${Routes.API}/patterns/${id}`);
		const data: Pattern[] = await response.json();
		if (data) {
			setLineName(data[0].headsign);
		}
	};
	//
	// C. Render Components

	return (
		<>
			<ListItem.Accordion
				icon={<AccordionToggle expanded={expanded} size={24} />}
				isExpanded={expanded}
				onPress={toggleAccordion}
				content={(
					<LineWidgetCardHeader title={lineName} />
				)}
			>
				<Section>
					<Text>LALALALALALAA</Text>
				</Section>
			</ListItem.Accordion>

		</>
	);

	//
}
