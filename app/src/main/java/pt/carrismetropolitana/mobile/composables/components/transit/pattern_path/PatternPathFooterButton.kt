package pt.carrismetropolitana.mobile.composables.components.transit.pattern_path

import android.graphics.drawable.Icon
import androidx.annotation.DrawableRes
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.graphics.toColorInt
import pt.carrismetropolitana.mobile.R

@Composable
fun PatternPathFooterButton(
    text: String,
    @DrawableRes iconResourceId: Int,
    onClick: () -> Unit
) {
    Button(
        onClick = { onClick() },
        colors = ButtonDefaults.buttonColors(
            containerColor = Color("#ebebeb".toColorInt()),
            contentColor = Color.Gray
        ),
        contentPadding = PaddingValues(horizontal = 10.dp),
        shape = RoundedCornerShape(10.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(5.dp),
        ) {
            Icon(
                imageVector = ImageVector.vectorResource(id = iconResourceId),
                contentDescription = "",
                modifier = Modifier.size(24.dp)
            )
            Text(text, fontSize = 16.sp)
        }
    }
}

@Preview
@Composable
private fun PatternPathFooterButtonPreview() {
    PatternPathFooterButton(text = "Horários", iconResourceId = R.drawable.phosphoricons_clock, onClick = {})
}