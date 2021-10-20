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
import { NullTemplateVisitor } from '@angular/compiler';

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
  arrStruct = ["בקתה", "אוהל", "חדר"];

  lodgingFacilityList: any = [];

  svgcabin: string = "M32.987,17.59a2.109,2.109,0,0,0-.824-1.445L29.15,13.986V8.7h-4.4v2.131L16.533,4.947.859,15.625a2.1,2.1,0,0,0-.84,1.413,2.068,2.068,0,0,0,.438,1.574,2.245,2.245,0,0,0,3.063.406L3.85,18.8v1.276a1.828,1.828,0,0,0,0,3.353V25.4a1.828,1.828,0,0,0,0,3.353v1.971A1.858,1.858,0,0,0,2.75,32.4a1.9,1.9,0,0,0,1.925,1.864H28.325a1.856,1.856,0,0,0,.275-3.7V28.91a1.847,1.847,0,0,0,0-3.673V23.585a1.847,1.847,0,0,0,0-3.673V18.9l.829.585a2.253,2.253,0,0,0,3.083-.327A2.068,2.068,0,0,0,32.987,17.59ZM25.85,9.768h2.2V13.2l-2.2-1.576ZM12.65,28.937v1.6H4.95v-1.6ZM4.95,25.21v-1.6h7.7v1.6Zm-.275,1.065H12.65v1.6H4.675a.8.8,0,1,1,0-1.6ZM12.65,33.2H4.675a.8.8,0,1,1,0-1.6H12.65Zm6.6,0h-5.5V23.612h5.5V33.2Zm1.1-7.987v-1.6H27.5v1.6Zm0,5.325v-1.6H27.5v1.6Zm8.8,1.864a.813.813,0,0,1-.825.8H20.35V31.6h7.975A.813.813,0,0,1,29.15,32.4Zm0-5.325a.813.813,0,0,1-.825.8H20.35v-1.6h7.975A.813.813,0,0,1,29.15,27.073Zm0-5.325a.813.813,0,0,1-.825.8H4.675a.8.8,0,1,1,0-1.6H28.325A.813.813,0,0,1,29.15,21.748ZM18.7,19.885H17.05v-1.6H18.7Zm0-2.662H17.05v-1.6H18.7Zm-2.75,0H14.3v-1.6h1.65ZM14.3,18.287h1.65v1.6H14.3Zm7.7,0h5.5v1.6H19.8V14.56H13.2v5.325H4.95v-1.6H11a.533.533,0,1,0,0-1.065H6.193l2.38-1.6H11.55V14.56H10.16l2.38-1.6H20.2l1.318.931.944.667H21.451v1.065h2.519l2.262,1.6H22a.533.533,0,1,0,0,1.065ZM14.126,11.9l2.342-1.572L18.693,11.9Zm17.529,6.588a1.127,1.127,0,0,1-1.547.159l-1.54-1.088-.471-.334h0l-2.261-1.6h0L20.558,11.9h0L16.483,9.019,12.195,11.9h0L6.642,15.625h0l-2.414,1.62h0l-.195.133-1.16.779a1.126,1.126,0,0,1-1.543-.194,1.045,1.045,0,0,1,.182-1.481L16.517,6.261l8.233,5.9h0l1.208.866,5.533,3.964a1.046,1.046,0,0,1,.4.716A1.034,1.034,0,0,1,31.655,18.486Z";
  svgtent: string = "M40.816,93.651a.711.711,0,0,0-.128-.294c-.092-.1-6.891-9.229-11.211-16.461h0a.71.71,0,0,0-.71-.341,64.691,64.691,0,0,1-15.289-.448h-.085a.71.71,0,0,0-.647.341c-.078.135-8.056,13.364-12.5,17.179A.71.71,0,0,0,.7,94.877H2.423v5.463a.71.71,0,0,0,.639.71l23.75,2.366h.071a.71.71,0,0,0,.71-.654l11.232-3.147a.71.71,0,0,0,.519-.71V94.643l.9-.163A.711.711,0,0,0,40.816,93.651ZM14.557,85.194c1.059,4.817,2.629,10.657,4.483,13.5l-4.5-.412Zm.824-2.927.014.007c2.43,4.5,6.252,10.863,10.145,14.586a.71.71,0,0,0,.583.192v2.33l-5.058-.5C19.068,97.769,16.816,89.414,15.381,82.267ZM3.169,93.477l.007.021h-.71c3.552-3.78,8.291-11.09,10.408-14.493-.71,3.9-3.034,15.047-6.231,18.472l-2.785-.27V94.188A.71.71,0,0,0,3.169,93.477Zm9.953-8.7V98.138l-4.781-.49C10.429,94.728,12.056,89.222,13.122,84.782Zm13.044,17.136L3.886,99.729V98.635l2.991.291,3.552.348,6.039.59,4.348.426,5.35.526v1.1Zm11.751-3.5-10.344,2.87V96.8l10.358-1.9ZM26.279,95.573C21.306,90.643,16.333,81.066,14.635,77.7a66.184,66.184,0,0,0,13.875.291c3.552,5.868,8.525,12.788,10.358,15.275Z";
  svgroom: string = "M29.978,217.546v-7.18A2.37,2.37,0,0,0,27.611,208H5.522a2.37,2.37,0,0,0-2.367,2.367v7.18A3.952,3.952,0,0,0,0,221.411v12.622a.789.789,0,0,0,.789.789H3.944a.789.789,0,0,0,.789-.789v-2.367H28.4v2.367a.789.789,0,0,0,.789.789h3.156a.789.789,0,0,0,.789-.789V221.411A3.952,3.952,0,0,0,29.978,217.546Zm-25.244-7.18a.79.79,0,0,1,.789-.789H27.611a.79.79,0,0,1,.789.789v7.1H26.822v-3.156a2.37,2.37,0,0,0-2.367-2.367H19.722a2.37,2.37,0,0,0-2.367,2.367v3.156H15.778v-3.156a2.37,2.37,0,0,0-2.367-2.367H8.678a2.37,2.37,0,0,0-2.367,2.367v3.156H4.733Zm20.511,3.944v3.156H18.933v-3.156a.79.79,0,0,1,.789-.789h4.733A.79.79,0,0,1,25.244,214.311Zm-11.044,0v3.156H7.889v-3.156a.79.79,0,0,1,.789-.789h4.733A.79.79,0,0,1,14.2,214.311Zm17.355,18.933H29.978v-2.367a.789.789,0,0,0-.789-.789H3.944a.789.789,0,0,0-.789.789v2.367H1.578v-6.311H31.555Zm0-7.889H1.578v-3.944a2.37,2.37,0,0,1,2.367-2.367H29.189a2.37,2.37,0,0,1,2.367,2.367Z";

  constructor(protected httpClient: HttpClient, public tripService: TripService, public fakeApi: FakeService) {
    this.lodgingFacilityForDay = this.tripService.lodgingFacilityListArray;
    // this.tripService.forestCenter.subscribe(forestCenter => {
    //   this.forestCenter = forestCenter; // this set's the username to the default observable value
    //   console.log('maps -- > forest Center from server BehaviorSubject:', this.forestCenter);
    //   this.onChangeForestCenter();
    // });
    // this.onChangeForestCenter();
  }

  popupTrailheads: any = {
    "title": "{SiteName}",
    "content": (f) => this.contentPopup(f)
  };

  async contentPopup(feature) {
    let innerHTML = "<b>שם אתר:</b>" + feature.graphic.attributes.SiteName + "<br>";
    innerHTML += "<b>שימוש המבנה:</b> " + feature.graphic.attributes.Purpose;
    innerHTML += "<br><b>מספר מבנה:</b> " + feature.graphic.attributes.OBJECTID;

    if (this.arrStruct.indexOf(feature.graphic.attributes.Purpose) != -1) {
      let buildingInfo = this.rawservicedata[1].lodgingFacilityList.filter(n => n.structureId == feature.graphic.attributes.OBJECTID);

      let gender: string;
      let status: string;
      if (buildingInfo.length > 0) {
        gender = buildingInfo[0].gender;
        status = buildingInfo[0].status;
      }
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

    this.view.ui.add("nameDiv", "top-trailing");

    const labelClass = new LabelClass({
      symbol: {
        type: "text", // autocasts as new TextSymbol()
        color: "black",
        font: {
          // autocast as new Font()
          family: "Playfair Display",
          size: 0,
          weight: "bold"
        }
      },
      labelPlacement: "above-center",
    });

    this.layer = new FeatureLayer({
      url: this.url,
      popupTemplate: this.popupTrailheads,
      opacity: 1
      // ,
      // labelingInfo: [labelClass]
      //definitionExpression: filterex
    });
    this.graphicsLayer = new GraphicsLayer({
      opacity: 1
    });
    this.myMap.add(this.layer);
    this.myMap.add(this.graphicsLayer);
  }

  ngOnInit() {
    this.loadWebMap();
    if (this.tripService.centerField) {
      this.forestCenter = this.tripService.centerField;
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
      this.lodgingFacilityList = lodgingFacilityList;
      this.rawservicedata = lodgingFacilityList;
      this.queryandrender();
      //this.onChangeForestCenter();
    });
    // this.onChangeForestCenter();
  }

  queryandrender() {
    let filterex = "SiteName = '" + this.rawservicedata[0].fieldForestCenterName + "'";

    // let filterex = "SiteName = '" + this.rawservicedata.fieldForestCenterName + "'";

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
    this.tripService.availableUnitsForMap(newCurrentDay);
    //    console.log('facilityForDay: ', this.facilitiesArray[newCurrentDay].facilitiesList);
    this.lodgingFacilityForDay = this.tripService.lodgingFacilityListArray;
    //this.lodgingFacilityForDay = this.tripService.lodgingFacilityListArray[newCurrentDay].lodgingFacilityList;
    //this.rawservicedata = this.lodgingFacilityForDay;
    // this.queryandrender();
  }

  onChangeForestCenter() {
    //this.rawservicedata = this.fakeApi.getLodgingFacilityList(this.forestCenter.name);
    //this.lodgingFacilityForDay
    this.rawservicedata = this.lodgingFacilityList;
    this.queryandrender();
  };

  queryTask_executeForExtent(response: any) {
    this.view.goTo(response.extent);
  }

  layer_queryFeatures(response: any) {
    //this.rawservicedata = this.fakeApi.getLodgingFacilityList(this.forestCenter.name);
    //this.rawservicedata = this.lodgingFacilityForDay;
    this.rawservicedata = this.lodgingFacilityList;

    let buldingfeature: any;

    for (let i = 0; i < response.features.length; i++) {

      buldingfeature = response.features[i];
      if (this.arrStruct.indexOf(buldingfeature.attributes.Purpose) != -1) {
        // Create a graphic and add the geometry and symbol by vacancy
        var point = new Point({
          x: buldingfeature.geometry.x,
          y: buldingfeature.geometry.y
        });

        var objBin = this.rawservicedata[1].lodgingFacilityList.filter(n => n.structureId == buldingfeature.attributes.UID);
        //        var objBin = this.rawservicedata.lodgingFacilityList.filter(n => n.structureId == buldingfeature.attributes.UID);

        if (objBin.length > 0)
          objBin = objBin[0];
        else
          objBin = null;

        let svgPath: string;
        if (buldingfeature.attributes.Purpose == "בקתה")
          svgPath = this.svgcabin;
        else if (buldingfeature.attributes.Purpose == "אוהל")
          svgPath = this.svgtent;
        else if (buldingfeature.attributes.Purpose == "חדר")
          svgPath = this.svgroom;

        var stylePoint = {
          type: "simple-marker",
          // style: "square",
          path: svgPath,
          color: "",
          size: "30px",
          outline: {
            color: [255, 255, 0],
            width: 1
          }
        };

        // console.log(objBin.structureId);
        // console.log(objBin.status);

        stylePoint.outline = {
          color: [196, 196, 196],
          width: 1
        };
        if (objBin) {
          if (objBin.status == 'פנוי') {
            if (objBin.gender == 'בנות')
              stylePoint.outline = {
                color: [55, 197, 107],
                width: 1
              };
            else if (objBin.gender == 'בנים')
              stylePoint.outline = {
                color: [55, 197, 107],
                width: 1
              };
            else if (objBin.gender == 'מעורב')
              stylePoint.outline = {
                color: [55, 197, 107],
                width: 1
              };
          }
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
