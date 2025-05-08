import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BaseApiService {
    protected apiUrl = environment.apiBaseUrl;

    constructor(protected http: HttpClient) {}

    protected async request<T>(
        method: 'get' | 'post' | 'put' | 'delete',
        endpoint: string,
        params?: any,
        body?: any
    ): Promise<T> {
        const url = `${this.apiUrl}${endpoint}`;
        const options: any = {};
        
        if (params) {
            options.params = new HttpParams({ fromObject: params });
        }

        try {
            let request$;
            switch (method) {
                case 'get':
                    request$ = this.http.get<T>(url, { ...options });
                    break;
                case 'post':
                    request$ = this.http.post<T>(url, body ?? {}, { ...options });
                    break;
                case 'put':
                    request$ = this.http.put<T>(url, body ?? {}, { ...options });
                    break;
                case 'delete':
                    request$ = this.http.delete<T>(url, { ...options });
                    break;
                default:
                    throw new Error('Invalid HTTP method');
            }
            
            const result = await firstValueFrom(request$);
            return result as T;
        } catch (error) {
            console.error('API request failed:', error);
            return this.getErrorResponse() as T;
        }
    }

    protected getErrorResponse() {
        return { success: 'false', message: 'something went wrong', data: [] };
    }
}
