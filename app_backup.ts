// // type Store = {
// //   currentPage: number;
// //   feeds: NewsFeed[];
// // }

// interface Store {
//   currentPage: number;
//   feeds: NewsFeed[];
// }


// interface News {
//   readonly id: number;
//   readonly time_ago: string;
//   readonly title: string;
//   readonly url: string;
//   readonly user: string;
//   readonly content: string;
// }

// interface NewsFeed extends News {
//   readonly comments_count: number;
//   readonly points: number;
//   read?: boolean; // optional
// }

// interface NewsDetail extends News {
//   readonly comments:NewsComment[];
// }

// interface NewsComment extends News {
//   readonly comments: NewsComment[];
//   readonly level: number;
// }

// const container: HTMLElement | null  = document.getElementById("root"); // 타입 가드 사용
// const ajax: XMLHttpRequest = new XMLHttpRequest();
// const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
// const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
// const content = document.createElement("div");
// const ul = document.createElement("ul");

// const SHOW_LIST = 10;

// const store: Store = {
//   currentPage: 1,
//   feeds: [],
// };

// // class Api {
// //   url: string;
// //   ajax: XMLHttpRequest;

// //   constructor(url: string) {
// //     this.url = url;
// //     this.ajax = new XMLHttpRequest();
// //   }

// //   protected getRequest<AjaxResponse>(): AjaxResponse {
// //     this.ajax.open("GET", this.url, false);
// //     this.ajax.send();
  
// //     return JSON.parse(this.ajax.response);
// //   }
// // }

// // class NewsFeedApi extends Api {
// //   getData(): NewsFeed[] {
// //     return this.getRequest<NewsFeed[]>();
// //   }
// // }

// // class NewsDetailApi extends Api {
// //   getData(): NewsDetail {
// //     return this.getRequest<NewsDetail>();
// //   }
// // }

// // 상속과 다른 점
// // 1. 유연함(하위 클래스에 extends를 적시하기 때문)
// // 2. js, ts에서 다중상속을 지원하지 않음
// function applyApiMixins(targetClass: any, baseClasss: any[]): void {
//   baseClasss.forEach(baseClass => {
//     Object.getOwnPropertyNames(baseClass.prototype).forEach(name=> {
//       const descriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, name);

//       if (descriptor) {
//         Object.defineProperty(targetClass.prototype, name, descriptor);
//       }
//     })
//   })
// }

// class Api {
//   getRequest<AjaxResponse>(url: string): AjaxResponse {
//     const ajax = new XMLHttpRequest();
//     ajax.open("GET", url, false);
//     ajax.send();
  
//     return JSON.parse(ajax.response);
//   }
// }

// class NewsFeedApi {  
//   getData(url: string): NewsFeed[] {
//     // 믹스인을 통해 합성됐다는 것을 컴파일러가 알 수 없으므로 interface를 정의
//     return this.getRequest<NewsFeed[]>(url); 
//   }
// }

// class NewsDetailApi {
//   getData(url: string): NewsDetail {
//     // 믹스인을 통해 합성됐다는 것을 컴파일러가 알 수 없으므로 interface를 정의
//     return this.getRequest<NewsDetail>(url);
//   }
// }

// interface NewsFeedApi extends Api {};
// interface NewsDetailApi extends Api {};

// applyApiMixins(NewsFeedApi, [Api]);
// applyApiMixins(NewsDetailApi, [Api]);

// const makeFeeds = (feeds : NewsFeed[]): NewsFeed[] => {
//   // i는 타입 추론 됐음
//   for (let i = 0; i < feeds.length; ++i) {
//     feeds[i].read = false;
//   }
//   return feeds;
// };

// function updateView(html: string): void {
//   if(container) {
//     container.innerHTML = html;
//   } else {
//     console.error('null container');
//   }
// }

// function newsFeed(): void {
//   const api = new NewsFeedApi();
//   let newsFeed: NewsFeed[] = store.feeds;

//   if (0 === newsFeed.length) {
//     newsFeed = store.feeds = makeFeeds(api.getData(NEWS_URL));
//   }

//   const newFeedLength = newsFeed.length;
//   const maximumPage = Math.ceil(newFeedLength / SHOW_LIST);
//   const newsList = [];

//   let template = `
//         <div class="bg-gray-600 min-h-screen">
//           <div class="bg-white text-xl">
//             <div class="mx-auto px-4">
//               <div class="flex justify-between items-center py-6">
//                 <div class="flex justify-start">
//                   <h1 class="font-extrabold">Hacker News</h1>
//                 </div>
//                 <div class="items-center justify-end">  
//                   <a href="#/page/{{__prev_page__}}" class="text-gray-500">
//                     Previous
//                   </a>
//                   <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
//                     Next
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div class="p-4 text-2xl text-gray-700">
//             {{__news_feed__}}
//           </div>
//         </div>
//     `;

//   //newsList.push("<ul>");
//   let current = store.currentPage * SHOW_LIST;
//   if (current >= newFeedLength) {
//     current = newFeedLength;
//   }
//   for (let i = (store.currentPage - 1) * SHOW_LIST; i < current; ++i) {
//     newsList.push(`
//       <div class="p-6 ${
//         newsFeed[i].read ? "bg-red-500" : "bg-white"
//       } mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
//         <div class="flex">
//           <div class="flex-auto">
//             <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>
//           </div>
//           <div class="text-center text-sm">
//             <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${
//               newsFeed[i].comments_count
//             }</div>
//           </div>
//         </div>
//         <div class="flex mt-3">
//           <div class="grid grid-cols-3 text-sm text-gray-500">
//             <div><i class="fas fa-user mr-l"></i>${newsFeed[i].user}</div>
//             <div><i class="fas fa-heart mr-l"></i>${newsFeed[i].points}</div>
//             <div><i class="fas fa-clock mr-l"></i>${newsFeed[i].time_ago}</div>
//           </div>
//         </div>
//       </div>
//     `);
//   }
//   template = template.replace("{{__news_feed__}}", newsList.join(""));
//   template = template.replace(
//     "{{__prev_page__}}",
//     String(store.currentPage > 1 ? store.currentPage - 1 : 1)
//   );
//   template = template.replace(
//     "{{__next_page__}}",
//     String(store.currentPage < maximumPage ? store.currentPage + 1 : maximumPage)
//   );

//   updateView(template);
// }

// function newsDetail(): void {
//   const id = location.hash.substring(7);
//   const contentUrl = CONTENT_URL.replace("@id", id);
//   const api = new NewsDetailApi();
  

//   const newsContent = api.getData(contentUrl);
//   let template = `
//     <div class="bg-gray-600 min-h-screen pb-8">
//      <div class="bg-white text-xl">
//       <div class="mx-auto px-4">
//         <div class="flex justify-between items-center py-6">
//           <div class="flex justify-start">
//             <h1 class="font-extrabold">Hacker News</h1>
//           </div>
//           <div class="items-center justify-end">
//             <a href="#/page/${store.currentPage}" class="text-gray-500"> 
//               <i class="fa fa-times"></i>
//             </a>
//           </div>
//         </div>
//       </div>
//      </div>

//      <div class="h-full border rounded-xl bg-white m-6 p-4">
//       <h2>${newsContent.title}</h2>
//       <div class="text-gray-400 h-20">
//         ${newsContent.content}
//       </div>
//         {{__comments__}}
//      </div>
//     </div>
//   `;

//   for (let i = 0; i < store.feeds.length; ++i) {
//     if (store.feeds[i].id === Number(id)) {
//       store.feeds[i].read = true;
//       break;
//     }
//   }
  
//   updateView(template.replace("{{__comments__}}", makeComment(newsContent.comments)));  
// }

// function makeComment(comments: NewsComment[]): string {
//   const commentString = [];

//   for (let i = 0; i < comments.length; ++i) {
//     const comment : NewsComment = comments[i];
//     commentString.push(`
//       <div style="padding-left:${comment.level * 40}px;" class="mt-4">
//         <div class="text-gray-400">
//           <i class="fa fa-sort-up mr-2"></i>
//           <strong>${comment.user}</strong> ${comment.time_ago}
//         </div>
//         <p class="text-gray-700">${comment.content}</p>
//       </div>
//     `);
//     if (comment.comments.length > 0) {
//       commentString.push(makeComment(comment.comments));
//     }
//   }
//   return commentString.join("");
// }

// function router(): void {
//   const routePath = location.hash;
//   if (routePath === "") {
//     newsFeed();
//   } else if (routePath.indexOf("#/page/") >= 0) {
//     store.currentPage = Number(routePath.substring(7));
//     newsFeed();
//   } else {
//     newsDetail();
//   }
// }

// //window.addEventListener("hashchange", newsDetail);
// window.addEventListener("hashchange", router);

// router();
