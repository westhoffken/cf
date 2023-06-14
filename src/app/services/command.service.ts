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

    public makeReadableSum(humandReadable: boolean = true) {
        // Ik maak hier een readable string van zodat (zoals je kan zien) bepaalde wiskundige zaken kan omzetten naar
        // iets wat mooi leest
        // return readble string;
        let sum = this._commands.join("");

        if (humandReadable) {
            return sum.replace('**2', '&#178;');
        }
        return sum;
    }


    /**
     *
     * @param command
     */
    public add(command: string) {
        // Step 1: if it is a simple number we just add it to the command
        // Step 2: for basic operators we add that as a command as well
        // Step 3: more complex calculations with parenthesis we make it a more complex command

        // TODO: make one regex and push the matches
        // what we wish to do is check if there is a bad string in the previous command

        if (this.checkForUnclosedCommands(command)) {
            // don't add any new numbers to the array, but add it to the previous item
            this.addNumberToPrevious(command);
            return;
        }

        this.addNumber(command);

    }

    public clear() {
        this._commands = [];
    }


    public undo() {
        // pop the last array! and set the array back one item
        this._commands.pop()
    }

    private checkForUnclosedCommands(command: string) {
        // unfortunaly I cannot do recursive regex in javascript otherwise that would have been perfect
        if (this._commands.length > 0 && command !== ')') {
            console.log('unclosed');
            return this.hasUnclosedParenthises()
        }

        return this._commands.length > 0 && command === ')' && this.hasUnclosedParenthises();

    }

    private hasUnclosedParenthises() {
        const strValueToCheck = this._commands[this._commands.length - 1];
        let nrOfOpening = 0;
        let nrOfClosing = 0;
        for (let string of strValueToCheck) {
            console.log('string', string);
            if (string === '(') {
                nrOfOpening++;
            }

            if (string === ')') {
                nrOfClosing++;
            }
        }
        return nrOfOpening !== nrOfClosing;
    }

    /**
     * Made this a simple method just in case something changes later on and i need to add more logic
     * @param command
     * @private
     */
    private addNumber(command: string) {

        this._commands.push(command);
    }

    /**
     *
     * @param command
     * @private
     */
    private addNumberToPrevious(command: string) {
        console.log('last item', this._commands[this._commands.length - 1]);
        this._commands[this._commands.length - 1] = this._commands[this._commands.length - 1] + command;
    }

    /**
     * Same story as addNumber, in case we need, we can add more logic this way and have cleaner code
     * @param operator
     * @private
     */
    private addSimpleOperator(operator: string) {
        this._commands.push(operator);
    }
}
