declare var TweenLite: any;
import { TestDeco } from './decos/test-deco';
import * as chrome_lib from 'chrome-lib';
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
        if (el){
            const lang = document.createElement('div');
            const name = document.createElement('div');
            name.className = 'my-name';
            lang.innerHTML = 'Language: ' + Communicator.Instance.content.lang;
            name.innerHTML = 'Name: ' + this._name + ' ' + (this.surname || '');
            el.appendChild(name);
            el.appendChild(lang)
        }
        console.log(chrome_lib.ver());
    }
    moveTo(el: HTMLElement | null, dist: number) {
        if (el && TweenLite) {
            TweenLite.to(el, 1, {'x': dist});
        } else {
            console.log('err');
        }
        
    }
}