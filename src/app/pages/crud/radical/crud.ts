import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { IKanji, IPayloadAddRadical, IRadicalDetail } from '../../types/kanji';
import { KanjiService } from '../../service/kanji.service';
import { EditorModule } from 'primeng/editor';
import { Listbox } from 'primeng/listbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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
        ToastModule
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
                    [(ngModel)]="currentData.meaningPrimary"
                />
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Meaning Mnemonic</p>
                <p-editor [(ngModel)]="currentData.mnemonic" [style]="{ height: '100px' }" />
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Hint Notes</p>
                <textarea
                    rows="5"
                    cols="30"
                    pTextarea
                    [(ngModel)]="currentData.meaningHint"
                ></textarea>
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Found In Kanji List</p>
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
export class RadicalCrud implements OnInit {
    currentData: IRadicalDetail = {
        char: '',
        meaningPrimary: '',
        meaningSecondary: [],
        mnemonic: '',
        meaningHint: '',
        foundInKanji: []
    };
    localForm = {
        autoKanji: ''
    };

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
            this.kanjiService.getRadicalDetail(char).then((data) => {
                if (data.success) {
                    let resp = data.data!;
                    if (resp.found_in_kanji) {
                        this.kanji = [];
                        for (let i = 0; i < resp.found_in_kanji.length; i++) {
                            const element = resp.found_in_kanji[i];
                            this.kanji.push(element)
                        }
                    }
                    this.currentData = {
                        char: resp.char,
                        meaningPrimary: resp.meaning_primary,
                        meaningSecondary: resp.meaning_secondary,
                        mnemonic: resp.meaning_mnemonic,
                        meaningHint: resp.meaning_hint,
                        foundInKanji: [],
                        lesson_id: resp.lesson_id
                    };
                }
            });
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
    addMoreKanji() {
        if (this.selectedKanji != undefined) {
            this.kanji.push(this.selectedKanji);
            this.selectedKanji = undefined;
            this.listKanji = [];
            this.showOption = false;
        }
    }
    goBack() {
        this.location.back();
    }

    async goAdd() {
        let payload: IPayloadAddRadical = {
            char: this.currentData.char,
            meaning: this.currentData.meaningPrimary,
            meaningMnemonic: this.currentData.mnemonic,
            meaningHint: this.currentData.meaningHint,
            foundInKanji: this.kanji.map((item) => item.lesson_id ?? '')
        };
        if (this.isEditMode) {
            let resp = await this.kanjiService.editRadical({
                ...payload,
                lesson_id: this.currentData.lesson_id
            });
            if (resp.success) {
                this.router.navigate(['/pages/radical'], {
                    state: {
                        message: resp.message
                    }
                });
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: resp.message,
                    life: 3000
                });
            }
        } else {
            let resp = await this.kanjiService.addRadical(payload);
            if (resp.success) {
                this.router.navigate(['/pages/radical'], {
                    state: {
                        message: resp.message
                    }
                });
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: resp.message,
                    life: 3000
                });
            }
        }
    }
}
