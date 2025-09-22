/* * */

import { ListSection } from '@/components/list/ListSection';
import { type ListSectionItemProps } from '@/components/list/ListSectionItem';
import { useSystemVariables } from '@/theme/global';
import { IconBuildingStore, IconHelpHexagon, IconMessages, IconUmbrella } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';

/* * */

export function MoreSectionSupport() {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();

	const { t } = useTranslation('translation', { keyPrefix: 'more.MoreSectionSupport' });

	const LIST_ITEMS: ListSectionItemProps[] = [
		{
			icon: <IconHelpHexagon color={systemVariables.text[100]} size={32} />,
			key: 'faq',
			label: t('items.faq'),
			link: '/more/support/faq',
		},
		{
			icon: <IconUmbrella color={systemVariables.text[100]} size={32} />,
			key: 'lost_and_found',
			label: t('items.lost_and_found'),
			link: '/more/support/lost-and-found',
		},
		{
			icon: <IconBuildingStore color={systemVariables.text[100]} size={32} />,
			key: 'stores',
			label: t('items.stores'),
			link: '/more/support/stores',
		},
		{
			icon: <IconMessages color={systemVariables.text[100]} size={32} />,
			key: 'contacts',
			label: t('items.contacts'),
			link: '/more/support/contacts',
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
