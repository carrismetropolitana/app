package pt.carrismetropolitana.mobile.managers

import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow


abstract class DataManager<T : Any>(
    private val apiCall: suspend () -> List<T>,
    private val fetchIntervalMillis: Long? = null
) {

    private val coroutineScope = CoroutineScope(Dispatchers.Main + SupervisorJob())
    private var fetchJob: Job? = null

    private val _data = MutableStateFlow<List<T>>(emptyList())
    val data: StateFlow<List<T>> get() = _data

    init {
        // Fetch data immediately upon initialization
        coroutineScope.launch {
            fetchData()
        }

        // If periodMillis is provided, start periodic fetching
        if (fetchIntervalMillis != null) {
            startFetching()
        }
    }

    fun startFetching() {
        if (this.fetchIntervalMillis == null) {
            throw IllegalStateException("Periodic fetching is not supported because no interval was provided.")
        }
        fetchJob?.cancel() // Cancel any existing job before starting a new one
        fetchJob = coroutineScope.launch {
            while (isActive) {
                fetchData()
                delay(fetchIntervalMillis)
            }
        }
    }

    fun stopFetching() {
        fetchJob?.cancel()
        fetchJob = null
    }

    private suspend fun fetchData() {
        withContext(Dispatchers.IO) {
            val result = apiCall()
            withContext(Dispatchers.Main) {
                _data.value = result
            }
        }
    }
}