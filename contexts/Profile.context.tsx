/* eslint-disable @typescript-eslint/no-explicit-any */
/* * */

import { Account, AccountWidget, CreateAccountDto } from '@/types/account.types';
import { ProfileImage } from '@/types/profileImage.type';
import { Routes } from '@/utils/routes';
import { Line } from '@carrismetropolitana/api-types/network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messagingLib from '@react-native-firebase/messaging';
import { createContext, useContext, useEffect, useState } from 'react';
import { ReactNode } from 'react';
import { Platform } from 'react-native';
import uuid from 'react-native-uuid';

import { useConsentContext } from './Consent.context';
import { useNotifications } from './Notifications.context';

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

type WidgetToggleParams =
  | { end_time: number, pattern_id: string, radius: number, start_time: number, stop_id: string, type: 'smart_notifications', week_days: ('friday' | 'monday' | 'saturday' | 'sunday' | 'thursday' | 'tuesday' | 'wednesday')[] }
  | { pattern_ids: string[], stopId: string, type: 'stops' }
  | { pattern_ids: string[], type: 'lines' };

interface ProfileContextState {
	actions: {
		checkProfile: (profile: Account) => Promise<void>
		createWidget: (params: WidgetToggleParams) => Promise<void>
		deleteWidgetByDisplayOrder: (display_order: number) => Promise<void>
		fetchPersona: () => Promise<void>
		setAccentColor: (color: string) => void
		setInterests: (topics: string[]) => void
		setNewEmptyProfile: (profile: CreateAccountDto) => Promise<void>
		setPreviousPersona: () => void
		setSelectedLine: (line: string) => void
		toggleFavoriteItem: (type: 'lines' | 'stops', id: string) => Promise<void>
		updateLocalProfile: (profile: Account) => Promise<void>
		updateWidget: (id: string) => Promise<void>
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
		is_loading: boolean
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

	//
	// A. Setup variables

	const consentContext = useConsentContext();
	const notificationContext = useNotifications();
	const localStorage = AsyncStorage;
	const [dataWidgetLinesState, setDataWidgetLinesState] = useState<AccountWidget[] | null>(null);
	const [dataWidgetStopsState, setDataWidgetStopsState] = useState<AccountWidget[] | null>(null);
	const [dataWidgetSmartNotificationsState, setDataWidgetSmartNotificationsState] = useState<AccountWidget[] | null>(null);
	const [personaHistory, setPersonaHistory] = useState<string[]>([]);
	const [dataProfileState, setDataProfileState] = useState<Account | null>(null);
	const [dataCloudProfileState] = useState<Account | null>(null);
	const [dataApiTokenState, setAPIToken] = useState<null | string>(null);
	const [dataPersonaImageState, setDataPersonaImageState] = useState<null | string>(null);
	const [dataSelectedLineState, setSelectedLineState] = useState<Line | string>('');
	const [dataFavoriteLinesState, setDataFavoriteLinesState] = useState<ProfileContextState['data']['favorite_lines']>(null);
	const [dataFavoriteStopsState, setDataFavoriteStopsState] = useState<ProfileContextState['data']['favorite_stops']>(null);
	const [dataAccentColorState, setDataAccentColorState] = useState<null | string>(null);
	const [dataInterestsState, setDataInterestsState] = useState<string[]>([]);
	const [flagIsLoadingState, setFlagIsLoadingState] = useState<ProfileContextState['flags']['is_loading']>(true);

	// console.log('==> dataAPITokwn State', dataProfileState?.devices[0].device_id);

	//
	// C. Fetch Data
	// Fetch initial data and set up interval for periodic updates (profile sync - only if functional consent is enabled)
	useEffect(() => {
		if (!consentContext.data.enabled_functional) {
			setFlagIsLoadingState(false);
			return;
		}
		fetchData();
		subscribeToAllWidgetTopics();

		const intervalId = setInterval(() => {
			fetchData();
		}, 10000);

		return () => clearInterval(intervalId);
	}, [consentContext.data.enabled_functional]);
	// Sync profiles when the profile data changes
	useEffect(() => {
		if (consentContext.data.enabled_functional && dataApiTokenState && dataProfileState) {
			syncProfiles(dataProfileState);
		}
	}, [dataProfileState, consentContext.data.enabled_functional]);
	// Load data on initial render
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
	// Merge local and cloud profiles
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
	// Synchronize profiles between local and cloud
	const syncProfiles = async (localProfile: Account) => {
		try {
			const cloudProfile = await getProfileFromCloud();
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
			alert('Failed to synchronize profiles. Please try again later.');
			console.error('Error synchronizing profiles:', error);
		}
	};
	// Fetch profile data from local storage and set state
	const fetchData = async () => {
		try {
			setFlagIsLoadingState(true);
			// Load existing data from local storage
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
			// Set user interests
			const parsedInterests = storedInterests ? JSON.parse(storedInterests) : [];
			setDataInterestsState((prev) => {
				if (JSON.stringify(prev) === JSON.stringify(parsedInterests)) {
					return prev;
				}
				return parsedInterests;
			});
			// Set persona history
			setPersonaHistory((prev) => {
				const parsed = storedHistory ? JSON.parse(storedHistory) : [];
				if (prev.length === parsed.length && prev.every((v, i) => v === parsed[i])) {
					return prev;
				}
				return parsed;
			});
			// Set profile data
			const localProfile = storedProfile ? JSON.parse(storedProfile) : '';
			setDataProfileState(prev => (
				JSON.stringify(prev) === JSON.stringify(localProfile) ? prev : localProfile
			));
			if (!localProfile) await setNewEmptyProfile();
		}
		catch (error) {
			console.error('Error loading profile data:', error);
		}
		finally {
			setFlagIsLoadingState(false);
		}
	};
	// Fetch Persona Image
	const fetchPersona = async () => {
		if (!consentContext.data.enabled_functional) {
			alert('Functional consent is required to fetch a persona image.');
			return;
		}
		try {
			let image: null | ProfileImage = null;

			let response: Response;
			try {
				response = await fetch(`${Routes.API_ACCOUNTS}/persona/`);
			}
			catch (networkError) {
				console.error('Network error fetching persona:', networkError);
				alert('Network error. Please check your connection and try again.');
				return;
			}

			if (!response.ok) {
				console.error('Error fetching persona:', response.status, response.statusText);
				alert('We are experiencing some issues. Please try again later.');
				return;
			}

			try {
				image = await response.json();
			}
			catch (parseError) {
				console.error('Error parsing persona response:', parseError);
				alert('Received invalid data from server.');
				return;
			}

			if (image && image.url && personaHistory.includes(image.url)) {
				console.log('Image already exists in history, refetching...');
				await fetchPersona();
				return;
			}

			if (image && image.url) {
				setDataPersonaImageState(image.url);
				setDataProfileState((prevState) => {
					if (!prevState) {
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
				alert('Failed to fetch a valid persona image.');
			}
		}
		catch (error) {
			console.error('Unexpected error in fetchPersona:', error);
			alert('An unexpected error occurred. Please try again.');
		}
	};
	// Register persona fetch (Máx of 50 persona images)
	const registerPersonaFetch = (url: string) => {
		setPersonaHistory((prev) => {
			const updated = [url, ...prev.filter(item => item !== url)];
			localStorage.setItem(LOCAL_STORAGE_KEYS.persona_history, JSON.stringify(updated.slice(0, 50)));
			return updated.slice(0, 50);
		});
	};
	// Set previous persona image from history
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
	// Fetch profile from cloud
	const getProfileFromCloud = async () => {
		if (!consentContext.data.enabled_functional && !dataApiTokenState) return;
		const response = await fetch(`${Routes.API_ACCOUNTS}`, { headers: { 'Content-Type': 'application/json', 'Cookie': `session_token=${dataApiTokenState}` } });
		if (!response.ok) {
			alert('Failed to fetch profile from cloud. Please try again later.');
			console.error('Failed to fetch profile from cloud:', response);
			return null;
		}
		const profileData = await response.json();
		return profileData;
	};
	// Update local profile
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
			try {
				await localStorage.setItem(LOCAL_STORAGE_KEYS.profile, JSON.stringify(updatedProfile));
			}
			catch (error) {
				console.error('Error updating local profile:', error);
			}
			setDataProfileState(updatedProfile);
			updateProfileOnCloud(updatedProfile);
		}
	};
	// Update profile on cloud
	const updateProfileOnCloud = async (profile: Account) => {
		if (!consentContext.data.enabled_functional || !dataApiTokenState) return;
		const { _id, created_at, role, updated_at, ...cleanedProfile } = profile;
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
			alert('Failed to update profile on cloud. Please try again later.');
			console.error('Error updating profile on cloud:', error);
		}
	};

	//
	// D. Action handlers

	// Initial notification subscription
	const subscribeToAllWidgetTopics = async () => {
		const widgets = dataProfileState?.widgets || [];
		await Promise.all(
			widgets
				.filter(widget => widget.data.type === 'smart_notifications' && widget.data.id)
				.map(widget => notificationContext.actions.subscribeToTopic(widget.data.type === 'smart_notifications' ? widget.data.id : '')),
		);
	};
	// Toggle favorite item (line or stop) and update profile with error handling
	const toggleFavoriteItem = async (type: 'lines' | 'stops', id: string) => {
		try {
			if (!consentContext.data.enabled_functional) return;
			const state = type === 'lines' ? dataFavoriteLinesState : dataFavoriteStopsState;
			const setState = type === 'lines' ? setDataFavoriteLinesState : setDataFavoriteStopsState;
			const favoriteSet = new Set(state || []);
			if (favoriteSet.has(id)) {
				favoriteSet.delete(id);
			}
			else {
				favoriteSet.add(id);
			}
			const updatedFavorites = Array.from(favoriteSet);
			setState(updatedFavorites);

			setDataProfileState((prev) => {
				if (!prev) return prev;
				return {
					...prev,
					favorites: {
						...(prev.favorites || { lines: [], stops: [] }),
						[type]: Array.from(new Set([...(prev.favorites?.[type] || []), ...updatedFavorites])),
					},
				};
			});

			const updatedProfile: Account = {
				...(dataProfileState as Account),
				favorites: {
					...(dataProfileState?.favorites || { lines: [], stops: [] }),
					[type]: Array.from(new Set([...(dataProfileState?.favorites?.[type] || []), ...updatedFavorites])),
				},
			};
			await localStorage.setItem(LOCAL_STORAGE_KEYS.profile, JSON.stringify(updatedProfile) || '');
			await updateProfileOnCloud(updatedProfile);
		}
		catch (error) {
			console.error('Error toggling favorite item:', error);
			alert('An error occurred while updating favorites. Please try again.');
		}
	};
	// Unified widget toggle function
	const createWidget = async (params: WidgetToggleParams) => {
		try {
			if (!consentContext.data.enabled_functional && !dataApiTokenState) return;
			const allWidgets = (dataProfileState?.widgets || []) as AccountWidget[];
			if (params.type === 'lines') {
				if (!params.pattern_ids || params.pattern_ids.length === 0) {
					return;
				}
				const lineWidgets = allWidgets.filter(w => w.data && w.data.type === 'lines');
				const otherWidgets = allWidgets.filter(w => !w.data || w.data.type !== 'lines');
				const updatedLineWidgets = [...lineWidgets];
				params.pattern_ids.forEach((pattern_id) => {
					const exists = updatedLineWidgets.some(
						widget =>
							widget.data
							&& widget.data.type === 'lines'
							&& widget.data.pattern_id === pattern_id,
					);
					if (!exists) {
						updatedLineWidgets.push({
							data: { pattern_id, type: 'lines' },
							settings: { display_order: otherWidgets.length + updatedLineWidgets.length + 1, is_open: true },
						});
					}
				});
				const mergedWidgets = [...otherWidgets, ...updatedLineWidgets];
				const updatedProfile: Account = {
					...(dataProfileState as Account || {}),
					widgets: mergedWidgets,
				};
				try {
					await localStorage.setItem(
						LOCAL_STORAGE_KEYS.profile,
						JSON.stringify(updatedProfile) || '',
					);
					await updateProfileOnCloud(updatedProfile);
					setDataWidgetLinesState(updatedLineWidgets);
					setDataProfileState(updatedProfile);
				}
				catch (error) {
					console.error('Error updating line widgets:', error);
					alert('An error occurred while updating line widgets. Please try again.');
				}
			}
			else if (params.type === 'stops') {
				if (!params.pattern_ids || params.pattern_ids.length === 0) {
					return;
				}
				const stopWidgets = allWidgets.filter(w => w.data && w.data.type === 'stops');
				const otherWidgets = allWidgets.filter(w => !w.data || w.data.type !== 'stops');
				const updatedStopWidgets = [...stopWidgets];
				const exists = updatedStopWidgets.some(
					widget =>
						widget.data
						&& widget.data.type === 'stops'
						&& widget.data.stop_id === params.stopId,
				);
				if (!exists) {
					updatedStopWidgets.push({
						data: { pattern_ids: params.pattern_ids, stop_id: params.stopId, type: 'stops' as const },
						settings: { display_order: otherWidgets.length + updatedStopWidgets.length + 1, is_open: true },
					});
				}
				const mergedWidgets = [...otherWidgets, ...updatedStopWidgets];
				const updatedProfile: Account = { ...(dataProfileState as Account || {}), widgets: mergedWidgets };
				try {
					await localStorage.setItem(LOCAL_STORAGE_KEYS.profile, JSON.stringify(updatedProfile) || '');
					await updateProfileOnCloud(updatedProfile);
					setDataWidgetStopsState(updatedStopWidgets);
					setDataProfileState(updatedProfile);
				}
				catch (error) {
					console.error('Error updating stop widgets:', error);
					alert('An error occurred while updating stop widgets. Please try again.');
				}
			}
			else if (params.type === 'smart_notifications') {
				const id = uuid.v4();
				const smartNotificationWidgets = allWidgets.filter(
					w => w.data && w.data.type === 'smart_notifications',
				);

				const otherWidgets = allWidgets.filter(
					w => !w.data || w.data.type !== 'smart_notifications',
				);
				const updatedSmartWidgets = [...smartNotificationWidgets];
				const user_id = dataProfileState?.devices[0].device_id || '';
				const defaultWeekDays = [
					'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
				] as const;
				const validWeekDays = (Array.isArray(params.week_days) && params.week_days.length > 0 ? params.week_days : defaultWeekDays) as any;
				console.log('stopid, pattern', params.stop_id, params.pattern_id);
				const newWidgetSmartNotification: AccountWidget = {
					data: {
						distance: params.radius || 0,
						end_time: params.end_time || 0,
						id: id,
						pattern_id: params.pattern_id || '0',
						start_time: params.start_time || 0,
						stop_id: params.stop_id || '',
						type: 'smart_notifications',
						user_id: user_id || '',
						week_days: validWeekDays,
					},
					settings: { display_order: otherWidgets.length + smartNotificationWidgets.length + 1, is_open: true },
				};
				updatedSmartWidgets.push(newWidgetSmartNotification);
				if (dataApiTokenState) {
					try {
						const postResponse = await postSmartNotificationToCloud(newWidgetSmartNotification);
						if (!postResponse || !postResponse.widgets) {
							alert('Failed to create smart notification. Please try again.');
							return;
						}
						await messagingLib().subscribeToTopic(id);
						await localStorage.setItem(LOCAL_STORAGE_KEYS.profile, JSON.stringify(postResponse) || '');
						await updateProfileOnCloud(postResponse);
						setDataProfileState(postResponse);
						setDataWidgetSmartNotificationsState(updatedSmartWidgets);
					}
					catch (error) {
						console.error('Error subscribing to topic or updating profile:', error);
						alert('An error occurred while subscribing to smart notification.');
						return;
					}
				}
				else {
					alert('No API token available. Please try again.');
					return;
				}
			}
		}
		catch (error) {
			console.error('Error toggling widget:', error);
			alert('An error occurred while updating widgets. Please try again.');
		}
	};
	// Post smart notification to cloud with error and response handling
	const postSmartNotificationToCloud = async (notification: AccountWidget) => {
		if (!consentContext.data.enabled_functional || !dataApiTokenState) return;
		try {
			const response = await fetch(`${Routes.API_ACCOUNTS}/smart-notifications`, {
				body: JSON.stringify(notification),
				headers: {
					'Content-Type': 'application/json',
					'Cookie': `session_token=${dataApiTokenState}`,
				},
				method: 'POST',
			});
			if (!response.ok) {
				const errorText = await response.text();
				console.error('Failed to post smart notification to cloud:', response.status, errorText);
				alert('Failed to post smart notification to the cloud. Please try again.');
				return;
			}
			const data = await response.json();
			if (data && typeof data === 'object' && data.widgets) {
				return data;
			}
		}
		catch (error) {
			console.error('Error posting smart notification to cloud:', error);
			alert('An error occurred while posting smart notification to the cloud.');
		}
		return;
	};
	// Delete any widget by display order
	const deleteWidgetByDisplayOrder = async (displayOrder: number) => {
		if (!consentContext.data.enabled_functional) return;
		const currentProfile = dataProfileState;
		if (!currentProfile) return;
		const newList = (currentProfile.widgets || []).filter(
			widget => widget.settings?.display_order !== displayOrder,
		);
		const removedWidget = currentProfile.widgets?.find(
			widget => widget.settings?.display_order === displayOrder,
		);
		if (removedWidget && removedWidget.data && removedWidget.data.type) {
			if (removedWidget.data.type === 'smart_notifications') {
				notificationContext.actions.unsubscribeFromTopic(removedWidget.data.id);
			}
		}

		console.log('newList', newList);

		const orderedWidgets = newList.map((widget, idx) => ({
			...widget,
			settings: { ...widget.settings, display_order: idx },
		}));

		setDataWidgetLinesState(orderedWidgets.filter(w => w.data?.type === 'lines'));
		setDataWidgetStopsState(orderedWidgets.filter(w => w.data?.type === 'stops'));
		setDataWidgetSmartNotificationsState(orderedWidgets.filter(w => w.data?.type === 'smart_notifications'));

		const updatedProfile: Account = {
			...currentProfile,
			widgets: orderedWidgets,
		};

		setDataProfileState(updatedProfile);
		await updateProfileOnCloud(updatedProfile);
	};

	// Create an empty profile with default values
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
	// Initial Check for profile existence
	const checkProfile = async (profile: Account | null) => {
		console.log('Checking if profile exists ⚙️');
		if (!profile) {
			console.log('No profile found, creating new account 🤖');
			await setNewEmptyProfile();
		}
		else { console.log('Profile exists.'); }
	};
	// Update Widget by ID
	const updateWidget = async (id: string) => {
		if (!consentContext.data.enabled_functional) return;
		const currentProfile = dataProfileState;
		if (!currentProfile) return;

		const updatedWidgets = (currentProfile.widgets || []).map((existingWidget) => {
			if (existingWidget.data?.type === 'smart_notifications' && existingWidget.data.id === id) {
				return {
					...existingWidget,
					settings: {
						...existingWidget.settings,
						is_open: !existingWidget.settings?.is_open,
					},
				};
			}
			if (existingWidget.data?.type === 'lines' && existingWidget.data.pattern_id === id) {
				return {
					...existingWidget,
					settings: {
						...existingWidget.settings,
						is_open: !existingWidget.settings?.is_open,
					},
				};
			}
			if (existingWidget.data?.type === 'stops' && existingWidget.data.stop_id === id) {
				return {
					...existingWidget,
					settings: {
						...existingWidget.settings,
						is_open: !existingWidget.settings?.is_open,
					},
				};
			}
			return existingWidget;
		});

		const updatedProfile: Account = {
			...currentProfile,
			widgets: updatedWidgets,
		};

		setDataProfileState(updatedProfile);
		await localStorage.setItem(LOCAL_STORAGE_KEYS.profile, JSON.stringify(updatedProfile) || '');
		await updateProfileOnCloud(updatedProfile);
	};

	// Set user selected line
	const setSelectedLine = (line: string) => {
		if (!consentContext.data.enabled_functional) return;
		setSelectedLineState(line);
	};
	// Set user accent color
	const setAccentColor = (color: string) => {
		if (!consentContext.data.enabled_functional) return;
		setDataAccentColorState(color);
	};
	// Set user interests
	const setInterests = (topics: string[]) => {
		if (!consentContext.data.enabled_functional) return;
		setDataInterestsState(topics);
	};

	//
	// E. Define context value

	const contextValue: ProfileContextState = {
		actions: {
			checkProfile,
			createWidget,
			deleteWidgetByDisplayOrder,
			fetchPersona,
			setAccentColor,
			setInterests,
			setNewEmptyProfile,
			setPreviousPersona,
			setSelectedLine,
			toggleFavoriteItem,
			updateLocalProfile,
			updateWidget,
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
			is_loading: flagIsLoadingState,
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
