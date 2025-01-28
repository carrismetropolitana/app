package pt.carrismetropolitana.mobile.composables.components.news

import android.graphics.Bitmap
import android.net.Uri
import android.view.ViewGroup
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.browser.customtabs.CustomTabsIntent
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import androidx.webkit.WebSettingsCompat
import androidx.webkit.WebViewFeature
import pt.carrismetropolitana.mobile.services.cmwordpressapi.News

@Composable
fun NewsWebView(
    url: String,
    modifier: Modifier = Modifier
) {
    AndroidView(factory = {
        WebView(it).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )

            if (WebViewFeature.isFeatureSupported(WebViewFeature.ALGORITHMIC_DARKENING)) {
                println("[WebView] Algorithmic Darkening is supported")
                WebSettingsCompat.setAlgorithmicDarkeningAllowed(settings, true)
            }

            webViewClient = object : WebViewClient() {
                override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                    view?.evaluateJavascript(
                        """
                        (function() {
                            var style = document.createElement('style');
                            style.innerHTML = '.main-header, #site-footer { display: none !important; }';
                            document.head.appendChild(style);
                        })();
                        """.trimIndent(), null)
                }

                override fun onPageFinished(view: WebView?, url: String?) {
                    view?.evaluateJavascript(
                        """
                        (function() {
                            var style = document.createElement('style');
                            style.innerHTML = '.main-header, #site-footer { display: none !important; }';
                            document.head.appendChild(style);
                        })();
                        """.trimIndent(), null)
                }

                override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                    val newUrl = request?.url.toString()
                    if (newUrl != url) {
                        CustomTabsIntent.Builder().build()
                            .launchUrl(context, Uri.parse(newUrl))
                        return true
                    }
                    return false
                }
            }
        }
    }, update = {
        it.loadUrl(url)
    }, modifier = modifier)
}