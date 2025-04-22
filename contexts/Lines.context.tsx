/* * */

import type { CachedResource } from '@carrismetropolitana/api-types/common';
import type { Municipality } from '@carrismetropolitana/api-types/locations';
import type { DemandMetricsByLine, ServiceMetrics } from '@carrismetropolitana/api-types/metrics';
import type { Line, Route } from '@carrismetropolitana/api-types/network';

import { Routes } from '@/utils/routes';
import { createContext, useContext, useMemo } from 'react';
import useSWR from 'swr';

/* * */

interface LinesContextState {
	actions: {
		getDemandMetricsByLineId: (lineId: string) => DemandMetricsByLine | undefined
		getLineDataById: (lineId: string) => Line | undefined
		getRouteDataById: (routeId: string) => Route | undefined
		getServiceMetricsByLineId: (lineId: string) => ServiceMetrics[] | undefined
	}
	data: {
		demand_metrics: DemandMetricsByLine[]
		lines: Line[]
		municipalities: Municipality[]
		routes: Route[]
		service_metrics: ServiceMetrics[]
	}
	flags: {
		is_loading: boolean
	}
}

/* * */

const LinesContext = createContext<LinesContextState | undefined>(undefined);
export function useLinesContext() {
	const context = useContext(LinesContext);
	if (!context) {
		throw new Error('useLinesContext must be used within a LinesContextProvider');
	}
	return context;
}

export const LinesContextProvider: React.FC = ({ children }) => {
	//

	//
	// A. Fetch resources
	const { data: allLinesData = [], isLoading: linesLoading } = useSWR<Line[]>(`${Routes.API}/lines`);
	const { data: allRoutesData = [], isLoading: routesLoading } = useSWR<Route[]>(`${Routes.API}/routes`);
	const { data: municipalitiesData = { data: [] }, isLoading: municipalitiesLoading } = useSWR<CachedResource<Municipality[]>>(`${Routes.API}/locations/municipalities`);
	const { data: demandByLineData = [], isLoading: demandLoading } = useSWR<DemandMetricsByLine[]>(`${Routes.API}/metrics/demand/by_line`, { refreshInterval: 300000 });
	const { data: serviceMetricsData = { data: [] }, isLoading: serviceLoading } = useSWR<CachedResource<ServiceMetrics[]>>(`${Routes.API}/metrics/service/all`);

	const is_loading = linesLoading || routesLoading || municipalitiesLoading || demandLoading || serviceLoading;

	// B. Actions
	const getLineDataById = (lineId: string) => allLinesData.find(line => line.id === lineId);

	const getRouteDataById = (routeId: string) => allRoutesData.find(route => route.id === routeId);

	const getDemandMetricsByLineId = (lineId: string) => demandByLineData.find(demand => demand.line_id === lineId);

	const getServiceMetricsByLineId = (lineId: string) => serviceMetricsData.data.filter(metric => metric.line_id === lineId);

	// D. Context value
	const contextValue: LinesContextState = useMemo(() => ({
		actions: {
			getDemandMetricsByLineId,
			getLineDataById,
			getRouteDataById,
			getServiceMetricsByLineId,
		},
		data: {
			demand_metrics: demandByLineData,
			lines: allLinesData,
			municipalities: municipalitiesData.data,
			routes: allRoutesData,
			service_metrics: serviceMetricsData.data,
		},
		flags: { is_loading },
	}), [
		allLinesData,
		allRoutesData,
		municipalitiesData,
		demandByLineData,
		serviceMetricsData,
		is_loading,
	]);

	return <LinesContext.Provider value={contextValue}>{children}</LinesContext.Provider>;
};
