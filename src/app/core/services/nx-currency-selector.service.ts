import { Injectable } from '@angular/core';
import {LocalStorage} from 'ngx-store';
import {PortfolioInfo} from '@core/backend/generated/defs/PortfolioInfo';
import {PortfolioFundInfo} from '@core/backend/generated/defs/PortfolioFundInfo';
import {PortfolioBalanceTick} from '@core/backend/generated/defs/PortfolioBalanceTick';

@Injectable()
export class NxCurrencySelectorService {

  @LocalStorage('selected_currency')
  private _selectedCurrency: 'USD' | 'CZK' | 'BTC' = 'USD';

  get selectedCurrency(): 'USD' | 'CZK' | 'BTC' {
    return this._selectedCurrency;
  }
  set selectedCurrency(val: 'USD' | 'CZK' | 'BTC') {
    this._selectedCurrency = val;
  }

  constructor() { }

  public getCurrencySign(): string {
    switch (this._selectedCurrency) {
      case 'CZK':
        return 'Kč';
      case 'BTC':
        return '₿';
      default:
        return '$';
    }
  }

  public getCurrencyShortName(): string {
    switch (this._selectedCurrency) {
      case 'CZK':
        return 'CZK';
      case 'BTC':
        return 'BTC';
      default:
        return 'USD';
    }
  }

  public getHighDecimalFormat(): string {
    switch (this._selectedCurrency) {
      case 'CZK':
        return '1.0-0';
      case 'BTC':
        return '1.0-2';
      default:
        return '1.0-0';
    }
  }

  public getDetailDecimalFormat(): string {
    switch (this._selectedCurrency) {
      case 'CZK':
        return '1.2-2';
      case 'BTC':
        return '1.4-6';
      default:
        return '1.2-2';
    }
  }

  public getTotalAssetsForPortfolio(info: PortfolioInfo): number {
    if (!info) {
      return 0;
    }
    switch (this._selectedCurrency) {
      case 'CZK':
        return info.totalAssetsCzk;
      case 'BTC':
        return info.totalAssetsBtc;
      default:
        return info.totalAssetsUsd;
    }
  }

  public getTotalProfitForPortfolio(info: PortfolioInfo): number {
    if (!info) {
      return 0;
    }
    switch (this._selectedCurrency) {
      case 'CZK':
        return info.totalProfitCzk;
      case 'BTC':
        return info.totalProfitBtc;
      default:
        return info.totalProfitUsd;
    }
  }

  public getTotalAssetsForPortfolioFund(info: PortfolioFundInfo): number {
    if (!info) {
      return 0;
    }
    switch (this._selectedCurrency) {
      case 'CZK':
        return info.assetsCzk;
      case 'BTC':
        return info.assetsBtc;
      default:
        return info.assetsUsd;
    }
  }

  public getTotalProfitForPortfolioFund(info: PortfolioFundInfo): number {
    if (!info) {
      return 0;
    }
    switch (this._selectedCurrency) {
      case 'CZK':
        return info.profitCzk;
      case 'BTC':
        return info.profitBtc;
      default:
        return info.profitUsd;
    }
  }

  getPortfolioTick(info: PortfolioBalanceTick) {
    if (!info) {
      return 0;
    }
    switch (this._selectedCurrency) {
      case 'CZK':
        return info.valueCzk;
      case 'BTC':
        return info.valueBtc;
      default:
        return info.valueUsd;
    }
  }
}
