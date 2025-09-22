/* * */

import { CopyBadge } from '@/components/common/CopyBadge';
import { Surface } from '@/components/common/layout/Surface';
import { LicensePlate } from '@/components/common/LicensePlate';
import { LineBadge } from '@/components/lines/LineBadge';
import { useDebugContext } from '@/contexts/Debug.context';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useLocaleContext } from '@/contexts/Locale.context';
import { theming } from '@/theme/Variables';
import { Vehicle } from '@carrismetropolitana/api-types/vehicles';
import { Text } from '@rn-vui/themed';
import { IconCircleFilled, IconDisabled2, IconDisabledOff, IconUser } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

interface VehiclesDetailHeaderProps {
	data?: null | Vehicle
}

/* * */
export function VehiclesDetailHeader({ data }: VehiclesDetailHeaderProps) {
	//

	//
	// A. Setup variables
	const linesDetailContext = useLinesDetailContext();
	const debugContext = useDebugContext();
	const localeContext = useLocaleContext();
	const { t } = useTranslation('translation', { keyPrefix: 'vehicles.VehiclesDetailHeader' });

	const lineDetailsHeaderStyles = styles();

	//
	// B. Render components

	if (!linesDetailContext.data.line) {
		return null;
	}

	return (
		<Surface>
			<View style={lineDetailsHeaderStyles.headingSection}>
				<View style={lineDetailsHeaderStyles.headingSectionRow}>

					<View style={lineDetailsHeaderStyles.headingFirstSection}>
						<LineBadge lineData={linesDetailContext.data.line} size="lg" />
						<Text style={lineDetailsHeaderStyles.lineDestination}> {t('direction')} </Text>
						<Text style={lineDetailsHeaderStyles.lineName}>{linesDetailContext.data.line.long_name}</Text>
					</View>

					{debugContext.flags.is_debug_mode && (
						<View>
							<CopyBadge label={`Vehicle ID: ${data?.id || 'NULL'}`} value={data?.id || 'NULL'} />
						</View>
					)}

					<View style={lineDetailsHeaderStyles.busInfoSection}>
						<LicensePlate value={data?.license_plate || ''} />
						<Text style={lineDetailsHeaderStyles.busInfoText}> {data?.make} • {data?.model} </Text>
					</View>
					<View style={lineDetailsHeaderStyles.accessibilitySection}>
						{data?.wheelchair_accessible
							? <IconDisabled2 accessibilityHint={t('wheelchairAvailableAccessibilityHint')} accessibilityLabel={t('wheelchairAvailableAccessibilityLabel')} accessibilityLanguage={localeContext.data.locale} accessibilityRole="text" color={theming.colorStatusOkText} size={32} />
							: <IconDisabledOff accessibilityHint={t('wheelchairNotAvailableAccessibilityHint')} accessibilityLabel={t('wheelchairNotAvailableAccessibilityLabel')} accessibilityLanguage={localeContext.data.locale} accessibilityRole="text" color={theming.colorStatusOkText} size={32} />}
						{data?.occupancy_status && data?.occupancy_status.toString() === 'FULL' && data?.occupancy_status.toString() === 'NO_DATA_AVAILABLE'
						&& (
							<>
								<IconUser accessibilityHint={t('occupancyFullAccessibilityHint')} accessibilityLabel={t('occupancyFullAccessibilityLabel')} accessibilityLanguage={localeContext.data.locale} accessibilityRole="text" color={theming.colorStatusOkText} size={32} />
								<IconCircleFilled accessible={false} color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
								<IconCircleFilled accessible={false} color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
								<IconCircleFilled accessible={false} color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
							</>
						)}
						{data?.occupancy_status && data?.occupancy_status.toString() === 'EMPTY'
						&& (
							<>
								<IconUser accessibilityHint={t('occupancyEmptyAccessibilityHint')} accessibilityLabel={t('occupancyEmptyAccessibilityLabel')} accessibilityLanguage={localeContext.data.locale} accessibilityRole="text" color={theming.colorStatusOkText} size={32} />
								<IconCircleFilled accessible={false}color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
								<IconCircleFilled accessible={false}color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
								<IconCircleFilled accessible={false}color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
							</>
						)}
						{data?.occupancy_status && data?.occupancy_status.toString() === 'SEATS_AVAILABLE'
						&& (
							<>
								<IconUser accessibilityHint={t('occupancySeatsAvailableAccessibilityHint')} accessibilityLabel={t('occupancySeatsAvailableAccessibilityLabel')} accessibilityLanguage={localeContext.data.locale} accessibilityRole="text" color={theming.colorStatusOkText} size={32} />
								<IconCircleFilled accessible={false}color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
								<IconCircleFilled accessible={false}color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
								<IconCircleFilled accessible={false}color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
							</>
						)}
						{data?.occupancy_status && data?.occupancy_status.toString() === 'STANDING_ONLY'
						&& (
							<>
								<IconUser accessibilityHint={t('occupancyStandingOnlyAccessibilityHint')} accessibilityLabel={t('occupancyStandingOnlyAccessibilityLabel')} accessibilityLanguage={localeContext.data.locale} accessibilityRole="text" color={theming.colorStatusOkText} size={32} />
								<IconCircleFilled accessible={false} color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
								<IconCircleFilled accessible={false} color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
								<IconCircleFilled accessible={false} color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
							</>
						)}

						{!data?.occupancy_status && (
							<>
								<IconUser accessibilityHint={t('occupancyUnknownAccessibilityHint')} accessibilityLabel={t('occupancyUnknownAccessibilityLabel')} accessibilityLanguage={localeContext.data.locale} accessibilityRole="text" color={theming.colorStatusOkText} size={32} />
								<IconCircleFilled accessible={false} color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
								<IconCircleFilled accessible={false} color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
								<IconCircleFilled accessible={false} color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
							</>
						)}

					</View>
				</View>
			</View>
		</Surface>
	);

	//
}
