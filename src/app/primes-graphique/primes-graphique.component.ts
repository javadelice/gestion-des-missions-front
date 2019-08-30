import { Component, OnInit, Input } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { PrimesService } from '../primes/primes.service';

@Component({
  selector: 'app-primes-graphique',
  templateUrl: './primes-graphique.component.html',
  styleUrls: ['./primes-graphique.component.css']
})
export class PrimesGraphiqueComponent implements OnInit {

  primes: number[];

  public barChartOptions: ChartOptions = {
    responsive: true,
    title: {
      display: true,
      text: 'Primes en € ',
      fontSize: 20,
    }
  };
  public barChartLabels: Label[] = ['Janv.', 'Fév.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juill.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [{ data: [] }];

  constructor(private primesService: PrimesService) { }

  ngOnInit() {
    this.primesService.abonnement().subscribe(primes => {
      this.primes = primes;
      this.barChartData[0] = {
        data: this.primes, backgroundColor: 'rgba(41,128,185,0.6)', borderColor: 'rgba(41,128,185,1)',
        hoverBackgroundColor: 'rgba(41,128,185,0.8)', hoverBorderColor: 'rgba(41,128,185,1)'
      };
    });
  }

}
