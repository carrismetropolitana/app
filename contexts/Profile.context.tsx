/* * */

import { Account, AccountWidget, CreateAccountDto } from '@/types/account.types';
import { Routes } from '@/utils/routes';
import { Line } from '@carrismetropolitana/api-types/network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messagingLib from '@react-native-firebase/messaging';
import { createContext, useContext, useEffect, useState } from 'react';
import { ReactNode } from 'react';
import { Platform } from 'react-native';
import uuid from 'react-native-uuid';
/* * */

import { useConsentContext } from './Consent.context';

/* * */

const LOCAL_STORAGE_KEYS = {
	accent_color: 'profile|accent_color',
	cloud_profile: 'cloud_profile',
	device_id: 'profile|device_id',
	favorite_lines: 'profile|favorite_lines',
	favorite_stops: 'profile|favorite_stops',
	first_name: 'profile|first_name',
	interests: 'profile|interests',
	last_name: 'profile|last_name',
	persona_history: 'profile|persona_history',
	persona_image: 'profile|persona_image',
	profile: 'profile',
	token: 'token',
	user_type: 'profile|user_type',
	widget_lines: 'profile|widget_lines',
	widget_smart_notifications: 'profile|widget_smart_notifications',
	widget_stops: 'profile|widget_stops',
};

/* * */

interface ProfileContextState {
	actions: {
		checkProfile: (profile: Account) => Promise<void>
		deleteWidgetByDisplayOrder: (display_order: number) => Promise<void>
		fetchPersona: () => Promise<void>
		setAccentColor: (color: string) => void
		setInterests: (topics: string[]) => void
		setNewEmptyProfile: (profile: CreateAccountDto) => Promise<void>
		setPreviousPersona: () => void
		setSelectedLine: (line: string) => void
		toggleFavoriteLine: (lineId: string) => Promise<void>
		toggleFavoriteStop: (stopId: string) => Promise<void>
		toggleWidgetLine: (lineId: string[]) => Promise<void>
		toggleWidgetSmartNotification: (pattern_id: string, radius: number, start_time: number, end_time: number, stop_id: string, week_days: ('friday' | 'monday' | 'saturday' | 'sunday' | 'thursday' | 'tuesday' | 'wednesday')[]) => Promise<void>
		toggleWidgetStop: (stopId: string, patternId: string[]) => Promise<void>
		toogleAccountSync: () => void
		updateLocalProfile: (profile: Account) => Promise<void>
	}
	counters: {
		favorite_lines: number
		favorite_stops: number
		widget_lines: number
		widget_stops: number
	}
	data: {
		accent_color: string
		cloud_profile: Account | null
		favorite_lines: null | string[]
		favorite_stops: null | string[]
		interests: null | string[]
		persona_image: null | string
		profile: Account | null
		selected_line: Line | string
		widget_lines: AccountWidget[] | null
		widget_smart_notifications: AccountWidget[] | null
		widget_stops: AccountWidget[] | null
	}
	flags: {
		is_enabled: boolean
		is_existing_profile: boolean
		is_loading: boolean
		is_syncing: boolean
	}
}

/* * */

const ProfileContext = createContext<ProfileContextState | undefined>(undefined);

export function useProfileContext() {
	const context = useContext(ProfileContext);
	if (!context) {
		throw new Error('useProfileContext must be used within a ProfileContextProvider');
	}
	return context;
}

export const ProfileContextProvider = ({ children }: { children: ReactNode }) => {
	//
	// A. Setup variables

	const consentContext = useConsentContext();
	const localStorage = AsyncStorage;

	const [dataWidgetLinesState, setDataWidgetLinesState] = useState<AccountWidget[] | null>(null);
	const [dataWidgetStopsState, setDataWidgetStopsState] = useState<AccountWidget[] | null>(null);
	const [dataWidgetSmartNotificationsState, setDataWidgetSmartNotificationsState] = useState<AccountWidget[] | null>(null);
	const [personaHistory, setPersonaHistory] = useState<string[]>([]);
	const [dataProfileState, setDataProfileState] = useState<Account | null>(null);
	const [dataCloudProfileState] = useState<Account | null>(null);
	const [dataApiTokenState, setAPIToken] = useState<null | string>(null);
	const [dataIsSyncingState, setDataIsSyncingState] = useState(false);
	const [dataPersonaImageState, setDataPersonaImageState] = useState<null | string>(null);
	const [dataSelectedLineState, setSelectedLineState] = useState<Line | string>('');
	const [dataFavoriteLinesState, setDataFavoriteLinesState] = useState<ProfileContextState['data']['favorite_lines']>(null);
	const [dataFavoriteStopsState, setDataFavoriteStopsState] = useState<ProfileContextState['data']['favorite_stops']>(null);
	const [dataAccentColorState, setDataAccentColorState] = useState<null | string>(null);
	const [dataInterestsState, setDataInterestsState] = useState<string[]>([]);

	const [flagIsLoadingState, setFlagIsLoadingState] = useState<ProfileContextState['flags']['is_loading']>(true);

	//
	// C. Fetch Data

	const mergeProfiles = (local: Account, cloud: Account): Account => {
		return {
			_id: cloud._id || local._id,
			created_at: cloud.created_at || local.created_at,
			devices: local.devices || cloud.devices || [],
			favorites: {
				lines: local.favorites?.lines || cloud.favorites?.lines || [],
				stops: local.favorites?.stops || cloud.favorites?.stops || [],
			},
			profile: {
				activity: cloud.profile?.activity || local.profile?.activity,
				date_of_birth: cloud.profile?.date_of_birth || local.profile?.date_of_birth,
				email: cloud.profile?.email || local.profile?.email,
				first_name: cloud.profile?.first_name || local.profile?.first_name,
				gender: cloud.profile?.gender || local.profile?.gender,
				last_name: cloud.profile?.last_name || local.profile?.last_name,
				phone: cloud.profile?.phone || local.profile?.phone,
				profile_image: local.profile?.profile_image || cloud.profile?.profile_image,
				utilization_type: cloud.profile?.utilization_type || local.profile?.utilization_type,
			},
			role: cloud.role,
			updated_at: cloud.updated_at,
			widgets: local.widgets && local.widgets.length > 0 ? local.widgets : cloud.widgets,
		};
	};

	const syncProfiles = async (localProfile: Account) => {
		try {
			const cloudProfile = await getProfileFromCloud(localProfile.devices[0].device_id);
			if (!cloudProfile) return;

			const mergedProfile = mergeProfiles(localProfile, cloudProfile);
			if (JSON.stringify(localProfile) !== JSON.stringify(mergedProfile)) {
				setDataProfileState(mergedProfile);
				await localStorage.setItem(LOCAL_STORAGE_KEYS.profile, JSON.stringify(mergedProfile));
				updateProfileOnCloud(mergedProfile);
			}
			else {
				console.log('Profiles already in sync.');
			}
		}
		catch (error) {
			console.error('Error synchronizing profiles:', error);
		}
	};

	const fetchData = async () => {
		try {
			setFlagIsLoadingState(true);

			const [storedProfile, storedPersona, storedToken, storedHistory, storedAccentColor, storedInterests] = await Promise.all([
				localStorage.getItem(LOCAL_STORAGE_KEYS.profile),
				localStorage.getItem(LOCAL_STORAGE_KEYS.persona_image),
				localStorage.getItem(LOCAL_STORAGE_KEYS.token),
				localStorage.getItem(LOCAL_STORAGE_KEYS.persona_history),
				localStorage.getItem(LOCAL_STORAGE_KEYS.accent_color),
				localStorage.getItem(LOCAL_STORAGE_KEYS.interests),
			]);

			setAPIToken(prev => prev === storedToken ? prev : storedToken);
			setDataAccentColorState(prev => prev === storedAccentColor ? prev : storedAccentColor);
			setDataPersonaImageState(prev => prev === storedPersona ? prev : storedPersona);
			const parsedInterests = storedInterests ? JSON.parse(storedInterests) : [];
			setDataInterestsState((prev) => {
				if (JSON.stringify(prev) === JSON.stringify(parsedInterests)) {
					return prev;
				}
				return parsedInterests;
			});
			setPersonaHistory((prev) => {
				const parsed = storedHistory ? JSON.parse(storedHistory) : [];
				if (prev.length === parsed.length && prev.every((v, i) => v === parsed[i])) {
					return prev;
				}
				return parsed;
			});

			const localProfile = storedProfile ? JSON.parse(storedProfile) : '';
			setDataProfileState(prev => (
				JSON.stringify(prev) === JSON.stringify(localProfile) ? prev : localProfile
			));

			if (!localProfile) {
				await setNewEmptyProfile();
			}
		}
		catch (error) {
			console.error('Error loading profile data:', error);
		}
		finally {
			setFlagIsLoadingState(false);
		}
	};

	useEffect(() => {
		if (!consentContext.data.enabled_functional) {
			setFlagIsLoadingState(false);
			return;
		}
		fetchData();

		const intervalId = setInterval(() => {
			fetchData();
		}, 10000);

		return () => clearInterval(intervalId);
	}, [consentContext.data.enabled_functional]);

	useEffect(() => {
		if (
			consentContext.data.enabled_functional
			&& dataApiTokenState
			&& dataProfileState
		) {
			syncProfiles(dataProfileState);
		}
	}, [dataApiTokenState, dataProfileState, consentContext.data.enabled_functional]);

	useEffect(() => {
		if (!consentContext.data.enabled_functional) return;

		if (dataWidgetLinesState) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.widget_lines, JSON.stringify(dataWidgetLinesState) || '');
		}
		if (dataWidgetStopsState) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.widget_stops, JSON.stringify(dataWidgetStopsState) || '');
		}
		if (dataWidgetSmartNotificationsState) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.widget_smart_notifications, JSON.stringify(dataWidgetSmartNotificationsState) || '');
		}
		if (dataFavoriteLinesState) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.favorite_lines, JSON.stringify(dataFavoriteLinesState) || '');
		}
		if (dataFavoriteStopsState) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.favorite_stops, JSON.stringify(dataFavoriteStopsState) || '');
		}
		if (dataApiTokenState) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.token, dataApiTokenState || '');
		}
		if (dataProfileState) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.profile, JSON.stringify(dataProfileState) || '');
		}
		if (dataPersonaImageState) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.persona_image, dataPersonaImageState || '');
		}
		if (dataAccentColorState) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.accent_color, dataAccentColorState || '');
		}
		if (dataInterestsState) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.interests, JSON.stringify(dataInterestsState) || '');
		}
	}, [
		dataWidgetLinesState,
		dataInterestsState,
		dataWidgetStopsState,
		dataApiTokenState,
		dataProfileState,
		dataAccentColorState,
		dataPersonaImageState,
		dataWidgetSmartNotificationsState,
		consentContext.data.enabled_functional,
	]);

	const fetchPersona = async () => {
		try {
			let image;
			do {
				const response = await fetch(`${Routes.DEV_API_ACCOUNTS}/persona/`);
				image = await response.json();
				if (image.url && personaHistory.includes(image.url)) {
					console.log('Image already exists in history, refetching...');
				}
			} while (image.url && personaHistory.includes(image.url));
			if (image.url) {
				setDataPersonaImageState(image.url);
				setDataProfileState((prevState) => {
					if (!prevState) {
						console.error('Error: prevState is null or undefined');
						return null;
					}
					return {
						...prevState,
						profile: {
							...prevState.profile,
							profile_image: image.url,
						},
					};
				});
				registerPersonaFetch(image.url);
			}
			else {
				console.error('Error: No URL property in response', image);
			}
		}
		catch (error) {
			console.error('Error in fetchPersona:', error);
		}
	};

	const registerPersonaFetch = (url: string) => {
		setPersonaHistory((prev) => {
			const updated = [url, ...prev.filter(item => item !== url)];
			localStorage.setItem(LOCAL_STORAGE_KEYS.persona_history, JSON.stringify(updated.slice(0, 50)));
			return updated.slice(0, 50);
		});
	};

	const setPreviousPersona = () => {
		if (personaHistory.length === 0) return;

		const currentIndex = personaHistory.findIndex(url => url === dataPersonaImageState);
		const newIndex = currentIndex < personaHistory.length - 1 ? currentIndex + 1 : 0;
		const newUrl = personaHistory[newIndex];
		setDataPersonaImageState(newUrl);
		setDataProfileState((prev) => {
			if (!prev) return prev;
			return {
				...prev,
				profile: {
					...prev.profile,
					profile_image: newUrl,
				},
			};
		});
		localStorage.setItem(LOCAL_STORAGE_KEYS.persona_image, newUrl);
	};

	const getProfileFromCloud = async (id: string) => {
		if (!consentContext.data.enabled_functional) return;

		const token = dataApiTokenState || '';

		if (!token) {
			console.error('No token found for fetching profile from cloud.');
			return null;
		}

		const response = await fetch(`${Routes.DEV_API_ACCOUNTS}/${id}`, {
			headers: {
				'Content-Type': 'application/json',
				'Cookie': `session_token=${token}`,
			},
		});
		if (!response.ok) {
			console.error('Failed to fetch profile from cloud:', response);
			return null;
		}

		const profileData = await response.json();

		return profileData;
	};

	const updateProfileOnCloud = async (profile: Account) => {
		if (!consentContext.data.enabled_functional || !dataApiTokenState) return;

		const { _id, created_at, role, updated_at, ...cleanedProfile } = profile;

		// console.log('Updating profile on cloud:', JSON.stringify(cleanedProfile, null, 2));

		try {
			await fetch(`${Routes.DEV_API_ACCOUNTS}/${profile.devices[0].device_id}`, {
				body: JSON.stringify(cleanedProfile),
				headers: {
					'Content-Type': 'application/json',
					'Cookie': `session_token=${dataApiTokenState}`,
				},
				method: 'PUT',
			});
		}
		catch (error) {
			console.error('Error updating profile on cloud:', error);
		}
	};

	const updateLocalProfile = async (profile: Account) => {
		if (!consentContext.data.enabled_functional) return;
		const { _id, created_at, role, updated_at, ...cleanedProfile } = profile;

		const localProfile = await localStorage.getItem(LOCAL_STORAGE_KEYS.profile);
		if (localProfile) {
			const parsedProfile = JSON.parse(localProfile);
			const updatedProfile = {
				...parsedProfile,
				...cleanedProfile,
				updated_at: new Date().toISOString(),
			};
			await localStorage.setItem(LOCAL_STORAGE_KEYS.profile, JSON.stringify(updatedProfile));
			setDataProfileState(updatedProfile);
			updateProfileOnCloud(updatedProfile);
		}
	};

	const toggleFavoriteLine = async (lineId: string) => {
		if (!consentContext.data.enabled_functional) return;

		// Create a Set to manage favorite lines
		const favoriteLinesSet = new Set(dataFavoriteLinesState || []);

		// Add or remove the line from the Set
		if (favoriteLinesSet.has(lineId)) {
			favoriteLinesSet.delete(lineId);
		}
		else {
			favoriteLinesSet.add(lineId);
		}
		const updatedFavoriteLines = Array.from(favoriteLinesSet);
		setDataFavoriteLinesState(updatedFavoriteLines);
		setDataProfileState((prev) => {
			if (!prev) return prev;
			return {
				...prev,
				favorites: {
					...(prev.favorites || { lines: [], stops: [] }),
					lines: updatedFavoriteLines,
				},
			};
		});

		const updatedProfile: Account = {
			...(dataProfileState || {}),
			favorites: {
				...(dataProfileState?.favorites || { lines: [], stops: [] }),
				lines: Array.from(new Set([...(dataProfileState?.favorites?.lines || []), ...updatedFavoriteLines])),
			},
		};
		await localStorage.setItem(LOCAL_STORAGE_KEYS.profile, JSON.stringify(updatedProfile) || '');
		await updateProfileOnCloud(updatedProfile);
	};

	const toggleFavoriteStop = async (stopId: string) => {
		if (!consentContext.data.enabled_functional) return;
		const favoriteStopsSet = new Set(dataFavoriteStopsState || []);
		if (favoriteStopsSet.has(stopId)) {
			favoriteStopsSet.delete(stopId);
		}
		else {
			favoriteStopsSet.add(stopId);
		}
		const updatedFavoriteStops = Array.from(favoriteStopsSet);
		setDataFavoriteStopsState(updatedFavoriteStops);
		setDataProfileState((prev) => {
			if (!prev) return prev;
			const mergedStops = Array.from(
				new Set([...(prev.favorites?.stops || []), ...updatedFavoriteStops]),
			);

			return {
				...prev,
				favorites: {
					...(prev.favorites || { lines: [], stops: [] }),
					stops: mergedStops,
				},
			};
		});
		const updatedProfile: Account = {
			...(dataProfileState || {}),
			favorites: {
				...(dataProfileState?.favorites || { lines: [], stops: [] }),
				stops: Array.from(new Set([...(dataProfileState?.favorites?.stops || []), ...updatedFavoriteStops])),
			},
		};
		await localStorage.setItem(LOCAL_STORAGE_KEYS.profile, JSON.stringify(updatedProfile) || '');
		await updateProfileOnCloud(updatedProfile);
	};

	//
	// D. Action handlers

	const toogleAccountSync = () => {
		setDataIsSyncingState(!dataIsSyncingState);
	};

	const toggleWidgetLine = async (pattern_ids: string[]) => {
		if (!consentContext.data.enabled_functional) return;

		// Get all widgets from the current profile
		const allWidgets = (dataProfileState?.widgets || []) as AccountWidget[];
		const lineWidgets = allWidgets.filter(w => w.data && w.data.type === 'lines');
		const otherWidgets = allWidgets.filter(w => !w.data || w.data.type !== 'lines');

		const updatedLineWidgets = [...lineWidgets];
		pattern_ids.forEach((pattern_id) => {
			const index = updatedLineWidgets.findIndex(
				widget =>
					widget.data
					&& widget.data.type === 'lines'
					&& widget.data.pattern_id === pattern_id,
			);
			if (index !== -1) {
				updatedLineWidgets.splice(index, 1);
			}
			else {
				const newFavoriteLine: AccountWidget = {
					data: {
						pattern_id,
						type: 'lines',
					},
					settings: {
						display_order: null,
						is_open: true,
						label: null,
					},
				};
				updatedLineWidgets.push(newFavoriteLine);
			}
		});

		setDataWidgetLinesState(updatedLineWidgets);

		const mergedWidgets = [...otherWidgets, ...updatedLineWidgets];
		const updatedProfile: Account = {
			...(dataProfileState || {}),
			widgets: mergedWidgets,
		};
		setDataProfileState(updatedProfile);
		await localStorage.setItem(
			LOCAL_STORAGE_KEYS.profile,
			JSON.stringify(updatedProfile) || '',
		);
		await updateProfileOnCloud(updatedProfile);
	};

	const toggleWidgetStop = async (stopId: string, pattern_ids: string[]) => {
		if (!consentContext.data.enabled_functional) return;

		// Get all widgets from the current profile
		const allWidgets = (dataProfileState?.widgets || []) as AccountWidget[];
		const stopWidgets = allWidgets.filter(w => w.data && w.data.type === 'stops');
		const otherWidgets = allWidgets.filter(w => !w.data || w.data.type !== 'stops');

		const updatedStopWidgets = [...stopWidgets];
		const stopWidgetIndex = updatedStopWidgets.findIndex(
			widget =>
				widget.data
				&& widget.data.type === 'stops'
				&& widget.data.stop_id === stopId,
		);
		if (stopWidgetIndex !== -1) {
			const widget = updatedStopWidgets[stopWidgetIndex];
			let currentPatternIds: string[] = [];
			if (widget.data.type === 'stops') {
				currentPatternIds = widget.data.pattern_ids || [];
			}
			const patternId = pattern_ids[0];
			const patternExists = currentPatternIds.includes(patternId);
			const newPatternIds = patternExists
				? currentPatternIds.filter(id => id !== patternId)
				: [...currentPatternIds, patternId];
			if (newPatternIds.length === 0) {
				updatedStopWidgets.splice(stopWidgetIndex, 1);
			}
			else {
				updatedStopWidgets[stopWidgetIndex] = {
					...widget,
					data: {
						...(widget.data.type === 'stops'
							? { ...widget.data, pattern_ids: newPatternIds }
							: widget.data),
					},
				};
			}
		}
		else {
			const newFavoriteStop: AccountWidget = {
				data: { pattern_ids: pattern_ids, stop_id: stopId, type: 'stops' as const },
				settings: { is_open: true },
			};
			updatedStopWidgets.push(newFavoriteStop);
		}

		setDataWidgetStopsState(updatedStopWidgets);

		const mergedWidgets = [...otherWidgets, ...updatedStopWidgets];
		const updatedProfile: Account = {
			...(dataProfileState || {}),
			widgets: mergedWidgets,
		};
		setDataProfileState(updatedProfile);
		await localStorage.setItem(
			LOCAL_STORAGE_KEYS.profile,
			JSON.stringify(updatedProfile) || '',
		);
		await updateProfileOnCloud(updatedProfile);
	};

	const postSmartNotificationToCloud = async (pattern_id: string, radius: number, start_time: number, end_time: number, stop_id: string, week_days: ('friday' | 'monday' | 'saturday' | 'sunday' | 'thursday' | 'tuesday' | 'wednesday')[]) => {
		if (!consentContext.data.enabled_functional || !dataApiTokenState) return;

		const user_id = dataProfileState?.devices[0].device_id || '';
		const body = {
			distance: radius || 0,
			end_time: end_time || 0,
			pattern_id: pattern_id || '0',
			start_time: start_time || 0,
			stop_id: stop_id || '',
			type: 'smart_notifications',
			user_id: user_id || '',
			week_days: (
				Array.isArray(week_days) && week_days.length > 0
					? week_days as [
						'friday' | 'monday' | 'saturday' | 'sunday' | 'thursday' | 'tuesday' | 'wednesday',
						...('friday' | 'monday' | 'saturday' | 'sunday' | 'thursday' | 'tuesday' | 'wednesday')[],
					]
					: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
			),
		};

		try {
			await fetch(`${Routes.DEV_API_ACCOUNTS}/smart-notifications`, {
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json',
					'Cookie': `session_token=${dataApiTokenState}`,
				},
				method: 'POST',
			});
		}
		catch (error) {
			console.error('Error posting smart notification to cloud:', error);
		}
	};

	// Toggle
	const toggleWidgetSmartNotification = async (pattern_id: string, radius: number, start_time: number, end_time: number, stop_id: string, week_days: ('friday' | 'monday' | 'saturday' | 'sunday' | 'thursday' | 'tuesday' | 'wednesday')[]) => {
		if (!consentContext.data.enabled_functional) return;

		const allWidgets = (dataProfileState?.widgets || []) as AccountWidget[];
		const smartNotificationWidgets = allWidgets.filter(
			w => w.data && w.data.type === 'smart_notifications',
		);
		const otherWidgets = allWidgets.filter(
			w => !w.data || w.data.type !== 'smart_notifications',
		);
		const updatedSmartWidgets = [...smartNotificationWidgets];
		const widgetIndex = updatedSmartWidgets.findIndex(
			widget =>
				widget.data
				&& widget.data.type === 'smart_notifications'
				&& widget.data.pattern_id === pattern_id
				&& widget.data.stop_id === stop_id,
		);

		if (widgetIndex !== -1) {
			updatedSmartWidgets.splice(widgetIndex, 1);
		}
		else {
			const user_id = dataProfileState?.devices[0].device_id || '';
			const defaultWeekDays = [
				'monday',
				'tuesday',
				'wednesday',
				'thursday',
				'friday',
				'saturday',
				'sunday',
			] as const;

			const validWeekDays = Array.isArray(week_days) && week_days.length > 0 ? week_days : defaultWeekDays;

			const newWidgetSmartNotification: AccountWidget = {
				data: {
					distance: radius || 0,
					end_time: end_time || 0,
					id: uuid.v4(),
					pattern_id: pattern_id || '0',
					start_time: start_time || 0,
					stop_id: stop_id || '',
					type: 'smart_notifications',
					user_id: user_id || '',
					week_days: (
						Array.isArray(week_days) && week_days.length > 0
							? week_days as [
								'friday' | 'monday' | 'saturday' | 'sunday' | 'thursday' | 'tuesday' | 'wednesday',
								...('friday' | 'monday' | 'saturday' | 'sunday' | 'thursday' | 'tuesday' | 'wednesday')[],
							]
							: validWeekDays as [
								'friday' | 'monday' | 'saturday' | 'sunday' | 'thursday' | 'tuesday' | 'wednesday',
								...('friday' | 'monday' | 'saturday' | 'sunday' | 'thursday' | 'tuesday' | 'wednesday')[],
							]
					),
				},
				settings: {
					is_open: true,
				},
			};
			// console.log('Adding new smart notification widget:', newWidgetSmartNotification);
			updatedSmartWidgets.push(newWidgetSmartNotification);
		}

		setDataWidgetSmartNotificationsState(updatedSmartWidgets);
		const mergedWidgets = [...otherWidgets, ...updatedSmartWidgets];
		const updatedProfile: Account = {
			...(dataProfileState || {}),
			widgets: mergedWidgets,
		};

		setDataProfileState(updatedProfile);
		await localStorage.setItem(LOCAL_STORAGE_KEYS.profile, JSON.stringify(updatedProfile) || '');

		// await updateProfileOnCloud(updatedProfile);
		await postSmartNotificationToCloud(pattern_id, radius, start_time, end_time, stop_id, week_days);
		if (dataApiTokenState) {
			await messagingLib().subscribeToTopic('news');
			console.log('Subscribed to smart notification: ', pattern_id);
		}
	};

	const deleteWidgetByDisplayOrder = async (displayOrder: number) => {
		if (!consentContext.data.enabled_functional) return;

		const currentProfile = dataProfileState;
		if (!currentProfile) return;

		const newList = (currentProfile.widgets || []).filter(
			widget => widget.settings?.display_order !== displayOrder,
		);

		const orderedWidgets = newList.map((widget, idx) => ({
			...widget,
			settings: { ...widget.settings, display_order: idx },
		}));

		const updatedProfile: Account = {
			...currentProfile,
			widgets: orderedWidgets,
		};

		setDataProfileState(updatedProfile);
		await localStorage.setItem(LOCAL_STORAGE_KEYS.profile, JSON.stringify(updatedProfile) || '');
		await updateProfileOnCloud(updatedProfile);
	};

	const setNewEmptyProfile = async () => {
		if (!consentContext.data.enabled_functional) return;
		const newProfileStructure: Account = {
			_id: '',
			devices: [
				{
					device_id: '',
					name: '',
					type: Platform.OS === 'ios' ? 'ios' : 'android',
				},
			],
			favorites: { lines: [], stops: [] },
			profile: {
				activity: undefined,
				date_of_birth: undefined,
				email: null,
				first_name: null,
				gender: undefined,
				interests: undefined,
				last_name: null,
				phone: null,
				profile_image: null,
				utilization_type: undefined,
				work_setting: undefined,
			},
			role: 'user',
			widgets: [],
		};

		const apiResponse = await fetch(`${Routes.DEV_API_ACCOUNTS}`, {
			body: JSON.stringify(newProfileStructure),
			headers: { 'Content-Type': 'application/json' },
			method: 'POST',
		}).then(res => res.json());

		newProfileStructure.devices[0].device_id = apiResponse.device_id;
		setDataProfileState(newProfileStructure);
		setAPIToken(apiResponse.session_token);
		localStorage.setItem(LOCAL_STORAGE_KEYS.token, apiResponse.session_token);
	};

	const checkProfile = async (profile: Account | null) => {
		console.log('Checking if profile exists ⚙️');
		if (!profile) {
			console.log('No profile found, creating new account 🤖');
			await setNewEmptyProfile();
		}
		else {
			console.log('Profile exists.');
		}
	};

	const setSelectedLine = (line: string) => {
		if (!consentContext.data.enabled_functional) return;
		setSelectedLineState(line);
	};

	const setAccentColor = (color: string) => {
		if (!consentContext.data.enabled_functional) return;
		setDataAccentColorState(color);
	};

	const setInterests = (topics: string[]) => {
		if (!consentContext.data.enabled_functional) return;
		setDataInterestsState(topics);
	};

	//
	// E. Define context value
	const contextValue: ProfileContextState = {
		actions: {
			checkProfile,
			deleteWidgetByDisplayOrder,
			fetchPersona,
			setAccentColor,
			setInterests,
			setNewEmptyProfile,
			setPreviousPersona,
			setSelectedLine,
			toggleFavoriteLine,
			toggleFavoriteStop,
			toggleWidgetLine,
			toggleWidgetSmartNotification,
			toggleWidgetStop,
			toogleAccountSync,
			updateLocalProfile,
		},
		counters: {
			favorite_lines: dataFavoriteLinesState ? dataFavoriteLinesState.length : 0,
			favorite_stops: dataFavoriteStopsState ? dataFavoriteStopsState.length : 0,
			widget_lines: dataWidgetLinesState ? dataWidgetLinesState.length : 0,
			widget_stops: dataWidgetStopsState ? dataWidgetStopsState.length : 0,
		},
		data: {
			accent_color: dataAccentColorState || 'rgba(253,183,26,0.4)',
			cloud_profile: dataCloudProfileState,
			favorite_lines: dataFavoriteLinesState,
			favorite_stops: dataFavoriteStopsState,
			interests: dataInterestsState,
			persona_image: dataPersonaImageState,
			profile: dataProfileState,
			selected_line: dataSelectedLineState,
			widget_lines: dataWidgetLinesState,
			widget_smart_notifications: dataWidgetSmartNotificationsState,
			widget_stops: dataWidgetStopsState,
		},
		flags: {
			is_enabled: consentContext.data.enabled_functional,
			is_existing_profile: dataCloudProfileState ? true : false,
			is_loading: flagIsLoadingState,
			is_syncing: dataIsSyncingState,
		},
	};

	return (
		<ProfileContext.Provider value={contextValue}>
			{children}
		</ProfileContext.Provider>
	);

	//
};

export default ProfileContextProvider;
