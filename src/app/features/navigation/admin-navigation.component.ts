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

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  icebergMorphRoute = '/' + RoutesIntern.morphingIceberg;
  icebergEmosRoute = '/' + RoutesIntern.icebergEmos;


  constructor(private breakpointObserver: BreakpointObserver,  private router: Router) {}



  ngOnInit(): void {
      this.router.navigate(['']);

  }

}
