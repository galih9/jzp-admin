import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { IKanji, IKanjiDetail, IRadical, IVocab } from '../../types/kanji';

@Component({
    selector: 'k-crud',
    imports: [TableModule, ButtonModule, InputTextModule, CommonModule, InputGroupAddonModule, InputGroup, FormsModule, TextareaModule, AutoCompleteModule],
    standalone: true,
    template: `
        <div class="p-6 bg-white mb-6">
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Char</p>
                <input pInputText type="text" placeholder="Default" [(ngModel)]="currentData.char" />
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Meaning Primary</p>
                <input pInputText type="text" placeholder="Default" [(ngModel)]="currentData.meaningPrimary" />
            </div>
            <div class="my-3">
                <p class="font-semibold text-xl">Meaning secondary</p>
                <div class="flex flex-col gap-y-3 mb-3">
                    <p-inputgroup *ngFor="let item of secondaryMeaning">
                        <input pInputText placeholder="Vote" [(ngModel)]="item.value" />
                        <p-inputgroup-addon *ngIf="item.id > 0">
                            <p-button icon="pi pi-times" (onClick)="removeItem(item.id)" />
                        </p-inputgroup-addon>
                    </p-inputgroup>
                </div>
                <p-button label="add more" severity="secondary" class="mr-2" (onClick)="addMore()" />
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Meaning Mnemonic</p>
                <textarea rows="5" cols="30" pTextarea [(ngModel)]="currentData.mnemonic"></textarea>
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Hint Notes</p>
                <textarea rows="5" cols="30" pTextarea [(ngModel)]="currentData.meaningHint"></textarea>
            </div>

            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Reading On'yomi</p>
                <input pInputText type="text" placeholder="Default" [(ngModel)]="currentData.onyomi" />
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Reading Kunyomi</p>
                <input pInputText type="text" placeholder="Default" [(ngModel)]="currentData.kunyomi" />
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Reading Mnemonic</p>
                <textarea rows="5" cols="30" pTextarea [(ngModel)]="currentData.readingMnemonic"></textarea>
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Reading Hint Notes</p>
                <textarea rows="5" cols="30" pTextarea [(ngModel)]="currentData.readingHint"></textarea>
            </div>

            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Radical Combination List</p>
                <div class="mb-3 flex gap-x-3">
                    <p-autocomplete [(ngModel)]="localForm.autoRadical" [suggestions]="listRadical" (completeMethod)="search($event)" />

                    <p-button label="Add" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="addMoreRadical()" />
                </div>
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
                            <td>{{ radical.meaningPrimary }}</td>
                            <td>
                                <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" pStyleClass=".boxmain" leaveActiveClass="hidden" leaveToClass="animate-slideup animate-duration-500 " />
                                <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" />
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
                    <p-autocomplete [(ngModel)]="localForm.autoKanji" [suggestions]="listKanji" (completeMethod)="search($event)" />

                    <p-button label="Add" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="addMoreKanji()" />
                </div>
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
                            <td>{{ kanji.meaningPrimary }}</td>
                            <td>{{ kanji.hiragana }}</td>
                            <td>
                                <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" pStyleClass=".boxmain" leaveActiveClass="hidden" leaveToClass="animate-slideup animate-duration-500 " />
                                <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" />
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
                    <p-autocomplete [(ngModel)]="localForm.autoVocab" [suggestions]="listVocab" (completeMethod)="search($event)" />

                    <p-button label="Add" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="addMoreVocab()" />
                </div>
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
                            <td>{{ vocab.meaningPrimary }}</td>
                            <td>{{ vocab.hiragana }}</td>
                            <td>
                                <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" pStyleClass=".boxmain" leaveActiveClass="hidden" leaveToClass="animate-slideup animate-duration-500 " />
                                <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" />
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
                <p-button label="Cancel" icon="pi pi-times" fluid severity="secondary" class="w-full" (onClick)="goBack()" />
                <p-button label="Add" icon="pi pi-plus" fluid severity="primary" class="w-full" (onClick)="goBack()" />
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

    listKanji = [];
    listRadical = [];
    listVocab = [];

    secondaryMeaning = [{ value: '', id: 0 }];
    kanji: IKanji[] = [];
    radical: IRadical[] = [];
    vocab: IVocab[] = [];
    items: any[] = [];

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.currentData = {
            char: '',
            meaningPrimary: '',
            meaningSecondary: [],
            mnemonic: '',
            meaningHint: '',
            onyomi: '',
            kunyomi: '',
            readingMnemonic: '',
            readingHint: '',
            hiragana: '',
            radicalsCombination: [],
            visuallySimilarKanji: [],
            foundInVocab: []
        };
    }

    search(event: AutoCompleteCompleteEvent) {
        this.items = [...Array(10).keys()].map((item) => event.query + '-' + item);
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
        this.radical.push({
            char: '大',
            meaningPrimary: 'big'
        });
    }
    addMoreVocab() {
        this.vocab.push({
            char: '力いっぱい',
            meaningPrimary: "With All One's Strength",
            hiragana: 'ちからいっぱい'
        });
    }
    addMoreKanji() {
        this.kanji.push({
            char: '生',
            meaningPrimary: 'fresh',
            hiragana: 'なま'
        });
    }
    goBack() {
        this.router.navigate(['/pages/kanji']);
    }
}
