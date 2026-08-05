/* * */

import { NoDataLabel } from '@/components/common/NoDataLabel';
import { ListSection } from '@/components/list/ListSection';
import { type ListSectionItemProps } from '@/components/list/ListSectionItem';
import { useAccountContext } from '@/contexts/Account.context';
import { useLinesContext } from '@/contexts/Lines.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { IconArrowLoopRight, IconBellRinging, IconBusStop } from '@tabler/icons-react-native';
import { type Href } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export function AccountViewWidgetsList() {
	//

	//
	// A. Setup variables

	const linesContext = useLinesContext();
	const stopsContext = useStopsContext();
	const accountContext = useAccountContext();

	const { t } = useTranslation();

	//
	// B. Transform data

	const listItems: ListSectionItemProps[] = useMemo(() => {
		// Skip if no widgets
		if (!accountContext.data.account?.widgets) return [];
		// Sort widgets by display order
		const sortedWidgets = accountContext.data.account.widgets.sort((a, b) => {
			return (a.settings.display_order ?? 0) - (b.settings.display_order ?? 0);
		});
		// Map to list items
		return sortedWidgets
			.map((widget) => {
				if (widget.type === 'stop') {
					const stopData = stopsContext.actions.getStopById(widget.properties.stop_id);
					return {
						description: t($ => $.account.AccountViewWidgetsList.description.stop),
						icon: <IconBusStop color="#FF6900" size={30} />,
						key: widget._id,
						label: widget.settings.label || stopData?.long_name || widget.properties.stop_id,
						link: `/account/widgets/stop?widget_id=${widget._id}` as Href,
					};
				}
				if (widget.type === 'line') {
					const lineData = linesContext.actions.getLineDataById(widget.properties.pattern_id.slice(0, 4));
					return {
						description: t($ => $.account.AccountViewWidgetsList.description.line),
						icon: <IconArrowLoopRight color="#C61D23" size={30} />,
						key: widget._id,
						label: widget.settings.label || lineData?.long_name || widget.properties.pattern_id,
						link: `/account/widgets/line?widget_id=${widget._id}` as Href,
					};
				}
				if (widget.type === 'smart_notification') {
					const stopData = stopsContext.actions.getStopById(widget.properties.stop_id);
					return {
						description: t($ => $.account.AccountViewWidgetsList.description.smart_notification),
						icon: <IconBellRinging color="#0C807E" size={30} />,
						key: widget._id,
						label: widget.settings.label || stopData?.long_name || widget.properties.stop_id,
						link: `/account/widgets/smart_notification?widget_id=${widget._id}` as Href,
					};
				}
			})
			.filter(item => !!item);
	}, [accountContext?.data?.account?.widgets, linesContext.actions, stopsContext.actions, t]);

	//
	// C. Render components

	if (!listItems.length) {
		return <NoDataLabel text={t($ => $.account.AccountViewWidgetsList.no_data)} />;
	}

	return (
		<ListSection
			items={listItems}
			title={t($ => $.account.AccountViewWidgetsList.title)}
		/>
	);

	//
}
