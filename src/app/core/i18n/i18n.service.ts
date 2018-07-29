import { Injectable, Inject, Injector } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { en_US, cs_CZ, NzI18nService } from 'ng-zorro-antd';
import * as df_en from 'date-fns/locale/en';
import * as df_cs from 'date-fns/locale/cs';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, AlainI18NService } from '@delon/theme';

@Injectable()
export class I18NService implements AlainI18NService {
  private _default = 'en';
  private change$ = new BehaviorSubject<string>(null);

  private _langs = [
    { code: 'en', text: 'English' },
    { code: 'cs-CZ', text: 'Čeština' },
  ];

  constructor(
    settings: SettingsService,
    private nzI18nService: NzI18nService,
    private translate: TranslateService,
    private injector: Injector,
  ) {
    const defaultLan = settings.layout.lang || translate.getBrowserLang();
    console.log('LANGUAGE', defaultLan);
    const lans = this._langs.map(item => item.code);
    this._default = lans.includes(defaultLan) ? defaultLan : lans[0];
    translate.addLangs(lans);
    this.setZorro(this._default).setDateFns(this._default);
  }

  setZorro(lang: string): this {
    //this.nzI18nService.setLocale(lang === 'en' ? en_US : cs_CZ);
    this.nzI18nService.setLocale(en_US);
    return this;
  }

  setDateFns(lang: string): this {
    (window as any).__locale__ = lang === 'en' ? df_en : df_cs;
    return this;
  }

  get change(): Observable<string> {
    return this.change$.asObservable().pipe(filter(w => w != null));
  }

  use(lang: string): void {
    lang = lang || this.translate.getDefaultLang();
    if (this.currentLang === lang) return;
    this.setZorro(lang).setDateFns(lang);
    this.translate.use(lang).subscribe(() => this.change$.next(lang));
  }

  getLangs() {
    return this._langs;
  }

  fanyi(key: string) {
    return this.translate.instant(key);
  }

  get defaultLang() {
    return this._default;
  }

  get currentLang() {
    return (
      this.translate.currentLang ||
      this.translate.getDefaultLang() ||
      this._default
    );
  }
}
