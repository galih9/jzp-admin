import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponseKanjiList } from '../types/kanji';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { HOST } from '../../../environments/url';

@Injectable()
export class RadicalService {
    constructor(private http: HttpClient) {}

    async getRadicalList(): Promise<IResponseKanjiList> {
        const url = `${environment.apiBaseUrl}${HOST.LESSON.RADICAL.LIST}`;
        const result = await firstValueFrom(this.http.get<IResponseKanjiList | undefined>(url));
        return result ?? { success: 'false', message: 'something went wrong', data: [] };
    }
}
