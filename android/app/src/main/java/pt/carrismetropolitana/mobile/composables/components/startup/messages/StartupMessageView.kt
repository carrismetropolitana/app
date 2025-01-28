package pt.carrismetropolitana.mobile.composables.components.startup.messages

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.view.MotionEvent
import android.view.ViewGroup
import android.webkit.JavascriptInterface
import androidx.activity.compose.BackHandler
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import androidx.navigation.NavController
import kotlinx.coroutines.launch
import pt.carrismetropolitana.mobile.Screens
import pt.carrismetropolitana.mobile.services.cmwebapi.PresentationType

@Composable
fun StartupMessageView(
    url: String,
    messagePresentationType: PresentationType,
    navController: NavController
) {
    val coroutineScope = rememberCoroutineScope()

    BackHandler(enabled = messagePresentationType == PresentationType.Breaking) {
    }

    StartupMessageWebView(url, onCloseButtonClicked = {
        if (messagePresentationType != PresentationType.Breaking) {
            coroutineScope.launch {
                navController.popBackStack()
            }
        }
    })
}

@Composable
fun StartupMessageWebView(
    url: String,
    modifier: Modifier = Modifier,
    onCloseButtonClicked: () -> Unit = {}
) {
    Scaffold { paddingValues ->
        AndroidView(factory = {
            android.webkit.WebView(it).apply {
                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )

                addJavascriptInterface(
                    StartupMessageWebViewInterface(
                        context,
                        onCloseButtonClicked
                    ), "Android"
                )

                webViewClient = object : android.webkit.WebViewClient() {
                    override fun shouldOverrideUrlLoading(
                        view: android.webkit.WebView,
                        url: String
                    ): Boolean {
                        println("shouldOverrideUrlLoading: $url")
                        val url = url
                        return when {
                            url.contains("carrismetropolitana.pt") -> false
                            url.startsWith("http://") || url.startsWith("https://") -> {
                                view.context.startActivity(
                                    Intent(Intent.ACTION_VIEW, Uri.parse(url))
                                )
                                view.reload()
                                true
                            }

                            else -> false
                        }
                    }
                }
            }
        }, update = {
            it.loadUrl(url)
        }, modifier = Modifier.padding(paddingValues))
    }
}

class StartupMessageWebViewInterface(
    private val context: Context,
    private val onCloseButtonClicked: () -> Unit
) {
    @JavascriptInterface
    fun closeButtonClicked() {
        onCloseButtonClicked()
    }
}

fun getCurrentBuildNumber(context: Context): Int? {
    return try {
        val packageInfo = context.packageManager.getPackageInfo(context.packageName, 0);
        packageInfo.versionCode;
    } catch (e: PackageManager.NameNotFoundException) {
        e.printStackTrace();
        null
    }
}

fun currentBuildInBuildInterval(context: Context, maxBuild: Int?, minBuild: Int?): Boolean {
    getCurrentBuildNumber(context)?.let {
        if (maxBuild == null && minBuild == null) {
            return false
        }


        if (maxBuild != null && minBuild != null) {
            return it < maxBuild && it > minBuild
        }

        if (maxBuild != null) {
            return it < maxBuild
        }

        if (minBuild != null) {
            return it > minBuild
        }
    }
    return false
}
