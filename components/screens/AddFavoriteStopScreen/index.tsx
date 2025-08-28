/* * */

import StopsListChooserModal from '@/app/(modal)/StopsListChooserModal';
import { HeaderExplainer } from '@/components/common/HeaderExplainer';
import { Section } from '@/components/common/layout/Section';
import TabBarOnly from '@/components/common/layout/TabOnly';
import { LineBadge } from '@/components/lines/LineBadge';
import { WidgetActionsButtonGroup } from '@/components/widgets/WidgetsActionsButtonGroup';
import { useLinesContext } from '@/contexts/Lines.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { useWidgetContext } from '@/contexts/Widget.context';
import { theming } from '@/theme/Variables';
import { AccountWidget } from '@/types/account.types';
import { Routes } from '@/utils/routes';
import { Pattern, Stop } from '@carrismetropolitana/api-types/network';
import { ListItem, Text } from '@rn-vui/themed';
import { IconArrowRight, IconBusStop, IconCircle, IconCircleCheckFilled, IconSearch, IconX } from '@tabler/icons-react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import styles from './styles';

/* * */

export default function AddFavoriteStopScreen() {
	//

	//
	// A. Setup Variables

	const screenHeight = Dimensions.get('window').height;
	const [stopChooserVisibility, setStopChooserVisibility] = useState(false);
	const [selectedStopPatterns, setSelectedStopPatterns] = useState<string[]>([]);
	const [selectedStop, setSelectedStop] = useState<Stop | undefined>(undefined);
	const [selectedStopId, setSelectedStopId] = useState<string>('');
	const [patternNames, setPatternNames] = useState<Record<string, string>>({});
	const [dataToSubmit, setDataToSubmit] = useState<AccountWidget | undefined>(undefined);
	const { widgetId } = useLocalSearchParams<{ widgetId?: string }>();

	const themeContext = useThemeContext();
	const profileContext = useProfileContext();
	const widgetContext = useWidgetContext();
	const linesContext = useLinesContext();
	const stopsContext = useStopsContext();

	const addFavoriteStopStyles = styles();
	const navigation = useNavigation();
	const { t } = useTranslation('translation', { keyPrefix: 'addfavoritestop' });

	//
	// B. Handle Actions

	const handleSelectedStop = (stopData: Stop) => {
		setSelectedStopPatterns([]);
		setSelectedStopId('');
		setSelectedStop(undefined);
		setSelectedStopId(stopData.id);
		setSelectedStop(stopData);
		const favoriteStopWidget = widgetContext.data.widget_stops?.find(widget => widget.data && widget.data.type === 'stops' && widget.data.stop_id === stopData.id);
		const favoritedPatterns = favoriteStopWidget?.data.type === 'stops' ? favoriteStopWidget.data.pattern_ids : [];
		setSelectedStopPatterns(favoritedPatterns);
	};

	useEffect(() => {
		if (widgetId) {
			const stopsWidgets = profileContext.data.profile?.widgets?.filter(w => w.data.type === 'stops') || [];
			const widget = stopsWidgets.find(w => w.settings?.display_order === Number(widgetId));
			if (widget && widget.data.type === 'stops') {
				const stopData = stopsContext.actions.getStopById(widget.data.stop_id);
				setSelectedStop(stopData);
				setSelectedStopPatterns(widget.data.pattern_ids);
			}
		}
	}, [widgetId, widgetContext.data.widget_stops]);

	const clearSelection = () => {
		setSelectedStop(undefined);
		setSelectedStopPatterns([]);
		setSelectedStopId('');
		setPatternNames({});
	};

	const exitScreen = () => {
		setSelectedStop(undefined);
		setSelectedStopPatterns([]);
		setSelectedStopId('');
		setPatternNames({});
		navigation.goBack();
	};

	//
	// C. Fetch Data

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
		if (!selectedStop || !selectedStop.pattern_ids) return;
		const fetchPatterns = async () => {
			const patternName: Record<string, string> = {};
			await Promise.all(
				selectedStop.pattern_ids.map(async (pattern) => {
					const data = await fetchPattern(pattern);
					if (data) {
						patternName[pattern] = data[0].headsign;
					}
				}),
			);
			setPatternNames(patternName);
		};
		fetchPatterns();
	}, [selectedStop]);

	useEffect(() => {
		setDataToSubmit({ data: { pattern_ids: selectedStopPatterns, stop_id: selectedStopId, type: 'stops' }, settings: { is_open: true } });
	}, [selectedStopId, selectedStopPatterns]);
	//
	// D. Render Components

	function togglePattern(patternId: string, selectedPatterns: string[], setSelectedPatterns: (patterns: string[]) => void) {
		if (selectedPatterns.includes(patternId)) {
			setSelectedPatterns(selectedPatterns.filter(id => id !== patternId));
		}
		else {
			setSelectedPatterns([...selectedPatterns, patternId]);
		}
	}

	return (
		<View style={{ height: screenHeight - 100 }}>
			<ScrollView style={addFavoriteStopStyles.container}>
				<HeaderExplainer heading={t('headerTitle')} subheading={t('subheading')} />

				<View style={addFavoriteStopStyles.sectionContainer}>
					<Section
						heading={t('firstSectionTitle')}
						subheading={t('firstSectionSubtitle')}
					/>
				</View>
				<View>
					{selectedStop && (
						<ListItem>
							<IconBusStop color="#FF6900" size={24} />
							<ListItem.Content>
								<ListItem.Title style={addFavoriteStopStyles.listTitle}>
									<Text>{selectedStop.long_name}</Text>
								</ListItem.Title>
							</ListItem.Content>
							<IconX color="#9696A0" onPress={clearSelection} size={24} />
						</ListItem>
					)}
					<ListItem onPress={() => setStopChooserVisibility(true)}>
						<IconSearch color="#9696A0" size={24} />
						<ListItem.Content>
							<ListItem.Title style={addFavoriteStopStyles.listTitle}>
								<Text>{t('changeStopLabel')}</Text>
							</ListItem.Title>
						</ListItem.Content>
						<ListItem.Chevron iconStyle={{ fontSize: 24 }} />
					</ListItem>
				</View>

				<View style={{ marginBottom: 10, marginTop: 10 }}>
					<View style={addFavoriteStopStyles.sectionContainer}>
						<Section
							heading={t('secondSectionTitle')}
							subheading={t('secondSectionSubtitle')}
						/>
					</View>
					<View>
						{selectedStop && Object.entries(
							selectedStop.pattern_ids.reduce((acc: Record<string, string[]>, patternId: string) => {
								const lineId = patternId.split('_')[0];
								if (!acc[lineId]) acc[lineId] = [];
								acc[lineId].push(patternId);
								return acc;
							}, {}),
						).map(([lineId, patternIds]) => {
							const line = linesContext.data.lines.find(line => line.id === lineId);
							const lineColor = line?.color;
							return (
								<View key={lineId} style={{ marginBottom: 16 }}>
									<Text style={[addFavoriteStopStyles.listTitle, addFavoriteStopStyles.lineIdentifier]}>Linha {lineId}{line?.long_name ? ` - ${line.long_name}` : ''}</Text>
									{patternIds.map((patternId) => {
										const isSelected = selectedStopPatterns.includes(patternId);
										return (
											<ListItem key={patternId} onPress={() => togglePattern(patternId, selectedStopPatterns, setSelectedStopPatterns)}>
												<LineBadge color={lineColor} lineId={lineId} size="lg" withAlertIcon />
												<IconArrowRight size={10} />
												<ListItem.Content>
													<ListItem.Title style={addFavoriteStopStyles.listTitle}> {patternNames[patternId] || 'Sem destino'}</ListItem.Title>
												</ListItem.Content>
												{isSelected && (
													<IconCircleCheckFilled
														fill="#3CB43C"
														size={24}
														color={
															themeContext.theme.mode === 'light'
																? theming.colorSystemBackgroundLight100
																: theming.colorSystemBackgroundDark100
														}
													/>
												)}
												{!isSelected && (<IconCircle color="grey" size={24} />)}
											</ListItem>
										);
									})}
								</View>
							);
						})}
						{!selectedStop && selectedStopPatterns.length === 0 && (
							<ListItem>
								<ListItem.Content>
									<ListItem.Title style={addFavoriteStopStyles.listTitle}> <Text>{t('selectStopLabel')}</Text> </ListItem.Title>
								</ListItem.Content>
							</ListItem>
						)}
					</View>
				</View>
				<WidgetActionsButtonGroup dataToSubmit={dataToSubmit} isUpdate={widgetId} length={selectedStopPatterns.length} onClear={exitScreen} type="stops" />
				<StopsListChooserModal isVisible={stopChooserVisibility} onBackdropPress={() => setStopChooserVisibility(!stopChooserVisibility)} selectedStopData={stopData => handleSelectedStop(stopData)} />
			</ScrollView>
			<TabBarOnly />
		</View>
	);

	//
}
