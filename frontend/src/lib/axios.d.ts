import 'axios';

declare module 'axios' {
  export interface InternalAxiosRequestConfig<T = any> {
    resourceName?: string;
  }
}
