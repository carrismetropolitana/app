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
import { useLocaleContext } from '@/contexts/Locale.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { useWidgetContext } from '@/contexts/Widget.context';
import { Text } from '@rn-vui/themed';
import { IconHomePlus } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { LineDisplayTts } from '../LineDisplayTts';
import { styles } from './styles';

/* * */

export function LinesDetailHeader() {
	//

	//
	// A. Setup variables

	const profileContext = useProfileContext();
	const widgetContext = useWidgetContext();
	const linesDetailContext = useLinesDetailContext();
	const localeContext = useLocaleContext();
	const debugContext = useDebugContext();
	const lineDetailsHeaderStyles = styles();
	const { t } = useTranslation('lines.LinesDetail.lineDetailsHeader');
	const activePattern = linesDetailContext.data.active_pattern;
	const isInWidgets = widgetContext.data.widget_lines?.some(
		w => w.data && w.data.type === 'lines' && w.data.pattern_id === activePattern?.id,
	);

	//
	// B. Handle actions

	const handleToggleFavorite = async () => {
		if (!linesDetailContext.data.line) return;
		try {
			await profileContext.actions.toggleFavoriteItem('lines', linesDetailContext.data.line.id);
		}
		catch (error) {
			alert(error);
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
					<Section
						accessibilityHint={t('lineDetailsHeaderAccessibilityHint')}
						accessibilityLabel={t('lineDetailsHeaderAccessibilityLabel')}
						accessibilityLanguage={localeContext.locale}
						accessibilityRole="header"
						withBottomDivider
					>
						<View style={lineDetailsHeaderStyles.headingSectionRow}>
							<View style={lineDetailsHeaderStyles.headingFirstSection}>
								<LineBadge lineData={linesDetailContext.data.line} size="lg" />
								<FavoriteToggle color={linesDetailContext.data.line.color} isActive={linesDetailContext.flags.is_favorite} onToggle={handleToggleFavorite} type="lines" />
								<IconHomePlus
									accessibilityHint={t('lineDetailsFavToggleAccessibilityHint', { line: linesDetailContext.data.line.long_name })}
									accessibilityLabel={t('lineDetailsFavToggleAccessibilityLabel', { line: linesDetailContext.data.line.long_name })}
									accessibilityLanguage={localeContext.locale}
									accessibilityRole="header"
									accessibilityState={{ selected: isInWidgets }}
									color={isInWidgets ? linesDetailContext.data.line.color : '#9696A0'}
									onPress={() => router.push(`/addFavoriteLine/?lineId=${linesDetailContext.data.line?.id}`)}
									size={24}
								/>
								<LineDisplayTts patternId={linesDetailContext.data.active_pattern?.id} />
							</View>
							<Text
								accessibilityHint={t('lineDetailsFavToggleAccessibilityHint', { destination: linesDetailContext.data.line.long_name, line: linesDetailContext.data.lineId })}
								accessibilityLabel={t('lineDetailsFavToggleAccessibilityLabel', { destination: linesDetailContext.data.line.long_name, line: linesDetailContext.data.lineId })}
								accessibilityLanguage={localeContext.locale}
								accessibilityRole="text"
								style={lineDetailsHeaderStyles.lineName}
							>{linesDetailContext.data.line.long_name}
							</Text>
						</View>
					</Section>
				</View>
				<View style={lineDetailsHeaderStyles.toolbarSection}>
					<View style={lineDetailsHeaderStyles.operationalDaySection}>
						<SelectOperationalDay />
					</View>
					<SelectActivePatternGroup />
				</View>
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
