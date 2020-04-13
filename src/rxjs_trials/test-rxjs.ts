import { Observable, merge, Subject, timer } from 'rxjs';
import {
    mapTo,
    scan,
    startWith,
    distinctUntilChanged,
    shareReplay,
    filter, switchMap, pairwise, takeUntil, debounceTime
} from 'rxjs/operators'

export class TestRxjs {
    public taskStarts = new Subject();
    public taskCompletions = new Subject();
    public showSpinner: (total: number, completed: number) => Observable<any>

    private spinnerWithStats: Observable<any>;

    private loadUp = this.taskStarts.pipe(mapTo(1));
    private loadDown = this.taskCompletions.pipe(mapTo(-1));

    private loadVariations: Observable<number>;
    private currentLoads: Observable<number>;

    private shouldHideSpinner: Observable<boolean>
    private shouldShowSpinner: Observable<any>

    private loadStats: Observable<{ total: number, completed: number, previousLoading: number }>

    private el!: HTMLElement;

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
                subscriber.next('blah blah')
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

}