/* * */

import { Account, AccountWidget } from '@/types/account.types';
import { Routes } from '@/utils/routes';
import { Line } from '@carrismetropolitana/api-types/network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messagingLib from '@react-native-firebase/messaging';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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

interface ProfileSyncContextState {
	actions: {
		checkProfile: (profile: Account | null) => Promise<void>
		deleteWidgetByDisplayOrder: (display_order: number) => Promise<void>
		fetchPersona: () => Promise<void>
		setAccentColor: (color: string) => void
		setInterests: (topics: string[]) => void
		setNewEmptyProfile: () => Promise<void>
		setPreviousPersona: () => void
		setSelectedLine: (line: string) => void
		toggleFavoriteLine: (lineId: string) => Promise<void>
		toggleFavoriteStop: (stopId: string) => Promise<void>
		toggleWidgetLine: (pattern_ids: string[]) => Promise<void>
		toggleWidgetSmartNotification: (
			pattern_id: string,
			radius: number,
			start_time: number,
			end_time: number,
			stop_id: string,
			week_days: (
			  | 'friday'
			  | 'monday'
			  | 'saturday'
			  | 'sunday'
			  | 'thursday'
			  | 'tuesday'
			  | 'wednesday'
			)[],
		) => Promise<void>
		toggleWidgetStop: (stopId: string, pattern_ids: string[]) => Promise<void>
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

const ProfileContext = createContext<ProfileSyncContextState | undefined>(undefined);

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
	const [dataFavoriteLinesState, setDataFavoriteLinesState] = useState<null | string[]>(null);
	const [dataFavoriteStopsState, setDataFavoriteStopsState] = useState<null | string[]>(null);
	const [dataAccentColorState, setDataAccentColorState] = useState<null | string>(null);
	const [dataInterestsState, setDataInterestsState] = useState<null | string[]>(null);
	const [flagIsLoadingState, setFlagIsLoadingState] = useState<boolean>(true);

	//
	// C. Fetch Data

	const getProfileFromCloud = useCallback(async (deviceId: string): Promise<Account | null> => {
		if (!consentContext.data.enabled_functional || !dataApiTokenState) return null;
		try {
			const response = await fetch(`${Routes.API_ACCOUNTS}/`, {
				headers: {
					'Content-Type': 'application/json',
					'Cookie': `session_token=${dataApiTokenState}`,
				},
			});
			if (!response.ok) return null;
			return await response.json();
		}
		catch (error) {
			console.error('Error fetching profile from cloud:', error);
			return null;
		}
	}, [dataApiTokenState, consentContext.data.enabled_functional]);

	const getProfileFromLocal = useCallback(async (): Promise<Account | null> => {
		try {
			const stored = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.profile);
			return stored ? JSON.parse(stored) : null;
		}
		catch (error) {
			console.error('Error fetching profile from local:', error);
			return null;
		}
	}, []);

	const saveProfileToLocal = useCallback(async (profile: Account) => {
		await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.profile, JSON.stringify(profile));
	}, []);

	const saveProfileToCloud = useCallback(async (profile: Account) => {
		if (!consentContext.data.enabled_functional || !dataApiTokenState) return;
		try {
			await fetch(`${Routes.API_ACCOUNTS}`, {
				body: JSON.stringify(profile),
				headers: {
					'Content-Type': 'application/json',
					'Cookie': `session_token=${dataApiTokenState}`,
				},
				method: 'PUT',
			});
		}
		catch (error) {
			console.error('Error saving profile to cloud:', error);
		}
	}, [dataApiTokenState, consentContext.data.enabled_functional]);

	const deepEqual = (a: any, b: any) => {
		// Ignore updated_at for comparison
		const clean = (obj: any) => {
			if (!obj) return obj;
			const { updated_at, ...rest } = obj;
			return rest;
		};
		return JSON.stringify(clean(a)) === JSON.stringify(clean(b));
	};

	const mergeProfiles = (local: Account, cloud: Account): Account => {
		return {
			...cloud,
			...local,
			_id: cloud._id || local._id,
			devices: local.devices || cloud.devices || [],
			favorites: local.favorites || cloud.favorites || { lines: [], stops: [] },
			widgets: local.widgets && local.widgets.length > 0 ? local.widgets : cloud.widgets,
		};
	};

	const syncProfiles = useCallback(async () => {
		if (!consentContext.data.enabled_functional) return;
		const local = await getProfileFromLocal();
		if (!local) return;
		const cloud = await getProfileFromCloud(local.devices[0].device_id);
		if (!cloud) {
			await saveProfileToCloud(local);
			setDataProfileState(local);
			return;
		}
		if (!deepEqual(local, cloud)) {
			const merged = mergeProfiles(local, cloud);
			await saveProfileToLocal(merged);
			await saveProfileToCloud(merged);
			setDataProfileState(merged);
			console.log('[ProfileSync] Synced local and cloud profile.');
		}
		else {
			// Profiles are in sync
			setDataProfileState(local);
		}
	}, [consentContext.data.enabled_functional, getProfileFromCloud, getProfileFromLocal, saveProfileToCloud, saveProfileToLocal]);

	// --- Polling Effect ---
	useEffect(() => {
		if (!consentContext.data.enabled_functional) return;
		const interval = setInterval(() => {
			syncProfiles();
		}, 20000); // 20 seconds
		// Initial sync
		syncProfiles();
		return () => clearInterval(interval);
	}, [consentContext.data.enabled_functional, syncProfiles]);

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
			const parsedInterests = storedInterests ? JSON.parse(storedInterests) : null;
			setDataInterestsState(prev => JSON.stringify(prev) === JSON.stringify(parsedInterests) ? prev : parsedInterests);
			setPersonaHistory((prev) => {
				const parsed = storedHistory ? JSON.parse(storedHistory) : [];
				if (prev.length === parsed.length && prev.every((v, i) => v === parsed[i])) {
					return prev;
				}
				return parsed;
			});

			const localProfile = storedProfile ? JSON.parse(storedProfile) : null;
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
			syncProfiles();
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
		dataFavoriteLinesState,
		dataFavoriteStopsState,
		dataWidgetSmartNotificationsState,
		consentContext.data.enabled_functional,
	]);

	const fetchPersona = async () => {
		try {
			let image;
			do {
				const response = await fetch(`${Routes.API_ACCOUNTS}/persona/`);
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

	const updateProfileOnCloud = async (profile: Account) => {
		if (!consentContext.data.enabled_functional || !dataApiTokenState) return;

		const { _id, created_at, role, updated_at, ...cleanedProfile } = profile;

		// console.log('Updating profile on cloud:', JSON.stringify(cleanedProfile, null, 2));

		try {
			await fetch(`${Routes.API_ACCOUNTS}`, {
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
			_id: dataProfileState?._id || '',
			created_at: dataProfileState?.created_at,
			devices: dataProfileState?.devices || [],
			favorites: {
				...(dataProfileState?.favorites || { lines: [], stops: [] }),
				lines: Array.from(new Set([...(dataProfileState?.favorites?.lines || []), ...updatedFavoriteLines])),
			},
			profile: dataProfileState?.profile,
			role: dataProfileState?.role || 'user',
			updated_at: dataProfileState?.updated_at,
			widgets: dataProfileState?.widgets,
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
			_id: dataProfileState?._id || '',
			created_at: dataProfileState?.created_at,
			devices: dataProfileState?.devices || [],
			favorites: {
				...(dataProfileState?.favorites || { lines: [], stops: [] }),
				stops: Array.from(new Set([...(dataProfileState?.favorites?.stops || []), ...updatedFavoriteStops])),
			},
			profile: dataProfileState?.profile,
			role: dataProfileState?.role || 'user',
			updated_at: dataProfileState?.updated_at,
			widgets: dataProfileState?.widgets,
		};
		await localStorage.setItem(LOCAL_STORAGE_KEYS.profile, JSON.stringify(updatedProfile) || '');
		await updateProfileOnCloud(updatedProfile);
	};

	//
	// D. Action handlers

	const toogleAccountSync = () => {
		setDataIsSyncingState(!dataIsSyncingState);
	};

	// --- Helper: Generic Widget Toggle ---

	/**
	 * Post a smart notification widget to the cloud.
	 */
	const postSmartNotificationToCloud = async (notification: AccountWidget) => {
		if (!consentContext.data.enabled_functional || !dataApiTokenState) return;
		const user_id = dataProfileState?.devices[0].device_id || '';
		try {
			await fetch(`${Routes.API_ACCOUNTS}/${user_id}/smart-notifications`, {
				body: JSON.stringify(notification),
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

	/**
	 * Generic function to toggle widgets of any type (lines, stops, smart_notifications).
	 * Handles add/remove logic, state updates, and side effects.
	 */
	const toggleWidget = async <T extends AccountWidget['data']>({
		create,
		getState,
		match,
		setState,
		sideEffect,
		type,
		updateProfileState,
	}: {
		create: () => AccountWidget
		getState: () => AccountWidget[] | null
		match: (widget: AccountWidget) => boolean
		setState: (widgets: AccountWidget[]) => void
		sideEffect?: (widget: AccountWidget, action: 'add' | 'remove') => Promise<void>
		type: 'lines' | 'smart_notifications' | 'stops'
		updateProfileState: (widgets: AccountWidget[]) => void
	}) => {
		if (!consentContext.data.enabled_functional) return;
		const allWidgets = (dataProfileState?.widgets || []) as AccountWidget[];
		const widgetsOfType = allWidgets.filter(w => w.data && w.data.type === type);
		const otherWidgets = allWidgets.filter(w => !w.data || w.data.type !== type);
		const updatedWidgets = [...widgetsOfType];
		const idx = updatedWidgets.findIndex(match);
		let action: 'add' | 'remove';
		let affectedWidget: AccountWidget | undefined;
		if (idx !== -1) {
			// Remove
			affectedWidget = updatedWidgets[idx];
			updatedWidgets.splice(idx, 1);
			action = 'remove';
		}
		else {
			// Add
			affectedWidget = create();
			updatedWidgets.push(affectedWidget);
			action = 'add';
		}
		setState(updatedWidgets);
		const mergedWidgets = [...otherWidgets, ...updatedWidgets];
		updateProfileState(mergedWidgets);
		if (sideEffect && affectedWidget) {
			await sideEffect(affectedWidget, action);
		}
	};

	// --- Refactored Widget Toggles ---

	const updateProfileWidgets = async (widgets: AccountWidget[]) => {
		if (!dataProfileState) return;
		const updatedProfile: Account = {
			...dataProfileState,
			_id: dataProfileState._id || '',
			widgets,
		};
		setDataProfileState(updatedProfile);
		await localStorage.setItem(
			LOCAL_STORAGE_KEYS.profile,
			JSON.stringify(updatedProfile) || '',
		);
		await updateProfileOnCloud(updatedProfile);
	};

	const toggleWidgetLine = async (pattern_ids: string[]) => {
		await Promise.all(
			pattern_ids.map(pattern_id =>
				toggleWidget({
					create: () => ({
						data: { pattern_id, type: 'lines' },
						settings: { display_order: null, is_open: true, label: null },
					}),
					getState: () => dataWidgetLinesState,
					match: w => w.data.type === 'lines' && w.data.pattern_id === pattern_id,
					setState: setDataWidgetLinesState,
					type: 'lines',
					updateProfileState: widgets => updateProfileWidgets(widgets),
				}),
			),
		);
	};

	const toggleWidgetStop = async (stopId: string, pattern_ids: string[]) => {
		await toggleWidget({
			create: () => ({
				data: { pattern_ids, stop_id: stopId, type: 'stops' },
				settings: { display_order: dataWidgetStopsState ? dataWidgetStopsState.length : 0, is_open: true },
			}),
			getState: () => dataWidgetStopsState,
			match: w => w.data.type === 'stops' && w.data.stop_id === stopId,
			setState: setDataWidgetStopsState,
			type: 'stops',
			updateProfileState: widgets => updateProfileWidgets(widgets),
		});
	};

	const toggleWidgetSmartNotification = async (
		pattern_id: string,
		radius: number,
		start_time: number,
		end_time: number,
		stop_id: string,
		week_days: (
		  | 'friday'
		  | 'monday'
		  | 'saturday'
		  | 'sunday'
		  | 'thursday'
		  | 'tuesday'
		  | 'wednesday'
		)[],
	) => {
		await toggleWidget({
			create: () => {
				const id = uuid.v4() as string;
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
				return {
					data: {
						distance: radius || 0,
						end_time: end_time || 0,
						id,
						pattern_id: pattern_id || '0',
						start_time: start_time || 0,
						stop_id: stop_id || '',
						type: 'smart_notifications',
						user_id: user_id || '',
						week_days: validWeekDays as any,
					},
					settings: { is_open: true },
				};
			},
			getState: () => dataWidgetSmartNotificationsState,
			match: w =>
				w.data.type === 'smart_notifications'
				&& w.data.pattern_id === pattern_id
				&& w.data.stop_id === stop_id,
			setState: setDataWidgetSmartNotificationsState,
			sideEffect: async (widget, action) => {
				if (
					action === 'add'
					&& dataApiTokenState
					&& widget.data.type === 'smart_notifications'
					&& typeof widget.data.id === 'string'
				) {
					await postSmartNotificationToCloud(widget);
					await messagingLib().subscribeToTopic(widget.data.id);
				}
			},
			type: 'smart_notifications',
			updateProfileState: widgets => updateProfileWidgets(widgets),
		});
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

		const apiResponse = await fetch(`${Routes.API_ACCOUNTS}`, {
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
	const contextValue = useMemo(() => ({
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
			is_existing_profile: !!dataCloudProfileState,
			is_loading: flagIsLoadingState,
			is_syncing: dataIsSyncingState,
		},
	}), [
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
		dataAccentColorState,
		dataCloudProfileState,
		dataFavoriteLinesState,
		dataFavoriteStopsState,
		dataInterestsState,
		dataPersonaImageState,
		dataProfileState,
		dataSelectedLineState,
		dataWidgetLinesState,
		dataWidgetSmartNotificationsState,
		dataWidgetStopsState,
		flagIsLoadingState,
		dataIsSyncingState,
		consentContext.data.enabled_functional,
	]);

	return (
		<ProfileContext.Provider value={contextValue}>
			{children}
		</ProfileContext.Provider>
	);

	//
};

export default ProfileContextProvider;
