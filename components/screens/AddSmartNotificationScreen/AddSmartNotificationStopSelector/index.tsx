/* * */

import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useLocationsContext } from '@/contexts/Locations.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { Waypoint } from '@carrismetropolitana/api-types/network';
import { ListItem, Text } from '@rn-vui/themed';
import { IconArrowLoopRight, IconCircleCheckFilled } from '@tabler/icons-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import styles from './styles';

/* * */

interface StopSelectorProps {
	selectedStopId?: string
	selectedVersionId?: string
	setSelectedStopId: (stopId: string) => void
}

/* * */

export const AddSmartNotificationsStopSelector = ({ selectedStopId, selectedVersionId, setSelectedStopId }: StopSelectorProps) => {
	const { t } = useTranslation('translation', { keyPrefix: 'addsmartnotifications.StopSelector' });
	const stopSelectorStyles = styles();
	const linesDetailContext = useLinesDetailContext();
	const locationsContext = useLocationsContext();
	const stopsContext = useStopsContext();
	const [showMiddle, setShowMiddle] = useState(false);
	const topCount = 5;
	const bottomCount = 5;

	return (
		<>
			<Text style={stopSelectorStyles.text}>{t('stopSelectorTitle')}</Text>
			<View key={linesDetailContext.data.active_pattern?.id || selectedVersionId}>
				{selectedVersionId && linesDetailContext.data.active_pattern ? (() => {
					const path = linesDetailContext.data.active_pattern.path;
					const total = path.length;
					const hasMiddle = total > topCount + bottomCount;
					const topItems = path.slice(0, topCount);
					const middleItems = path.slice(topCount, total - bottomCount);
					const bottomItems = path.slice(total - bottomCount, total);
					return (
						<>
							{topItems.map((waypoint: Waypoint, idx: number) => {
								const stop = stopsContext.actions.getStopById(waypoint.stop_id);
								const isSelected = selectedStopId === waypoint.stop_id;
								const isFirst = idx === 0;
								return (
									<View key={waypoint.stop_sequence}>
										{isFirst && <Text style={stopSelectorStyles.functionalityNotAvailable}>{t('functionalityNotAvailable')}</Text>}
										<ListItem
											disabled={isFirst}
											disabledStyle={{ opacity: 0.5 }}
											onPress={() => !isFirst && setSelectedStopId(waypoint.stop_id)}
											style={{ backgroundColor: '#e6f7ff' }}
										>
											<View
												style={{
													alignItems: 'center',
													backgroundColor: linesDetailContext.data.line?.color || '#ccc',
													borderRadius: 14,
													height: 28,
													justifyContent: 'center',
													width: 28,
												}}
											>
												<Text style={{ color: '#fff', fontWeight: 'bold' }}>{waypoint.stop_sequence}</Text>
											</View>
											<ListItem.Content>
												<ListItem.Title style={stopSelectorStyles.listTitle}>
													{stop ? <Text>{stop.long_name}</Text> : <Text>{waypoint.stop_id}</Text>}
												</ListItem.Title>
												<ListItem.Subtitle>
													{(() => {
														if (stop) {
															const locality = stop.locality_id ? locationsContext.actions.getLocalityById(stop.locality_id) : undefined;
															return (
																<View style={stopSelectorStyles.stopInfo}>
																	<Text style={stopSelectorStyles.cleanMute}> {locality ? locality.name : stop.locality_id}</Text>
																	<Text style={stopSelectorStyles.cleanMute}> {stop.id} </Text>
																</View>
															);
														}
														return <Text>{waypoint.stop_id}</Text>;
													})()}
												</ListItem.Subtitle>
											</ListItem.Content>
											{isSelected && <IconCircleCheckFilled color="#FFFFFF" fill="#3CB43C" size={24} />}
										</ListItem>
									</View>
								);
							})}
							{hasMiddle && !showMiddle && (
								<ListItem onPress={() => setShowMiddle(true)}>
									<ListItem.Content>
										<ListItem.Title style={stopSelectorStyles.showMore}>
											<Text style={stopSelectorStyles.cleanMute}>{t('showMore')} + {total} {t('stops')}</Text>
										</ListItem.Title>
									</ListItem.Content>
								</ListItem>
							)}
							{hasMiddle && showMiddle && (
								<>
									{middleItems.map((waypoint: Waypoint) => {
										const stop = stopsContext.actions.getStopById(waypoint.stop_id);
										const isSelected = selectedStopId === waypoint.stop_id;
										return (
											<View key={waypoint.stop_sequence}>
												<ListItem
													disabled={false}
													disabledStyle={{ opacity: 0.5 }}
													onPress={() => setSelectedStopId(waypoint.stop_id)}
													style={{ backgroundColor: isSelected ? '#e6f7ff' : undefined }}
												>
													<View
														style={{
															alignItems: 'center',
															backgroundColor: linesDetailContext.data.line?.color || '#ccc',
															borderRadius: 14,
															height: 28,
															justifyContent: 'center',
															width: 28,
														}}
													>
														<Text style={{ color: '#fff', fontWeight: 'bold' }}>{waypoint.stop_sequence}</Text>
													</View>
													<ListItem.Content>
														<ListItem.Title style={stopSelectorStyles.listTitle}>
															{stop ? <Text>{stop.long_name}</Text> : <Text>{waypoint.stop_id}</Text>}
														</ListItem.Title>
														<ListItem.Subtitle>
															{(() => {
																if (stop) {
																	const locality = stop.locality_id ? locationsContext.actions.getLocalityById(stop.locality_id) : undefined;
																	return (
																		<View style={stopSelectorStyles.stopInfo}>
																			<Text style={stopSelectorStyles.cleanMute}> {locality ? locality.name : stop.locality_id}</Text>
																			<Text style={stopSelectorStyles.cleanMute}> {stop.id} </Text>
																		</View>
																	);
																}
																return <Text>{waypoint.stop_id}</Text>;
															})()}
														</ListItem.Subtitle>
													</ListItem.Content>
													{isSelected && <IconCircleCheckFilled color="#FFFFFF" fill="#3CB43C" size={24} />}
												</ListItem>
											</View>
										);
									})}
								</>
							)}
							{hasMiddle && bottomItems.map((waypoint: Waypoint) => {
								const stop = stopsContext.actions.getStopById(waypoint.stop_id);
								const isSelected = selectedStopId === waypoint.stop_id;
								return (
									<View key={waypoint.stop_sequence}>
										<ListItem
											disabled={false}
											disabledStyle={{ opacity: 0.5 }}
											onPress={() => setSelectedStopId(waypoint.stop_id)}
											style={{ backgroundColor: isSelected ? '#e6f7ff' : undefined }}
										>
											<View
												style={{
													alignItems: 'center',
													backgroundColor: linesDetailContext.data.line?.color || '#ccc',
													borderRadius: 14,
													height: 28,
													justifyContent: 'center',
													width: 28,
												}}
											>
												<Text style={{ color: '#fff', fontWeight: 'bold' }}>{waypoint.stop_sequence}</Text>
											</View>
											<ListItem.Content>
												<ListItem.Title style={stopSelectorStyles.listTitle}>
													{stop ? <Text>{stop.long_name}</Text> : <Text>{waypoint.stop_id}</Text>}
												</ListItem.Title>
												<ListItem.Subtitle>
													{(() => {
														if (stop) {
															const locality = stop.locality_id ? locationsContext.actions.getLocalityById(stop.locality_id) : undefined;
															return (
																<View style={stopSelectorStyles.stopInfo}>
																	<Text style={stopSelectorStyles.cleanMute}> {locality ? locality.name : stop.locality_id}</Text>
																	<Text style={stopSelectorStyles.cleanMute}> {stop.id} </Text>
																</View>
															);
														}
														return <Text>{waypoint.stop_id}</Text>;
													})()}
												</ListItem.Subtitle>
											</ListItem.Content>
											{isSelected && <IconCircleCheckFilled color="#FFFFFF" fill="#3CB43C" size={24} />}
										</ListItem>
									</View>
								);
							})}
							{!hasMiddle && path.slice(topCount).map((waypoint: Waypoint) => {
								const stop = stopsContext.actions.getStopById(waypoint.stop_id);
								const isSelected = selectedStopId === waypoint.stop_id;
								const isFirst = false;
								return (
									<ListItem
										key={waypoint.stop_sequence}
										disabled={isFirst}
										disabledStyle={{ opacity: 0.5 }}
										onPress={() => setSelectedStopId(waypoint.stop_id)}
										style={{ backgroundColor: isSelected ? '#e6f7ff' : undefined }}
									>
										<IconArrowLoopRight color="#C61D23" size={24} />
										<ListItem.Content>
											<ListItem.Title style={stopSelectorStyles.listTitle}>
												{stop ? <Text>{stop.long_name}</Text> : <Text>{waypoint.stop_id}</Text>}
											</ListItem.Title>
										</ListItem.Content>
										{isSelected && <IconCircleCheckFilled color="#FFFFFF" fill="#3CB43C" size={24} />}
									</ListItem>
								);
							})}
							{showMiddle && hasMiddle && (
								<ListItem onPress={() => setShowMiddle(false)}>
									<ListItem.Content>
										<ListItem.Title style={stopSelectorStyles.showLess}>
											<Text>{t('showLess')}</Text>
										</ListItem.Title>
									</ListItem.Content>
								</ListItem>
							)}
						</>
					);
				})()
					: (
						<ListItem>
							<ListItem.Content>
								<ListItem.Title style={[{ marginLeft: 30 }, stopSelectorStyles.listTitle]}>
									<Text style={[{ textAlign: 'center' }, stopSelectorStyles.muted]}>{t('title')}</Text>
								</ListItem.Title>
							</ListItem.Content>
						</ListItem>
					)}
			</View>
		</>
	);
};
