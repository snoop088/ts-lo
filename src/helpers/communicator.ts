export class Communicator {

    private static instance: Communicator;

    private constructor() { }

    static get Instance() {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new Communicator();
        }
        return this.instance;
    }
}