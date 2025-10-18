/* * */

import { HomeScreenFavoriteLinesBar } from '@/components/home/HomeScreenFavoriteLinesBar';
import { HomeScreenGeneralStatus } from '@/components/home/HomeScreenGeneralStatus';
import { HomeScreenTopBar } from '@/components/home/HomeScreenTopBar';
import { useAccessibilityContext } from '@/contexts/Accessibility.context';
import { useAccountContext } from '@/contexts/Account.context';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function HomeScreenListHeader() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const accountContext = useAccountContext();
	const accessibilityContext = useAccessibilityContext();

	const { t } = useTranslation('translation', { keyPrefix: 'home.HomeScreenListHeader' });

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<HomeScreenTopBar />
			<HomeScreenGeneralStatus />
			<HomeScreenFavoriteLinesBar />

			{accessibilityContext.flags.screen_reader && (
				<Text style={styles.screenReaderText}>
					{t('accessibility_label', { count: accountContext.data.account?.widgets.length || 0 })}
				</Text>
			)}

		</View>
	);

	//
}
