/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { ListSection } from '@/components/list/ListSection';
import { type ListSectionItemProps } from '@/components/list/ListSectionItem';
import { useAccountContext } from '@/contexts/Account.context';
import { IconArrowLoopRight, IconBellRinging, IconBusStop } from '@tabler/icons-react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export function AccountViewWidgetsList() {
	//

	//
	// A. Setup variables

	const accountContext = useAccountContext();

	const { t } = useTranslation('translation', { keyPrefix: 'account.AccountViewWidgetsList' });

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
		return sortedWidgets.map((widget) => {
			// Choose icon, label and description based on widget type
			let icon: React.ReactNode;
			let label: string;
			let description: string;
			switch (widget.type) {
				case 'smart_notification':
					icon = <IconBellRinging color="#0C807E" size={30} />;
					label = widget.settings.label || widget.properties.stop_id;
					description = t('description.smart_notification');
					break;
				case 'stop':
					icon = <IconBusStop color="#FF6900" size={30} />;
					label = widget.settings.label || widget.properties.stop_id;
					description = t('description.stop');
					break;
				case 'line':
				default:
					icon = <IconArrowLoopRight color="#C61D23" size={30} />;
					label = widget.settings.label || widget.properties.pattern_id;
					description = t('description.line');
					break;
			}
			// Return the list item
			return {
				description: description,
				icon: icon,
				key: widget._id,
				label: label,
				link: `/account/widgets/${widget.type}?widget_id=${widget._id}`,
			};
		});
	}, [accountContext.data.account?.widgets]);

	//
	// C. Render components

	if (!listItems.length) {
		return <NoDataLabel text={t('no_data')} />;
	}

	return (
		<ListSection
			items={listItems}
			title={t('title')}
		/>
	);

	//
}
