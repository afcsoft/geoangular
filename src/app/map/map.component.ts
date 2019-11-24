import { Component, OnInit, Input, Output,  SimpleChanges, EventEmitter } from '@angular/core';
import ol from 'openlayers';

import { Subject } from 'rxjs/Subject';



@Component({
  selector: 'map',
  template:  '<div id="map"></div>',
  styleUrls: ['map.component.css']
})
export class MapComponent implements OnInit{

  private map: ol.Map;


  ngOnInit() {
    
    this.map = new ol.Map({
      layers: [
        new ol.layer.Tile({ source: new ol.source.OSM()}),
      ],
      target: document.getElementById('map'),
      view: new ol.View({
        center: ol.proj.transform([-0.12755, 51.507222], 'EPSG:4326', 'EPSG:3857'),
        zoom: 3
      })
    });

    var vector = new ol.layer.Vector({
        source: new ol.source.Vector({
          url: '/api/test',
          format: new ol.format.GeoJSON()
        })
      });
      this.map.addLayer(vector);

  }

  
}