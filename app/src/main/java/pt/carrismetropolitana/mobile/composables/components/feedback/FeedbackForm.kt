package pt.carrismetropolitana.mobile.composables.components.feedback

import androidx.compose.runtime.Composable

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.core.graphics.toColorInt
import pt.carrismetropolitana.mobile.R

enum class QuestionType {
    YesOrNo
}

data class Question(
    val text: String,
    val type: QuestionType,
    val onAction: (Any) -> Unit
)

@Composable
fun UserFeedbackForm(
    title: String,
    description: String,
    questions: List<Question>
) {
    Column(
        modifier = Modifier
            .background(Color(0xFF2C2C2E))
            .padding(16.dp)
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            color = Color.White
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = description,
            style = MaterialTheme.typography.bodyMedium,
            color = Color.White
        )
        Spacer(modifier = Modifier.height(20.dp))

        Column {
            questions.forEachIndexed { index, question ->
                QuestionItem(question = question)
                if (index < questions.size - 1) {
                    Divider(
                        color = Color.White.copy(alpha = 0.5f),
                        thickness = 1.5.dp,
                        modifier = Modifier.padding(vertical = 8.dp)
                    )
                }
            }
        }
    }
}

@Composable
fun QuestionItem(question: Question) {
    Row(horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
        Text(
            text = question.text,
            style = MaterialTheme.typography.bodyLarge,
            fontWeight = FontWeight.Bold,
            color = Color.White
        )
        when (question.type) {
            QuestionType.YesOrNo -> YesNoButtons(onAction = question.onAction)
        }
    }
}

@Composable
fun YesNoButtons(onAction: (Any) -> Unit) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        YesNoButton(text = "Sim", isYes = true, onClick = { onAction(true) })
        YesNoButton(text = "Não", isYes = false, onClick = { onAction(false) })
    }
}

@Composable
fun YesNoButton(text: String, isYes: Boolean, onClick: () -> Unit) {
    Button(
        onClick = onClick,
        colors = ButtonDefaults.buttonColors(
            containerColor = Color.White,
            contentColor = if (isYes) Color("#65c466".toColorInt()) else Color("#e84d3d".toColorInt())
        ),
        contentPadding = PaddingValues(6.dp),
        shape = RoundedCornerShape(10.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = ImageVector.vectorResource(if (isYes) R.drawable.phosphoricons_thumbs_up_fill else R.drawable.phosphoricons_thumbs_down_fill),
                contentDescription = null,
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(text = text, fontWeight = FontWeight.Bold)
        }
    }
}

val demoUserFeedbackFormQuestions = listOf(
    Question(
        text = "Percursos e Paragens",
        type = QuestionType.YesOrNo
    ) { answer ->
        // Handle the answer
        println("Service enjoyment: $answer")
    },
    Question(
        text = "Estimativas de Chegada",
        type = QuestionType.YesOrNo
    ) { answer ->
        // Handle the answer
        println("Recommendation: $answer")
    },
    Question(
        text = "Informações no Veículo",
        type = QuestionType.YesOrNo
    ) { answer ->
        // Handle the answer
        println("Recommendation: $answer")
    }
)

@Preview
@Composable
private fun UserFeedbackFormPreview() {
    UserFeedbackForm(
        title = "Estas informações estão corretas?",
        description = "Ajude-nos a melhorar os transportes para todos.",
        questions = demoUserFeedbackFormQuestions
    )
}