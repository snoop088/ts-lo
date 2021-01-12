import { Observable, merge, Subject, fromEvent, of, timer, interval, from } from 'rxjs';
import { fromFetch } from 'rxjs/fetch'
import {
    mapTo,
    scan,
    startWith,
    shareReplay,
    map,
    switchMap, switchMapTo
} from 'rxjs/operators'
import { GithubUser, User } from '../git-user/github-user';

export interface GitHubUserData {
    login: string;
    avatar_url: string;
    html_url: string;
}

export class GithubRxjs {
    // create API url stream with API url to GitHub

    // Get GitHub users stream and share to multiple subscribers
    private getUsers$: Observable<GitHubUserData[]>;
    
    // Implement refresh Users Stream
    private refreshUsersEvent$!: Observable<Event>;
    // Implement refresh Users
    private refreshApi$!: Observable<string>
    
    private api = 'https://api.github.com/users?per_page=30';
    private requestApi$ = of(this.api);
    constructor(numUsers: number, parentEl: HTMLElement) {

        // create button to refresh
        const refreshButton = document.createElement('button');
        refreshButton.textContent = 'refresh users';
        this.refreshUsersEvent$ = fromEvent(refreshButton, 'click');
        this.refreshApi$ = this.refreshUsersEvent$.pipe(
            mapTo(this.api + '&seed=' + Math.random() * 139873)
        );


        this.getUsers$ = merge(this.requestApi$, this.refreshApi$).pipe(
            switchMap(url => fromFetch(url)),
            switchMap(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    return of({ error: true, message: `Error ${response.status}` })
                }
            }),
            shareReplay({ bufferSize: 1, refCount: true })
        );

        this.setUsers(numUsers, parentEl);
        parentEl.appendChild(refreshButton);
    }
    // Get n-number of random users from the Users Stream and create random user stream
    private setUsers(numUsers: number, parentEl: HTMLElement) {
        for (let i = 0; i < numUsers; i++) {
            const randomUser$: Observable<User | null> = this.getRandomUser();
            
            const user = new GithubUser(parentEl)
            const userRefresh$ = user.refreshUser$;
            // Implement replace User Stream with new random User
            const refreshedRandomUser$ = userRefresh$.pipe(
                switchMapTo(this.getRandomUser())
            )
            user.renderData(merge(randomUser$, refreshedRandomUser$));

        }
    }
    private getRandomUser(): Observable<User | null> {
        return this.getUsers$.pipe(
            map(users => users[Math.floor(Math.random() * users.length)]),
            map(user => {
                return { userName: user.login, avatarUrl: user.avatar_url, site: user.html_url } as User
            }),
            startWith(null)
        )
    }
}