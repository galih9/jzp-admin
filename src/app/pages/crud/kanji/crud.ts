import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { IKanji, IKanjiDetail, IPayloadAddKanji, IRadical, IVocab } from '../../types/kanji';
import { KanjiService } from '../../service/kanji.service';
import { EditorModule } from 'primeng/editor';
import { ListboxModule } from 'primeng/listbox';
import { SelectModule } from 'primeng/select';
import { RadioButton } from 'primeng/radiobutton';

@Component({
    selector: 'k-crud',
    imports: [
        TableModule,
        ButtonModule,
        InputTextModule,
        CommonModule,
        InputGroupAddonModule,
        InputGroup,
        FormsModule,
        TextareaModule,
        AutoCompleteModule,
        EditorModule,
        ListboxModule,
        SelectModule,
        RadioButton
    ],
    standalone: true,
    template: `
        <div class="p-6 bg-white mb-6">
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Char</p>
                <input
                    pInputText
                    type="text"
                    placeholder="Character"
                    [(ngModel)]="currentData.char"
                />
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Meaning Primary</p>
                <input
                    pInputText
                    type="text"
                    placeholder="Meaning Primary"
                    [(ngModel)]="currentData.meaning_primary"
                />
            </div>
            <div class="my-3">
                <p class="font-semibold text-xl">Meaning secondary</p>
                <div class="flex flex-col gap-y-3 mb-3">
                    <p-inputgroup *ngFor="let item of secondaryMeaning">
                        <input
                            pInputText
                            placeholder="Meaning Alternative"
                            [(ngModel)]="item.value"
                        />
                        <p-inputgroup-addon *ngIf="item.id > 0">
                            <p-button icon="pi pi-times" (onClick)="removeItem(item.id)" />
                        </p-inputgroup-addon>
                    </p-inputgroup>
                </div>
                <p-button
                    label="add more"
                    severity="secondary"
                    class="mr-2"
                    (onClick)="addMore()"
                />
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Meaning Mnemonic</p>
                <p-editor
                    [(ngModel)]="currentData.meaning_mnemonic"
                    [style]="{ height: '100px' }"
                />
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Hint Notes</p>
                <textarea
                    rows="5"
                    cols="30"
                    pTextarea
                    [(ngModel)]="currentData.meaning_hint"
                ></textarea>
            </div>

            <div class="my-3">
                <p class="font-semibold text-xl">Reading On'yomi</p>
                <div class="flex flex-col gap-y-3 mb-3">
                    <p-inputgroup *ngFor="let item of onyomiReading">
                        <input pInputText placeholder="Onyomi" [(ngModel)]="item.value" />
                        <p-inputgroup-addon>
                            <p-button icon="pi pi-times" (onClick)="removeOnyomi(item.id)" />
                        </p-inputgroup-addon>
                    </p-inputgroup>
                </div>
                <div class="flex flex-col gap-y-3 mb-3">
                    <input pInputText placeholder="Onyomi" [(ngModel)]="readingInputOnyomi" />
                </div>
                <p-button
                    label="add more"
                    severity="secondary"
                    class="mr-2"
                    (onClick)="addMoreOnyomi()"
                />
            </div>
            <div class="my-3">
                <p class="font-semibold text-xl">Reading Kunyomi</p>
                <div class="flex flex-col gap-y-3 mb-3">
                    <p-inputgroup *ngFor="let item of kunyomiReading">
                        <input pInputText placeholder="Kunyomi" [(ngModel)]="item.value" />
                        <p-inputgroup-addon>
                            <p-button icon="pi pi-times" (onClick)="removeKunyomi(item.id)" />
                        </p-inputgroup-addon>
                    </p-inputgroup>
                </div>
                <div class="flex flex-col gap-y-3 mb-3">
                    <input pInputText placeholder="Onyomi" [(ngModel)]="readingInputKunyomi" />
                </div>
                <p-button
                    label="add more"
                    severity="secondary"
                    class="mr-2"
                    (onClick)="addMoreKunyomi()"
                />
            </div>

            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Pick Primary Reading</p>
                <div class="flex flex-row">
                    <div class="flex flex-col gap-4 w-full">
                        <p>Onyomi</p>
                        <div *ngFor="let item of onyomiReading" class="field-checkbox">
                            <p-radiobutton
                                [inputId]="item.id.toString()"
                                name="category"
                                [value]="item.value"
                                [(ngModel)]="selectedPrimaryReading"
                            />
                            <label [for]="item.id" class="ml-2">{{ item.value }}</label>
                        </div>
                    </div>
                    <div class="flex flex-col gap-4 w-full">
                        <p>Kunyomi</p>
                        <div *ngFor="let item of kunyomiReading" class="field-checkbox">
                            <p-radiobutton
                                [inputId]="item.id.toString()"
                                name="category"
                                [value]="item.value"
                                [(ngModel)]="selectedPrimaryReading"
                            />
                            <label [for]="item.id" class="ml-2">{{ item.value }}</label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Reading Mnemonic</p>
                <p-editor
                    [(ngModel)]="currentData.reading_mnemonic"
                    [style]="{ height: '100px' }"
                />
                <!-- <textarea rows="5" cols="30" pTextarea [(ngModel)]="currentData.reading_mnemonic"></textarea> -->
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Reading Hint Notes</p>
                <textarea
                    rows="5"
                    cols="30"
                    pTextarea
                    [(ngModel)]="currentData.reading_hint"
                ></textarea>
            </div>

            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Radical Combination List</p>

                <div class="mb-3 flex gap-x-3">
                    <input
                        pInputText
                        type="text"
                        placeholder="Default"
                        [(ngModel)]="localForm.autoRadical"
                    />
                    <p-button
                        label="Search"
                        icon="pi pi-search"
                        severity="secondary"
                        class="mr-2"
                        (onClick)="findRadical()"
                    />
                    <p-button
                        label="Add"
                        icon="pi pi-plus"
                        severity="secondary"
                        class="mr-2"
                        (onClick)="addMoreRadical()"
                    />
                </div>
                <p-listbox
                    *ngIf="showOptionRadical"
                    [options]="listRadical"
                    [(ngModel)]="selectedRadical"
                    optionLabel="name"
                    class="w-full md:w-56 mb-3"
                >
                    <ng-template #item let-listRadical>
                        <div class="flex items-center gap-2">
                            <div>{{ listRadical.char }}</div>
                        </div>
                    </ng-template>
                </p-listbox>
                <p-table [value]="radical" showGridlines [tableStyle]="{ 'min-width': '50rem' }">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Char</th>
                            <th>Meaning</th>
                            <th>Action</th>
                        </tr>
                    </ng-template>

                    <ng-template pTemplate="body" let-radical>
                        <tr>
                            <td>{{ radical.char }}</td>
                            <td>{{ radical.meaning_primary }}</td>
                            <td>
                                <p-button
                                    icon="pi pi-pencil"
                                    class="mr-2"
                                    [rounded]="true"
                                    [outlined]="true"
                                    pStyleClass=".boxmain"
                                    leaveActiveClass="hidden"
                                    leaveToClass="animate-slideup animate-duration-500 "
                                />
                                <p-button
                                    icon="pi pi-trash"
                                    severity="danger"
                                    [rounded]="true"
                                    [outlined]="true"
                                />
                            </td>
                        </tr>
                    </ng-template>

                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="4">No Data</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Visually Simillar Kanji List</p>
                <div class="mb-3 flex gap-x-3">
                    <input
                        pInputText
                        type="text"
                        placeholder="Default"
                        [(ngModel)]="localForm.autoKanji"
                    />
                    <p-button
                        label="Search"
                        icon="pi pi-search"
                        severity="secondary"
                        class="mr-2"
                        (onClick)="findKanji()"
                    />
                    <p-button
                        label="Add"
                        icon="pi pi-plus"
                        severity="secondary"
                        class="mr-2"
                        (onClick)="addMoreKanji()"
                    />
                </div>
                <p-listbox
                    *ngIf="showOption"
                    [options]="listKanji"
                    [(ngModel)]="selectedKanji"
                    optionLabel="name"
                    class="w-full md:w-56 mb-3"
                >
                    <ng-template #item let-listKanji>
                        <div class="flex items-center gap-2">
                            <div>{{ listKanji.char }}</div>
                        </div>
                    </ng-template>
                </p-listbox>
                <p-table [value]="kanji" showGridlines [tableStyle]="{ 'min-width': '50rem' }">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Char</th>
                            <th>Meaning</th>
                            <th>Hiragana</th>
                            <th>Action</th>
                        </tr>
                    </ng-template>

                    <ng-template pTemplate="body" let-kanji>
                        <tr>
                            <td>{{ kanji.char }}</td>
                            <td>{{ kanji.meaning_primary }}</td>
                            <td>{{ kanji.hiragana }}</td>
                            <td>
                                <p-button
                                    icon="pi pi-pencil"
                                    class="mr-2"
                                    [rounded]="true"
                                    [outlined]="true"
                                    pStyleClass=".boxmain"
                                    leaveActiveClass="hidden"
                                    leaveToClass="animate-slideup animate-duration-500 "
                                />
                                <p-button
                                    icon="pi pi-trash"
                                    severity="danger"
                                    [rounded]="true"
                                    [outlined]="true"
                                />
                            </td>
                        </tr>
                    </ng-template>

                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="4">No Data</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Found In Vocab List</p>
                <div class="mb-3 flex gap-x-3">
                    <input
                        pInputText
                        type="text"
                        placeholder="Default"
                        [(ngModel)]="localForm.autoVocab"
                    />
                    <p-button
                        label="Search"
                        icon="pi pi-search"
                        severity="secondary"
                        class="mr-2"
                        (onClick)="findVocab()"
                    />
                    <p-button
                        label="Add"
                        icon="pi pi-plus"
                        severity="secondary"
                        class="mr-2"
                        (onClick)="addMoreVocab()"
                    />
                </div>
                <p-listbox
                    *ngIf="showOptionVocab"
                    [options]="listVocab"
                    [(ngModel)]="selectedVocab"
                    optionLabel="name"
                    class="w-full md:w-56 mb-3"
                >
                    <ng-template #item let-listVocab>
                        <div class="flex items-center gap-2">
                            <div>{{ listVocab.char }}</div>
                        </div>
                    </ng-template>
                </p-listbox>
                <p-table [value]="vocab" showGridlines [tableStyle]="{ 'min-width': '50rem' }">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Char</th>
                            <th>Meaning</th>
                            <th>Hiragana</th>
                            <th>Action</th>
                        </tr>
                    </ng-template>

                    <ng-template pTemplate="body" let-vocab>
                        <tr>
                            <td>{{ vocab.char }}</td>
                            <td>{{ vocab.meaning_primary }}</td>
                            <td>{{ vocab.hiragana }}</td>
                            <td>
                                <p-button
                                    icon="pi pi-pencil"
                                    class="mr-2"
                                    [rounded]="true"
                                    [outlined]="true"
                                    pStyleClass=".boxmain"
                                    leaveActiveClass="hidden"
                                    leaveToClass="animate-slideup animate-duration-500 "
                                />
                                <p-button
                                    icon="pi pi-trash"
                                    severity="danger"
                                    [rounded]="true"
                                    [outlined]="true"
                                />
                            </td>
                        </tr>
                    </ng-template>

                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="4">No Data</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
            <div class="flex gap-x-3">
                <p-button
                    label="Cancel"
                    icon="pi pi-times"
                    fluid
                    severity="secondary"
                    class="w-full"
                    (onClick)="goBack()"
                />
                <p-button
                    label="Add"
                    icon="pi pi-plus"
                    fluid
                    severity="primary"
                    class="w-full"
                    (onClick)="goAdd()"
                />
            </div>
        </div>
    `
})
export class KanjiCrud implements OnInit {
    currentData!: IKanjiDetail;
    localForm = {
        autoRadical: '',
        autoKanji: '',
        autoVocab: ''
    };

    groupedReading: { label: string; items: { label: string; value: string }[] }[] = [];
    selectedPrimaryReading = '';

    readingInputKunyomi = '';
    readingInputOnyomi = '';

    listKanji: IKanji[] = [];
    selectedKanji: IKanji | undefined;
    showOption: boolean = false;
    kanji: IKanji[] = [];

    listRadical: IKanji[] = [];
    selectedRadical: IKanji | undefined;
    showOptionRadical: boolean = false;
    radicals: IKanji[] = [];

    listVocab: IKanji[] = [];
    selectedVocab: IKanji | undefined;
    showOptionVocab: boolean = false;
    vocabs: IKanji[] = [];

    secondaryMeaning = [{ value: '', id: 0 }];
    onyomiReading: { value: string; id: number }[] = [];
    kunyomiReading: { value: string; id: number }[] = [];
    radical: IKanji[] = [];
    vocab: IKanji[] = [];
    items: any[] = [];
    isEditMode = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private kanjiService: KanjiService
    ) {}

    ngOnInit(): void {
        this.currentData = {
            char: '',
            meaning_primary: '',
            meaning_secondary: [],
            meaning_mnemonic: '',
            meaning_hint: '',
            onyomi: [],
            kunyomi: [],
            reading_mnemonic: '',
            reading_hint: '',
            hiragana: '',
            radical_combinations: [],
            kanji_similar: [],
            found_in_vocab: []
        };
        const char = this.route.snapshot.queryParamMap.get('char');
        if (char) {
            this.kanjiService.getKanjiDetail(char).then((data) => {
                if (data.success) {
                    let resp = data.data!;
                    if (resp.meaning_secondary) {
                        this.secondaryMeaning = [];
                        for (let i = 0; i < resp.meaning_secondary.length; i++) {
                            const element = resp.meaning_secondary[i];
                            this.secondaryMeaning.push({ value: element, id: i });
                        }
                    }
                    this.groupedReading = [];
                    if (resp.onyomi) {
                        this.onyomiReading = [];
                        let item: {
                            label: string;
                            value: string;
                        }[] = [];
                        for (let i = 0; i < resp.onyomi.length; i++) {
                            const element = resp.onyomi[i];
                            this.onyomiReading.push({ value: element, id: i });
                            item.push({ value: element, label: element });
                        }
                        this.groupedReading.push({ label: 'Onyomi', items: item });
                    }
                    if (resp.kunyomi) {
                        this.kunyomiReading = [];
                        let item: {
                            label: string;
                            value: string;
                        }[] = [];
                        for (let i = 0; i < resp.kunyomi.length; i++) {
                            const element = resp.kunyomi[i];
                            this.kunyomiReading.push({ value: element, id: i });
                            item.push({ value: element, label: element });
                        }
                        this.groupedReading.push({ label: 'Kunyomi', items: item });
                    }
                    if (resp.radical_combinations) {
                        this.radical = [];
                        for (let i = 0; i < resp.radical_combinations.length; i++) {
                            const element = resp.radical_combinations[i];
                            this.radical.push(element);
                        }
                    }
                    if (resp.found_in_vocab) {
                        this.vocab = [];
                        for (let i = 0; i < resp.found_in_vocab.length; i++) {
                            const element = resp.found_in_vocab[i];
                            this.vocab.push(element);
                        }
                    }
                    if (resp.kanji_similar) {
                        this.kanji = [];
                        for (let i = 0; i < resp.kanji_similar.length; i++) {
                            const element = resp.kanji_similar[i];
                            this.kanji.push(element);
                        }
                    }
                    this.currentData = {
                        char: resp.char,
                        meaning_primary: resp.meaning_primary,
                        meaning_secondary: resp.meaning_secondary,
                        meaning_mnemonic: resp.meaning_mnemonic,
                        meaning_hint: resp.meaning_hint,
                        onyomi: resp.onyomi,
                        kunyomi: resp.kunyomi,
                        reading_mnemonic: resp.reading_mnemonic,
                        reading_hint: resp.reading_hint,
                        hiragana: resp.hiragana,
                        radical_combinations: [],
                        found_in_vocab: [],
                        kanji_similar: []
                    };
                }
            });
        }
    }

    async findRadical() {
        this.showOptionRadical = !this.showOptionRadical;
        let resp = await this.kanjiService.searchRadical(
            this.localForm.autoRadical == '' ? '' : this.localForm.autoRadical
        );
        if (resp.success && Array.isArray(resp.data)) {
            this.listRadical = resp.data.map((item) => ({
                char: item.char,
                meaning_primary: item.meaning_primary,
                hiragana: item.hiragana,
                lesson_id: item.lesson_id
            }));
        } else {
            this.listRadical = [];
        }
    }

    async findKanji() {
        this.showOption = !this.showOption;
        let resp = await this.kanjiService.searchKanjiList(
            this.localForm.autoKanji == '' ? '' : this.localForm.autoKanji
        );
        if (resp.success && Array.isArray(resp.data)) {
            this.listKanji = resp.data.map((item) => ({
                char: item.char,
                meaning_primary: item.meaning_primary,
                hiragana: item.hiragana,
                lesson_id: item.lesson_id
            }));
        } else {
            this.listKanji = [];
        }
    }

    async findVocab() {
        this.showOptionVocab = !this.showOptionVocab;
        let resp = await this.kanjiService.searchVocabList(
            this.localForm.autoVocab == '' ? '' : this.localForm.autoVocab
        );
        if (resp.success && Array.isArray(resp.data)) {
            this.listVocab = resp.data.map((item) => ({
                char: item.char,
                meaning_primary: item.meaning_primary,
                hiragana: item.hiragana,
                lesson_id: item.lesson_id
            }));
        } else {
            this.listVocab = [];
        }
    }

    addMoreOnyomi() {
        let id = this.onyomiReading.length;
        this.onyomiReading.push({
            value: this.readingInputOnyomi,
            id: id
        });
        this.readingInputOnyomi = '';
    }
    addMoreKunyomi() {
        let id = this.kunyomiReading.length;
        this.kunyomiReading.push({
            value: this.readingInputKunyomi,
            id: id
        });
        this.readingInputKunyomi = '';
    }
    removeOnyomi(index: number) {
        this.onyomiReading = this.onyomiReading.filter((item) => item.id !== index);
    }
    removeKunyomi(index: number) {
        this.kunyomiReading = this.kunyomiReading.filter((item) => item.id !== index);
    }
    removeItem(index: number) {
        this.secondaryMeaning = this.secondaryMeaning.filter((item) => item.id !== index);
    }
    addMore() {
        const lastItem = this.secondaryMeaning[this.secondaryMeaning.length - 1];
        const newId = lastItem ? lastItem.id + 1 : 0;
        this.secondaryMeaning.push({ value: '', id: newId });
    }
    addMoreRadical() {
        if (this.selectedRadical != undefined) {
            this.radical.push(this.selectedRadical);
            this.selectedRadical = undefined;
            this.listRadical = [];
            this.showOptionRadical = false;
        }
    }
    addMoreVocab() {
        if (this.selectedVocab != undefined) {
            this.vocab.push(this.selectedVocab);
            this.selectedVocab = undefined;
            this.listVocab = [];
            this.showOptionVocab = false;
        }
    }
    addMoreKanji() {
        if (this.selectedKanji != undefined) {
            this.kanji.push(this.selectedKanji);
            this.selectedKanji = undefined;
            this.listKanji = [];
            this.showOption = false;
        }
    }
    goBack() {
        this.router.navigate(['/pages/kanji']);
    }
    async goAdd() {
        // secondary meaning
        let sm: string[] = [];
        if (this.secondaryMeaning.length > 0) {
            for (let i = 0; i < this.secondaryMeaning.length; i++) {
                const element = this.secondaryMeaning[i];
                sm.push(element.value);
            }
        }
        let o: string[] = [];
        if (this.onyomiReading.length > 0) {
            for (let i = 0; i < this.onyomiReading.length; i++) {
                const element = this.onyomiReading[i];
                o.push(element.value);
            }
        }
        let k: string[] = [];
        if (this.kunyomiReading.length > 0) {
            for (let i = 0; i < this.kunyomiReading.length; i++) {
                const element = this.kunyomiReading[i];
                k.push(element.value);
            }
        }
        let fik: string[] = [];
        if (this.vocab.length > 0) {
            for (let i = 0; i < this.vocab.length; i++) {
                const element = this.vocab[i];
                if (element.lesson_id) {
                    fik.push(element.lesson_id);
                }
            }
        }
        let sk: string[] = [];
        if (this.kanji.length > 0) {
            for (let i = 0; i < this.kanji.length; i++) {
                const element = this.kanji[i];
                if (element.lesson_id) {
                    sk.push(element.lesson_id);
                }
            }
        }
        let rc: string[] = [];
        if (this.radical.length > 0) {
            for (let i = 0; i < this.radical.length; i++) {
                const element = this.radical[i];
                if (element.lesson_id) {
                    rc.push(element.lesson_id);
                }
            }
        }
        let payload: IPayloadAddKanji = {
            char: this.currentData.char,
            meaning: this.currentData.meaning_primary,
            meaningSecondary: sm,
            primaryReading: this.selectedPrimaryReading,
            meaningMnemonic: this.currentData.meaning_mnemonic,
            meaningHint: this.currentData.meaning_hint,
            readingOnyomi: o,
            readingKunyomi: k,
            readingMnemonic: this.currentData.reading_mnemonic,
            readingHint: this.currentData.reading_hint,
            foundInVocab: fik,
            visuallySimilarKanji: sk,
            radicalCombination: rc
        };
        console.log(payload);
        let resp = await this.kanjiService.addKanji(payload);
        if (resp.success) {
            this.router.navigate(['/pages/kanji'], {
                state: {
                    message: resp.message
                }
            });
        } else {
            console.log(resp);
        }
    }
}
