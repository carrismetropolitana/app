/* * */

import { Surface } from '@/components/common/layout/Surface';
import { LicensePlate } from '@/components/common/LicensePlate';
import { LineBadge } from '@/components/lines/LineBadge';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
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
					<View style={lineDetailsHeaderStyles.busInfoSection}>
						<LicensePlate value={data?.license_plate || ''} />
						<Text style={lineDetailsHeaderStyles.busInfoText}> {data?.make} • {data?.model} </Text>
					</View>
					<View style={lineDetailsHeaderStyles.accessibilitySection}>
						{/* {data?.wheelchair_accessible ? <IconDisabled2 color={theming.colorStatusOkText} size={32} /> : <IconDisabledOff color={theming.colorStatusOkText} size={32} />}
						{data?.bikes_allowed ? <IconBike color={theming.colorStatusOkText} size={32} /> : <IconBikeOff color={theming.colorStatusOkText} size={32} />} */}

						{data?.wheelchair_accessible ? <IconDisabled2 color={theming.colorStatusOkText} size={32} /> : <IconDisabledOff color={theming.colorStatusOkText} size={32} />}
						{data?.occupancy_status && data?.occupancy_status.toString() === 'FULL' && data?.occupancy_status.toString() === 'NO_DATA_AVAILABLE'
						&& (
							<>
								<IconUser color={theming.colorStatusOkText} size={32} />
								<IconCircleFilled color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
								<IconCircleFilled color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
								<IconCircleFilled color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
							</>
						)}
						{data?.occupancy_status && data?.occupancy_status.toString() === 'EMPTY'
						&& (
							<>
								<IconUser color={theming.colorStatusOkText} size={32} />
								<IconCircleFilled color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
								<IconCircleFilled color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
								<IconCircleFilled color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
							</>
						)}
						{data?.occupancy_status && data?.occupancy_status.toString() === 'SEATS_AVAILABLE'
						&& (
							<>
								<IconUser color={theming.colorStatusOkText} size={32} />
								<IconCircleFilled color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
								<IconCircleFilled color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
								<IconCircleFilled color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
							</>
						)}
						{data?.occupancy_status && data?.occupancy_status.toString() === 'STANDING_ONLY'
						&& (
							<>
								<IconUser color={theming.colorStatusOkText} size={32} />
								<IconCircleFilled color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
								<IconCircleFilled color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
								<IconCircleFilled color={theming.colorStatusOkText} fill={theming.colorStatusOkText}size={26} />
							</>
						)}

						{!data?.occupancy_status && (
							<>
								<IconUser color={theming.colorStatusOkText} size={32} />
								<IconCircleFilled color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
								<IconCircleFilled color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
								<IconCircleFilled color={theming.colorStatusOkText} fill={theming.colorStatusOkText} size={26} />
							</>
						)}

					</View>
				</View>
			</View>
		</Surface>
	);

	//
}
