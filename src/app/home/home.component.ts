import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  customOptions: OwlOptions = {
    // stagePadding: 50,
    loop: true,
    margin: 15,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    // dots: true,
    navSpeed: 1000,
    // navText: ['<', '>'],
    responsive: {
      0: {
        // this is for break-point
        items: 2,
      },
      400: {
        items: 3,
      },
      740: {
        items: 4,
      },
      940: {
        items: 6,
      },
    },
    // nav: true,
  };
  constructor() {}

  ngOnInit(): void {}
}
