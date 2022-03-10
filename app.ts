// type Store = {
//   currentPage: number;
//   feeds: NewsFeed[];
// }

interface Store {
  currentPage: number;
  feeds: NewsFeed[];
}


interface News {
  readonly id: number;
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user: string;
  readonly content: string;
}

interface NewsFeed extends News {
  readonly comments_count: number;
  readonly points: number;
  read?: boolean; // optional
}

interface NewsDetail extends News {
  readonly comments:NewsComment[];
}

interface NewsComment extends News {
  readonly comments: NewsComment[];
  readonly level: number;
}

interface RouteInfo {
  path: string;
  page: View;
}

// const container: HTMLElement | null  = document.getElementById("root"); // 타입 가드 사용
const ajax: XMLHttpRequest = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
const content = document.createElement("div");
const ul = document.createElement("ul");

const SHOW_LIST = 10;

function get(selector: string) {
  return document.querySelector(selector);
}

function getAll(selector: string) {
  return document.querySelectorAll(selector);
}

const store: Store = {
  currentPage: 1,
  feeds: [],
};

// class Api {
//   url: string;
//   ajax: XMLHttpRequest;

//   constructor(url: string) {
//     this.url = url;
//     this.ajax = new XMLHttpRequest();
//   }

//   protected getRequest<AjaxResponse>(): AjaxResponse {
//     this.ajax.open("GET", this.url, false);
//     this.ajax.send();
  
//     return JSON.parse(this.ajax.response);
//   }
// }

// class NewsFeedApi extends Api {
//   getData(): NewsFeed[] {
//     return this.getRequest<NewsFeed[]>();
//   }
// }

// class NewsDetailApi extends Api {
//   getData(): NewsDetail {
//     return this.getRequest<NewsDetail>();
//   }
// }

// 상속과 다른 점
// 1. 유연함(하위 클래스에 extends를 적시하기 때문)
// 2. js, ts에서 다중상속을 지원하지 않음
function applyApiMixins(targetClass: any, baseClasss: any[]): void {
  baseClasss.forEach(baseClass => {
    Object.getOwnPropertyNames(baseClass.prototype).forEach(name=> {
      const descriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, name);

      if (descriptor) {
        Object.defineProperty(targetClass.prototype, name, descriptor);
      }
    })
  })
}

class Api {
  getRequest<AjaxResponse>(url: string): AjaxResponse {
    const ajax = new XMLHttpRequest();
    ajax.open("GET", url, false);
    ajax.send();
  
    return JSON.parse(ajax.response);
  }
}

class NewsFeedApi {  
  getData(url: string): NewsFeed[] {
    // 믹스인을 통해 합성됐다는 것을 컴파일러가 알 수 없으므로 interface를 정의
    return this.getRequest<NewsFeed[]>(url); 
  }
}

class NewsDetailApi {
  getData(url: string): NewsDetail {
    // 믹스인을 통해 합성됐다는 것을 컴파일러가 알 수 없으므로 interface를 정의
    return this.getRequest<NewsDetail>(url);
  }
}
interface NewsFeedApi extends Api {};
interface NewsDetailApi extends Api {};
//--------------------------------------------------------------------------------

abstract class View {
  private template: string;
  private renderTemplate: string;
  private container: Element;
  private htmlList: string[];

  constructor(containerId: string, template: string) {
    const containerElement = get(containerId);

    if (!containerElement) {
      throw "the highest grade container doesn't exst";
    }

    this.container = containerElement;
    this.template = template;
    this.renderTemplate = template;
    this.htmlList = [];
  }

  protected updateView(): void {
    this.container.innerHTML = this.renderTemplate;

    // 되돌려놓아야 다음에 key값을 또 변경할 수 있다
    this.renderTemplate = this.template;
  }

  protected addHtml(htmlString: string): void {
    this.htmlList.push(htmlString);
  }

  protected getHtml(): string {
    const snapShot = this.htmlList.join('');
    this.resetHtmlList();
    return snapShot;
  }

  protected setTemplateData(key: string, value: string): void {
    this.renderTemplate = this.renderTemplate.replace(`{{__${key}__}}`, value);
  }

  private resetHtmlList(): void {
    while(this.htmlList.length > 0) {
      this.htmlList.pop();
    }
  }

  abstract render(): void;
}

// 클래스 내부 변경을 최소화하는 방향으로
class Router {
  routeTable: RouteInfo[];
  defaultRoute: RouteInfo | null;

  constructor() {

    window.addEventListener("hashchange", this.route.bind(this));
    this.routeTable = [];
    this.defaultRoute = null;
  }

  setDefaultPage(page: View): void {
    this.defaultRoute = {path:'', page};
  }

  addRoutePath(path: string, page: View): void {
    this.routeTable.push({path, page})
  }

  route(): void {
    const routePath = location.hash;

    if (routePath === '' && this.defaultRoute) {
      this.defaultRoute.page.render();
    } else {
      for (const routeInfo of this.routeTable) {
        if (routePath.indexOf(routeInfo.path) >= 0) {
          routeInfo.page.render();
          break;
        }
      }
    }
  }
}

class NewsFeedView extends View {

  private api: NewsFeedApi;
  private feeds: NewsFeed[];

  constructor(containerId: string) {
    let template = `
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
    super(containerId, template);

    this.api = new NewsFeedApi();
    this.feeds = store.feeds;
  
    if (0 === this.feeds.length) {
      this.feeds = store.feeds = this.api.getData(NEWS_URL);
      this.makeFeeds();
    }
  }

  render(): void {
    // default page를 보여줄 때의 처리
    // hash가 ''
    store.currentPage = Number(location.hash.substring(7) || 1);
    let current = store.currentPage * SHOW_LIST;
    const newFeedLength = this.feeds.length;
    const maximumPage = Math.ceil(newFeedLength / SHOW_LIST);

    if (current >= newFeedLength) {
      current = newFeedLength;
    }

    for (let i = (store.currentPage - 1) * SHOW_LIST; i < current; ++i) {
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
    this.setTemplateData('prev_page', String(store.currentPage > 1 ? store.currentPage - 1 : 1));
    this.setTemplateData('next_page', String(store.currentPage < maximumPage ? store.currentPage + 1 : maximumPage));
    this.updateView();
  }

  private makeFeeds(): void {
    // i는 타입 추론 됐음
    for (let i = 0; i < this.feeds.length; ++i) {
      this.feeds[i].read = false;
    }    
  }
}

class NewsDetailView extends View {
  constructor(containerId:string) {
    let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
     <div class="bg-white text-xl">
      <div class="mx-auto px-4">
        <div class="flex justify-between items-center py-6">
          <div class="flex justify-start">
            <h1 class="font-extrabold">Hacker News</h1>
          </div>
          <div class="items-center justify-end">
            <a href="#/page/{{__current_page__}}" class="text-gray-500"> 
              <i class="fa fa-times"></i>
            </a>
          </div>
        </div>
      </div>
     </div>

     <div class="h-full border rounded-xl bg-white m-6 p-4">
      <h2>{{__title__}}</h2>
      <div class="text-gray-400 h-20">
        {{__content__}}
      </div>
        {{__comments__}}
     </div>
    </div>
  `;    
    super(containerId, template);

  }
  render() {
    const id = location.hash.substring(7);
    const contentUrl = CONTENT_URL.replace("@id", id);
    const api = new NewsDetailApi();  
  
    const newsContent = api.getData(contentUrl);
    for (let i = 0; i < store.feeds.length; ++i) {
      if (store.feeds[i].id === Number(id)) {
        store.feeds[i].read = true;
        break;
      }
    }  
    this.setTemplateData('current_page', String(store.currentPage));
    this.setTemplateData('title', String(newsContent.title));
    this.setTemplateData('content', String(newsContent.content));
    this.setTemplateData('comments', this.makeComment(newsContent.comments));
    this.updateView(); 
  }

  private makeComment(comments: NewsComment[]): string {    
  
    for (let i = 0; i < comments.length; ++i) {
      const comment : NewsComment = comments[i];
      this.addHtml(`
        <div style="padding-left:${comment.level * 40}px;" class="mt-4">
          <div class="text-gray-400">
            <i class="fa fa-sort-up mr-2"></i>
            <strong>${comment.user}</strong> ${comment.time_ago}
          </div>
          <p class="text-gray-700">${comment.content}</p>
        </div>
      `);
      if (comment.comments.length > 0) {
        this.addHtml(this.makeComment(comment.comments));
      }
    }
    return this.getHtml();
  }
}

applyApiMixins(NewsFeedApi, [Api]);
applyApiMixins(NewsDetailApi, [Api]);

const router: Router = new Router();
const newsFeedView = new NewsFeedView('#root');
const newsDetailView = new NewsDetailView('#root');

router.setDefaultPage(newsFeedView);
router.addRoutePath('/page/', newsFeedView);
router.addRoutePath('/show/', newsDetailView);

router.route();