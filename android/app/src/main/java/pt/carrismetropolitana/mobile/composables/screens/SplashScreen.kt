package pt.carrismetropolitana.mobile.composables.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.airbnb.lottie.compose.LottieAnimation
import com.airbnb.lottie.compose.LottieCompositionSpec
import com.airbnb.lottie.compose.animateLottieCompositionAsState
import com.airbnb.lottie.compose.rememberLottieComposition
import kotlinx.coroutines.delay
import pt.carrismetropolitana.mobile.R
import pt.carrismetropolitana.mobile.Screens

@Composable
fun SplashScreen(
    navController: NavController
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
//            .background(Color.White)
    ) {
        val composition by rememberLottieComposition(LottieCompositionSpec.RawRes(
            if (isSystemInDarkTheme()) R.raw.cm_logo_loop_dark else R.raw.cm_logo_loop ))
        val progress by animateLottieCompositionAsState(composition, speed = 2.3F)

        LaunchedEffect(Unit) {
            delay(1500)
            navController.navigate(Screens.Home.route) {
                // pop from nav back stack up to splash (including splash) to avoid back button returning to splash
                popUpTo(Screens.Splash.route) {
                    inclusive = true
                }
            }
        }

        LottieAnimation(
            modifier = Modifier
                .width(250.dp)
                .align(Alignment.Center),
            composition = composition,
            progress = { progress }
        )
    }
}