export default class Config {
    github: {
        base: string;
        apiBase: any;
        token: string;
    };
    landingPageMdSrc: string;
    memcached: any;
    whitelist: any;
    validateConfig(): void;
    canAccess({ owner, repo, gists }: {
        owner: any;
        repo: any;
        gists: any;
    }): any;
}
