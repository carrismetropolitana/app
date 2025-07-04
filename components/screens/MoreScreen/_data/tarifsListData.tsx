/* * */

import styles from '@/components/screens/MoreScreen/styles';
import { useLocaleContext } from '@/contexts/Locale.context';
import { openWebView } from '@/utils/openWebView';
import {
	IconCreditCardPay,
	IconMapQuestion,
	IconTicket,
} from '@tabler/icons-react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export function Tarifslistdata() {
	// A. Setup Variables

	const { t } = useTranslation('translation', { keyPrefix: 'more.TarifsList' });
	const localeContext = useLocaleContext();
	const moreStyles = styles();

	//
	// B. Fetch Data

	const Tarifslistdata = useMemo(
		() => [
			{
				icon: <IconTicket color={moreStyles.icon.color} size={32} />,
				id: 0,
				onPress: () => openWebView({ locale: localeContext.locale, url: 'https://www.carrismetropolitana.pt/tickets' }),
				title: t('ocasional_tickets'),
			},
			{
				icon: <IconCreditCardPay color={moreStyles.icon.color} size={32} />,
				id: 1,
				onPress: () => openWebView({ locale: localeContext.locale, url: 'https://www.carrismetropolitana.pt/cards' }),
				title: t('monthly_tickets'),
			},
			{
				icon: <IconMapQuestion color={moreStyles.icon.color} size={32} />,
				id: 2,
				onPress: () => openWebView({ locale: localeContext.locale, url: 'https://www.carrismetropolitana.pt/helpdesks' }),
				title: t('where_to_buy'),
			},
		],
		[moreStyles.icon.color, t],
	);

	return Tarifslistdata;

//
}
