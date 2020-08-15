function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),e}(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{EFyh:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var o=n("YMfE"),i=n("XNiG"),r=n("fXoL"),a=function(){var e=function(){function e(){_classCallCheck(this,e),this.login$=new i.a,this.loadGoogleApi()}return _createClass(e,[{key:"initClient",value:function(e){var t=this,n=e.scope,o=void 0===n?"":n,i=e.apiKey,r=void 0===i?"":i,a=e.clientId,c=void 0===a?"":a,l=e.discoveryDocs,u=void 0===l?[""]:l;return gapi?gapi.client.init({apiKey:r,clientId:c,scope:o,discoveryDocs:u}).then((function(){t.googleAuth=gapi.auth2.getAuthInstance(),t.googleAuth.isSignedIn.listen((function(e){return t.updateSigninStatus(e)}))}),(function(e){return Promise.reject(e)})):Promise.reject("Google Api not available.")}},{key:"updateSigninStatus",value:function(e){console.log("Logged in : ".concat(e)),this.login$.next(e)}},{key:"loadGoogleApi",value:function(){var e=this,t=document.createElement("script");t.addEventListener("load",(function(){return e.googleApiDidLoad()})),t.setAttribute("src","https://apis.google.com/js/api.js"),document.body.appendChild(t)}},{key:"isLoggedIn",value:function(e){var t=e.forScope,n=void 0===t?"":t;return!!this.googleAuth&&this.googleAuth.currentUser.get().hasGrantedScopes(n)}},{key:"getUserInfo",value:function(){if(this.googleAuth&&this.googleAuth.currentUser){var e=this.googleAuth.currentUser.get().getBasicProfile();return{avatar:e.getImageUrl(),name:e.getName(),email:e.getEmail(),shortName:e.getFamilyName()}}}},{key:"googleApiDidLoad",value:function(){gapi.load("client:auth2",(function(){console.log("Google auth loaded.")}))}},{key:"throwDeferedError",value:function(e){var t=this;o.b((function(){t.login$.error(e)}))}},{key:"login",value:function(e){var t=this,n=e.scope,o=void 0===n?"":n,i=e.key,r=void 0===i?"":i,a=e.clientId,c=void 0===a?"":a,l=e.discoveryDocs,u=void 0===l?[""]:l;return this.initClient({scope:o,apiKey:r,clientId:c,discoveryDocs:u}).then((function(e){if(t.googleAuth.isSignedIn.get())t.login$.next(!0);else{var n=new gapi.auth2.SigninOptionsBuilder;n.setPrompt("select_account"),n.setScope("profile").setScope("email"),t.googleAuth.signIn(n).catch((function(e){t.throwDeferedError(e)}))}})).catch((function(e){t.login$.error(e)})),this.login$}},{key:"logout",value:function(){var e=this;return this.googleAuth?this.googleAuth.isSignedIn.get()?this.googleAuth.signOut().catch((function(t){e.throwDeferedError("logout failed")})):o.b((function(){return e.login$.next(!1)})):this.throwDeferedError("Google Auth was not loaded."),this.login$}}]),e}();return e.\u0275fac=function(t){return new(t||e)},e.\u0275prov=r.Ib({token:e,factory:e.\u0275fac,providedIn:"root"}),e}()},YMfE:function(e,t,n){"use strict";function o(e,t){for(var n=new e,o=0,i=Object.keys(t);o<i.length;o++){var r=i[o];n[r]=t[r]}return n}n.d(t,"a",(function(){return o})),n.d(t,"b",(function(){return i}));var i=function(e){window.setTimeout(e,0)}},tLnd:function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));var o,i=n("SxV6"),r=n("fXoL"),a=n("EFyh"),c=((o=function(){function e(t){_classCallCheck(this,e),this.loginService=t,this.loginOptions={key:"AIzaSyDoqtuscz4Pp_xuR9nYO10O-PsouptHmuA",clientId:"814240394039-953g9k1ovucedj8u0aghsj5ofsii5jut.apps.googleusercontent.com",scope:"https://www.googleapis.com/auth/drive.appdata",discoveryDocs:["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]}}return _createClass(e,[{key:"createBaseFolder",value:function(e){var t=this;return this.loadGoogleDrive().then((function(){return t.createFolderInternal({name:e})}))}},{key:"isLoggedIn",value:function(){return this.loginService.isLoggedIn({forScope:this.loginOptions.scope})}},{key:"findFile",value:function(e){var t=e.id;return this.loadGoogleDrive().then((function(){return gapi.client.drive.files.list({q:"'".concat(t,"' in parents"),fields:"nextPageToken, files(id, name)",spaces:"drive"}).then((function(e){return 200===e.status})).catch((function(){return!1}))}))}},{key:"login",value:function(){return this.loadGoogleDrive()}},{key:"loadGoogleDrive",value:function(){var e=this;return new Promise((function(t,n){e.loginService.isLoggedIn({forScope:e.loginOptions.scope})?e.loadApi().then(t).catch(n):e.loginService.login(e.loginOptions).pipe(Object(i.a)()).subscribe((function(o){o?e.loadApi().then(t).catch(n):n()}))}))}},{key:"loadApi",value:function(){return gapi&&gapi.client.drive?Promise.resolve():gapi.client.load("drive","v3")}},{key:"createFolderInternal",value:function(e){var t=e.name,n={name:void 0===t?"Speecher-Data-Folder":t,mimeType:"application/vnd.google-apps.folder",folderColorRgb:"#007bff"};return console.log("Logged in and trying to create folder in drive."),new Promise((function(e,t){gapi.client.drive.files.create({resource:n,fields:"id"}).then((function(n){switch(n.status){case 200:var o=n.result;console.log("Created file or folder Id: ",o.id),e({id:o.id});break;default:console.log("Error creating the file or folder, "+n),t(n)}}))}))}},{key:"logout",value:function(){return this.loginService.logout()}},{key:"createFile",value:function(e){var t=e.name,n=e.withContent,o=e.folderId;return this.createFileWithJSONContent({name:t,data:JSON.stringify(n),folderId:o})}},{key:"createFileWithJSONContent",value:function(e){var t=e.name,n=e.data,o=e.folderId;return new Promise((function(e,i){var r="\r\n---------speecher-boundary\r\n",a=r+"Content-Type: application/json\r\n\r\n"+JSON.stringify({name:t,mimeType:"application/json",parents:[o]})+r+"Content-Type: application/json\r\n\r\n"+n+"\r\n---------speecher-boundary--";gapi.client.request({path:"/upload/drive/v3/files",method:"POST",params:{uploadType:"multipart"},headers:{"Content-Type":'multipart/related; boundary="-------speecher-boundary"'},body:a}).execute((function(t,n){if(200!==n.status)return i();e()}))}))}}]),e}()).\u0275fac=function(e){return new(e||o)(r.Zb(a.a))},o.\u0275prov=r.Ib({token:o,factory:o.\u0275fac,providedIn:"root"}),o)}}]);
//# sourceMappingURL=common-es5.f22af7ec09741ba1b351.js.map