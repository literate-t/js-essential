import View from "../core/view";

export interface NewsStore {
  getAllFeeds: () => NewsFeed[];
  getFeed: (index: number) => NewsFeed;
  setFeeds: (feeds: NewsFeed[]) => void;
  makeRead: (id: number) => void;
  hasFeeds: boolean;
  currentPage: number; // Store 클래스에서 getter/setter로 만들었다고 해서 함수로 타이핑하면 안 됨
  lengthOfFeed: number;
  nextPage: number;
  prevPage: number;
}

export interface News {
    readonly id: number;
    readonly time_ago: string;
    readonly title: string;
    readonly url: string;
    readonly user: string;
    readonly content: string;
  }
  
export interface NewsFeed extends News {
    readonly comments_count: number;
    readonly points: number;
    read?: boolean; // optional
  }
  
export interface NewsDetail extends News {
    readonly comments:NewsComment[];
  }
  
export interface NewsComment extends News {
    readonly comments: NewsComment[];
    readonly level: number;
  }
  
export interface RouteInfo {
    path: string;
    page: View;
  }