const container = document.getElementById("root");
const ajax = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
const content = document.createElement("div");

function getData(url) {
    ajax.open("GET", url, false);
    ajax.send();

    return JSON.parse(ajax.response);
}

const newsFeed = getData(NEWS_URL);

window.addEventListener("hashchange", ()=>{
    const id = location.hash.substring(1);
    const contentUrl = CONTENT_URL.replace("@id", id);

    const newsContent = getData(contentUrl);

    const h1 = document.createElement("h1");
    //console.log(newsContent.title);
    h1.innerText = newsContent.title;
    content.appendChild(h1);
});

const ul = document.createElement("ul");
for (let i = 0; i < newsFeed.length; ++i) {
    const div = document.createElement("div");    
    div.innerHTML = `
        <li>
            <a href="#${newsFeed[i].id}">
                ${newsFeed[i].title} (${newsFeed[i].comments_count})
            </a>
        </li>
    `;
    //ul.appendChild(div.children[0]);    
    ul.appendChild(div.firstElementChild);
}
container.appendChild(ul);
container.appendChild(content);