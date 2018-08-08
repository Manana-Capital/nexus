import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import {AuthService} from '@core/net/auth.service';

/**
 * The default HTTP interceptor, see the registration details`app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  get msg(): NzMessageService {
    return this.injector.get(NzMessageService);
  }

  get auth(): AuthService {
    return this.injector.get(AuthService);
  }

  private goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private handleData(
    event: HttpResponse<any> | HttpErrorResponse,
  ): Observable<any> {
    this.injector.get(_HttpClient).end();
    switch (event.status) {
      case 200:
      case 201:
        // 业务层级错误处理，以下是假定restful有一套统一输出格式（指不管成功与否都有相应的数据格式）情况下进行处理
        // 例如响应内容：
        //  错误内容：{ status: 1, msg: '非法参数' }
        //  正确内容：{ status: 0, response: {  } }
        // 则以下代码片断可直接适用
        // if (event instanceof HttpResponse) {
        //     const body: any = event.body;
        //     if (body && body.status !== 0) {
        //         this.msg.error(body.msg);
        //         // 继续抛出错误中断后续所有 Pipe、subscribe 操作，因此：
        //         // this.http.get('/').subscribe() 并不会触发
        //         return throwError({});
        //     } else {
        //         // 重新修改 `body` 内容为 `response` 内容，对于绝大多数场景已经无须再关心业务状态码
        //         return of(new HttpResponse(Object.assign(event, { body: body.response })));
        //         // 或者依然保持完整的格式
        //         return of(event);
        //     }
        // }
        break;
      case 400:
      case 405:
      case 406:
        const response = this.handleBackendResponse(event);
        if(response)
          return response;
        this.msg.error('Bad input, please correct parameters and repeat');
        break;
      case 401:
        this.msg.error('Unauthorized, please login first');
        this.goTo(`/${event.status}`);
        break;
      case 403:
        this.msg.error('Forbidden, contact support');
        this.goTo(`/${event.status}`);
        break;
      case 404:
      case 500:
        this.goTo(`/${event.status}`);
        break;
      default:
        if (event instanceof HttpErrorResponse) {
          console.warn(
            'Unknown error, most of it is caused by the backend not supporting CORS or invalid configuration.',
            event,
          );
          this.msg.error('Server error, please try again');
        }
        break;
    }
    return of(event);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<
    | HttpSentEvent
    | HttpHeaderResponse
    | HttpProgressEvent
    | HttpResponse<any>
    | HttpUserEvent<any>
  > {

    let url = req.url;
    let isBackendCall = false;

    if (url.startsWith('https://') || url.startsWith('http://')) {
      url = req.url;
    } else if(url.startsWith('/api')) {
      let backendUrl = environment.BACKEND_URL.replace(/\/\s*$/, '');
      url = backendUrl + req.url;
      isBackendCall = true;
    } else {
      url = environment.SERVER_URL + req.url;
    }

    const headers = isBackendCall ? this.auth.appendAuthHeader(req.headers) : req.headers;
    const newReq = req.clone({
      url: url,
      headers: headers
    });

    //console.log('AUTH', this.auth, isBackendCall, headers);

    return next.handle(newReq).pipe(
      mergeMap((event: any) => {
        if (event instanceof HttpResponse && event.status === 200)
          return this.handleData(event);
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => this.handleData(err)),
    );
  }

  private handleBackendResponse(event: HttpResponse<any> | HttpErrorResponse) {
    if (event instanceof HttpErrorResponse) {
      if (event.error && event.error.errors) {
        this.msg.error(event.error.errors[0].message, { nzDuration: 1000 * 6, nzPauseOnHover: true });
        return throwError(event);
      } else {
        return null;
      }
    }

    if (event instanceof HttpResponse) {
         const body: any = event.body;
         if (body && body.status !== 0) {
           this.msg.error(this.extractBackendError(body.msg),  { nzDuration: 1000 * 6, nzPauseOnHover: true });
           return throwError({});
         } else {
             return null;
         }
     }
     return null;
  }

  private extractBackendError(msg) {
    return msg;
  }
}
