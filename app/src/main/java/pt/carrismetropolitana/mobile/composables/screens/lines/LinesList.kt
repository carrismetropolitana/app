package pt.carrismetropolitana.mobile.composables.screens.lines

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.graphics.toColorInt
import androidx.navigation.NavController
import pt.carrismetropolitana.mobile.composables.components.Pill
import pt.carrismetropolitana.mobile.services.cmapi.Line

@Composable
fun LinesList(lines: List<Line>, navController: NavController) {
    LazyColumn {
        itemsIndexed(
            items = lines,
        ) {index, line ->
            LineItem(line, isLastInList = index == lines.size - 1, onClick = { navController.navigate("line_details/${line.shortName}") })
        }
    }
}

@Composable
fun LineItem(line: Line, isLastInList: Boolean, onClick: () -> Unit) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .padding(16.dp)
            .clickable { onClick() }
    ) {
        Pill(text = line.shortName, color = Color(line.color.toColorInt()), textColor = Color(line.textColor.toColorInt()), size = 60)
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = line.longName,
            fontSize = 16.sp, // Set font size in scaled pixels (sp)
            fontWeight = FontWeight.Bold,
            modifier = Modifier.weight(1f)
        )
    }
    if (!isLastInList) {
        HorizontalDivider(thickness = 1.dp, color = Color.LightGray)
    }
    Spacer(modifier = Modifier.height(8.dp))
}