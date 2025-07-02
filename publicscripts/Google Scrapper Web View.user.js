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
    let str = "test";
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

    async function sleep(delay){
        return new Promise((resolve) => setTimeout(resolve, delay));
    }
    // Your code here...
    async function extractData(){
        // reset data for "str" variable so it contain new data from new scrape
        str = "";
        // Page number
        let pageNum = document.querySelectorAll('[aria-label="Local results pagination"]')[0].querySelectorAll(".YyVfkd ")[0].innerText;
        // Index for each entry in the page
        let indexNum = 1;
        // Entry container
        let entries = document.querySelectorAll('.uMdZh');
        document.querySelector('#copybtn').style.display = "none";
        // show/reset progress report
        document.querySelector('#progress-element').style.display = "block";
        document.querySelector('#progress-element').innerHTML = "Progressing!"
        // loop through entries
        for( let i = 0; i < entries.length; i++){
            let x = entries[i];
            // do not consider sponsored entries
            let isSponsored = x.parentElement.getAttribute("data-is-ad") == 1;
            // Serial number for entries like a custom index.
            let SNum = pageNum + "." + indexNum;
            // other fields to scrape from search entries
            let entryLinks = x.querySelectorAll('a[aria-describedby]');
            let entryLink = "NA";
            let dirLink = "NA";
            let entryNameEle = x.querySelectorAll('[role=heading]')[0];
            let entryName = entryNameEle.innerText;
            let newDynamicLinkElement = [];
            let appointmentLinkElement = [];
            let fbElement = [];
            let fbLink = "";

            // exempt sponsored entries only
            if(!isSponsored){
                // Website link
                for(let j = 0; j < entryLinks.length; j++){
                    if(!entryLinks[j].getAttribute("data-url")){
                        //console.log("this is it" + y.getAttribute("href"));
                        entryLink = entryLinks[j].getAttribute("href");
                    }else{
                        //dirLink = "[Dir](https://www.google.com" + y.getAttribute("href") + ")";
                    }
                }
                // if Website link is not available click on item, so it load the detail
                if(true || entryLink == "NA"){
                    let detailModal = "NA";
                    // reset detail modal
                    resetElement(detailModalEle());
                    entryNameEle.click();
                    // wait so detail modal data get loaded
                    let counter = 0;
                    // while modal data loading
                    while(detailModal == "NA" && counter <= 25){
                        // look for new modal data
                        try{
                            detailModal = document.querySelectorAll('div[class=yf][data-jiis=up][data-async-type=lcl_akp]')[0].querySelectorAll('h2')[0].innerText;
                            // alert(detailModal);
                        }catch(e){}
                        // keep clicking periodically
                        if(counter > 0 && counter % 10 == 0){
                            entryNameEle.click();
                        }
                        await sleep(200);
                        counter++;
                    }
                    // locate Website link now in new loaded data
                    newDynamicLinkElement = document.querySelectorAll('path[d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-.61.08-1.21.21-1.78L8.99 15v1c0 1.1.9 2 2 2v1.93C7.06 19.43 4 16.07 4 12zm13.89 5.4c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41C17.92 5.77 20 8.65 20 12c0 2.08-.81 3.98-2.11 5.4z"]');
                    appointmentLinkElement = document.querySelectorAll("div[data-attrid='kc:/local:appointment']");
                    fbElement = document.querySelectorAll('[data-attrid="kc:/common/topic:social media presence"] img[src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADFUlEQVR4Ab2XA4ycURSFJ52pbdu27TZOEau2bRtRGaO2g9q2bdva3a8nufXg/cubfLuDO++eh3vmjc9LpOpKQJQSvcRqcUW8E1EG78RVsUb0FqVFwDGs58I1xAJx24qBgyjLZaGoKQJxLZ5bTBfPBHHkmZgh8sS2eDWxV8QIEoB9oobX4o3EFYEXUnYxUnSG5AYphL3+dy5XRRNX8epW3FvhgBUie18oPhwqjIFyo6HIUHstTbeQImqEK57Hlh1cpOhigzebBQt2wdFbcOcFPHkLj9/AzWdw/Ba0nW8rEmI78v5fPJmY7nXmWXrDtC3w+iMRY9AK8HcKOc5M4f9bQE3x1F3c/o9eB9+iAOIs4Jmo9au43/ocImPLWWkc3HsJEA8BxiLh95lrcUvgItDJBg0VMTHw6DXsugzrT8Km09Au9BkwzKzK+sxe+e5l+VPr/9LDhIwdF6HaBMjY0w5o2u5BXRDKMfv4zNu9Hb5MvWDPFYLiwxdoPReSdbS8v3GMu87nve+tt4/dIihuP4diw8yALN8z1ySAt67C5nKQrQ+cuE1QXH0M+QdBoJPlGp5W4L0EEBWpeIYeUHSYzbDyODh3n6C49QxqT7YcOaKwz+izLhExEQTYrGtOgksP4e4La78v3wkKeQL3X5kbCuXByTtQZpSN4RLwNlLbNZgG7z4T6zh7D/IMMNt2bcGVxBCw/pS1omMLrksAaxJDwIxttvwS4GzD3mGMSAOYuRy+YYfvwgP4+JWg+PLNzsnZe5Z3VrSfbxNwXN36SgBlxK3QXWDLmKu/UWIEnLlHUNx4ChXGKqcf5O5vpHd3wJ1fVuwXCyP6gHmBjCi8DxQYBFoxy/XmgouF3+PXsQ2YI5yAJ1BwsBX2flml9t/3Ab+YkYQCZgl/qCvZviQQsF/kDXcvrCGuJqKAa6Km62bcWFxNcAFWvGlwxfArsT8BBRxwzDzsNX2meB4PAc/FLJE3Pj9Oa4pFGvyOBER5EBAl7lifUyvBfiXLVsvkHUifiw9ZB1wX70UM4voT3hcewnUZ0Trl9hVlvBb+AQNcQrB9dXA4AAAAAElFTkSuQmCC"]');

                }
                // if new data contain FB
                if(fbElement.length > 0){
                    fbLink = fbElement[0].closest('a').href;
                }
                // if new data contain some link consider it.
                if(entryLink == "NA" && newDynamicLinkElement.length > 0){
                    entryLink = newDynamicLinkElement[0].closest('a').href;
                    //console.log(entryLink + " - " + entryName);
                }else if(entryLink == "NA" && appointmentLinkElement.length > 0){
                    entryLink = appointmentLinkElement[0].querySelector('a').href;
                }
                // exempt non website results
                if(entryLink != "NA"){
                    // progress report
                    document.querySelector('#progress-element').innerHTML = document.querySelector('#progress-element').innerHTML + "<br>" + "- " + SNum + "  -  " + entryName + "  -  " + entryLink + (fbLink ? "  -  " + fbLink : "");
                    str += "- " + SNum + "  -  " + entryName + "  -  " + entryLink + (fbLink ? "  -  " + fbLink : "") + "\n";
                }
                indexNum++;
            }
        }
        // Copy Scaped data button
        document.querySelector('#copybtn').style.display = "block";
        await sleep(500);
        alert("please copy now!");
        // Hide progress report
        document.querySelector('#progress-element').style.display = "none";
    }
    // copy to clipboard does not work unless user click and generate the event manually
    async function copyToClipboard(){
        await navigator.clipboard.writeText(str);
        alert("copied");
        document.querySelector('#progress-element').style.display = "none";
    }
    function detailModalEle(){
        try{
            return document.querySelectorAll('div[class=yf][data-jiis=up][data-async-type=lcl_akp]')[0];
        }catch(e){}
        return null;
    }
    function resetElement(ele){
        if(ele){
            ele.innerHTML = "";
        }
    }
    // New Elements to generate and embbed in original page
    // scrape trigger button
    let btn = document.createElement("button");
    btn.innerText = "Click Me Web";
    btn.style.cssText = "color:white; background-color: blue; padding: 20px";
    document.body.appendChild(btn);
    btn.addEventListener("click", extractData);
    // copy button
    let copybtn = document.createElement("button");
    copybtn.innerText = "Copy";
    copybtn.setAttribute("id", "copybtn");
    copybtn.style.cssText = "display:none;color:white; background-color: green; padding: 10px";
    document.body.appendChild(copybtn);
    copybtn.addEventListener("click", copyToClipboard);
    // Progress Element
    let progressEle = document.createElement("div");
    progressEle.setAttribute("id", "progress-element");
    progressEle.innerHTML = "Progressing!";
    document.body.appendChild(progressEle);
    progressEle.style.cssText = "overflow: auto; display: none; position: absolute; width: 80%; height: 80%; left: calc(10% - 50px); top: calc(10% - 50px); opacity: 0.7; border-radius: 50px; color: lightgreen; background-color: black; padding: 50px; z-index: 10000";
})();