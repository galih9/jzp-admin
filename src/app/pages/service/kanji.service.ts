import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    IPayloadAddKanji,
    IPayloadAddRadical,
    IPayloadEditKanji,
    IReading,
    IResponseKanjiDetail,
    IResponseKanjiList,
    IResponseRadicalDetail,
    IResponseReading,
    IResponseVocabDetail
} from '../types/kanji';
import { HOST } from '../../../environments/url';
import { IBaseResponse, PaginationParams } from '../types/general';
import { BaseApiService } from './core/base-api.service';

@Injectable()
export class KanjiService extends BaseApiService {
    constructor(http: HttpClient) {
        super(http);
    }

    // Kanji methods
    async getKanjiList(): Promise<IResponseKanjiList> {
        return this.request<IResponseKanjiList>('get', HOST.LESSON.KANJI.LIST);
    }

    async searchKanjiList(char?: string): Promise<IResponseKanjiList> {
        return this.request<IResponseKanjiList>('get', HOST.LESSON.KANJI.LIST, { char });
    }

    async getKanjiDetail(char: string): Promise<IResponseKanjiDetail> {
        return this.request<IResponseKanjiDetail>('get', HOST.LESSON.KANJI.DETAIL, { char });
    }

    async getKanjiListPaginate(params: PaginationParams): Promise<IResponseKanjiList> {
        return this.request<IResponseKanjiList>('get', HOST.LESSON.KANJI.LIST, {
            ...params,
            page: Math.max(1, params.page),
            char: params.char ?? ''
        });
    }
    async addKanji(payload: IPayloadAddKanji): Promise<IBaseResponse> {
        return this.request<IBaseResponse>('post', HOST.LESSON.KANJI.ADD, null, payload);
    }
    async updateKanji(payload: IPayloadEditKanji): Promise<IBaseResponse> {
        return this.request<IBaseResponse>('post', HOST.LESSON.KANJI.EDIT, null, payload);
    }

    // Radical methods
    async searchRadical(char?: string): Promise<IResponseKanjiList> {
        return this.request<IResponseKanjiList>('get', HOST.LESSON.RADICAL.LIST, { char });
    }

    async getRadicalPaginated(params: PaginationParams): Promise<IResponseKanjiList> {
        return this.request<IResponseKanjiList>('get', HOST.LESSON.RADICAL.LIST, {
            ...params,
            page: Math.max(1, params.page),
            char: params.char ?? ''
        });
    }

    async getRadicalDetail(char: string): Promise<IResponseRadicalDetail> {
        return this.request<IResponseRadicalDetail>('get', HOST.LESSON.RADICAL.DETAIL, { char });
    }

    async addRadical(payload: IPayloadAddRadical): Promise<IBaseResponse> {
        return this.request<IBaseResponse>('post', HOST.LESSON.RADICAL.ADD, null, payload);
    }

    async editRadical(payload: IPayloadAddRadical): Promise<IBaseResponse> {
        return this.request<IBaseResponse>('put', HOST.LESSON.RADICAL.EDIT, null, payload);
    }

    async deleteRadical(lesson_id: string): Promise<IBaseResponse> {
        return this.request<IBaseResponse>('delete', HOST.LESSON.RADICAL.DELETE, { lesson_id });
    }

    // Vocab methods
    async getVocabList(): Promise<IResponseKanjiList> {
        return this.request<IResponseKanjiList>('get', HOST.LESSON.VOCAB.LIST);
    }
    async getVocabListPaginated(params: PaginationParams): Promise<IResponseKanjiList> {
        return this.request<IResponseKanjiList>('get', HOST.LESSON.VOCAB.LIST, {
            ...params,
            page: Math.max(1, params.page),
            char: params.char ?? ''
        });
    }
    async searchVocabList(char?: string): Promise<IResponseKanjiList> {
        return this.request<IResponseKanjiList>('get', HOST.LESSON.VOCAB.LIST, { char });
    }

    async deleteVocab(lesson_id: string): Promise<IBaseResponse> {
        return this.request<IBaseResponse>('delete', HOST.LESSON.VOCAB.DELETE, { lesson_id });
    }
    async getVocabDetail(char: string): Promise<IResponseVocabDetail> {
        return this.request<IResponseVocabDetail>('get', HOST.LESSON.VOCAB.DETAIL, { char });
    }

}
