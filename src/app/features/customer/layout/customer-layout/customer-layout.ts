import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomerHeader } from '../../components/customer-header/customer-header';
import { CustomerFooter } from '../../components/customer-footer/customer-footer';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [RouterOutlet, CustomerHeader, CustomerFooter],
  templateUrl: './customer-layout.html',
})
export class CustomerLayout {}
