const container = document.getElementById("root");
const ajax = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
const content = document.createElement("div");
const ul = document.createElement("ul");

const SHOW_LIST = 10;

const store = {
    currentPage: 1
}

function newsFeed() {
    const newsFeed = getData(NEWS_URL);    
    const newFeedLength = newsFeed.length;
    const maximumPage = Math.ceil(newFeedLength / SHOW_LIST);
    const newsList = [];
    newsList.push("<ul>");
    let current = store.currentPage * SHOW_LIST;
    if (current >=  newFeedLength) {
        current = newFeedLength;
    }
    for (let i = (store.currentPage - 1) * SHOW_LIST; i < current; ++i) {
        newsList.push(`
            <li>
                <a href="#/show/${newsFeed[i].id}">
                    ${newsFeed[i].title} (${newsFeed[i].comments_count})
                </a>
            </li>
        `);
        //ul.appendChild(div.children[0]);    
        //ul.appendChild(div.firstElementChild);
    }
    newsList.push("</ul>");
    newsList.push(`
        <div>
            <a href="#/page/${store.currentPage > 1 ? store.currentPage - 1 : 1}">이전 페이지</a>
            <a href="#/page/${store.currentPage < maximumPage ? store.currentPage + 1 :maximumPage}">다음 페이지</a>
        </div>
    `);
    container.innerHTML = newsList.join("");
}

function newsDetail() {
    const id = location.hash.substring(7);
    const contentUrl = CONTENT_URL.replace("@id", id);

    const newsContent = getData(contentUrl);
    const title = document.createElement("h1");
    container.innerHTML = `
        <h1>${newsContent.title}</h1>
        <div>
            <a href="#/page/${store.currentPage}">목록으로</a>
        </div>
    `;
    // title.innerText = newsContent.title;
    // content.appendChild(title);
}

function getData(url) {
    ajax.open("GET", url, false);
    ajax.send();

    return JSON.parse(ajax.response);
}

function router() {
    const routePath = location.hash;    
    if (routePath === '') {
        newsFeed();
    } else if (routePath.indexOf("#/page/") >= 0){
        store.currentPage = Number(routePath.substring(7));
        newsFeed();
    } else {
        newsDetail();
    }
}

//window.addEventListener("hashchange", newsDetail);
window.addEventListener("hashchange", router);

router();