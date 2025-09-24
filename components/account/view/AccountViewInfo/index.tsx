/* * */

import { useAccountContext } from '@/contexts/Account.context';
import * as Clipboard from 'expo-clipboard';
import { Text, TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function AccountViewInfo() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const accountContext = useAccountContext();

	//
	// B. Handle actions

	const handlePress = async () => {
		if (!accountContext?.data.account?._id) return;
		await Clipboard.setStringAsync(accountContext?.data.account?._id);
	};

	//
	// C. Render components

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={handlePress}>
				<Text style={styles.accountId}>{accountContext?.data.account?._id}</Text>
			</TouchableOpacity>
		</View>
	);

	//
};
