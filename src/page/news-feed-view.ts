import View from "../core/view";
import { NewsFeedApi } from "../core/api";
import { NewsFeed } from "../types";
import { NEWS_URL } from "../config";
import { SHOW_LIST } from "../config";

const template = `
<div class="bg-gray-600 min-h-screen">
  <div class="bg-white text-xl">
    <div class="mx-auto px-4">
      <div class="flex justify-between items-center py-6">
        <div class="flex justify-start">
          <h1 class="font-extrabold">Hacker News</h1>
        </div>
        <div class="items-center justify-end">  
          <a href="#/page/{{__prev_page__}}" class="text-gray-500">
            Previous
          </a>
          <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
            Next
          </a>
        </div>
      </div>
    </div>
  </div>
  <div class="p-4 text-2xl text-gray-700">
    {{__news_feed__}}
  </div>
</div>
`; 

export default class NewsFeedView extends View {

    private api: NewsFeedApi;
    private feeds: NewsFeed[];
  
    constructor(containerId: string) {

      super(containerId, template);
  
      this.api = new NewsFeedApi(NEWS_URL);
      this.feeds = window.store.feeds;
    
      if (0 === this.feeds.length) {
        this.feeds = window.store.feeds = this.api.getData();
        this.makeFeeds();
      }
    }
  
    render(): void {
      // default page를 보여줄 때의 처리
      // hash가 ''
      window.store.currentPage = Number(location.hash.substring(7) || 1);
      let current = window.store.currentPage * SHOW_LIST;
      const newFeedLength = this.feeds.length;
      const maximumPage = Math.ceil(newFeedLength / SHOW_LIST);
  
      if (current >= newFeedLength) {
        current = newFeedLength;
      }
  
      for (let i = (window.store.currentPage - 1) * SHOW_LIST; i < current; ++i) {
        const {id, title, comments_count, user, points, time_ago, read} = this.feeds[i];
        this.addHtml(`
          <div class="p-6 ${
            read ? "bg-red-500" : "bg-white"
          } mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
            <div class="flex">
              <div class="flex-auto">
                <a href="#/show/${id}">${title}</a>
              </div>
              <div class="text-center text-sm">
                <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${
                  comments_count
                }</div>
              </div>
            </div>
            <div class="flex mt-3">
              <div class="grid grid-cols-3 text-sm text-gray-500">
                <div><i class="fas fa-user mr-l"></i>${user}</div>
                <div><i class="fas fa-heart mr-l"></i>${points}</div>
                <div><i class="fas fa-clock mr-l"></i>${time_ago}</div>
              </div>
            </div>
          </div>
        `);
      } 
  
      this.setTemplateData('news_feed', this.getHtml());
      this.setTemplateData('prev_page', String(window.store.currentPage > 1 ? window.store.currentPage - 1 : 1));
      this.setTemplateData('next_page', String(window.store.currentPage < maximumPage ? window.store.currentPage + 1 : maximumPage));
      this.updateView();
    }
  
    private makeFeeds(): void {
      // i는 타입 추론 됐음
      for (let i = 0; i < this.feeds.length; ++i) {
        this.feeds[i].read = false;
      }    
    }
  }