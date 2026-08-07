/* * */

import { useLinesContext } from "@/contexts/Lines.context";
import { useOperationalDateContext } from "@/contexts/OperationalDate.context";
import { HubLine, HubPattern,HubRoute,HubShape,HubWaypoint } from "@tmlmobilidade/go-types-public-info";
import {createContext,PropsWithChildren,useCallback,useContext,useEffect,useMemo, useState } from "react";

/* * */

interface LineDetailContextState {
    actions: {
        selectPatternId: (patternId: string) => void;
        selectTripIds: (tripIds: string[] | undefined) => void;
        selectWaypointId: (stopId?: string, stopSequence?: number) => void;
    };
    data: {
        available_patterns: HubPattern[];
        available_routes: HubRoute[];
        selected_line: HubLine | undefined;
        selected_line_id: string | undefined;
        selected_pattern: HubPattern | undefined;
        selected_pattern_id: string | undefined;
        selected_shape: HubShape | undefined;
        selected_trip_ids: string[] | undefined;
        selected_waypoint: undefined | HubWaypoint;
    };
    flags: {
        loading: boolean;
    };
}

/* * */

const LineDetailContext = createContext<LineDetailContextState | undefined>(undefined);

export const useLineDetailContext = () => {
    const context = useContext(LineDetailContext);
    if (!context) {
        throw new Error("useLineDetailContext must be used within a LineDetailContextProvider");
    }
    return context;
};

/* * */

export const LineDetailContextProvider = ({children,initialPatternId,initialTripIds,lineId}: PropsWithChildren<{initialPatternId?: string, initialTripIds?: string[], lineId: string}>) => {
    //
    //

    // A. Setup variables

    const linesContext = useLinesContext();
    const operationalDateContext = useOperationalDateContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [availablePatternsData, setAvailablePatternsData] = useState<HubPattern[]>([]);
    const [selectedPatternId, setSelectedPatternId] = useState<string | undefined>(initialPatternId);
    const [selectedTripIds, setSelectedTripIds] = useState<string[] | undefined>(initialTripIds);
    const [selectedPatternData, setSelectedPatternData] = useState<HubPattern | undefined>();
    const [selectedWaypointData, setSelectedWaypointData] = useState<undefined | HubWaypoint>();
    const [selectedShapeData, setSelectedShapeData] = useState<HubShape | undefined>();

    //
    // B. Transform data
    
    const selectedLineData = useMemo(() => {
        if (!lineId) return;
        return linesContext.actions.getLineDataById(lineId);
    }, [lineId, linesContext.actions]);
    
    const availableRoutesData = useMemo(() => {
        if (!selectedLineData) return [];
        return (linesContext.data?.routes.filter((route) => selectedLineData.route_ids.includes(route._id)) ?? []);
    }, [linesContext.data?.routes, selectedLineData]);
    
    useEffect(() => {
        (async () => {
            if (!selectedLineData) return;
            if (!operationalDateContext.data.selected_date) return;
            setIsLoading(true);
            const fetchResult: HubPattern[] = [];
            for (const patternId of selectedLineData.pattern_ids) {
                const validPatternData = await linesContext.actions.getValidPatternVersionForOperationalDate(patternId, operationalDateContext.data.selected_date.operational_date_int);
                if (validPatternData) fetchResult.push(validPatternData);
            }
            const sortedResult = fetchResult.sort((a, b) => a._id.toString().localeCompare(b._id.toString()));
            setAvailablePatternsData(sortedResult);
            setIsLoading(false);
        })}, [linesContext.actions, operationalDateContext.data.selected_date, selectedLineData]);
    
    useEffect(() => {
        (async () => {
            try {
                // Skip if no pattern id or no operational date
                if (!selectedPatternId || !operationalDateContext.data.selected_date?.operational_date) return;
                // Get current pattern version for the selected operational date
                const validPatternData = await linesContext.actions.getValidPatternVersionForOperationalDate(selectedPatternId, operationalDateContext.data.selected_date.operational_date_int);
                if (!validPatternData) return;
                setSelectedPatternData(validPatternData);
                // Skip if no shape id
                if (!validPatternData.shape_id) return;
                // Fetch shape data
                const shapeData = await linesContext.actions.getShapeDataById(validPatternData.shape_id);
                setSelectedShapeData(shapeData);
            } catch (err) {
                console.error(err);
            }})}, [ selectedPatternId,operationalDateContext?.data?.selected_date?.operational_date,linesContext.actions]);

    //
    // D. Handle actions

    useEffect(() => {
        // Return early if no patterns are available
        if (!availablePatternsData?.length) return;
        // Keep selected pattern only if still valid for current line/date.
        const isSelectedPatternValid = selectedPatternId && availablePatternsData.some((pattern) => pattern._id === selectedPatternId);
        if (!isSelectedPatternValid) {
            setSelectedPatternId(availablePatternsData[0]._id);
        }}, [availablePatternsData, selectedPatternId]);
        const selectPatternId = (patternId: string) => {setSelectedPatternId(patternId)};
        const selectTripIds = (tripIds: string[] | undefined) => {setSelectedTripIds(tripIds)};
        const selectWaypointId = useCallback(
        (stopId?: string, stopSequence?: number) => {
            // Return early if active waypoint is already selected
            if (selectedWaypointData?.stop_id === stopId && selectedWaypointData?.stop_sequence === stopSequence) return setSelectedWaypointData(undefined);
            // Find the waypoint in the active pattern that matches the stop id and stop sequence
            const foundWaypoint = selectedPatternData?.path.find(
                (waypoint) => waypoint.stop_id === stopId && waypoint.stop_sequence === stopSequence);
            // Update the state
            if (foundWaypoint) setSelectedWaypointData(foundWaypoint);
        },
        [selectedWaypointData, selectedPatternData]);

    //
    // E. Define context value

    const contextValue: LineDetailContextState = useMemo(() => (
        {
            actions: {
                selectPatternId,
                selectTripIds,
                selectWaypointId,
            },
            data: {
                available_patterns: availablePatternsData,
                available_routes: availableRoutesData,
                selected_line: selectedLineData,
                selected_line_id: lineId,
                selected_pattern: selectedPatternData,
                selected_pattern_id: selectedPatternId,
                selected_shape: selectedShapeData,
                selected_trip_ids: selectedTripIds,
                selected_waypoint: selectedWaypointData,
            },
            flags: {
                loading: isLoading,
            },
        }),
        [selectWaypointId,availablePatternsData,availableRoutesData,selectedLineData,lineId,selectedPatternData,selectedPatternId,selectedShapeData,selectedTripIds,selectedWaypointData,isLoading]);

    //
    // F. Render components

    return (
        <LineDetailContext.Provider value={contextValue}> 
        {children} 
        </LineDetailContext.Provider>
        );
    //
};