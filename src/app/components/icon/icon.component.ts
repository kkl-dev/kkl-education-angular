import { IconsService } from './../../utilities/icons/icons.service';
import { Component, OnInit, Input } from '@angular/core';

export interface IconClasses {
  default: boolean;
  active: boolean;
}

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
  @Input() public size: number = 24;
  @Input() public width: number;
  @Input() public height: number;

  @Input() public isActive: boolean;

  @Input() public type: string;
  @Input() public key: string = '';
  @Input() public color: string;
  @Input() public scale: number | string;

  public matScale: string;
  public default: boolean = true;

  constructor(private iconsService: IconsService) {}

  ngOnInit(): void {
    this.setIcon();
    this.setIconColor();
    this.setIconSize();
  }

  private setIcon() {
    this.type = this.type || 'svg';
    if (this.type === 'svg') {
      this.iconsService.setIcon(this.key);
    }
  }

  private setIconColor() {
    if (this.color && this.color !== 'default') {
      this.default = false;
    } else {
      this.default = !this.isActive;
    }
  }

  private setIconSize() {
    this.width = this.size;
    this.height = this.size;
    this.matScale = this.scale ? `scale(${this.scale})` : 'scale(1)';
  }
}
