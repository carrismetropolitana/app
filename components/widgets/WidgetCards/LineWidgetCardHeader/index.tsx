/* * */

import { LineBadge } from '@/components/lines/LineBadge';
import { useLinesContext } from '@/contexts/Lines.context';
import { useLocaleContext } from '@/contexts/Locale.context';
import { Text } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

interface LineWidgetCardHeaderProps {
	lineId: string
	title: string
}

/* * */

export function LineWidgetCardHeader({ lineId, title }: LineWidgetCardHeaderProps) {
	const linesContext = useLinesContext();
	const headerStyles = styles();

	const isLoading = linesContext.flags?.is_loading;
	const lineData = linesContext.actions.getLineDataById
		? linesContext.actions.getLineDataById(lineId)
		: undefined;
	const localeContext = useLocaleContext();
	const { t } = useTranslation('translation', { keyPrefix: 'lineWidgetCard' });

	if (isLoading) {
		return (
			<View style={headerStyles.container}>
				<Text style={headerStyles.headerTitle}>Loading...</Text>
			</View>
		);
	}

	return (
		<View style={headerStyles.container}>
			<LineBadge color={lineData?.color} lineId={lineId} size="lg" withAlertIcon />
			<Text accessibilityHint={`${t('lineAcessibilityHint', { lineId, title })}`} accessibilityLabel={t('lineAcessibilityLabel', { lineId, title })} accessibilityLanguage={localeContext.locale} accessibilityRole="text" style={headerStyles.headerTitle}>{title}</Text>
		</View>
	);
}
