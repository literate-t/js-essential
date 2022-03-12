import {NewsFeed, NewsDetail } from '../types/index'

export class Api {
    url: string;
    ajax: XMLHttpRequest;
  
    constructor(url: string) {
      this.url = url;
      this.ajax = new XMLHttpRequest();
    }
  
    protected getRequest<AjaxResponse>(callback: (data:AjaxResponse) => void): void {
      //this.ajax.open("GET", this.url, false);
      this.ajax.open("GET", this.url);
      this.ajax.addEventListener('load', () => {
        callback(JSON.parse(this.ajax.response));
      })
      this.ajax.send();
    }
  }
  
  export class NewsFeedApi extends Api {
    // 여기서 super 호출을 안 했는데 오류가 안 났네?..
    getData(): NewsFeed[] {
      return this.getRequest<NewsFeed[]>();
    }
  }
  
  export class NewsDetailApi extends Api {
    getData(): NewsDetail {
      return this.getRequest<NewsDetail>();
    }
  }