package pt.carrismetropolitana.mobile.composables.screens.home

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import pt.carrismetropolitana.mobile.Screens
import pt.carrismetropolitana.mobile.ui.theme.CMYellow

@Composable
fun UnregisteredUserView(
    navController: NavController,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            "A Carris Metropolitana está mais próxima",
            textAlign = TextAlign.Center,
            fontWeight = FontWeight.ExtraBold,
            fontSize = 24.sp,
            modifier = Modifier.padding(horizontal = 25.dp)
        )
        Text(
            "Personalize a app com as suas linhas e paragens favoritas.",
            modifier = Modifier.padding(horizontal = 12.dp),
            textAlign = TextAlign.Center,
        )
        Text(
            "Saiba exatamente onde andam todos os autocarros e exatamente quando chegam à sua paragem.",
            modifier = Modifier.padding(24.dp),
            textAlign = TextAlign.Center
        )

        TextButton(
            onClick = {
                navController.navigate(Screens.FavoritesCustomization.route)
            },
            colors = ButtonDefaults.buttonColors(containerColor = CMYellow),

        ) {
            Text("Adicionar favoritos",
                fontSize = 20.sp,
                modifier = Modifier.padding(horizontal = 12.dp)
            )
        }

        Text("Boas viagens!", fontSize = 12.sp, color = MaterialTheme.colorScheme.onBackground)
    }
}