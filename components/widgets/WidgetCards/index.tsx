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
	const profileContext = useProfileContext();
	const widgets = profileContext.data.profile?.widgets ?? [];
	const [sortedWidgets, setSortedWidgets] = useState<AccountWidget[]>([]);
	const [expandedKey, setExpandedKey] = useState<null | string>(null); // NEW

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
		<StopsDetailContextProvider>
			<LinesDetailContextProvider>
				<Surface>
					{sortedWidgets.map((widget) => {
						if (widget.data.type === 'lines') {
							const key = widget.data.pattern_id;
							return (
								<LineWidgetCard
									key={key}
									data={widget}
									expanded={expandedKey === key}
									onToggle={() => setExpandedKey(expandedKey === key ? null : key)}
								/>
							);
						}
						if (widget.data.type === 'stops') {
							const key = `${widget.data.stop_id}-${Array.isArray(widget.data.pattern_ids) ? widget.data.pattern_ids[0] : ''}`;
							return (
								<StopWidgetCard
									key={key}
									data={widget}
									expanded={expandedKey === key}
									onToggle={() => setExpandedKey(expandedKey === key ? null : key)}
								/>
							);
						}
						return null;
					})}
				</Surface>
			</LinesDetailContextProvider>
		</StopsDetailContextProvider>
	);

	//
}
