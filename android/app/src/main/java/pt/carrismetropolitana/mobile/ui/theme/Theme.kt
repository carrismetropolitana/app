package pt.carrismetropolitana.mobile.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

// TODO: work this theme stuff out

// Define the light color scheme
private val LightColorScheme = lightColorScheme(
    primary = CMSystemText100,  // You can decide on the primary color
    onPrimary = CMSystemText100,  // Text on buttons or highlighted surfaces
    background = CMSystemBackground200,  // Main app background color
    surface = CMSystemBackground100,  // Background for cards, dialogs, etc.
    onBackground = CMSystemText100,  // Text color on background
    onSurface = CMSystemText100,  // Text color on cards, dialogs, etc.
    outline = CMSystemBorder100  // Borders and dividers
)

// Define the dark color scheme
private val DarkColorScheme = darkColorScheme(
    primary = CMSystemText100Dark,  // Text or highlighted elements
    onPrimary = CMSystemText100Dark,  // Background on primary text
    background = CMSystemBackground200Dark,  // Main app background color
    surface = CMSystemBackground200Dark,  // Background for cards, dialogs, etc.
    onBackground = CMSystemText100Dark,  // Text color on background
    onSurface = CMSystemText100Dark,  // Text color on surfaces
    outline = CMSystemBorder100Dark  // Borders and dividers
)

@Composable
fun CarrisMetropolitanaTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    // Dynamic color is available on Android 12+
    dynamicColor: Boolean = false, // This that thing that tints stuff with user defined colors, for now it's disabled
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }

        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}