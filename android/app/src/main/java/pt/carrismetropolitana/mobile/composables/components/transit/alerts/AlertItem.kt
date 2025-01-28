package pt.carrismetropolitana.mobile.composables.components.transit.alerts

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import pt.carrismetropolitana.mobile.R
import pt.carrismetropolitana.mobile.services.cmapi.GtfsRtAlertEntity
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun AlertItem(
    alert: GtfsRtAlertEntity.GtfsRtAlert,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth(),
//            .clip(RoundedCornerShape(20.dp)),
        border = BorderStroke(5.dp, Color.Black),
        shape = RoundedCornerShape(20.dp)
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        color = Color.Black,
                        shape = RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp)
                    )
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = ImageVector.vectorResource(id = getIconResourceForAlertEffect(alert.effect)),
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(28.dp)
                )
                Spacer(modifier = Modifier.width(16.dp))
                Text(
                    text = getTextForAlertEffect(alert.effect),
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }

            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = alert.headerText.translation[0].text,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(text = alert.descriptionText.translation[0].text)

                Spacer(modifier = Modifier.height(16.dp))

                if (alert.image.localizedImage[0].url.isNotEmpty()) {
                    AsyncImage(
                        model = alert.image.localizedImage[0].url,
                        contentDescription = null,
                        modifier = Modifier
                            .size(128.dp, 80.dp)
                            .align(Alignment.Start),
                        contentScale = ContentScale.Fit
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "Publicado a ${getFormattedDateFromUnixTimestamp(alert.activePeriod[0].start.toLong())}".uppercase(),
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.secondary
                )
            }
        }
    }
}

@Composable
fun getIconResourceForAlertEffect(alertEffect: GtfsRtAlertEntity.GtfsRtAlert.Effect): Int {
    return when (alertEffect) {
        GtfsRtAlertEntity.GtfsRtAlert.Effect.NO_SERVICE -> R.drawable.phosphoricons_x_circle
        GtfsRtAlertEntity.GtfsRtAlert.Effect.REDUCED_SERVICE -> R.drawable.phosphoricons_minus_circle
        GtfsRtAlertEntity.GtfsRtAlert.Effect.SIGNIFICANT_DELAYS -> R.drawable.tablericons_clock_x
        GtfsRtAlertEntity.GtfsRtAlert.Effect.DETOUR -> R.drawable.tablericons_arrows_transfer_up
        GtfsRtAlertEntity.GtfsRtAlert.Effect.ADDITIONAL_SERVICE -> R.drawable.phosphoricons_plus_circle
        GtfsRtAlertEntity.GtfsRtAlert.Effect.MODIFIED_SERVICE -> R.drawable.phosphoricons_arrows_left_right
        GtfsRtAlertEntity.GtfsRtAlert.Effect.OTHER_EFFECT -> R.drawable.phosphoricons_warning
        GtfsRtAlertEntity.GtfsRtAlert.Effect.UNKNOWN_EFFECT -> R.drawable.phosphoricons_question
        GtfsRtAlertEntity.GtfsRtAlert.Effect.STOP_MOVED -> R.drawable.phosphoricons_arrows_split
        GtfsRtAlertEntity.GtfsRtAlert.Effect.NO_EFFECT -> R.drawable.phosphoricons_check_circle
        GtfsRtAlertEntity.GtfsRtAlert.Effect.ACCESSIBILITY_ISSUE -> R.drawable.phoshporicons_wheelchair
    }
}

fun getTextForAlertEffect(alertEffect: GtfsRtAlertEntity.GtfsRtAlert.Effect): String {
    return when (alertEffect) {
        GtfsRtAlertEntity.GtfsRtAlert.Effect.NO_SERVICE -> "Serviço Impedido"
        GtfsRtAlertEntity.GtfsRtAlert.Effect.REDUCED_SERVICE -> "Serviço Reduzido"
        GtfsRtAlertEntity.GtfsRtAlert.Effect.SIGNIFICANT_DELAYS -> "Atrasos Significativos"
        GtfsRtAlertEntity.GtfsRtAlert.Effect.DETOUR -> "Desvio"
        GtfsRtAlertEntity.GtfsRtAlert.Effect.ADDITIONAL_SERVICE -> "Aumento de Serviço"
        GtfsRtAlertEntity.GtfsRtAlert.Effect.MODIFIED_SERVICE -> "Alteração de Serviço"
        GtfsRtAlertEntity.GtfsRtAlert.Effect.OTHER_EFFECT -> "Outros"
        GtfsRtAlertEntity.GtfsRtAlert.Effect.UNKNOWN_EFFECT -> "Desconhecido"
        GtfsRtAlertEntity.GtfsRtAlert.Effect.STOP_MOVED -> "Mudança de Paragem"
        GtfsRtAlertEntity.GtfsRtAlert.Effect.NO_EFFECT -> "Serviço Normal"
        GtfsRtAlertEntity.GtfsRtAlert.Effect.ACCESSIBILITY_ISSUE -> "Problema de Acessibilidade"
    }
}

fun getFormattedDateFromUnixTimestamp(timestamp: Long): String {
    val date = Date(timestamp * 1000)
    val dateFormatter = SimpleDateFormat("dd-MM-yyyy", Locale.getDefault())
    return dateFormatter.format(date)
}

val previewAlert = GtfsRtAlertEntity(
    id = "1",
    alert = GtfsRtAlertEntity.GtfsRtAlert(
        activePeriod = listOf(
            GtfsRtAlertEntity.GtfsRtAlert.ActivePeriod(
                start = 1725840000,
                end = 1726358400
            )
        ),
        informedEntity = listOf(
            GtfsRtAlertEntity.GtfsRtAlert.EntitySelector(
                routeId = "1242_0"
            )
        ),
        cause = GtfsRtAlertEntity.GtfsRtAlert.Cause.UNKNOWN_CAUSE,
        effect = GtfsRtAlertEntity.GtfsRtAlert.Effect.MODIFIED_SERVICE,
        url = GtfsRtAlertEntity.GtfsRtAlert.TranslatedString(
            translation = listOf(
                GtfsRtAlertEntity.GtfsRtAlert.TranslatedString.Translation(
                    language = "pt",
                    text = "https://www.carrismetropolitana.pt/alert/21109/"
                )
            )
        ),
        headerText = GtfsRtAlertEntity.GtfsRtAlert.TranslatedString(
            translation = listOf(
                GtfsRtAlertEntity.GtfsRtAlert.TranslatedString.Translation(
                    text = "Sintra | 1242: Ajuste de horários",
                    language = "pt"
                )
            )
        ),
        descriptionText = GtfsRtAlertEntity.GtfsRtAlert.TranslatedString(
            translation = listOf(
                GtfsRtAlertEntity.GtfsRtAlert.TranslatedString.Translation(
                    text = "A partir do dia 9 de setembro, a linha 1242 | Casais Cabrela (Largo) - Almoçageme (Mercado) terá ajuste no seu horário. No sentido Almoçageme, o horário das 12:45 passará a ser efetuado às 12:55.",
                    language = "pt"
                )
            )
        ),
        image = GtfsRtAlertEntity.GtfsRtAlert.TranslatedImage(
            localizedImage = listOf(
                GtfsRtAlertEntity.GtfsRtAlert.TranslatedImage.LocalizedImage(
                    language = "pt",
                    mediaType = "image/png",
                    url = "https://www.carrismetropolitana.pt/wp-content/uploads/2024/08/Copy-of-GTFS-Setembro-4.png"
                )
            )
        )
    )
)

@Preview
@Composable
private fun AlertItemPreview() {
    AlertItem(alert = previewAlert.alert)
}