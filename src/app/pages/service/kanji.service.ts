import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponseKanjiDetail, IResponseKanjiList } from '../types/kanji';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KanjiService {
    constructor(private http: HttpClient) {}

    async getKanjiList(): Promise<IResponseKanjiList> {
        const url = `${environment.apiBaseUrl}/lessons/kanji/list`;
        const result = await firstValueFrom(this.http.get<IResponseKanjiList | undefined>(url));
        return result ?? { success: 'false', message: 'something went wrong', data: [] };
    }


    async getKanjiDetail(char: string): Promise<IResponseKanjiDetail> {
        const url = `${environment.apiBaseUrl}/lessons/detail/kanji?char=`+char;
        const result = await firstValueFrom(this.http.get<IResponseKanjiDetail | undefined>(url));
        return result ?? { success: 'false', message: 'something went wrong', data: null };
    }
}
