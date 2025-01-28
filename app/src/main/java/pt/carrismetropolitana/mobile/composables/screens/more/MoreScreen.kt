package pt.carrismetropolitana.mobile.composables.screens.more

import android.content.Context
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.net.Uri
import androidx.browser.customtabs.CustomTabsIntent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.calculateStartPadding
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.graphics.toColorInt
import androidx.navigation.NavController
import pt.carrismetropolitana.mobile.R
import pt.carrismetropolitana.mobile.Screens
import pt.carrismetropolitana.mobile.composables.BigRoundedButton
import pt.carrismetropolitana.mobile.composables.WrappingCarousel
import pt.carrismetropolitana.mobile.composables.components.news.NewsCarousel
import pt.carrismetropolitana.mobile.services.cmwordpressapi.CMWPAPI
import pt.carrismetropolitana.mobile.services.cmwordpressapi.News
import pt.carrismetropolitana.mobile.ui.theme.CMYellow

//import pt.carrismetropolitana.mobile.composables.dummyItems


@Composable
fun MoreScreen(navController: NavController, paddingValues: PaddingValues, context: Context) {
    var news by remember { mutableStateOf(emptyList<News>()) }

    LaunchedEffect(Unit) {
        news = CMWPAPI.shared.getNews()
    }

    Scaffold { innerPaddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(top = innerPaddingValues.calculateTopPadding())
                .padding(horizontal = innerPaddingValues.calculateStartPadding(layoutDirection = LayoutDirection.Ltr))
                .padding(bottom = paddingValues.calculateBottomPadding())
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.Top,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Novidades",
                fontWeight = FontWeight.SemiBold,
                letterSpacing = 0.sp,
                fontSize = 20.sp,
                modifier = Modifier
                    .align(Alignment.Start)
                    .padding(24.dp),
            )

            NewsCarousel(
                news = news,
                onNewsClick = { news ->
                    navController.navigate("news?url=${news.link}&title=${news.title.rendered}")
                }
            )

            Spacer(modifier = Modifier.height(32.dp))

            Text(
                text = "Informar",
                fontWeight = FontWeight.SemiBold,
                letterSpacing = 0.sp,
                fontSize = 20.sp,
                modifier = Modifier
                    .align(Alignment.Start)
                    .padding(horizontal = 24.dp),
            )

            Column(
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.padding(12.dp)
            ) {
                BigRoundedButton(
                    text = "Espaços navegante®",
                    icon = ImageVector.vectorResource(R.drawable.phosphoricons_house_duotone),
                    iconContentDescription = "Rounded Home Icon",
                    iconTint = Color("#5956d6".toColorInt())
                ) {
                    println("Button pressed")
                    navController.navigate(Screens.ENCM.route)
                }
                BigRoundedButton(
                    text = "Perguntas Frequentes",
                    icon = ImageVector.vectorResource(R.drawable.phosphoricons_question_duotone),
                    iconContentDescription = "Help Icon",
                    iconTint = Color("#ff9500".toColorInt())
                ) {
                    println("Button pressed")
                    navController.navigate(Screens.FAQ.route)
                }
                BigRoundedButton(
                    text = "Apoio ao Cliente",
                    icon = ImageVector.vectorResource(R.drawable.phosphoricons_chat_dots_duotone),
                    iconTint = Color("#007aff".toColorInt()),
                    iconContentDescription = "Support Agent Icon",
                    externalLink = true
                ) {
                    println("Button pressed")
                    CustomTabsIntent.Builder().build()
                        .launchUrl(context, Uri.parse("https://www.carrismetropolitana.pt/apoio/"))
                }
            }

            Text(
                text = "Viajar",
                fontWeight = FontWeight.SemiBold,
                letterSpacing = 0.sp,
                fontSize = 20.sp,
                modifier = Modifier
                    .align(Alignment.Start)
                    .padding(horizontal = 24.dp)
                    .padding(top = 12.dp),
            )

            Column(
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.padding(12.dp)
            ) {
//                BigRoundedButton(
//                    text = "Carregar o Passe",
//                    icon = ImageVector.vectorResource(R.drawable.phosphoricons_credit_card_duotone),
//                    iconContentDescription = "Credit Card Icon",
//                    iconTint = Color.Red
//                ) {
//                    println("Button pressed")
//                }
//                BigRoundedButton(
//                    text = "Cartões e Descontos",
//                    icon = ImageVector.vectorResource(R.drawable.phosphoricons_lightning_duotone),
//                    iconContentDescription = "Lightning Icon",
//                    iconTint = Color.Red
//                ) {
//                    println("Button pressed")
//                }
                BigRoundedButton(
                    text = "Tarifários",
                    icon = ImageVector.vectorResource(R.drawable.phosphoricons_coins_duotone),
                    iconTint = Color.Red,
                    iconContentDescription = "Coins Icon",
                    externalLink = true
                ) {
                    CustomTabsIntent.Builder().build()
                        .launchUrl(context, Uri.parse("https://www.carrismetropolitana.pt/tarifarios/"))
                }
                BigRoundedButton(
                    text = "navegante",
                    icon = ImageVector.vectorResource(R.drawable.navegante_card_icon_duotone),
                    iconTint = CMYellow,
                    iconContentDescription = "Ícone Cartão Navegante",
                    externalLink = true
                ) {
                    CustomTabsIntent.Builder().build()
                        .launchUrl(context, Uri.parse("https://www.navegante.pt/"))
                }
            }

            Text(
                text = "Carris Metropolitana",
                fontWeight = FontWeight.SemiBold,
                letterSpacing = 0.sp,
                fontSize = 20.sp,
                modifier = Modifier
                    .align(Alignment.Start)
                    .padding(horizontal = 24.dp)
                    .padding(top = 12.dp),
            )

            Column(
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.padding(12.dp)
            ) {
                BigRoundedButton(
                    text = "Recrutamento",
                    icon = ImageVector.vectorResource(R.drawable.phosphoricons_user_check_duotone),
                    iconContentDescription = "Credit Card Icon",
                    iconTint = Color("#ffcc00".toColorInt()),
                    externalLink = true
                ) {
                    CustomTabsIntent.Builder().build()
                        .launchUrl(context, Uri.parse("https://www.carrismetropolitana.pt/motoristas/"))
                }
                BigRoundedButton(
                    text = "Dados Abertos",
                    icon = ImageVector.vectorResource(R.drawable.phosphoricons_magic_wand_duotone),
                    iconContentDescription = "Lightning Icon",
                    iconTint = Color("#007aff".toColorInt()),
                    externalLink = true
                ) {
                    CustomTabsIntent.Builder().build()
                        .launchUrl(context, Uri.parse("https://www.carrismetropolitana.pt/opendata/"))
                }
                BigRoundedButton(
                    text = "Privacidade",
                    icon = ImageVector.vectorResource(R.drawable.phosphoricons_lock_duotone),
                    iconTint = Color("#007aff".toColorInt()),
                    iconContentDescription = "Support Agent Icon",
                    externalLink = true
                ) {
                    CustomTabsIntent.Builder().build().launchUrl(
                        context,
                        Uri.parse("https://www.carrismetropolitana.pt/politica-de-privacidade/")
                    )
                }
                BigRoundedButton(
                    text = "Aviso Legal",
                    icon = ImageVector.vectorResource(R.drawable.phosphoricons_seal_check_duotone),
                    iconTint = Color("#007aff".toColorInt()),
                    iconContentDescription = "Support Agent Icon",
                    externalLink = true
                ) {
                    CustomTabsIntent.Builder().build().launchUrl(
                        context,
                        Uri.parse("https://www.carrismetropolitana.pt/aviso-legal/")
                    )
                }
            }

            getVersionString(context)?.let {
                Text("Versão $it", fontSize = 16.sp, color = Color.Gray, fontWeight = FontWeight.Bold, modifier = Modifier.align(Alignment.CenterHorizontally).padding(vertical = 14.dp))
            }
        }
    }
}

fun getVersionString(context: Context): String? {
    try {
        val packageInfo = context.packageManager.getPackageInfo(context.packageName, 0);
        val versionName = packageInfo.versionName;
        val versionCode = packageInfo.versionCode;
        return "$versionName ($versionCode)";
    } catch (e: PackageManager.NameNotFoundException) {
        e.printStackTrace();
    }
    return null;
}