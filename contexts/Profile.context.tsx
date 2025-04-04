import { Account, AccountProfile, AccountWidget, CreateAccountDto } from '@/types/account.types';
import { Routes } from '@/utils/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ReactNode } from 'react';
import useSWR from 'swr';

import { useConsentContext } from './Consent.context';

const LOCAL_STORAGE_KEYS = {
	device_id: 'profile|device_id',
	favorite_lines: 'profile|favorite_lines',
	favorite_stops: 'profile|favorite_stops',
	first_name: 'profile|first_name',
	last_name: 'profile|last_name',
	profile: 'profile',
	user_type: 'profile|user_type',
};

interface ProfileContextState {
	actions: {
		checkProfile: (profile: Account) => Promise<void>
		setNewEmptyProfile: (profile: CreateAccountDto) => Promise<void>
		toggleFavoriteLine: (lineId: string) => Promise<void>
		toggleFavoriteStop: (stopId: string) => Promise<void>
	}
	counters: {
		favorite_lines: number
		favorite_stops: number
	}
	data: {
		favorite_lines: AccountWidget[] | null
		favorite_stops: AccountWidget[] | null
		newAccount: CreateAccountDto | null
		profile: Account | null
	}
	flags: {
		is_enabled: boolean
		is_loading: boolean
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
	const [dataNewProfileState, setDataNewProfileState] = useState<CreateAccountDto | null>(null);
	const [dataProfileState, setDataProfileState] = useState<Account | null>(null);

	const [flagIsLoadingState, setFlagIsLoadingState] = useState<ProfileContextState['flags']['is_loading']>(true);

	// const { data: fecthedSataCloudProfile } = useSWR<Account, Error>(`${Routes.DEV_API_ACCOUNTS}/accounts`, { refreshInterval: 5000 });

	//
	// C. Fetch Data

	useEffect(() => {
		if (!consentContext.data.enabled_functional) {
			setFlagIsLoadingState(false);
			return;
		}

		const fetchData = async () => {
			try {
				setFlagIsLoadingState(true);
				const [
					storedFavoriteLines,
					storedFavoriteStops,
					storedProfile,
				] = await Promise.all([
					localStorage.getItem(LOCAL_STORAGE_KEYS.favorite_lines),
					localStorage.getItem(LOCAL_STORAGE_KEYS.favorite_stops),
					localStorage.getItem(LOCAL_STORAGE_KEYS.profile),
				]);
				setDataFavoriteLinesState(storedFavoriteLines ? JSON.parse(storedFavoriteLines) : []);
				setDataFavoriteStopsState(storedFavoriteStops ? JSON.parse(storedFavoriteStops) : []);
				checkProfile(storedProfile ? JSON.parse(storedProfile) : null);
			}
			catch (error) {
				console.error('Error loading profile data:', error);
			}
			finally {
				setFlagIsLoadingState(false);
			}
		};

		fetchData();
	}, [consentContext.data.enabled_functional]);

	useEffect(() => {
		if (!consentContext.data.enabled_functional) return;

		if (dataFavoriteLinesState) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.favorite_lines, JSON.stringify(dataFavoriteLinesState.map) || '');
		}
		if (dataFavoriteStopsState) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.favorite_stops, JSON.stringify(dataFavoriteStopsState) || '');
		}
		// if (dataFirstNameState) {
		// 	// Assuming dataFirstName is an object with a "first_name" property
		// 	localStorage.setItem(LOCAL_STORAGE_KEYS.first_name, JSON.stringify(dataFirstNameState.first_name) || '');
		// }
		// if (dataLastNameState) {
		// 	localStorage.setItem(LOCAL_STORAGE_KEYS.last_name, JSON.stringify(dataLastNameState.last_name) || '');
		// }
		// if (dataUserTypeState) {
		// 	localStorage.setItem(LOCAL_STORAGE_KEYS.user_type, JSON.stringify(dataUserTypeState.utilization_type) || '');
		// }
	}, [
		dataFavoriteLinesState,
		dataFavoriteStopsState,
		// dataFirstNameState,
		// dataLastNameState,
		// dataUserTypeState,
		consentContext.data.enabled_functional,
	]);

	const getProfileFromCloud = async (id: string) => {
		if (!consentContext.data.enabled_functional) return;

		const response = await fetch(`${Routes.DEV_API_ACCOUNTS}/${id}`);
		const profileData = await response.json();

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		setDataProfileState(profileData);
	};

	// D. Action handlers

	const toggleFavoriteLine = async (pattern_id: string) => {
		if (!consentContext.data.enabled_functional) return;

		const currentFavorites = dataFavoriteLinesState || [];
		const index = currentFavorites.findIndex(
			widget => widget.data && 'pattern_id' in widget.data && widget.data.pattern_id === pattern_id,
		);

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

	const setNewEmptyProfile = async (profile: CreateAccountDto) => {
		if (!consentContext.data.enabled_functional) return;

		const newProfile: CreateAccountDto = {
			devices: profile.devices?.map(device => ({
				device_id: device.device_id,
				name: device.name || null,
				type: device.type,

			})) || [],
			favorites: {
				lines: profile.favorites?.lines || [],
				stops: profile.favorites?.stops || [],
			},
			profile: {
				activity: profile.profile?.activity || undefined,
				date_of_birth: profile.profile?.date_of_birth || null,
				email: profile.profile?.email || null,
				first_name: profile.profile?.first_name || null,
				gender: profile.profile?.gender || undefined,
				last_name: profile.profile?.last_name || null,
				phone: profile.profile?.phone || null,
				utilization_type: profile.profile?.utilization_type || undefined,
				work_setting: profile.profile?.work_setting || undefined,
			},
			widgets: profile.widgets?.map(widget => ({
				data: widget.data?.type === 'stops' ? {
					pattern_ids: widget.data.pattern_ids || [],
					stop_id: widget.data.stop_id,
					type: 'stops' as const,
				} : {
					pattern_id: widget.data?.pattern_id || '',
					type: 'lines' as const,
				},
				settings: {
					display_order: widget.settings?.display_order || null,
					is_open: widget.settings?.is_open || true,
					label: widget.settings?.label || null,
				},
			})) || [],
		};

		setDataNewProfileState(newProfile);
		await localStorage.setItem(LOCAL_STORAGE_KEYS.profile, JSON.stringify(newProfile));
	};

	const checkProfile = async (profile: Account) => {
		if (!profile) {
			await getProfileFromCloud('453');
		}
		else {
			
			setNewEmptyProfile(profile);
		}
	};

	// E. Define context value
	const contextValue: ProfileContextState = {
		actions: {
			checkProfile,
			setNewEmptyProfile,
			toggleFavoriteLine,
			toggleFavoriteStop,
		},
		counters: {
			favorite_lines: dataFavoriteLinesState ? dataFavoriteLinesState.length : 0,
			favorite_stops: dataFavoriteStopsState ? dataFavoriteStopsState.length : 0,
		},
		data: {
			favorite_lines: dataFavoriteLinesState,
			favorite_stops: dataFavoriteStopsState,
			newAccount: dataNewProfileState,
			profile: dataProfileState,
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
};

export default ProfileContextProvider;
