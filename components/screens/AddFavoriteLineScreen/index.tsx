/* * */

import LinesListChooserModal from '@/app/(modal)/LinesListChooserModal';
import { HeaderExplainer } from '@/components/common/HeaderExplainer';
import { Section } from '@/components/common/layout/Section';
import { LineBadge } from '@/components/lines/LineBadge';
import { OpenAddSmartNotification } from '@/components/widgets/OpenAddSmartNotification';
import { WidgetActionsButtonGroup } from '@/components/widgets/WidgetsActionsButtonGroup';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Routes } from '@/utils/routes';
import { Pattern } from '@carrismetropolitana/api-types/network';
import { ListItem, Text } from '@rn-vui/themed';
import { IconArrowLoopRight, IconArrowRight, IconCircle, IconCircleCheckFilled, IconSearch, IconX } from '@tabler/icons-react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import styles from './styles';

/* * */

interface Props {
	lineId?: string
}
/* * */

export default function AddFavoriteLineScreen({ lineId }: Props) {
	//

	//
	// A. Setup Variables

	const [lineChooserVisibility, setLineChooserVisibility] = useState(false);
	const [patternNames, setPatternNames] = useState<Record<string, string>>({});
	const [selectedPatterns, setSelectedPatterns] = useState<string[]>([]);
	// const [isToggled, setIsToggled] = useState(false);

	const { widgetId } = useLocalSearchParams<{ widgetId?: string }>();

	const linesDetailContext = useLinesDetailContext();
	const themeContext = useThemeContext();
	const profileContext = useProfileContext();
	const addFavoriteLineStyles = styles();
	const navigation = useNavigation();

	const { t } = useTranslation('translation', { keyPrefix: 'addfavoriteline' });

	//
	// B. Fetch Data

	useEffect(() => {
		if (lineId) {
			linesDetailContext.actions.setLineId(lineId);
		}
	}, [lineId]);

	const fetchPattern = async (patternId: string) => {
		try {
			const response = await fetch(`${Routes.API}/patterns/${patternId}`);
			const data: Pattern = await response.json();
			return data;
		}
		catch (error) {
			console.error(`Error fetching pattern ${patternId}:`, error);
			return null;
		}
	};

	useEffect(() => {
		if (!linesDetailContext.data.line?.pattern_ids) return;
		const fetchPatterns = async () => {
			const patternName: Record<string, string> = {};
			const patterns = linesDetailContext.data.line?.pattern_ids;

			if (patterns) {
				await Promise.all(
					patterns.map(async (pattern) => {
						const data = await fetchPattern(pattern);
						if (data) {
							patternName[pattern] = data[0].headsign;
						}
					}),
				);
				setPatternNames(patternName);
			}
			else {
				return;
			}
		};
		fetchPatterns();
	}, [linesDetailContext.data.line?.pattern_ids]);

	//
	// C. Handle actions

	const clearScreen = () => {
		setSelectedPatterns([]);
		linesDetailContext.actions.resetLineId();
		navigation.goBack();
	};

	function togglePattern(patternId: string) {
		setSelectedPatterns(prev =>
			prev.includes(patternId)
				? prev.filter(id => id !== patternId)
				: [...prev, patternId],
		);
	}

	useEffect(() => {
		if (widgetId && profileContext.data.widget_lines) {
			const widget = profileContext.data.widget_lines.find(
				w => w.data && w.data.type === 'lines' && String(w.settings?.display_order) === String(widgetId),
			);
			console.log('widget', widget);
			if (widget && widget.data.type === 'lines') {
				console.log('setting id', widget.data.pattern_id.split('_')[0].toString());
				linesDetailContext.actions.setLineId(widget?.data.pattern_id.split('_')[0].toString() || '');
			}

			if (widget && widget.data.type === 'lines') {
				console.log('setting patterns', widget.data.pattern_id);
				setSelectedPatterns([widget.data.pattern_id]);
			}
		}
	}, [widgetId, profileContext.data.widget_lines]);

	// const handleToggle = () => setIsToggled(true);
	// const handleUntoggle = () => setIsToggled(false);

	//
	// D. Render Components

	return (

		<ScrollView showsVerticalScrollIndicator={false} style={addFavoriteLineStyles.container}>
			<HeaderExplainer
				heading={t('title')}
				subheading={t('subheading')}
			/>
			<View style={addFavoriteLineStyles.sectionContainer}>
				<Section
					heading={t('firstSectionTitle')}
					subheading={t('firstSectionSubtitle')}
				/>
			</View>
			<View>
				{linesDetailContext.data.line && (
					<ListItem>
						<IconArrowLoopRight color="#C61D23" size={24} />
						<ListItem.Content>
							<ListItem.Title style={addFavoriteLineStyles.listTitle}>
								<Text>{linesDetailContext.data.line.long_name}</Text>
							</ListItem.Title>
						</ListItem.Content>
						<IconX color="#9696A0" onPress={linesDetailContext.actions.resetLineId} size={24} />
					</ListItem>
				)}
				<ListItem onPress={() => setLineChooserVisibility(true)}>
					<IconSearch color="#9696A0" size={24} />
					<ListItem.Content>
						<ListItem.Title style={addFavoriteLineStyles.listTitle}>
							<Text>{t('changeLineLabel')}</Text>
						</ListItem.Title>
					</ListItem.Content>
					<ListItem.Chevron iconStyle={{ fontSize: 24 }} />
				</ListItem>
			</View>

			<View style={{ marginBottom: 20, marginTop: 20 }}>
				<View style={addFavoriteLineStyles.sectionContainer}>
					<Section
						heading={t('secondSectionTitle')}
						subheading={t('secondSectionSubtitle')}
					/>
				</View>
				<View>
					{linesDetailContext.data.line?.pattern_ids ? (
						<View>
							<Text style={addFavoriteLineStyles.lineIdentifier}>Linha {linesDetailContext.data.line.id} - {linesDetailContext.data.line.long_name}</Text>
							{linesDetailContext.data.line.pattern_ids.map((item) => {
								const isSelected = selectedPatterns.includes(item);
								return (
									<ListItem
										key={item}
										onPress={() => togglePattern(item)}
									>
										<LineBadge
											color={linesDetailContext.data.line?.color}
											lineId={linesDetailContext.data.lineId}
											size="lg"
										/>
										<IconArrowRight size={10} />
										<ListItem.Content>
											<ListItem.Title style={addFavoriteLineStyles.listTitle}>
												<Text>{patternNames[item] || 'Sem destino'}</Text>
											</ListItem.Title>
										</ListItem.Content>
										{isSelected ? (
											<IconCircleCheckFilled
												fill="#3CB43C"
												size={24}
												color={
													themeContext.theme.mode === 'light'
														? theming.colorSystemBackgroundLight100
														: theming.colorSystemBackgroundDark100
												}
											/>
										) : (
											<IconCircle color="grey" size={24} />
										)}
									</ListItem>
								);
							})}
						</View>
					) : (
						<ListItem>
							<ListItem.Content>
								<ListItem.Title style={addFavoriteLineStyles.listTitle}>
									<Text>{t('selectLineLabel')}</Text>
								</ListItem.Title>
							</ListItem.Content>
						</ListItem>
					)}
				</View>

			</View>
			<OpenAddSmartNotification
				disabled={selectedPatterns.length === 0}
				heading={t('thirdSectionTitle')}
				patternId={selectedPatterns[0]}
				subheading={t('thirdSectionSubtitle')}
				// toggle={handleToggle}
				// toggled={isToggled}
				// untoggle={handleUntoggle}
				// isToggle
			/>
			<WidgetActionsButtonGroup
				dataToSubmit={{ data: { pattern_id: selectedPatterns[0], type: 'lines' }, settings: { is_open: true } }}
				length={selectedPatterns.length}
				onClear={clearScreen}
				type="lines"
			/>
			<LinesListChooserModal
				isVisible={lineChooserVisibility}
				onBackdropPress={() => setLineChooserVisibility(!lineChooserVisibility)}
			/>
		</ScrollView>

	);

	//
}
