import React, { useEffect } from "react";
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    Linking,
    SafeAreaView,
} from "react-native";
import {
    IconBuildingStore,
    IconCalendarEvent,
    IconChartBar,
    IconChevronRight,
    IconCreditCardPay,
    IconExternalLink,
    IconGavel,
    IconHelpHexagon,
    IconHomeStar,
    IconLockSquare,
    IconMapQuestion,
    IconMessages,
    IconSpeakerphone,
    IconTicket,
    IconUmbrella,
    IconUserHeart,
} from "tabler-icons-react-native";
import RemoteImageCarousel from "../general/RemoteImageCarousel";
// import { SafeAreaView } from "react-native-safe-area-context";
import useThemedCMColor from "../../hooks/useThemedCMColor";

import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import InAppBrowser from "react-native-inappbrowser-reborn";
// import { Skeleton } from "moti/skeleton";
// import { openURL } from "expo-linking";
// import { useTheme } from "@react-navigation/native";

async function openInAppBrowser(url: string) {
    await InAppBrowser.open(url, {
        modalPresentationStyle: "formSheet",
        modalEnabled: true,
        animated: true,
    });
}

export default function MoreScreen({
    releaseVersionNumber,
    buildVersionNumber,
    navigation,
}) {
    const {
        isPending,
        error,
        data: news,
    } = useQuery({
        queryKey: ["news"],
        queryFn: () =>
            fetch(
                "https://www.carrismetropolitana.pt/api/app-ios/v1/news"
            ).then((res) => res.json()),
    });
    const systemText100 = useThemedCMColor("systemText100");
    const systemText200 = useThemedCMColor("systemText200");
    const systemText300 = useThemedCMColor("systemText300");
    const systemText400 = useThemedCMColor("systemText400");
    const systemBackground200 = useThemedCMColor("systemBackground200");
    const systemBackground100 = useThemedCMColor("systemBackground100");
    const systemBorder100 = useThemedCMColor("systemBorder100");

    const styles = makeStyles({
        systemBackground100,
        systemBackground200,
        systemText100,
        systemText200,
        systemText300,
        systemBorder100,
    });

    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.container}
                // contentInsetAdjustmentBehavior="automatic"
                showsVerticalScrollIndicator={false}
            >
                {/* top banner */}
                <View style={styles.banner}>
                    {/* <Skeleton
                        height={250}
                        radius={12}
                        show={isPending}
                        colorMode={useTheme().dark ? "dark" : "light"}
                    > */}
                    <RemoteImageCarousel
                        imageUrls={
                            news
                                ? news.map((n: any) => n.cover_image_src)
                                : null
                        }
                        onImagePress={async (index) => {
                            await openInAppBrowser(
                                `https://carrismetropolitana.pt/news/${news[index]._id}`
                            );
                        }}
                    />
                    {/* </Skeleton> */}
                </View>

                {/* customer support */}
                <Text style={styles.sectionHeader}>Apoio ao cliente</Text>
                <Text style={styles.sectionSubHeader}>
                    Tire as suas dúvidas sobre a Carris Metropolitana ou entre
                    em contacto connosco.
                </Text>
                {renderMenuItem(
                    "Perguntas Frequentes",
                    <IconHelpHexagon size={32} color={systemText100} />,
                    true,
                    false,
                    false,
                    styles,
                    async () => {
                        await openInAppBrowser(
                            "https://www.carrismetropolitana.pt/faq"
                        );
                    }
                )}
                {renderMenuItem(
                    "Perdidos e Achados",
                    <IconUmbrella size={32} color={systemText100} />,
                    true,
                    false,
                    false,
                    styles,
                    async () => {
                        await openInAppBrowser(
                            "https://www.carrismetropolitana.pt/lost-and-found"
                        );
                    }
                )}
                {renderMenuItem(
                    "Lojas e Rede de Agentes",
                    <IconBuildingStore size={32} color={systemText100} />,
                    true,
                    false,
                    false,
                    styles,
                    () => {
                        navigation.navigate("FullScreenWebView", {
                            url: "https://www.carrismetropolitana.pt/app-ios/stores?locale=pt", // TODO: get device's locale
                            title: "Lojas e Rede de Agentes",
                            openExternalLinksInWebView: false,
                        });
                    }
                )}
                {renderMenuItem(
                    "Contactos",
                    <IconMessages size={32} color={systemText100} />,
                    true,
                    true,
                    false,
                    styles,
                    async () => {
                        await openInAppBrowser(
                            "https://www.carrismetropolitana.pt/contacts"
                        );
                    }
                )}

                {/* tarifas */}
                <Text style={styles.sectionHeader}>Tarifas</Text>
                <Text style={styles.sectionSubHeader}>
                    Descubra quanto custa viajar na CMetropolitana regularmente
                    ou de vez em quando.
                </Text>
                {renderMenuItem(
                    "Bilhetes Ocasionais",
                    <IconTicket size={32} color={systemText100} />,
                    true,
                    false,
                    false,
                    styles,
                    async () => {
                        await openInAppBrowser(
                            "https://www.carrismetropolitana.pt/tickets"
                        );
                    }
                )}
                {renderMenuItem(
                    "Passe Mensal",
                    <IconCreditCardPay size={32} color={systemText100} />,
                    true,
                    false,
                    false,
                    styles,
                    async () => {
                        await openInAppBrowser(
                            "https://www.carrismetropolitana.pt/cards"
                        );
                    }
                )}
                {renderMenuItem(
                    "Onde comprar",
                    <IconMapQuestion size={32} color={systemText100} />,
                    true,
                    true,
                    false,
                    styles,
                    async () => {
                        await openInAppBrowser(
                            "https://www.carrismetropolitana.pt/helpdesks"
                        );
                    }
                )}

                {/* about */}
                <Text style={styles.sectionHeader}>Carris Metropolitana</Text>
                <Text style={styles.sectionSubHeader}>
                    Conheça melhor a Carris Metropolitana e explore diferentes
                    ângulos da operação rodoviária dos 18 municípios da área
                    metropolitana de Lisboa.
                </Text>
                {renderMenuItem(
                    "Sobre a CMetropolitana",
                    <IconHomeStar size={32} color={systemText100} />,
                    true,
                    false,
                    true,
                    styles,
                    async () => {
                        await openInAppBrowser(
                            "https://carrismetropolitana.pt/about"
                        );
                    }
                )}
                {renderMenuItem(
                    "A nossa operação ao vivo",
                    <IconChartBar size={32} color={systemText100} />,
                    true,
                    false,
                    false,
                    styles,
                    async () => {
                        await openInAppBrowser(
                            "https://carrismetropolitana.pt/metrics"
                        );
                    }
                )}
                {renderMenuItem(
                    "Dados Abertos",
                    <IconSpeakerphone size={32} color={systemText100} />,
                    true,
                    false,
                    false,
                    styles,
                    async () => {
                        await openInAppBrowser(
                            "https://carrismetropolitana.pt/opendata"
                        );
                    }
                )}
                {renderMenuItem(
                    "Recrutamento",
                    <IconUserHeart size={32} color={systemText100} />,
                    true,
                    false,
                    false,
                    styles,
                    async () => {
                        await openInAppBrowser(
                            "https://carrismetropolitana.pt/motoristas"
                        );
                    }
                )}

                {/* legal/privacy */}
                {renderMenuItem(
                    "Privacidade",
                    <IconLockSquare size={32} color={systemText100} />,
                    true,
                    false,
                    false,
                    styles,
                    async () => {
                        await openInAppBrowser(
                            "https://www.carrismetropolitana.pt/privacy"
                        );
                    }
                )}
                {renderMenuItem(
                    "Aviso legal",
                    <IconGavel size={32} color={systemText100} />,
                    true,
                    true,
                    false,
                    styles,
                    async () => {
                        await openInAppBrowser(
                            "https://www.carrismetropolitana.pt/legal"
                        );
                    }
                )}

                {/* version */}
                <Text style={styles.version}>
                    Versão{" "}
                    {releaseVersionNumber && buildVersionNumber
                        ? `${releaseVersionNumber} (${buildVersionNumber})`
                        : "desconhecida"}
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

function renderMenuItem(
    title: string,
    icon: React.ReactNode = null,
    top = false,
    bottom = false,
    external = false,
    styles: any = {},
    onPress?: () => void
) {
    const menuItemContent = (
        <>
            <View style={styles.menuDescriptor}>
                {icon}
                <Text style={styles.menuText}>{title}</Text>
            </View>
            {external ? (
                <IconExternalLink
                    size={20}
                    color={useThemedCMColor("systemText400")}
                />
            ) : (
                <IconChevronRight
                    size={20}
                    color={useThemedCMColor("systemText400")}
                />
            )}
        </>
    );
    return process.env.EXPO_OS === "android" ? (
        <Pressable
            // activeOpacity={0.7}
            android_ripple={{ color: "#eee" }}
            style={[
                styles.menuItem,
                top && styles.topBorderMenuItem,
                bottom && styles.bottomBorderMenuItem,
            ]}
            onPress={onPress}
        >
            {menuItemContent}
        </Pressable>
    ) : (
        <TouchableOpacity
            activeOpacity={0.7}
            style={[
                styles.menuItem,
                top && styles.topBorderMenuItem,
                bottom && styles.bottomBorderMenuItem,
            ]}
            onPress={onPress}
        >
            {menuItemContent}
        </TouchableOpacity>
    );
}

const makeStyles = ({
    systemBackground100,
    systemBackground200,
    systemText100,
    systemText200,
    systemText300,
    systemBorder100,
}: {
    systemBackground100: string;
    systemBackground200: string;
    systemText100: string;
    systemText200: string;
    systemText300: string;
    systemBorder100: string;
}) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: systemBackground200,
        },
        container: {
            flex: 1,
            fontFamily: "Inter",
        },
        banner: {
            // backgroundColor: "#FFD700", // bright yellow
            borderRadius: 8,
        },
        // bannerText: {
        //     fontWeight: "bold",
        //     fontSize: 16,
        //     color: "#000",
        //     marginBottom: 8,
        // },
        // bannerSubText: {
        //     fontSize: 14,
        //     color: "#333",
        // },
        sectionHeader: {
            marginTop: 24,
            fontWeight: 600,
            fontSize: 16,
            color: systemText200,
            marginLeft: 16,
        },
        sectionSubHeader: {
            fontSize: 12,
            fontWeight: 500,
            color: systemText300,
            marginLeft: 16,
            marginBottom: 10,
            width: "90%",
        },
        menuItem: {
            backgroundColor: systemBackground100,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            paddingVertical: 12,
            // borderBottomWidth: 1,
            // borderBottomColor: "#eee",
            // borderTopWidth: 1,
            // borderTopColor: "#eee",
            paddingHorizontal: 16,
        },
        bottomBorderMenuItem: {
            borderBottomWidth: 1,
            borderBottomColor: systemBorder100,
        },
        topBorderMenuItem: {
            borderTopWidth: 1,
            borderTopColor: systemBorder100,
        },
        menuDescriptor: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
        },
        menuText: {
            fontSize: 18,
            fontWeight: 700,
            // fontFamily: "Inter",
            color: systemText100,
        },
        version: {
            marginTop: 8,
            marginLeft: 16,
            marginBottom: 40,
            fontSize: 12,
            color: "#aaa",
            textAlign: "left",
        },
    });
