import { Component, OnInit, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Query from '@arcgis/core/rest/support/Query';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import BaseMap from '@arcgis/core/Basemap';
import QueryTask from '@arcgis/core/tasks/QueryTask';
import LabelClass from '@arcgis/core/layers/support/LabelClass';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import { TripService } from 'src/app/services/trip.service';
import { FakeService } from 'src/app/services/fake.service';

import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  lodgingFacilityForDay: any;
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

  constructor(protected httpClient: HttpClient, public tripService: TripService, public fakeApi: FakeService) {

    this.lodgingFacilityForDay = this.tripService.lodgingFacilityListArray;
    // this.tripService.forestCenter.subscribe(forestCenter => {
    //   this.forestCenter = forestCenter; // this set's the username to the default observable value
    //   console.log('maps -- > forest Center from server BehaviorSubject:', this.forestCenter);
    //   this.onChangeForestCenter();
    // });
  }

  // popupTrailheads: any = {
  //   "title": "{SiteName}",
  //   "content": [
  //     {
  //       type: "fields",
  //       fieldInfos: [{
  //         fieldName: "SiteName",
  //         visible: true,
  //         label: "שם אתר:"
  //       },
  //       {
  //         fieldName: "Purpose",
  //         visible: true,
  //         label: "שימוש המבנה:"
  //       },
  //       {
  //         fieldName: "UID",
  //         visible: true,
  //         label: "מספר מבנה:"
  //       }]
  //     }, {
  //       type: "attachments",
  //       displayType: "list"
  //     }
  //   ]
  // };

  popupTrailheads: any = {
    "title": "{SiteName}",
    "content": (f) => this.contentPopup(f)
  };

  async contentPopup(feature) {


    let innerHTML = "<b>שם אתר:</b>" + feature.graphic.attributes.SiteName + "<br><b>שימוש המבנה:</b> " + feature.graphic.attributes.Purpose;
    innerHTML += "<br><b>מספר מבנה:</b> " + feature.graphic.attributes.OBJECTID;

    let buildingInfo = this.rawservicedata[1].lodgingFacilityList.filter(n => n.structureId == 1190);
    // feature.graphic.attributes.OBJECTID);

    if (buildingInfo.length > 0) {
      let gender = buildingInfo[0].gender;
      let status = buildingInfo[0].status;
      innerHTML += "<br><b>מִין:</b> " + gender;
      innerHTML += "<br><b>סטטוס:</b> " + status;
    }

    let attachmentsJSON;

    attachmentsJSON = await this.getAttachments(feature);

    try {
      if (attachmentsJSON.attachmentGroups[0].attachmentInfos[0].id && attachmentsJSON.attachmentGroups[0].attachmentInfos[0].name) {
        innerHTML += "<br><br>";
        innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='https://services2.arcgis.com/utNNrmXb4IZOLXXs/ArcGIS/rest/services/JNFFieldCenterBuildingsPublicView/FeatureServer/0/" + feature.graphic.attributes.OBJECTID + "/attachments/" + attachmentsJSON.attachmentGroups[0].attachmentInfos[0].id + "' target='_blank'>";
        innerHTML += "<img src='https://services2.arcgis.com/utNNrmXb4IZOLXXs/ArcGIS/rest/services/JNFFieldCenterBuildingsPublicView/FeatureServer/0/" + feature.graphic.attributes.OBJECTID + "/attachments/" + attachmentsJSON.attachmentGroups[0].attachmentInfos[0].id + "' alt='" + attachmentsJSON.attachmentGroups[0].attachmentInfos[0].name + "' height='60px'>";
        innerHTML += "</a>";
      }
    }
    catch (er) { }

    return innerHTML;
  }

  async getAttachments(feature) {
    const response = this.httpClient.get("https://services2.arcgis.com/utNNrmXb4IZOLXXs/arcgis/rest/services/JNFFieldCenterBuildingsPublicView/FeatureServer/0/queryAttachments?objectIds=" + feature.graphic.attributes.OBJECTID + "&f=json")
      .toPromise();

    return response;
  }

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

    const labelClass = new LabelClass({  // autocasts as new LabelClass()
      symbol: {
        type: "text",  // autocasts as new TextSymbol()
        color: "red",
        haloColor: "red",
        haloSize: 5,
        font: {
          family: "ariel",
          size: 48,
          weight: "bold"
        }
      }
    });

    this.layer = new FeatureLayer({
      url: this.url,
      popupTemplate: this.popupTrailheads,
      opacity: 1,
      // labelingInfo: [labelClass]
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
      this.forestCenter = this.tripService.centerField;
      //this.onChangeForestCenter();
    }

    // this.tripService.forestCenter.subscribe(forestCenter => {
    //   //this.forestCenter = result; // this set's the username to the default observable value
    //   console.log('maps --> forestCenter result:', forestCenter);
    //   this.forestCenter = forestCenter;
    //   //this.onChangeForestCenter();
    // });
    this.tripService.lodgingFacilityListArrayObservable.subscribe(lodgingFacilityList => {
      //this.forestCenter = result; // this set's the username to the default observable value
      console.log('maps --> lodgingFacilityList result:', lodgingFacilityList);
      this.rawservicedata = lodgingFacilityList;
      this.queryandrender();
      //this.onChangeForestCenter();
    });
  }

  queryandrender() {
    let filterex = "SiteName = '" + this.rawservicedata[0].fieldForestCenterName + "'";

    let queryTask = new QueryTask({
      url: this.url
    });
    let queryextnet = new Query();
    queryextnet.where = filterex;
    queryextnet.outSpatialReference = new SpatialReference({
      wkid: 4326
    });

    queryTask.executeForExtent(queryextnet).then((response) => {
      this.queryTask_executeForExtent(response);
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
  };

  currentDayHandler(newCurrentDay: number) {
    console.log('new Current Day: ', newCurrentDay);
    //    console.log('facilityForDay: ', this.facilitiesArray[newCurrentDay].facilitiesList);
    this.lodgingFacilityForDay = this.tripService.lodgingFacilityListArray;
    //this.lodgingFacilityForDay = this.tripService.lodgingFacilityListArray[newCurrentDay].lodgingFacilityList;
    //this.rawservicedata = this.lodgingFacilityForDay;
    this.queryandrender();
  }

  onChangeForestCenter() {
    //this.rawservicedata = this.fakeApi.getLodgingFacilityList(this.forestCenter.name);
    //this.lodgingFacilityForDay
    //this.rawservicedata = this.lodgingFacilityForDay;
    this.queryandrender();
  };

  queryTask_executeForExtent(response: any) {
    this.view.goTo(response.extent);
  }

  layer_queryFeatures(response: any) {
    // this.rawservicedata = this.fakeApi.getLodgingFacilityList(this.forestCenter.name);
    //this.rawservicedata = this.lodgingFacilityForDay;
    let buldingfeature: any;

    for (let i = 0; i < response.features.length; i++) {

      buldingfeature = response.features[i];
      // Create a graphic and add the geometry and symbol by vacancy
      var point = new Point({
        x: buldingfeature.geometry.x,
        y: buldingfeature.geometry.y
      });

      var objBin = this.rawservicedata[1].lodgingFacilityList.filter(n => n.structureId == buldingfeature.attributes.UID);

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
