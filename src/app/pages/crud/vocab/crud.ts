import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'v-crud',
    imports: [TableModule, ButtonModule, InputTextModule, CommonModule, InputGroupAddonModule, InputGroup, FormsModule, TextareaModule, AutoCompleteModule],
    standalone: true,
    template: `
        <div class="p-3 bg-white mb-6">
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Char</p>
                <input pInputText type="text" placeholder="Default" />
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Meaning Primary</p>
                <input pInputText type="text" placeholder="Default" />
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
                <p class="font-semibold text-xl">Meaning Explanation</p>
                <textarea rows="5" cols="30" pTextarea></textarea>
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Hint Notes</p>
                <textarea rows="5" cols="30" pTextarea></textarea>
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Reading</p>
                <input pInputText type="text" placeholder="Default" />
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Reading Explanation</p>
                <textarea rows="5" cols="30" pTextarea></textarea>
            </div>
            <div class="my-3 flex flex-col">
                <p class="font-semibold text-xl">Found In Kanji List</p>
                <div class="mb-3 flex gap-x-3">
                    <p-autocomplete [(ngModel)]="kj" [suggestions]="listKanji" (completeMethod)="search($event)" />

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
                            <td>{{ kanji.meaning }}</td>
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
            <p-button label="Cancel" icon="pi pi-times" severity="secondary" class="mr-2" (onClick)="goBack()" />
        </div>
    `
})
export class VocabCrud {
    kj = '';
    listKanji = [];
    secondaryMeaning = [{ value: '', id: 0 }];
    kanji: { char: string; meaning: string; hiragana: string }[] = [
        // {
        //     char: '生',
        //     meaning: 'fresh',
        //     hiragana: 'なま'
        // }
    ];
    items: any[] = [];

    constructor(private router: Router) {}

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
    addMoreKanji() {
        this.kanji.push({
            char: '生',
            meaning: 'fresh',
            hiragana: 'なま'
        });
    }
    goBack() {
        this.router.navigate(['/pages/crud']);
    }
}
