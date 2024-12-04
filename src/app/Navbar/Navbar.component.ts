import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Navbar',
  templateUrl: './Navbar.component.html',
  styleUrls: ['./Navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

}
