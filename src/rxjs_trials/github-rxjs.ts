import { Observable, merge, fromEvent, of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch'
import {
    mapTo,
    startWith,
    shareReplay,
    map,
    switchMap, switchMapTo, tap, catchError
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
    constructor(numUsers: number, parentEl: HTMLElement) {
        
        // create button to refresh
        const refreshButton = document.createElement('button');
        refreshButton.textContent = 'refresh users';
        this.refreshUsersEvent$ = fromEvent(refreshButton, 'click');
        // map the click to a new request to the API + some cache buster
        this.refreshApi$ = this.refreshUsersEvent$.pipe(
            mapTo(this.api + '&seed=' + Math.random() * 139873),
        ); 
        this.getUsers$ = this.refreshApi$.pipe(
            // start with the first call, then add new calls on clicking refresh
            startWith(this.api),
            // utilise the fromFetch of rxJS to envoke fetch promise and covert to observable
            switchMap(url => fromFetch(url)),
            // convert request to response
            switchMap(response => {
                // handle the response
                if (response.ok) {
                    return response.json()
                } else {
                    return of({ error: true, message: `Error ${response.status}` })
                }
            }),
            // report any errors
            catchError(err => of('Caught Error: ' + err)),
            // IMPORTANT! use sharereplay to reuse the same network call when obtaining
            // the user streams below
            shareReplay({ bufferSize: 1, refCount: true })
        );
        // set the users - generate n-number of user streams from the getUsers$ stream
        this.setUsers(numUsers, parentEl);
        parentEl.appendChild(refreshButton);
    }
    // Get n-number of random users from the Users Stream and create random user stream
    private setUsers(numUsers: number, parentEl: HTMLElement) {
        for (let i = 0; i < numUsers; i++) {
            // get a randomUser$ stream from the users stream
            const randomUser$: Observable<User | null> = this.getRandomUser();
            // create the presentational class to display the users and pass the container
            const user = new GithubUser(parentEl)
            // obtain the click stream from the presentational component
            const userRefresh$ = user.refreshUser$;
            // Implement replace User Stream with new random User when refresh user is clicked
            const refreshedRandomUser$ = userRefresh$.pipe(
                switchMapTo(this.getRandomUser())
            )
            user.renderData(merge(randomUser$, refreshedRandomUser$));

        }
    }
    private getRandomUser(): Observable<User | null> {
        const randomUser$ = this.getUsers$.pipe(
            // get a random user from the array of users
            // NOTE: the getUsers$ stream contains a stream of user arrays, not a stream of single users
            // happening over time (i.e. when a refresh users button is pressed a new array of users is returned)
            map(users => users[Math.floor(Math.random() * users.length)]),
            // map the user to our User interface
            map(user => {
                return { userName: user.login, avatarUrl: user.avatar_url, site: user.html_url } as User
            }),
            startWith(null)
        )
        const clearOnRefreshClicked$ = this.refreshUsersEvent$.pipe(mapTo(null));

        return merge(randomUser$, clearOnRefreshClicked$);
        
    }
}