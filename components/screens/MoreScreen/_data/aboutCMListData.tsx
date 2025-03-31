/* * */

import styles from '@/components/screens/MoreScreen/styles';
import { useLocaleContext } from '@/contexts/Locale.context';
import { openWebView } from '@/utils/openWebView';
import {
	IconChartBar,
	IconGavel,
	IconHomeStar,
	IconLockSquare,
	IconSpeakerphone,
	IconUserHeart,
} from '@tabler/icons-react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export function AboutCMlistdata() {
	//

	//
	// A. Setup Variables

	const { t } = useTranslation('translation', { keyPrefix: 'more.AboutCMList' });

	const localeContext = useLocaleContext();
	const moreStyles = styles();

	//
	// B. Fetch Data
	const AboutCMlistdata = useMemo(
		() => [
			{
				icon: <IconHomeStar color={moreStyles.icon.color} size={32} />,
				id: 0,
				onPress: () => openWebView({ locale: localeContext.locale, url: 'https://carrismetropolitana.pt/about' }),
				title: t('about_carrismetropolitana'),
			},
			{
				icon: <IconChartBar color={moreStyles.icon.color} size={32} />,
				id: 1,
				onPress: () => openWebView({ locale: localeContext.locale, url: 'https://carrismetropolitana.pt/metrics' }),
				title: t('our_operation_live'),
			},
			{
				icon: <IconSpeakerphone color={moreStyles.icon.color} size={32} />,
				id: 2,
				onPress: () => openWebView({ locale: localeContext.locale, url: 'https://carrismetropolitana.pt/opendata' }),
				title: t('open_data'),
			},
			{
				icon: <IconUserHeart color={moreStyles.icon.color} size={32} />,
				id: 3,
				onPress: () => openWebView({ locale: localeContext.locale, url: 'https://carrismetropolitana.pt/motoristas' }),
				title: t('recruitment'),
			},
			{
				icon: <IconLockSquare color={moreStyles.icon.color} size={32} />,
				id: 4,
				onPress: () => openWebView({ locale: localeContext.locale, url: 'https://www.carrismetropolitana.pt/privacy' }),
				title: t('privacy'),
			},
			{
				icon: <IconGavel color={moreStyles.icon.color} size={32} />,
				id: 5,
				onPress: () => openWebView({ locale: localeContext.locale, url: 'https://www.carrismetropolitana.pt/legal' }),
				title: t('legal_notices'),
			},
		],
		[moreStyles.icon.color, t],
	);

	return AboutCMlistdata;

	//
};
