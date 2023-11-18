let listaChamados = [];

window.addEventListener("DOMContentLoaded", (event) => {
    let listCall = JSON.parse(localStorage.getItem('listCall'));
    listaChamados = listCall === null ? [] : listCall;
    if (listaChamados.length > 0) {
        atualizarListaChamados();
        esconderDivAddItensAoChamado();
    }
    if(localStorage.getItem('unidadeCall')) {
        document.getElementById('unidade').value = localStorage.getItem('unidadeCall');
    }
});

function adicionarItemAoChamado() {
    const equipamento = document.getElementById("equipamento").value;
    const numeroSerie = document.getElementById("numero_serie").value;
    const patrimonioTombamento = document.getElementById("patrimonio_tombamento").value;
    const problemaInformado = document.getElementById("problema_informado").value;

    if (!equipamento) {
        return alert (`Os campo EQUIPAMENTO precisam ser preenchidos.`);
    }
    if (!numeroSerie && !patrimonioTombamento) {
        return alert (`É necessario preencher o campo NÚMERO DE SÉRIE ou NÚMERO DE PATRIMÓNIO`);
    }
    if (!problemaInformado) {
        return alert (`Os campo PROBLEMA INFORMADO precisam ser preenchidos.`);
    }

    const novoChamado = {
        item: listaChamados.length + 1,
        equipamento: equipamento.trim(),
        numero_serie: numeroSerie.trim(),
        patrimonio_tombamento: patrimonioTombamento.trim(),
        problema_informado: problemaInformado.trim()
    };

    listaChamados.push(novoChamado);
    limparCamposItemDoChamado();
    atualizarListaChamados();
    esconderDivAddItensAoChamado();
};

function limparCamposItemDoChamado() {
    document.getElementById("equipamento").value = "";
    document.getElementById("numero_serie").value = "";
    document.getElementById("patrimonio_tombamento").value = "";
    document.getElementById("problema_informado").value = "";    
};

function atualizarListaChamados() {
    const listaChamadosElement = document.getElementById("listaChamados");
    listaChamadosElement.innerHTML = "";

    listaChamados.forEach(chamado => {
        const listItem = document.createElement("li");
        listItem.style.backgroundColor = "aliceblue"
        
        const btnRemover = document.createElement("button");
        btnRemover.textContent = "Remover";
        btnRemover.classList.add("btn__remove_item");
        listItem.appendChild(btnRemover);
        
        listItem.innerHTML += `
        <strong>${chamado.item}.</strong> 
        Equipamento: <strong>${chamado.equipamento}</strong>, 
        Número de Série: <strong>${chamado.numero_serie}</strong>, 
        Patrimônio/Tombamento: <strong>${chamado.patrimonio_tombamento}</strong>, 
        Problema: <strong>${chamado.problema_informado}</strong>`;
        listaChamadosElement.appendChild(listItem);        
    });
    saveCallListInLocalStorage(JSON.stringify(listaChamados));
    
    // ouvinte de evento de clique ao elemento pai (ul)
    listaChamadosElement.addEventListener("click", (event) => {
        const btnRemover = event.target.closest(".btn__remove_item");
        if (btnRemover) {
            const itemToRemove = btnRemover.parentElement.textContent.match(/\d+/)[0];
            removerItemChamado(itemToRemove);
        }
    });
};

function mostrarDivAddItensAoChamado() {
    document.getElementById("divAddItensAoChamado").classList.toggle("hidden", false);
    document.getElementById("btnMostrarFormulario").classList.toggle("hidden", true);
};

function esconderDivAddItensAoChamado() {
    document.getElementById("divAddItensAoChamado").classList.toggle("hidden", true);
    document.getElementById("btnMostrarFormulario").classList.toggle("hidden", false);
};

function saveUnidadeSolicitanteLocalStorage() {
    let unidade = document.getElementById("unidade").value;
    localStorage.setItem("unidadeCall", unidade)
}

function saveCallListInLocalStorage(listaChamados){
    localStorage.setItem("listCall", listaChamados);
}

function removerItemChamado(item) {
    const index = listaChamados.findIndex(chamado => chamado.item == item);
    if (index !== -1) {
        listaChamados.splice(index, 1);
        atualizarListaChamados();
    }
};

function validarCamposUnidadeSolicitante() {
    const unidade = document.getElementById("unidade").value;
    const solicitante = document.getElementById("solicitante").value;

    if (unidade.trim() == "") {
        return "Preencha o campo UNIDADE.";
    }
    if (solicitante.trim() == "") {
        return "Preencha o campo FUNCIONÁRIO SOLICITANTE.";
    }
    if(listaChamados.length == 0){
        return "Adicione ao menos um item para a abertura do chamado técnico.";
    }    
    if(unidade.trim() !== "" && solicitante.trim() !== "") {
        return "OK";
    }
};

function enviarChamado() {
    let validacaoCampos = validarCamposUnidadeSolicitante();
    if(validacaoCampos != "OK"){
        return alert(validacaoCampos);
    }    

    const unidade = document.getElementById("unidade").value;
    const solicitante = document.getElementById("solicitante").value;
    const email = document.getElementById("email").value;
    const quantidadeListaChamado = listaChamados.length;
    const dataChamado = dateFormat(new Date());

    const chamadoAberto = {
        unidade: unidade.toUpperCase().trim(),
        solicitante: solicitante.trim(),
        email: email.trim(),
        data: dataChamado,
        quantidadeListaChamado: quantidadeListaChamado,
        listaChamado: listaChamados
    };
    // console.log(chamadoAberto);
    sendFetchPost(chamadoAberto)
}


function sendFetchPost(chamadoAberto){     
    mostrarMsgAguardeEnvio();

    let chamadoFormatado = {
        _subject: `ABRIR CHAMADO TÉCNICO: ${chamadoAberto.unidade} (DSV) - ${chamadoAberto.data}`,
        _template : "box", // box ou table        
        unidade: chamadoAberto.unidade,
        solicitante: chamadoAberto.solicitante,
        data: chamadoAberto.data,
        quantidade_de_itens_do_chamado: chamadoAberto.quantidadeListaChamado,
    }

    if (chamadoAberto.email){
        chamadoFormatado['_cc'] = chamadoAberto.email;
    }

    chamadoAberto.listaChamado.forEach((chamado, index) => {
        chamadoFormatado[`item_do_chamado_${index + 1}`] = `#${chamado.item}, EQUIPAMENTO: ${chamado.equipamento}, NUMERO DE SERIE: ${chamado.numero_serie}, PATRIMONIO/TOMBAMENTO: ${chamado.patrimonio_tombamento}, PROBLEMA INFORMADO: ${chamado.problema_informado}`;
    });

    let objPedidoString = JSON.stringify(chamadoFormatado);
    // us284sb2@gmail.com
    fetch("https://formsubmit.co/ajax/cefa54954b23bf83a8eaef0881ced408", {
        method: "POST",
        headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
        body: objPedidoString
    })
    .then(response => response.json())
    .then(data => responseOK(data, chamadoFormatado))
    .catch(error => responseError(error));
};

function mostrarMsgAguardeEnvio(){
    const mensagemAguarde = document.getElementById("mensagemAguarde");
    mensagemAguarde.style.display = "block";
    document.getElementById("chamadoForm").classList.toggle("hidden", true);
};

function removerMsgAguardarEnvio(){
    document.getElementById("msgResponse").classList.toggle("hidden", false); 
    const mensagemAguarde = document.getElementById("mensagemAguarde");
    mensagemAguarde.style.display = "block";
    mensagemAguarde.style.display = "none";
};

function responseOK(data, chamadoFormatado){
    removerMsgAguardarEnvio();
    if(data.success == "true"){
        localStorage.removeItem('listCall');
        document.getElementById('msgResponse').innerHTML = `
        <p><b>A solicitação para abrir o chamado foi enviado com sucesso!</b></p>       
        <p>Um email foi enviado para coordenação de saúde bucal.</p>
        Unidade:${chamadoFormatado.unidade}
        <p>Data: ${chamadoFormatado.data}</p>
        <p><a href="abrirchamado.html">Abrir um novo chamado</a></p>  
        <a href="index.html">Voltar para o menu principal</a>
        `;
        document.getElementById('msgResponse').style.background = '#4cb050';
        document.getElementById('msgResponse').style.color = 'white';
        console.log(data);
    } 
    if(chamadoFormatado._cc && data.success !== "true"){
        document.getElementById('msgResponse').innerHTML = `
        Erro no envio! Tente novamente mais tarde ou informe a messagem de erro para os administradores.
        messagem de erro: ${data.message}.
        <p>Se você preencheu o campo email, verifique se o email foi digitado corretamente.</p>
        Email preenchido no formulário: ${chamadoFormatado._cc}
        <p><a href="abrirchamado.html">Tentar Novamente</a></p>    
        <a href="index.html">Voltar para o menu principal</a>
        `;
        console.log(data);
    }    
    if (!chamadoFormatado._cc && data.success !== "true") {
        document.getElementById('msgResponse').innerHTML = `
        Erro no envio! Tente novamente mais tarde ou informe a messagem de erro para os administradores.
        messagem de erro: ${data.message}.
        <p><a href="abrirchamado.html">Tentar Novamente</a></p>    
        <a href="index.html">Voltar para o menu principal</a>
        `;
        console.log(data);
    }
};

function responseError(error){
    alert("Erro na Requisição: " + error)
    console.log(error);
    removerMsgAguardarEnvio();
    document.getElementById('msgResponse').innerHTML = `
    Erro no envio, Verifique a conexão da internet! 
    <p><a href="abrirchamado.html">Tentar Novamente</a></p>    
    <a href="index.html">Voltar para o menu principal</a>
    `;
};

function dateFormat(data) {   
    const dataObj = new Date(data);
    if (dataObj.toString() == "Invalid Date"){
        return `Não foi possível verificar a data`;
    }    
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    const horas = String(dataObj.getHours()).padStart(2, '0');
    const minutos = String(dataObj.getMinutes()).padStart(2, '0');
    const segundos = String(dataObj.getSeconds()).padStart(2, '0');
    
    return `${dia}-${mes}-${ano} ${horas}:${minutos}:${segundos}`;
};
