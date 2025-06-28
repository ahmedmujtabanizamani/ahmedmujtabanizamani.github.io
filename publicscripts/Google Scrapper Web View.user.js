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
    // fix browser view for mobile
    
    let mapEle = document.querySelector("#rhs");
    let mapPoints = document.querySelectorAll('[data-lat]');
    if(mapPoints.length > 0 && mapEle){
      // hide map
      mapEle.style.display = "none";
      // mobile friendly CSS
      document.querySelector("#rcnt").style.cssText = "display:block; min-width: auto; width: 100%";
      document.querySelector("#searchform").style.cssText = "display:block; min-width: auto; width: 100%; overflow: scroll";
      // hide profile pic area
      document.querySelector("#searchform form").nextElementSibling.style.display = "none";

      // Create a new meta element
      var meta = document.createElement('meta');
      // Set the name and content attributes for the viewport meta tag
      meta.setAttribute('name', 'viewport');
      meta.setAttribute('content', 'width=device-width, initial-scale=1;user-scalable=no;user-scalable=0;');
      // Append the meta element to the head section of the document
      document.head.appendChild(meta);
    }
    

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
            let dirLink = "NA";
            let entryName = x.querySelectorAll('[role=heading]')[0].innerText;

            if(!isSponsored){

                // Website link
                entryLinks.forEach(y=>{
                    if(!y.getAttribute("data-url")){
                        //console.log("this is it" + y.getAttribute("href"));
                        entryLink = "[Link](" + y.getAttribute("href") + ")";
                    }else{
                        dirLink = "[Dir](https://www.google.com" + y.getAttribute("href") + ")";
                    }
                });
                str += "- " + SNum + "  -  " + entryName + "  -  " + entryLink + "  -  " + dirLink + "\n";
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