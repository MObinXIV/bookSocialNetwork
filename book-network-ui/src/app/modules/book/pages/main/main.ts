import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Menu} from '../../components/menu/menu';

@Component({
  selector: 'app-main',
  imports: [
    RouterOutlet,
    Menu
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss',
  standalone: true
})
export class Main {

}
