/* * */

import { NoDatabLabel } from '@/components/common/layout/NoDataLabel';
import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { useProfileContext } from '@/contexts/Profile.context';
import { AccountWidget } from '@/types/account.types';
import { Text } from '@rneui/themed';
import { useEffect, useState } from 'react';

import { LineWidgetCard } from './LinesWidgetCard';
import { StopWidgetCard } from './StopWidgetCard';

/* * */

interface Props {
	type: 'lines' | 'stops'
}

/* * */

export function WidgetCards({ type }: Props) {
	//

	//
	// A. Setup Variables
	const [lineWidgets, setLinesWidgets] = useState<[] | AccountWidget[]>();
	const [stopWidgets, setStopsWidgets] = useState<[] | AccountWidget[]>();

	const profileContext = useProfileContext();

	useEffect(() => {
		if (!profileContext.data.profile?.widgets) return;
		const lines: AccountWidget[] = profileContext.data.profile.widgets.filter(widget => widget.data.type === 'lines');
		const stops: AccountWidget[] = profileContext.data.profile.widgets.filter(widget => widget.data.type === 'stops');
		setLinesWidgets(lines);
		setStopsWidgets(stops);
	}, [profileContext.data.profile?.widgets]);

	//

	// B. Render Components

	return (
		<Surface>
			{!lineWidgets && !stopWidgets && (
				<NoDatabLabel text="Sem Widgets" fill />
			)}

			{type === 'lines'
			&& (lineWidgets?.map(item => <LineWidgetCard data={item} />)
			)}

			{type === 'stops'
			&& (stopWidgets?.map(item => <StopWidgetCard data={item} />)
			)}

		</Surface>
	);

	//
}
