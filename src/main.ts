import { Dummy } from './dummy';

declare var TweenLite: any;


export class App {
    constructor(){
        this.main();
    }
    public main(){
        this.animStart()
        
    }

    private animStart() {
        const d = new Dummy();
        d.name = "Gosho";
        const el: HTMLElement | null = document.querySelector('.jj') || document.getElementById('#body');
        const apiContainer: HTMLElement | null = document.querySelector('.api-container') || document.getElementById('#body');
        TweenLite.from(el, 2, {'alpha': 0});
        d.showName(el);
        d.moveTo(el, 100);
        d.createButtonForAPI(apiContainer);
        this.testDeco();
    }
    private testDeco(){
        const person = {name: 'Peter'};
        const deco = (age: number) => (person: {name: string}) => {
            return {age, name: person.name}
        }
    }
}
new App();