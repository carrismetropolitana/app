/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Routes } from '@/utils/routes';
import { FAB } from '@rn-vui/themed';
import { IconAlertTriangleFilled } from '@tabler/icons-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { styles } from './styles';

/* * */

export default function NetworkOfflineBanner() {
	//

	//
	// A. Setup variables

	const themeContext = useThemeContext();
	const { t } = useTranslation('translation', { keyPrefix: 'common.offlineBanner' });
	const [visible, setVisible] = useState(false);
	const networkOfflineStyles = styles();
	const backgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundLight100;

	//
	// B. Transform data

	const handleNetworkStatus = () => {
		fetch(Routes.API_ACCOUNTS, { method: 'HEAD' })
			.then((response) => {
				const isOnline = response.status === 200 || response.status === 403 || response.status === 401 || response.status === 500;
				return isOnline ? setVisible(false) : setVisible(true);
			})
			.catch(() => {
				setVisible(false);
			});
	};

	useEffect(() => {
		handleNetworkStatus();
		const interval = setInterval(handleNetworkStatus, 10000);
		return () => clearInterval(interval);
	}, []);

	//
	// C. Render components
	return (
		<FAB
			disabledStyle={networkOfflineStyles.fabButton}
			disabledTitleStyle={networkOfflineStyles.fabButtonTitle}
			icon={<IconAlertTriangleFilled fill={backgroundColor} size={22} />}
			size="small"
			style={networkOfflineStyles.fab}
			title={t('message')}
			visible={visible}
			disabled
		/>
	);
}
