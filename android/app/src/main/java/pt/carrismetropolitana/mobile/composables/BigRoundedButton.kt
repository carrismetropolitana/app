package pt.carrismetropolitana.mobile.composables

import androidx.compose.foundation.background
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.surfaceColorAtElevation
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.graphics.toColorInt
import pt.carrismetropolitana.mobile.R

@Composable
fun BigRoundedButton (
    text: String,
    icon: ImageVector,
    iconTint: Color,
    iconContentDescription: String,
    externalLink: Boolean = false,
    action: () -> Unit
) {
    Button(
        onClick = action,
        shape = RoundedCornerShape(20.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = if (isSystemInDarkTheme()) Color.DarkGray else Color.White,
            contentColor = if (isSystemInDarkTheme()) Color.White else Color.Black,
        ),
        elevation = ButtonDefaults.elevatedButtonElevation(
            defaultElevation = 2.dp,
            pressedElevation = 1.dp
        ),
//        contentPadding = PaddingValues(12.dp),
        modifier = Modifier
            .fillMaxWidth()
            .height(80.dp)
    ) {
        Row (
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxSize()
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Start,
            ) {
                Icon(
                    icon,
                    contentDescription = iconContentDescription,
                    tint = iconTint,
                    modifier = Modifier.size(42.dp)
                )
                Text(text, fontSize = 20.sp, modifier = Modifier.padding(horizontal = 24.dp))
            }

            if (externalLink) {
                Icon(
                    imageVector = ImageVector.vectorResource(R.drawable.phosphoricons_arrow_square_out),
                    contentDescription = "External Link Icon",
                    tint = Color.Gray,
                    modifier = Modifier
                        .size(24.dp)
                        .alpha(0.5f)
                )
            }
        }
    }
}