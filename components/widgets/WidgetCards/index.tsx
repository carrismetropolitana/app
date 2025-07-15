/* * */

import type { AccountWidget } from '@/types/account.types';

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { Surface } from '@/components/common/layout/Surface';
import { LineWidgetCard } from '@/components/widgets/WidgetCards/LinesWidgetCard';
import { SmartNotificationWidgetCard } from '@/components/widgets/WidgetCards/SmartNotificationsWidgetCard';
import { StopWidgetCard } from '@/components/widgets/WidgetCards/StopWidgetCard';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import React, { useEffect, useState } from 'react';

/* * */

export function WidgetCards() {
	//

	//
	// A. Setup variables

	const profileContext = useProfileContext();
	const widgets = profileContext.data.profile?.widgets ?? [];
	const [sortedWidgets, setSortedWidgets] = useState<AccountWidget[]>([]);

	//
	// B. Transform data

	useEffect(() => {
		if (widgets.length === 0) return;
		const ordered = widgets.slice().sort((widget, index) => (widget.settings?.display_order ?? 0) - (index.settings?.display_order ?? 0));
		setSortedWidgets(ordered);
	}, [widgets]);

	//
	// C. Handle actions

	const handleToggle = (key: string) => {
		const updatedWidgets = widgets.map((widget, idx) => {
			let widgetKey = '';
			if (widget.data.type === 'lines') {
				widgetKey = `${widget.data.pattern_id}-${widget.data.type}-${idx}-${widget.settings.display_order}`;
			}
			else if (widget.data.type === 'stops') {
				widgetKey = `${widget.data.stop_id}-${Array.isArray(widget.data.pattern_ids) ? widget.data.pattern_ids[0] : ''}-${widget.data.type}-${idx}-${widget.settings.display_order}`;
			}
			else if (widget.data.type === 'smart_notifications') {
				widgetKey = `${widget.data.id}-${widget.data.type}-${idx}-${widget.settings.display_order}`;
			}
			if (widgetKey === key) {
				return {
					...widget,
					settings: {
						...widget.settings,
						is_open: !widget.settings?.is_open,
					},
				};
			}
			return widget;
		});
		profileContext.actions.updateLocalProfile({
			...profileContext.data.profile,
			_id: profileContext.data.profile?._id ?? '',
			devices: profileContext.data.profile?.devices ?? [],
			role: profileContext.data.profile?.role ?? 'user',
			widgets: updatedWidgets,
		});
	};

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
		<Surface>
			{sortedWidgets.map((widget, idx) => {
				let key = '';
				if (widget.data.type === 'lines') {
					key = `${widget.data.pattern_id}-${widget.data.type}-${idx}-${widget.settings.display_order}`;
					return (
						<LinesDetailContextProvider>
							<StopsDetailContextProvider>
								<LineWidgetCard
									key={key}
									data={widget}
									expanded={!!widget.settings?.is_open}
									onToggle={() => handleToggle(key)}
								/>
							</StopsDetailContextProvider>
						</LinesDetailContextProvider>

					);
				}
				if (widget.data.type === 'stops') {
					key = `${widget.data.stop_id}-${Array.isArray(widget.data.pattern_ids) ? widget.data.pattern_ids[0] : ''}-${widget.data.type}-${idx}-${widget.settings.display_order}`;
					return (
						<LinesDetailContextProvider>
							<StopsDetailContextProvider>
								<StopWidgetCard
									key={key}
									data={widget}
									expanded={!!widget.settings?.is_open}
									onToggle={() => handleToggle(key)}
								/>
							</StopsDetailContextProvider>
						</LinesDetailContextProvider>
					);
				}
				if (widget.data.type === 'smart_notifications') {
					key = `${widget.data.id}-${widget.data.type}-${idx}-${widget.settings.display_order}-${widget.settings.display_order}`;
					return (
						<LinesDetailContextProvider>
							<StopsDetailContextProvider>
								<SmartNotificationWidgetCard
									key={key}
									data={widget}
									expanded={!!widget.settings?.is_open}
									onToggle={() => handleToggle(key)}
								/>
							</StopsDetailContextProvider>
						</LinesDetailContextProvider>
					);
				}
				return null;
			})}
		</Surface>
	);

	//
}
