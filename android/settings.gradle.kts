pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
    includeBuild("../node_modules/@react-native/gradle-plugin")
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_PROJECT)
    repositories {
        google()
        mavenCentral()
    }
}

plugins {
    id("com.facebook.react.settings") 
}

extensions.configure<com.facebook.react.ReactSettingsExtension> { autolinkLibrariesFromCommand() }

rootProject.name = "CarrisMetropolitana"
include(":app")

includeBuild("../node_modules/@react-native/gradle-plugin")