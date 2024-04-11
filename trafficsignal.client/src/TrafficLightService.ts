import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SignalData {
  currentDuration: number;
  lastChanged: Date; // or string if you prefer to handle the conversion separately
  isNorthGreen: boolean;
  isNorthYellow: boolean;
  isEastGreen: boolean;
  isEastYellow: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class TrafficLightService {
  //private hubConnection!: signalR.HubConnection;
  private baseUrl = 'http://localhost:63795/TrafficSignal';
  constructor(private http: HttpClient) { }

  getSignalData(signalData: SignalData): Observable<any> {
    return this.http.post<SignalData>(this.baseUrl, signalData);
  }

//  public startConnection(): void {
//    console.log('startConnection of TrafficLightService');
//    this.hubConnection = new signalR.HubConnectionBuilder()
//      .withUrl("http://127.0.0.1:5000/trafficLightHub")
//      .configureLogging(signalR.LogLevel.Debug)
//      .build();

//    this.hubConnection
//      .start()
//      .then(() => console.log('Connection started'))
//      .catch(err => console.log('Error while starting connection: ' + err));
//  }

//  public addReceiveMessageListener(callback: (data: any) => void): void {

//    console.log('addReceiveMessageListener of TrafficLightService');
//    this.hubConnection.on('ReceiveMessage', data => {
//      console.log(data);
//      callback(data);
//    });
//  }
}
