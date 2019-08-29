import { Component, OnInit, Input } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-primes-graphique',
  templateUrl: './primes-graphique.component.html',
  styleUrls: ['./primes-graphique.component.css']
})
export class PrimesGraphiqueComponent implements OnInit {

  @Input() primes: number[];

  primes2 = [{ data: [] }];

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['Janv.', 'Fév.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juill.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = this.primes2;

  constructor() { }

  ngOnInit() {
    this.primes2 = [];
    // this.primes2[0].data = [];
    console.log(this.primes);
    this.primes2[0].data = this.primes;
    // for (let obj of this.moisPrimes) {
    //   console.log(obj.prime);
    //   this.primes2[0].data.push(obj.prime);
    // }
  }

}
