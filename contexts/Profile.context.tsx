/* * */

import type { Account } from '@/types/account.types';
import type { ProfileImage } from '@/types/profileImage.type';

import { Dates } from '@/utils/dates/dates';
import { fetchData } from '@/utils/fetchData';
import { Routes } from '@/utils/routes';
import { Line } from '@carrismetropolitana/api-types/network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ReactNode } from 'react';
import { Platform } from 'react-native';
import uuid from 'react-native-uuid';

/* * */

const LOCAL_STORAGE_KEYS = {
	accent_color: 'profile|accent_color',
	cloud_profile: 'cloud_profile',
	interests: 'profile|interests',
	persona_history: 'profile|persona_history',
	persona_image: 'profile|persona_image',
	profile: 'profile',
	recent_lines: 'profile|recent_lines',
	token: 'token',
};

/* * */

interface ProfileContextState {
	actions: {
		addRecentLines: (line: Line) => void
		checkProfile: (profile: Account) => Promise<void>
		fetchPersona: () => Promise<void>
		setAccentColor: (color: string) => void
		setInterests: (topics: string[]) => void
		setNewEmptyProfile: () => Promise<void>
		setPreviousPersona: () => void
		setSelectedLine: (line: string) => void
		toggleFavoriteItem: (type: 'lines' | 'stops', id: string) => Promise<void>
		updateLocalProfile: (updates: Partial<Account>) => Promise<void>
	}
	counters: {
		favorite_lines: number
		favorite_stops: number
		recent_lines: number
	}
	data: {
		accent_color: string
		cloud_profile: Account | null
		favorite_lines: string[]
		favorite_stops: string[]
		interests: string[]
		persona_image: null | string
		profile: Account | null
		recent_lines: Line[]
		selected_line: Line | string
	}
	flags: {
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
	const [localProfile, setLocalProfile] = useState<Account | null>(null);
	const [accentColor, setAccentColor] = useState<string>('rgba(253,183,26,0.4)');
	const [interests, setInterests] = useState<string[]>([]);
	const [personaImage, setPersonaImage] = useState<null | string>(null);
	const [personaHistory, setPersonaHistory] = useState<string[]>([]);
	const [selectedLine, setSelectedLine] = useState<Line | string>('');
	const [recentLines, setRecentLines] = useState<Line[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const localProfileRef = useRef<Account | null>(null);
	const favoriteLines = localProfile?.favorites?.lines || [];
	const favoriteStops = localProfile?.favorites?.stops || [];

	localProfileRef.current = localProfile;

	useEffect(() => {
		const initialize = async () => {
			setIsLoading(true);
			await loadLocalData();
			setIsLoading(false);
		};
		initialize();
	}, []);

	useEffect(() => {
		localProfileRef.current = localProfile;
	}, [localProfile]);

	useEffect(() => {
		if (!localProfile) return;

		const syncInterval = setInterval(async () => {
			await syncWithCloud(localProfile);
		}, 3000);

		return () => clearInterval(syncInterval);
	}, [localProfile]);

	useEffect(() => {
		if (localProfile) {
			AsyncStorage.setItem(LOCAL_STORAGE_KEYS.profile, JSON.stringify(localProfile));
		}
	}, [localProfile]);

	useEffect(() => {
		AsyncStorage.setItem(LOCAL_STORAGE_KEYS.accent_color, accentColor);
	}, [accentColor]);

	useEffect(() => {
		AsyncStorage.setItem(LOCAL_STORAGE_KEYS.interests, JSON.stringify(interests));
	}, [interests]);

	useEffect(() => {
		if (personaImage) {
			AsyncStorage.setItem(LOCAL_STORAGE_KEYS.persona_image, personaImage);
		}
	}, [personaImage]);

	useEffect(() => {
		AsyncStorage.setItem(LOCAL_STORAGE_KEYS.persona_history, JSON.stringify(personaHistory));
	}, [personaHistory]);

	useEffect(() => {
		AsyncStorage.setItem(LOCAL_STORAGE_KEYS.recent_lines, JSON.stringify(recentLines));
	}, [recentLines]);

	const loadLocalData = async () => {
		try {
			const [storedProfile, storedAccentColor, storedInterests, storedPersonaImage, storedPersonaHistory, storedRecentLines] = await Promise.all([
				AsyncStorage.getItem(LOCAL_STORAGE_KEYS.profile),
				AsyncStorage.getItem(LOCAL_STORAGE_KEYS.accent_color),
				AsyncStorage.getItem(LOCAL_STORAGE_KEYS.interests),
				AsyncStorage.getItem(LOCAL_STORAGE_KEYS.persona_image),
				AsyncStorage.getItem(LOCAL_STORAGE_KEYS.persona_history),
				AsyncStorage.getItem(LOCAL_STORAGE_KEYS.recent_lines),
			]);

			if (storedProfile) {
				setLocalProfile(JSON.parse(storedProfile));
			}
			else {
				await createNewProfile();
			}
			if (storedAccentColor) setAccentColor(storedAccentColor);
			if (storedInterests) setInterests(JSON.parse(storedInterests));
			if (storedPersonaImage) setPersonaImage(storedPersonaImage);
			if (storedPersonaHistory) setPersonaHistory(JSON.parse(storedPersonaHistory));
			if (storedRecentLines) setRecentLines(JSON.parse(storedRecentLines));
		}
		catch (error) {
			console.error('Error loading local data:', error);
		}
	};

	const createNewProfile = async (): Promise<Account> => {
		const newDeviceId = uuid.v4();
		const newProfile: Account = {
			_id: '',
			devices: [{
				device_id: newDeviceId,
				name: '',
				type: Platform.OS === 'ios' ? 'ios' : 'android',
			}],
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
		setLocalProfile(newProfile);
		AsyncStorage.setItem(LOCAL_STORAGE_KEYS.token, newDeviceId);

		try {
			await fetchData<Account>(`${Routes.API_ACCOUNTS}`, 'POST', newProfile, { Authorization: `Bearer ${newDeviceId}` });
		}
		catch (error) {
			console.error('Error creating profile on cloud:', error);
		}

		return newProfile;
	};

	const syncWithCloud = async (currentProfile: Account) => {
		if (!currentProfile?.devices?.[0]?.device_id) {
			console.warn('No device ID found, skipping cloud sync');
			return;
		}

		try {
			const cloudProfile = await fetchProfileFromCloud();

			if (!cloudProfile) {
				await uploadProfileToCloud(currentProfile);
				return;
			}

			const localUpdated = new Date(currentProfile.updated_at || 0).getTime();
			const cloudUpdated = new Date(cloudProfile.updated_at || 0).getTime();

			if (cloudUpdated > localUpdated) {
				setLocalProfile(cloudProfile);
			}
			else if (localUpdated > cloudUpdated) {
				await uploadProfileToCloud(currentProfile);
			}
			else {
				console.log('✅ Profiles are in sync');
			}
		}
		catch (error) {
			console.error('❌ Error syncing with cloud:', error);
		}
	};

	const fetchProfileFromCloud = async (): Promise<Account | null> => {
		const currentProfile = localProfileRef.current;
		if (!currentProfile?.devices?.[0]?.device_id) {
			console.warn('No device ID for cloud fetch');
			return null;
		}

		try {
			const response = await fetchData(`${Routes.API_ACCOUNTS}`, 'GET', undefined, {
				Authorization: `Bearer ${currentProfile.devices[0].device_id}`,
			});

			if (!response.isOk) {
				console.warn(`Cloud fetch failed: ${response.statusCode} - ${response.error}`);
				return null;
			}

			return response.data as Account;
		}
		catch (error) {
			console.error('Error fetching profile from cloud:', error);
			return null;
		}
	};

	const uploadProfileToCloud = async (profile: Account) => {
		if (!profile?.devices?.[0]?.device_id) {
			console.warn('No device ID for cloud upload');
			return;
		}

		try {
			const response = await fetchData(`${Routes.API_ACCOUNTS}`, 'POST', profile, {
				'Authorization': `Bearer ${profile.devices[0].device_id}`,
				'Content-Type': 'application/json',
			});

			if (!response.isOk) {
				alert(`Cloud upload failed: ${response.statusCode} - ${response.error}`);
			}
		}
		catch (error) {
			console.error('Error uploading profile to cloud:', error);
		}
	};

	const updateLocalProfile = async (updates: Partial<Account>): Promise<void> => {
		if (!localProfile) return;

		const updatedProfile = {
			...localProfile,
			...updates,
			updated_at: Dates.now('utc').unix_timestamp,
		};

		setLocalProfile(updatedProfile);

		if (updates && !('accent_color' in updates) && !('interests' in updates)) {
			await uploadProfileToCloud(updatedProfile);
		}
	};

	const fetchPersona = async () => {
		try {
			const response = await fetchData<ProfileImage>(`${Routes.API_ACCOUNTS}/persona/`, 'GET', undefined, undefined);
			if (!response.isOk) {
				alert(`Error fetching persona: ${response.error} (${response.statusCode})`);
				return;
			}
			const image = response.data;
			if (image && personaHistory.includes(image.url)) {
				await fetchPersona();
				return;
			}
			if (image) {
				setPersonaImage(image.url);
				updateLocalProfile({ profile: { ...localProfile?.profile, profile_image: image.url } });
				registerPersonaFetch(image.url);
			}
			else {
				alert('Failed to save persona to profile.');
			}
		}
		catch (error) {
			alert(`An unexpected error occurred: ${error}`);
		}
	};

	const registerPersonaFetch = (url: string) => {
		const updated = [url, ...personaHistory.filter(item => item !== url)].slice(0, 50);
		setPersonaHistory(updated);
	};

	const setPreviousPersona = () => {
		if (personaHistory.length === 0) return;
		const currentIndex = personaHistory.findIndex(url => url === personaImage);
		const newIndex = currentIndex < personaHistory.length - 1 ? currentIndex + 1 : 0;
		const newUrl = personaHistory[newIndex];
		setPersonaImage(newUrl);
		updateLocalProfile({ profile: { ...localProfile?.profile, profile_image: newUrl } });
	};

	const toggleFavoriteItem = async (type: 'lines' | 'stops', id: string) => {
		if (!localProfile) return;
		try {
			const currentFavorites = localProfile.favorites?.[type] || [];
			const favoriteSet = new Set(currentFavorites);
			if (favoriteSet.has(id)) {
				favoriteSet.delete(id);
			}
			else {
				favoriteSet.add(id);
			}
			updateLocalProfile({ favorites: { lines: type === 'lines' ? Array.from(favoriteSet) : (localProfile.favorites?.lines || []), stops: type === 'stops' ? Array.from(favoriteSet) : (localProfile.favorites?.stops || []) } });
		}
		catch (error) {
			alert(`Error toggling favorite item: ${error}`);
		}
	};

	const addRecentLines = (line: Line) => {
		const filtered = recentLines.filter(l => l.id !== line.id);
		const updated = [line, ...filtered].slice(0, 6);
		setRecentLines(updated);
		AsyncStorage.setItem(LOCAL_STORAGE_KEYS.recent_lines, JSON.stringify(updated));
	};

	const handleSetAccentColor = (color: string) => {
		setAccentColor(color);
		AsyncStorage.setItem(LOCAL_STORAGE_KEYS.accent_color, color);
	};

	const handleSetInterests = (topics: string[]) => {
		setInterests(topics);
		AsyncStorage.setItem(LOCAL_STORAGE_KEYS.interests, JSON.stringify(topics));
	};

	const handleSetSelectedLine = (line: string) => {
		setSelectedLine(line);
	};

	const handleCheckProfile = async (profile: Account): Promise<void> => {
		if (!profile) await createNewProfile();
	};

	const handleCreateNewProfile = async (): Promise<void> => {
		await createNewProfile();
	};

	// Context value
	const contextValue: ProfileContextState = useMemo(() => {
		return {
			actions: {
				addRecentLines,
				checkProfile: handleCheckProfile,
				fetchPersona,
				setAccentColor: handleSetAccentColor,
				setInterests: handleSetInterests,
				setNewEmptyProfile: handleCreateNewProfile,
				setPreviousPersona,
				setSelectedLine: handleSetSelectedLine,
				toggleFavoriteItem,
				updateLocalProfile,
			},
			counters: {
				favorite_lines: favoriteLines.length,
				favorite_stops: favoriteStops.length,
				recent_lines: recentLines.length,
			},
			data: {
				accent_color: accentColor,
				cloud_profile: null,
				favorite_lines: favoriteLines,
				favorite_stops: favoriteStops,
				interests,
				persona_image: personaImage,
				profile: localProfile,
				recent_lines: recentLines,
				selected_line: selectedLine,
			},
			flags: {
				is_loading: isLoading,
			},
		};
	}, [localProfile, accentColor, interests, personaImage, selectedLine, recentLines, isLoading]);

	return (
		<ProfileContext.Provider value={contextValue}>
			{children}
		</ProfileContext.Provider>
	);
};

export default ProfileContextProvider;
