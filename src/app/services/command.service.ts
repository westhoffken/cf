import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CommandService {

    private _commands: String[] = []

    constructor() {
    }

    get commands(): String[] {
        return this._commands;
    }

    public makeReadableSum() {

        return this._commands.join("");

    }


    /**
     *
     * @param command
     */
    public add(command: string) {
        // we add all the commands (chars and such) to the command array so undo is nice and easy
        // and you get a lot of freedom making the sum

        // do not, i dont automatically add any * when it is left out, thats your own responsibility
        this._commands.push(command);

    }

    public clear() {
        this._commands = [];
    }


    public undo() {
        // pop the last array! and set the array back one item
        this._commands.pop()
    }


}
