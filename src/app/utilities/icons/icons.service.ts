import { BehaviorSubject, Subject } from 'rxjs';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import {
  BUTTON_ICON,
  DESTINATION_ICON,
  THUMBUP_ICON,
  REPORTS_ICON,
  RELOAD_ICON,
  FLAG_ICON,
  SHIELD_ICON,
  BUS_ICON,
  SITE_ICON,
  BED_ICON,
  TENT_ICON,
  GUIDE_ICON,
  DINNER_ICON,
  MUSIC_ICON,
  BELL_ICON,
  EDIT_ICON,
  GENDER_ICON,
  V_SIGN,
  ADD_ICON,
  PLAYGROUND_ICON,
  LIST_ICON,
  CALENDER_ICON,
  BOTTOM_LOGO,
  OPEN_PLUS,
  GROUP_ICON,
  RESTAURANT_ICON,
  LOGO_ICON,
  PINK_CIRCLE,
  WHITE_CIRCLE,
  MAN_WITH_BAG,
} from './icons.list';

export interface IconItem {
  key: string;
  svgUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class IconsService {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) { }

  public iconList: IconItem[] = [
    {
      key:'man-with-bag',
      svgUrl:MAN_WITH_BAG
    },
     {
       key:'white-circle',
       svgUrl:WHITE_CIRCLE
     },
    {
      key:'pink-circle',
      svgUrl: PINK_CIRCLE
    },
    {
      key: 'open-plus',
      svgUrl: OPEN_PLUS
    },
    {
      key: 'like',
      svgUrl: THUMBUP_ICON,
    },
    {
      key: 'destination',
      svgUrl: DESTINATION_ICON,
    },
    {
      key: 'button',
      svgUrl: BUTTON_ICON,
    },
    {
      key: 'vSign',
      svgUrl: V_SIGN,
    },
    {
      key: 'edit',
      svgUrl: EDIT_ICON,
    },
    {
      key: 'gender',
      svgUrl: GENDER_ICON,
    },
    {
      key: 'button',
      svgUrl: BUTTON_ICON,
    },

    {
      key: 'report',
      svgUrl: REPORTS_ICON,
    },
    {
      key: 'reload',
      svgUrl: RELOAD_ICON,
    },
    {
      key: 'flag',
      svgUrl: FLAG_ICON,
    },
    {
      key: 'shield',
      svgUrl: SHIELD_ICON,
    },
    {
      key: 'restaurant',
      svgUrl: RESTAURANT_ICON
    },
    {
      key: 'bus',
      svgUrl: BUS_ICON,
    },
    {
      key: 'site',
      svgUrl: SITE_ICON,
    },
    {
      key: 'bed',
      svgUrl: BED_ICON,
    },
    {
      key: 'tent',
      svgUrl: TENT_ICON,
    },
    {
      key: 'guide',
      svgUrl: GUIDE_ICON,
    },
    {
      key: 'dinner',
      svgUrl: DINNER_ICON,
    },
    {
      key: 'music',
      svgUrl: MUSIC_ICON,
    },
    {
      key: 'bell',
      svgUrl: BELL_ICON,
    },
    {
      key: 'add',
      svgUrl: ADD_ICON,
    },
    {
      key: 'bed',
      svgUrl: BED_ICON,
    },
    {
      key: 'playground',
      svgUrl: PLAYGROUND_ICON,
    },
    {
      key: 'list',
      svgUrl: LIST_ICON,
    },
    {
      key: 'calendar',
      svgUrl: CALENDER_ICON,
    },
    {
      key: 'bottom-logo',
      svgUrl: BOTTOM_LOGO,
    },
    {
      key: 'group',
      svgUrl: GROUP_ICON,
    },
    {
      key: 'logo',
      svgUrl: LOGO_ICON,
    },
  ];

  private findIcon(key: string): IconItem {
    const icon = this.iconList.find((item) => item.key === key.toLowerCase());
    return icon ? icon : this.iconList[0];
  }

  public setIcon(key: string) {
    this.iconRegistry.addSvgIconLiteral(
      key,
      this.sanitizer.bypassSecurityTrustHtml(this.findIcon(key).svgUrl)
    );
  }

  public setIconsList(items: any[]) {
    items.map((item) => {
      this.setIcon(item.svgUrl);
    });
  }
}
