import { Account, AccountWidget, CreateAccountDto } from '@/types/account.types';
import { Routes } from '@/utils/routes';
import { Line } from '@carrismetropolitana/api-types/network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { ReactNode } from 'react';
import { Platform } from 'react-native';

import { useConsentContext } from './Consent.context';

const LOCAL_STORAGE_KEYS = {
	cloud_profile: 'cloud_profile',
	device_id: 'profile|device_id',
	favorite_lines: 'profile|favorite_lines',
	favorite_stops: 'profile|favorite_stops',
	first_name: 'profile|first_name',
	last_name: 'profile|last_name',
	persona_image: 'profile|persona_image',
	profile: 'profile',
	token: 'token',
	user_type: 'profile|user_type',
};

interface ProfileContextState {
	actions: {
		checkProfile: (profile: Account) => Promise<void>
		fetchPersona: () => Promise<void>
		setNewEmptyProfile: (profile: CreateAccountDto) => Promise<void>
		setSelectedLine: (line: string) => void
		toggleFavoriteLine: (lineId: string[]) => Promise<void>
		toggleFavoriteStop: (stopId: string) => Promise<void>
		toogleAccountSync: () => void
	}
	counters: {
		favorite_lines: number
		favorite_stops: number
	}
	data: {
		cloud_profile: Account | null
		favorite_lines: AccountWidget[] | null
		favorite_stops: AccountWidget[] | null
		persona_image: null | string
		profile: Account | null
		selected_line: Line | string
	}
	flags: {
		is_enabled: boolean
		is_existing_profile: boolean
		is_loading: boolean
		is_syncing: boolean
	}
}

const ProfileContext = createContext<ProfileContextState | undefined>(undefined);

export function useProfileContext() {
	const context = useContext(ProfileContext);
	if (!context) {
		throw new Error('useProfileContext must be used within a ProfileContextProvider');
	}
	return context;
}

export const ProfileContextProvider = ({ children }: { children: ReactNode }) => {
	// A. Setup variables
	const consentContext = useConsentContext();
	const localStorage = AsyncStorage;

	const [dataFavoriteLinesState, setDataFavoriteLinesState] = useState<AccountWidget[] | null>(null);
	const [dataFavoriteStopsState, setDataFavoriteStopsState] = useState<AccountWidget[] | null>(null);
	const [dataProfileState, setDataProfileState] = useState<Account | null>(null);
	const [dataCloudProfileState, setDataCloudProfileState] = useState<Account | null>(null);
	const [dataIdProfileState, setDataIdProfileState] = useState<'' | string>('');
	const [dataApiTokenState, setAPIToken] = useState<null | string>(null);
	const [dataIsSyncingState, setDataIsSyncingState] = useState(false);
	const [dataPersonaImageState, setDataPersonaImageState] = useState<null | string>(null);
	const [dataSelectedLineState, setSelectedLineState] = useState<Line | string>('');

	const [flagIsLoadingState, setFlagIsLoadingState] = useState<ProfileContextState['flags']['is_loading']>(true);

	// C. Fetch Data

	const mergeProfiles = (local: Account, cloud: Account): Account => {
		return {
			_id: local._id,
			created_at: local.created_at ?? cloud.created_at,
			devices: local.devices,
			email: local.email ?? cloud.email,
			email_verified: local.email_verified ?? cloud.email_verified,
			favorites: cloud.favorites ? cloud.favorites : local.favorites,
			profile: {
				...local.profile,
				...cloud.profile,
			},
			role: local.role ?? 'user',
			updated_at: cloud.updated_at ?? local.updated_at,
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
				await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.profile, JSON.stringify(mergedProfile));
				console.log('Profiles synchronized.');
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
			const [storedProfile, storedPersona, storedToken] = await Promise.all([
				localStorage.getItem(LOCAL_STORAGE_KEYS.profile),
				localStorage.getItem(LOCAL_STORAGE_KEYS.persona_image),
				localStorage.getItem(LOCAL_STORAGE_KEYS.token),
			]);

			setAPIToken(storedToken);
			setDataPersonaImageState(storedPersona);
			const localProfile = storedProfile ? JSON.parse(storedProfile) : null;
			setDataProfileState(localProfile);

			if (localProfile) {
				await syncProfiles(localProfile);
			}
			else {
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
		if (!consentContext.data.enabled_functional) return;
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
	}, [
		dataFavoriteLinesState,
		dataFavoriteStopsState,
		dataApiTokenState,
		dataProfileState,
		dataPersonaImageState,
		consentContext.data.enabled_functional,
	]);

	const fetchPersona = async () => {
		try {
			const response = await fetch(`${Routes.DEV_API_ACCOUNTS}/persona/`);
			const image = await response.json();
			if (image.url) {
				setDataPersonaImageState(image.url);
			}
			else {
				console.error('Error: No URL property in response', image);
			}
		}
		catch (error) {
			console.error('Error in fetchPersona:', error);
		}
	};

	const getProfileFromCloud = async (id: string) => {
		if (!consentContext.data.enabled_functional) return;
		const response = await fetch(`${Routes.DEV_API_ACCOUNTS}/${id}`, {
			headers: {
				'Content-Type': 'application/json',
				'Cookie': `session_token=${dataApiTokenState}`,
			},
		});
		const profileData = await response.json();
		return profileData;
	};

	const updateProfileOnCloud = async (profile: Account) => {
		if (!consentContext.data.enabled_functional || !dataApiTokenState) return;
		const { _id, created_at, role, updated_at, ...cleanedProfile } = profile;
		const response = await fetch(`${Routes.DEV_API_ACCOUNTS}/${profile.devices[0].device_id}`, {
			body: JSON.stringify(cleanedProfile),
			headers: {
				'Content-Type': 'application/json',
				'Cookie': `session_token=${dataApiTokenState}`,
			},
			method: 'PUT',
		});
		const updatedProfile = await response.json();
		console.log('Profile updated successfully:', updatedProfile);
	};

	// D. Action handlers

	const toogleAccountSync = () => {
		setDataIsSyncingState(!dataIsSyncingState);
	};

	const toggleFavoriteLine = async (pattern_ids: string[]) => {
		if (!consentContext.data.enabled_functional) return;
		const currentWidgets = dataFavoriteLinesState || [];
		const updatedWidgets = [...currentWidgets];
		pattern_ids.forEach((pattern_id) => {
			const index = updatedWidgets.findIndex(
				widget => widget.data && widget.data.type === 'lines' && widget.data.pattern_id === pattern_id,
			);
			if (index !== -1) {
				updatedWidgets.splice(index, 1);
			}
			else {
				const newFavoriteLine: AccountWidget = {
					data: { pattern_id, type: 'lines' as const },
					settings: { is_open: true },
				};
				updatedWidgets.push(newFavoriteLine);
			}
		});
		setDataFavoriteLinesState(updatedWidgets);
		const updatedProfile: Account = {
			...(dataProfileState || {}),
			widgets: [
				...(dataFavoriteStopsState || []),
				...updatedWidgets,
			],
		};
		setDataProfileState(updatedProfile);
		localStorage.setItem(LOCAL_STORAGE_KEYS.profile, JSON.stringify(updatedProfile) || '');
	};

	const toggleFavoriteStop = async (stopId: string) => {
		if (!consentContext.data.enabled_functional) return;
		const currentWidgets = dataFavoriteStopsState || [];
		const updatedWidgets = [...currentWidgets];
		const index = updatedWidgets.findIndex(
			widget => widget.data && widget.data.type === 'stops' && widget.data.stop_id === stopId,
		);
		if (index !== -1) {
			updatedWidgets.splice(index, 1);
		}
		else {
			const newFavoriteStop: AccountWidget = {
				data: { pattern_ids: [], stop_id: stopId, type: 'stops' as const },
				settings: { display_order: 0, is_open: true, label: null },
			};
			updatedWidgets.push(newFavoriteStop);
		}
		setDataFavoriteStopsState(updatedWidgets);
		const updatedProfile: Account = {
			...(dataProfileState || {}),
			widgets: [
				...(dataFavoriteLinesState || []),
				...updatedWidgets,
			],
		};
		setDataProfileState(updatedProfile);
		localStorage.setItem(LOCAL_STORAGE_KEYS.profile, JSON.stringify(updatedProfile) || '');
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
		setDataIdProfileState(apiResponse.device_id);
		localStorage.setItem(LOCAL_STORAGE_KEYS.token, apiResponse.session_token);
	};

	const setSelectedLine = (line: string) => {
		if (!consentContext.data.enabled_functional) return;
		setSelectedLineState(line);
	};

	// E. Define context value
	const contextValue: ProfileContextState = {
		actions: {
			checkProfile,
			fetchPersona,
			setNewEmptyProfile,
			setSelectedLine,
			toggleFavoriteLine,
			toggleFavoriteStop,
			toogleAccountSync,
		},
		counters: {
			favorite_lines: dataFavoriteLinesState ? dataFavoriteLinesState.length : 0,
			favorite_stops: dataFavoriteStopsState ? dataFavoriteStopsState.length : 0,
		},
		data: {
			cloud_profile: dataCloudProfileState,
			favorite_lines: dataFavoriteLinesState,
			favorite_stops: dataFavoriteStopsState,
			persona_image: dataPersonaImageState,
			profile: dataProfileState,
			selected_line: dataSelectedLineState,
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
};

export default ProfileContextProvider;
