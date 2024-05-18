<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buritis - Pontos Turisticos</title>

    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""/>

    <link rel="stylesheet" href="bootstrap-5.3.1-dist/css/bootstrap.min.css">
   <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div id="menu-lateral" class="rounded">
      <div id="conteudo-menu-lat" class="container">

        <div id="menu"> 
        <h4 id="title">Pontos Turísticos <span>BURITIS-MG</span></h4>
          <div class="list-group rounded">
              <button type="button" id="cachoeiraBtn" class="list-group-item list-group-item-action">Cachoeira da Barriguda</button>
              <button type="button" id="igrejinhaBtn" class="list-group-item list-group-item-action">Igrejinha</button>
              <button type="button" id="igrejaMatrizBtn" class="list-group-item list-group-item-action">Igreja Matriz Nossa Senhora da Pena</button>
          </div>
        </div>
    
        <div id="buttonsCore">
          <button type="button" id="botaoVoltar"class="btn btn-light">Voltar</button>
          <button type="button" id="botaoNavegar"class="btn btn-primary">Traçar rota até</button>
          <button type="button" id="botaoVoltarRota"class="btn btn-light">Voltar</button>
        </div>
        
        <div id="localizationFormat">
          <h4>Forma de Localização</h4>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="radioLocalization" id="radioAuto" checked>
            <label class="form-check-label" for="radioLocalization">
              Automática
            </label>
            <p id="msgLocalizacao">(A localização automática pode demorar alguns instantes)</p>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="radioLocalization" id="radioManual">
            <label class="form-check-label" for="flexRadioDefault1" id="radioMarker">
              Manual
            </label>
          </div>
        </div>
        <div id="msgManual">
          <p>Arraste o marcador em azul para selecionar sua Localização</p>
        </div>

        <div id="botoesPass">
          <button id="botaoEsq"><img src="icons/seta-esquerda.png"></button>
          <p id="pag">Pág. 1</p>
          <button id="botaoDir"><img src="icons/seta-direita.png"></button>
        </div>
        
        <div id="Cachoeira" class="exibirDesc">
          <h4 class="titleCenter">Cachoeira da Barriguda</h4>
          <div class="imag">
            <img src="images/cachoeiraBarriguda.jpg">
          </div>
          <p>Cachoeira da Barriguda</p>
        </div>

        <div id="Cachoeira2" class="exibirDesc">
          <p>Localizada na zona rural de Buritis</p>
        </div>

        <div id="Igrejinha" class="exibirDesc">
          <h4 class="titleCenter">Igrejinha</h4>
          <div class="imag">
            <img src="images/igrejinha.png">
          </div>
          <p>A primeira igreja da cidade de Buritis.</p>
        </div>

        <div id="Igrejinha2" class="exibirDesc">
          <p>Localizada no Bairro Centro da cidade de Buritis.</p>
        </div>

        <div id="IgrejaMatriz" class="exibirDesc">
          <h4 class="titleCenter">Igreja Matriz Nossa Senhora da Pena</h4>
          <div class="imag">
            <img src="images/igrejaMatriz.jpg">
          </div>
          <p>A Igreja Matriz Nossa Senhora da Pena tem como religião a Católica, suas paredes externas são rebocadas com pedras coloridas e fica localizada no bairro Centro da cidade de Buritis-MG</p>
        </div>

        <div id="IgrejaMatriz2" class="exibirDesc">
          <p>Localizada no Bairro Centro da cidade de Buritis.</p>
        </div>

        <div id="Formulario">
          <form action=""></form>
        </div>

      </div>
    </div>

    <div id="mapa">
      <button type="button" id="btnHide"><img src="icons/seta-esquerda.png"></button>
      <div id="map"></div>
    </div>
    

    <script src="https://code.jquery.com/jquery-3.2.0.min.js"></script>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    crossorigin=""></script>
    <script src="js/main.js" defer></script>
</body>
</html>