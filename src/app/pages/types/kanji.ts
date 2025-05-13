import { IBaseResponse } from './general';

export interface IResponseKanjiList extends IBaseResponse {
    data: IKanji[];
}

export interface IResponseKanjiDetail extends IBaseResponse {
    data: IKanjiDetail | null;
}

export interface IResponseRadicalDetail extends IBaseResponse {
    data: IRadicalDetail | null;
}

export interface IKanji {
    lesson_id?: string;
    char: string;
    hiragana: string;
    meaning_primary: string;
}

export interface IKanjiDetail extends IKanji {
    meaning_secondary: string[];
    meaning_mnemonic: string;
    meaning_hint: string;
    kunyomi: string[];
    onyomi: string[];
    reading_mnemonic: string;
    reading_hint: string;
    hiragana: string;
    kanji_similar: IKanji[];
    radical_combinations: IKanji[];
    found_in_vocab: IKanji[];
}


export interface IRadicalDetail extends IKanji {
    meaning_secondary: string[];
    meaning_mnemonic: string;
    meaning_hint: string;
    found_in_kanji: IKanji[];
}
export interface IRadical {
    char: string;
    meaningPrimary: string;
}

export interface IPayloadAddRadical {
    char: string;
    meaning: string;
    meaningMnemonic: string;
    meaningHint: string;
    foundInKanji: string[];
    lesson_id?: string;
}

export interface IVocab {
    char: string;
    hiragana: string;
    meaning_primary: string;
    lesson_id?: string;
}

export interface ISentence {
    hiragana: string;
    meaning: string;
}

export interface IPatterns {
    hiragana: string;
    examples: ISentence[];
}

export interface IVocabDetail extends IVocab {
    meaning_secondary: string[];
    meaning_mnemonic: string;
    readings: string[];
    meaning_hint: string;
    reading_mnemonic: string;
    reading_hint: string;
    kanji_composition: IKanji[];
    sentences: ISentence[];
    patterns: IPatterns[]
}
export interface IReading {
    lesson_id: string;
    type: string;
    hiragana: string;
}
export interface IReadingResponse {
    reading_id: string;
    lesson_id: string;
    hiragana: string;
    type: string;
}

export interface IResponseReading extends IBaseResponse {
    data: IReadingResponse[];
}
export interface IPayloadAddKanji {
    char: string;
    meaning: string;
    meaningSecondary: string[];
    primaryReading: string;
    meaningMnemonic: string;
    meaningHint: string;
    readingOnyomi: string[];
    readingKunyomi: string[];
    readingMnemonic: string;
    readingHint: string;
    foundInVocab: string[];
    visuallySimilarKanji: string[];
    radicalCombination: string[];
}

export interface IPayloadEditKanji extends IPayloadAddKanji {
    lesson_id: string;
}

// vocab

export interface IResponseVocabDetail extends IBaseResponse {
    data: IVocabDetail;
}