import { html } from "./util";

export const indexPage = html(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans"
          media="screen"
          rel="stylesheet"
          type="text/css"
        />
        <title>Shorterlinks - Create</title>
        <style>
        .center {
          margin: auto;
          text-align: center;
        }
        
        .header {
          font-size: 25px;
          font-weight: bold;
        }
        
        input {
          border: 1px solid #6200ee;
          border-radius: 20px;
          outline: none;
          width: 50%;
          padding: 8px;
          display: block;
          margin: auto;
          margin-top: 10px;
        }
        
        #btn_s:hover,
        #btn_s:active {
          box-shadow: 2px 2px #d9dce0;
          background-color: #6200ee;
          color: #fff;
        }
        
        #errors {
          color: #ff0000;
          font-weight: bold;
        }
        
        #btn_s {
          background-color: #fff;
          border-radius: 5px;
          padding: 4px;
          border: 1px solid #6200ee;
          outline: none;
          color: #6200ee;
          text-transform: uppercase;
          min-width: 80px;
          height: 30px;
          cursor: pointer;
          display: block;
          margin: auto;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        </style>
      </head>
    
      <body>
        <div class="center">
          <div class="main">
            <div class="header">Shorten a URL</div>
            <div id="errors"></div>
            <input id="input_n" type="text" />
            <input
              id="request"
              placeholder="custom link (May not be available)"
            />
            <button id="btn_s">Shorten!</button>
          </div>
          <div id="rules">
            The URL should be a completely valid URL (it should start with a
            protocol like http)
          </div>
          <div id="result"></div>
        </div>
        <script>
        (()=>{const e=document.getElementById("input_n"),t=document.getElementById("request"),n=document.getElementById("btn_s"),o=document.getElementById("errors"),c=document.getElementById("result");e.onkeydown=t.onkeydown=e=>{13===e.keyCode&&n.click()},n.onclick=async()=>{o.innerHTML="";const t=e.value;if(0===t.length||!function(e){try{return!!new URL(e)}catch(e){return!1}}(t))return o.textContent="An Error Occured..please check the URL";{const e=(n={url:t,request:request.value.trim()},"".concat(Object.keys(n).map((e=>"".concat(encodeURIComponent(e),"=").concat(encodeURIComponent(n[e])))).join("&")));o.textContent="loading";const d=await fetch("/api/",{credentials:"include",method:"post",headers:{"content-type":"application/x-www-form-urlencoded"},body:e}),r=await d.json();o.textContent="",r.error&&(c.textContent="An Error Occured..please check your input");const a=document.createElement("a");a.href=r.data,a.textContent=r.data;const u=document.createElement("div");u.appendChild(document.createTextNode("Shortend URL: ")),u.appendChild(a),c.appendChild(u)}var n}})();
        </script>
      </body>
    </html>`);
