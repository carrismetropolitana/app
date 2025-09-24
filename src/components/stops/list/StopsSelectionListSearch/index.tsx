/* * */

import { useSystemVariables } from '@/theme/global';
import { IconSearch } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { TextInput, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface StopsSelectionListSearchProps {
	onChange?: (text: string) => void
	value?: string
}

/* * */

export function StopsSelectionListSearch({ onChange, value }: StopsSelectionListSearchProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	const { t } = useTranslation('translation', { keyPrefix: 'stops.StopsSelectionListSearch' });

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<View style={styles.inputWrapper}>
				<IconSearch color={systemVariables.text[300]} size={28} />
				<TextInput
					clearButtonMode="always"
					onChangeText={onChange}
					placeholder={t('placeholder')}
					placeholderTextColor={systemVariables.text[400]}
					style={styles.input}
					value={value || ''}
				/>
			</View>
		</View>
	);

	//
}
