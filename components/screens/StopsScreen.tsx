import { useStops } from "@/services/api/queries/useStops";
import { StyledMapView } from "../maps/StyledMapView";

export default function StopsScreen() {
	const { data: stops } = useStops({
		needsFocus: true,
	});

	return <StyledMapView />;
}
