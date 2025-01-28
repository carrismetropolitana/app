package pt.carrismetropolitana.mobile.composables

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import pt.carrismetropolitana.mobile.services.cmapi.Stop

@Composable
fun PatternPathStopEntry(
    stop: Stop,
    modifier: Modifier = Modifier
) {
    Row {
        Column(
            modifier = modifier
        ) {
            Text(
                text = stop.name,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 12.dp)
            )
            Text(
                text = if (stop.locality == stop.municipalityName) stop.locality else (if (stop.locality == null) stop.municipalityName else "${stop.locality}, ${stop.municipalityName}"),
                fontSize = 14.sp,
                modifier = Modifier.padding(horizontal = 12.dp)
            )
        }
    }
}