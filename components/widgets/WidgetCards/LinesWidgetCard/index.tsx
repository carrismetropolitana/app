/* * */

import { AccordionToggle } from '@/components/AccordionToggle';
import { AccountWidget } from '@/types/account.types';
import { Routes } from '@/utils/routes';
import { Pattern } from '@carrismetropolitana/api-types/network';
import { ListItem } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { LineWidgetCardBody } from '../LineWidgetCardBody';
import { LineWidgetCardHeader } from '../LineWidgetCardHeader';
import { styles } from './styles';

/* * */

interface LineWidgetCardProps {
	data: AccountWidget
	expanded: boolean
	onToggle: () => void
}

/* * */

export function LineWidgetCard({ data, expanded, onToggle }: LineWidgetCardProps) {
	//

	//
	// A. Setup variables

	const [patternId] = useState<string>(data.data.type === 'lines' ? data.data.pattern_id : '');
	const [lineId, setLineId] = useState<string>('');
	const [lineName, setLineName] = useState<string>('');

	const cardStyles = styles();

	//
	// B. Fetch Data

	useEffect(() => {
		if (!data) return;
		setLineId(patternId.split('_')[0]);
		fetchLineName(patternId);
	}, []);

	const fetchLineName = async (id: string) => {
		if (!id) return;
		const response = await fetch(`${Routes.API}/patterns/${id}`);
		const data: Pattern[] = await response.json();
		if (data) {
			setLineName(data[0].headsign);
		}
	};

	//
	// D. Render Components

	return (
		<ListItem.Accordion
			containerStyle={!expanded ? cardStyles.cardClosed : cardStyles.cardOpen}
			icon={<AccordionToggle expanded={expanded} size={24} />}
			isExpanded={expanded}
			onPress={onToggle}
			content={(
				<LineWidgetCardHeader lineId={lineId} title={lineName} />
			)}
		>
			<View style={cardStyles.cardBody}>
				<LineWidgetCardBody lineId={lineId} />
			</View>
		</ListItem.Accordion>
	);

	//
}
