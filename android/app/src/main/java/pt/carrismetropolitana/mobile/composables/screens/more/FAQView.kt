package pt.carrismetropolitana.mobile.composables.screens.more

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.VerticalDivider
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.SubcomposeLayout
import androidx.compose.ui.text.TextLayoutResult
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import kotlin.math.ceil

data class FAQSection(
    val title: String,
    val items: List<FAQItem>
)
data class FAQItem(
    val title: String,
    val content: String
)

val staticFaqs = listOf(
    FAQSection(
        title = "Carris Metropolitana",
        items = listOf(
            FAQItem(
                title = "O que é a Carris Metropolitana?",
                content = "O projeto Carris Metropolitana é uma iniciativa dos 18 municípios da área metropolitana de Lisboa (AML) que, através da Transportes Metropolitanos de Lisboa, funde a operação de transporte público rodoviário de toda a amL numa só imagem e serviço. "
            ),
            FAQItem(
                title = "Em que municípios opera a Carris Metropolitana?",
                content = "A Carris Metropolitana opera nos 18 municípios da AML: Alcochete, Almada, Amadora, Barreiro*, Cascais*, Lisboa*, Loures, Oeiras, Odivelas, Mafra, Moita, Montijo, Palmela, Seixal, Sesimbra, Setúbal, Sintra e Vila Franca de Xira.\n\n*Barreiro, Cascais e Lisboa são servidos, em maior parte, pelos respetivos operadores municipais."
            ),
            FAQItem(
                title = "A Carris Metropolitana faz parte da Carris?",
                content = "A Carris Metropolitana e a Carris são entidades e marcas distintas, cada uma com as suas operações e áreas geográficas específicas.  \n\n" +
                        "A Carris Metropolitana é a marca estabelecida pela Transportes Metropolitanos de Lisboa (TML), que gere os serviços de transporte público rodoviário em várias regiões municipais e intermunicipais da área metropolitana.  \n\n" +
                        "Por sua vez, a Carris opera exclusivamente no município de Lisboa, tal como a MobiCascais em Cascais e os TCB (Transportes Coletivos do Barreiro) no Barreiro."
            ),
        )
    ),
    FAQSection(
        title = "Operação",
        items = listOf(
            FAQItem(
                title= "Quais são as empresas que deixaram de prestar serviço na amL com a entrada em operação da Carris Metropolitana?",
                content = "Com a entrada da Carris Metropolitana deixaram de prestar serviço na AML as empresas de transportes: Boa Viagem, Henrique Leonardo da Mota, Isidoro Duarte, JJ Santo António, Mafrense, Sulfertagus, TST, Vimeca, Scotturb."
            ),
            FAQItem(
                title = "Os autocarros da Carris Metropolitana são novos?",
                content = "A frota da Carris Metropolitana possui idade média inferior a 1 ano onde 5% dos veículos são não poluentes, energeticamente eficientes e 90% possuem classe de emissões EURO V ou superior."
            ),
            FAQItem(
                title = "Quais são os operadores prestadores de serviço que atuam sob a marca Carris Metropolitana?",
                content = "Os operadores prestadores de serviço da Carris Metropolitana são 4 e estão divididos por áreas da seguinte forma: \n" +
                        "\n" +
                        "Área 1: Viação Alvorada \n" +
                        "Área 2: Rodoviária de Lisboa \n" +
                        "Área 3: TST \n" +
                        "Área 4: Alsa Todi"
            ),
            FAQItem(
                title = "Quais municípios constituem cada uma das áreas?",
                content = "A Área 1 inclui os municípios da Amadora, Oeiras, Sintra, Cascais* e Lisboa*. \n" +
                        "\n" +
                        "A Área 2 inclui os municípios de Mafra, Vila Franca de Xira, Odivelas e Loures \n" +
                        "\n" +
                        "A Área 3 inclui os municípios de Almada, Seixal e Sesimbra. \n" +
                        "\n" +
                        "A Área 4 inclui os municípios de Alcochete, Moita, Montijo, Palmela, Setúbal e Barreiro*. \n" +
                        "\n" +
                        "*Apenas serviço intermunicipal"
            ),
            FAQItem(
                title = "Quais são algumas das exigências contratuais?",
                content = ". Renovação e qualificação da frota, incluindo veículos acessíveis, não poluentes e energicamente eficientes \n" +
                        ". Inclusão de serviços de entretenimento/informação e Wi-Fi a bordo \n" +
                        ". Eco-condução, aumento de oferta e promoção da pontualidade \n" +
                        ". Planeamento e ajuste do serviço \n" +
                        ". Aumento substancial da rede de vendas e serviços de apoio ao passageiro  \n" +
                        ". Integração tecnológica"
            ),
            FAQItem(
                title = "Para onde posso relatar falhas e atrasos? ",
                content = "Poderá reportar falhas e atrasos através da linha de apoio 210 410 800 ou através do formulário disponível no site."
            )
        ),
    ),
    FAQSection(
        title = "Horários",
        items = listOf(
            FAQItem(
                title = "Onde posso consultar os horários e percursos?",
                content = "Poderá consultar os horários e percursos de toda a nossa frota na página Horários no menu Viajar." // TODO: change to app based text
            ),
            FAQItem(
                title = "A que datas correspondem o período de verão, período escolar e o período de férias escolares?",
                content = "Os períodos da Carris Metropolitana são estabelecidos anualmente de forma a serem ajustados com as calendarizações de cada município. Para o ano de 2023, os períodos são: \n" +
                        "\n" +
                        "· O período de verão corresponde de 01/07/2024 a 31/08/2024. \n" +
                        "\n" +
                        "· O período de férias escolares corresponde aos dias 28/03/2024 à 02/04/2024.\n" +
                        "\n" +
                        "· O período escolar corresponde aos dias de 15/02/2024 a 27/03/2024 e de 03/04/2024 a 30/06/2024."
            ),
        )
    ),
      // TODO: add more sections
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FAQView(
    navController: NavController,
    paddingValues: PaddingValues
) {
    Scaffold (
        topBar = {
            TopAppBar(
                title = { Text("Perguntas Frequentes") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(imageVector = Icons.AutoMirrored.Rounded.ArrowBack, contentDescription = "Back")
                        }
                }
            )
        },
        modifier = Modifier.padding(bottom = paddingValues.calculateBottomPadding())
    ) { innerPaddingValues ->
        Column(
            modifier = Modifier
                .padding(innerPaddingValues)
                .verticalScroll(rememberScrollState())
        ) {
            for (section in staticFaqs) {
                Text(
                    text = section.title,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 0.sp,
                    fontSize = 20.sp,
                    modifier = Modifier
                        .align(Alignment.Start)
                        .padding(8.dp)
                )
                for (item in section.items) {
                    ExpandableFAQItem(
                        title = item.title,
                        content = item.content
                    )
                }
            }
        }
    }
}

@Composable
fun ExpandableFAQItem(
    title: String,
    content: String
) {
    var isExpanded = remember { mutableStateOf(false) }

    Column (Modifier.padding(horizontal = 12.dp)) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { isExpanded.value = !isExpanded.value }
                .padding(vertical = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ){
            Row (Modifier.width(340.dp), horizontalArrangement = Arrangement.Start, verticalAlignment = Alignment.CenterVertically) {// this serves to set a max width for the title
//                WrapTextContent(title)
                Text(title, fontWeight = FontWeight.SemiBold)
            }

            // https://issuetracker.google.com/issues/206039942?pli=1  ...
            Icon(imageVector = Icons.Default.ArrowDropDown, contentDescription = "Drop Down Accordion Icon")
        }

        AnimatedVisibility(visible = isExpanded.value) {
            Text(content)
        }
    }
}

@Preview
@Composable
fun ExpandableFAQItemPreview() {
    FAQView(navController = rememberNavController(), paddingValues = PaddingValues(0.dp))
}

// TEMPORARY -- not very performant technically
@Composable
fun WrapTextContent(
    text: String,
    modifier: Modifier = Modifier,
    color: Color = Color.Unspecified,
    fontSize: TextUnit = TextUnit.Unspecified,
    fontStyle: FontStyle? = null,
    fontWeight: FontWeight? = null,
    fontFamily: FontFamily? = null,
    letterSpacing: TextUnit = TextUnit.Unspecified,
    textDecoration: TextDecoration? = null,
    textAlign: TextAlign? = null,
    lineHeight: TextUnit = TextUnit.Unspecified,
    overflow: TextOverflow = TextOverflow.Clip,
    softWrap: Boolean = true,
    maxLines: Int = Int.MAX_VALUE,
    onTextLayout: (TextLayoutResult) -> Unit = {},
    style: TextStyle = LocalTextStyle.current,
) {
    SubcomposeLayout(modifier) { constraints ->
        val composable = @Composable { localOnTextLayout: (TextLayoutResult) -> Unit ->
            Text(
                text = text,
                color = color,
                fontSize = fontSize,
                fontStyle = fontStyle,
                fontWeight = fontWeight,
                fontFamily = fontFamily,
                letterSpacing = letterSpacing,
                textDecoration = textDecoration,
                textAlign = textAlign,
                lineHeight = lineHeight,
                overflow = overflow,
                softWrap = softWrap,
                maxLines = maxLines,
                onTextLayout = localOnTextLayout,
                style = style,
            )
        }
        var textWidthOpt: Int? = null
        subcompose("measureView") {
            composable { layoutResult ->
                textWidthOpt = (0 until layoutResult.lineCount)
                    .maxOf { line ->
                        ceil(layoutResult.getLineRight(line) - layoutResult.getLineLeft(line)).toInt()
                    }
            }
        }[0].measure(constraints)
        val textWidth = textWidthOpt!!
        val placeable = subcompose("content") {
            composable(onTextLayout)
        }[0].measure(constraints.copy(minWidth = textWidth, maxWidth = textWidth))

        layout(width = textWidth, height = placeable.height) {
            placeable.place(0, 0)
        }
    }
}