package pt.carrismetropolitana.mobile.composables.components.transit.stops

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import pt.carrismetropolitana.mobile.R
import pt.carrismetropolitana.mobile.services.cmapi.Facility
import pt.carrismetropolitana.mobile.services.cmapi.Stop
import pt.carrismetropolitana.mobile.ui.theme.CMSystemBackground100
import pt.carrismetropolitana.mobile.ui.theme.CMSystemBorder100
import pt.carrismetropolitana.mobile.ui.theme.CMYellow


@Composable
fun StopsListItem(
    stop: Stop,
    onStopClick: (stopId: String) -> Unit,
    paddingValues: PaddingValues = PaddingValues(0.dp)
) {
    Box(
        modifier = Modifier
            .height(90.dp)
            .padding(paddingValues)
            .clip(RoundedCornerShape(15.dp))
            .border(1.dp, MaterialTheme.colorScheme.outline, shape = RoundedCornerShape(15.dp))
            .clickable { onStopClick(stop.id) }
    ) {
        Row(
            modifier = Modifier.fillMaxSize(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row {
                Box(
                    modifier = Modifier
                        .padding(16.dp)
                        .size(20.dp)
                        .background(Color.Black, CircleShape)
                ) {
                    Box(
                        modifier = Modifier
                            .size(15.dp)
                            .align(Alignment.Center)
                            .background(CMYellow, CircleShape)
                    )
                }

                Column(
                    verticalArrangement = Arrangement.spacedBy(5.dp)
                ) {
                    Column(
                        verticalArrangement = Arrangement.spacedBy(2.dp)
                    ) {
                        Text(
                            text = stop.name,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.SemiBold,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                        Text(
                            text = if (stop.locality == stop.municipalityName || stop.locality == null)
                                stop.municipalityName
                            else
                                "${stop.locality}, ${stop.municipalityName}",
                            fontSize = 12.sp,
                            color = Color.Gray
                        )
                    }
                    Box(
                        modifier = Modifier
                            .border(2.dp, Color.Gray, shape = RoundedCornerShape(50))
                    ) {
                        Text(
                            text = stop.id,
                            fontFamily = FontFamily.Monospace,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.Gray,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 1.dp)
                        )
                    }
                }
            }

            Icon(
                imageVector = ImageVector.vectorResource(R.drawable.chevron_right),
                contentDescription = "Chevron Right Icon",
                tint = Color.Gray,
                modifier = Modifier.padding(end = 16.dp)
            )
        }
    }
}

@Preview
@Composable
private fun StopsListItemPreview() {
    StopsListItem(
        stop = Stop(
            districtId = "11",
            districtName = "Lisboa",
            facilities = listOf(Facility.School, Facility.Train, Facility.Subway),
            id = "170491",
            lat = "38.768486",
            lines = listOf(
                "1209", "1215", "1220", "1222", "1223", "1225", "1233", "1236", "1520",
                "1521", "1523", "1613", "1622", "1731"
            ),
            locality = "Sintra",
            lon = "-9.300971",
            municipalityId = "1111",
            municipalityName = "Sintra",
            name = "R Elias Garcia (Supermercado)",
            operationalStatus = "ACTIVE",
            parishId = null,
            parishName = null,
            patterns = listOf(
                "1209_0_2", "1209_1_2", "1215_0_3", "1220_0_3", "1222_0_3", "1223_0_1",
                "1223_1_1", "1223_2_1", "1225_0_3", "1233_0_3", "1236_0_2", "1520_0_2",
                "1521_0_2", "1523_0_1", "1613_0_1", "1613_1_1", "1622_0_1", "1731_0_1"
            ),
            regionId = "PT170",
            regionName = "AML",
            routes = listOf(
                "1209_0", "1209_1", "1215_0", "1220_0", "1222_0", "1223_0", "1223_1",
                "1223_2", "1225_0", "1233_0", "1236_0", "1520_0", "1521_0", "1523_0",
                "1613_0", "1613_1", "1622_0", "1731_0"
            ),
            shortName = "a definir",
            ttsName = "Rua Elias Garcia ( Supermercado )",
            wheelchairBoarding = "0",
            stopId = "170491"
        ),
        onStopClick = {}
    )
}