import { fromEvent, Observable } from "rxjs";
export interface User {
    userName: string;
    site: string;
    avatarUrl: string;
}
export interface ViewModel {
    userContainer: HTMLElement;
    userAvatarLink: HTMLElement;
    userAvatar: HTMLElement;
    userName: HTMLElement;
    userSite: HTMLElement;
    userRefresh: HTMLElement
}
// presentational (dumb) component. most important part is exposing the 
// refresh click to the parent class via a public property
export class GithubUser {

    public refreshUser$: Observable<Event>;
    private parentElement: HTMLElement;
    private viewModel: ViewModel;

        constructor(parentElement: HTMLElement) {
        
        this.parentElement = parentElement;
        this.viewModel = {
            userContainer: document.createElement('div'),
            userAvatarLink: document.createElement('a'),
            userAvatar: document.createElement('img'),
            userName: document.createElement('span'),
            userSite: document.createElement('a'),
            userRefresh: document.createElement('span')
        }
        const { userContainer, userName, userAvatar, userAvatarLink, userSite, userRefresh } = this.viewModel;
        const spacer = document.createElement('div');
        userContainer.className = 'user-container';
        spacer.className = 'spacer';
        userName.className = 'user-name';
        userSite.className = 'user-site';
        userAvatar.className = 'user-avatar';
        userRefresh.className = 'user-refresh material-icons';
        userContainer.appendChild(userAvatarLink);
        userAvatarLink.appendChild(userAvatar);
        userContainer.appendChild(userName);
        userContainer.appendChild(spacer);
        userContainer.appendChild(userSite);
        

        this.parentElement.appendChild(userContainer);
        this.refreshUser$ = fromEvent(userRefresh, 'click');

        userName.textContent = 'loading user...';
        
    }
    
    public renderData(userData: Observable<User | null>) {
        const { userName, userAvatar, userAvatarLink, userSite, userRefresh } = this.viewModel;
        userData.subscribe(user => {
            if (user) {
                // const handleClick = (e: any) => window.open(user.site, '_blank');
                userAvatar.setAttribute('src', user.avatarUrl);
                userAvatarLink.setAttribute('href', user.site);
                userAvatarLink.setAttribute('target', '_blank');
                userSite.setAttribute('href', user.site);
                userSite.setAttribute('target', '_blank');
                userSite.textContent = 'visit site';
                userName.textContent = user.userName;
                // append here so that the textContent does not overwrite the x-icon
                userName.appendChild(userRefresh);
                // user material icons to display a x icon
                userRefresh.textContent = 'clear';
            } else {
                userName.textContent = 'loading user...'
                userAvatar.setAttribute('src', 'loading.png');
            }

        })
    }
}