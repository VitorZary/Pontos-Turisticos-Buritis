const geoserverUrl = "http://localhost:8082/geoserver";

export function caminho_mais_curto(source, target){
    const url = `${geoserverUrl}/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=Buritis:caminho_mais_curto&outputformat=application/json&viewparams=source:${source};target:${target}`
            

    return(url);
}

export function vertice_mais_perto(lat,long){
    const url = `${geoserverUrl}/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=Buritis:vertice_mais_perto&outputformat=application/json&viewparams=x:${long};y:${lat}`;
    var vertice;
    var features;
    $.ajax({
        url: url,
        async: false,
        success: function(data) {
            features = data.features;
            vertice = features[0].properties.id;
        }
    });

    return vertice;
}