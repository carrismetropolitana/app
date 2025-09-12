/* * */

import { ListSection } from '@/components/list/ListSection';
import { type ListSectionItemProps } from '@/components/list/ListSectionItem';
import { useSystemVariables } from '@/theme/global';
import { IconChartBarPopular, IconGavel, IconHomeStar, IconLockSquare, IconSpeakerphone, IconUserHeart } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';

/* * */

export function MoreSectionAbout() {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'more.MoreSectionAbout' });

	const LIST_ITEMS: ListSectionItemProps[] = [
		{
			icon: <IconHomeStar color={useSystemVariables().text[100]} size={32} />,
			key: 'about',
			label: t('items.about'),
			link: '/webview?url=https://carrismetropolitana.pt/about',
		},
		{
			icon: <IconChartBarPopular color={useSystemVariables().text[100]} size={32} />,
			key: 'metrics',
			label: t('items.metrics'),
			link: '/webview?url=https://carrismetropolitana.pt/metrics',
		},
		{
			icon: <IconSpeakerphone color={useSystemVariables().text[100]} size={32} />,
			key: 'opendata',
			label: t('items.opendata'),
			link: '/webview?url=https://carrismetropolitana.pt/opendata',
		},
		{
			icon: <IconUserHeart color={useSystemVariables().text[100]} size={32} />,
			key: 'drivers',
			label: t('items.drivers'),
			link: '/webview?url=https://carrismetropolitana.pt/drivers',
		},
		{
			icon: <IconLockSquare color={useSystemVariables().text[100]} size={32} />,
			key: 'privacy',
			label: t('items.privacy'),
			link: '/webview?url=https://www.carrismetropolitana.pt/privacy',
		},
		{
			icon: <IconGavel color={useSystemVariables().text[100]} size={32} />,
			key: 'legal',
			label: t('items.legal'),
			link: '/webview?url=https://www.carrismetropolitana.pt/legal',
		},
	];

	//
	// B. Render components

	return (
		<ListSection
			items={LIST_ITEMS}
			title={t('heading')}
		/>
	);

	//
};
