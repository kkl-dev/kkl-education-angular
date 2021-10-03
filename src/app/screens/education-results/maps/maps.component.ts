import { Component, OnInit, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
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
import { TripService } from 'src/app/services/trip.service';
import { FakeService } from 'src/app/services/fake.service';
@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  @Input() place: any = "מרכז שדה ציפורי"; //document.getElementById("myplaceSelect").value;
  @Input() day: any = 1;// document.getElementById("mydaySelect").value;
  // @Input() visible: any;
  // @Output() visibleChange: EventEmitter<any> = new EventEmitter<any>();

  url: string = "https://services2.arcgis.com/utNNrmXb4IZOLXXs/arcgis/rest/services/JNFFieldCenterBuildingsPublicView/FeatureServer/0";
  myMap!: WebMap;
  view!: MapView;
  layer!: FeatureLayer;
  graphicsLayer!: GraphicsLayer;
  rawservicedata: any;
  fullhuts: any;
  datatoiter: any;
  pointGraphic: any;
  forestCenter: any;

  constructor(public tripService: TripService, public fakeApi: FakeService) { }

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
    // this.view.on("click", event => {
    //   this.onChangeForestCenter();
    // });
  }

  ngOnInit() {
    this.loadWebMap();
    if (this.tripService.centerField) {
      this.place = this.tripService.centerField.name;
      this.forestCenter = this.tripService.centerField.name;

      this.onChangeForestCenter();
    }

    //else {

      this.tripService.forestCenter.subscribe(forestCenter => {
        this.forestCenter = forestCenter; // this set's the username to the default observable value
        console.log('maps -- > forest Center from server BehaviorSubject:', this.forestCenter);
        this.place = forestCenter.name;
        this.onChangeForestCenter();
      });
  
    //}
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes) {
    //   this.updateForestCenter(changes);
    // }
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

    queryTask.executeForExtent(queryextnet).then((response) => {
      this.queryTask_executeForExtent(response)
    });
    // query for data
    let query = this.layer.createQuery();
    query.where = filterex;
    query.outFields = ["SiteName", "Purpose", "UID"];
    query.outSpatialReference = new SpatialReference({
      wkid: 4326
    });;
    this.layer.queryFeatures(query).then((response) => {
      this.layer_queryFeatures(response);
    });
  };

  onChangeForestCenter() {
    let fullhuts: any = [];
    let rawservicedata: any;
    this.day = 1;

    if ((this.place == "נס הרים") && (this.day == 1)) {
      this.place = "מרכז שדה נס הרים";
      rawservicedata = this.nesharimday1;
    };
    // fix search by id 
    //this.forestCenter
    if ((this.place == "ציפורי") && (this.day == 1)) { 
      this.place = "מרכז שדה ציפורי";    
      rawservicedata = this.ziporiday1; };
    if ((this.place == "אילנות") && (this.day == 1)) { 
      this.place = "אילנות מערב";          
      rawservicedata = this.ilanotday1 };
    if ((this.place == "בית אשל") && (this.day == 1)) { 
      this.place = "מצפה בית אשל";    
      rawservicedata = this.betieshelday1 };
    if ((this.place == "יתיר") && (this.day == 1)) { 
      this.place = "מרכז שדה יתיר";    
      rawservicedata = this.yatirday1 };
    if ((this.place == "לביא") && (this.day == 1)) { 
      this.place = "מרכז שדה לביא";    
      rawservicedata = this.laviday1 };
    if ((this.place == "שוני") && (this.day == 1)) { 
      this.place = "מרכז שדה שוני";    
      rawservicedata = this.shuniday1 };
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
}
