import { Account, AccountWidget, CreateAccountDto } from '@/types/account.types';
import { Routes } from '@/utils/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dialog, Text } from '@rneui/themed';
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
	profile: 'profile',
	token: 'token',
	user_type: 'profile|user_type',
};

interface ProfileContextState {
	actions: {
		checkProfile: (profile: Account) => Promise<void>
		setNewEmptyProfile: (profile: CreateAccountDto) => Promise<void>
		toggleFavoriteLine: (lineId: string) => Promise<void>
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
		profile: Account | null
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
	//

	//
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

	const [flagIsLoadingState, setFlagIsLoadingState] = useState<ProfileContextState['flags']['is_loading']>(true);

	//
	// C. Fetch Data

	useEffect(() => {
		if (!consentContext.data.enabled_functional) {
			setFlagIsLoadingState(false);
			return;
		}

		const fetchData = async () => {
			// TOGGLE TO DELETE ACCOUNT
			// localStorage.removeItem(LOCAL_STORAGE_KEYS.profile);
			try {
				setFlagIsLoadingState(true);
				const [
					storedProfile,
				] = await Promise.all([
					localStorage.getItem(LOCAL_STORAGE_KEYS.profile),
				]);

				setDataProfileState(storedProfile ? JSON.parse(storedProfile) : null);
				checkProfile(storedProfile ? JSON.parse(storedProfile) : null);
			}
			catch (error) {
				console.error('Error loading profile data:', error);
			}
			finally {
				setFlagIsLoadingState(false);
			}
		};

		const intervalId = setInterval(() => {
			fetchData();
		}, 10000); // 10 * 60 * 1000 10 minutes

		return () => clearInterval(intervalId);
	}, [consentContext.data.enabled_functional]);

	useEffect(() => {
		if (!consentContext.data.enabled_functional) return;

		if (dataFavoriteLinesState) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.favorite_lines, JSON.stringify(dataFavoriteLinesState.map) || '');
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
	}, [
		dataFavoriteLinesState,
		dataFavoriteStopsState,
		dataApiTokenState,
		dataProfileState,
		consentContext.data.enabled_functional,
	]);

	useEffect(() => {
		fetchProfile();
	}, [dataIdProfileState, dataApiTokenState]);

	const fetchProfile = async () => {
		if (dataIdProfileState) {
			const fetchedProfile = await getProfileFromCloud(dataIdProfileState || '');
			// localStorage.setItem(LOCAL_STORAGE_KEYS.profile, JSON.stringify(fetchedProfile));
			localStorage.setItem(LOCAL_STORAGE_KEYS.cloud_profile, JSON.stringify(fetchedProfile));
			setDataCloudProfileState(fetchedProfile);
			// setDataProfileState(fetchedProfile);
		}
	};

	const getProfileFromCloud = async (id: string) => {
		if (!consentContext.data.enabled_functional) return;
		// console.log('token', dataApiTokenState);

		const response = await fetch(`${Routes.DEV_API_ACCOUNTS}/${id}`, {
			headers: {
				'Content-Type': 'application/json',
				'Cookie': `session_token=${dataApiTokenState}` },
		});

		const profileData = await response.json();

		return profileData;
	};

	const getProfileFromStorage = async () => {
		try {
			const storedProfileString = await localStorage.getItem(LOCAL_STORAGE_KEYS.profile);
			const storedProfile: Account = storedProfileString ? JSON.parse(storedProfileString) : null;

			const fullAccount: Account = {
				_id: storedProfile._id || '',
				created_at: storedProfile.created_at,
				devices: [
					{
						device_id: storedProfile.devices[0].device_id || '',
						name: storedProfile.devices[0].name || '',
						type: Platform.OS === 'ios' ? 'ios' : 'android',
					},
				],
				profile: {
					activity: storedProfile.profile?.activity || undefined,
					date_of_birth: storedProfile.profile?.date_of_birth || undefined,
					email: storedProfile.profile?.email || '',
					first_name: storedProfile.profile?.first_name || '',
					gender: storedProfile.profile?.gender || undefined,
					last_name: storedProfile.profile?.last_name || '',
					phone: storedProfile.profile?.phone || '',
					utilization_type: storedProfile.profile?.utilization_type || undefined,
					work_setting: storedProfile.profile?.work_setting || undefined,
				},
				role: storedProfile.role || 'user',
				updated_at: storedProfile.updated_at,
				widgets: storedProfile.widgets?.map(widget => ({
					data: widget.data?.type === 'stops'
						? {
							pattern_ids: widget.data.pattern_ids || [],
							stop_id: widget.data.stop_id || '',
							type: 'stops' as const,
						}
						: {
							pattern_id: widget.data?.pattern_id || '',
							type: 'lines' as const,
						},
					settings: {
						display_order: widget.settings?.display_order ?? null,
						is_open: widget.settings?.is_open ?? true,
						label: widget.settings?.label ?? null,
					},
				})) || [],
			};

			// emulate the merge logic
			setDataCloudProfileState(fullAccount);
			// const updatedProfile = await fetch(`${Routes.DEV_API_ACCOUNTS}/${storedProfile._id}`, { body: JSON.stringify(fullAccount), headers: { Cookie: `session_token=${dataApiTokenState}` }, method: 'PUT' });

			// const updatedProfileData = await updatedProfile.json();
			// setDataProfileState(data);
			// console.log('Updated profile data:', updatedProfileData);
		}
		catch (error) {
			console.error('Error loading and creating profile data:', error);
		}
	};

	// D. Action handlers

	const toogleAccountSync = () => {
		setDataIsSyncingState(!dataIsSyncingState);
	};

	const toggleFavoriteLine = async (pattern_id: string) => {
		if (!consentContext.data.enabled_functional) return;

		const currentFavorites = dataFavoriteLinesState || [];
		const index = currentFavorites.findIndex(
			widget => widget.data && 'pattern_id' in widget.data && widget.data.pattern_id === pattern_id,
		);
		console.log('Toggling favorite line:', index);
		let updatedFavorites: AccountWidget[];
		if (index !== -1) {
			updatedFavorites = currentFavorites.filter(
				widget => widget.data && 'pattern_id' in widget.data && widget.data.pattern_id !== pattern_id,
			);
		}
		else {
			const newFavoriteLine: AccountWidget = {
				data: { pattern_id, type: 'lines' as const },
				settings: { is_open: true },
			};
			updatedFavorites = [...currentFavorites, newFavoriteLine];
		}
		setDataFavoriteLinesState(updatedFavorites);
	};

	const toggleFavoriteStop = async (stopId: string) => {
		if (!consentContext.data.enabled_functional) return;

		const currentFavorites = dataFavoriteStopsState || [];
		const index = currentFavorites.findIndex(
			widget => widget.data && 'stop_id' in widget.data && widget.data.stop_id === stopId,
		);

		let updatedFavorites: AccountWidget[];
		if (index !== -1) {
			updatedFavorites = currentFavorites.filter(
				widget => widget.data && 'stop_id' in widget.data && widget.data.stop_id !== stopId,
			);
		}
		else {
			const newFavoriteStop: AccountWidget = {
				data: { pattern_ids: [], stop_id: stopId, type: 'stops' as const },
				settings: { is_open: true },
			};
			updatedFavorites = [...currentFavorites, newFavoriteStop];
		}
		setDataFavoriteStopsState(updatedFavorites);
	};

	const setNewEmptyProfile = async () => {
		if (!consentContext.data.enabled_functional) return;

		const newProfileStructure: CreateAccountDto = {
			devices: [
				{
					device_id: '',
					type: Platform.OS === 'ios' ? 'ios' : 'android',
				},
			],
			profile: {
				email: null,
				first_name: null,
				gender: undefined,
				last_name: null,
				phone: null,
				profile_image: null,
				utilization_type: undefined,
				work_setting: undefined,
			},
		};

		const apiResponse = await fetch(`${Routes.DEV_API_ACCOUNTS}`, {
			body: JSON.stringify(newProfileStructure),
			headers: { 'Content-Type': 'application/json' },
			method: 'POST',
		}).then(res => res.json());

		setAPIToken(apiResponse.session_token);
		setDataIdProfileState(apiResponse.device_id);

		localStorage.setItem(LOCAL_STORAGE_KEYS.token, apiResponse.session_token);
	};

	const checkProfile = async (profile: Account) => {
		console.log('Checking if profile exists ⚙️');
		if (profile !== null) {
			console.log('Found Profile!! 🎉');
			await getProfileFromStorage();
		}
		else {
			console.log('Setting and ceating an account 🤖');
			await setNewEmptyProfile();
		}
	};

	// E. Define context value
	const contextValue: ProfileContextState = {
		actions: {
			checkProfile,
			setNewEmptyProfile,
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
			profile: dataProfileState,
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
