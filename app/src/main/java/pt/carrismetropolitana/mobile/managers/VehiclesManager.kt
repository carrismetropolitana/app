package pt.carrismetropolitana.mobile.managers

import pt.carrismetropolitana.mobile.services.cmapi.CMAPI
import pt.carrismetropolitana.mobile.services.cmapi.Vehicle

class VehiclesManager(fetchIntervalMillis: Long? = 5_000L) : DataManager<Vehicle>(
    apiCall = {
        CMAPI.shared.getVehicles()
    },
    fetchIntervalMillis
)