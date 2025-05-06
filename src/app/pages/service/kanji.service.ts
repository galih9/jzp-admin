import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPayloadAddRadical, IResponseKanjiDetail, IResponseKanjiList } from '../types/kanji';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { HOST } from '../../../environments/url';
import { IBaseResponse } from '../types/general';

@Injectable()
export class KanjiService {
    constructor(private http: HttpClient) {}

    async getKanjiList(): Promise<IResponseKanjiList> {
        const url = `${environment.apiBaseUrl}${HOST.LESSON.KANJI.LIST}`;
        const result = await firstValueFrom(this.http.get<IResponseKanjiList | undefined>(url));
        return result ?? { success: 'false', message: 'something went wrong', data: [] };
    }
    async searchKanjiList(char?: string): Promise<IResponseKanjiList> {
        const url = `${environment.apiBaseUrl}${HOST.LESSON.KANJI.LIST}?char=` + char;
        const result = await firstValueFrom(this.http.get<IResponseKanjiList | undefined>(url));
        return result ?? { success: 'false', message: 'something went wrong', data: [] };
    }

    async getKanjiDetail(char: string): Promise<IResponseKanjiDetail> {
        const url = `${environment.apiBaseUrl}${HOST.LESSON.KANJI.DETAIL}?char=` + char;
        const result = await firstValueFrom(this.http.get<IResponseKanjiDetail | undefined>(url));
        return result ?? { success: 'false', message: 'something went wrong', data: null };
    }

    async getRadicalList(payload: { per_page: number; page: number }): Promise<IResponseKanjiList> {
        const url = `${environment.apiBaseUrl}${HOST.LESSON.RADICAL.LIST}`;
        // Ensure page number is positive
        const params = {
            per_page: payload.per_page,
            page: Math.max(1, payload.page)
        };
        
        const result = await firstValueFrom(
            this.http.get<IResponseKanjiList | undefined>(url, { params })
        );
        return result ?? { success: 'false', message: 'something went wrong', data: [] };
    }

    async getRadicalDetail(char: string): Promise<IResponseKanjiDetail> {
        const url = `${environment.apiBaseUrl}${HOST.LESSON.RADICAL.DETAIL}?char=` + char;
        const result = await firstValueFrom(this.http.get<IResponseKanjiDetail | undefined>(url));
        return result ?? { success: 'false', message: 'something went wrong', data: null };
    }
    async addRadical(payload: IPayloadAddRadical): Promise<IBaseResponse> {
        const url = `${environment.apiBaseUrl}${HOST.LESSON.RADICAL.ADD}`;
        const result = await firstValueFrom(
            this.http.post<IBaseResponse | undefined>(url, payload)
        );
        return result ?? { success: 'false', message: 'something went wrong', data: [] };
    }
}
