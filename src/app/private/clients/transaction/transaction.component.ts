import { Component, OnInit } from '@angular/core';
import {TransferSharesDto} from '@core/backend/generated/defs/TransferSharesDto';
import {ClientsService} from '@core/backend/generated/controllers/Clients';
import {FundClient} from '@core/backend/generated/defs/FundClient';
import {FundsService} from '@core/backend/generated/controllers/Funds';
import {FundInfo} from '@core/backend/generated/defs/FundInfo';
import {AuthService} from '@core/network/auth.service';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';

export class TransactionState {
  step: 0 | 1 | 2 = 0;
  transactionType: string;
  transactionName: string;
}

@Component({
  selector: 'nx-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.less']
})
export class TransactionComponent implements OnInit {

  _state: TransactionState;
  _data: any = {
    targetFundId: 1,
    created: new Date().toISOString(),
    shares: 0,
    preview: true,
    amountBtc: 0,
    amountCzk: 0,
    amountUsd: 0
  };

  _clients: FundClient[];
  _funds: FundInfo[];

  _isProcessing = false;

  _action: ((param) => Observable<any>);

  constructor(
    private _clientsService: ClientsService,
    private _fundService: FundsService,
    private _auth: AuthService,
    private route: ActivatedRoute
  ) {
    this._state = new TransactionState();

    this._clientsService.clients().subscribe(x => this._clients = x.sort((xx, yy) => xx.fundClientId - yy.fundClientId));
    this._fundService.apiFundsGet().subscribe(x => this._funds = x);

    route.params.subscribe(x => {
      const type = x.type || 'deposit';
      this._state.transactionType = type;
      this._state.transactionName = this.capitalizeFirstLetter(type);

      switch (type) {
        case 'deposit':
          this._action = (param) => this._clientsService.apiClientsDepositsPost({deposit: param});
          break;
        case 'withdrawal':
          this._state.transactionName = 'Withdraw';
          this._action = (param) => this._clientsService.apiClientsWithdrawalsPost({withdrawal: param});
          break;
        case 'transfer':
          this._action = (param) => this._clientsService.transfer({transfer: param});
          break;
      }
    });
  }

  ngOnInit() {
    this._data.fromClientId = this._auth.currentClient.id;
    this._data.toClientId = this._auth.currentClient.id;
    this._data.clientId = this._auth.currentClient.id;
  }

  onStep1(data: TransferSharesDto) {
    this._isProcessing = true;
    data.preview = true;
    this._action(data)
      .subscribe(response => {

      this._data = response;

      this._isProcessing = false;
      this._state.step++;
    }, err => {
      this._isProcessing = false;
    });
  }

  onStep2() {
    this._isProcessing = true;
    this._data.preview = false;
    this._action(this._data)
      .subscribe(response => {

        this._data = response;

        this._isProcessing = false;
        this._state.step++;
      }, err => {
        this._isProcessing = false;
      });
  }

  onBack2() {
    this._state.step--;
  }

  onAgain3() {
    this._state.step = 0;
  }

  private capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
