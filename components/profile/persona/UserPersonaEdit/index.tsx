/* * */

import { useAccountContext } from '@/contexts/Account.context';
import { getServiceUrl } from '@/settings/service-urls';
import { fetchData } from '@/utils/fetchData';
import { IconArrowNarrowLeft, IconArrowsShuffle } from '@tabler/icons-react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function UserPersonaEdit() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const accountContext = useAccountContext();

	const { t } = useTranslation('translation', { keyPrefix: 'profile.UserPersonaEdit' });

	//
	// B. Transform data

	const historyEnabled = useMemo(() => {
		if (!accountContext.data.account?.persona.image_history.length) return false;
		return true;
	}, [accountContext.data.account?.persona.image_history]);

	//
	// C. Handle actions

	const handleGoBack = async () => {
		// Skip if no history
		if (!accountContext.data.account?.persona.image_history.length) return;
		// Create a copy of the history array minus the last element
		const copyOfHistory = [...accountContext.data.account.persona.image_history];
		// Get the most recent image ID from the history
		const mostRecentImage = copyOfHistory.pop();
		// Update the account with the previous image ID
		accountContext.actions.update('persona.image_history', copyOfHistory);
		accountContext.actions.update('persona.image_id', mostRecentImage);
	};

	const handleRandomize = async () => {
		const response = await fetchData<string>(`${getServiceUrl('accounts')}/personas`);
		if (!response.data) return;
		accountContext.actions.update('persona.image_history', [...accountContext.data.account?.persona.image_history ?? [], accountContext.data.account?.persona.image_id]);
		accountContext.actions.update('persona.image_id', response.data);
	};

	//
	// D. Render components

	return (
		<View style={styles.container}>

			{historyEnabled && (
				<TouchableOpacity
					aria-label={t('go_back')}
					onPress={handleGoBack}
					style={styles.button}
				>
					<IconArrowNarrowLeft
						color={accountContext.data.account?.persona.accent_color ?? '#000000'}
						size={30}
					/>
				</TouchableOpacity>
			)}

			<TouchableOpacity
				aria-label={t('randomize')}
				onPress={handleRandomize}
				style={styles.button}
			>
				<IconArrowsShuffle
					color={accountContext.data.account?.persona.accent_color ?? '#000000'}
					size={26}
				/>
			</TouchableOpacity>

		</View>
	);

	//
};
