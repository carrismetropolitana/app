/* * */

import { ListSection } from '@/components/list/ListSection';
import { type ListSectionItemProps } from '@/components/list/ListSectionItem';
import { useSystemVariables } from '@/theme/global';
import { IconBus, IconChartBar, IconGavel, IconHomeSpark, IconLockSquare, IconPrompt, IconUserHeart } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';

/* * */

export function MoreSectionAbout() {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();

	const { t } = useTranslation();

	const LIST_ITEMS: ListSectionItemProps[] = [
		{
			icon: <IconHomeSpark color={systemVariables.text[100]} size={32} />,
			key: 'about',
			label: t($ => $.more.MoreSectionAbout.items.about),
			link: '/more/about',
		},
		{
			icon: <IconChartBar color={systemVariables.text[100]} size={32} />,
			key: 'metrics',
			label: t($ => $.more.MoreSectionAbout.items.metrics),
			link: '/more/about/metrics',
		},
		{
			icon: <IconPrompt color={systemVariables.text[100]} size={32} />,
			key: 'open-data',
			label: t($ => $.more.MoreSectionAbout.items['open-data']),
			link: '/more/about/open-data',
		},
		{
			icon: <IconUserHeart color={systemVariables.text[100]} size={32} />,
			key: 'drivers',
			label: t($ => $.more.MoreSectionAbout.items.drivers),
			link: '/more/about/drivers',
		},
		{
			icon: <IconBus color={systemVariables.text[100]} size={32} />,
			key: 'vehicles',
			label: t($ => $.more.MoreSectionAbout.items.vehicles),
			link: '/more/about/vehicles',
		},
		{
			icon: <IconLockSquare color={systemVariables.text[100]} size={32} />,
			key: 'privacy',
			label: t($ => $.more.MoreSectionAbout.items.privacy),
			link: '/more/about/privacy',
		},
		{
			icon: <IconGavel color={systemVariables.text[100]} size={32} />,
			key: 'legal',
			label: t($ => $.more.MoreSectionAbout.items.legal),
			link: '/more/about/legal',
		},
	];

	//
	// B. Render components

	return (
		<ListSection
			items={LIST_ITEMS}
			title={t($ => $.more.MoreSectionAbout.heading)}
		/>
	);

	//
};
