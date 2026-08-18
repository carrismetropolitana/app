'use client';

import { normalizeReferenceId } from '@/utils/alerts';
import { getBaseGeoJsonFeatureCollection } from '@/utils/map.utils';
import { useFilterByAgencyIds, getAgencyIdFromPrefixedId } from '@/hooks/useFilterByAgencyIds';
import { type HubAlert } from '@tmlmobilidade/go-types-public-info';
import { type ApiResponse } from '@tmlmobilidade/types';
import { createContext, type PropsWithChildren, useContext, useMemo } from 'react';
import useSWR from 'swr';
import { getServiceUrl } from '@/settings/service-urls';

/* * */

interface AlertsContextState {
	actions: {
		getAlertById: (alertId: string) => HubAlert | null
		getAlertsByLineId: (lineId: string) => HubAlert[]
		getAlertsByStopId: (stopId: string) => HubAlert[]
	}
	data: {
		alerts: HubAlert[]
		fc: GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
	}
	flags: {
		error: Error | undefined
		isLoading: boolean
	}
}

/* * */

const AlertsContext = createContext<AlertsContextState | undefined>(undefined);

export function useAlertsContext() {
	const context = useContext(AlertsContext);
	if (!context) {
		throw new Error('useAlertsContext must be used within a AlertsContextProvider');
	}
	return context;
}

/* * */

export function AlertsContextProvider({ children }: PropsWithChildren) {
	//

	//
	// A. Fetch data

	const { data: alertsResponse, isLoading: allAlertsLoading } = useSWR<ApiResponse<HubAlert[]>, Error>(`${getServiceUrl('go_api_url')}/hub/api/v1/alerts`, { refreshInterval: 180000 }); // 3 minutes
	const filteredAlertsData = useFilterByAgencyIds(alertsResponse, {
		getAgencyIds: (alertData) => [
			alertData.agency_id,
			...alertData.references.flatMap(reference => [reference.parent_id, ...reference.child_ids].map(getAgencyIdFromPrefixedId)),
		].filter((agencyId): agencyId is string => Boolean(agencyId)),
	}).data ?? [];

	//
	// B. Transform data

	const dataFeatureCollectionState = useMemo(() => {
		const collection = getBaseGeoJsonFeatureCollection();
		filteredAlertsData.forEach((item) => {
			const alertFC = transformAlertDataIntoGeoJsonFeature(item);
			if (alertFC) collection.features.push(alertFC);
		});
		return collection;
	}, [filteredAlertsData]);

	//
	// C. Handle actions

	const getAlertById = (alertId: string): HubAlert | null => {
		return filteredAlertsData.find(item => item._id === alertId) || null;
	};

	const getAlertsByLineId = (lineId: string): HubAlert[] => {
		const normalizedLineId = normalizeReferenceId(lineId);
		return filteredAlertsData.filter((item) => {
			if (item.reference_type === 'lines') return item.references.some(reference => normalizeReferenceId(reference.parent_id) === normalizedLineId);
			if (item.reference_type === 'stops') return item.references.some(reference => reference.child_ids.some(childId => normalizeReferenceId(childId) === normalizedLineId));
			return false;
		});
	};

	const getAlertsByStopId = (stopId: string): HubAlert[] => {
		const normalizedStopId = normalizeReferenceId(stopId);
		return filteredAlertsData.filter((item) => {
			if (item.reference_type === 'stops') return item.references.some(reference => normalizeReferenceId(reference.parent_id) === normalizedStopId);
			if (item.reference_type === 'lines') return item.references.some(reference => reference.child_ids.some(childId => normalizeReferenceId(childId) === normalizedStopId));
			return false;
		});
	};

	//
	// D. Define context value

	const contextValue: AlertsContextState = {
		actions: {
			getAlertById,
			getAlertsByLineId,
			getAlertsByStopId,
		},
		data: {
			alerts: filteredAlertsData,
			fc: dataFeatureCollectionState,
		},
		flags: {
			error: undefined,
			isLoading: allAlertsLoading,
		},
	};

	//
	// E. Render components

	return (
		<AlertsContext.Provider value={contextValue}>
			{children}
		</AlertsContext.Provider>
	);
};

/* * */

export function transformAlertDataIntoGeoJsonFeature(alertData: HubAlert): GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties> | null {
	if (!alertData.coordinates || alertData.coordinates.length !== 2 || !alertData.coordinates.every(Number.isFinite)) return null;

	return {
		geometry: {
			coordinates: [alertData.coordinates[1], alertData.coordinates[0]],
			type: 'Point',
		},
		properties: {
			_id: alertData._id,
			cause: alertData.cause,
			description: alertData.description,
			effect: alertData.effect,
			id: alertData._id,
			title: alertData.title,
		},
		type: 'Feature',
	};
}
