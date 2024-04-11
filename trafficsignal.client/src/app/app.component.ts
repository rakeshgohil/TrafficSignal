import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrafficLightService, SignalData } from '../TrafficLightService';
import { Subscription, concatMap, interval, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  // Initial light states, you can dynamically change these
  northLight: string = 'traffic-light green';
  southLight: string = 'traffic-light red';
  eastLight: string = 'traffic-light yellow';
  westLight: string = 'traffic-light red';
  private lastChangedDateTime = new Date(); // Update as needed for your logic
  private currentDuration = 0; // Example duration in seconds
  signalData: SignalData = {
    currentDuration: 0,
    lastChanged: new Date(),
    isNorthGreen: true,
    isNorthYellow: false,
    isEastGreen: false,
    isEastYellow: false,
  };

  private subscription: Subscription = new Subscription();
  constructor(private trafficLightService: TrafficLightService) {
    console.log('constrcutor of AppComponent');
  }
    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }
  ngOnInit(): void {
    this.subscription = interval(1000).pipe(
      // Use switchMap to call the service method on each interval tick
      concatMap(() => {
        return this.trafficLightService.getSignalData(this.signalData);
      })
    ).subscribe({
      next: (data) => {
        console.log(data); // Handle the API response
        if (data !== null) {
          console.log(data);

          this.signalData = data;
          var north = '';
          var east = '';
          // Update your component state based on the received data
          if (this.signalData.isNorthGreen) {
            north = 'green';
          }
          else if (this.signalData.isNorthYellow) {
            north = 'yellow';
          }
          else {
            north = 'red';
          }

          if (this.signalData.isEastGreen) {
            east = 'green';
          }
          else if (this.signalData.isEastYellow) {
            east = 'yellow';
          }
          else {
            east = 'red';
          }

          this.northLight = 'traffic-light ' + north;
          this.southLight = 'traffic-light ' + north;

          this.eastLight = 'traffic-light ' + east;
          this.westLight = 'traffic-light ' + east;
        }
      },
      error: (error) => {
        console.error(error); // Handle error
      }
    });
    }
  title = 'trafficsignal.client';
}
