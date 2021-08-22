import { Component, OnInit, Input } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Query from '@arcgis/core/rest/support/Query';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import QueryTask from '@arcgis/core/tasks/QueryTask';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  // fake data to dev this will be a response to a requset from kkl huts services 
  nesharimday1 = { "biktot": { "bikta": [{ "uid": "149", "school": "אורט", "gender": "boys" }, { "uid": "150", "school": "אורט", "gender": "girls" }, { "uid": "151", "school": "בני ציון", "gender": "boysAndGirls" }] } };
  nesharimday2 = { "biktot": { "bikta": [{ "uid": "170", "school": "בית ספר סתם", "gender": "boys" }, { "uid": "171", "school": "בית ספר סתם", "gender": "girls" }] } };
  nesharimday3 = { "biktot": { "bikta": [{ "uid": "175", "school": "אורט", "gender": "boys" }, { "uid": "176", "school": "אורט", "gender": "girls" }, { "uid": "178", "school": "מקיף משהו", "gender": "boysAndGirls" }, { "uid": "179", "school": "מקיף משהו", "gender": "boysAndGirls" }] } };

  ziporiday1 = { "biktot": { "bikta": [{ "uid": "913", "school": "אורט", "gender": "boys" }, { "uid": "914", "school": "אורט", "gender": "girls" }, { "uid": "915", "school": "בני ציון", "gender": "boysAndGirls" }] } };
  ziporiday2 = { "biktot": { "bikta": [{ "uid": "890", "school": "אורט", "gender": "boys" }, { "uid": "894", "school": "אורט", "gender": "girls" }, { "uid": "927", "school": "בני ציון", "gender": "boysAndGirls" }] } };
  ziporiday3 = { "biktot": { "bikta": [{ "uid": "885", "school": "אורט", "gender": "boys" }, { "uid": "897", "school": "אורט", "gender": "girls" }, { "uid": "898", "school": "בני ציון", "gender": "boysAndGirls" }] } };

  yatirday1 = { "biktot": { "bikta": [{ "uid": "118", "school": "אורט", "gender": "boys" }, { "uid": "119", "school": "אורט", "gender": "girls" }, { "uid": "122", "school": "בני ציון", "gender": "boysAndGirls" }] } };
  yatirday2 = { "biktot": { "bikta": [{ "uid": "119", "school": "בית ספר סתם", "gender": "boys" }, { "uid": "123", "school": "בית ספר סתם", "gender": "girls" }] } };
  yatirday3 = { "biktot": { "bikta": [{ "uid": "121", "school": "אורט", "gender": "boys" }, { "uid": "122", "school": "אורט", "gender": "girls" }, { "uid": "118", "school": "מקיף משהו", "gender": "boysAndGirls" }, { "uid": "119", "school": "מקיף משהו", "gender": "boysAndGirls" }] } };

  ilanotday1 = { "biktot": { "bikta": [{ "uid": "605", "school": "אורט", "gender": "boys" }] } };
  ilanotday2 = { "biktot": { "bikta": [{ "uid": "791", "school": "אורט", "gender": "girls" }] } };
  ilanotday3 = { "biktot": { "bikta": [{ "uid": "792", "school": "אורט", "gender": "boysAndGirls" }] } };

  betieshelday1 = { "biktot": { "bikta": [{ "uid": "428", "school": "אורט", "gender": "boys" }] } };
  betieshelday2 = { "biktot": { "bikta": [{ "uid": "430", "school": "אורט", "gender": "girls" }] } };
  betieshelday3 = { "biktot": { "bikta": [{ "uid": "430", "school": "אורט", "gender": "boysAndGirls" }] } };

  laviday1 = { "biktot": { "bikta": [{ "uid": "1206", "school": "אורט", "gender": "boys" }, { "uid": "1224", "school": "אורט", "gender": "girls" }, { "uid": "1231", "school": "בני ציון", "gender": "boysAndGirls" }] } };
  laviday2 = { "biktot": { "bikta": [{ "uid": "1210", "school": "אורט", "gender": "boys" }, { "uid": "1223", "school": "אורט", "gender": "girls" }, { "uid": "1202", "school": "מקיף משהו", "gender": "boysAndGirls" }, { "uid": "1204", "school": "מקיף משהו", "gender": "boysAndGirls" }] } };
  laviday3 = { "biktot": { "bikta": [{ "uid": "1214", "school": "בית ספר סתם", "gender": "boys" }, { "uid": "1229", "school": "בית ספר סתם", "gender": "girls" }] } };

  shuniday1 = { "biktot": { "bikta": [{ "uid": "873", "school": "אורט", "gender": "boys" }, { "uid": "872", "school": "אורט", "gender": "girls" }, { "uid": "865", "school": "מקיף משהו", "gender": "boysAndGirls" }, { "uid": "670", "school": "מקיף משהו", "gender": "boysAndGirls" }] } };
  shuniday2 = { "biktot": { "bikta": [{ "uid": "874", "school": "אורט", "gender": "boys" }, { "uid": "871", "school": "אורט", "gender": "girls" }, { "uid": "862", "school": "מקיף משהו", "gender": "boysAndGirls" }, { "uid": "873", "school": "מקיף משהו", "gender": "boysAndGirls" }] } };
  shuniday3 = { "biktot": { "bikta": [{ "uid": "870", "school": "אורט", "gender": "boysAndGirls" }] } };
  constructor() { }

  myMap!: WebMap;

  view!: MapView;

  url: string = "https://services2.arcgis.com/utNNrmXb4IZOLXXs/arcgis/rest/services/JNFFieldCenterBuildingsPublicView/FeatureServer/0";

  layer!: FeatureLayer;
  graphicsLayer!: GraphicsLayer;
  rawservicedata: any;
  fullhuts: any;
  datatoiter: any;
  pointGraphic: any;

  @Input() place: any; // = "מרכז שדה ציפורי"; //document.getElementById("myplaceSelect").value;
  @Input() day: any; //= 1;// document.getElementById("mydaySelect").value;

  loadWebMap(): void {
    this.myMap = new WebMap({
      basemap: "topo"
    });

    this.view = new MapView({
      map: this.myMap,
      container: "mapdiv",
      center: [35.1, 31.5],
      zoom: 8
    });
    this.layer = new FeatureLayer({
      url: this.url,
      //definitionExpression: filterex
    });
    this.graphicsLayer = new GraphicsLayer({
      opacity: 1
    });
    this.myMap.add(this.graphicsLayer);
    this.myMap.add(this.layer);

    this.view.on("click", event => {
      this.placeandday()
    });

  }

  ngOnInit(): void {
    this.loadWebMap();
  }

  queryandrender(place: any, fullhuts: any, datatoiter: any) {
    this.fullhuts = fullhuts;
    this.datatoiter = datatoiter;

    let filterex = "SiteName = '" + this.place + "'";
    /// query for extnet
    let queryTask = new QueryTask({
      url: this.url
    });
    let queryextnet = new Query();
    queryextnet.where = filterex;
    queryextnet.outSpatialReference = new SpatialReference({
      wkid: 4326
    });
    
    queryTask.executeForExtent(queryextnet).then((response)=>{
      this.queryTask_executeForExtent(response)
    });
    // query for data 
    let query = this.layer.createQuery();
    query.where = filterex;
    query.outFields = ["SiteName", "Purpose", "UID"];
    query.outSpatialReference = new SpatialReference({
      wkid: 4326
    });;
    this.layer.queryFeatures(query).then((response)=>{
      this.layer_queryFeatures(response);
    });
  };

  placeandday() {
    let fullhuts: any = [];
    let rawservicedata: any;

    if ((this.place == "מרכז שדה נס הרים") && (this.day == 1)) { rawservicedata = this.nesharimday1; };
    if ((this.place == "מרכז שדה נס הרים") && (this.day == 2)) { rawservicedata = this.nesharimday2; };
    if ((this.place == "מרכז שדה נס הרים") && (this.day == 3)) { rawservicedata = this.nesharimday3; };
    if ((this.place == "מרכז שדה ציפורי") && (this.day == 1)) {  rawservicedata = this.ziporiday1;  };
    if ((this.place == "מרכז שדה ציפורי") && (this.day == 2)) { rawservicedata = this.ziporiday2 };
    if ((this.place == "מרכז שדה ציפורי") && (this.day == 3)) { rawservicedata = this.ziporiday3 };
    if ((this.place == "אילנות מערב") && (this.day == 1)) { rawservicedata = this.ilanotday1 };
    if ((this.place == "אילנות מערב") && (this.day == 2)) { rawservicedata = this.ilanotday2 };
    if ((this.place == "אילנות מערב") && (this.day == 3)) { rawservicedata = this.ilanotday3 };
    if ((this.place == "מצפה בית אשל") && (this.day == 1)) { rawservicedata = this.betieshelday1 };
    if ((this.place == "מצפה בית אשל") && (this.day == 2)) { rawservicedata = this.betieshelday2 };
    if ((this.place == "מצפה בית אשל") && (this.day == 3)) { rawservicedata = this.betieshelday3 };
    if ((this.place == "מרכז שדה יתיר") && (this.day == 1)) { rawservicedata = this.yatirday1 };
    if ((this.place == "מרכז שדה יתיר") && (this.day == 2)) { rawservicedata = this.yatirday2 };
    if ((this.place == "מרכז שדה יתיר") && (this.day == 3)) { rawservicedata = this.yatirday3 };
    if ((this.place == "מרכז שדה לביא") && (this.day == 1)) { rawservicedata = this.laviday1 };
    if ((this.place == "מרכז שדה לביא") && (this.day == 2)) { rawservicedata = this.laviday2 };
    if ((this.place == "מרכז שדה לביא") && (this.day == 3)) { rawservicedata = this.laviday3 };
    if ((this.place == "מרכז שדה שוני") && (this.day == 1)) { rawservicedata = this.shuniday1 };
    if ((this.place == "מרכז שדה שוני") && (this.day == 2)) { rawservicedata = this.shuniday2 };
    if ((this.place == "מרכז שדה שוני") && (this.day == 3)) { rawservicedata = this.shuniday3 };
    
    var datatoiter = rawservicedata["biktot"]["bikta"]
    for (let i = 0; i < datatoiter.length; i++) {
      fullhuts.push(Number(datatoiter[i]["uid"]))
    };
    this.queryandrender(this.place, fullhuts, datatoiter);
  };

  queryTask_executeForExtent(response: any) {
    this.view.goTo(response.extent);
  }

  layer_queryFeatures(response: any) {
    let buldingfeature: any;

    for (let i = 0; i < response.features.length; i++) {

      buldingfeature = response.features[i];
      // Create a graphic and add the geometry and symbol by vacancy
      var point = new Point({
        x: buldingfeature.geometry.x,
        y: buldingfeature.geometry.y
      });

      // check with kkl huts data from services to see vacancy 
      if (this.fullhuts.includes(buldingfeature.attributes.UID)) {
        // add attribute to graphic layer
        // Create a symbol for drawing the point
        let pointGraphic: any;

        var full = {
          type: "simple-marker",
          color: "red",
          size: "25px"

        };
       
        pointGraphic = new Graphic({
          geometry: point,
          symbol: full,
          attributes: {}
        });
         
        for (let i = 0; i < this.datatoiter.length; i++) {
          if (buldingfeature.attributes.UID == this.datatoiter[i]["uid"]) {
            this.pointGraphic.attributes = {
              "uid": this.datatoiter[i]["uid"],
              "school": this.datatoiter[i]["school"],
              "gender": this.datatoiter[i]["gender"],
              "vacancy": "full"
            };
          };
        };

      } else {
        let empty = {
          type: "simple-marker",
          color: "blue",
          size: "25px"

        };
        this.pointGraphic = new Graphic({
          geometry: point,
          symbol: empty,
          attributes: {}
        });

        this.pointGraphic.attributes = {
          "uid": buldingfeature.attributes.UID,
          "vacancy": "empty"
        };
      };
      this.graphicsLayer.add(this.pointGraphic);
    };
  }


}
