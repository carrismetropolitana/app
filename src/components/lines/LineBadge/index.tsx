/* * */

import { useAlertsContext } from '@/contexts/Alerts.context';
import { useLinesContext } from '@/contexts/Lines.context';
import { IconAlertTriangleFilled } from '@tabler/icons-react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface LineBadgeProps {
	lineId?: string
	onPress?: (lineId: string) => void
	size?: 'lg' | 'md' | 'sm'
	withAlertIcon?: boolean
}

/* * */

export function LineBadge({ lineId, onPress, size = 'md', withAlertIcon }: LineBadgeProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const linesContext = useLinesContext();
	const alertsContext = useAlertsContext();

	const { t } = useTranslation('translation', { keyPrefix: 'lines.LineBadge' });

	//
	// B. Transform data

	const lineData = useMemo(() => {
		if (!lineId) return;
		return linesContext.actions.getLineDataById(lineId);
	}, [lineId, linesContext.data.lines]);

	const hasAlert = useMemo(() => {
		if (!lineId || !withAlertIcon) return false;
		return alertsContext.actions.getSimplifiedAlertsByLineId(lineId).length > 0;
	}, [alertsContext.data.alerts, lineData, lineId]);

	const accessibilityLabel = useMemo(() => {
		if (!lineData) return;
		if (!hasAlert) return t('label', { lineName: lineData.short_name });
		return t('with_alert', { lineName: lineData.short_name });
	}, [lineData]);

	//
	// C. Handle actions

	const handlePress = () => {
		if (!lineId) return;
		if (!onPress) return;
		onPress(lineId);
	};

	//
	// D. Render components

	if (!lineData) {
		return null;
	}

	if (!onPress) {
		return (
			<View
				accessibilityLabel={accessibilityLabel}
				style={[
					styles.container,
					size === 'sm' && styles.containerSizeSm,
					size === 'md' && styles.containerSizeMd,
					size === 'lg' && styles.containerSizeLg,
					{ backgroundColor: lineData.color },
				]}
			>

				<Text style={[
					styles.label,
					size === 'sm' && styles.labelSizeSm,
					size === 'md' && styles.labelSizeMd,
					size === 'lg' && styles.labelSizeLg,
					{ color: lineData.text_color },
				]}
				>
					{lineData.short_name || '• • •'}
				</Text>

				{hasAlert && withAlertIcon && (
					<View style={[
						styles.alert,
						size === 'sm' && styles.alertSizeSm,
						size === 'md' && styles.alertSizeMd,
						size === 'lg' && styles.alertSizeLg,
						{ backgroundColor: lineData.text_color, borderColor: lineData.color },
					]}
					>
						<IconAlertTriangleFilled
							color={lineData.color}
							size={size === 'sm' ? 12 : size === 'md' ? 16 : size === 'lg' ? 18 : 16}
						/>
					</View>
				)}

			</View>
		);
	}

	return (
		<TouchableOpacity
			accessibilityHint={t('accessibility_hint')}
			accessibilityLabel={accessibilityLabel}
			disabled={!onPress}
			onPress={handlePress}
			style={[
				styles.container,
				size === 'sm' && styles.containerSizeSm,
				size === 'md' && styles.containerSizeMd,
				size === 'lg' && styles.containerSizeLg,
				{ backgroundColor: lineData.color },
			]}
		>

			<Text style={[
				styles.label,
				size === 'sm' && styles.labelSizeSm,
				size === 'md' && styles.labelSizeMd,
				size === 'lg' && styles.labelSizeLg,
				{ color: lineData.text_color },
			]}
			>
				{lineData.short_name || '• • •'}
			</Text>

			{hasAlert && withAlertIcon && (
				<View style={[
					styles.alert,
					size === 'sm' && styles.alertSizeSm,
					size === 'md' && styles.alertSizeMd,
					size === 'lg' && styles.alertSizeLg,
					{ backgroundColor: lineData.text_color, borderColor: lineData.color },
				]}
				>
					<IconAlertTriangleFilled
						color={lineData.color}
						size={size === 'sm' ? 12 : size === 'md' ? 16 : size === 'lg' ? 18 : 16}
					/>
				</View>
			)}

		</TouchableOpacity>
	);

	//
}
