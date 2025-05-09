import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { Surface } from '@/components/common/layout/Surface';
import { useProfileContext } from '@/contexts/Profile.context';
import { AccountWidget } from '@/types/account.types';
import React, { useEffect, useState } from 'react';

import { LineWidgetCard } from './LinesWidgetCard';
import { StopWidgetCard } from './StopWidgetCard';

interface WidgetCardsProps {
	type?: 'lines' | 'stops'
}

export function WidgetCards({ type }: WidgetCardsProps) {
	const profileContext = useProfileContext();
	const widgets = profileContext.data.profile?.widgets ?? [];

	const [sortedWidgets, setSortedWidgets] = useState<AccountWidget[]>([]);

	useEffect(() => {
		const filtered = type ? widgets.filter(w => w.data.type === type) : widgets;
		const ordered = filtered
			.slice()
			.sort((a, b) => (a.settings?.display_order ?? 0) - (b.settings?.display_order ?? 0));

		setSortedWidgets(ordered);
	}, [widgets, type]);

	if (!sortedWidgets.length) {
		return (
			<Surface>
				<NoDataLabel text="Sem Widgets" fill />
			</Surface>
		);
	}

	return (
		<Surface>
			{sortedWidgets.map((widget) => {
				if (widget.data.type === 'lines') {
					return (
						<LineWidgetCard key={widget.data.pattern_id} data={widget} />
					);
				}
				if (widget.data.type === 'stops') {
					const key = `${widget.data.stop_id}-${
						Array.isArray(widget.data.pattern_ids) ? widget.data.pattern_ids[0] : ''
					}`;
					return (
						<StopWidgetCard key={key} data={widget} />
					);
				}
				return null;
			})}
		</Surface>
	);
}
