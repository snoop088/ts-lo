declare var TweenMax: any;
import { TestDeco } from './decos/test-deco';
import * as chrome_lib from 'chrome-lib';
import { Communicator } from './helpers/communicator';
import { TestRxjs } from './rxjs_trials/test-rxjs';
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
    myTestRx: TestRxjs;
    constructor(){
        this.myTestRx = new TestRxjs();
    }
    showName(el: HTMLElement | null){
        if (el){
            const rand = chrome_lib.testB(200);
            const lang = document.createElement('div');
            const name = document.createElement('div');
            name.className = 'my-name';
            lang.innerHTML = 'Language: ' + Communicator.Instance.content.lang;
            name.innerHTML = 'Name: ' + this._name + ' ' + (this.surname || '') + ' ' + rand;
            el.appendChild(name);
            el.appendChild(lang)
        }
        this.checkObs();
    }
    moveTo(el: HTMLElement | null, dist: number) {
        if (el && TweenMax) {
            TweenMax.to(el, 1, { 'x': dist, onComplete: this.createButton, onCompleteParams: [el], callbackScope: this });
        } else {
            console.log('err');
        }
        
    }
    createButton(el: HTMLElement | null) {
        if (el) {
            const btn = el.appendChild(document.createElement('button'));
            const sq = el.appendChild(document.createElement('div'));
            sq.className = 'green-sq';
            sq.innerHTML = '0'
            btn.innerHTML = 'Click Me?';
            btn.type = 'button';
            btn.addEventListener('click', (target) => {
                this.myTestRx.startTask(sq);
                setTimeout(() => this.myTestRx.existingTaskCompleted(), 7000)
            })
        }
    }
    checkObs() {
        const chk = new TestRxjs();
        chk.myOb$.subscribe(r => console.log(r));
    }
}