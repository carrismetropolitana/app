package pt.carrismetropolitana.mobile.utils

import java.text.Normalizer

fun String.normalizedForSearch(): String {
    // Convert to lowercase
    var normalizedString = this.lowercase()

    // Remove diacritical marks (accents)
    normalizedString = Normalizer.normalize(normalizedString, Normalizer.Form.NFD)
        .replace(Regex("\\p{InCombiningDiacriticalMarks}+"), "")

    // Remove non-alphanumeric characters except spaces
    normalizedString = normalizedString.replace(Regex("[^a-zA-Z0-9 ]"), "")

    return normalizedString
}