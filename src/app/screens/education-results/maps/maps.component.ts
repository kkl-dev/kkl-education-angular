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
<<<<<<< HEAD
import { analyzeAndValidateNgModules, NullTemplateVisitor } from '@angular/compiler';
=======
import { NullTemplateVisitor } from '@angular/compiler';
>>>>>>> 7e3624ac9bf1873dac859eabced1a716933d429b
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';

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
  viewGenderIcons: boolean = false;

  constructor(protected httpClient: HttpClient, public tripService: TripService, public fakeApi: FakeService) {

    this.lodgingFacilityForDay = this.tripService.lodgingFacilityListArray;
    if (this.tripService.centerField) {
      this.forestCenter = this.tripService.centerField;
    }
  }

  popupTrailheads: any = {
    "title": "{SiteName}",
    "content": (f) => this.contentPopup(f)
  };

  async contentPopup(feature) {
    let innerHTML = "<b>שם אתר:</b>" + feature.graphic.attributes.SiteName + "<br>";
    innerHTML += "<b>שימוש המבנה:</b> " + feature.graphic.attributes.Purpose;
    innerHTML += "<br><b>מספר מבנה:</b> " + feature.graphic.attributes.UID;

    if (this.arrStruct.indexOf(feature.graphic.attributes.Purpose) != -1) {
      let buildingInfo = this.rawservicedata[1].lodgingFacilityList.filter(n => n.structureId == feature.graphic.attributes.UID);

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
        innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='https://services2.arcgis.com/utNNrmXb4IZOLXXs/ArcGIS/rest/services/JNFFieldCenterBuildingsPublicView/FeatureServer/0/" + feature.graphic.attributes.UID + "/attachments/" + attachmentsJSON.attachmentGroups[0].attachmentInfos[0].id + "' target='_blank'>";
        innerHTML += "<img src='https://services2.arcgis.com/utNNrmXb4IZOLXXs/ArcGIS/rest/services/JNFFieldCenterBuildingsPublicView/FeatureServer/0/" + feature.graphic.attributes.UID + "/attachments/" + attachmentsJSON.attachmentGroups[0].attachmentInfos[0].id + "' alt='" + attachmentsJSON.attachmentGroups[0].attachmentInfos[0].name + "' height='60px'>";
        innerHTML += "</a>";
      }
    }
    catch (er) { }

    return innerHTML;
  }

  async getAttachments(feature) {
    const response = this.httpClient.get("https://services2.arcgis.com/utNNrmXb4IZOLXXs/arcgis/rest/services/JNFFieldCenterBuildingsPublicView/FeatureServer/0/queryAttachments?objectIds=" + feature.graphic.attributes.UID + "&f=json")
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
    this.view.ui.add("genderButtonDiv", "bottom-left");
<<<<<<< HEAD

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
=======
>>>>>>> 7e3624ac9bf1873dac859eabced1a716933d429b

    this.layer = new FeatureLayer({
      url: this.url,
      popupTemplate: this.popupTrailheads,
<<<<<<< HEAD
      opacity: 0.9
      // ,
      // labelingInfo: [labelClass]
      //definitionExpression: filterex
=======
      opacity: 1,
      definitionExpression: "Purpose <> 'אוהל' and Purpose <> 'בקתה' and Purpose <> 'חדר'"
>>>>>>> 7e3624ac9bf1873dac859eabced1a716933d429b
    });
    this.graphicsLayer = new GraphicsLayer({
      opacity: 2
    });
    this.myMap.add(this.layer);
    this.myMap.add(this.graphicsLayer);
  }

  ngOnInit() {
    if (this.tripService.centerField) {
      this.forestCenter = this.tripService.centerField;
    }

<<<<<<< HEAD
=======
    this.loadWebMap();

>>>>>>> 7e3624ac9bf1873dac859eabced1a716933d429b
    this.tripService.lodgingFacilityListArrayObservable.subscribe(lodgingFacilityList => {

      console.log('maps --> lodgingFacilityList result:', lodgingFacilityList);
      this.viewGenderIcons = false;
      this.lodgingFacilityList = lodgingFacilityList;
      this.rawservicedata = lodgingFacilityList;
      this.queryandrender();

    });
<<<<<<< HEAD


=======
>>>>>>> 7e3624ac9bf1873dac859eabced1a716933d429b
  }

  genderButtonDivClick() {
    this.viewGenderIcons = !this.viewGenderIcons;
    this.queryandrender();
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
    //    console.log('facilityForDay: ', this.facilitiesArray[newCurrentDay].facilitiesList);
    this.lodgingFacilityForDay = this.tripService.lodgingFacilityListArray;
    //this.lodgingFacilityForDay = this.tripService.lodgingFacilityListArray[newCurrentDay].lodgingFacilityList;
    //this.rawservicedata = this.lodgingFacilityForDay;
    // this.queryandrender();
  }

  onChangeForestCenter() {
    //this.rawservicedata = this.fakeApi.getLodgingFacilityList(this.forestCenter.name);
    //this.lodgingFacilityForDay
    this.viewGenderIcons = false;
    this.rawservicedata = this.lodgingFacilityList;
    this.queryandrender();
  };

  queryTask_executeForExtent(response: any) {
    this.view.goTo(response.extent);
  }

  getSVGStatus(Purpose: string, Status: string) {
    let svgPath: string;
    if (Purpose == "בקתה")
      svgPath = (Status == "פנוי") ? "../../../../assets/images/svgcabinPanui.svg" : "../../../../assets/images/svgcabinTafus.svg";
    else if (Purpose == "אוהל")
      svgPath = (Status == "פנוי") ? "../../../../assets/images/svgtentPanui.svg" : "../../../../assets/images/svgtentTafus.svg";
    else if (Purpose == "חדר")
      svgPath = (Status == "פנוי") ? "../../../../assets/images/svgroomPanui.svg" : "../../../../assets/images/svgroomTafus.svg";

    return svgPath;
  }

  getSVGGender(Purpose: string, Gender: string) {
    let svgPath: string;
    if (Purpose == "בקתה")
      if (Gender == "בנות")
        svgPath = "../../../../assets/images/svgcabinBanot.svg";
      else if (Gender == "בנים")
        svgPath = "../../../../assets/images/svgcabinBanim.svg";
      else
        svgPath = "../../../../assets/images/svgcabinMeurav.svg";
    else if (Purpose == "אוהל")
      if (Gender == "בנות")
        svgPath = "../../../../assets/images/svgtentBanot.svg";
      else if (Gender == "בנים")
        svgPath = "../../../../assets/images/svgtentBanim.svg";
      else
        svgPath = "../../../../assets/images/svgtentMeurav.svg";
    else if (Purpose == "חדר")
      if (Gender == "בנות")
        svgPath = "../../../../assets/images/svgroomBanot.svg";
      else if (Gender == "בנים")
        svgPath = "../../../../assets/images/svgroomBanim.svg";
      else
        svgPath = "../../../../assets/images/svgroomMeurav.svg";

    return svgPath;
  }

  layer_queryFeatures(response: any) {
    this.rawservicedata = this.lodgingFacilityList;

    let buldingfeature: any;

    this.graphicsLayer.removeAll();

    for (let i = 0; i < response.features.length; i++) {

      buldingfeature = response.features[i];
      if (this.arrStruct.indexOf(buldingfeature.attributes.Purpose) != -1) {
        // Create a graphic and add the geometry and symbol by vacancy
        var point = new Point({
          x: buldingfeature.geometry.x,
          y: buldingfeature.geometry.y
        });

        var objBin = this.rawservicedata[1].lodgingFacilityList.filter(n => n.structureId == buldingfeature.attributes.UID);

        if (objBin.length > 0)
          objBin = objBin[0];
        else
          objBin = null;

        let sym: PictureMarkerSymbol = new PictureMarkerSymbol();

        sym.height = 15;
        sym.width = 20;

        if (objBin) {
          if (!this.viewGenderIcons)
            sym.url = this.getSVGStatus(buldingfeature.attributes.Purpose, objBin.status);
          else
            sym.url = this.getSVGGender(buldingfeature.attributes.Purpose, objBin.gender);
        }

        let pointGraphic = new Graphic({
          geometry: point,
<<<<<<< HEAD
          symbol: sym
=======
          symbol: sym,
          attributes: buldingfeature.attributes,
          popupTemplate: this.popupTrailheads
>>>>>>> 7e3624ac9bf1873dac859eabced1a716933d429b
        });

        this.graphicsLayer.add(pointGraphic);
      }
    }
  }

}