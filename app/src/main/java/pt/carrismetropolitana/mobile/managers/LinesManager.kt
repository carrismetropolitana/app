package pt.carrismetropolitana.mobile.managers

import pt.carrismetropolitana.mobile.services.cmapi.CMAPI
import pt.carrismetropolitana.mobile.services.cmapi.Line

class LinesManager(fetchIntervalMillis: Long? = 60_000L * 5) : DataManager<Line>(
    apiCall = { CMAPI.shared.getLines() },
     fetchIntervalMillis
)