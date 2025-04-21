/* * */

import styles from '@/components/screens/MoreScreen/styles';
import { useLocaleContext } from '@/contexts/Locale.context';
import { openWebView } from '@/utils/openWebView';
import { IconAlertTriangle } from '@tabler/icons-react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export function AlertListData() {
	//

	//
	// A. Setup Variables

	const { t } = useTranslation('translation', { keyPrefix: 'more.AlertList' });

	const localeContext = useLocaleContext();
	const moreStyles = styles();

	//
	// B. Fetch Data
	const AlertListData = useMemo(
		() => [
			{
				icon: <IconAlertTriangle color={moreStyles.icon.color} size={32} />,
				id: 0,
				onPress: () => openWebView({ locale: localeContext.locale, url: 'https://carrismetropolitana.pt/alerts' }),
				title: t('service_alerts'),
			},
		],
		[moreStyles.icon.color, t],
	);

	return AlertListData;

	//
};
