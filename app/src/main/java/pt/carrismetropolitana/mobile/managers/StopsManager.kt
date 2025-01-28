package pt.carrismetropolitana.mobile.managers

import pt.carrismetropolitana.mobile.services.cmapi.CMAPI
import pt.carrismetropolitana.mobile.services.cmapi.Stop

class StopsManager(fetchIntervalMillis: Long? = 60_000L * 10) : DataManager<Stop>(
    apiCall = { CMAPI.shared.getStops() },
    fetchIntervalMillis
)