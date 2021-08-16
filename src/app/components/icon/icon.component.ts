import { IconsService } from './../../utilities/icons/icons.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {

  @Input() public type: string = ""
  @Input() public key: string = ""
  @Input() public color: string = ""

  constructor(
    private iconsService: IconsService
  ) { }

  ngOnInit(): void {
    this.iconsService.setIcon(this.key)
  }

}
