import { Component, OnInit, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Query from '@arcgis/core/rest/support/Query';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import BaseMap from '@arcgis/core/Basemap';
import QueryTask from '@arcgis/core/tasks/QueryTask';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import { TripService } from 'src/app/services/trip.service';
import { FakeService } from 'src/app/services/fake.service';
@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  url: string = "https://services2.arcgis.com/utNNrmXb4IZOLXXs/arcgis/rest/services/JNFFieldCenterBuildingsPublicView/FeatureServer/0";
  myMap!: WebMap;
  view!: MapView;
  layer!: FeatureLayer;
  graphicsLayer!: GraphicsLayer;
  rawservicedata: any;
  pointGraphic: any;
  forestCenter: any;
  vtLayer: VectorTileLayer;
  basemap: BaseMap;

  constructor(public tripService: TripService, public fakeApi: FakeService) { }

  popupTrailheads: any = {
    "title": "{SiteName}",
    "content": [
      {
        type: "text",
        text: "<span style='direction:rigth; float:right;'><b>שם אתר:</b> {SiteName}<br><b>שימוש המבנה:</b> {Purpose}<br><b>מספר מבנה:</b> {UID}<br></span>"
      },
      {
        type: "attachments",
        displayType: "list"
      }
    ]
  };

  loadWebMap(): void {
    this.vtLayer = new VectorTileLayer({
      url: "https://kkl.maps.arcgis.com/sharing/rest/content/items/0a191451e15249d4b5a1cc3ac5d73dac/resources/styles/root.json"
    });

    this.basemap = new BaseMap({
      baseLayers: [this.vtLayer]
    });

    this.myMap = new WebMap({
      basemap: this.basemap
    });
    this.view = new MapView({
      map: this.myMap,
      container: "mapdiv",
      center: [35.1, 31.5],
      zoom: 8
    });
    this.layer = new FeatureLayer({
      url: this.url,
      popupTemplate: this.popupTrailheads
      //definitionExpression: filterex
    });
    this.graphicsLayer = new GraphicsLayer({
      opacity: 1
    });
    this.myMap.add(this.graphicsLayer);
    this.myMap.add(this.layer);
  }

  ngOnInit() {
    this.loadWebMap();
    if (this.tripService.centerField) {
      this.forestCenter = this.tripService.centerField.name;

      this.onChangeForestCenter();
    }

    this.tripService.forestCenter.subscribe(forestCenter => {
      this.forestCenter = forestCenter; // this set's the username to the default observable value
      console.log('maps -- > forest Center from server BehaviorSubject:', this.forestCenter);
      this.onChangeForestCenter();
    });

  }

  queryandrender() {
    if (this.rawservicedata) {
      let filterex = "SiteName = '" + this.rawservicedata.fieldForestCenterName + "'";

      let queryTask = new QueryTask({
        url: this.url
      });
      let queryextnet = new Query();
      queryextnet.where = filterex;
      queryextnet.outSpatialReference = new SpatialReference({
        wkid: 4326
      });

      queryTask.executeForExtent(queryextnet).then((response) => {
        this.queryTask_executeForExtent(response)
      });

      // query for data
      let query = this.layer.createQuery();
      query.where = filterex;
      query.outFields = ["SiteName", "Purpose", "UID"];
      query.outSpatialReference = new SpatialReference({
        wkid: 4326
      });

      this.layer.queryFeatures(query).then((response) => {
        this.layer_queryFeatures(response);
      });
    }
  };

  onChangeForestCenter() {
    this.rawservicedata = this.fakeApi.getLodgingFacilityList(this.forestCenter);
    this.queryandrender();
  };

  queryTask_executeForExtent(response: any) {
    this.view.goTo(response.extent);
  }

  layer_queryFeatures(response: any) {
    this.rawservicedata = this.fakeApi.getLodgingFacilityList(this.forestCenter);

    let buldingfeature: any;

    for (let i = 0; i < response.features.length; i++) {

      buldingfeature = response.features[i];
      // Create a graphic and add the geometry and symbol by vacancy
      var point = new Point({
        x: buldingfeature.geometry.x,
        y: buldingfeature.geometry.y
      });

      var objBin = this.rawservicedata.lodgingFacilityList.filter(n => n.structureId == buldingfeature.attributes.UID);

      if (objBin.length > 0) {
        objBin = objBin[0];

        var stylePoint = {
          type: "simple-marker",
          color: "",
          size: "40px"
        };

        if (objBin.status == 'פנוי') {
          if (objBin.gender == 'בנות')
            stylePoint.color = "red";
          else if (objBin.gender == 'בנים')
            stylePoint.color = "blue";
          else if (objBin.gender == 'מעורב')
            stylePoint.color = "green"
        }
        else if (objBin.status == 'תפוס') {
          stylePoint.color = "grey";
        }

        let pointGraphic: any;
        pointGraphic = new Graphic({
          geometry: point,
          symbol: stylePoint,
          attributes: {}
        });

        this.graphicsLayer.add(pointGraphic);
      }
    }
  }

}
