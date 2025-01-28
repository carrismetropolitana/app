package pt.carrismetropolitana.mobile.composables.components.common

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class DynamicSelectTextFieldOption(
    val id: String,  // Added id field
    val title: String,
    val subtitle: String? = null
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DynamicSelectTextField(
    selectedValue: String,
    options: List<DynamicSelectTextFieldOption>,
    label: String,
    onValueChangedEvent: (DynamicSelectTextFieldOption) -> Unit,
    modifier: Modifier = Modifier
) {
    var expanded by remember { mutableStateOf(false) }

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = !expanded },
        modifier = modifier
    ) {
        OutlinedTextField(
            readOnly = true,
            value = selectedValue,
            onValueChange = {},
            label = { Text(text = label) },
            trailingIcon = {
                ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded)
            },
            colors = OutlinedTextFieldDefaults.colors(),
            modifier = Modifier
                .menuAnchor()
                .fillMaxWidth()
        )

        ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
            options.forEach { option: DynamicSelectTextFieldOption ->
                DropdownMenuItem(
                    text = {
                        Column(modifier = Modifier.padding(vertical = 12.dp)) {
                            Text(
                                text = option.title,
                                fontSize = 18.sp
                            )
                            Text(text = option.subtitle ?: "")
                        }
                    },
                    onClick = {
                        expanded = false
                        onValueChangedEvent(option)
                    }
                )
            }
        }
    }
}

@Preview
@Composable
private fun DynamicSelectTextFieldPreview() {
    DynamicSelectTextField(
        selectedValue = "Selected value",
        options = listOf(
            DynamicSelectTextFieldOption(
                id = "1",
                title = "Option 1",
                subtitle = "Subtitle"
            ),
            DynamicSelectTextFieldOption(
                id = "2",
                title = "Option 2",
                subtitle = "Subtitle"
            ),
            DynamicSelectTextFieldOption(
                id = "3",
                title = "Option 3",
                subtitle = "Subtitle"
            )
        ),
        label = "Sentido",
        onValueChangedEvent = { /*TODO*/ },
        modifier = Modifier
    )
    
}