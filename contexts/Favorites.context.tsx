/* * */

import { useAccountContext } from '@/contexts/Account.context';
import { createContext, type PropsWithChildren, useContext, useMemo } from 'react';

/* * */

interface FavoritesContextState {
	actions: {
		addFavoriteLineId: (lineId: string) => void
		addFavoriteStopId: (stopId: string) => void
		removeFavoriteLineId: (lineId: string) => void
		removeFavoriteStopId: (stopId: string) => void
	}
	data: {
		line_ids: string[]
		stop_ids: string[]
	}
}

/* * */

const FavoritesContext = createContext<FavoritesContextState | undefined>(undefined);

export function useFavoritesContext() {
	const context = useContext(FavoritesContext);
	if (!context) {
		throw new Error('useFavoritesContext must be used within a FavoritesContextProvider');
	}
	return context;
}

/* * */

export const FavoritesContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Setup variables

	const accountContext = useAccountContext();

	//
	// B. Transform data

	const favoriteLineIds = useMemo(() => {
		if (!accountContext.data.account?.favorites) return [];
		return accountContext.data.account.favorites.line_ids;
	}, [accountContext.data.account]);

	const favoriteStopIds = useMemo(() => {
		if (!accountContext.data.account?.favorites) return [];
		return accountContext.data.account.favorites.stop_ids;
	}, [accountContext.data.account]);

	//
	// C. Handle actions

	function addFavoriteLineId(lineId: string) {
		const currentLineIds = new Set(favoriteLineIds);
		currentLineIds.add(lineId);
		accountContext.actions.update('favorites.line_ids', Array.from(currentLineIds));
	};

	function removeFavoriteLineId(lineId: string) {
		const currentLineIds = new Set(favoriteLineIds);
		currentLineIds.delete(lineId);
		accountContext.actions.update('favorites.line_ids', Array.from(currentLineIds));
	};

	function addFavoriteStopId(stopId: string) {
		const currentStopIds = new Set(favoriteStopIds);
		currentStopIds.add(stopId);
		accountContext.actions.update('favorites.stop_ids', Array.from(currentStopIds));
	};

	function removeFavoriteStopId(stopId: string) {
		const currentStopIds = new Set(favoriteStopIds);
		currentStopIds.delete(stopId);
		accountContext.actions.update('favorites.stop_ids', Array.from(currentStopIds));
	}

	//
	// D. Context value

	const contextValue: FavoritesContextState = useMemo(() => ({
		actions: {
			addFavoriteLineId,
			addFavoriteStopId,
			removeFavoriteLineId,
			removeFavoriteStopId,
		},
		data: {
			line_ids: favoriteLineIds,
			stop_ids: favoriteStopIds,
		},
	}), [
		favoriteLineIds,
		favoriteStopIds,
	]);

	//
	// E. Render components

	return (
		<FavoritesContext.Provider value={contextValue}>
			{children}
		</FavoritesContext.Provider>
	);

	//
};
