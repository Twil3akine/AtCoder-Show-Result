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

const GREEN = "#5cb85c";
const YELLOW = "#f0ad4e";

const getResult = async (url) => {
    const formatInfo = (cells) => {
        const name = cells[1].querySelector("a").textContent.trim().split(" ")[0];
        const lang = cells[3].querySelector("a").textContent.trim();
        const result = cells[6].querySelector("span").textContent.trim();

        return {
            name: name,
            lang: lang,
            result: result,
        }
    }

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

                contents.push(formatInfo(cells));
            });
        } catch (e) {
            console.error(`Error fetching the page: ${e}`);
            return [];
        }
    }
}

const getQuestions = () => {
    const questions = [""];
    const trs = document.querySelectorAll("tr");
    trs.forEach((tr, idx) => {
        if (idx === 0) return;
        let questName = tr.querySelector("td").querySelector("a").textContent.trim();
        questions.push(questName);
    })
    return questions;
}

const adaptResult = (questions, results) => {
    results.reverse().forEach(result => {
        questions.index(result.name).style.backgroundColor = (result.result === "AC") ? GREEN : YELLOW;
    })
}

const app = () => {
    const currentURL = window.location.href;
    // const currentURL = "https://atcoder.jp/contests/tessoku-book/tasks";
    const fetchPage = currentURL.replace("tasks", "submissions/me");
    const results = getResult(fetchPage);
    const questions = getQuestions(currentURL);
    console.log(results);
    console.log(questions);
    adaptResult(questions, results);
}

app();