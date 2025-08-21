/* * */

import type { Line } from '@carrismetropolitana/api-types/network';

import { useAlertsContext } from '@/contexts/Alerts.context';
import { useLinesContext } from '@/contexts/Lines.context';
import { useLocaleContext } from '@/contexts/Locale.context';
import { Text } from '@rn-vui/themed';
import { IconInfoTriangleFilled } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { lineBadgeStyles } from './styles';

/* * */

interface Props {
	color?: string
	lineData?: Line
	lineId?: string
	onPress?: () => void
	shortName?: string
	size?: 'lg' | 'md'
	textColor?: string
	withAlertIcon?: boolean
}

/* * */

export function LineBadge({ color, lineData, lineId, onPress, shortName, size = 'md', textColor, withAlertIcon }: Props) {
	//

	//
	// A. Setup variables

	const linesContext = useLinesContext();
	const alertsContext = useAlertsContext();
	const localeContext = useLocaleContext();

	const badgeStyles = [
		size === 'lg' && lineBadgeStyles.sizeLg,
		size === 'md' && lineBadgeStyles.sizeMd,
		onPress && lineBadgeStyles.clickable,
	];

	const { t } = useTranslation('translation', { keyPrefix: 'linebadge' });
	//
	// B. Transform data

	const fetchedLineData = lineId ? linesContext.actions.getLineDataById(lineId) : undefined;
	const hasAlerts = alertsContext.actions.getSimplifiedAlertsByLineId((lineData?.id ?? '') || (lineId ?? '')).length > 0;

	//
	// C. Render components
	return (
		<View>
			<Text
				accessibilityHint={`${t('lineAccessibilityHint')} ${shortName || lineData?.short_name || fetchedLineData?.short_name}`}
				accessibilityLabel={`${t('lineAccessibilityLabel')} ${shortName || lineData?.short_name || fetchedLineData?.short_name}`}
				accessibilityLanguage={localeContext.locale}
				accessibilityRole="button"
				style={[badgeStyles, { backgroundColor: color ? color : fetchedLineData?.color || lineData?.color, color: textColor || lineData?.text_color || fetchedLineData?.text_color }]}
			>
				{shortName || lineData?.short_name || fetchedLineData?.short_name || '• • •'}
			</Text>
			{hasAlerts && withAlertIcon && (
				<View
					accessibilityHint={`${t('lineAccessibilityHint')} ${shortName || lineData?.short_name || fetchedLineData?.short_name} ${t('linesAccessibilityWithAlerts')}`}
					accessibilityLabel={`${t('lineAccessibilityLabel')} ${shortName || lineData?.short_name || fetchedLineData?.short_name} ${t('linesAccessibilityWithAlerts')}`}
					accessibilityRole="button"
					style={[lineBadgeStyles.alertIcon, { backgroundColor: '#FFFFFF', borderColor: color ? color : fetchedLineData?.color || lineData?.color, borderRadius: 999, borderWidth: 2 }]}
				>
					<IconInfoTriangleFilled color={color ? color : fetchedLineData?.color || lineData?.color} fill="#FFFFFF" size={14} />
				</View>
			)}
		</View>
	);

	//
}
