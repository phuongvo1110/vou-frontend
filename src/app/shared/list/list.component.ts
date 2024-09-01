import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Event } from '../../_models/event';
import { Voucher } from '../../_models/voucher';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  @Input() events?: Event[] = [];
  @Input() vouchers?: Voucher[] = [];
}
