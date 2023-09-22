document.getElementById("titleCenter").innerHTML = "<b>NOTA DE REQUISIÇÃO E SAÍDA DE MATERIAL</b>";

const datalist = document.getElementById("item-list");
const undlist = document.getElementById("u-list")
let nomeUnidade = document.getElementById("nomeUnidade");

function updateTitleWithDate() {
    document.getElementById("pageTitle")
        .innerText = "sb-material-"+nomeUnidade.value + "-" 
        + new Date().toISOString(('pt-BR', { timezone: 'UTC' })).substring(0,10);
}

function cloneDocPrint() {
    const divDocPrintOriginal = document.getElementById("docPrint");
    const divClone = divDocPrintOriginal.cloneNode(true);
    let divDublicada = document.getElementById("docPrintClone");
    divDublicada.innerHTML = ''; 
    divDublicada.appendChild(divClone);
}

window.onload = () =>{

    itemOptions.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        datalist.appendChild(optionElement);
    });

    nomesUnidades.forEach(opt => {
        const optEl = document.createElement("option");
        optEl.value = opt;
        undlist.appendChild(optEl);
    });

    recuperarDadosRequisitanteLocalStorage();
    recuperarDadosItensLocalStorage();
}

$(function () {
    $('#dataPedido').mask('00/00/0000');
})

function printPage(selector) {
    this.cloneDocPrint();
    this.updateTitleWithDate();

    let $print = $(selector)
        .clone()
        .addClass('print')
        .prependTo('body');
    
    // $print.prepend('<div>Data de Impressão: ' + new Date().toLocaleDateString() + '</div>');
    window.print();
    $print.remove();
}

function toggleRowVisibility() {
    const rows = document.querySelectorAll('.tr_hidden');
    rows.forEach(row => {
        if (row.style.display === 'table-row') {
            row.style.display = 'none'; // Esconder a linha
        } else {
            row.style.display = 'table-row'; // Mostrar a linha
        }
    });
    const button = document.getElementById('toggleButton');
    if (button.value === 'Mostrar Mais Linhas') {
        button.value = 'Ocultar Linhas';
    } else {
        button.value = 'Mostrar Mais Linhas';
    }
}

function saveLocalStorage(){
    let dadosRequerente = {
        nomeUnidade     : document.getElementById('nomeUnidade').value,
        ds              : document.getElementById('ds').value,
        grupoMaterial   : document.getElementById('grupoMaterial').value,
        nomeResponsavel : document.getElementById('nomeResponsavel').value
    }    
    localStorage.setItem("dadosRequerente", JSON.stringify(dadosRequerente));
}

function saveDataItensLocalStorage() {
    var dados = [];
    // Iterar por todas as linhas de input
    var linhas = document.querySelectorAll('#tableItens tbody tr');
    linhas.forEach(function (linha, index) {
        var inputEspecificacao = linha.querySelector('.td__especificacao input');
        var inputQuantidade = linha.querySelector('.td__quant_pedida input');
        var item = {
            especificacao: inputEspecificacao.value,
            quantidade: inputQuantidade.value
        };
        dados.push(item);
    });
    localStorage.setItem('dadosItens', JSON.stringify(dados));
}

// Adiciona um evento 'input' para salvar os dados no Local Storage automaticamente
var inputs = document.querySelectorAll('#tableItens tbody tr .td__especificacao input, #tableItens tbody tr .td__quant_pedida input');
inputs.forEach(function (input) {
    input.addEventListener('input', saveDataItensLocalStorage);
});

function recuperarDadosRequisitanteLocalStorage(){
    let requerenteJson = localStorage.getItem("dadosRequerente");
    if(requerenteJson){
        let requerente = JSON.parse(requerenteJson)
        document.getElementById('nomeUnidade').value = requerente.nomeUnidade;
        document.getElementById('ds').value = requerente.ds;
        document.getElementById('grupoMaterial').value = requerente.grupoMaterial;
        document.getElementById('nomeResponsavel').value = requerente.nomeResponsavel;
    }
}

function recuperarDadosItensLocalStorage() {
    var dadosJSON = localStorage.getItem('dadosItens');
    if (dadosJSON) {
        var dados = JSON.parse(dadosJSON);

        // Iterar pelos dados e preencher os inputs correspondentes
        var linhas = document.querySelectorAll('#tableItens tbody tr');
        linhas.forEach(function (linha, index) {
            var inputEspecificacao = linha.querySelector('.td__especificacao input');
            var inputQuantidade = linha.querySelector('.td__quant_pedida input');

            if (index < dados.length) {
                if (inputEspecificacao) {
                    inputEspecificacao.value = dados[index].especificacao;
                }
                if (inputQuantidade) {
                    inputQuantidade.value = dados[index].quantidade;
                }
            }
        });
    }
}

function inputsRequestorClean(){
    let ok = confirm(`Tem certeza de que deseja limpar os dados preenchidos no formulário?
Essa ação apagará os campos: 
UNIDADE REQUISITANTE, 
DISTRITO, 
GRUPO DE MATERIAL 
E FUNCIONÁRIO RESPONSÁVEL
`);
    if(ok) {
        document.getElementById('nomeUnidade').value = '';
        document.getElementById('ds').value = '';
        document.getElementById('grupoMaterial').value = '';
        document.getElementById('nomeResponsavel').value = '';
        localStorage.removeItem('dadosRequerente');
    }
}

function inputsItensClean() {
    let ok = confirm(`Tem certeza de que deseja limpar os ITENS PEDIDOS?
Essa ação apagará os campos da coluna: 
ESPECIFICAÇÕES E QUANTIDADE PEDIDA 
`);
    if(ok) {
        var inputs = document.querySelectorAll('#tableItens tbody tr .td__especificacao input, #tableItens tbody tr .td__quant_pedida input');
        inputs.forEach(function (input) {
            input.value = '';
        });
        localStorage.removeItem('dadosItens');
    }
}

const nomesUnidades = [
    'USF BONGI BOA IDEA',
    'USF CHICO MENDES/XIMBORÉ',
    'USF COQUEIRAL I E II',
    'USF IRAQUE/RUA DO RIO',   
    'USF JARDIM UCHOA',
    'USF JIQUIA I E II',
    'USF MANGUEIRA I',
    'USF MANGUEIRA II',
    'USF PLANETA DOS MACACOS II',
    'USF SAN MARTIN',
    'USF VILA SÃO MIGUEL/MARRON GLACÊ',
    'USF VILA TAMANDARE',
    'CS BIDU KRAUSE',
    'CS PROFESSOR ROMERO MARQUES',
    'UPINHA DIA - BONGI NOVO PRADO',
    'UPINHA JARDIM SÃO PAULO',
    'UPINHA NOVO JIQUIÁ',    
    'PAM CEASA',
];

const itemOptions = [
    "óxido de zinco",
    "eugenol",
    "ionomero de vidro",
    "sugador gengival",
    "sugador cirúrgico",
    "adesivo fotopolimerizavel",
    "condicionador ácido gel ácido fosforico 37%",
    "resina A1",
    "resina A2",
    "resina A3",
    "resina A3,5",
    "resina B2",
    "anestésico lidocaina 2% com vaso",
    "anestésico prilocaina 3% com vaso",
    "anestésico mepivacaina 3% com vaso",
    "anestésico mepivacaína sem vaso",
    "anestésico tópico",
    "agulha gengival 30G curta",
    "agulha gengival 27G longa",
    "fio de sutura nylon 4-0",
    "fio de sutura nylon 3-0",
    "fio de sutura seda",
    "roletes de algodão para uso odontológico",
    "tricresolformalina",
    "formocresol",
    "otosporim",
    "broca ",
    "evidênciador de placa",
    "",

    "ABRIDOR DE BOCA ADULTO EM MATERIAL PLASTICO",
    "ABRIDOR DE BOCA INFANTIL EM MATERIAL PLASTICO",
    "ADESIVO UNIVERSAL PARA ESMALTE E DENTINA FRASCO COM 4ML",
    "AGULHA GENGIVAL 30G CURTA, DESCARTÁVEL, ESTÉRIL, TRIBISELADA E SILICONIZADA",
    "AGULHA GENGIVAL 27G LONGA",
    "ALARGADORES TIPO K 1 SERIE 21MM CAIXA COM 06 UNIDADES",
    "ALARGADORES TIPO K 2 SERIE 21MM CAIXA COM 06 UNIDADES",
    "ALARGADORES TIPO K 2 SERIE 25MM CAIXA COM 06 UNIDADES",
    "ALGODAO EM ROLOS PARA USO ODONTOLOGICO PACOTE COM 100 ROLETES",
    "ALGODAO HIDROFILO EM MANTA UNIFORME ENVOLVIDO EM PAPEL EMBALABEM COM 500G",
    "ANESTESICO ODONTOLOGICO TOPICO EM GEL BENZOCAINA 20%",
    "BROCA CARBIDE FG PARA ALTA ROTACAO N 703",
    "BROCA DE TUNGSTENIO PARA PEÇA RETA, CORTE CRUZADO",
    "BROCA CARBIDE FG PARA ALTA ROTAÇÃO Nº 704",
    "BROCA CARBIDE PM PARA PECA RETA N 04",
    "BROCA CARBIDE PM PARA PECA RETA N 699",
    "BROCA CARBIDE PM PARA PECA RETA N 701",
    "BROCA CARBIDE PM PARA PECA RETA N 703",
    "BROCA CIRURGICA DE AÇO HASTE LONGA Nº 702",
    "BROCA DE LARGO PEESO N°1 DE 32 MM, BAIXA ROTAÇÃO.",
    "BROCA DE LARGO PEESO N°3 DE 32 MM, BAIXA ROTAÇÃO.",
    "BROCA DE TUNGSTENIO PARA PECA RETA, CORTE CRUZADO FINO",
    "BROCA DIAMANTADA 2200",
    "BROCA DIAMANTADA 3168F",
    "BROCA DIAMANTADA CHAMA FG 1111",
    "BROCA DIAMANTADA CHAMA FG 1111F",
    "BROCA DIAMANTADA CHAMA FG 1111FF",
    "BROCA DIAMANTADA CHAMA FG 3118F",
    "BROCA DIAMANTADA CHAMA FG 3118FF",
    "BROCA DIAMANTADA CILINDRICA FG 1090G",
    "BROCA DIAMANTADA CILÍNDRICA TOPO PLANO FG 1092F",
    "BROCA DIAMANTADA CONE-INVERTIDA FG 1032",
    "BROCA DIAMANTADA CONE-INVERTIDA FG 1034",
    "BROCA DIAMANTADA CONE-INVERTIDA FG 1033",
    "BROCA DIAMANTADA CONE-INVERTIDA FG 1035",
    "BROCA DIAMANTADA CONE-INVERTIDA FG 1036",
    "BROCA DIAMANTADA CONICA DUPLA (CARRETEL) FG 1046",
    "BROCA DIAMANTADA CONICA DUPLA (CARRETEL) FG 1047",
    "BROCA DIAMANTADA CONICA DUPLA, CARRETEL, FG 1045",
    "BROCA DIAMANTADA CILINDRICA TOPO PLANO FG 1092",
    "BROCA DIAMANTADA CILINDRICA TOPO PLANO FG 1090",
    "BROCA DIAMANTADA CONICA TOPO EM CHAMA FG 1190F",
    "BROCA DIAMANTADA CONICA TOPO EM CHAMA FG 1190FF",
    "BROCA DIAMANTADA CONICA TOPO EM CHAMA FG 2191",
    "BROCA DIAMANTADA CÔNICA TOPO EM CHAMA FG 1112",
    "BROCA DIAMANTADA ESFERICA FG 1012",
    "BROCA DIAMANTADA ESFERICA FG 1012HL",
    "BROCA DIAMANTADA ESFERICA FG 1014",
    "BROCA DIAMANTADA ESFERICA FG 1015",
    "BROCA DIAMANTADA ESFERICA FG 1014 HL",
    "BROCA DIAMANTADA ESFERICA FG 1016",
    "BROCA DIAMANTADA ESFERICA FG 1016HL",
    "BROCA DIAMANTADA ESFERICA FG 1017",
    "BROCA DIAMANTADA CONICA TOPO EM CHAMA 3195 FF",
    "BROCA ENDO Z FG Nº 152, 21mm",
    "BROCA GATES GLIDDEN N 1",
    "BROCA GATES GLIDDEN N 2",
    "BROCA GATES GLIDDEN N 3",
    "BROCA SHOFU TIPO CHAMA DE VELA",
    "BROCA SHOFU TIPO CILINDRICA",
    "BROCA SHOFU TIPO TROCO-CONICA (PONTA DE LAPIS)",
    "BROCA DIAMANTADA PARA ALTA-ROTAÇÃSO REF 2194CALEN",
    "PASTA ENDODONTICA A BASE DE HIDROXIDO DE CALCIO EM EMBALAGEM CONTENDO 2",
    "TUBETESCALLEN COM PMCC - PASTA ENDODÔNTICA À BASE DE HIDRÓXIXO DE CÁLCIO COM PARAMONOCLOROFENOL CANFORADO E",
    "CAMPOS CIRÚRGICOS EM POLIPROPILENO.",
    "CAPSULAS DE AMALGAMA DE PRATA PRE DOSADA - POTE C/ 500 CAPS",
    "CIMENTO CIRÚRGICO À BASE DE ÓXIDO DE ZINCO (SEM EUGENOL)",
    "CIMENTO DE IONOMERO DE VIDRO QUIMICAMENTE ATIVADO, COR A3 UNIVERSAL",
    "CIMENTO DE OXIDO DE ZINCO,PO, EMBALAGEM COM 50G",
    "CIMENTO ENDODONTICO A BASE DE HIDROXIDO DE CALCIO, CONT 1 FRASCO DE PO 8G E 1 BISNAGA DE RESINA7,5MG",
    "CIMENTO FOSFATO DE ZINCO (LIQUIDO), FRASCO 10ML.",
    "CIMENTO FOSFATO DE ZINCO, PO, COR AMARELO CLARO, FRASCO 28G",
    "CIMENTO HIDROXIDO DE CALCIO, EM EMBALAGEM CONTENDO PASTA BASE 13G E PASTA CATALISADORA 11G",
    "CIMENTO RESTAURADOR INTERMEDIARIO REFORCADO (IRM) A BASE DE OXIDO DE ZINCO E EUGENOL, 15 ML FRASCO",
    "CIMENTO RESTAURADOR INTERMEDIARIO REFORCADO (IRM) A BASE DE OXIDO DE ZINCO E EUGENOL - POTE COM 38G",
    "CONDICIONADOR ACIDO GEL - ACIDO FOSFORICO A 37%, SERINGA 2,5 A 3 ML",
    "CONE DE GUTA-PERCHA PRINCIPAL - 1ª SERIE Nº15, CAIXA COM 120 UNIDADES",
    "CONE DE GUTA-PERCHA PRINCIPAL - 1ª SERIE Nº20, CAIXA COM 120 UNIDADES",
    "CONE DE GUTA-PERCHA PRINCIPAL - 1ª SERIE Nº25, CAIXA COM 120 UNIDADES.",
    "CONE DE GUTA-PERCHA PRINCIPAL - 1ª SERIE Nº40, CAIXA COM 120 UNIDADES",
    "CONE DE PAPEL ABSORVENTE 1º SÉRIE – CX C/ 120 UNIDADES",
    "CONE DE GUTA-PERCHA PRINCIPAL - 2ª SERIE N.º45, CAIXA COM 120 UNIDADES",
    "CONE DE GUTA-PERCHA PRINCIPAL, 1ª SERIE N 30, CAIXA COM 120 UNIDADES",
    "CONE DE GUTA-PERCHA PRINCIPAL, 1ª SERIE N 35, CAIXA COM 120 UNIDADES",
    "CONE DE GUTA-PERCHA PRINCIPAL, 2ª SERIE N 50, CAIXA COM 120 UNIDADES",
    "CONE DE GUTA-PERCHA PRINCIPAL, 2ª SERIE N 55, CAIXA COM 120 UNIDADES",
    "CONE DE GUTA-PERCHA PRINCIPAL, 2ª SERIE N 60, CAIXA COM 120 UNIDADES",
    "CONE DE GUTA-PERCHA PRINCIPAL, 2ª SERIE N 70, CAIXA COM 120 UNIDADES",
    "CONE DE GUTA-PERCHA PRINCIPAL, 2ª SERIE N 80, CAIXA COM 120 UNIDADES",
    "CONE DE GUTA-PERCHA SECUNDARIO - FF, CAIXA COM 120 UNIDADES",
    "CONE DE GUTA-PERCHA SECUNDARIO - FM 28MM, CAIXA COM 120 UNIDADES",
    "CONE DE GUTA-PERCHA SECUNDÁRIO - MF 28MM, CAIXA COM 120 UNIDADES.",
    "CONE DE GUTA-PERCHA SECUNDÁRIO - XF 28MM",
    "CONE DE PAPEL ABSORVENTE - 2ª SERIE",
    "CREME DENTAL TUBO COM 90G UN",
    "CUNHA DE MADEIRA ANATÔMICA, SORTIDAS. CAIXA COM 100 UNIDADES.",
    "E.D.T.A TRISSODICO GEL CONCENTRACAO DE 24%, SERINGA COM 3 GRAMAS E BICO APLICADOR",
    "E.D.T.A. TRISSODICO LIQUIDO, FRASCO COM 20ML",
    "ESCOVA DE ROBSON",
    "ESCOVA DE DENTES INFANTIL, CERDAS MACIAS, DE NYLON, COM 03 FILEIRAS DE TUFOS",
    "ESPACADOR DIGITAL 1ª SERIE - CAIXA COM 6 UNIDADES, 25MM",
    "EUCALIPTOL, FRASCO 10ML",
    "EUGENOL, FRASCO 20ML",
    "FILME RADIOGRAFICO PERIAPICAL",
    "FIO DE SUTURA SEDA 3.0",
    "FIO DENTAL, SEM SABOR, EMBALAGEM COM 100M",
    "FITA MATRIZ DE ACO INOX 0,05 X 5 X 500 MM",
    "FITA MATRIZ DE ACO INOX 0,05 X 7 X 500 MM",
    "FLUORETO DE SÓDIO 2% PH NEUTRO",
    "FORMOCRESOL DILUIDO (1/5), FRASCO COM 10 ML",
    "HIDROXIDO DE CALCIO PRO-ANALISE, POTE COM 10G",
    "KIT DE ADESIVO DENTINÁRIO UNIVERSAL MONOCOMPONENTE FOTOPOLIMERIZÁVEL E CONDICIONADOR ÁCIDO GEL.",
    "KIT IRM (CIMENTO RESTAURADOR INTERMEDIÁRIO REFORÇADO À BASE DE ÓXIDO DE ZINCO E EUGENOL)",
    "KIT VERNIZ COM 5% DE FLUORETO DE SODIO",
    "LENCOL DE BORRACHA ESPESSURA MEDIA, MEIA JARDA - QUADRADO 13X13 CM, CAIXA CONTENDO 26 UNIDADES",
    "LIMA TIPO FLEXOFILE 1ª SERIE - 21 MM, CAIXA COM 6 UNIDADES",
    "LIMA TIPO FLEXOFILE 1ª SERIE - 25 MM, CAIXA COM 6 UNIDADES",
    "LIMA TIPO HEDSTROEM 1ª SERIE - 21 MM, CAIXA COM 6 UNIDADES",
    "LIMA TIPO HEDSTROEM 1ª SERIE - 25 MM, CAIXA COM 6 UNIDADES",
    "LIMA TIPO HEDSTROEM 1ª SERIE - 31 MM, CAIXA COM 6 UNIDADES",
    "LIMA TIPO HEDSTROEM 2ª SERIE - 21 MM, CAIXA COM 6 UNIDADES",
    "LIMA TIPO HEDSTROEM 2ª SERIE - 25 MM, CAIXA COM 6 UNIDADES",
    "LIMA TIPO HEDSTROEM 2ª SERIE - 31 MM, CAIXA COM 6 UNIDADES",
    "LIMA TIPO K 1ª SERIE - 21 MM, CAIXA COM 6 UNIDADES",
    "LIMA TIPO K 1ª SERIE - 31 MM, CAIXA COM 6 UNIDADES",
    "LIMA TIPO K 1ª SÉRIE - 25 MM, CAIXA COM 6 UNIDADES.",
    "LIMA TIPO K 1ºª SERIE – 31MM",
    "LIMA TIPO K 2ª SERIE - 21 MM, CAIXA COM 6 UNIDADES",
    "LIMA TIPO K 2ª SERIE - 25 MM, CAIXA COM 6 UNIDADES",
    "LIMA TIPO K 2ª SERIE - 31 MM, CAIXA COM 6 UNIDADES",
    "LIMA TIPO K ESPECIAL 06 - 21MM, CAIXA COM 6 UNIDADES",
    "LIMA TIPO K ESPECIAL 08 - 21MM, CAIXA COM 6 UNIDADES",
    "LIMA TIPO K ESPECIAL 10 - 21MM, CAIXA COM 6 UNIDADES",
    "LIMA TIPO K Nº 20 - 21MM, CAIXA COM 6 UNIDADES",
    "LIMA TIPO K ESPECIAL 06 – 25MM CAIZXA C/ 6 UNIDADES",
    "LIMA TIPO K ESPECIAL 08 – 25MM CAIZXA C/ 6 UNIDADES",
    "LIMA TIPO K Nº 20 - 25MM, CAIXA COM 6 UNIDADES",
    "LIMA TIPO K Nº 25 - 21MM, CAIXA COM 6 UNIDADES",
    "LIMA TIPO K Nº 25 - 25MM, CAIXA COM 6 UNIDADES",
    "OCULOS DE PROTECAO INCOLOR EM ACRILICO ANTI EMBACANTE E ANTI RISCOS PARA PROCEDIMENTO ODONTOLOGICOS",
    "PAPEL CARBONO PARA ARTICULACAO, DUAS CORES, EM BLOCO COM 12 TIRAS",
    "PARAMONOCLOROFENOL CANFORADO - PMCC, FRASCO COM 20ML",
    "PASTA PROFILÁTICA COM FLÚOR PARA USO ODONTOLÓGICO, TUBO COM 90G.",
    "REFIL PARA TAMBOREL PEQUENO DE ALUMINIO, TAMANHO P, PACOTE COM 50 UNIDADES",
    "RESINA RESTAURADORA NANOHÍBRIDA; REFIL NA COR A1 PARA ESMALTE",
    "RESINA RESTAURADORA NANOHÍBRIDA; REFIL NA COR A2 PARA ESMALTE.",
    "RESINA RESTAURADORA NANOHÍBRIDA; REFIL NA COR A3 PARA ESMALTE.",
    "RESINA RESTAURADORA NANOHÍBRIDA; REFIL NA COR A3,5 PARA ESMALTE.",
    "RESINA RESTAURADORA NANOHÍBRIDA; REFIL NA COR B2 PARA ESMALTE.",
    "RESINA RESTAURADORA NANOHÍBRIDA; REFIL NA COR C2 PARA ESMALTE.",
    "RESINA RESTAURADORA SUBMICROHÍBRIDA; COR PARA ESMALTE A1 DA ESCALA VITA.",
    "SELANTE FOTOPOLIMERIZÁVEL PARA CICATRÍCULAS E FISSURAS COM LIBERAÇÃO DE FLÚOR, OPACO E COM CARGA.",
    "SOLUCAO FIXADORA RADIOGRAFICA, FRASCO 475ML",
    "SOLUCAO REVELADORA RADIOGRAFICA, FRASCO 475ML",
    "SOLUÇÃO BUCAL À BASE DE GLUCONATO DE CLOREXIDINA A 0,12%, SEM ÁLCOOL, FRASCO COM 250 ML",
    "SOLUÇÃO EVIDENCIADORA DE PLACA BACTERIANA, CONTENDO FUCSINA BÁSICA, FRASCO 10ML",
    "SUGADOR CIRÚRGICO DESCARTÁVEL EM PLÁSTICO, ESTÉRIL, ATÓXICO, EMBALADO INDIVIDUALMENTE, CAIXA COM 20",
    "SUGADOR DE SALIVA DESCARTAVEL EM PVC, TRANSPARENTE E ATOXICO - PACOTE COM 40 SUGADORES",
    "TACA DE BORRACHA PARA PROFILAXIA, PARA CONTRA-ANGULO",
    "TIRA DE ACO ABRASIVA PARA AMALGAMA, LIXA DE ACO, MONOFACE DE 4MM, CAIXA COM 12 TIRAS",
    "TIRA DE LIXA PARA POLIMENTO E ACABAMENTO DENTAL 4X170MM, CAIXA COM 150 TIRAS",
    "TIRA DE POLIÉSTER DE 10X120X0,05MM, CAIXA COM 50 TIRAS.",
    "TRICRESOLFORMALINA EM FRASCO 10ML"
];


function partiStringESepararPorVirgula(listaStringConcatenada){
    const lista = listaStringConcatenada
    const linhas = lista.trim().split('\n');
    const itens = linhas.map(item => `"${item.trim()}"`).join(',\n');
    console.log(itens)
}


/*

Implementar:
[X] adicionar icone lado direito
[X] alterar background do input para ficar visível para preenchimento
[X] salvar no local storage inputs da unidade requerente.
[X] salvar no local storage inputs dos itens.
[] implementar botão para salvar em pdf em nova aba.
[] mover lista de itens para um arquivo externo ao index.js
[] implementar download de arquivo json para com dados preenchidos nos inputs
[] implementar upload de arquivo json para preencher input
[] mensagem no rodapé do desenvolvedor na pagina


*/


// Link úteis
// https://igorescobar.github.io/jQuery-Mask-Plugin/docs.html