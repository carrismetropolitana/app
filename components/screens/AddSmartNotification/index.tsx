/* * */

import LinesListChooserModal from '@/app/(modal)/LinesListChooserModal';
import { Section } from '@/components/common/layout/Section';
import { SelectNotificationControl } from '@/components/common/SelectNotifcationControl';
import { LineBadge } from '@/components/lines/LineBadge';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useLocaleContext } from '@/contexts/Locale.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { theming } from '@/theme/Variables';
import { Routes } from '@/utils/routes';
import { Pattern, Waypoint } from '@carrismetropolitana/api-types/network';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Button, ButtonGroup, Input, ListItem, Text } from '@rn-vui/themed';
import { IconArrowLoopRight, IconArrowRight, IconCircle, IconCircleCheckFilled, IconPlayerPlayFilled, IconSearch, IconX } from '@tabler/icons-react-native';
import { useNavigation } from 'expo-router';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Svg, { Circle, Rect } from 'react-native-svg';

import styles from './styles';

/* * */

interface AddSmartNotificationScreenProps {
	Id?: string
}

export default function AddSmartNotificationScreen({ Id }: AddSmartNotificationScreenProps) {
	//
	//

	// A. Setup Variables
	const { t } = useTranslation('translation', { keyPrefix: 'smartNotifications' });
	const [lineChooserVisibility, setLineChooserVisibility] = useState(false);
	const [patternNames, setPatternNames] = useState<Record<string, string>>({});
	const [patternVersionIds, setPatternVersionIds] = useState<Record<string, string>>({});
	const [selectedStopId, setSelectedStopId] = useState<null | string>(null);
	const [selectedPatternId, setSelectedPatternId] = useState<null | string>(null);
	const [selectedVersionId, setSelectedVersionId] = useState<null | string>(null);
	const [selectedDays, setSelectedDays] = useState<('friday' | 'monday' | 'saturday' | 'sunday' | 'thursday' | 'tuesday' | 'wednesday')[]>(['friday', 'monday', 'saturday', 'sunday', 'thursday', 'tuesday', 'wednesday']);
	const [radius, setRadius] = useState<0 | number>(0);
	const [startingHour, setStartingHour] = useState<Date | null>(null);
	const [endingHour, setEndingHour] = useState<Date | null>(null);
	const [startingSeconds, setStartingSeconds] = useState<0 | number>(0);
	const [endingSeconds, setEndingSeconds] = useState<0 | number>(0);
	const [selectedIndex, setSelectedIndex] = useState<number[]>([]);
	const weekDays: ('friday' | 'monday' | 'saturday' | 'sunday' | 'thursday' | 'tuesday' | 'wednesday')[] = [
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday',
		'sunday',
	];

	const linesDetailContext = useLinesDetailContext();
	const stopsContext = useStopsContext();
	const profileContext = useProfileContext();
	const locale = useLocaleContext();

	const addFavoriteLineStyles = styles();
	const navigation = useNavigation();

	//
	// B. Fetch Data

	useEffect(() => {
		if (!Id) return;
		const widget = profileContext.data.profile?.widgets?.find(w => w.data && w.data.type === 'smart_notifications' && 'id' in w.data && w.data.id === Id);
		if (widget && widget.data && widget.data.type === 'smart_notifications') {
			console.log('week_days', widget.data.week_days);
			const data = widget.data;
			if (data.pattern_id) setSelectedPatternId(data.pattern_id);
			if (data.stop_id) setSelectedStopId(data.stop_id);
			if (data.distance !== undefined) setRadius(data.distance);
			if (data.week_days) {
				setSelectedIndex(data.week_days.map(day => weekDays.indexOf(day)));
			}
			if (data.start_time !== undefined) {
				setStartingHour(DateTime.fromSeconds(data.start_time).toJSDate());
			}
			if (data.end_time !== undefined) {
				setEndingHour(DateTime.fromSeconds(data.end_time).toJSDate());
			}
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
	function getSecondsSinceMidnight(date: Date) {
		return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
	}
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
	const exitScreen = () => {
		clearScreen();
		navigation.goBack();
	};
	const clearScreen = () => {
		linesDetailContext.actions.resetLineId();
		linesDetailContext.actions.resetActivePattern();
		setSelectedPatternId(null);
		setSelectedStopId(null);
		setSelectedDays([]);
		setRadius(0);
		setStartingHour(new Date());
		setEndingHour(new Date());
		setSelectedVersionId(null);
	};
	const handlePatternSelect = (item: string) => {
		const versionId = patternVersionIds[item];
		if (selectedVersionId === versionId) {
			setSelectedVersionId(null);
			linesDetailContext.actions.resetActivePattern();
		}
		else {
			setSelectedVersionId(versionId);
			linesDetailContext.actions.setActivePattern(versionId);
		}
	};
	const toggleWidgetSmartNotification = () => {
		profileContext.actions.toggleWidgetSmartNotification(selectedPatternId ?? '', radius, startingSeconds, endingSeconds, selectedStopId ?? '', selectedDays);
		exitScreen();
	};
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
				<View style={addFavoriteLineStyles.videoContainer}>
					<TouchableOpacity>
						<ListItem>
							<IconPlayerPlayFilled color="#3D85C6" fill="#3D85C6" size={24} />
							<ListItem.Content>
								<ListItem.Title style={addFavoriteLineStyles.listTitle}><Text>Ver Vídeo Explicativo</Text></ListItem.Title>
							</ListItem.Content>
							<ListItem.Chevron />
						</ListItem>
					</TouchableOpacity>
				</View>

				<Svg fill="none" height="36" style={addFavoriteLineStyles.svg} viewBox="0 0 12 36" width="100%">
					<Circle cx="6" cy="6" fill="#BEBEC8" r="6" />
					<Rect fill="#BEBEC8" height="30" width="2" x="5" y="6" />
				</Svg>
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

				<Svg fill="none" height="30" style={addFavoriteLineStyles.svg} viewBox="0 0 2 30" width="100%">
					<Rect fill="#BEBEC8" height="30" width="2" />
				</Svg>
				<Text style={addFavoriteLineStyles.text}>{t('radiusAt')}</Text>
				<View style={addFavoriteLineStyles.selectNotificationContol}>
					<Input containerStyle={addFavoriteLineStyles.input} onChangeText={text => setRadius(Number(text))} placeholder="Valor" value={radius.toString()} />
					<SelectNotificationControl />
				</View>

				<Svg fill="none" height="30" style={addFavoriteLineStyles.svg} viewBox="0 0 2 30" width="100%">
					<Rect fill="#BEBEC8" height="30" width="2" />
				</Svg>

				<Text style={addFavoriteLineStyles.text}>{t('stopSelectorTitle')}</Text>
				<View>
					{selectedVersionId && linesDetailContext.data.active_pattern ? (
						linesDetailContext.data.active_pattern.path.map((waypoint: Waypoint) => {
							const stop = stopsContext.actions.getStopById(waypoint.stop_id);
							const isSelected = selectedStopId === waypoint.stop_id;
							return (
								<ListItem
									key={waypoint.stop_sequence}
									onPress={() => setSelectedStopId(waypoint.stop_id)}
									style={{ backgroundColor: isSelected ? '#e6f7ff' : undefined }}
								>
									<IconArrowLoopRight color="#C61D23" size={24} />
									<ListItem.Content>
										<ListItem.Title style={addFavoriteLineStyles.listTitle}>
											{stop ? <Text>{stop.long_name}</Text> : <Text>{waypoint.stop_id}</Text>}
										</ListItem.Title>
									</ListItem.Content>
									{isSelected && <IconCircleCheckFilled color="#3CB43C" size={24} />}
								</ListItem>
							);
						})
					) : (
						<ListItem>
							<ListItem.Content>
								<ListItem.Title style={[{ marginLeft: 30 }, addFavoriteLineStyles.listTitle]}>
									<Text style={[{ textAlign: 'center' }, addFavoriteLineStyles.muted]}>Selecione uma linha e destino para ver as paragens</Text>
								</ListItem.Title>
							</ListItem.Content>
						</ListItem>
					)}
				</View>

				<Svg fill="none" height="30" style={addFavoriteLineStyles.svg} viewBox="0 0 2 30" width="100%">
					<Rect fill="#BEBEC8" height="30" width="2" />
				</Svg>
				<Text style={addFavoriteLineStyles.text}>{t('periodSelectorTitle')}</Text>
				<View style={addFavoriteLineStyles.lastSectionWrapper}>
					<View style={addFavoriteLineStyles.timeSelectors}>
						<Text style={addFavoriteLineStyles.text}>{t('startingTime')}</Text>
						<RNDateTimePicker
							display="compact"
							locale={locale.locale}
							mode="time"
							style={addFavoriteLineStyles.input}
							value={startingHour ?? new Date()}
							onChange={(event, date) => {
								if (date) {
									setStartingHour(date);
								}
							}}
						/>
					</View>
					<View style={addFavoriteLineStyles.timeSelectors}>
						<Text style={addFavoriteLineStyles.text}>{t('endingTime')}</Text>
						<RNDateTimePicker
							display="compact"
							mode="time"
							style={addFavoriteLineStyles.input}
							timeZoneName="Europe/Lisbon"
							value={endingHour ?? new Date()}
							onChange={(event, date) => {
								if (date) {
									setEndingHour(date);
								}
							}}
						/>
					</View>
					<View style={addFavoriteLineStyles.daysSelectors}>
						<Text style={addFavoriteLineStyles.textLeft}>{t('weekDaysTitle')}</Text>
						<ButtonGroup
							buttonStyle={addFavoriteLineStyles.button}
							containerStyle={addFavoriteLineStyles.buttonContainer}
							onPress={setSelectedIndex}
							selectedButtonStyle={{ backgroundColor: theming.colorBrand }}
							selectedIndexes={selectedIndex}
							buttons={[
								<Text>{t('monday')}</Text>,
								<Text>{t('tuesday')}</Text>,
								<Text>{t('wednesday')}</Text>,
								<Text>{t('thursday')}</Text>,
								<Text>{t('friday')}</Text>,
								<Text>{t('saturday')}</Text>,
								<Text>{t('sunday')}</Text>,
							]}
							selectMultiple
						/>
					</View>
				</View>

			</View>
			<View style={addFavoriteLineStyles.warningContainer}>
				<Text style={addFavoriteLineStyles.warningTitle}>{t('warningTitle')}</Text>
				<Text style={addFavoriteLineStyles.warningText}>{t('warningText')}</Text>
			</View>
			<Button
				buttonStyle={addFavoriteLineStyles.saveButton}
				onPress={() => toggleWidgetSmartNotification()}
				title="Guardar"
				titleStyle={addFavoriteLineStyles.saveButtonText}
			/>
			<Button
				buttonStyle={addFavoriteLineStyles.saveButton}
				onPress={exitScreen}
				title="Eliminar"
				titleStyle={addFavoriteLineStyles.saveButtonText}
			/>
			<LinesListChooserModal
				isVisible={lineChooserVisibility}
				onBackdropPress={() => setLineChooserVisibility(!lineChooserVisibility)}
			/>
		</ScrollView>
	);

	//
}
