import { Dummy } from './dummy';

declare var TweenLite: any;

export class App {
    constructor(){
        this.main();
    }
    public main(){
        const d = new Dummy();
        d.name = "Gosho";
        const el: HTMLElement | null = document.querySelector('.jj') || document.getElementById('#body');
        TweenLite.from(el, 2, {'alpha': 0});
        d.showName(el);
        d.moveTo(el, 100);
        this.testDeco();
    }
    private testDeco(){
        const person = {name: 'Peter'};
        const deco = (age: number) => (person: {name: string}) => {
            return {age, name: person.name}
        }
        console.log(deco(45)(person))
    }
}
new App();