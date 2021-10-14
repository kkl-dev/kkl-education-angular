import { IconsService } from './../../utilities/icons/icons.service';
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

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
  @Input() public backgroundColor: string;
  @Input() public scale: number | string;

  @Input() public md$: Observable<boolean>;


  public matScale: string;

  constructor(private iconsService: IconsService) { }

  ngOnInit(): void {
    this.setIcon();
    this.setIconColor();
    this.setIconSize();
    this.subscribeToMd()
  }

  private setIcon() {
    this.type = this.type || 'svg';
    if (this.type === 'svg') {
      this.iconsService.setIcon(this.key);
    }
  }

  private setIconColor() {
    this.color = this.isActive ? 'active' : this.color || 'default';
  }

  private setIconSize() {
    this.width = this.size;
    this.height = this.size;
    this.matScale = this.scale ? `scale(${this.scale})` : 'scale(1)';
  }

  private subscribeToMd() {

    if (this.md$) {

      this.md$.subscribe(
        (value) => {
          this.scale = value ? 1 : 1.5
          this.setIconSize()
        }
      )
    }
  }
}
