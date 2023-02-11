import {Component, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {RoutesIntern} from "../../services/routesIntern";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-navigation',
  templateUrl: './admin-navigation.component.html',
  styleUrls: ['./admin-navigation.component.scss']
})
export class AdminNavigationComponent implements OnInit{

  icebergMorphRoute = '/' + RoutesIntern.morphingIceberg;
  icebergEmosRoute = '/' + RoutesIntern.icebergEmos;


  constructor(private router: Router) {}

  ngOnInit(): void {
      this.router.navigate(['']);

  }

}
