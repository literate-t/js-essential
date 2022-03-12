import Router from "./core/router";
import { NewsDetailView, NewsFeedView } from "./page";
import Store from "./store";

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


const store = new Store();
const router: Router = new Router();
const newsFeedView = new NewsFeedView('#root', store);
const newsDetailView = new NewsDetailView('#root', store);

router.setDefaultPage(newsFeedView);
router.addRoutePath('/page/', newsFeedView);
router.addRoutePath('/show/', newsDetailView);

router.route();