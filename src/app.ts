import Router from "./core/router";
import { NewsDetailView, NewsFeedView } from "./page";
// import { Store } from "./types";

// // ts에서 window에 객체 추가하는 방법
// const store: Store = {
//   currentPage: 1,
//   feeds: [],
// };

// declare global {
//   interface Window {
//     store: Store;
//   }
// }

// window.store = store;



const router: Router = new Router();
const newsFeedView = new NewsFeedView('#root');
const newsDetailView = new NewsDetailView('#root');

router.setDefaultPage(newsFeedView);
router.addRoutePath('/page/', newsFeedView);
router.addRoutePath('/show/', newsDetailView);

router.route();