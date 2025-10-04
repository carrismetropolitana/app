/* * */

import { FavoriteToggle } from '@/components/common/FavoriteToggle';
import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { SelectOperationalDate } from '@/components/common/SelectOperationalDate';
import { LineBadge } from '@/components/lines/LineBadge';
import { LineDebugDetail } from '@/components/lines/LineDebugDetail';
import { SelectActivePatternGroup } from '@/components/lines/SelectActivePatternGroup';
import { useAnalyticsContext } from '@/contexts/Analytics.context';
import { useDebugContext } from '@/contexts/Debug.context';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { useLocaleContext } from '@/contexts/Locale.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { Text } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';

import { LineDisplayTts } from '../../LineDisplayTts';
import { styles } from './styles';

/* * */

export function LineDetailHeader() {
	//

	//
	// A. Setup variables

	const profileContext = useProfileContext();
	const lineDetailContext = useLineDetailContext();
	const localeContext = useLocaleContext();
	const debugContext = useDebugContext();
	const analyticsContext = useAnalyticsContext();
	const lineDetailsHeaderStyles = styles();
	const { t } = useTranslation('lines.LineDetail.lineDetailsHeader');

	//
	// B. Handle actions

	const handleToggleFavorite = async () => {
		if (!lineDetailContext.data.line) return;
		try {
			analyticsContext.actions.capture('Favorite Line Added', { line_id: lineDetailContext.data.line?.id || '', platform: Platform.OS });
			await profileContext.actions.toggleFavoriteItem('lines', lineDetailContext.data.line.id);
		}
		catch (error) {
			alert(error);
		}
	};

	//
	// C. Render components

	if (!lineDetailContext.data.line) {
		return null;
	}

	return (
		<>
			<Surface>
				<View style={lineDetailsHeaderStyles.headingSection}>
					<Section
						accessibilityHint={t('lineDetailsHeaderAccessibilityHint')}
						accessibilityLabel={t('lineDetailsHeaderAccessibilityLabel')}
						accessibilityLanguage={localeContext.data.locale}
						accessibilityRole="header"
						withBottomDivider
					>
						<View style={lineDetailsHeaderStyles.headingSectionRow}>
							<View style={lineDetailsHeaderStyles.headingFirstSection}>
								<LineBadge lineData={lineDetailContext.data.line} size="lg" />
								<FavoriteToggle color={lineDetailContext.data.line.color} isActive={lineDetailContext.flags.is_favorite} onToggle={handleToggleFavorite} type="lines" />
								<LineDisplayTts patternId={lineDetailContext.data.active_pattern?.id} />
							</View>
							<Text
								accessibilityHint={t('lineDetailsFavToggleAccessibilityHint', { destination: lineDetailContext.data.line.long_name, line: lineDetailContext.data.lineId })}
								accessibilityLabel={t('lineDetailsFavToggleAccessibilityLabel', { destination: lineDetailContext.data.line.long_name, line: lineDetailContext.data.lineId })}
								accessibilityLanguage={localeContext.data.locale}
								accessibilityRole="text"
								style={lineDetailsHeaderStyles.lineName}
							>{lineDetailContext.data.line.long_name}
							</Text>
						</View>
					</Section>
				</View>
				<View style={lineDetailsHeaderStyles.toolbarSection}>
					<View style={lineDetailsHeaderStyles.operationalDaySection}>
						<SelectOperationalDate />
					</View>
					<SelectActivePatternGroup />
				</View>
			</Surface>
			{debugContext.flags.is_debug_mode && (
				<Surface variant="debug">
					<Section withPadding>
						<LineDebugDetail
							activePattern={lineDetailContext.data.active_pattern}
							lineColor={lineDetailContext.data.line.color}
							totalStops={lineDetailContext.data.active_pattern?.path.length}
						/>
					</Section>
				</Surface>
			)}
		</>
	);

	//
}
