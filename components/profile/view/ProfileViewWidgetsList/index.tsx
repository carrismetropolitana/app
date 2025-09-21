/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { ListSection } from '@/components/list/ListSection';
import { type ListSectionItemProps } from '@/components/list/ListSectionItem';
import { useAccountContext } from '@/contexts/Account.context';
import { Icon123 } from '@tabler/icons-react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export function ProfileViewWidgetsList() {
	//

	//
	// A. Setup variables

	const accountContext = useAccountContext();

	const { t } = useTranslation('translation', { keyPrefix: 'profile.ProfileViewWidgetsList' });

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
			link: `/widgets/create/${widget.type}?widget_id=${widget._id}`,
		}));
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
