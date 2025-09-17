/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { ListSection } from '@/components/list/ListSection';
import { type ListSectionItemProps } from '@/components/list/ListSectionItem';
import { useAccountContext } from '@/contexts/Account.context';
import { Icon123 } from '@tabler/icons-react-native';
import { useMemo } from 'react';

/* * */

export function ProfileViewWidgetsList() {
	//

	//
	// A. Setup variables

	const accountContext = useAccountContext();

	//
	// B. Transform data

	const listItems: ListSectionItemProps[] = useMemo(() => {
		if (!accountContext.data.account?.widgets) return [];
		const sortedWidgets = accountContext.data.account.widgets.sort((a, b) => {
			return (a.settings.display_order ?? 0) - (b.settings.display_order ?? 0);
		});
		return sortedWidgets.map(widget => ({
			icon: <Icon123 />,
			key: widget._id,
			label: widget.settings.label ?? 'No label',
			link: `/widgets/${widget.type}/${widget._id}`,
		}));
	}, [accountContext.data.account?.widgets]);

	//
	// C. Render components

	if (!listItems.length) {
		return <NoDataLabel text="No widgets added yet" />;
	}

	return (
		<ListSection
			items={listItems}
			title="title"
		/>
	);

	//
}
