/* * */

import { ListSection } from '@/components/list/ListSection';
import { type ListSectionItemProps } from '@/components/list/ListSectionItem';
import { useSystemVariables } from '@/theme/global';
import { IconCreditCardPay, IconListSearch, IconMapQuestion, IconTicket } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';

/* * */

export function MoreSectionFares() {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();

	const { t } = useTranslation();

	const LIST_ITEMS: ListSectionItemProps[] = [
		{
			icon: <IconTicket color={systemVariables.text[100]} size={32} />,
			key: 'tickets',
			label: t($ => $.more.MoreSectionFares.items.tickets),
			link: '/more/fares/tickets',
		},
		{
			icon: <IconCreditCardPay color={systemVariables.text[100]} size={32} />,
			key: 'cards',
			label: t($ => $.more.MoreSectionFares.items.cards),
			link: '/more/fares/cards',
		},
		{
			icon: <IconMapQuestion color={systemVariables.text[100]} size={32} />,
			key: 'helpdesks',
			label: t($ => $.more.MoreSectionFares.items.helpdesks),
			link: '/more/fares/helpdesks',
		},
		{
			icon: <IconListSearch color={systemVariables.text[100]} size={32} />,
			key: 'tap-and-ride',
			label: t($ => $.more.MoreSectionFares.items['tap-and-ride']),
			link: '/more/fares/tap-and-ride',
		},
	];

	//
	// B. Render components

	return (
		<ListSection
			items={LIST_ITEMS}
			title={t($ => $.more.MoreSectionFares.heading)}
		/>
	);

	//
};
