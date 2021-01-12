declare var TweenMax: any;
import { TestDeco } from './decos/test-deco';
import * as chrome_lib from 'chrome-lib';
import { TestRxjs } from './rxjs_trials/test-rxjs';
import { mergeMap } from 'rxjs/operators';
import { GithubRxjs } from './rxjs_trials/github-rxjs'
@TestDeco({
    surname: 'Stevens'
})
export class Dummy {
    private _name!: string;
    private _people!: Promise<any>;
    set name(val: string) {
        this._name = val;
    }
    surname!: string;
    type!: string;
    count!: number;
    myTestRx: TestRxjs;
    githubRxjs!: GithubRxjs;
    constructor() {
        this.myTestRx = new TestRxjs();
        // this.myTestRx.nestedStreams().pipe(
        //     mergeMap(value => value)
        // ).subscribe();
        
        // this.myTestRx.streamArr().subscribe(console.log)
        this.gitHubUsers();
    }
    gitHubUsers() {
        const usersContainer = document.getElementsByClassName('users-container')[0] as HTMLElement;
        this.githubRxjs = new GithubRxjs(5, usersContainer);
        
    }
    showName(el: HTMLElement | null) {
        if (el) {
            const rand = chrome_lib.testB(200);
            const lang = document.createElement('div');
            const name = document.createElement('div');
            name.className = 'my-name';
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
    createButtonForAPI(el: HTMLElement | null) {
        if (el) {
            const btn = el.appendChild(document.createElement('button'));
            btn.innerHTML = 'click for API?';
            btn.type = 'button';
            btn.addEventListener('click', () => this.loadPeople(el));
        }
    }
    public async loadPeople(el: HTMLElement) {
        if (!document.querySelector('.api-container > div')) {
            const response = await fetch('http://192.168.12.101:1337/people');
            const people = await response.json();
            this.dislayPeople(people, el);
        }

    }
    public dislayPeople(people: any[], el: HTMLElement) {
        people.forEach(person => {
            const p = el.appendChild(document.createElement('div'));
            p.innerHTML = `Hi, ${person.title} ${person.firstName} ${person.lastName},<br>email: ${person.email}`
        })

    }
    checkObs() {
        const chk = new TestRxjs();
        chk.myOb$.subscribe(r => console.log(r));
    }
}