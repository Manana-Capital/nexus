import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ConfigurationService } from "../configuration/configuration.service";

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public shares: SharesInfo;

  constructor(authService: AuthService, configuration: ConfigurationService) {
    authService.get(configuration.apiAddress + 'shares').subscribe(result => {
      this.shares = result as SharesInfo;
    }, error => console.error(error));
  }
}

interface SharesInfo {
  sharesCount: number;
  pricePerShareBtc: number;
  pricePerShareUsd: number;
  pricePerShareCzk: number;
}
