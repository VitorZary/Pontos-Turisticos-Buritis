import {markerRed, markerBlue} from './Marcadores.js';
import {caminho_mais_curto, vertice_mais_perto} from './Geoserver.js';


const center = [-15.6277,  -46.4242];
var map = L.map('map', {
    center: center,
    zoom: 15
});
L.tileLayer('http://localhost:8080/tile/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


const urlPontosTuristicos = "http://localhost:8000/api/v1/pontosturisticos";
const urlImagens = "http://localhost:8000/api/v1/imagens";
const urlFotos = "http://localhost:8000/storage";
const urlLogin = "http://localhost:8000/api/v1/login";
const urlLogout = "http://localhost:8000/api/v1/logout";
const urlUsuarios = "http://localhost:8000/api/v1/users";

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
var imagensPontoTuristico = null;

var list_menu = document.getElementById("list-menu");
var msg_erro_list_menu = document.getElementById("msg_erro_list_menu");

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
var msg_erro_login = document.getElementById("msg_erro_login");
var usuario_token = null;
var usuario_nome = null;
var usuario_id = null;
var usuario_e_admin = null;

var btn_add_usuario = document.getElementById("btn_add_usuario");
var btn_add_ponto = document.getElementById("btn_add_ponto");
var div_add_ponto_turistico = document.getElementById("div_add_ponto_turistico");
var div_add_ponto_marcador = document.getElementById("div_add_ponto_marcador"); 
var div_add_ponto_form = document.getElementById("div_add_ponto_form");
var cancelar_salvar_ponto = document.getElementById("cancelar_salvar_ponto");

var div_add_usuario = document.getElementById("div_add_usuario");  

var form_add_ponto_turistico = document.getElementById("form_add_ponto_turistico");
var add_ponto_turistico_marker = false;
var form_add_usuario = document.getElementById("form_add_usuario");

var addU_nome = document.getElementById("addU_nome");
var addU_email = document.getElementById("addU_email");
var addU_senha = document.getElementById("addU_senha");
var addU_admin = document.getElementById("addU_admin");

var addPo_titulo = document.getElementById("addPo_titulo");
var addPo_descricao = document.getElementById("addPo_descricao");
var addPo_imagens = document.getElementById("addPo_imagens");

var mensagem_cad_ponto_turistico = document.getElementById("mensagem_cad_ponto_turistico");
var mensagem_cad_usuario = document.getElementById("mensagem_cad_usuario");

var carouselPontosTuristicos = document.getElementById("carouselPontosTuristicos");

var esta_log = false;
var btn_remover_p_turistico = document.getElementById("btn_remover_p_turistico");
var msgErroDeletarPonto = document.getElementById("msgErroDeletarPonto");



window.onload = function(){
    mostrarPontosTuristicos(urlPontosTuristicos);
    esta_logado();
}

function makeRoute (lat, long) {
    let source;
    let target;

    target = vertice_mais_perto(lat,long);

    if(manual == true){
        
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
    resetarTodosComponentes();
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
    resetarTodosComponentes();
    mostrarPontoTuristico(PontoTuristicoId);
    if(marker2 != null){
        layerGroupMarkers.removeLayer(marker2);
    }
})

botaoVoltar.addEventListener("click", function(){
    resetarTodosComponentes();
    menu_usuario.style.display = "flex";
    divMenu.style.display = "block";
    map.setView(center, 15, {animate: true});
    esta_logado();
    mostrarPontosTuristicos(urlPontosTuristicos);
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

async function mostrarPontosTuristicos(url) {
    var response;

    try {
        response = await fetch(url);
    } catch (e) {
        msg_erro_list_menu.style.display = "block";
        msg_erro_list_menu.innerText = "Houve um erro no servidor, por favor tente mais tarde."
    }
     
    var data = await response.json();

    resetarTodosComponentes();
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
    resetarTodosComponentes();
    botaoVoltar.style.display = "block";
    botaoNavegar.style.display = "block";
    msgErroDeletarPonto.style.display = "none";

    var responsePontoTuristico = await fetch(`${urlPontosTuristicos}/${id}`);
    
    const ponto = await responsePontoTuristico.json();

    mostrarConteudo.style.display = "block";
    btn_remover_p_turistico.style.display = "none";
    tituloPontoTuristico.innerText = ponto.data.titulo;
    descricaoPontoTurisitico.innerText = ponto.data.descricao;
    lati = ponto.data.latitude;
    longi = ponto.data.longitude;
    ponto_titulo = ponto.data.titulo;
    PontoTuristicoId = id;
    imagensPontoTuristico = ponto.data.imagens;
    carouselPontosTuristicos.innerHTML = ``;

    var contImage = 0;
    imagensPontoTuristico.forEach(element => {
        if(contImage == 0){
            carouselPontosTuristicos.innerHTML = carouselPontosTuristicos.innerHTML + `<div class="carousel-item active">
                <img src="${urlFotos}/${element.imagem}" class="d-block w-100">
              </div>`;
        }else{
            carouselPontosTuristicos.innerHTML = carouselPontosTuristicos.innerHTML + `<div class="carousel-item">
                <img src="${urlFotos}/${element.imagem}" class="d-block w-100">
              </div>`;
        }
        contImage++;
    });

    if(esta_log == true){
        btn_remover_p_turistico.style.display = "block";
    }

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
    resetarTodosComponentes();
    div_formulario_login.style.display = "block";
    botaoVoltar.style.display = "block";
    menu_usuario.style.display = "none";
});

botao_logout.addEventListener("click", async function(){
    const response = await fetch(urlLogout, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${usuario_token}`
        }
    });

    const data = await response.json();

    if(data.status == 200){
        localStorage.clear();
        botao_login.style.display = 'block';
        usuario_name.innerText = "Usuário"
        usuario_token = null;
        usuario_nome = null;
        usuario_id = null;
        botaoVoltar.click();
        esta_log = false;
        btn_add_usuario.style.display = "none";
        btn_add_ponto.style.display = "none";
        botao_logout.style.display = "none";
        botao_login.style.display = "block";
    }else{
        window.alert("Usuário não está logado!");
        esta_logado();
    }
    
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

async function login(credenciais){
    var response;
    try {
        response = await fetch(urlLogin, {
            method: "POST",
            body: credenciais,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (e) {
        msg_erro_login.style.display = "block";
        msg_erro_login.innerText = "Houve um erro no servidor, por favor tente mais tarde."
    }
    

    const data = await response.json();

    if(data.message == "Authorized"){
        localStorage.clear();
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("nome", data.data.nome);
        localStorage.setItem("id", data.data.id);
        localStorage.setItem("admin", data.data.admin);
        botaoVoltar.click();
        msg_erro_login.style.display = "none";
        esta_logado();
    }else{
        msg_erro_login.style.display = "block";
        msg_erro_login.innerText = "Credenciais Inválidas"
    }
}

async function esta_logado() {
    var token = localStorage.getItem("token");
    if(token != null){
        var response = await fetch(urlImagens, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if(response.status == 200){
            usuario_token = token;
            usuario_nome = localStorage.getItem("nome");
            usuario_id = localStorage.getItem("id");
            usuario_e_admin = localStorage.getItem("admin");
            botao_login.style.display = "none";
            usuario_name.innerText = `Bem vindo ${usuario_nome}`;
            btn_add_ponto.style.display = "block";
            if(usuario_e_admin == true){
                btn_add_usuario.style.display = "block";
            }
            
            botao_logout.style.display = "block";
            botao_login.style.display = "none";
            esta_log = true;
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

btn_add_ponto.addEventListener("click", function(){
    resetarTodosComponentes();
    btn_add_ponto.style.display = "none";
    btn_add_usuario.style.display = "none";
    botaoVoltar.style.display = "block";
    add_ponto_turistico_marker = true;
    div_add_ponto_turistico.style.display = "block";
    mensagem_cad_ponto_turistico.style.display = "none";
});

btn_add_usuario.addEventListener("click", function(){
    resetarTodosComponentes();
    btn_add_ponto.style.display = "none";
    btn_add_usuario.style.display = "none";
    botaoVoltar.style.display = "block";
    div_add_usuario.style.display = "block";
    mensagem_cad_usuario.style.display = "none";
    mensagem_cad_ponto_turistico.style.display = "none";
});

function resetarTodosComponentes() {
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
    add_ponto_turistico_marker = false;
    msg_erro_login.style.display = "none";
    mensagem_cad_usuario.style.display = "none";
    campo_login.value = "";
    campo_senha.value = "";
    document.getElementById('map').style.cursor = '';
}

form_add_ponto_turistico.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    var dadosPontoTuristico = {
        titulo: addPo_titulo.value,
        descricao: addPo_descricao.value,
        latitude: marker.getLatLng().lat,
        longitude: marker.getLatLng().lng,
        user_id: usuario_id
    }

    dadosPontoTuristico = JSON.stringify(dadosPontoTuristico);

    const responsePonto = await fetch(urlPontosTuristicos, {
        method: "POST",
        body: dadosPontoTuristico,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${usuario_token}`
        }
    });

    const pontoturistico = await responsePonto.json();

    if(responsePonto.status == 200){
        const pontoTuristicoId = pontoturistico.data.id;
        var responseImagens = [];
        var error = false;

        for (const file of addPo_imagens.files){

            const bodyR = new FormData();
            bodyR.append('imagem', file);
            bodyR.append('pontos_turisticos_id', pontoTuristicoId);

            var response = await fetch(urlImagens, {
                method: "POST",
                body: bodyR,
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${usuario_token}`
                }
            });

            responseImagens.push(await response.json());
        }

        responseImagens.forEach(element => {
            if(element.status != 200){
                error = true;
            }
        });

        if(error == false){
            mensagem_cad_ponto_turistico.innerText = "Ponto Turístico cadastrado com sucesso!";
            mensagem_cad_ponto_turistico.style.color = "green";
            mensagem_cad_ponto_turistico.style.display = "block";
            setTimeout(() => {
                cancelar_salvar_ponto.click();
                botaoVoltar.click();
            }, 4000);
        }else{
            mensagem_cad_ponto_turistico.innerText = "Houve um erro ao fazer o upload de uma ou mais imagens!";
            mensagem_cad_ponto_turistico.style.color = "red";
            mensagem_cad_ponto_turistico.style.display = "block";
        }

    }else{
        mensagem_cad_ponto_turistico.innerText = "Houve um erro ao cadastrar o Ponto Turístico!";
        mensagem_cad_ponto_turistico.style.color = "red";
        mensagem_cad_ponto_turistico.style.display = "block";
    }

});

form_add_usuario.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    console.log(addU_admin.checked);

    var dadosUsuario = {
        nome: addU_nome.value,
        email: addU_email.value,
        password: addU_senha.value,
        usuario_que_cadastrou: usuario_id,
        admin: addU_admin.checked ? 1 : 0
    }

    dadosUsuario = JSON.stringify(dadosUsuario);

    const response = await fetch(urlUsuarios, {
        method: "POST",
        body: dadosUsuario,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${usuario_token}`
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

map.on('click', function(e) {
    if(add_ponto_turistico_marker == true){
        marker = L.marker([e.latlng.lat, e.latlng.lng], {
            icon: markerRed
        });
        layerGroupMarkers.clearLayers();
        layerGroupMarkers.addLayer(marker);
        layerGroupMarkers.addTo(map);
        div_add_ponto_marcador.style.display = "none";
        div_add_ponto_form.style.display = "block";
        add_ponto_turistico_marker = false;
        cancelar_salvar_ponto.style.display = "block";
        botaoVoltar.style.display = "none";
        document.getElementById('map').style.cursor = '';
    }
});

map.on('mouseover', function(e){
    if(add_ponto_turistico_marker == true){
        document.getElementById('map').style.cursor = 'pointer';
    }
})

cancelar_salvar_ponto.addEventListener('click', () => {
    div_add_ponto_marcador.style.display = "block";
    div_add_ponto_form.style.display = "none";
    botaoVoltar.style.display = "block";
    cancelar_salvar_ponto.style.display = "none";
    add_ponto_turistico_marker = true;
    layerGroupMarkers.clearLayers();
    addPo_descricao.value = "";
    addPo_titulo.value = "";
    addPo_imagens.value = "";
});

btn_remover_p_turistico.addEventListener('click', async () => {
    var erro = false;
    var response;
    var data;

    var resultado = confirm("Deseja realmente apagar o ponto turístico?");

    if(resultado == true){
        imagensPontoTuristico.forEach(async element => {
            response = await fetch(`${urlImagens}/${element.id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${usuario_token}`
                }
            });
            data = await response.json();
    
            if(data.status != 200){
                erro = true;
            }
        });
    
        if(erro == true){
            msgErroDeletarPonto.style.display = "block";
            msgErroDeletarPonto.style.color = "red";
            msgErroDeletarPonto.innerText = "Houve um erro ao deletar o ponto turístico!";
        }else{
            response = await fetch(`${urlPontosTuristicos}/${PontoTuristicoId}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${usuario_token}`
                }
            });
            data = await response.json();
    
            if(data.status == 200){
                msgErroDeletarPonto.style.display = "block";
                msgErroDeletarPonto.style.color = "green";
                msgErroDeletarPonto.innerText = "Ponto Turístico Deletado com sucesso!";
                setTimeout(() => {
                    botaoVoltar.click()
                }, 4000);
            }else{
                msgErroDeletarPonto.style.display = "block";
                msgErroDeletarPonto.style.color = "red";
                msgErroDeletarPonto.innerText = "Houve um erro ao deletar o ponto turístico!";
            }
        }
    }
    
});