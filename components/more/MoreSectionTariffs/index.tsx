/* * */

import { ListSection } from '@/components/list/ListSection';
import { type ListSectionItemProps } from '@/components/list/ListSectionItem';
import { useSystemVariables } from '@/theme/global';
import { IconCreditCardPay, IconMapQuestion, IconTicket } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';

/* * */

export function MoreSectionTariffs() {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'more.MoreSectionTariffs' });

	const LIST_ITEMS: ListSectionItemProps[] = [
		{
			icon: <IconTicket color={useSystemVariables().text[100]} size={32} />,
			key: 'tickets',
			label: t('items.tickets'),
			link: '/webview?url=https://www.carrismetropolitana.pt/tickets',
		},
		{
			icon: <IconCreditCardPay color={useSystemVariables().text[100]} size={32} />,
			key: 'cards',
			label: t('items.cards'),
			link: '/webview?url=https://www.carrismetropolitana.pt/cards',
		},
		{
			icon: <IconMapQuestion color={useSystemVariables().text[100]} size={32} />,
			key: 'helpdesks',
			label: t('items.helpdesks'),
			link: '/webview?url=https://www.carrismetropolitana.pt/helpdesks',
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
