import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponseKanjiList } from '../types/kanji';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VocabService {
    constructor(private http: HttpClient) {}

    async getKanjiList(): Promise<IResponseKanjiList> {
        const url = `${environment.apiBaseUrl}/lessons/kanji/list`;
        const result = await firstValueFrom(this.http.get<IResponseKanjiList | undefined>(url));
        return result ?? { success: 'false', message: 'something went wrong', data: [] };
    }
}
