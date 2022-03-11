import { NewsFeed } from "./types"

class Store {
    private feeds: NewsFeed[];
    private _currentPage: number;
    constructor() {
        this.feeds = [];
        this._currentPage = 1;
    }

    // getter setter
    get currentPage() {
        return this._currentPage;
    }

    set currentPage(page: number) {
        if (page <= 0) {
            return;
        }
        this._currentPage = page;
    }

    get nextPage(): number {
        return this._currentPage + 1;
    }

    get prevPage(): number {
        return this._currentPage > 1 ? this._currentPage - 1 : 1;
    }

    get lengthOfFeed(): number {
        return this.feeds.length;
    }

    get hasFeeds(): boolean {
        return this.feeds.length > 0;
    }

    getAllFeeds(): NewsFeed[] {
        return this.feeds;
    }

    getFeed(index: number) {
        return this.feeds[index];
    }

    setFeeds(feeds: NewsFeed[]): void {
        this.feeds = feeds.map(feed=>({
          ...feed,
          read: false  
        }));
    }

    
}