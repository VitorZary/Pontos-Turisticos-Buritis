# Pontos-Turisticos-Buritis
Protótipo de projeto para o meu TCC.

O projeto consiste na apresentação de pontos turísticos em um mapa, apresentando uma breve descrição dos pontos turísticos e sua localização no mapa, tem como base para a apresentação o LeafletJS e um servidor de mapas dedicado.


## Geoserver

### Instalando o geoserver
Primeiro instale o geoserver em sua ultima versão no site [https://geoserver.org/](https://geoserver.org/). Na instalação, na opção de selecionar a porta selecione a porta 8082 para ser a porta padrão do geoserver.(Você pode usar outra porta ou deixar a portão padrão, mas posteriormente a porta pode dar conflito com o servidor de mapas se for usar a porta 8080 para ambos).


### Configurando o geoserver

#### Configuração inicial

1- Selecione a aba "Espacios de trabajo" no menu lateral, clique em "Agregar un nuevo espacio de trabajo", preenchendo os campos escreva no campo "Name":"Buritis" e na "URI del espacio de nombres":"Buritis" depois clique no botão "Guardar".

2- Selecione a aba "Almaneces" depois "Agregar nuevo almacén", depois selecione o link "PostGIS" em "PostGIS - PostGIS Database". Depois de selecionar o link preencha os campos da seguinte forma "Espaço de trabalho *":"Buritis", "Nome da fonte de dados *" o nome da base de dados no meu caso é "regiaoBuritis", "database":"regiaoBuritis", "user" nome do usuario o padrao é "postgres", "passwd" senha que colocou no banco de dados no meu caso e "bancodedados" o resto das opções pode deixar padrão, no fim da tela clique no botao "Guardar".

#### Configurando as tabelas para ser usadas nas querys

1- Selecione a aba "Camadas" depois "Adicione uma nova camada". No campo que vai vir selecione "Buritis:regiaoBuritis" e então clique em "Publicar" na tabela "ways". Em suas configurações de sistemas de cordenadas certifique que o campo "Sistema de Referência de Coordenadas" e "SRS declarado" sejam "EPSG:4326". Na secao "Retângulos Envolventes" no campo "Enquadramento Nativo" clique em "Calcular a partir dos dados" e no campo "Enquadramento no formato Lat/Lon" clique em "Calcular a partir dos limites nativos", deixando o resto dos campos como está clique em "Guardar". 

2- Faça o mesmo procedimento do passo 3 na aba "Camadas" com a tabela "	ways_vertices_pgr".

#### Configurando as querys

1 - (Primeira query) Na aba "Camadas" clique em "Adicione uma nova camada" selecione a opção "Buritis:regiaoBuritis", clique no link "Configure new SQL view..." no campo "Nome da View de Dados" será "vertice_mais_perto". no campo "Instrução SQL" cole a query:

`SELECT
	v.id
FROM
	ways_vertices_pgr as v,
	ways as e
where
	v.id = (select id from ways_vertices_pgr
	ORDER BY the_geom <-> ST_SetSRID(ST_Point(%x%, %y%),4326) limit 1)
	and (e.source = v.id or e.target = v.id)
group by v.id`

No campo "Parametros da view SQL" selecione "Adicionar novo parâmetro" e preencha os campos com os seguintes parametros respectivamente: x, -46.4242, ^[\d\.\+-eE]+$, clique em adicionar novo parametro novamente (Ao fazer isso é provavel que ocorra um bug de nao aparecer o campo, caso acontecer simplismente clique no botao "Guardar" que o campo irá aparecer apos uma mensagem de erro, você pode remover campos selecionados caso apareçam 3 ou mais, o importante é ter dois campos para preencher) e preencha o novo campo com os seguintes paramentros: y, -15.6277, ^[\d\.\+-eE]+$. O resto das opções são padrão e clique no botão "Guardar".
  
Após isso ira aparecer outra tela com mais configurações e as configurações seguintes são essas: "Sistema de Referência de Coordenadas" > "SRS declarado": "EPSG:4326", seção "Retângulos Envolventes" campo "Enquadramento Nativo": clicar no link "Compute from SRS bounds" campo "Enquadramento no formato Lat/Lon" clicar no link "Calcular a partir dos limites nativos". Apos isso clique no botão "salvar".


 2 - (Segunda query) Repetindo o processo da query de cima agora com o nome da query "caminho_mais_curto" e a query sendo:

 `select
 a.the_geom
from
 pgr_Dijkstra('select gid as id, source, target, cost, reverse_cost from ways', %source%, %target%, true)as r
 left outer join ways as a on a.gid = r.edge`

No campo "Parametros da view SQL" as configurações serão para os primeiros campos: source, 101, ^[\d]+$, respectivamente, e para o segundo campo: target, 105, ^[\d]+$, respectivamente. As demais configurações são padrão e clique no botão guardar.

Após isso preencha os campos de configurações exatamente como a primeira query com uma configuração adicional: seção "Detalhes do tipo de recurso" clicar no link "Edit sql view", no fim da página na seção "Atributos" o atributo "the_geom" selecionar "MultiLineString". Deixar o resto das configurações como está e clicar em no botão "Aceptar" e na outra pagina clicar no botão "Guardar".

#### Habilitando "CORS" no GeoServer

Acontece um erro que o javascript não consegue acessar o geoserver, então deve-se habilitar os "CORS" conforme o link [https://gis.stackexchange.com/questions/210109/enabling-cors-in-geoserver-jetty](https://gis.stackexchange.com/questions/210109/enabling-cors-in-geoserver-jetty).

Editando o arquivo na pasta onde está instalado o geoserver e o caminho:`webapps/geoserver/WEB-INF/web.xml` descomentando as seguintes linhas:

    ><!-- Uncomment following filter to enable CORS -->
    <filter>
      <filter-name>cross-origin</filter-name>
         <filter-class>org.eclipse.jetty.servlets.CrossOriginFilter</filter-class>
      </filter>

e

    <!-- Uncomment following filter to enable CORS -->
    <filter-mapping>
       <filter-name>cross-origin</filter-name>
       <url-pattern>/*</url-pattern>
    </filter-mapping>

Também é necessário adicionar o [Jetty-Utility Servlets Jar](https://mvnrepository.com/artifact/org.eclipse.jetty/jetty-servlets). (A versão que usei é o 9.4.12.v20180830) Copie o jar para onde está instalado o geoserver e o caminho "webapps/geoserver/WEB-INF/lib".

Após isso reinicie o geoserver.

## Subindo o servidor de mapas

Primeiro é necessário ter o docker instalado na máquina, para obte-lo segue o link [https://www.docker.com/](https://www.docker.com/).
É necessário também baixar o arquivo exportado da região de Buritis no OpenStreetMaps segue o link [Link para o Google Drive](https://drive.google.com/file/d/16WvYIwlHbcKK61zr00cJPQB0-_WFRz5q/view?usp=drive_link)

Depois de obter o docker e baixar o arquivo é necessário executar os seguintes comandos:
`docker volume create osm-data`
e
`docker run  -v caminho_completo_desde_a_raiz_do_sistema/Buritis_regiao_V2.osm.pbf:/data/region.osm.pbf  -v osm-data:/data/database/  overv/openstreetmap-tile-server  import`
  
Após isso é necessário apenas executar o container docker criado. (Sugiro instalar o docker desktop, que com o simples ato de clicar no botão "Start" vai subir o container do servidor). OBS: pode ocorrer problemas na execução do comando acima, se isso acontecer pode ser necessário remover o volume docker e criar novamente, segue o link para mais informações: [https://switch2osm.org/serving-tiles/using-a-docker-container/](https://switch2osm.org/serving-tiles/using-a-docker-container/).


## Criando a base de dados PostGIS para a extensão pgRouting

Primeiro é necessário ter o PostgreSQL, a versão usada no projeto é a versão 13. O banco de dados pode ser obtido em [https://www.postgresql.org/](https://www.postgresql.org/). Depois é necessário instalar o PostiGIS, eu instalei com o Stack Builder (utilitario que vem com a instalação do postgreSQL) deixando marcada a opção ao final da instalação de executar o StackBuilder, é possível baixar e instalar o PostgreGIS diretamente. Depois da instalação é necessário criar a base de dados com o nome "regiaoBuritis", também é necessário instalar a extensão pgrouting através do menu "create" > "extension".

É necessário baixar o mapa de Buritis novamente porém convertido para o formato osm para poder seguir o próximo passo. Segue o [Link do Google Drive](https://drive.google.com/file/d/16WvYIwlHbcKK61zr00cJPQB0-_WFRz5q/view?usp=drive_link) com ele já convertido.

Para importar os dados para o pgrouting é foi necessário usar um programa nativo da instalação do PostgreSQL chamado osm2pgrouting. Navegando para a pasta "bin" da instalação do postgreSQL versão 13 voce conseguirá executar o seguinte comando: `osm2pgrouting -f CAMINHO_DESDE_A_RAIZ/Buritis_regiao_V2.osm_01.osm -d NOME_DA_BASE -p PORTA_DO_POSTGRESQL -u USUARIO -W SENHA -c mapconfig.xml --clean`. Sendo CAMINHO_DESDE_A_RAIZ = o caminho desde a raiz do sistema, NOME_DA_BASE = o nome da base de dados, PORTA_DO_POSTGRESQL = porta do PostgreSQL, USUARIO = usuario do PostgreSQL, SENHA = senha do PostgreSQL. Caso ocorram erros os dados não serão exportados, quando é digitado corretamente o pgrouting informa o tamanho as ruas e o tempo de execução.



