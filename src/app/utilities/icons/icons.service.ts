import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { BUTTON_ICON, DESTINATION_ICON, THUMBUP_ICON } from './icons.list';

export interface IconItem {
  key: string;
  svgUrl: string;
}

@Injectable({
  providedIn: 'root'
})

export class IconsService {

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) { }

  public iconList: IconItem[] =
    [
      {
        key: 'like',
        svgUrl: THUMBUP_ICON
      },
      {
        key: 'destination',
        svgUrl: DESTINATION_ICON
      },
      {
        key: 'button',
        svgUrl: BUTTON_ICON
      },
    ]

  private findIcon(key: string): IconItem {
    const icon = this.iconList.find((item) => item.key === key)
    return icon ? icon : this.iconList[0]
  }


  public setIcon(key: string) {
    this.iconRegistry.addSvgIconLiteral(key, this.sanitizer.bypassSecurityTrustHtml(this.findIcon(key).svgUrl));
  }

  public setIconsList(items: any[]) {
    items.map((item) => {
      this.setIcon(item.svgUrl)
    })
  }
}
