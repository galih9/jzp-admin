import { IBaseResponse } from './general';

export interface IResponseKanjiList extends IBaseResponse {
    data: IKanji[];
}

export interface IResponseKanjiDetail extends IBaseResponse {
    data: IKanjiDetail | null;
}

export interface IKanji {
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
    visuallySimilarKanji: IKanji[];
    radicalsCombination: IRadical[];
    foundInVocab: IVocab[];
}

export interface IRadical {
    char: string;
    meaningPrimary: string;
}

export interface IRadicalDetail extends IRadical {
    meaningSecondary: string[];
    mnemonic: string;
    meaningHint: string;
    foundInKanji: IKanji[];
}

export interface IVocab {
    char: string;
    hiragana: string;
    meaningPrimary: string;
}

export interface ISentence {
    char: string;
    meaning: string;
}

export interface IVocabDetail extends IVocab {
    meaningSecondary: string[];
    explanation: string;
    explanationHint: string;
    reading: string;
    readingExplanation: string;
    readingExplanationHint: string;
    contextPattern: ISentence[];
    contextSentences: ISentence[];
    kanjiComposition: IKanji[];
}
