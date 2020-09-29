import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-boxscore',
  templateUrl: './boxscore.component.html',
  styleUrls: ['./boxscore.component.css']
})
export class BoxscoreComponent implements OnInit {
  boxscore_jugadores:any[] = [
    {
    number: 25,
    name: "Jairo Fernández",
    minutes: "Base",
    points: 12,
    t2m: 1,
    t2a: 2,
    t2_percentage: 50
    },
    {
      number: 25,
      name: "Jairo Fernández",
      minutes: "Base",
      points: 12,
      t2m: 1,
      t2a: 2,
      t2_percentage: 50
    }]

  constructor() { }

  ngOnInit(): void {
  }

}
