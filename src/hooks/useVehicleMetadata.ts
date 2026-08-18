/* * */

import { CARRIS_METROPOLITANA_NUMERIC_AGENCY_IDS } from '@/settings/agencies.settings';
import { getServiceUrl } from '@/settings/service-urls';
import { type HubVehicleMetadata } from '@/types/vehicles.types';
import { useCallback, useMemo } from 'react';
import useSWR from 'swr';

/* * */

type HubVehicleMetadataResponse = HubVehicleMetadata[] | { data?: HubVehicleMetadata[] | null };

const VEHICLE_ID_WITH_AGENCY_REGEX = /^\[([^\]]+)\](.+)$/;

function getVehicleMetadataLookupId(vehicleId: string): string {
	const match = vehicleId.match(VEHICLE_ID_WITH_AGENCY_REGEX);
	if (!match) return vehicleId;

	const [, agencyId, vehicleNumber] = match;
	const metadataAgencyId = CARRIS_METROPOLITANA_NUMERIC_AGENCY_IDS[agencyId] ?? agencyId;
	return `${metadataAgencyId}-${vehicleNumber}`;
}

/* * */

export function useVehicleMetadata() {
	const { data: metadataResponse, isLoading } = useSWR<HubVehicleMetadataResponse>(`${getServiceUrl('go_api_url')}/hub/api/v1/realtime/vehicles/metadata`, { refreshInterval: 900_000 });

	const metadata = useMemo(() => {
		if (Array.isArray(metadataResponse)) return metadataResponse;
		return metadataResponse?.data ?? [];
	}, [metadataResponse]);

	const metadataByVehicleId = useMemo(() => {
		return new Map(metadata.map(item => [item.vehicle_id, item]));
	}, [metadata]);

	const getMetadataForVehicleId = useCallback((vehicleId: null | string | undefined): HubVehicleMetadata | undefined => {
		if (!vehicleId) return;
		return metadataByVehicleId.get(getVehicleMetadataLookupId(vehicleId));
	}, [metadataByVehicleId]);

	return {
		actions: {
			getMetadataForVehicleId,
		},
		data: {
			metadata,
			metadataByVehicleId,
		},
		flags: {
			isLoading,
		},
	};
}
