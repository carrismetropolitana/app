/* * */

import LinesListChooserModal from '@/app/(modal)/LinesListChooserModal';
import { Section } from '@/components/common/layout/Section';
import { SelectNotificationControl } from '@/components/common/SelectNotifcationControl';
import { TestingNeedWarning } from '@/components/common/TestingNeedWarning';
import { VerticalContentSeparator } from '@/components/common/VerticalContentSeparator';
import { VideoExplainer } from '@/components/common/VideoExplainer';
import { LineBadge } from '@/components/lines/LineBadge';
import { AddSmartNotificationDaysSelector } from '@/components/screens/AddSmartNotification/AddSmartNotificationDaysSelector';
import { AddSmartNotificationsIntervalInputs } from '@/components/screens/AddSmartNotification/AddSmartNotificationIntervalInputs';
import { AddSmartNotificationsStopSelector } from '@/components/screens/AddSmartNotification/AddSmartNotificationStopSelector';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { getSecondsSinceMidnight } from '@/utils/getSeconsSinceMidnight';
import { Routes } from '@/utils/routes';
import { Pattern } from '@carrismetropolitana/api-types/network';
import { Button, Input, ListItem, Text } from '@rn-vui/themed';
import { IconArrowLoopRight, IconArrowRight, IconCircle, IconCircleCheckFilled, IconSearch, IconX } from '@tabler/icons-react-native';
import { useNavigation } from 'expo-router';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import styles from './styles';

/* * */

interface AddSmartNotificationScreenProps {
	Id?: string
}

export default function AddSmartNotificationScreen({ Id }: AddSmartNotificationScreenProps) {
	//
	//

	// A. Setup Variables
	const weekDays: ('friday' | 'monday' | 'saturday' | 'sunday' | 'thursday' | 'tuesday' | 'wednesday')[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

	const { t } = useTranslation('translation', { keyPrefix: 'smartNotifications' });

	const [lineChooserVisibility, setLineChooserVisibility] = useState(false);
	const [patternNames, setPatternNames] = useState<Record<string, string>>({});
	const [patternVersionIds, setPatternVersionIds] = useState<Record<string, string>>({});
	const [selectedStopId, setSelectedStopId] = useState<null | string>(null);
	const [selectedPatternId, setSelectedPatternId] = useState<null | string>(null);
	const [selectedVersionId, setSelectedVersionId] = useState<null | string>(null);
	const [selectedDays, setSelectedDays] = useState(weekDays);
	const [radius, setRadius] = useState<0 | number>(0);
	const [startingHour, setStartingHour] = useState<Date | null>(null);
	const [endingHour, setEndingHour] = useState<Date | null>(null);
	const [startingSeconds, setStartingSeconds] = useState<0 | number>(0);
	const [endingSeconds, setEndingSeconds] = useState<0 | number>(0);
	const [selectedIndex, setSelectedIndex] = useState<number[]>([]);

	const linesDetailContext = useLinesDetailContext();
	const profileContext = useProfileContext();
	const addFavoriteLineStyles = styles();
	const navigation = useNavigation();

	//
	// B. Fetch Data
	useEffect(() => {
		if (!Id) return;
		const widget = profileContext.data.profile?.widgets?.find(w => w.data && w.data.type === 'smart_notifications' && 'id' in w.data && w.data.id === Id);
		if (widget && widget.data && widget.data.type === 'smart_notifications') {
			const data = widget.data;
			if (data.week_days) {
				setSelectedIndex(data.week_days.map(day => weekDays.indexOf(day)));
			}
			if (data.start_time !== undefined) {
				setStartingHour(DateTime.fromSeconds(data.start_time).toJSDate());
			}
			if (data.end_time !== undefined) {
				setEndingHour(DateTime.fromSeconds(data.end_time).toJSDate());
			}
			if (data.pattern_id) setSelectedPatternId(data.pattern_id);
			if (data.stop_id) setSelectedStopId(data.stop_id);
			if (data.distance !== undefined) setRadius(data.distance);
		}
	}, [Id]);

	const fetchPattern = async (patternId: string) => {
		try {
			const response = await fetch(`${Routes.API}/patterns/${patternId}`);
			const data: Pattern | Pattern[] = await response.json();
			if (Array.isArray(data)) {
				return data[0];
			}
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
			const patternVersionId: Record<string, string> = {};
			let patternId = '';
			const patterns = linesDetailContext.data.line?.pattern_ids;

			if (patterns) {
				await Promise.all(
					patterns.map(async (pattern) => {
						const data = await fetchPattern(pattern);
						if (data) {
							patternName[pattern] = data.headsign;
							patternVersionId[pattern] = data.version_id;
							patternId = data.id;
						}
					}),
				);
				setPatternNames(patternName);
				setPatternVersionIds(patternVersionId);
				setSelectedPatternId(patternId);
			}
			else {
				return;
			}
		};
		fetchPatterns();
	}, [linesDetailContext.data.line?.pattern_ids]);

	//
	// C Handle Actions
	useEffect(() => {
		if (!selectedIndex) return;
		setSelectedDays(selectedIndex.map(index => weekDays[index]));
	}, [selectedIndex]);
	useEffect(() => {
		if (selectedVersionId) {
			linesDetailContext.actions.setActivePattern(selectedVersionId);
		}
		else {
			linesDetailContext.actions.resetActivePattern();
		}
	}, [selectedVersionId, linesDetailContext.data.line?.id]);
	useEffect(() => {
		setStartingSeconds(getSecondsSinceMidnight(startingHour || new Date()));
		setEndingSeconds(getSecondsSinceMidnight(endingHour || new Date()));
	}, [startingHour, endingHour]);

	const clearScreen = useCallback(() => {
		linesDetailContext.actions.resetLineId();
		linesDetailContext.actions.resetActivePattern();
		setSelectedPatternId(null);
		setSelectedStopId(null);
		setRadius(0);
		setStartingHour(new Date());
		setEndingHour(new Date());
		setSelectedVersionId(null);
		setSelectedIndex([]);
	}, [linesDetailContext.actions]);

	const exitScreen = useCallback(() => {
		clearScreen();
		navigation.goBack();
	}, [navigation, clearScreen]);

	const handlePatternSelect = useCallback((item: string) => {
		const versionId = patternVersionIds[item];
		if (selectedVersionId === versionId) {
			setSelectedVersionId(null);
			linesDetailContext.actions.resetActivePattern();
		}
		else {
			setSelectedVersionId(versionId);
			setTimeout(() => {
				linesDetailContext.actions.setActivePattern(versionId);
			}, 0);
		}

		console.log(`Selected pattern: ${item}, Version ID: ${versionId}`);
		console.log(`Current active pattern: ${linesDetailContext.data.active_pattern?.id}`);
	}, [patternVersionIds, selectedVersionId]);

	const toggleWidgetSmartNotification = () => {
		profileContext.actions.toggleWidget({
			end_time: endingSeconds,
			pattern_id: selectedPatternId ?? '',
			radius,
			start_time: startingSeconds,
			stop_id: selectedStopId ?? '',
			type: 'smart_notifications',
			week_days: selectedDays,
		});
		exitScreen();
	};

	console.log(`Current selected stop ID: ${selectedStopId}`);

	//
	// D. Render Components
	return (
		<ScrollView showsVerticalScrollIndicator={false} style={addFavoriteLineStyles.overlay}>
			<View style={addFavoriteLineStyles.container}>
				<View style={addFavoriteLineStyles.header}>
					<Section
						heading={t('heading')}
						subheading={t('subheading')}
					/>
				</View>
				<VideoExplainer />
				<VerticalContentSeparator starting />
				<Text style={addFavoriteLineStyles.text}> {t('chooseLineTitle')}</Text>
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
								<Text>Alterar Linha Selecionada</Text>
							</ListItem.Title>
						</ListItem.Content>
						<ListItem.Chevron />
					</ListItem>
				</View>
				<View>
					{linesDetailContext.data.line?.pattern_ids ? (
						<View>
							<Text style={[addFavoriteLineStyles.lineDescriptionTitle, addFavoriteLineStyles.listTitle]}>
								Linha {linesDetailContext.data.line.id} - {linesDetailContext.data.line.long_name}
							</Text>
							{linesDetailContext.data.line.pattern_ids.map((item) => {
								const versionId = patternVersionIds[item];
								const isSelected = selectedVersionId === versionId;
								return (
									<ListItem key={item} onPress={() => handlePatternSelect(item)} style={{ backgroundColor: isSelected ? '#e6f7ff' : undefined }}>
										<LineBadge color={linesDetailContext.data.line?.color} lineId={linesDetailContext.data.lineId} size="lg" />
										<IconArrowRight size={10} />
										<ListItem.Content>
											<ListItem.Title style={addFavoriteLineStyles.listTitle}>
												<Text>{patternNames[item] || 'Sem destino'}</Text>
											</ListItem.Title>
										</ListItem.Content>
										{isSelected && <IconCircleCheckFilled color="#FFFFFF" fill="#3CB43C" size={24} />}
										{!isSelected && <IconCircle color="#9696A0" size={24} />}
									</ListItem>
								);
							})}
						</View>
					) : null}
				</View>
				<VerticalContentSeparator middle />
				<Text style={addFavoriteLineStyles.text}>{t('radiusAt')}</Text>
				<View style={addFavoriteLineStyles.selectNotificationContol}>
					<Input containerStyle={addFavoriteLineStyles.input} onChangeText={text => setRadius(Number(text))} placeholder="Valor" value={radius.toString()} />
					<SelectNotificationControl />
				</View>
				<VerticalContentSeparator middle />
				<AddSmartNotificationsStopSelector selectedStopId={selectedStopId || undefined} selectedVersionId={selectedVersionId || undefined} setSelectedStopId={setSelectedStopId} />
				<VerticalContentSeparator ending />
				<Text style={addFavoriteLineStyles.text}>{t('periodSelectorTitle')}</Text>
				<View style={addFavoriteLineStyles.lastSectionWrapper}>
					<AddSmartNotificationsIntervalInputs endingHour={endingHour || DateTime.now().toJSDate()} setEndingHour={setEndingHour} setStartingHour={setStartingHour} startingHour={startingHour || DateTime.now().toJSDate()} />
					<AddSmartNotificationDaysSelector selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
				</View>
			</View>
			<TestingNeedWarning />
			<Button buttonStyle={addFavoriteLineStyles.saveButton} onPress={() => toggleWidgetSmartNotification()} title="Guardar" titleStyle={addFavoriteLineStyles.saveButtonText} />
			<Button buttonStyle={addFavoriteLineStyles.saveButton} onPress={exitScreen} title="Eliminar" titleStyle={addFavoriteLineStyles.saveButtonText} />
			<LinesListChooserModal isVisible={lineChooserVisibility} onBackdropPress={() => setLineChooserVisibility(!lineChooserVisibility)} />
		</ScrollView>
	);

	//
}
