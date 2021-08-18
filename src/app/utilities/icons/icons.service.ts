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
  BELL_ICON,
  EDIT_ICON,
  BOYS_GIRLS_ICON,
  V_SIGN,
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
      key: 'vSign',
      svgUrl: V_SIGN,
    },
    {
      key: 'edit',
      svgUrl: EDIT_ICON,
    },
    {
      key: 'boysGirls',
      svgUrl: BOYS_GIRLS_ICON,
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
      key: 'bell',
      svgUrl: BELL_ICON,
    },
  ];

  private findIcon(key: string): IconItem {
    const icon = this.iconList.find((item) => item.key === key);
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
