import {markerRed, markerBlue} from './Marcadores.js';
import {caminho_mais_curto, vertice_mais_perto} from './Geoserver.js';


// Mapa
const center = [-15.6277,  -46.4242];
var map = L.map('map', {
    center: center,
    zoom: 15
});
L.tileLayer('http://localhost:8080/tile/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var botaoVoltar = document.getElementById("botaoVoltar");
var botaoVoltarRota = document.getElementById("botaoVoltarRota");

var manual = false;
var radioAuto = document.getElementById("radioAuto");
var radioManual = document.getElementById("radioManual");
var msgLocalizacao = document.getElementById("msgLocalizacao");

var divMenu = document.getElementById("divMenu");

var divFormaLoc = document.getElementById("localizationFormat");
var divMsgManual = document.getElementById("msgManual");

var pathLayer = L.layerGroup();

var layerGroupMarkers = L.layerGroup();
var marker;
var marker2;

var whatcher;

var buttonHide = document.getElementById("btnHide");

var lati = 0;
var longi = 0;

var mostrarConteudo = document.getElementById("mostrarConteudo");
var tituloPontoTuristico = document.getElementById("tituloPontoTuristico");
var descricaoPontoTurisitico = document.getElementById("descricaoPontoTurisitico");
var PontoTuristicoId;
var ponto_titulo;

const urlPontosTuristicos = "http://localhost:8000/api/v1/pontosturisticos";
const urlLogin = "http://localhost:8000/api/v1/login";
const urlUsuarios = "http://localhost:8000/api/v1/users"

var list_menu = document.getElementById("list-menu");

var botoesPass = document.getElementById("botoesPass");
var botaoEsq = document.getElementById("botaoEsq");
var botaoDir = document.getElementById("botaoDir");
var pagOndeEsta = 1;
var ultima_pagina = 1;

var div_formulario_login = document.getElementById("div_formulario_login");
var formulario_login = document.getElementById("formulario_login");
var botao_login = document.getElementById("botao_login");
var botao_logout = document.getElementById("botao_logout");

var usuario_name = document.getElementById("usuario_name");
var credenciais_invalidas = document.getElementById("credenciais_invalidas");
var user_token = null;
var user_name = null;
var user_id = null;

var btn_add_usuario = document.getElementById("btn_add_usuario");
var btn_add_ponto = document.getElementById("btn_add_ponto");
var div_add_ponto_turistico = document.getElementById("div_add_ponto_turistico");   
var div_add_usuario = document.getElementById("div_add_usuario");  

var form_add_ponto_turistico = document.getElementById("form_add_ponto_turistico");
var form_add_usuario = document.getElementById("form_add_usuario");

var addU_nome = document.getElementById("addU_nome");
var addU_email = document.getElementById("addU_email");
var addU_senha = document.getElementById("addU_senha");

var addPo_titulo = document.getElementById("addPo_titulo");
var addPo_descricao = document.getElementById("addPo_descricao");
var addPo_imagens = document.getElementById("addPo_imagens");

var mensagem_cad_ponto_turistico = document.getElementById("mensagem_cad_ponto_turistico");
var mensagem_cad_usuario = document.getElementById("mensagem_cad_usuario");

window.onload = function(){
    mostrarPontosTuristicos(urlPontosTuristicos);
    esta_logado();
}

function makeRoute (lat, long) {
    let source;
    let target;

    target = vertice_mais_perto(lat,long);

    if(manual == true){
        // faz rota com base onde está o marcador vermelho
        marker2 = L.marker(center, {
            title: "Minha Localização",
            draggable: true,
            icon: markerBlue
        }).on('dragend',function(e){
            source = vertice_mais_perto(e.target.getLatLng().lat, e.target.getLatLng().lng);
            $.getJSON(caminho_mais_curto(source, target), function(data) {
                map.removeLayer(pathLayer);
                pathLayer = L.geoJSON(data);
                map.addLayer(pathLayer);
            });
            
        });
        
        layerGroupMarkers.addLayer(marker2);
        map.removeLayer(layerGroupMarkers);
        layerGroupMarkers.addTo(map);

        map.setView(center, 15, {animate: true});
        source = vertice_mais_perto(-15.6277, -46.4242);
        $.getJSON(caminho_mais_curto(source, target), function(data) {
            map.removeLayer(pathLayer);
            pathLayer = L.geoJSON(data);
            map.addLayer(pathLayer);
        });
        
    }else{
        //faz rota com base na localização
        navigator.geolocation.getCurrentPosition(function (position){
            map.setView([position.coords.latitude, position.coords.longitude], 15, {animate: true});
        });

        whatcher = navigator.geolocation.watchPosition(function (position) {
            long = position.coords.longitude;
            lat = position.coords.latitude;
           
            source = vertice_mais_perto(lat,long);
            $.getJSON(caminho_mais_curto(source, target), function(data) {
                map.removeLayer(pathLayer);
                pathLayer = L.geoJSON(data);
                map.addLayer(pathLayer);
            });
        },
        function(error){
            console.log(error)
        }, 
        {enableHighAccuracy: true, maximumAge:30000, timeout: 30000});
    }
}

botaoNavegar.addEventListener("click", function(){
    esconderTodosComponentes();
    marker = L.marker([lati, longi], {
        title: `${ponto_titulo}`,
        icon: markerRed
    });
    layerGroupMarkers.addLayer(marker);
    map.removeLayer(layerGroupMarkers);
    layerGroupMarkers.addTo(map);
    manual = radioManual.checked;
    makeRoute(lati, longi);
    botaoVoltarRota.style.display = "block";
    divFormaLoc.style.display = "block";
    msgLocalizacao.style.display = "block";
    divMsgManual.style.display = "none";
    if(manual == true){
        divMsgManual.style.display = "block";
    }
})

botaoVoltarRota.addEventListener("click", function(){
    esconderTodosComponentes();
    mostrarPontoTuristico(PontoTuristicoId);
    if(marker2 != null){
        layerGroupMarkers.removeLayer(marker2);
    }
})

botaoVoltar.addEventListener("click", function(){
    esconderTodosComponentes();
    menu_usuario.style.display = "flex";
    divMenu.style.display = "block";
    map.setView(center, 15, {animate: true});
    esta_logado();
});

radioAuto.addEventListener("change", () => {
    manual = false;
    map.removeLayer(pathLayer);
    navigator.geolocation.clearWatch(whatcher);
    if(marker2 != null){
        layerGroupMarkers.removeLayer(marker2);
    }

    makeRoute(lati, longi);
    divMsgManual.style.display = "none";
    if(manual == true){
        divMsgManual.style.display = "block";
    }
});

radioManual.addEventListener("change", () => {
    manual = true;
    map.removeLayer(pathLayer);
    navigator.geolocation.clearWatch(whatcher);
    if(marker2 != null){
        layerGroupMarkers.removeLayer(marker2);
    }

    makeRoute(lati, longi, manual);
    divMsgManual.style.display = "none";
    if(manual == true){
        divMsgManual.style.display = "block";
    }
});

// Botão esconder menu lateral
buttonHide.addEventListener("click", function(){
    let contents = buttonHide.innerHTML;
    if(contents == `<img src="icons/seta-direita.png">`){
        buttonHide.innerHTML = `<img src="icons/seta-esquerda.png">`;
        setTimeout(function toggleElements(){
            document.getElementById("conteudo-menu-lat").classList.toggle('hide-menu-lateral1');
        }, 500);
    }else{
        buttonHide.innerHTML = `<img src="icons/seta-direita.png">`;
        document.getElementById("conteudo-menu-lat").classList.toggle('hide-menu-lateral1');
    }
    document.getElementById("menu-lateral").classList.toggle('hide-menu-lateral');
    document.getElementById("mapa").classList.toggle('hide-menu-lateral2');
});

// Exibir pontos turisticos

async function mostrarPontosTuristicos(url) {
    var response = await fetch(url);
    var data = await response.json();

    esconderTodosComponentes();
    divMenu.style.display = "block";
    map.setView(center, 15, {animate: true});

    ultima_pagina = data.meta.last_page;

    if(data.meta.last_page > 1){
        botoesPass.style.display = "flex";
    }

    list_menu.innerHTML = "";

    data.data.map((pontoturistico) =>{
        
        list_menu.innerHTML = list_menu.innerHTML + `<button id="PontoTuristicoId${pontoturistico.id}" type="button"class="list-group-item list-group-item-action">${pontoturistico.titulo}</button>`;

        document.addEventListener("click", async (e) => {
            const target = e.target.closest(`#PontoTuristicoId${pontoturistico.id}`);
            
            if(target){
                mostrarPontoTuristico(pontoturistico.id);
            }
          });
    });
}

async function mostrarPontoTuristico(id){
    esconderTodosComponentes();
    botaoVoltar.style.display = "block";
    botaoNavegar.style.display = "block";
    var responsePontoTuristico = await fetch(`${urlPontosTuristicos}/${id}`);
    
    const ponto = await responsePontoTuristico.json();

    mostrarConteudo.style.display = "block";
    tituloPontoTuristico.innerText = ponto.data.titulo;
    descricaoPontoTurisitico.innerText = ponto.data.descricao;
    lati = ponto.data.latitude;
    longi = ponto.data.longitude;
    ponto_titulo = ponto.data.titulo;
    PontoTuristicoId = id;
    marker = L.marker([lati, longi], {
        title: `${ponto_titulo}`,
        icon: markerRed
    });
    layerGroupMarkers.addLayer(marker);
    map.removeLayer(layerGroupMarkers);
    layerGroupMarkers.addTo(map);
    map.setView([lati, longi], 15, {animate: true});
}

botaoEsq.addEventListener("click", function(){
    pagOndeEsta--;
    if(pagOndeEsta < 1){
        pagOndeEsta = ultima_pagina;
    }
    mostrarPontosTuristicos(urlPontosTuristicos + `?page=${pagOndeEsta}`);
});

botaoDir.addEventListener("click", function(){
    pagOndeEsta++;
    if (pagOndeEsta > ultima_pagina){
        pagOndeEsta = 1;
    }
    mostrarPontosTuristicos(urlPontosTuristicos + `?page=${pagOndeEsta}`);
}); 

botao_login.addEventListener("click", function(){
    esconderTodosComponentes();
    div_formulario_login.style.display = "block";
    botaoVoltar.style.display = "block";
    menu_usuario.style.display = "none";
});

botao_logout.addEventListener("click", function(){
    localStorage.clear();
    botao_login.style.display = 'block';
    usuario_name.innerText = "Usuário"
    user_token = null;
    user_name = null;
    user_id = null;
    botaoVoltar.click();
    btn_add_usuario.style.display = "none";
    btn_add_ponto.style.display = "none";
    botao_logout.style.display = "none";
    botao_login.style.display = "block";
});

formulario_login.addEventListener("submit", (e) => {
    e.preventDefault();
    let credenciais = {
        email: campo_login.value,
        password: campo_senha.value
    }
    credenciais = JSON.stringify(credenciais);
    login(credenciais);

});

async function esta_logado() {
    var token = localStorage.getItem("token");
    if(token != null){
        var response = await fetch(urlUsuarios, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if(response.ok){
            user_token = token;
            user_name = localStorage.getItem("nome");
            user_id = localStorage.getItem("id");
            botao_login.style.display = "none";
            usuario_name.innerText = `Bem vindo ${user_name}`;
            btn_add_ponto.style.display = "block";
            btn_add_usuario.style.display = "block";
            botao_logout.style.display = "block";
            botao_login.style.display = "none";
        }else{
            localStorage.clear();
            botao_logout.style.display = "none";
            botao_login.style.display = "block";
        }
    }else{
        localStorage.clear();
        botao_logout.style.display = "none";
        botao_login.style.display = "block";
    }

}

async function login(credenciais){
    const response = await fetch(urlLogin, {
        method: "POST",
        body: credenciais,
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await response.json();

    if(data.message == "Authorized"){
        localStorage.clear();
        botao_login.style.display = 'none';
        user_name = data.data.nome;
        user_token = data.data.token;
        user_id = data.data.id;
        usuario_name.innerText = `Bem vindo ${user_name}`;
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("nome", data.data.nome);
        localStorage.setItem("id", data.data.id);
        botaoVoltar.click();
        btn_add_ponto.style.display = "block";
        btn_add_usuario.style.display = "block";
        botao_logout.style.display = "block";
        botao_login.style.display = "none";
        menu_usuario.style.display = "flex";
    }else{
        credenciais_invalidas.style.display = "block";
    }
}

btn_add_ponto.addEventListener("click", function(){
    esconderTodosComponentes();
    btn_add_ponto.style.display = "none";
    btn_add_usuario.style.display = "none";
    botaoVoltar.style.display = "block";
    div_add_ponto_turistico.style.display = "block";
    mensagem_cad_ponto_turistico.style.display = "none";
    mensagem_cad_ponto_turistico.style.display = "none";
});

btn_add_usuario.addEventListener("click", function(){
    esconderTodosComponentes();
    btn_add_ponto.style.display = "none";
    btn_add_usuario.style.display = "none";
    botaoVoltar.style.display = "block";
    div_add_usuario.style.display = "block";
    mensagem_cad_usuario.style.display = "none";
    mensagem_cad_ponto_turistico.style.display = "none";
});

function esconderTodosComponentes() {
    divMenu.style.display = "none";
    botaoVoltar.style.display = "none";
    botaoNavegar.style.display = "none";
    botaoVoltarRota.style.display = "none";
    mostrarConteudo.style.display = "none";
    localizationFormat.style.display = "none";
    div_formulario_login.style.display = "none";
    div_add_ponto_turistico.style.display = "none";
    div_add_usuario.style.display = "none";
    pathLayer.clearLayers();
    layerGroupMarkers.clearLayers();
    navigator.geolocation.clearWatch(whatcher);
    addU_nome.value = "";
    addU_email.value = "";
    addU_senha.value = "";
    addPo_descricao.value = "";
    addPo_titulo.value = "";
    addPo_imagens.value = "";
}

form_add_ponto_turistico.addEventListener("submit", async function (e){
    e.preventDefault();
    
    var dadosPontoTuristico = {
        titulo: addPo_titulo,
        descricao: addPo_descricao,
        imagens: addPo_imagens
    }

});

form_add_usuario.addEventListener("submit", async function (e){
    e.preventDefault();
    
    var dadosUsuario = {
        nome: addU_nome.value,
        email: addU_email.value,
        password: addU_senha.value,
        usuario_que_cadastrou: user_id
    }

    dadosUsuario = JSON.stringify(dadosUsuario);

    const response = await fetch(urlUsuarios, {
        method: "POST",
        body: dadosUsuario,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${user_token}`
        }
    });

    const usuario = await response.json();

    if(response.status == 200){
        mensagem_cad_usuario.style.display = "block";
        mensagem_cad_usuario.style.color = "green";
        mensagem_cad_usuario.innerText = "Usuário Cadastrado com sucesso!";
    }else{
        if(response.status == 422 && usuario.errors.email != null){
            mensagem_cad_usuario.style.display = "block";
            mensagem_cad_usuario.style.color = "red";
            mensagem_cad_usuario.innerText = "O email informado já foi cadastrado! Por favor utilize outro email!";
        }else{
            mensagem_cad_usuario.style.display = "block";
            mensagem_cad_usuario.style.color = "red";
            mensagem_cad_usuario.innerText = "Houve um erro ao cadastrar o usuário!";
        }   
    }
});

