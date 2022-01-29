const ajax = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
ajax.open("GET", NEWS_URL, false);
ajax.send();

// 응답 값을 객체로(json이라서 가능)
const newsFeed = JSON.parse(ajax.response);

console.log(newsFeed);
const ul = document.createElement("ul");
document.getElementById("root").appendChild(ul);
for (let i = 0; i < newsFeed.length; ++i) {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.innerHTML = newsFeed[i].title;
    
    li.appendChild(a);    
    ul.appendChild(li);
}
document.getElementById("root").appendChild(ul);