/* * */

import { useSystemVariables } from '@/theme/global';
import { IconSearch } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { TextInput, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface LinesSelectionListSearchProps {
	onChange?: (text: string) => void
	value?: string
}

/* * */

export function LinesSelectionListSearch({ onChange, value }: LinesSelectionListSearchProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	const { t } = useTranslation('translation', { keyPrefix: 'lines.LinesSelectionListSearch' });

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
