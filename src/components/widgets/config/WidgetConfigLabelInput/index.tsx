/* * */

import { ListTitle } from '@/components/list/ListTitle';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetConfigLabelInputProps {
	description?: string
	onChange: (value: string) => void
	title?: string
	value: string
}

/* * */

export function WidgetConfigLabelInput({ description, onChange, title, value }: WidgetConfigLabelInputProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetConfigLabelInput' });

	//
	// B. Render components

	return (
		<>
			{title && <ListTitle description={description} title={title} />}
			<View accessibilityRole="text" style={styles.container}>
				<Text accessible={false} style={styles.text}>{t('label')}</Text>
				<TextInput
					accessibilityLabel={t('accessibility_label')}
					onChangeText={onChange}
					placeholder={t('placeholder')}
					style={styles.input}
					value={value ?? ''}
				/>
			</View>
		</>
	);

	//
};
