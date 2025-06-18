/* * */

import type { Line } from '@carrismetropolitana/api-types/network';

import { useAlertsContext } from '@/contexts/Alerts.context';
import { useLinesContext } from '@/contexts/Lines.context';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { Text } from '@rn-vui/themed';
import { IconInfoTriangleFilled } from '@tabler/icons-react-native';
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

export function LineBadge({ color, lineData, lineId, onPress, shortName, size = 'md', textColor, withAlertIcon = false }: Props) {
	//

	//
	// A. Setup variables

	const linesContext = useLinesContext();
	const alertsContext = useAlertsContext();
	const badgeStyles = [
		size === 'lg' ? lineBadgeStyles.sizeLg : undefined,
		size === 'md' ? lineBadgeStyles.sizeMd : undefined,
		onPress ? lineBadgeStyles.clickable : undefined,
	].filter(Boolean);

	//
	// B. Transform data

	const fetchedLineData = lineId ? linesContext.actions.getLineDataById(lineId) : undefined;
	const hasAlerts = alertsContext.actions.getSimplifiedAlertsByLineId((lineData?.id ?? '') || (lineId ?? '')).length > 0;

	//
	// C. Render components
	return (
		<View>
			<Text style={[badgeStyles, { backgroundColor: color ? color : fetchedLineData?.color || lineData?.color, color: textColor || lineData?.text_color || fetchedLineData?.text_color }]}>
				{shortName || lineData?.short_name || fetchedLineData?.short_name || '• • •'}
			</Text>
			{(withAlertIcon || hasAlerts) && (
				<View style={[lineBadgeStyles.alertIcon, { backgroundColor: '#FFFFFF', borderColor: color ? color : fetchedLineData?.color || lineData?.color, borderRadius: 999, borderWidth: 3 }]}>
					<IconInfoTriangleFilled color={color ? color : fetchedLineData?.color || lineData?.color} fill="#FFFFFF" size={14} />
				</View>
			)}
		</View>
	);

	//
}
