/* * */

import { AccountViewInfo } from '@/components/account/view/AccountViewInfo';
import { NoDataLabel } from '@/components/common/NoDataLabel';
import { useSystemVariables } from '@/theme/global';
import { IconCloudExclamation } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function AccountViewError() {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	const { t } = useTranslation();

	//
	// B. Render components

	return (
        <View style={styles.container}>
            <IconCloudExclamation color={systemVariables.border[200]} size={75} />
            <NoDataLabel text={t($ => $.account.AccountViewError.message_1)} />
            <Text style={styles.message}>{t($ => $.account.AccountViewError.message_2)}</Text>
            <Text style={styles.thanks}>{t($ => $.account.AccountViewError.message_3)}</Text>
            <AccountViewInfo />
        </View>
    );

	//
};
