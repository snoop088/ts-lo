declare var TweenLite: any;
import { TestDeco } from './decos/test-deco';
import { Communicator } from './helpers/communicator';
@TestDeco({
    surname: 'Stevens'
})
export class Dummy {
    private _name!: string; 
    set name(val: string) {
        this._name = val;
    }
    surname!: string;
    type!: string;
    count!: number;
    constructor(){
    }
    showName(el: HTMLElement | null){
        console.log(Communicator.Instance.content.lang);
        if (el){
            el.innerHTML = this._name + ' ' + (this.surname || '');
        }
    }
    moveTo(el: HTMLElement | null, dist: number) {
        if (el && TweenLite) {
            TweenLite.to(el, 1, {'x': dist});
        } else {
            console.log('err');
        }
        
    }
}