var geoserverUrl = "http://localhost:8082/geoserver";
const center = [-15.6277,  -46.4242];
var lati = 0
var longi = 0;
var pathLayer = L.geoJSON(null);

var markerHtmlStyles = `
  background-color: #0000FF;
  width: 2.5rem;
  height: 2.5rem;
  display: block;
  left: -1rem;
  top: -1.5rem;
  position: relative;
  border-radius: 3rem 3rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`;

const icon = L.divIcon({
  className: "my-custom-pin",
  iconAnchor: [0, 24],
  labelAnchor: [-6, 0],
  popupAnchor: [0, -36],
  html: `<span style="${markerHtmlStyles}" />`
});

markerHtmlStyles = `
  background-color: #FF0000;
  width: 2.5rem;
  height: 2.5rem;
  display: block;
  left: -1rem;
  top: -1.5rem;
  position: relative;
  border-radius: 3rem 3rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`;

const icon2 = L.divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    labelAnchor: [-6, 0],
    popupAnchor: [0, -36],
    html: `<span style="${markerHtmlStyles}" />`
});
var layerGroup;
var marker;
var marker2;

var polygon;
var whatcher;
var menu;
//Cachoeira = 1
//Igrejinha = 2

var map = L.map('map', {
    center: center,
    zoom: 15
});


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
            url = `${geoserverUrl}/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=Buritis:vertice_mais_perto&outputformat=application/json&viewparams=x:${long};y:${lat}`;
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

var botaoCachoeira = document.getElementById("cachoeiraBtn");
var botaoIgrejinha = document.getElementById("igrejinhaBtn");
var botaoIgrejaMatriz = document.getElementById("igrejaMatrizBtn");

var botaoVoltar = document.getElementById("botaoVoltar");
var botaoVoltarRota = document.getElementById("botaoVoltarRota");

var manual = false;
var radioAuto = document.getElementById("radioAuto");
var radioManual = document.getElementById("radioManual");

var divMenu = document.getElementById("menu");
var divCachoeira = document.getElementById("cachoeira");
var divIgrejinha = document.getElementById("igrejinha");
var divigrejaMatriz = document.getElementById("igrejaMatriz");

var divFormaLoc = document.getElementById("localizationFormat");
var divMsgManual = document.getElementById("msgManual");


botaoCachoeira.addEventListener("click", function(){
    menu = 1;
    esconderMenu();
    divCachoeira.style.display = "block";
    lati = -15.69496;
    longi = -46.41747;
    map.setView([lati, longi], 15, {animate: true});
    marker = L.marker([lati, longi], {
        title: "Cachoeira",
        icon: icon
    });
    layerGroup.addTo(map);
    layerGroup.addLayer(marker);
});

botaoIgrejinha.addEventListener("click", function(){
    menu = 2;
    esconderMenu();
    divIgrejinha.style.display = "block";
    lati = -15.61846;
    longi = -46.42318;
    map.setView([lati, longi], 17, {animate: true});
    marker = L.marker([lati, longi], {
        title: "Igrejinha",
        icon: icon
    });
    layerGroup.addTo(map);
    layerGroup.addLayer(marker);
});

botaoIgrejaMatriz.addEventListener("click", function(){
    menu = 3;
    esconderMenu();
    divigrejaMatriz.style.display = "block";
    lati = -15.62461;
    longi = -46.42253;
    map.setView([lati, longi], 17, {animate: true});
    marker = L.marker([lati, longi], {
        title: "Igreja Matriz",
        icon: icon
    });
    layerGroup.addTo(map);
    layerGroup.addLayer(marker);
});


botaoNavegar.addEventListener("click", function(){
    makeRoute(lati, longi, manual);
    divCachoeira.style.display = "none";
    divIgrejinha.style.display = "none";
    divigrejaMatriz.style.display = "none";
    botaoVoltar.style.display = "none";
    botaoNavegar.style.display = "none";
    botaoVoltarRota.style.display = "block";
    divFormaLoc.style.display = "block";
    
    divMsgManual.style.display = "none";
    if(manual == true){
        divMsgManual.style.display = "block";
    }
})

botaoVoltarRota.addEventListener("click", function(){
    botaoVoltarRota.style.display = "none";
    map.removeLayer(pathLayer);
    navigator.geolocation.clearWatch(whatcher);
    divFormaLoc.style.display = "none";
    divMsgManual.style.display = "none";
    
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
    divigrejaMatriz.style.display = "none";
    botaoVoltar.style.display = "none";
    botaoNavegar.style.display = "none";
    divMenu.style.display = "block";
    map.removeLayer(layerGroup);
    layerGroup = L.layerGroup();
    map.setView(center, 15, {animate: true});
})

function esconderMenu(){
    divMenu.style.display = "none";
    botaoVoltar.style.display = "block";
    botaoNavegar.style.display = "block";
}

radioAuto.addEventListener("change", () => {
    manual = !manual;
    map.removeLayer(pathLayer);
    navigator.geolocation.clearWatch(whatcher);
    if(marker2 != null){
        layerGroup.removeLayer(marker2);
    }
    botaoNavegar.click();
});

radioManual.addEventListener("change", () => {
    manual = !manual;
    map.removeLayer(pathLayer);
    navigator.geolocation.clearWatch(whatcher);
    if(marker2 != null){
        layerGroup.removeLayer(marker2);
    }
    botaoNavegar.click();
})