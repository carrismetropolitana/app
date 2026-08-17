/* * */

/* * */

interface WaypointFacilitiesProps {
	stopId: string
}

/* * */

export function WaypointFacilities({ stopId: _stopId }: WaypointFacilitiesProps) {
	// HubStop does not expose legacy facilities data.
	return null;
}
