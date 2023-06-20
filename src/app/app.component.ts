import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../environments/environment";
import {Observable} from "rxjs";
import {Command} from "@angular/cli/models/command";
import {CommandService} from "./services/command.service";

export interface Result {
    result: string,

}

/**
 * This component is ment to just show the buttons and the sum. the simple methods below will all help to create a simple calculator
 * Reason i didn't use any extra components or fancy routings is simple. There is no need for nay of it.
 *
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    // Klein beetje uitleg over hoe en wat qua keuzes om een service met commands bij te houden en hier intern een som
    // De reden dat ik commands bijhoudt is om visueel soms anders uit ziet dan de daadwerkelijke berekeninmg
    // ^2 is bijvoorbeeld in mijn backend middels operator ** en dit staat niet zo mooi in tekst en kan verwarring opleveren
    // Door alle operators en getallen in een losse command structuur bij te houden is het gemakkelijk om de gehele som uit te werk
    // En hiermee kan ik gemakkelijk de commands omzetten naar een leesbare som!

    public sum: string = '';

    // This is a state that tracks wether we pressed the calculate button
    // This button will make it possible to do some nice things with the sum and showing the rest
    public calculated: boolean = false;

    //HIs
    public history: String [] = [];

    //Each component can require a different endpoint, so we make it a part of the component.
    // This way the base is set in stone and the rest can be less set in stone
    private endpoint: string = '/calculate'

    constructor(
        private http: HttpClient,
        private commandService: CommandService
    ) {
    }

    public add(char: string) {
        // clear first otherwise you rest your sum!
        this.clearResult();
        // add the characters to the string and show it
        this.commandService.add(char)
        this.sum = this.commandService.makeReadableSum();

    }

    public clear() {
        //we pushed the clear button and can now empty the string
        this.clearResult();
        this.commandService.clear();
    }

    public backspace() {
        this.commandService.undo();
        this.sum = this.commandService.makeReadableSum();
        this.clearResult();
    }

    public calculate() {

        this.postData({
            sum: this.commandService.makeReadableSum(),
            commands: this.commandService.commands
        }).subscribe(res => {

                // The is sign should only be set in the history
                this.commandService.add('=' + res.result)
                this.calculated = true;
                this.pushToHistory(res.result.toString());
            },
            err => {

            });
    }

    private clearResult() {
        // because i replace the sum with the result i need to clear it when we start a new sum
        if (this.calculated) {
            this.calculated = false
            this.commandService.clear()
            this.sum = this.commandService.makeReadableSum();
        }
    }

    private pushToHistory(calculatedResult: string) {
        // By tracking the history we have a nice user experience and we can see what sums we dit before
        this.history.push(this.commandService.makeReadableSum());
        this.sum = calculatedResult;
    }

    private postData(data: any): Observable<Result> {
        const url = environment.backendUrl + this.endpoint; // Replace with your API endpoint URL
        return this.http.post<Result>(url, data);
    }

}
