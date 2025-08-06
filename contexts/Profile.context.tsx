/* eslint-disable @typescript-eslint/no-explicit-any */
/* * */

import type { ProfileImage } from '@/types/profileImage.type';

import { Account, AccountWidget, CreateAccountDto } from '@/types/account.types';
import { fetchData } from '@/utils/fetchData';
import { Routes } from '@/utils/routes';
import { Line } from '@carrismetropolitana/api-types/network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messagingLib from '@react-native-firebase/messaging';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
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
	interests: 'profile|interests',
	persona_history: 'profile|persona_history',
	persona_image: 'profile|persona_image',
	profile: 'profile',
	profile_exists: 'profile|exists',
	token: 'token',
};

/* * */

type WidgetCreateParams =
  | { end_time: number, pattern_id: string, radius: number, start_time: number, stop_id: string, type: 'smart_notifications', week_days: ('friday' | 'monday' | 'saturday' | 'sunday' | 'thursday' | 'tuesday' | 'wednesday')[] }
  | { pattern_ids: string[], stopId: string, type: 'stops' }
  | { pattern_ids: string[], type: 'lines' };

interface ProfileContextState {
	actions: {
		checkProfile: (profile: Account) => Promise<void>
		createWidget: (params: WidgetCreateParams) => Promise<void>
		deleteWidgetByDisplayOrder: (display_order: number) => Promise<void>
		fetchPersona: () => Promise<void>
		setAccentColor: (color: string) => void
		setInterests: (topics: string[]) => void
		setNewEmptyProfile: (profile: CreateAccountDto) => Promise<void>
		setPreviousPersona: () => void
		setSelectedLine: (line: string) => void
		toggleFavoriteItem: (type: 'lines' | 'stops', id: string) => Promise<void>
		updateLocalProfile: (profile: Account) => Promise<void>
		updateWidget: (id: string, newWidgetData: AccountWidget) => Promise<void>
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
		favorite_lines: string[]
		favorite_stops: string[]
		interests: string[]
		persona_image: null | string
		profile: Account | null
		selected_line: Line | string
		widget_lines: AccountWidget[]
		widget_smart_notifications: AccountWidget[]
		widget_stops: AccountWidget[]
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

	const [personaHistory, setPersonaHistory] = useState<string[]>([]);
	const [dataProfileState, setDataProfileState] = useState<Account | null>(null);
	const [dataCloudProfileState] = useState<Account | null>(null);
	const [dataApiTokenState, setAPIToken] = useState<null | string>(null);
	const [dataPersonaImageState, setDataPersonaImageState] = useState<null | string>(null);
	const [dataSelectedLineState, setSelectedLineState] = useState<Line | string>('');
	const [dataAccentColorState, setDataAccentColorState] = useState<null | string>(null);
	const [dataInterestsState, setDataInterestsState] = useState<string[]>([]);
	const [flagIsLoadingState, setFlagIsLoadingState] = useState<ProfileContextState['flags']['is_loading']>(true);

	const dataFavoriteLinesState = useMemo(() => dataProfileState?.favorites?.lines || [], [dataProfileState]);
	const dataFavoriteStopsState = useMemo(() => dataProfileState?.favorites?.stops || [], [dataProfileState]);
	const dataWidgetLinesState = useMemo(() => dataProfileState?.widgets?.filter(w => w.data?.type === 'lines') || [], [dataProfileState]);
	const dataWidgetStopsState = useMemo(() => dataProfileState?.widgets?.filter(w => w.data?.type === 'stops') || [], [dataProfileState]);
	const dataWidgetSmartNotificationsState = useMemo(() => dataProfileState?.widgets?.filter(w => w.data?.type === 'smart_notifications') || [], [dataProfileState]);

	//
	// C. Fetch Data

	useEffect(() => {
		if (!consentContext.data.enabled_functional) {
			setFlagIsLoadingState(false);
			return;
		}

		const initialize = async () => {
			setFlagIsLoadingState(true);
			await setData();
			await subscribeToAllWidgetTopics();
			setFlagIsLoadingState(false);
		};

		initialize();

		const intervalId = setInterval(setData, 10000);

		return () => clearInterval(intervalId);
	}, [consentContext.data.enabled_functional]);

	useEffect(() => {
		if (dataProfileState) {
			syncProfiles(dataProfileState);
		}
	}, [dataProfileState]);

	// Sync profiles when the profile data changes
	useEffect(() => {
		if (!consentContext.data.enabled_functional) return;

		if (dataProfileState) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.profile, JSON.stringify(dataProfileState));
		}
		if (dataApiTokenState) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.token, dataApiTokenState);
		}
		if (dataPersonaImageState) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.persona_image, dataPersonaImageState);
		}
		if (dataAccentColorState) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.accent_color, dataAccentColorState);
		}
		if (dataInterestsState) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.interests, JSON.stringify(dataInterestsState));
		}
	}, [dataProfileState, dataApiTokenState, dataPersonaImageState, dataAccentColorState, dataInterestsState, consentContext.data.enabled_functional]);

	// Merge local and cloud profiles
	const mergeProfiles = (local: Account, cloud: Account): Account => {
		const localUpdated = new Date(local.updated_at || 0).getTime();
		const cloudUpdated = new Date(cloud.updated_at || 0).getTime();
		const master = localUpdated >= cloudUpdated ? local : cloud;
		const secondary = master === local ? cloud : local;

		return {
			_id: master._id || secondary._id,
			created_at: master.created_at || secondary.created_at,
			devices: master.devices && master.devices.length > 0 ? master.devices : secondary.devices || [],
			favorites: {
				lines: master.favorites?.lines || secondary.favorites?.lines || [],
				stops: master.favorites?.stops || secondary.favorites?.stops || [],
			},
			profile: {
				activity: master.profile?.activity || secondary.profile?.activity,
				date_of_birth: master.profile?.date_of_birth || secondary.profile?.date_of_birth,
				email: master.profile?.email || secondary.profile?.email,
				first_name: master.profile?.first_name || secondary.profile?.first_name,
				gender: master.profile?.gender || secondary.profile?.gender,
				last_name: master.profile?.last_name || secondary.profile?.last_name,
				phone: master.profile?.phone || secondary.profile?.phone,
				profile_image: master.profile?.profile_image || secondary.profile?.profile_image,
				utilization_type: master.profile?.utilization_type || secondary.profile?.utilization_type,
			},
			role: master.role || secondary.role,
			updated_at: master.updated_at || secondary.updated_at,
			widgets: master.widgets && master.widgets.length > 0 ? master.widgets : secondary.widgets,
		};
	};

	// Synchronize profiles between local and cloud
	const syncProfiles = async (localProfile: Account) => {
		try {
			const cloudProfile = await getProfileFromCloud();
			if (!cloudProfile || !localProfile) return;

			const mergedProfile: Account = mergeProfiles(localProfile as Account, cloudProfile as Account);
			if (JSON.stringify(localProfile) !== JSON.stringify(mergedProfile)) {
				setDataProfileState(mergedProfile);
				updateProfileOnCloud(mergedProfile);
			}
		}
		catch (error) {
			alert('Failed to synchronize profiles. Please try again later.');
			console.error('Error synchronizing profiles:', error);
		}
	};

	const setData = async () => {
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

			if (storedToken) setAPIToken(storedToken);
			if (storedAccentColor) setDataAccentColorState(storedAccentColor);
			if (storedPersona) setDataPersonaImageState(storedPersona);
			if (storedInterests) setDataInterestsState(JSON.parse(storedInterests));
			if (storedHistory) setPersonaHistory(JSON.parse(storedHistory));

			const localProfile = storedProfile ? JSON.parse(storedProfile) : null;
			setDataProfileState(localProfile);

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
			const response = await fetchData<ProfileImage>(`${Routes.API_ACCOUNTS}/persona/`, 'GET', undefined, undefined);

			if (!response.isOk) {
				console.error('Error fetching persona:', response.error, response.statusCode);
				alert('We are experiencing some issues. Please try again later.');
				return;
			}

			image = response.data;
			if (image && personaHistory.includes(image.url)) {
				console.log('Image already exists in history, refetching...');
				await fetchPersona();
				return;
			}

			if (image) {
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
				alert('Failed to save persona to profile.');
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
		if (!consentContext.data.enabled_functional && !dataProfileState?.devices[0].device_id) return;
		const response = await fetchData(`${Routes.API_ACCOUNTS}`, 'GET', undefined, { Authorization: `Bearer ${dataProfileState?.devices[0].device_id}` });

		if (!response.isOk) {
			alert('Failed to fetch profile from cloud. Please try again later.');
			console.error('Failed to fetch profile from cloud:', response);
			return null;
		}
		return response.data;
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
			setDataProfileState(updatedProfile);
			updateProfileOnCloud(updatedProfile);
		}
	};
	// Update profile on cloud
	const updateProfileOnCloud = async (profile: Account) => {
		if (!consentContext.data.enabled_functional || !dataProfileState?.devices[0].device_id) return;
		const { _id, created_at, role, updated_at, ...cleanedProfile } = profile;

		try {
			await fetchData(
				`${Routes.API_ACCOUNTS}`,
				'POST',
				profile,
				{
					'Authorization': `Bearer ${dataProfileState?.devices[0].device_id}`,
					'Content-Type': 'application/json',
				},
			);
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
		if (!consentContext.data.enabled_functional || !dataProfileState) return;

		try {
			const currentFavorites = dataProfileState.favorites?.[type] || [];
			const favoriteSet = new Set(currentFavorites);

			if (favoriteSet.has(id)) {
				favoriteSet.delete(id);
			}
			else {
				favoriteSet.add(id);
			}

			const updatedFavorites = Array.from(favoriteSet);

			const updatedProfile: Account = {
				...dataProfileState,
				favorites: {
					...dataProfileState.favorites,
					lines: type === 'lines' ? updatedFavorites : dataProfileState.favorites?.lines || [],
					stops: type === 'stops' ? updatedFavorites : dataProfileState.favorites?.stops || [],
				},
			};

			setDataProfileState(updatedProfile);
			await updateProfileOnCloud(updatedProfile);
		}
		catch (error) {
			console.error('Error toggling favorite item:', error);
			alert('An error occurred while updating favorites. Please try again.');
		}
	};
	// Unified widget toggle function
	const createWidget = async (params: WidgetCreateParams) => {
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
					await updateProfileOnCloud(updatedProfile);
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
					await updateProfileOnCloud(updatedProfile);
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
				const defaultWeekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
				const validWeekDays = (Array.isArray(params.week_days) && params.week_days.length > 0 ? params.week_days : defaultWeekDays) as any;
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
				const mergedWidgets = [...otherWidgets, ...updatedSmartWidgets];
				const updatedProfile: Account = {
					...(dataProfileState as Account || {}),
					widgets: mergedWidgets,
				};
				try {
					await updateProfileOnCloud(updatedProfile);
					setDataProfileState(updatedProfile);
					await messagingLib().subscribeToTopic(id);
				}
				catch (error) {
					console.error('Error updating smart notification widgets:', error);
					alert('An error occurred while updating smart notification widgets. Please try again.');
				}
			}
		}
		catch (error) {
			console.error('Error toggling widget:', error);
			alert('An error occurred while updating widgets. Please try again.');
		}
	};
	// Delete any widget by display order
	const deleteWidgetByDisplayOrder = async (displayOrder: number) => {
		if (!consentContext.data.enabled_functional || !dataProfileState) return;

		const removedWidget = dataProfileState.widgets?.find(
			widget => widget.settings?.display_order === displayOrder,
		);

		if (removedWidget?.data?.type === 'smart_notifications') {
			notificationContext.actions.unsubscribeFromTopic(removedWidget.data.id);
		}

		const newList = (dataProfileState.widgets || []).filter(
			widget => widget.settings?.display_order !== displayOrder,
		);

		const orderedWidgets = newList.map((widget, idx) => ({
			...widget,
			settings: { ...widget.settings, display_order: idx },
		}));

		const updatedProfile: Account = {
			...dataProfileState,
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

		const apiResponse = await fetchData<Account>(`${Routes.API_ACCOUNTS}`, 'POST', newProfileStructure, { Authorization: `Bearer ${dataProfileState?.devices[0].device_id}` });

		newProfileStructure.devices[0].device_id = apiResponse.data?.devices[0].device_id || '';
		setDataProfileState(newProfileStructure);
		setAPIToken(apiResponse.data?.devices[0].device_id || '');
		localStorage.setItem(LOCAL_STORAGE_KEYS.token, apiResponse.data?.devices[0].device_id || '');
	};
	// Initial Check for profile existence
	const checkProfile = async (profile: Account | null) => {
		console.log('Checking if profile exists ⚙️');
		if (!profile && !localStorage.getItem(LOCAL_STORAGE_KEYS.profile_exists)) {
			console.log('No profile found, creating new account 🤖');
			await setNewEmptyProfile();
			await localStorage.setItem(LOCAL_STORAGE_KEYS.profile_exists, 'true');
		}
		else { console.log('Profile exists.'); }
	};

	// Update Widget by ID
	const updateWidget = async (id: string, newWidgetData: AccountWidget) => {
		if (!consentContext.data.enabled_functional) return;
		const currentProfile = dataProfileState;
		if (!currentProfile) return;
		const updatedWidgets = (currentProfile.widgets || []).map((existingWidget) => {
			// Update smart_notifications by id
			if (existingWidget.data?.type === 'smart_notifications' && existingWidget.data.id === id) {
				return {
					...existingWidget,
					data: {
						...existingWidget.data,
						...newWidgetData.data,
					},
					settings: {
						...existingWidget.settings,
						...newWidgetData.settings,
					},
				};
			}
			// Update lines by pattern_id
			if (existingWidget.data?.type === 'lines' && existingWidget.settings.display_order?.toString() === id) {
				return {
					...existingWidget,
					data: {
						...existingWidget.data,
						...newWidgetData.data,
					},
					settings: {
						...existingWidget.settings,
						...newWidgetData.settings,
					},
				};
			}
			// Update stops by stop_id
			if (existingWidget.data?.type === 'stops' && existingWidget.settings.display_order?.toString() === id) {
				return {
					...existingWidget,
					data: {
						...existingWidget.data,
						...newWidgetData.data,
					},
					settings: {
						...existingWidget.settings,
						...newWidgetData.settings,
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

	const contextValue: ProfileContextState = useMemo(() => ({
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
			favorite_lines: dataFavoriteLinesState.length,
			favorite_stops: dataFavoriteStopsState.length,
			widget_lines: dataWidgetLinesState.length,
			widget_stops: dataWidgetStopsState.length,
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
	}), [
		dataProfileState,
		dataAccentColorState,
		dataCloudProfileState,
		dataInterestsState,
		dataPersonaImageState,
		dataSelectedLineState,
		consentContext.data.enabled_functional,
		flagIsLoadingState,
	]);

	return (
		<ProfileContext.Provider value={contextValue}>
			{children}
		</ProfileContext.Provider>
	);

	//
};

export default ProfileContextProvider;
