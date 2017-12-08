import { Dummy } from './dummy';
export class App {
    constructor(private engine: string, public test: string){}
    public main(){
        const d = new Dummy()
    }
}