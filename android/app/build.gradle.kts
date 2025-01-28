import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.jetbrains.kotlin.android)
    alias(libs.plugins.compose.compiler)
    id("kotlinx-serialization")
    id("com.google.devtools.ksp")
    id("com.google.gms.google-services")
    id("com.facebook.react")
}

android {
    namespace = "pt.carrismetropolitana.mobile"
    compileSdk = 34

    defaultConfig {
        applicationId = "pt.carrismetropolitana.mobile"
        minSdk = 26 // was initially 25
        targetSdk = 34
        versionCode = generateVersionCode()
        versionName = generateVersionName()

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.1"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

fun generateVersionCode(): Int {
    return (System.currentTimeMillis() / 1000).toInt()
}


fun generateVersionName(): String {
    val lisbonTimeZone = TimeZone.getTimeZone("Europe/Lisbon")
    val sdf = SimpleDateFormat("yyyy.MM.dd", Locale.getDefault()).apply {
        timeZone = lisbonTimeZone
    }
    return sdf.format(Date())
}

dependencies {

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation("androidx.navigation:navigation-compose:2.7.7")
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.ui.test.junit4)
    debugImplementation(libs.androidx.ui.tooling)
    debugImplementation(libs.androidx.ui.test.manifest)

    implementation(libs.kotlinx.coroutines.core)
    implementation(libs.kotlinx.coroutines.android)

    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.2")

    implementation("org.maplibre.gl:android-sdk:11.0.1")
    implementation("io.coil-kt:coil-compose:2.6.0")

    implementation(libs.bundles.retrofit)

    implementation("androidx.core:core-splashscreen:1.0.1")
    implementation("com.airbnb.android:lottie-compose:6.4.0")

    implementation("androidx.browser:browser:1.8.0")

    implementation("androidx.webkit:webkit:1.9.0")

    implementation(libs.androidx.room.runtime)
    annotationProcessor(libs.androidx.room.compiler)
    ksp(libs.androidx.room.compiler)
    implementation(libs.androidx.room.ktx)

    implementation(platform("com.google.firebase:firebase-bom:33.2.0"))
    implementation("com.google.firebase:firebase-messaging")

    implementation("androidx.datastore:datastore-preferences:1.1.1")

    implementation("sh.calvin.reorderable:reorderable:2.3.3")

    implementation("com.facebook.react:react-android")
    implementation("com.facebook.react:hermes-android")
}

react {
    // Needed to enable Autolinking - https://github.com/react-native-community/cli/blob/master/docs/autolinking.md
    autolinkLibrariesWithApp()
}