'use client';

/* * */

import type { Line } from '@carrismetropolitana/api-types/network';

import { useLinesContext } from '@/contexts/Lines.context';
import { IconInfoTriangleFilled } from '@tabler/icons-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

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
	const badgeStyles = [
		size === 'lg' ? lineBadgeStyles.sizeLg : undefined,
		size === 'md' ? lineBadgeStyles.sizeMd : undefined,
		onPress ? lineBadgeStyles.clickable : undefined,
	].filter(Boolean);

	//
	// B. Transform data

	const fetchedLineData = lineId ? linesContext.actions.getLineDataById(lineId) : undefined;

	//
	// C. Render components

	return (
		<View>
			<Text style={[badgeStyles, { backgroundColor: color || lineData?.color, color: textColor || lineData?.text_color || fetchedLineData?.text_color }]}>
				{shortName || lineData?.short_name || fetchedLineData?.short_name || '• • •'}
			</Text>
			{withAlertIcon && (
				<View style={lineBadgeStyles.alertIcon}>
					<IconInfoTriangleFilled size={12} />
				</View>
			)}
		</View>
	);

	//
}
