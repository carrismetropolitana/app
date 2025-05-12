/* * */

import type { AccountWidget } from '@/types/account.types';

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { Surface } from '@/components/common/layout/Surface';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import React, { useEffect, useState } from 'react';

import { LineWidgetCard } from './LinesWidgetCard';
import { StopWidgetCard } from './StopWidgetCard';

/* * */

interface WidgetCardsProps {
	type?: 'lines' | 'stops'
}

/* * */

export function WidgetCards({ type }: WidgetCardsProps) {
	//

	// A. Setup variables
	const profileContext = useProfileContext();
	const widgets = profileContext.data.profile?.widgets ?? [];

	const [sortedWidgets, setSortedWidgets] = useState<AccountWidget[]>([]);

	//
	// B. Transform data

	useEffect(() => {
		const filtered = type ? widgets.filter(w => w.data.type === type) : widgets;
		const ordered = filtered
			.slice()
			.sort((a, b) => (a.settings?.display_order ?? 0) - (b.settings?.display_order ?? 0));
		setSortedWidgets(ordered);
	}, [widgets, type]);

	//
	// D. Render components

	if (!sortedWidgets.length) {
		return (
			<Surface>
				<NoDataLabel text="Sem Widgets" fill />
			</Surface>
		);
	}

	return (
		<StopsDetailContextProvider>
			<LinesDetailContextProvider>
				<Surface>
					{sortedWidgets.map((widget) => {
						if (widget.data.type === 'lines') {
							return (<LineWidgetCard key={widget.data.pattern_id} data={widget} />);
						}

						if (widget.data.type === 'stops') {
							const key = `${widget.data.stop_id}-${Array.isArray(widget.data.pattern_ids) ? widget.data.pattern_ids[0] : ''}`;
							return (<StopWidgetCard key={key} data={widget} />);
						}
						return null;
					})}
				</Surface>
			</LinesDetailContextProvider>
		</StopsDetailContextProvider>
	);

	//
}
