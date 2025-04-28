import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface IKanji {
    id?: string;
    char?: string;
    hiragana?: string;
    meaning?: string;
    totalLearned?: number;
    totalReviewed?: number;
    rating?: number;
    status?: string;
}

@Injectable()
export class KanjiService {
    constructor(private http: HttpClient) {}
    async getKanjiList(): Promise<IKanji[]> {
        return [
            {
                id: '1',
                char: "川",
                hiragana: "かわ",
                meaning: "river",
                totalLearned: 121,
                totalReviewed: 653,
                rating: 4,
                status: "ACTIVE"
            },
            {
                id: '2',
                char: "山",
                hiragana: "やま",
                meaning: "mountain",
                status: "ARCHIVED"
            },
            {
                id: '3',
                char: "木",
                hiragana: "き",
                meaning: "tree",
                status: "ON TRASHCAN"
            },
            {
                id: '4',
                char: "日",
                hiragana: "ひ",
                meaning: "sun"
            },
            {
                id: '5',
                char: "月",
                hiragana: "つき",
                meaning: "moon"
            },
            {
                id: '6',
                char: "田",
                hiragana: "た",
                meaning: "rice field"
            },
            {
                id: '7',
                char: "花",
                hiragana: "はな",
                meaning: "flower"
            },
            {
                id: '8',
                char: "雨",
                hiragana: "あめ",
                meaning: "rain"
            },
            {
                id: '9',
                char: "石",
                hiragana: "いし",
                meaning: "stone"
            },
            {
                id: '10',
                char: "魚",
                hiragana: "さかな",
                meaning: "fish"
            }
        ];
    }
}