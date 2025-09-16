/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { ListSection } from '@/components/list/ListSection';
import { type ListSectionItemProps } from '@/components/list/ListSectionItem';
import { useProfileContext } from '@/contexts/Profile.context';
import { Icon123 } from '@tabler/icons-react-native';
import { useMemo } from 'react';

/* * */

export function ProfileViewWidgetsList() {
	//

	//
	// A. Setup variables

	const profileContext = useProfileContext();

	//
	// B. Transform data

	const listItems: ListSectionItemProps[] = useMemo(() => {
		if (!profileContext.data.profile?.widgets) return [];
		const sorted = profileContext.data.profile.widgets.sort((a, b) => (a.settings?.display_order ?? 0) - (b.settings?.display_order ?? 0));
		return sorted.map(widget => ({
			icon: <Icon123 />,
			key: widget.id,
			label: widget.label ?? 'No label',
			link: `/widgets/config/${widget.id}`,
		}));
	}, [profileContext.data.profile?.widgets]);

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
