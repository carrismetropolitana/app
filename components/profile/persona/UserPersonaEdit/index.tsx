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
		// Get a copy of the current persona image and history
		const currentHistory = [...accountContext.data.account?.persona.image_history ?? []];
		const currentImage = accountContext.data.account?.persona.image_id;
		// Fetch a new random image from the API until it's different
		// from the current one and not in the recent history
		let newImageId: string;
		do {
			// Fetch a new random image from the API
			const response = await fetchData<string>(`${getServiceUrl('accounts')}/personas`);
			if (!response.data) return;
			// Store the new image ID
			newImageId = response.data;
		} while (newImageId === currentImage || currentHistory.includes(newImageId));
		// Ensure the history doesn't exceed the limit
		// (e.g., 50 items). If it does, remove the oldest entries.
		const historyLimit = 50;
		if (currentHistory.length >= historyLimit) currentHistory.splice(0, currentHistory.length - historyLimit);
		// Add the current image to the history, if it exists
		if (currentImage) currentHistory.push(currentImage);
		// Update the account with the new history and image ID
		accountContext.actions.update('persona.image_history', currentHistory);
		accountContext.actions.update('persona.image_id', newImageId);
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
