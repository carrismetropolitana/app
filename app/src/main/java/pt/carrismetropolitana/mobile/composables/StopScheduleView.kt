package pt.carrismetropolitana.mobile.composables

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material3.DatePicker
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Popup
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

data class ScheduleItem(
    val hour: String,
    var minutes: List<String>
)

val staticSchedule = listOf(
    ScheduleItem(hour = "00", minutes = listOf(("15"))),
    ScheduleItem(hour = "01", minutes = listOf("10", "20", "30", "40", "50")),
    ScheduleItem(hour = "02", minutes = listOf("10", "20", "30", "40", "50")),
    ScheduleItem(hour = "03", minutes = listOf("10", "20", "30", "40", "50")),
    ScheduleItem(hour = "04", minutes = listOf("10", "20", "30", "40", "50")),
    ScheduleItem(hour = "05", minutes = listOf("10", "20", "30", "40", "50")),
    ScheduleItem(hour = "06", minutes = listOf("10", "20", "30", "40", "50")),
    ScheduleItem(hour = "12", minutes = listOf("15", "30", "45")),
    ScheduleItem(hour = "17", minutes = listOf(("07"))),
    ScheduleItem(hour = "19", minutes = listOf(("15"))),
    ScheduleItem(hour = "20", minutes = listOf("10", "20", "30", "40", "50")),
    ScheduleItem(hour = "21", minutes = listOf(("15"))),
    ScheduleItem(hour = "22", minutes = listOf("10", "20", "30", "40", "50")),
    ScheduleItem(hour = "23", minutes = listOf(("15")))
)


@OptIn(ExperimentalLayoutApi::class, ExperimentalMaterial3Api::class)
@Composable
fun StopScheduleView(
    scheduleItems: List<ScheduleItem>,
) {
    var showDatePicker by remember { mutableStateOf(false) }
    val datePickerState = rememberDatePickerState()

    val selectedDate = datePickerState.selectedDateMillis?.let {
        convertMillisToDate(it)
    } ?: ""

    Column(
        horizontalAlignment = Alignment.Start,
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = Modifier.fillMaxWidth().padding(12.dp)) {
        Text("Horários", fontWeight = FontWeight.SemiBold, fontSize = 20.sp)

//        OutlinedTextField(
//            value = selectedDate,
//            onValueChange = { },
//            label = { Text("Data do horário") },
//            readOnly = true,
//            trailingIcon = {
//                IconButton(onClick = { showDatePicker = !showDatePicker }) {
//                    Icon(
//                        imageVector = Icons.Default.DateRange,
//                        contentDescription = "Select date"
//                    )
//                }
//            },
//            modifier = Modifier
//                .padding(bottom = 12.dp)
//                .width(200.dp)
//                .height(64.dp)
//        )

        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(0.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            ScheduleItem(isFirst = true, hour = "Hora", minutes = listOf(("Min")))
            scheduleItems.forEachIndexed { index, item ->
                if (index != 0 && scheduleItems[index - 1].hour.toInt() != (item.hour.toInt() - 1)) {
                    Spacer(modifier = Modifier.width(4.dp))
                }
                ScheduleItem(
                    isLast = item == scheduleItems.last(),
                    hour = item.hour,
                    minutes = item.minutes
                )
            }
        }
    }

    if (showDatePicker) {
        Popup(
            onDismissRequest = { showDatePicker = false },
            alignment = Alignment.TopStart
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .offset(y = 64.dp)
                    .shadow(elevation = 4.dp)
                    .background(MaterialTheme.colorScheme.surface)
                    .padding(16.dp)
            ) {
                DatePicker(
                    state = datePickerState,
                    showModeToggle = false
                )
            }
        }
    }
}

@Composable
fun ScheduleItem(isFirst: Boolean = false, isLast: Boolean = false, hour: String, minutes: List<String>) {
    Column{
        Box(
            modifier = Modifier
                .background(
                    color = Color.Black,
                    shape = RoundedCornerShape(
                        topStart = if (isFirst) 16.dp else 0.dp,
                        topEnd = if (isLast) 16.dp else 0.dp,
                        bottomEnd = if (isLast) 16.dp else 0.dp,
                        bottomStart = if (isFirst) 16.dp else 0.dp
                    )
                )
        ){
            Text(hour, color = Color.White, fontWeight = FontWeight.Bold, modifier = Modifier.padding(5.dp))
        }

        for (minute in minutes) {
            Text(minute, color = Color.Black, modifier = Modifier.padding(2.dp))
        }
    }
}

fun convertMillisToDate(millis: Long): String {
    val formatter = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
    return formatter.format(Date(millis))
}

@Preview
@Composable
fun ScheduleItemPreview() {
    StopScheduleView(staticSchedule)
}