package pt.carrismetropolitana.mobile.composables.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun Pill(
    text: String,
    color: Color,
    textColor: Color,
    size: Int,
    modifier: Modifier = Modifier
) {
    Box(modifier) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .background(color = color, shape = RoundedCornerShape(24.dp))
                .width(72.dp)
        ) {
            Text(
                text = text,
                color = textColor,
                fontSize = 18.sp, // Set font size in scaled pixels (sp)
                fontWeight = FontWeight.Black,
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
            )
        }
    }
}

@Preview
@Composable
fun PillPreview() {
    Pill(text = "1523", color = Color.Red, textColor = Color.White, size = 60)
}