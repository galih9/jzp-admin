import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IKanji } from "../types/kanji";

@Injectable()
export class KanjiService {
    constructor(private http: HttpClient) {}
    async getKanjiList(): Promise<IKanji[]> {
        return [
            {
                char: "川",
                hiragana: "かわ",
                meaningPrimary: "river",
            }
        ];
    }
}