import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-area-purpose',
  templateUrl: './area-purpose.component.html',
  styleUrls: ['./area-purpose.component.scss']
})
export class AreaPurposeComponent implements OnInit {

  public content=[ 
    { 
      headline:'יעוד השטח',
      footer:'ערכי טבע ובתי גידול ייחודיים'
  },
  { 
    headline:'תצורת צומח רצויה',
    footer:'בוסתנים ומטעים'
},
{ 
  headline:'עקרונות עיצוב צומח',
  footer:'מעבר מיער חד גילי ליער רב גילי'
}, { 
  headline:'מטרת דילול ראשית',
  text:'בהתאם לאיור 4 בחוברת דילולים',
  footer:'סניטציה לאחר שריפה או תמותה'
},
{ 
  headline:'מטרת דילול משנית',
  text:'במידה וקיימת מטרה נוסםת',
  footer:'סניטציה ובטיחות לעצים בודדים'
},
{ 
  headline:'תדירות דילול מתוכננת בעתיד',
  text:'בהתאם לטבלה 3 בחוברת דילולים והערכה של מנהל שטח',
  footer:'נמוכה(פעם אחת במהלך מחזור היער)'
},
{ 
  headline:'סדר עדיפות לביצוע',
  text:'בהתאם לטבלה 5 בחוברת דילולים',
  footer:'בינוני(2-5)'
}
]

  constructor() { }

  ngOnInit(): void {
  }

}
