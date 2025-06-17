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
import { Text } from '@rn-vui/themed';
import { IconHomePlus } from '@tabler/icons-react-native';
import { View } from 'react-native';

import { LineDisplayTts } from '../LineDisplayTts';
import { styles } from './styles';

/* * */

export function LinesDetailHeader() {
	//

	//
	// A. Setup variables

	const profileContext = useProfileContext();
	const linesDetailContext = useLinesDetailContext();
	const debugContext = useDebugContext();
	const lineDetailsHeaderStyles = styles();
	const activePattern = linesDetailContext.data.active_pattern;
	const isInWidgets = profileContext.data.widget_lines?.some(
		w => w.data && w.data.type === 'lines' && w.data.pattern_id === activePattern?.id,
	);

	//
	// B. Handle actions

	const handleToggleFavorite = async () => {
		if (!linesDetailContext.data.line) return;
		try {
			await profileContext.actions.toggleFavoriteLine(linesDetailContext.data.line.id);
		}
		catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
			else {
				alert(String(error));
			}
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
							<View style={lineDetailsHeaderStyles.headingFirstSection}>
								<LineBadge lineData={linesDetailContext.data.line} size="lg" />
								<FavoriteToggle color={linesDetailContext.data.line.color} isActive={linesDetailContext.flags.is_favorite} onToggle={handleToggleFavorite} />
								<IconHomePlus
									color={isInWidgets ? linesDetailContext.data.line.color : '#9696A0'}
									disabled={!activePattern}
									size={24}
									onPress={() => {
										if (activePattern) {
											profileContext.actions.toggleWidgetLine([activePattern.id]);
										}
									}}
								/>
								<LineDisplayTts patternId={linesDetailContext.data.active_pattern?.id} />
							</View>
							<Text style={lineDetailsHeaderStyles.lineName}>{linesDetailContext.data.line.long_name}</Text>
						</View>
					</Section>
				</View>
				<View style={lineDetailsHeaderStyles.toolbarSection}>
					<View style={lineDetailsHeaderStyles.operationalDaySection}>
						<SelectOperationalDay />
					</View>
					<View style={lineDetailsHeaderStyles.patternGroupSection}>
						<SelectActivePatternGroup />
					</View>
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
