package pt.carrismetropolitana.mobile.managers

import pt.carrismetropolitana.mobile.services.cmapi.CMAPI
import pt.carrismetropolitana.mobile.services.cmapi.GtfsRtAlertEntity

class AlertsManager(fetchIntervalMillis: Long? = 60_000L) : DataManager<GtfsRtAlertEntity>(
    apiCall = {
        CMAPI.shared.getAlerts()?.entity ?: emptyList()
    },
    fetchIntervalMillis
)