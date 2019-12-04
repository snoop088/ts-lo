import { Dummy } from './dummy';
import { Communicator } from './helpers/communicator';

declare var TweenLite: any;
declare var contentSet: any;
declare var dynamicContent: any;

export class App {
    constructor(){
        this.main();
    }
    public main(){
        this.contentCheck();
        
    }
    private contentCheck() {
        setTimeout(() => {
            contentSet ? this.animStart() : this.contentCheck()
        }, 1000)
    }
    private animStart() {
        Communicator.Instance.content = dynamicContent.GLO_Fixture_template_with_imagery_html5_Sheet1[0];
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
    }
}
new App();