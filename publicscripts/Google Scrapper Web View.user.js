// ==UserScript==
// @name         Google Scrapper Web View
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
        let str = "";
        let pageNum = document.querySelectorAll('[aria-label="Local results pagination"]')[0].querySelectorAll(".YyVfkd ")[0].innerText;
        let indexNum = 1;
        // Entry container
        let entries = document.querySelectorAll('.uMdZh');
        entries.forEach(x=>{
            let isSponsored = x.parentElement.getAttribute("data-is-ad") == 1;
            let SNum = pageNum + "." + indexNum;
            let entryLinks = x.querySelectorAll('a[aria-describedby]');
            let entryLink = "NA";
            let entryName = x.querySelectorAll('[role=heading]')[0].innerText;

            if(!isSponsored){

                // Website link
                entryLinks.forEach(y=>{
                    if(!y.getAttribute("data-url")){
                        //console.log("this is it" + y.getAttribute("href"));
                        entryLink = "[Link](" + y.getAttribute("href") + ")";
                    }
                });
                str += "- " + SNum + "  -  " + entryName + "  -  " + entryLink + "\n";
                indexNum++;
            }
        });
        await navigator.clipboard.writeText(str);
        alert("copied");
    }

    // trigger button
    let btn = document.createElement("button");
    btn.innerText = "Click Me Web";
    btn.style.cssText = "color:white; background-color: blue; padding: 20px";
    document.body.appendChild(btn);

    btn.addEventListener("click", extractData);
})();