package pt.carrismetropolitana.mobile.composables.components.transit.alerts

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LargeTopAppBar
import androidx.compose.material3.MediumTopAppBar
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import pt.carrismetropolitana.mobile.LocalAlertsManager
import pt.carrismetropolitana.mobile.R
import pt.carrismetropolitana.mobile.composables.components.Pill
import pt.carrismetropolitana.mobile.services.cmapi.GtfsRtAlertEntity

enum class AlertsFilterForInformedEntities {
    STOP,
    LINE,
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AlertsView(
    alertEntities: List<GtfsRtAlertEntity>,
    filterFor: AlertsFilterForInformedEntities,
    filterByEntityId: String,
    navController: NavController
) {
    val filteredAlertEntities = filterAlertEntitiesForInformedEntity(alertEntities, filterFor, filterByEntityId)

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        topBar = {
            TopAppBar(
                title = { Text(text = "Alertas") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(imageVector = Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
            )
        }
    ) { paddingValues ->
        if (filteredAlertEntities.isEmpty()) {
            Column(modifier = Modifier.fillMaxSize(), verticalArrangement = Arrangement.Center, horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(imageVector = ImageVector.vectorResource(R.drawable.phosphoricons_check_circle), contentDescription = "Check circle", Modifier.size(64.dp))
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    "Esta ${ if (filterFor == AlertsFilterForInformedEntities.LINE) "linha" else "paragem"} não tem alertas ativos",
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    stringResource(R.string.welcome_screen_boa_viagem),
                    fontSize = 16.sp
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .padding(paddingValues)
                    .padding(horizontal = 12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(filteredAlertEntities) { alertEntity ->
                    AlertItem(alert = alertEntity.alert, modifier = Modifier.padding(paddingValues))
                }
            }
        }
    }
}

fun filterAlertEntitiesForInformedEntity(
    alertEntities: List<GtfsRtAlertEntity>,
    filterFor: AlertsFilterForInformedEntities,
    filterByEntityId: String
): List<GtfsRtAlertEntity> {
    return alertEntities.filter {
        when (filterFor) {
            AlertsFilterForInformedEntities.STOP -> it.alert.informedEntity.any { entity -> entity.stopId == filterByEntityId }
            AlertsFilterForInformedEntities.LINE -> it.alert.informedEntity.any { entity -> entity.routeId?.startsWith(filterByEntityId)
                ?: false }
        }
    }
}