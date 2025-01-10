// ==UserScript==
// @name         AtCoder Show Result
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  check and show AC
// @author       twil3akine
// @match        https://atcoder.jp/contests/*/tasks
// @grant        none
// ==/UserScript==

'use strict';

const getNameAndResult = async (url) => {
    let count = 0
    let contents = [];
    while (true) {
        try {
            count++;
            const response = await fetch(`${url}?page=${count}`);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            if (doc.querySelector(".panel-body")) {
                return contents;
            }

            const trs = doc.querySelectorAll("tr");

            trs.forEach((tr, idx) => {
                if (idx === 0) return ;
                let cells = tr.querySelectorAll("td");
                const name = cells[1].querySelector("a").textContent.trim().split(" ")[0];
                const lang = cells[3].querySelector("a").textContent.trim();
                const result = cells[6].querySelector("span").textContent.trim();
                contents.push({
                    name: name,
                    lang: lang,
                    result: result,
                });
            });

        } catch (e) {
            console.error(`Error fetching the page: ${e}`);
            return [];
        }
    }
}

const app = () => {
    // const currentURL = window.location.href;
    const currentURL = "https://atcoder.jp/contests/tessoku-book/tasks";
    const fetchPage = currentURL.replace("tasks", "submissions/me");
    const rlt = getNameAndResult(fetchPage);
    console.log(rlt);
}

app();