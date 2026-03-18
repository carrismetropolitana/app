/* * */

import { useSystemVariables } from '@/theme/global';
import { IconSearch } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { TextInput, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface SearchBarProps {
	autoFocus?: boolean
	onBlur?: () => void
	onChange?: (text: string) => void
	onFocus?: () => void
	value?: string
}

/* * */

export function SearchBar({ autoFocus, onBlur, onChange, onFocus, value }: SearchBarProps) {
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
			<View style={styles.iconWrapper}>
				<IconSearch color={systemVariables.text[300]} size={28} />
			</View>
			<TextInput
				accessibilityRole="search"
				autoFocus={autoFocus}
				clearButtonMode="always"
				onBlur={onBlur}
				onChangeText={onChange}
				onFocus={onFocus}
				placeholder={t($ => $.common.SearchBar.placeholder)}
				placeholderTextColor={systemVariables.text[400]}
				style={styles.input}
				value={value || ''}
			/>
		</View>
	);

	//
}
