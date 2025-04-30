export interface IKanji {
    char: string;
    hiragana: string;
    meaningPrimary: string;
}

export interface IKanjiDetail extends IKanji {
    meaningSecondary: string[];
    mnemonic: string
    meaningHint: string;
    kunyomi: string;
    onyomi: string;
    readingMnemonic: string;
    readingHint: string;
    visuallySimilarKanji: IKanji[]
    radicalsCombination: IRadical[]
    foundInVocab: IVocab[]
}

export interface IRadical {
    char: string;
    meaningPrimary: string;
}

export interface IRadicalDetail extends IRadical {
    meaningSecondary: string[];
    mnemonic: string;
    meaningHint: string;
    foundInKanji: IKanji[]
}

export interface IVocab {
    char: string;
    hiragana: string;
    meaningPrimary: string;
}

export interface ISentence {
    char: string;
    meaning: string
}

export interface IVocabDetail extends IVocab {
    meaningSecondary: string[];
    explanation: string;
    explanationHint: string;
    reading: string;
    readingExplanation: string;
    readingExplanationHint: string;
    contextPattern: ISentence[]
    contextSentences: ISentence[]
    kanjiComposition: IKanji[]
}
