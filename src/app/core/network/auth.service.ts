import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { map } from 'rxjs/operators/map';

import { OidcSecurityService, OpenIDImplicitFlowConfiguration, AuthWellKnownEndpoints } from 'angular-auth-oidc-client';
import {environment} from '@env/environment';

export class NexusClient {
  sub: string;
  id: number;

  email: string;
  // tslint:disable-next-line:variable-name
  family_name: string;
  // tslint:disable-next-line:variable-name
  given_name: string;
  name: string;
  role: string[];
}

@Injectable()
export class AuthService implements OnDestroy {

  private _isAuthorizedSubscription: Subscription;
  private _isAuthorized: boolean;
  private _currentClientSubscription: Subscription;
  private _currentClient: NexusClient;

  public get isAuthorized(): boolean {
    return this._isAuthorized;
  }

  public get currentClient(): NexusClient {
    return this._currentClient;
  }

  constructor(public oidcSecurityService: OidcSecurityService,
              public http: HttpClient,
              @Inject('ORIGIN_URL') public originUrl: string
  ) {
  }

  public init() {
    const openIdImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
    openIdImplicitFlowConfiguration.stsServer = environment.BACKEND_URL;
    openIdImplicitFlowConfiguration.redirect_url = this.originUrl + '#/dashboard?';
    openIdImplicitFlowConfiguration.client_id = 'ng';
    openIdImplicitFlowConfiguration.response_type = 'id_token token';
    openIdImplicitFlowConfiguration.scope = 'openid profile nexus role';
    openIdImplicitFlowConfiguration.post_logout_redirect_uri = this.originUrl + '#/dashboard?';
    openIdImplicitFlowConfiguration.forbidden_route = '/403';
    openIdImplicitFlowConfiguration.unauthorized_route = '/401';
    openIdImplicitFlowConfiguration.auto_userinfo = true;
    openIdImplicitFlowConfiguration.log_console_warning_active = true;
    openIdImplicitFlowConfiguration.log_console_debug_active = false;
    openIdImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 60 * 60 * 4;
    // openIdImplicitFlowConfiguration.silent_redirect_url = this.originUrl + 'silent-renew.html';
    openIdImplicitFlowConfiguration.silent_renew = false;
    openIdImplicitFlowConfiguration.silent_renew_url = this.originUrl + 'silent-renew.html';
    openIdImplicitFlowConfiguration.silent_renew_offset_in_seconds = 30;
    openIdImplicitFlowConfiguration.storage = localStorage;

    const authWellKnownEndpoints = new AuthWellKnownEndpoints();
    authWellKnownEndpoints.issuer = environment.BACKEND_URL.replace(/\/\s*$/, '');
    authWellKnownEndpoints.jwks_uri = environment.BACKEND_URL + '.well-known/openid-configuration/jwks';
    authWellKnownEndpoints.authorization_endpoint = environment.BACKEND_URL + 'connect/authorize';
    authWellKnownEndpoints.token_endpoint = environment.BACKEND_URL + 'connect/token';
    authWellKnownEndpoints.userinfo_endpoint = environment.BACKEND_URL + 'connect/userinfo';
    authWellKnownEndpoints.end_session_endpoint = environment.BACKEND_URL + 'connect/endsession';
    authWellKnownEndpoints.check_session_iframe = environment.BACKEND_URL + 'connect/checksession';
    authWellKnownEndpoints.revocation_endpoint = environment.BACKEND_URL + 'connect/revocation';
    authWellKnownEndpoints.introspection_endpoint = environment.BACKEND_URL + 'connect/introspect';

    this.oidcSecurityService.setupModule(openIdImplicitFlowConfiguration, authWellKnownEndpoints);

    if (this.oidcSecurityService.moduleSetup) {
      this.doCallbackLogicIfRequired();
    } else {
      this.oidcSecurityService.onModuleSetup.subscribe(() => {
        this.doCallbackLogicIfRequired();
      });
    }

    this._isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
      (isAuthorized: boolean) => {
        this._isAuthorized = isAuthorized;
      });
    this._currentClientSubscription = this.userDataStream().subscribe(x => this._currentClient = x);
  }

  ngOnDestroy(): void {
    this._isAuthorizedSubscription.unsubscribe();
    this._currentClientSubscription.unsubscribe();
  }

  isAuthorizedStream(): Observable<boolean> {
    return this.oidcSecurityService.getIsAuthorized();
  }

  userDataStream(): Observable<NexusClient> {
    return this.oidcSecurityService
      .getUserData()
      .pipe(
        map(x => {
          if (!this._isAuthorized) {
            return null;
          }
          if (!x || !x.sub) {
            return x;
          }
          x.id = Number(x.sub);
          return x;
        })
      );
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  refreshSession() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  get(url: string): Observable<any> {
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }

  put(url: string, data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.put<any>(url, body, { headers: this.getHeaders() });
  }

  delete(url: string): Observable<any> {
    return this.http.delete<any>(url, { headers: this.getHeaders() });
  }

  post(url: string, data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post<any>(url, body, { headers: this.getHeaders() });
  }

  public getHeaders() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.appendAuthHeader(headers);
  }

  public appendAuthHeader(headers: HttpHeaders) {
    const token = this.oidcSecurityService.getToken();

    // console.log('TOKEN', token);
    if (token === '') {
      return headers;
    }

    const tokenValue = 'Bearer ' + token;
    return headers.set('Authorization', tokenValue);
  }

  private doCallbackLogicIfRequired() {
    const hash = this.getTokenHash();
    if (hash) {
      this.oidcSecurityService.authorizedImplicitFlowCallback(hash);
    }
  }

  private getTokenHash() {
    if (typeof location !== 'undefined' && window.location.hash) {
      const indexHash = window.location.hash.indexOf('id_token');
      return  indexHash > -1 && window.location.hash.substr(indexHash);
    }
  }
}
