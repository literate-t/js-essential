import { NewsFeed, NewsStore } from "./types"
import { SHOW_LIST } from "./config";

export default class Store implements NewsStore {
    private _feeds: NewsFeed[];
    private _currentPage: number;
    constructor() {
        this._feeds = [];
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
        const maximumPage = Math.ceil(this._feeds.length / SHOW_LIST);
        return maximumPage <= this._currentPage + 1 ? maximumPage : this._currentPage + 1;
    }

    get prevPage(): number {
        return this._currentPage > 1 ? this._currentPage - 1 : 1;
    }

    get lengthOfFeed(): number {
        return this._feeds.length;
    }

    get hasFeeds(): boolean {
        return this._feeds.length > 0;
    }

    getAllFeeds(): NewsFeed[] {
        return this._feeds;
    }

    getFeed(index: number) {
        return this._feeds[index];
    }

    setFeeds(feeds: NewsFeed[]): void {
        this._feeds = feeds.map((feed:NewsFeed)=>({
          ...feed,
          read: false  
        }));
    }

    makeRead(id: number): void {
        const feed = this._feeds.find((feed:NewsFeed) => feed.id === id);
        if (feed) {
            feed.read = true;
        }
    }
}