/* * */

import { FavoriteToggle } from '@/components/common/FavoriteToggle';
import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { SelectOperationalDay } from '@/components/common/SelectOperationalDay';
import { LineBadge } from '@/components/lines/LineBadge';
import { LineDebugDetail } from '@/components/lines/LineDebugDetail';
import { SelectActivePatternGroup } from '@/components/lines/SelectActivePatternGroup';
import { useDebugContext } from '@/contexts/Debug.context';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { Text } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

export function LinesDetailHeader() {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('tranaslations', { keyPrefix: 'lines.LinesDetail' });
	const profileContext = useProfileContext();
	const linesDetailContext = useLinesDetailContext();
	const debugContext = useDebugContext();

	const lineDetailsHeaderStyles = styles();

	//
	// B. Handle actions

	const handleToggleFavorite = async () => {
		if (!linesDetailContext.data.line) return;
		try {
			await profileContext.actions.toggleFavoriteLine(linesDetailContext.data.line.id);
		}
		catch (error) {
			alert(error.message);
		}
	};

	//
	// C. Render components

	if (!linesDetailContext.data.line) {
		return null;
	}

	return (
		<>
			<Surface>
				<View style={lineDetailsHeaderStyles.headingSection}>
					<Section withBottomDivider>
						<View style={lineDetailsHeaderStyles.headingSectionRow}>
							<LineBadge lineData={linesDetailContext.data.line} size="lg" />
							<Text style={lineDetailsHeaderStyles.lineName}>{linesDetailContext.data.line.long_name}</Text>
							<FavoriteToggle color={linesDetailContext.data.line.color} isActive={linesDetailContext.flags.is_favorite} onToggle={handleToggleFavorite} />
						</View>
					</Section>
				</View>

				<View style={lineDetailsHeaderStyles.operationalDaySection}>
					<SelectOperationalDay />
				</View>

				{/* <View style={lineDetailsHeaderStyles.operationalDaySection}>
					<SelectOperationalDay />

				</View> */}

				{/* <Section withPadding>
					<View style={lineDetailsHeaderStyles.container}>

						<View>
							<SelectActivePatternGroup />
						</View>
					</View>
				</Section> */}
			</Surface>

			{debugContext.flags.is_debug_mode && (
				<Surface variant="debug">
					<Section withPadding>
						<LineDebugDetail
							activePattern={linesDetailContext.data.active_pattern}
							lineColor={linesDetailContext.data.line.color}
							totalStops={linesDetailContext.data.active_pattern?.path.length}
						/>
					</Section>
				</Surface>
			)}

		</>
	);

	//
}
