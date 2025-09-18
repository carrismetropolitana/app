/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AccountWidget, WidgetCreate } from '@/types/account.types';

import messagingLib from '@react-native-firebase/messaging';
import { createContext, ReactNode, useContext, useEffect, useMemo } from 'react';

import { useProfileContext } from './Profile.context';

interface WidgetContextState {
	actions: {
		createWidget: (params: WidgetCreate) => Promise<void>
		updateWidget: (id: string, newWidgetData: AccountWidget) => Promise<void>
	}
	counters: {
		widget_lines: number
		widget_stops: number
	}
	data: {
		widget_lines: AccountWidget[]
		widget_smart_notifications: AccountWidget[]
		widget_stops: AccountWidget[]
	}
	flags: {
		is_loading: boolean
	}
}

const WidgetContext = createContext<undefined | WidgetContextState>(undefined);

export function useWidgetContext() {
	const context = useContext(WidgetContext);
	if (!context) {
		throw new Error('useWidgetContext must be used within a WidgetContextProvider');
	}
	return context;
}
export const WidgetContextProvider = ({ children }: { children: ReactNode }) => {
	const profileContext = useProfileContext();
	const widgets = profileContext.data.profile?.widgets || [];
	const is_loading = profileContext.flags.is_loading;

	const dataWidgetLinesState = useMemo(() => widgets.filter(w => w.data?.type === 'lines'), [widgets]);
	const dataWidgetStopsState = useMemo(() => widgets.filter(w => w.data?.type === 'stops'), [widgets]);
	const dataWidgetSmartNotificationsState = useMemo(() => widgets.filter(w => w.data?.type === 'smart_notifications'), [widgets]);

	useEffect(() => {
		const subscribeToAllWidgetTopics = async () => {
			await Promise.all(
				dataWidgetSmartNotificationsState
					.filter(widget => widget.data.type === 'smart_notifications' && 'id' in widget.data && widget.data.id)
					.map(widget => messagingLib().subscribeToTopic((widget.data as { id: string }).id)),
			);
		};
		subscribeToAllWidgetTopics();
	}, [dataWidgetSmartNotificationsState]);

	const createWidget = async (params: WidgetCreate) => {
		try {
			const allWidgets = [...widgets];
			let mergedWidgets = allWidgets;
			if (params.type === 'lines') {
				if (!params.pattern_ids || params.pattern_ids.length === 0) return;
				const lineWidgets = allWidgets.filter(w => w.data && w.data.type === 'lines');
				const otherWidgets = allWidgets.filter(w => !w.data || w.data.type !== 'lines');
				const updatedLineWidgets = [...lineWidgets];
				params.pattern_ids.forEach((pattern_id) => {
					const exists = updatedLineWidgets.some(widget => widget.data && widget.data.type === 'lines' && widget.data.pattern_id === pattern_id);
					if (!exists) {
						updatedLineWidgets.push({ data: { pattern_id, type: 'lines' }, settings: { display_order: otherWidgets.length + updatedLineWidgets.length + 1, is_open: true } });
					}
				});
				mergedWidgets = [...otherWidgets, ...updatedLineWidgets];
			}
			else if (params.type === 'stops') {
				if (!params.pattern_ids || params.pattern_ids.length === 0) return;
				const stopWidgets = allWidgets.filter(w => w.data && w.data.type === 'stops');
				const otherWidgets = allWidgets.filter(w => !w.data || w.data.type !== 'stops');
				const updatedStopWidgets = [...stopWidgets];
				const exists = updatedStopWidgets.some(widget => widget.data && widget.data.type === 'stops' && widget.data.stop_id === params.stopId);
				if (!exists) {
					updatedStopWidgets.push({ data: { pattern_ids: params.pattern_ids, stop_id: params.stopId, type: 'stops' as const }, settings: { display_order: otherWidgets.length + updatedStopWidgets.length + 1, is_open: true } });
				}
				mergedWidgets = [...otherWidgets, ...updatedStopWidgets];
			}
			else if (params.type === 'smart_notifications') {
				const smartNotificationWidgets = allWidgets.filter(w => w.data && w.data.type === 'smart_notifications');
				const otherWidgets = allWidgets.filter(w => !w.data || w.data.type !== 'smart_notifications');
				const updatedSmartWidgets = [...smartNotificationWidgets];
				const user_id = profileContext.data.profile?.devices?.[0]?.device_id || '';
				const defaultWeekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
				const validWeekDays = (Array.isArray(params.week_days) && params.week_days.length > 0 ? params.week_days : defaultWeekDays) as any;
				const newWidgetSmartNotification: AccountWidget = {
					data: { distance: params.radius || 0, end_time: params.end_time || 0, id: 'id', pattern_id: params.pattern_id || '0', start_time: params.start_time || 0, stop_id: params.stop_id || '', type: 'smart_notifications', user_id: user_id || '', week_days: validWeekDays },
					settings: { display_order: otherWidgets.length + smartNotificationWidgets.length + 1, is_open: true },
				};
				updatedSmartWidgets.push(newWidgetSmartNotification);
				mergedWidgets = [...otherWidgets, ...updatedSmartWidgets];
				await messagingLib().subscribeToTopic('id');
			}
			// Update profile widgets using the simpler updateLocalProfile function
			await profileContext.actions.updateLocalProfile({
				widgets: mergedWidgets,
			});
		}
		catch (error) {
			alert(`An error occurred while updating widgets: ${error}`);
		}
	};

	const deleteWidgetByDisplayOrder = async (displayOrder: number) => {
		const removedWidget = widgets.find(widget => widget.settings?.display_order === displayOrder);
		if (removedWidget?.data?.type === 'smart_notifications' && removedWidget.data.id) {
			await messagingLib().unsubscribeFromTopic(removedWidget.data.id);
		}
		const newList = widgets.filter(widget => widget.settings?.display_order !== displayOrder);
		const orderedWidgets = newList.map((widget, idx) => ({ ...widget, settings: { ...widget.settings, display_order: idx } }));
		await profileContext.actions.updateLocalProfile({
			widgets: orderedWidgets,
		});
	};

	const updateWidget = async (id: string, newWidgetData: AccountWidget) => {
		const updatedWidgets = widgets.map((existingWidget) => {
			if (existingWidget.data?.type === 'smart_notifications' && existingWidget.data.id === id) {
				return { ...existingWidget, data: { ...existingWidget.data, ...newWidgetData.data }, settings: { ...existingWidget.settings, ...newWidgetData.settings } };
			}
			if (existingWidget.data?.type === 'lines' && existingWidget.settings.display_order?.toString() === id) {
				return { ...existingWidget, data: { ...existingWidget.data, ...newWidgetData.data }, settings: { ...existingWidget.settings, ...newWidgetData.settings } };
			}
			if (existingWidget.data?.type === 'stops' && existingWidget.settings.display_order?.toString() === id) {
				return { ...existingWidget, data: { ...existingWidget.data, ...newWidgetData.data }, settings: { ...existingWidget.settings, ...newWidgetData.settings } };
			}
			return existingWidget;
		});
		await profileContext.actions.updateLocalProfile({
			widgets: updatedWidgets,
		});
	};

	// Context value
	const contextValue: WidgetContextState = useMemo(() => ({
		actions: {
			createWidget,
			deleteWidgetByDisplayOrder,
			updateWidget,
		},
		counters: {
			widget_lines: dataWidgetLinesState.length,
			widget_stops: dataWidgetStopsState.length,
		},
		data: {
			widget_lines: dataWidgetLinesState,
			widget_smart_notifications: dataWidgetSmartNotificationsState,
			widget_stops: dataWidgetStopsState,
		},
		flags: {
			is_loading,
		},
	}), [dataWidgetLinesState, dataWidgetStopsState, dataWidgetSmartNotificationsState, is_loading]);

	return (
		<WidgetContext.Provider value={contextValue}>
			{children}
		</WidgetContext.Provider>
	);
};
