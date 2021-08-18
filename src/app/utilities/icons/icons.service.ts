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
  ) {}

  public iconList: IconItem[] = [
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
