# 6장 : Axios 타입 분석
> 범위: p.297~p.322


### [get,post 메서드 제너릭]
axios.get 메서드에서 \<Post\> 제너릭이 어떻게 정의 되어 있는지 알아보자. 


> ✅ 타입 선언 파일 `node_modules\axios\index.d.ts` 
- export default axios로 ECMAScript 모듈시스템 사용
- 첫번째 매개변수 T -> Post
- 두번째 매개변수 R -> AxiosResponse\<T\> -> AxiosResponse\<Post\>  이 리턴값의 타입이됨.
- 세번째 매개변수 D -> any 이지만, 이게 정의되는 경우 config 변수의 타입이 AxiosRequestConfig\<D\> 된다.

  
``` typescript
export interface AxiosStatic extends AxiosInstance {
  create(config?: CreateAxiosDefaults): AxiosInstance;
  Cancel: CancelStatic;
  CancelToken: CancelTokenStatic;
  Axios: typeof Axios;
  AxiosError: typeof AxiosError;
  HttpStatusCode: typeof HttpStatusCode;
  readonly VERSION: string;
  isCancel: typeof isCancel;
  all: typeof all;
  spread: typeof spread;
  isAxiosError: typeof isAxiosError;
  toFormData: typeof toFormData;
  formToJSON: typeof formToJSON;
  getAdapter: typeof getAdapter;
  CanceledError: typeof CanceledError;
  AxiosHeaders: typeof AxiosHeaders;
}

declare const axios: AxiosStatic;

export default axios;

// AxiosInstance
export interface AxiosInstance extends Axios {
  <T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
  <T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;

  defaults: Omit<AxiosDefaults, 'headers'> & {
    headers: HeadersDefaults & {
      [key: string]: AxiosHeaderValue
    }
  };
}

// Axios
export class Axios {
  constructor(config?: AxiosRequestConfig);
  defaults: AxiosDefaults;
  interceptors: {
    request: AxiosInterceptorManager<InternalAxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };
  getUri(config?: AxiosRequestConfig): string;
  request<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
  get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;  // get 메서드 
  delete<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  head<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  options<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;

}

```

>  AxiosResponse 타입
- res.data 가 결국 Post 타입이 됨.

```typescript
export interface AxiosResponse<T = any, D = any> {
  data: T;
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: InternalAxiosRequestConfig<D>;
  request?: any;
}
```


> AxiosRequestConfig
- 3번째 매개변수가 정의 되면 config의 data 타입으로 정의됨.
- get 에서는 사용할 일이 없지만, post 의 경우 요청 본문의 data , 즉 request 의 data 타입이 되겠다.(위의 코드에서 다시 확인)
- D를 꼭 넣어줄 필요 없이, post 매서드의 data 매개변수로 추론이 됨.

```typescript
  export interface AxiosRequestConfig<D = any> {
    url?: string;
    method?: Method | string;
    baseURL?: string;
    transformRequest?: AxiosRequestTransformer | AxiosRequestTransformer[];
    transformResponse?: AxiosResponseTransformer | AxiosResponseTransformer[];
    headers?: (RawAxiosRequestHeaders & MethodsHeaders) | AxiosHeaders;
    params?: any;
    paramsSerializer?: ParamsSerializerOptions | CustomParamsSerializer;
    data?: D;  // 이부분
```


> error
- error 변수는 기본적으로 unknown이나, as로 강제 지정하거나 타입서술을 통해 타입지정을 권장한다.
- `axios.isAxiosError`은 타입 서술 지원함
- T는 res.data , D는 req.data 로 추정됨.
    
```typescript
export function isAxiosError<T = any, D = any>(payload: any): payload is AxiosError<T, D>;
export class AxiosError<T = unknown, D = any> extends Error {
  constructor(
      message?: string,
      code?: string,
      config?: InternalAxiosRequestConfig<D>,
      request?: any,
      response?: AxiosResponse<T, D>  // 여기 보면 그러함
  );

```

> AxiosStatic, AxiosInstance, Axio 타입을 서로 분리하고 상속을 통해 연결한 이유는?

axios 는 3가지 방식으로 사용된는것을 구분하기 위함.
- create()를 통한 instance 생성할때는  AxiosStatic
- instance 로 사용시 AxiosInstance
- 메서드 방식 Axio


### [6-1] Axios 직접 타이핑

- 코드에서 주석으로 설명


### [6-2] 다양한 모듈 형식으로 js 파일 생성하기
> 옵션 주석 처리하고 해보기

"esModuleInterop"은 TypeScript 컴파일러 옵션 중 하나입니다. 이 옵션을 사용하면 ES 모듈과 CommonJS 모듈 간의 상호 운용성(interoperability)을 향상시킬 수 있습니다.

기본적으로 TypeScript는 ES 모듈과 CommonJS 모듈을 다르게 처리합니다. ES 모듈은 "import" 문을 사용하고, CommonJS 모듈은 "require" 함수를 사용합니다. 때때로 프로젝트에서 ES 모듈과 CommonJS 모듈을 혼용하는 경우가 있습니다. 이런 경우 "esModuleInterop" 옵션을 사용하면 더 나은 상호 운용성을 제공합니다.

예를 들어, CommonJS 스타일의 모듈을 ES 모듈 형식으로 가져오고 싶은 경우, "esModuleInterop"을 true로 설정할 수 있습니다. 이렇게 하면 CommonJS 모듈을 가져올 때 자동으로 ES 모듈 형식으로 변환됩니다.
``` JSON
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```
"moduleResolution": TypeScript가 모듈을 해석하는 방법을 지정하는 옵션입니다.

이 옵션에는 두 가지 값이 있습니다: node와 classic입니다. node를 사용하면 Node.js의 모듈 해석 알고리즘이 사용되며, classic을 사용하면 TypeScript 이전 버전의 모듈 해석 알고리즘이 사용됩니다. 기본적으로는 node가 설정되어 있습니다. Node.js 환경에서 개발할 때는 주로 node를 사용하며, 이 옵션을 변경할 필요가 있는 경우는 드물지만 특정 프로젝트의 요구에 따라 변경할 수 있습니다.


### [6-3]axios 의 index.d.ts 파일을 어떻게 찾는지에 대한 설명
node_modules\axios\package.json

`npx tsc --traceReolution` 으로 실행해보면, 타입스크립트가 타입을 찾는 과정을 보여줌

아래는 쉘 출력값
``` BASH
PS C:\Users\kissy\Desktop\daily_coding\240307_ts_chapter3> npx tsc ./chapter6/index.ts --traceResolution
======== Resolving module 'axios' from 'C:/Users/kissy/Desktop/daily_coding/240307_ts_chapter3/chapter6/index.ts'. ========
Module resolution kind is not specified, using 'Node10'.
Loading module 'axios' from 'node_modules' folder, target file types: TypeScript, Declaration.
Searching all ancestor node_modules directories for preferred extensions: TypeScript, Declaration.
Directory 'C:/Users/kissy/Desktop/daily_coding/240307_ts_chapter3/chapter6/node_modules' does not exist, skipping all lookups in it.
Found 'package.json' at 'C:/Users/kissy/Desktop/daily_coding/240307_ts_chapter3/node_modules/axios/package.json'.
File 'C:/Users/kissy/Desktop/daily_coding/240307_ts_chapter3/node_modules/axios.ts' does not exist.
File 'C:/Users/kissy/Desktop/daily_coding/240307_ts_chapter3/node_modules/axios.tsx' does not exist.
File 'C:/Users/kissy/Desktop/daily_coding/240307_ts_chapter3/node_modules/axios.d.ts' does not exist.
'package.json' does not have a 'typesVersions' field.
'package.json' has 'typings' field './index.d.ts' that references 'C:/Users/kissy/Desktop/daily_coding/240307_ts_chapter3/node_modules/axios/index.d.ts'.
File 'C:/Users/kissy/Desktop/daily_coding/240307_ts_chapter3/node_modules/axios/index.d.ts' exists - use it as a name resolution result.

```



😂오늘의한줄평 저자는 역시 변태