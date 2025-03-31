/* * */

import styles from '@/components/screens/MoreScreen/styles';
import { useLocaleContext } from '@/contexts/Locale.context';
import { openWebView } from '@/utils/openWebView';
import {
	IconBuildingStore,
	IconHelpHexagon,
	IconMessages,
	IconUmbrella,
} from '@tabler/icons-react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export function Supportlistdata() {
	//

	//
	// A. Setup Variables

	const { t } = useTranslation('translation', { keyPrefix: 'more.SupportList' });
	const moreStyles = styles();
	const localeContext = useLocaleContext();

	//

	// B. Fetch Data
	const Supportlistdata = useMemo(
		() => [
			{
				icon: <IconHelpHexagon color={moreStyles.icon.color} size={32} />,
				id: 0,
				onPress: () => openWebView({ locale: localeContext.locale, url: 'https://www.carrismetropolitana.pt/faq' }),
				title: t('frequently_asked'),
			},
			{
				icon: <IconUmbrella color={moreStyles.icon.color} size={32} />,
				id: 1,
				onPress: () => openWebView({ locale: localeContext.locale, url: 'https://www.carrismetropolitana.pt/lost-and-found' }),
				title: t('lost_found'),
			},
			{
				icon: <IconBuildingStore color={moreStyles.icon.color} size={32} />,
				id: 2,
				onPress: () => openWebView({ locale: localeContext.locale, url: 'https://www.carrismetropolitana.pt/stores' }),
				title: t('stores'),
			},
			{
				icon: <IconMessages color={moreStyles.icon.color} size={32} />,
				id: 3,
				onPress: () => openWebView({ locale: localeContext.locale, url: 'https://www.carrismetropolitana.pt/app-ios/stores' }),
				title: t('contacts'),
			},
		],
		[moreStyles.icon.color, t],
	);

	return Supportlistdata;
//
};
