package pt.carrismetropolitana.mobile.composables

import androidx.compose.runtime.Composable
import pt.carrismetropolitana.mobile.services.cmapi.Stop

@Composable
fun PatternStopLeg(
    stop: Stop,
    active: Boolean, // greyed out ot not
    expanded: Boolean, // showing next buses and bottom buttons or not
    isNextStop: Boolean // has top padding or not
) {

}