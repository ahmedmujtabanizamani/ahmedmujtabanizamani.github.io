// ==UserScript==
// @name         Google scrapper firefox android tablet
// @namespace    http://tampermonkey.net/
// @version      2025-06-27
// @description  try to take over the world!
// @author       You
// @match        https://www.google.com/search*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    async function extractData(){
        let pageNum = 1;
        let str = "";
        let footerPageEle = document.querySelector('footer').firstElementChild.querySelectorAll('div > div > div > span');
        if(footerPageEle.length > 0){
            pageNum = footerPageEle[0].innerText.match(/[0-9]+$/)[0];
        }
        let indexNum = 1;

        // Entry container
        let entries = document.querySelectorAll('.X7NTVe');
        entries.forEach(x=>{
            let SNum = pageNum + "." + indexNum;
            let entryLinks = "https://www.google.com/search?" + x.firstElementChild.href.match(/q=[^&]*/)[0];
            let entryName = x.querySelector('h3').innerText;
            // Website link
            str += "- " + SNum + "  -  " + entryName + "  -  " + entryLinks + "\n";
            indexNum ++;
        });
        await navigator.clipboard.writeText(str);
        alert('copied');
    }
    // trigger button
    let btn = document.createElement("button");
    btn.innerText = "Click Me Orange";
    btn.style.cssText = "color:white; background-color: orange; padding: 20px";
    document.body.appendChild(btn);

    btn.addEventListener("click", extractData);
})();