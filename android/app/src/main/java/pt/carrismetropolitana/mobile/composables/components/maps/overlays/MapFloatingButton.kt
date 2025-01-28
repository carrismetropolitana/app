package pt.carrismetropolitana.mobile.composables.components.maps.overlays

import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource

@Composable
fun MapFloatingButton(
    iconResourceId: Int,
    disabled: Boolean = false,
    onClick: () -> Unit,
) {
    FloatingActionButton(
        onClick = { if (disabled) null else onClick() },
        containerColor = MaterialTheme.colorScheme.background,
        contentColor = MaterialTheme.colorScheme.onBackground,
    ) {
        Icon(imageVector = ImageVector.vectorResource(iconResourceId), contentDescription = "Map Floating Button")
    }
}