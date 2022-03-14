import {NewsFeed, NewsDetail } from '../types/index'

export class Api {
    url: string;
    xhr: XMLHttpRequest;
  
    constructor(url: string) {
      this.url = url;
      this.xhr = new XMLHttpRequest();
    }
  
    // protected getRequestWithXHR<AjaxResponse>(callback: (data:AjaxResponse) => void): void {
    //   //this.xhr.open("GET", this.url, false);
    //   this.xhr.open("GET", this.url);
    //   this.xhr.addEventListener('load', () => {
    //     callback(JSON.parse(this.xhr.response));
    //   })
    //   this.xhr.send();
    // }

    // protected getRequestWithPromise<AjaxResponse>(callback: (data:AjaxResponse) => void): void {
    //   fetch(this.url)
    //   .then(res=>res.json())
    //   .then(callback)
    //   .catch(()=>{
    //     console.log('failed to load datas');
    //   })
    // }

    protected async request<AjaxResponse>(): Promise<AjaxResponse> {
      const response = await fetch(this.url);
      return await response.json() as AjaxResponse; // response가 promise, 
    }
  }


  
  export class NewsFeedApi extends Api {
    // 여기서 super 호출을 안 했는데 오류가 안 났네?..
    async getData(): Promise<NewsFeed[]> {
      return this.request<NewsFeed[]>();
    }

    // getDataWithPromise(callback: (data: NewsFeed[]) => void): void {
    //   this.getRequestWithPromise<NewsFeed[]>(callback);
    // }
  }
  
  export class NewsDetailApi extends Api {
    async getData(): Promise<NewsDetail> {
      return this.request<NewsDetail>();
    }

    // getDataWithPromise(callback: (data:NewsDetail) => void) {
    //   this.getRequestWithPromise<NewsDetail>(callback);
    // }
  }