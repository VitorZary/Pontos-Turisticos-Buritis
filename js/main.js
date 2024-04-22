var geoserverUrl = "http://localhost:8082/geoserver";
const center = [-15.6277,  -46.4242];
var lati = 0
var longi = 0;
var pathLayer = L.geoJSON(null);

var icon = L.icon({
    iconUrl: 'icons/marker-red.png',
    iconSize: [45, 45], 
    iconAnchor: [22, 45],
    popupAnchor: [22, 22],
});

var icon2 = L.icon({
    iconUrl: 'icons/marker-blue.png',
    iconSize: [45, 45], 
    iconAnchor: [22, 45],
    popupAnchor: [22, 22],
});

var layerGroup;
var marker;
var marker2;

var polygon;
var whatcher;

var map = L.map('map', {
    center: center,
    zoom: 15
});

var menu;
//Cachoeira = 1
//Igrejinha = 2
//Igreja Matriz = 3

var pgsCachoeira = 2;
var pgsIgrejinha = 2;
var pgsIgrejaMatriz = 2;

var botaoCachoeira = document.getElementById("cachoeiraBtn");
var botaoIgrejinha = document.getElementById("igrejinhaBtn");
var botaoIgrejaMatriz = document.getElementById("igrejaMatrizBtn");

var botaoVoltar = document.getElementById("botaoVoltar");
var botaoVoltarRota = document.getElementById("botaoVoltarRota");

var manual = false;
var radioAuto = document.getElementById("radioAuto");
var radioManual = document.getElementById("radioManual");
var msgLocalizacao = document.getElementById("msgLocalizacao");

var botaoEsq = document.getElementById("botaoEsq");
var botaoDir = document.getElementById("botaoDir");
var pgOndEsta = 1;

var divMenu = document.getElementById("menu");
var divCachoeira = document.getElementById("Cachoeira");
var divCachoeira2 = document.getElementById("Cachoeira2");
var divIgrejinha = document.getElementById("Igrejinha");
var divIgrejinha2 = document.getElementById("Igrejinha2")
var divIgrejaMatriz = document.getElementById("IgrejaMatriz");
var divIgrejaMatriz2 = document.getElementById("IgrejaMatriz2");
var textoPagina = document.getElementById("pag");

var divFormaLoc = document.getElementById("localizationFormat");
var divMsgManual = document.getElementById("msgManual");


L.tileLayer('http://localhost:8080/tile/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

layerGroup = L.layerGroup();

function makeRoute (lat, long, manual) {
    let source;
    let features;
    let target;
    var url;

    target = vertice_mais_perto(lat,long);

    if(manual == true){
        // faz rota com base no marcador
        marker2 = L.marker(center, {
            title: "Minha Localização",
            draggable: true,
            icon: icon2
        }).on('dragend',function(e){
            source = vertice_mais_perto(e.target.getLatLng().lat, e.target.getLatLng().lng);
            caminho_mais_curto(source, target);
        });
        

        layerGroup.addLayer(marker2);
        map.removeLayer(layerGroup);
        layerGroup.addTo(map);


        map.setView(center, 15, {animate: true});
        source = vertice_mais_perto(-15.6277, -46.4242);
        caminho_mais_curto(source, target);
        
    }else{
        //faz rota com base na localização
        navigator.geolocation.getCurrentPosition(function (position){
            map.setView([position.coords.latitude, position.coords.longitude], 15, {animate: true});
        });

        whatcher = navigator.geolocation.watchPosition(function (position) {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            url = `http://localhost:8082/geoserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=Buritis:vertice_mais_perto&outputformat=application/json&viewparams=x:${long};y:${lat}`;
            $.ajax({
                url: url,
                async: false,
                success: function(data) {
                    features = data.features;
                    source = features[0].properties.id;
                }
            });
            caminho_mais_curto(source, target);
        },
        function(error){
            console.log(error)
        }, 
        {enableHighAccuracy: true, maximumAge:30000, timeout: 30000});
    }
}

function caminho_mais_curto(source, target){
    url = `${geoserverUrl}/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=Buritis:caminho_mais_curto&outputformat=application/json&viewparams=source:${source};target:${target}`
            
    $.getJSON(url, function(data) {
        map.removeLayer(pathLayer);
        pathLayer = L.geoJSON(data);
        map.addLayer(pathLayer);
    });
}

function vertice_mais_perto(lat,long){
    url = `${geoserverUrl}/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=Buritis:vertice_mais_perto&outputformat=application/json&viewparams=x:${long};y:${lat}`;
    $.ajax({
        url: url,
        async: false,
        success: function(data) {
            features = data.features;
            target = features[0].properties.id;
        }
    });
    return target;
}

botaoEsq.addEventListener("click", function(){
    pgOndEsta = pgOndEsta - 1;
    exibirPagina();
})

botaoDir.addEventListener("click", function(){
    pgOndEsta = pgOndEsta + 1;
    exibirPagina();
})


function tratarPagina(pgOndTa, pgs){
    if(pgOndTa > pgs){
        pgOndEsta = 1;
    }
    if(pgOndTa < 1){
        pgOndEsta = 2;
    } 
    
}

function exibirPagina(){
    switch(menu){
        case 1:
            tratarPagina(pgOndEsta, pgsCachoeira);
        
            switch(pgOndEsta){
                case 1:
                    divCachoeira.style.display = "block";
                    divCachoeira2.style.display = "none";
                    textoPagina.textContent = "Pág. 1";
                break;
                case 2:
                    divCachoeira.style.display = "none";
                    divCachoeira2.style.display = "block";
                    textoPagina.textContent = "Pág. 2";
                break;
            }
        break;
        case 2:
            tratarPagina(pgOndEsta, pgsIgrejinha);
            switch(pgOndEsta){
                case 1:
                    divIgrejinha.style.display = "block";
                    divIgrejinha2.style.display = "none";
                    textoPagina.textContent = "Pág. 1";
                break;
                case 2:
                    divIgrejinha.style.display = "none";
                    divIgrejinha2.style.display = "block";
                    textoPagina.textContent = "Pág. 2";
                break;
            }
        break;
        case 3:
            tratarPagina(pgOndEsta, pgsIgrejaMatriz);
            switch(pgOndEsta){
                case 1:
                    divIgrejaMatriz.style.display = "block";
                    divIgrejaMatriz2.style.display = "none";
                    textoPagina.textContent = "Pág. 1";
                break;
                case 2:
                    divIgrejaMatriz.style.display = "none";
                    divIgrejaMatriz2.style.display = "block";
                    textoPagina.textContent = "Pág. 2";
                break;
            }
        break;
    }
}

botaoCachoeira.addEventListener("click", function(){
    menu = 1;
    esconderMenu();
    lati = -15.69496;
    longi = -46.41747;
    map.setView([lati, longi], 15, {animate: true});
    marker = L.marker([lati, longi], {
        title: "Cachoeira",
        icon: icon
    });
    layerGroup.addTo(map);
    layerGroup.addLayer(marker);
    mostrarPassadores();
    pgOndEsta = 1;
    exibirPagina();
});

botaoIgrejinha.addEventListener("click", function(){
    menu = 2;
    esconderMenu();
    lati = -15.61846;
    longi = -46.42318;
    map.setView([lati, longi], 17, {animate: true});
    marker = L.marker([lati, longi], {
        title: "Igrejinha",
        icon: icon
    });
    layerGroup.addTo(map);
    layerGroup.addLayer(marker);
    mostrarPassadores();
    pgOndEsta = 1;
    exibirPagina();
});

botaoIgrejaMatriz.addEventListener("click", function(){
    menu = 3;
    esconderMenu();
    lati = -15.62461;
    longi = -46.42253;
    map.setView([lati, longi], 17, {animate: true});
    marker = L.marker([lati, longi], {
        title: "Igreja Matriz",
        icon: icon
    });
    layerGroup.addTo(map);
    layerGroup.addLayer(marker);
    mostrarPassadores();
    pgOndEsta = 1;
    exibirPagina();
});


botaoNavegar.addEventListener("click", function(){
    manual = radioManual.checked;
    makeRoute(lati, longi, manual);
    divCachoeira.style.display = "none";
    divIgrejinha.style.display = "none";
    divIgrejaMatriz.style.display = "none";
    divCachoeira2.style.display = "none";
    divIgrejinha2.style.display = "none";
    divIgrejaMatriz2.style.display = "none";
    botaoVoltar.style.display = "none";
    botaoNavegar.style.display = "none";
    botaoVoltarRota.style.display = "block";
    divFormaLoc.style.display = "block";
    msgLocalizacao.style.display = "block";
    
    divMsgManual.style.display = "none";
    if(manual == true){
        divMsgManual.style.display = "block";
    }
    esconderPassadores();
})

botaoVoltarRota.addEventListener("click", function(){
    botaoVoltarRota.style.display = "none";
    map.removeLayer(pathLayer);
    navigator.geolocation.clearWatch(whatcher);
    divFormaLoc.style.display = "none";
    divMsgManual.style.display = "none";
    msgLocalizacao.style.display = "none";
    
    if(marker2 != null){
        layerGroup.removeLayer(marker2);
    }

    switch (menu) {
        case 1:
            botaoCachoeira.click();
            break;
        case 2:
            botaoIgrejinha.click();
            break;
        case 3:
            botaoIgrejaMatriz.click();
            break;
    }

})

botaoVoltar.addEventListener("click", function(){
    divCachoeira.style.display = "none";
    divIgrejinha.style.display = "none";
    divIgrejaMatriz.style.display = "none";
    divCachoeira2.style.display = "none";
    divIgrejinha2.style.display = "none";
    divIgrejaMatriz2.style.display = "none";
    botaoVoltar.style.display = "none";
    botaoNavegar.style.display = "none";
    divMenu.style.display = "block";
    map.removeLayer(layerGroup);
    layerGroup = L.layerGroup();
    map.setView(center, 15, {animate: true});
    esconderPassadores();
})

function esconderMenu(){
    divMenu.style.display = "none";
    botaoVoltar.style.display = "block";
    botaoNavegar.style.display = "block";
}

radioAuto.addEventListener("change", () => {
    manual = false;
    map.removeLayer(pathLayer);
    navigator.geolocation.clearWatch(whatcher);
    if(marker2 != null){
        layerGroup.removeLayer(marker2);
    }

    makeRoute(lati, longi, manual);
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
        layerGroup.removeLayer(marker2);
    }

    makeRoute(lati, longi, manual);
    divMsgManual.style.display = "none";
    if(manual == true){
        divMsgManual.style.display = "block";
    }
})


var buttonHide = document.getElementById("btnHide");

buttonHide.addEventListener("click", function(){
    let contents = buttonHide.innerHTML;
    console.log(contents);
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
    buttonHide.classList.toggle('hide-menu-lateral3');
});

function toggleElements(){
    document.getElementById("conteudo-menu-lat").classList.toggle('hide-menu-lateral1');
}

function mostrarPassadores(){
    document.getElementById("botoesPass").style.display = "flex";
}

function esconderPassadores(){
    document.getElementById("botoesPass").style.display = "none";
}

