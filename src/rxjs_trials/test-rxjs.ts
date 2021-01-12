import { Observable, merge, Subject, fromEvent, of, timer, interval } from 'rxjs';
import {
    mapTo,
    scan,
    startWith,
    distinctUntilChanged,
    shareReplay,
    map,
    filter, switchMap, pairwise, takeUntil, debounceTime, tap, takeWhile, take, skip, mergeMap
} from 'rxjs/operators'
export const COMBO = ['a', 's', 'd', 'f', 'g'];
export class TestRxjs {
    public taskStarts = new Subject();
    public taskCompletions = new Subject();


    private spinnerWithStats: Observable<any>;

    private loadUp = this.taskStarts.pipe(mapTo(1));
    private loadDown = this.taskCompletions.pipe(mapTo(-1));

    private loadVariations: Observable<number>;
    private currentLoads: Observable<number>;

    private shouldHideSpinner: Observable<boolean>
    private shouldShowSpinner: Observable<any>

    private loadStats: Observable<{ total: number, completed: number, previousLoading: number }>;
    private keyPresses = fromEvent(document, 'keypress').pipe(map((event: any) => event.key), tap(r => console.log(r)));

    private el!: HTMLElement;

    private showSpinner: (total: number, completed: number) => Observable<string>;
    private keyCombo: (combo: string[]) => Observable<boolean>;
    private keyPressed: (key: string) => Observable<boolean>;
    private comboTriggered: any;
    private myObs: Observable<string>;
    constructor() {

        this.myObs = new Observable(subscriber => {
            subscriber.next('go go go')
        });

        this.loadVariations = merge(this.loadUp, this.loadDown);

        ////////////////////////////////////////////////////////

        this.currentLoads = this.loadVariations.pipe(
            startWith(0),
            scan((currentVal: number, nextVal: number) => {
                const totalCount = currentVal + nextVal
                console.log(totalCount);
                return totalCount > 0 ? totalCount : 0;
            }),
            distinctUntilChanged(),
            shareReplay({ bufferSize: 1, refCount: true })
        );

        ////////////////////////////////////////////////////////

        this.loadStats = this.currentLoads.pipe(
            scan((
                loadedStats: { total: number, completed: number, previousLoading: number },
                loadUpdate: number) => {
                const loadsWentDown = loadUpdate < loadedStats.previousLoading;
                const currentCompleted = loadsWentDown ? loadedStats.completed + 1 : loadedStats.completed;
                return {
                    total: currentCompleted + loadUpdate,
                    completed: currentCompleted,
                    previousLoading: loadUpdate
                }
            }, { total: 0, completed: 0, previousLoading: 0 })
        )
        ////////////////////////////////////////////////////////

        this.showSpinner = (total: number, completed: number) =>
            new Observable(subscriber => {
                this.el.classList.add('active');
                this.el.innerHTML = Math.round(completed / total * 100) + '%';
                subscriber.next('blah blah');
                return () => {
                    this.el.classList.remove('active');
                }
            })

        this.shouldHideSpinner = this.currentLoads.pipe(
            filter(val => val === 0),
            mapTo(true)
        );
        this.spinnerWithStats = this.loadStats.pipe(
            switchMap(stats => this.showSpinner(stats.total, stats.completed))
        );
        this.shouldShowSpinner = this.currentLoads.pipe(
            pairwise(),
            filter(([prev, current]) => prev === 0 && current === 1),
            debounceTime(1000),
            switchMap(() => this.spinnerWithStats.pipe(takeUntil(this.shouldHideSpinner)))
        );
        this.shouldShowSpinner.subscribe(r => console.log(r));

        ////////////////////////////////////////////////////////
        this.keyPressed = (key: string) => {
            return this.keyPresses.pipe(filter(keyPressed => keyPressed === key), (mapTo(true)))
        }
        this.keyCombo = (combo: string[]) => {
            const comboInitiator = combo[0];
            return this.keyPressed(comboInitiator).pipe(switchMap(() => { // Means combo has started! //
                return this.keyPresses.pipe(
                    takeUntil(timer(3000)),
                    takeWhile((key, index) => combo[index + 1] === key),
                    skip(combo.length - 2), // skips all of the keypresses + initiator that pass above, but leaves the last one
                    take(1),
                    mapTo(true)
                )
            })
            )
        }
        // this.comboTriggered = this.keyCombo(COMBO);
        // interval(1000).pipe(
        //     takeUntil(this.comboTriggered)
        // ).subscribe(x => console.log(x),
        //     (err) => { },
        //     () => console.log('completed'));
    }
    get myOb$(): Observable<string> {
        return this.myObs;
    }
    public startTask(el: HTMLElement) {
        this.el = el;
        this.taskStarts.next();
    }
    public existingTaskCompleted() {
        this.taskCompletions.next();
    }
    public streamArr(): Observable<string> {
        const arr = ['bb', 'cc', 'dd', 'ee', 'ff'];

        return timer(0, 2000).pipe(
            take(5),
            map(i => arr[i]),
        )
    }
    public nestedStreams() {

        const setsOfValues = [
            ["a", "b", "c", "d", "e", "f"],
            [1, 2, 3, 4, 5, 6],
            ["😀", "🐶", "🍏", "⚽️", "🚗", "⌚️"]
        ];

        const threeStreamsOfThings$ = timer(0, 1333).pipe(
            take(3),
            map(outerNumber =>
                timer(0, 1000).pipe(
                    take(6),
                    map(innerNumber => setsOfValues[outerNumber][innerNumber]),
                )
            )
        );

        threeStreamsOfThings$.pipe(mergeMap(value => value));
        return threeStreamsOfThings$;
    }

}