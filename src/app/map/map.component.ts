import { Component, OnInit, Input, Output,  SimpleChanges, EventEmitter } from '@angular/core';
import ol from 'openlayers';

import { Subject } from 'rxjs/Subject';



@Component({
  selector: 'map',
  templateUrl:  './map.component.html',
  styleUrls: ['map.component.css']
})
export class MapComponent implements OnInit{

  
  

  ngOnInit() {
    var selectClick;  
    var map;

   
     
    


    map = new ol.Map({
      layers: [
        new ol.layer.Tile({ source: new ol.source.OSM()}),
      ],
      target: document.getElementById('map'),
      view: new ol.View({
        center: ol.proj.transform([-0.12755, 51.507222], 'EPSG:4326', 'EPSG:3857'),
        zoom: 3
      })
    });

    
    var
    container = document.getElementById('popup'),
    content_element = document.getElementById('popup-content'),
    closer = document.getElementById('popup-closer');

    closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };




    var vector = new ol.layer.Vector({
        source: new ol.source.Vector({
          url: '/api/test',
          format: new ol.format.GeoJSON()
        })
      });

      map.addLayer(vector);


      var overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        offset: [0, -10]
      });

    map.addOverlay(overlay);

      map.on('click', function(evt){
        var feature = map.forEachFeatureAtPixel(evt.pixel,
          function(feature, layer) {
            return feature;
          });
        if (feature) {
            var geometry = feature.getGeometry();
            var coord = geometry.getCoordinates();
            
            var content = '<h3>' + feature.get('f1')+'  '+feature.get('f2') + '</h3>';

            console.log(coord[0]);
            content_element.innerHTML = content;          
            overlay.setPosition(coord[0][0]);
            
            console.log(content)
            
            console.info(feature.getProperties());
            }
        });

  }

  
}