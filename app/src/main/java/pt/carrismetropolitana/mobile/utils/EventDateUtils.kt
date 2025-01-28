package pt.carrismetropolitana.mobile.utils

import java.time.LocalDate

val LocalDate.isCarnivalPeriod: Boolean
    get() = false

val LocalDate.isHalloweenPeriod: Boolean
    get() = (monthValue == 10 && dayOfMonth == 31)
            || (monthValue == 11 && (dayOfMonth == 1 || dayOfMonth == 2))


val LocalDate.isChristmasPeriod: Boolean
    get() = false