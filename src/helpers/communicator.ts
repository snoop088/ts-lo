export class Communicator {

    private static instance: Communicator;
    private _content: any;

    private constructor() { }

    static get Instance() {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new Communicator();
        }
        return this.instance;
    }
    get content() {
        return this._content;
    }
    set content(val) {
        this._content = val;
    }
    
}