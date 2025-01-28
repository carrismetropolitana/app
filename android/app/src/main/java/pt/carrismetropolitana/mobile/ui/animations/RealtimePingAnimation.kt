package pt.carrismetropolitana.mobile.ui.animations

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.core.* // For animation-related classes
import androidx.compose.foundation.Canvas // To draw the circles
import androidx.compose.foundation.layout.* // For sizing and arranging
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

@Composable
fun RealtimePingAnimation(
    color: Color = Color.Green,
) {
    // Animating the growing circle's scale and opacity
    val infiniteTransition = rememberInfiniteTransition()
    val scale by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 3f,  // This is the growing scale
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 2000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        )
    )
    val alpha by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 0f,  // Fading opacity
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 2000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        )
    )

    // Drawing the two circles
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Canvas(
            modifier = Modifier.size(100.dp)
        ) {
            // Static green circle
            drawCircle(
                color = color,
                radius = size.minDimension / 4 // Radius for static circle
            )
            // Growing, fading circle
            drawCircle(
                color = color.copy(alpha = alpha),
                radius = size.minDimension / 4 * scale // Growing radius
            )
        }
    }
}

@Preview
@Composable
fun PingAnimationPreview() {
    RealtimePingAnimation()
}