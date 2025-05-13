import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { IKanji, IPatterns, ISentence, IVocabDetail } from '../../types/kanji';
import { KanjiService } from '../../service/kanji.service';
import { EditorModule } from 'primeng/editor';
import { Listbox } from 'primeng/listbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputGroupModule } from 'primeng/inputgroup';

@Component({
    selector: 'r-crud',
    imports: [
        TableModule,
        ButtonModule,
        InputTextModule,
        CommonModule,
        InputGroupAddonModule,
        FormsModule,
        TextareaModule,
        EditorModule,
        FormsModule,
        Listbox,
        ToastModule,
        InputGroupModule
    ],
    standalone: true,
    providers: [MessageService],
    template: `
        <div class="p-3 bg-white mb-6">
            <p-toast />
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Char</p>
                <input
                    pInputText
                    type="text"
                    placeholder="Default"
                    [(ngModel)]="currentData.char"
                />
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Meaning Primary</p>
                <input
                    pInputText
                    type="text"
                    placeholder="Default"
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
                <p class="font-semibold text-xl">Explanation Mnemonic</p>
                <p-editor
                    [(ngModel)]="currentData.meaning_mnemonic"
                    [style]="{ height: '100px' }"
                />
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Hint Explanation</p>
                <textarea
                    rows="5"
                    cols="30"
                    pTextarea
                    [(ngModel)]="currentData.meaning_hint"
                ></textarea>
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Reading Mnemonic</p>
                <p-editor
                    [(ngModel)]="currentData.reading_mnemonic"
                    [style]="{ height: '100px' }"
                />
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Hint Reading</p>
                <textarea
                    rows="5"
                    cols="30"
                    pTextarea
                    [(ngModel)]="currentData.reading_hint"
                ></textarea>
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Kanji Composition</p>
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
                                    icon="pi pi-trash"
                                    severity="danger"
                                    [rounded]="true"
                                    [outlined]="true"
                                    (onClick)="deleteKanji(kanji)"
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
            <div class="my-3 flex flex-row gap-x-4">
                <div class="w-1/2">
                    <p class="font-semibold text-xl">Context pattern examples</p>
                    <p-table [value]="patterns" dataKey="id" [expandedRowKeys]="expandedRows">
                        <!-- (onRowExpand)="onRowExpand($event)"
                        (onRowCollapse)="onRowCollapse($event)" -->
                        <ng-template #header>
                            <tr>
                                <th style="width: 5rem"></th>
                                <th pSortableColumn="name">Pattern</th>
                                <th pSortableColumn="name">Action</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-pattern let-expanded="expanded">
                            <tr>
                                <td>
                                    <p-button
                                        type="button"
                                        pRipple
                                        [pRowToggler]="pattern"
                                        [text]="true"
                                        [rounded]="true"
                                        [plain]="true"
                                        [icon]="
                                            expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'
                                        "
                                    />
                                </td>
                                <td>{{ pattern.hiragana }}</td>
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
                        <ng-template #emptymessage>
                            <tr>
                                <td colspan="6">No data</td>
                            </tr>
                        </ng-template>
                        <ng-template #expandedrow let-product>
                            <tr>
                                <td colspan="7">
                                    <div class="p-4">
                                        <h5>Examples for {{ product.hiragana }}</h5>
                                        <p-table [value]="product.examples" dataKey="id">
                                            <ng-template #header>
                                                <tr>
                                                    <th pSortableColumn="id">Hiragana</th>
                                                    <th pSortableColumn="id">Meaning</th>
                                                </tr>
                                            </ng-template>
                                            <ng-template #body let-order>
                                                <tr>
                                                    <td>{{ order.hiragana }}</td>
                                                    <td>{{ order.meaning }}</td>
                                                </tr>
                                            </ng-template>
                                            <ng-template #emptymessage>
                                                <tr>
                                                    <td colspan="6">
                                                        There are no examples for this product yet.
                                                    </td>
                                                </tr>
                                            </ng-template>
                                        </p-table>
                                    </div>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
                <div class="w-1/2 flex flex-col gap-y-3">
                    <p class="font-semibold text-xl">Form Pattern</p>
                    <p class="font-semibold text-base mb-0">Pattern</p>
                    <input pInputText type="text" placeholder="Default" />
                    <div class="ml-4 flex flex-col gap-y-3">
                        <div class="flex items-center">
                            <i class="pi pi-angle-right"></i>
                            <p class="font-semibold text-base mb-0">Example 1</p>
                        </div>
                        <p class="font-semibold text-sm mb-0">Hiragana</p>
                        <input pInputText type="text" placeholder="Default" />
                        <p class="font-semibold text-sm mb-0">Meaning</p>
                        <input pInputText type="text" placeholder="Default" />
                        <p-button
                            label="Add More Example"
                            icon="pi pi-plus"
                            severity="secondary"
                            class="mr-2"
                        />
                    </div>

                    <p-button
                        label="Add Pattern"
                        icon="pi pi-plus"
                        severity="secondary"
                        class="mr-2"
                    />
                </div>
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Context sentences examples</p>
                <p-table [value]="sentences" showGridlines [tableStyle]="{ 'min-width': '50rem' }">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Hiragana</th>
                            <th>Meaning</th>
                            <th>Action</th>
                        </tr>
                    </ng-template>

                    <ng-template pTemplate="body" let-kanji>
                        <tr>
                            <td>{{ kanji.hiragana }}</td>
                            <td>{{ kanji.meaning }}</td>
                            <td>
                                <p-button
                                    icon="pi pi-trash"
                                    severity="danger"
                                    [rounded]="true"
                                    [outlined]="true"
                                    (onClick)="deleteKanji(kanji)"
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
                <div class="ml-4 mt-4 flex flex-col gap-y-3">
                    <p class="font-semibold text-base mb-0">Form Examples</p>
                    <p class="font-semibold text-sm mb-0">Hiragana</p>
                    <input pInputText type="text" placeholder="Default" />
                    <p class="font-semibold text-sm mb-0">Meaning</p>
                    <input pInputText type="text" placeholder="Default" />
                    <p-button
                        label="Add Example"
                        icon="pi pi-plus"
                        severity="secondary"
                        class="mr-2"
                    />
                </div>
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
                    [label]="isEditMode ? 'Update' : 'Create'"
                    [icon]="isEditMode ? 'pi pi-pencil' : 'pi pi-plus'"
                    fluid
                    severity="primary"
                    class="w-full"
                    (onClick)="goAdd()"
                />
            </div>
        </div>
    `
})
export class VocabCrud implements OnInit {
    patterns: IPatterns[] = [];
    sentences: ISentence[] = [];

    expandedRows = {};
    currentData: IVocabDetail = {
        meaning_secondary: [],
        meaning_mnemonic: '',
        readings: [],
        meaning_hint: '',
        reading_mnemonic: '',
        reading_hint: '',
        kanji_composition: [],
        sentences: [],
        patterns: [],
        char: '',
        hiragana: '',
        meaning_primary: ''
    };

    localForm = {
        autoKanji: ''
    };
    secondaryMeaning = [{ value: '', id: 0 }];

    listKanji: IKanji[] = [];
    selectedKanji: IKanji | undefined;
    showOption: boolean = false;
    kanji: IKanji[] = [];

    items: any[] = [];
    isEditMode = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private kanjiService: KanjiService,
        private messageService: MessageService,
        private location: Location
    ) {}

    ngOnInit(): void {
        const char = this.route.snapshot.queryParamMap.get('char');
        if (char) {
            this.isEditMode = true;
            this.kanjiService.getVocabDetail(char).then((data) => {
                if (data.success) {
                    let resp = data.data!;
                    if (resp.meaning_secondary) {
                        this.secondaryMeaning = [];
                        for (let i = 0; i < resp.meaning_secondary.length; i++) {
                            const element = resp.meaning_secondary[i];
                            this.secondaryMeaning.push({ value: element, id: i });
                        }
                    }
                    if (resp.kanji_composition) {
                        this.kanji = [];
                        for (let i = 0; i < resp.kanji_composition.length; i++) {
                            const element = resp.kanji_composition[i];
                            this.kanji.push(element);
                        }
                    }
                    if (resp.patterns.length > 0) {
                        this.patterns = [];
                        for (let i = 0; i < resp.patterns.length; i++) {
                            const element = resp.patterns[i];
                            this.patterns.push(element);
                        }
                    }
                    if (resp.sentences.length > 0) {
                        this.sentences = [];
                        for (let i = 0; i < resp.sentences.length; i++) {
                            const element = resp.sentences[i];
                            this.sentences.push(element);
                        }
                    }
                    this.currentData = {
                        meaning_secondary: resp.meaning_secondary,
                        meaning_mnemonic: resp.meaning_mnemonic,
                        meaning_hint: resp.meaning_hint,
                        char: resp.char,
                        hiragana: '',
                        meaning_primary: resp.meaning_primary,
                        lesson_id: resp.lesson_id,
                        sentences: resp.sentences,
                        patterns: resp.patterns,
                        kanji_composition: [],
                        reading_hint: resp.reading_hint,
                        reading_mnemonic: resp.reading_mnemonic,
                        readings: resp.readings
                    };
                }
            });
        }
    }

    // secondary meanings
    removeItem(index: number) {
        this.secondaryMeaning = this.secondaryMeaning.filter((item) => item.id !== index);
    }
    addMore() {
        const lastItem = this.secondaryMeaning[this.secondaryMeaning.length - 1];
        const newId = lastItem ? lastItem.id + 1 : 0;
        this.secondaryMeaning.push({ value: '', id: newId });
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
    addMoreKanji() {
        if (this.selectedKanji != undefined) {
            this.kanji.push(this.selectedKanji);
            this.selectedKanji = undefined;
            this.listKanji = [];
            this.showOption = false;
        }
    }
    deleteKanji(item: IKanji) {
        this.kanji = this.kanji.filter((e) => e.lesson_id != item.lesson_id);
    }
    goBack() {
        this.location.back();
    }

    async goAdd() {}
}
