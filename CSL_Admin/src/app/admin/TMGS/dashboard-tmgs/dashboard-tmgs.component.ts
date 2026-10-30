import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexTooltip,
  ApexDataLabels,
  ApexPlotOptions,
  ApexFill,
} from 'ng-apexcharts';
import { BlogService } from '../../blog.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  colors: string[];
};

@Component({
  selector: 'app-dashboard-tmgs',
  templateUrl: './dashboard-tmgs.component.html',
  styleUrls: ['./dashboard-tmgs.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DashboardTmgsComponent {
ads: any[] = [];
  projectOptions: any = {};
  selectedRange: string = ''; // Default: all time
analyticsData: {
    totalGames: number;
    totalBlogs: number;
    totalCareers: number;
    totalAds: number;
  } = { totalGames: 0, totalBlogs: 0, totalCareers: 0, totalAds: 0 };
  
  constructor(private adService: BlogService) {}

  ngOnInit() {
    this.fetchAds();

    this.adService.getTmgsAnalyticsCounts().subscribe((res) => {
      if (res.success) {
        this.analyticsData = res.data;
      }
    });
  }

  fetchAds() {
    this.adService.getAdsData(this.selectedRange).subscribe((res) => {
      this.ads = res.data || [];

      const platformSet = new Set<string>();
      this.ads.forEach((ad) => {
        ad.platformClicks.forEach((p: { platform: string }) =>
          platformSet.add(p.platform)
        );
      });
      const platforms = Array.from(platformSet);

      const getRandomColor = () =>
        '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      const platformColors = platforms.map(() => getRandomColor());
      const playCountColor = '#000000'; // or '#FFD700'
      const allColors = [...platformColors, playCountColor];

      const categories = this.ads.map((ad) => ad.name);

      const platformSeries = platforms.map((platform) => ({
        name: platform.charAt(0).toUpperCase() + platform.slice(1),
        data: this.ads.map((ad) => {
          const match = ad.platformClicks.find(
            (p: { platform: string }) => p.platform === platform
          );
          return match ? match.clicks : 0;
        }),
      }));

      const playCountSeries = {
        name: '🎮 Play Count',
        data: this.ads.map((ad) => ad.playCount || 0),
      };

      this.projectOptions = {
        chart: {
          type: 'bar',
          height: 400,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '50%',
            endingShape: 'rounded',
          },
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent'],
        },
        xaxis: {
          categories,
        },
        yaxis: {
          title: {
            text: 'Clicks / Plays',
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: (val: number) => `${val} interactions`,
          },
        },
        colors: allColors,
        series: [...platformSeries, playCountSeries],
      };
    });
  }

}
