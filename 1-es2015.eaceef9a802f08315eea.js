(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{Ig2y:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var r=n("fXoL");let o=(()=>{class e{constructor(){}get today(){const e=new Date;let t=e.getDate(),n=e.getMonth()+1;return t<10&&(t="0"+t),n<10&&(n="0"+n),`${t}-${n}-${""+e.getFullYear()}`}get now(){const e=new Date;return`${e.getHours()}:${e.getMinutes()}:${e.getSeconds()}`}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275prov=r.Ib({token:e,factory:e.\u0275fac,providedIn:"root"}),e})()},MtBC:function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));var r=n("mrSG"),o=n("oAJy"),i=n("fXoL"),a=n("Ig2y");let u=(()=>{class e{constructor(e){this.dateService=e,this.stores={};const t=c.allNames();for(const n of t)this.stores[n]=this.createDb(n)}createDb(e){return o.createInstance({name:"speecher-db",driver:o.INDEXEDDB,storeName:e})}storeOf(e){return this.stores[e.storeName]}store(e,t,n){return this.storeOf(n).setItem(t,e)}storeTodaysNote(e){return this.store(e,this.dateService.today,c.note)}todaysNote(){return this.storeOf(c.note).getItem(this.dateService.today)}allNotes(){return Object(r.a)(this,void 0,void 0,(function*(){const e=this.storeOf(c.note),t=yield e.keys(),n=[];for(const r of t)n.push(yield e.getItem(r));return n}))}}return e.\u0275fac=function(t){return new(t||e)(i.Zb(a.a))},e.\u0275prov=i.Ib({token:e,factory:e.\u0275fac,providedIn:"root"}),e})(),c=(()=>{class e{constructor(e,t){this.val=-1,this.name="",this.val=e,this.name=t}static allNames(){return[e.note.storeName,e.story.storeName,e.words.storeName]}get storeName(){return this.name}}return e.note=new e(0,"speecher-note"),e.story=new e(1,"speecher-story"),e.words=new e(2,"speecher-words"),e})()},mrSG:function(e,t,n){"use strict";function r(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{c(r.next(e))}catch(t){i(t)}}function u(e){try{c(r.throw(e))}catch(t){i(t)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,u)}c((r=r.apply(e,t||[])).next())}))}n.d(t,"a",(function(){return r}))},oAJy:function(e,t,n){e.exports=function e(t,n,r){function o(a,u){if(!n[a]){if(!t[a]){if(i)return i(a,!0);var c=new Error("Cannot find module '"+a+"'");throw c.code="MODULE_NOT_FOUND",c}var f=n[a]={exports:{}};t[a][0].call(f.exports,(function(e){return o(t[a][1][e]||e)}),f,f.exports,e,t,n,r)}return n[a].exports}for(var i=!1,a=0;a<r.length;a++)o(r[a]);return o}({1:[function(e,t,n){(function(e){"use strict";var n,r,o=e.MutationObserver||e.WebKitMutationObserver;if(o){var i=0,a=new o(s),u=e.document.createTextNode("");a.observe(u,{characterData:!0}),n=function(){u.data=i=++i%2}}else if(e.setImmediate||void 0===e.MessageChannel)n="document"in e&&"onreadystatechange"in e.document.createElement("script")?function(){var t=e.document.createElement("script");t.onreadystatechange=function(){s(),t.onreadystatechange=null,t.parentNode.removeChild(t),t=null},e.document.documentElement.appendChild(t)}:function(){setTimeout(s,0)};else{var c=new e.MessageChannel;c.port1.onmessage=s,n=function(){c.port2.postMessage(0)}}var f=[];function s(){var e,t;r=!0;for(var n=f.length;n;){for(t=f,f=[],e=-1;++e<n;)t[e]();n=f.length}r=!1}t.exports=function(e){1!==f.push(e)||r||n()}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],2:[function(e,t,n){"use strict";var r=e(1);function o(){}var i={},a=["REJECTED"],u=["FULFILLED"],c=["PENDING"];function f(e){if("function"!=typeof e)throw new TypeError("resolver must be a function");this.state=c,this.queue=[],this.outcome=void 0,e!==o&&v(this,e)}function s(e,t,n){this.promise=e,"function"==typeof t&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),"function"==typeof n&&(this.onRejected=n,this.callRejected=this.otherCallRejected)}function l(e,t,n){r((function(){var r;try{r=t(n)}catch(o){return i.reject(e,o)}r===e?i.reject(e,new TypeError("Cannot resolve promise with itself")):i.resolve(e,r)}))}function d(e){var t=e&&e.then;if(e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof t)return function(){t.apply(e,arguments)}}function v(e,t){var n=!1;function r(t){n||(n=!0,i.reject(e,t))}function o(t){n||(n=!0,i.resolve(e,t))}var a=h((function(){t(o,r)}));"error"===a.status&&r(a.value)}function h(e,t){var n={};try{n.value=e(t),n.status="success"}catch(r){n.status="error",n.value=r}return n}t.exports=f,f.prototype.catch=function(e){return this.then(null,e)},f.prototype.then=function(e,t){if("function"!=typeof e&&this.state===u||"function"!=typeof t&&this.state===a)return this;var n=new this.constructor(o);return this.state!==c?l(n,this.state===u?e:t,this.outcome):this.queue.push(new s(n,e,t)),n},s.prototype.callFulfilled=function(e){i.resolve(this.promise,e)},s.prototype.otherCallFulfilled=function(e){l(this.promise,this.onFulfilled,e)},s.prototype.callRejected=function(e){i.reject(this.promise,e)},s.prototype.otherCallRejected=function(e){l(this.promise,this.onRejected,e)},i.resolve=function(e,t){var n=h(d,t);if("error"===n.status)return i.reject(e,n.value);var r=n.value;if(r)v(e,r);else{e.state=u,e.outcome=t;for(var o=-1,a=e.queue.length;++o<a;)e.queue[o].callFulfilled(t)}return e},i.reject=function(e,t){e.state=a,e.outcome=t;for(var n=-1,r=e.queue.length;++n<r;)e.queue[n].callRejected(t);return e},f.resolve=function(e){return e instanceof this?e:i.resolve(new this(o),e)},f.reject=function(e){var t=new this(o);return i.reject(t,e)},f.all=function(e){var t=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var n=e.length,r=!1;if(!n)return this.resolve([]);for(var a=new Array(n),u=0,c=-1,f=new this(o);++c<n;)s(e[c],c);return f;function s(e,o){t.resolve(e).then((function(e){a[o]=e,++u!==n||r||(r=!0,i.resolve(f,a))}),(function(e){r||(r=!0,i.reject(f,e))}))}},f.race=function(e){if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var t=e.length,n=!1;if(!t)return this.resolve([]);for(var r=-1,a=new this(o);++r<t;)this.resolve(e[r]).then((function(e){n||(n=!0,i.resolve(a,e))}),(function(e){n||(n=!0,i.reject(a,e))}));return a}},{1:1}],3:[function(e,t,n){(function(t){"use strict";"function"!=typeof t.Promise&&(t.Promise=e(2))}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{2:2}],4:[function(e,t,n){"use strict";var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o=function(){try{if("undefined"!=typeof indexedDB)return indexedDB;if("undefined"!=typeof webkitIndexedDB)return webkitIndexedDB;if("undefined"!=typeof mozIndexedDB)return mozIndexedDB;if("undefined"!=typeof OIndexedDB)return OIndexedDB;if("undefined"!=typeof msIndexedDB)return msIndexedDB}catch(e){return}}();function i(e,t){e=e||[],t=t||{};try{return new Blob(e,t)}catch(o){if("TypeError"!==o.name)throw o;for(var n=new("undefined"!=typeof BlobBuilder?BlobBuilder:"undefined"!=typeof MSBlobBuilder?MSBlobBuilder:"undefined"!=typeof MozBlobBuilder?MozBlobBuilder:WebKitBlobBuilder),r=0;r<e.length;r+=1)n.append(e[r]);return n.getBlob(t.type)}}"undefined"==typeof Promise&&e(3);var a=Promise;function u(e,t){t&&e.then((function(e){t(null,e)}),(function(e){t(e)}))}function c(e,t,n){"function"==typeof t&&e.then(t),"function"==typeof n&&e.catch(n)}function f(e){return"string"!=typeof e&&(console.warn(e+" used as a key, but it is not a string."),e=String(e)),e}function s(){if(arguments.length&&"function"==typeof arguments[arguments.length-1])return arguments[arguments.length-1]}var l=void 0,d={},v=Object.prototype.toString;function h(e){var t=d[e.name],n={};n.promise=new a((function(e,t){n.resolve=e,n.reject=t})),t.deferredOperations.push(n),t.dbReady=t.dbReady?t.dbReady.then((function(){return n.promise})):n.promise}function y(e){var t=d[e.name].deferredOperations.pop();if(t)return t.resolve(),t.promise}function p(e,t){var n=d[e.name].deferredOperations.pop();if(n)return n.reject(t),n.promise}function b(e,t){return new a((function(n,r){if(d[e.name]=d[e.name]||{forages:[],db:null,dbReady:null,deferredOperations:[]},e.db){if(!t)return n(e.db);h(e),e.db.close()}var i=[e.name];t&&i.push(e.version);var a=o.open.apply(o,i);t&&(a.onupgradeneeded=function(t){var n=a.result;try{n.createObjectStore(e.storeName),t.oldVersion<=1&&n.createObjectStore("local-forage-detect-blob-support")}catch(r){if("ConstraintError"!==r.name)throw r;console.warn('The database "'+e.name+'" has been upgraded from version '+t.oldVersion+" to version "+t.newVersion+', but the storage "'+e.storeName+'" already exists.')}}),a.onerror=function(e){e.preventDefault(),r(a.error)},a.onsuccess=function(){n(a.result),y(e)}}))}function m(e){return b(e,!1)}function g(e){return b(e,!0)}function _(e,t){if(!e.db)return!0;var n=!e.db.objectStoreNames.contains(e.storeName),r=e.version>e.db.version;if(e.version<e.db.version&&(e.version!==t&&console.warn('The database "'+e.name+"\" can't be downgraded from version "+e.db.version+" to version "+e.version+"."),e.version=e.db.version),r||n){if(n){var o=e.db.version+1;o>e.version&&(e.version=o)}return!0}return!1}function w(e){return i([function(e){for(var t=e.length,n=new ArrayBuffer(t),r=new Uint8Array(n),o=0;o<t;o++)r[o]=e.charCodeAt(o);return n}(atob(e.data))],{type:e.type})}function I(e){return e&&e.__local_forage_encoded_blob}function S(e){var t=this,n=t._initReady().then((function(){var e=d[t._dbInfo.name];if(e&&e.dbReady)return e.dbReady}));return c(n,e,e),n}function E(e,t,n,r){void 0===r&&(r=1);try{var o=e.db.transaction(e.storeName,t);n(null,o)}catch(i){if(r>0&&(!e.db||"InvalidStateError"===i.name||"NotFoundError"===i.name))return a.resolve().then((function(){if(!e.db||"NotFoundError"===i.name&&!e.db.objectStoreNames.contains(e.storeName)&&e.version<=e.db.version)return e.db&&(e.version=e.db.version+1),g(e)})).then((function(){return function(e){h(e);for(var t=d[e.name],n=t.forages,r=0;r<n.length;r++){var o=n[r];o._dbInfo.db&&(o._dbInfo.db.close(),o._dbInfo.db=null)}return e.db=null,m(e).then((function(t){return e.db=t,_(e)?g(e):t})).then((function(r){e.db=t.db=r;for(var o=0;o<n.length;o++)n[o]._dbInfo.db=r})).catch((function(t){throw p(e,t),t}))}(e).then((function(){E(e,t,n,r-1)}))})).catch(n);n(i)}}var N={_driver:"asyncStorage",_initStorage:function(e){var t=this,n={db:null};if(e)for(var r in e)n[r]=e[r];var o=d[n.name];o||(d[n.name]=o={forages:[],db:null,dbReady:null,deferredOperations:[]}),o.forages.push(t),t._initReady||(t._initReady=t.ready,t.ready=S);var i=[];function u(){return a.resolve()}for(var c=0;c<o.forages.length;c++){var f=o.forages[c];f!==t&&i.push(f._initReady().catch(u))}var s=o.forages.slice(0);return a.all(i).then((function(){return n.db=o.db,m(n)})).then((function(e){return n.db=e,_(n,t._defaultConfig.version)?g(n):e})).then((function(e){n.db=o.db=e,t._dbInfo=n;for(var r=0;r<s.length;r++){var i=s[r];i!==t&&(i._dbInfo.db=n.db,i._dbInfo.version=n.version)}}))},_support:function(){try{if(!o||!o.open)return!1;var e="undefined"!=typeof openDatabase&&/(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent)&&!/Chrome/.test(navigator.userAgent)&&!/BlackBerry/.test(navigator.platform),t="function"==typeof fetch&&-1!==fetch.toString().indexOf("[native code");return(!e||t)&&"undefined"!=typeof indexedDB&&"undefined"!=typeof IDBKeyRange}catch(n){return!1}}(),iterate:function(e,t){var n=this,r=new a((function(t,r){n.ready().then((function(){E(n._dbInfo,"readonly",(function(o,i){if(o)return r(o);try{var a=i.objectStore(n._dbInfo.storeName).openCursor(),u=1;a.onsuccess=function(){var n=a.result;if(n){var r=n.value;I(r)&&(r=w(r));var o=e(r,n.key,u++);void 0!==o?t(o):n.continue()}else t()},a.onerror=function(){r(a.error)}}catch(c){r(c)}}))})).catch(r)}));return u(r,t),r},getItem:function(e,t){var n=this;e=f(e);var r=new a((function(t,r){n.ready().then((function(){E(n._dbInfo,"readonly",(function(o,i){if(o)return r(o);try{var a=i.objectStore(n._dbInfo.storeName).get(e);a.onsuccess=function(){var e=a.result;void 0===e&&(e=null),I(e)&&(e=w(e)),t(e)},a.onerror=function(){r(a.error)}}catch(u){r(u)}}))})).catch(r)}));return u(r,t),r},setItem:function(e,t,n){var r=this;e=f(e);var o=new a((function(n,o){var u;r.ready().then((function(){return u=r._dbInfo,"[object Blob]"===v.call(t)?function(e){return"boolean"==typeof l?a.resolve(l):function(e){return new a((function(t){var n=e.transaction("local-forage-detect-blob-support","readwrite"),r=i([""]);n.objectStore("local-forage-detect-blob-support").put(r,"key"),n.onabort=function(e){e.preventDefault(),e.stopPropagation(),t(!1)},n.oncomplete=function(){var e=navigator.userAgent.match(/Chrome\/(\d+)/),n=navigator.userAgent.match(/Edge\//);t(n||!e||parseInt(e[1],10)>=43)}})).catch((function(){return!1}))}(e).then((function(e){return l=e}))}(u.db).then((function(e){return e?t:(n=t,new a((function(e,t){var r=new FileReader;r.onerror=t,r.onloadend=function(t){var r=btoa(t.target.result||"");e({__local_forage_encoded_blob:!0,data:r,type:n.type})},r.readAsBinaryString(n)})));var n})):t})).then((function(t){E(r._dbInfo,"readwrite",(function(i,a){if(i)return o(i);try{var u=a.objectStore(r._dbInfo.storeName);null===t&&(t=void 0);var c=u.put(t,e);a.oncomplete=function(){void 0===t&&(t=null),n(t)},a.onabort=a.onerror=function(){o(c.error?c.error:c.transaction.error)}}catch(f){o(f)}}))})).catch(o)}));return u(o,n),o},removeItem:function(e,t){var n=this;e=f(e);var r=new a((function(t,r){n.ready().then((function(){E(n._dbInfo,"readwrite",(function(o,i){if(o)return r(o);try{var a=i.objectStore(n._dbInfo.storeName).delete(e);i.oncomplete=function(){t()},i.onerror=function(){r(a.error)},i.onabort=function(){r(a.error?a.error:a.transaction.error)}}catch(u){r(u)}}))})).catch(r)}));return u(r,t),r},clear:function(e){var t=this,n=new a((function(e,n){t.ready().then((function(){E(t._dbInfo,"readwrite",(function(r,o){if(r)return n(r);try{var i=o.objectStore(t._dbInfo.storeName).clear();o.oncomplete=function(){e()},o.onabort=o.onerror=function(){n(i.error?i.error:i.transaction.error)}}catch(a){n(a)}}))})).catch(n)}));return u(n,e),n},length:function(e){var t=this,n=new a((function(e,n){t.ready().then((function(){E(t._dbInfo,"readonly",(function(r,o){if(r)return n(r);try{var i=o.objectStore(t._dbInfo.storeName).count();i.onsuccess=function(){e(i.result)},i.onerror=function(){n(i.error)}}catch(a){n(a)}}))})).catch(n)}));return u(n,e),n},key:function(e,t){var n=this,r=new a((function(t,r){e<0?t(null):n.ready().then((function(){E(n._dbInfo,"readonly",(function(o,i){if(o)return r(o);try{var a=i.objectStore(n._dbInfo.storeName),u=!1,c=a.openKeyCursor();c.onsuccess=function(){var n=c.result;n?0===e||u?t(n.key):(u=!0,n.advance(e)):t(null)},c.onerror=function(){r(c.error)}}catch(f){r(f)}}))})).catch(r)}));return u(r,t),r},keys:function(e){var t=this,n=new a((function(e,n){t.ready().then((function(){E(t._dbInfo,"readonly",(function(r,o){if(r)return n(r);try{var i=o.objectStore(t._dbInfo.storeName).openKeyCursor(),a=[];i.onsuccess=function(){var t=i.result;t?(a.push(t.key),t.continue()):e(a)},i.onerror=function(){n(i.error)}}catch(u){n(u)}}))})).catch(n)}));return u(n,e),n},dropInstance:function(e,t){t=s.apply(this,arguments);var n=this.config();(e="function"!=typeof e&&e||{}).name||(e.name=e.name||n.name,e.storeName=e.storeName||n.storeName);var r,i=this;if(e.name){var c=e.name===n.name&&i._dbInfo.db,f=c?a.resolve(i._dbInfo.db):m(e).then((function(t){var n=d[e.name],r=n.forages;n.db=t;for(var o=0;o<r.length;o++)r[o]._dbInfo.db=t;return t}));r=f.then(e.storeName?function(t){if(t.objectStoreNames.contains(e.storeName)){var n=t.version+1;h(e);var r=d[e.name],i=r.forages;t.close();for(var u=0;u<i.length;u++){var c=i[u];c._dbInfo.db=null,c._dbInfo.version=n}return new a((function(t,r){var i=o.open(e.name,n);i.onerror=function(e){i.result.close(),r(e)},i.onupgradeneeded=function(){i.result.deleteObjectStore(e.storeName)},i.onsuccess=function(){var e=i.result;e.close(),t(e)}})).then((function(e){r.db=e;for(var t=0;t<i.length;t++){var n=i[t];n._dbInfo.db=e,y(n._dbInfo)}})).catch((function(t){throw(p(e,t)||a.resolve()).catch((function(){})),t}))}}:function(t){h(e);var n=d[e.name],r=n.forages;t.close();for(var i=0;i<r.length;i++)r[i]._dbInfo.db=null;return new a((function(t,n){var r=o.deleteDatabase(e.name);r.onerror=r.onblocked=function(e){var t=r.result;t&&t.close(),n(e)},r.onsuccess=function(){var e=r.result;e&&e.close(),t(e)}})).then((function(e){n.db=e;for(var t=0;t<r.length;t++)y(r[t]._dbInfo)})).catch((function(t){throw(p(e,t)||a.resolve()).catch((function(){})),t}))})}else r=a.reject("Invalid arguments");return u(r,t),r}},j="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",D=/^~~local_forage_type~([^~]+)~/,O="__lfsc__:".length,A=O+"arbf".length,R=Object.prototype.toString;function x(e){var t,n,r,o,i,a=.75*e.length,u=e.length,c=0;"="===e[e.length-1]&&(a--,"="===e[e.length-2]&&a--);var f=new ArrayBuffer(a),s=new Uint8Array(f);for(t=0;t<u;t+=4)n=j.indexOf(e[t]),r=j.indexOf(e[t+1]),o=j.indexOf(e[t+2]),i=j.indexOf(e[t+3]),s[c++]=n<<2|r>>4,s[c++]=(15&r)<<4|o>>2,s[c++]=(3&o)<<6|63&i;return f}function k(e){var t,n=new Uint8Array(e),r="";for(t=0;t<n.length;t+=3)r+=j[n[t]>>2],r+=j[(3&n[t])<<4|n[t+1]>>4],r+=j[(15&n[t+1])<<2|n[t+2]>>6],r+=j[63&n[t+2]];return n.length%3==2?r=r.substring(0,r.length-1)+"=":n.length%3==1&&(r=r.substring(0,r.length-2)+"=="),r}var B={serialize:function(e,t){var n="";if(e&&(n=R.call(e)),e&&("[object ArrayBuffer]"===n||e.buffer&&"[object ArrayBuffer]"===R.call(e.buffer))){var r,o="__lfsc__:";e instanceof ArrayBuffer?(r=e,o+="arbf"):(r=e.buffer,"[object Int8Array]"===n?o+="si08":"[object Uint8Array]"===n?o+="ui08":"[object Uint8ClampedArray]"===n?o+="uic8":"[object Int16Array]"===n?o+="si16":"[object Uint16Array]"===n?o+="ur16":"[object Int32Array]"===n?o+="si32":"[object Uint32Array]"===n?o+="ui32":"[object Float32Array]"===n?o+="fl32":"[object Float64Array]"===n?o+="fl64":t(new Error("Failed to get type for BinaryArray"))),t(o+k(r))}else if("[object Blob]"===n){var i=new FileReader;i.onload=function(){var n="~~local_forage_type~"+e.type+"~"+k(this.result);t("__lfsc__:blob"+n)},i.readAsArrayBuffer(e)}else try{t(JSON.stringify(e))}catch(a){console.error("Couldn't convert value into a JSON string: ",e),t(null,a)}},deserialize:function(e){if("__lfsc__:"!==e.substring(0,O))return JSON.parse(e);var t,n=e.substring(A),r=e.substring(O,A);if("blob"===r&&D.test(n)){var o=n.match(D);t=o[1],n=n.substring(o[0].length)}var a=x(n);switch(r){case"arbf":return a;case"blob":return i([a],{type:t});case"si08":return new Int8Array(a);case"ui08":return new Uint8Array(a);case"uic8":return new Uint8ClampedArray(a);case"si16":return new Int16Array(a);case"ur16":return new Uint16Array(a);case"si32":return new Int32Array(a);case"ui32":return new Uint32Array(a);case"fl32":return new Float32Array(a);case"fl64":return new Float64Array(a);default:throw new Error("Unkown type: "+r)}},stringToBuffer:x,bufferToString:k};function C(e,t,n,r){e.executeSql("CREATE TABLE IF NOT EXISTS "+t.storeName+" (id INTEGER PRIMARY KEY, key unique, value)",[],n,r)}function T(e,t,n,r,o,i){e.executeSql(n,r,o,(function(e,a){a.code===a.SYNTAX_ERR?e.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name = ?",[t.storeName],(function(e,u){u.rows.length?i(e,a):C(e,t,(function(){e.executeSql(n,r,o,i)}),i)}),i):i(e,a)}),i)}function F(e,t,n,r){var o=this;e=f(e);var i=new a((function(i,a){o.ready().then((function(){void 0===t&&(t=null);var u=t,c=o._dbInfo;c.serializer.serialize(t,(function(t,f){f?a(f):c.db.transaction((function(n){T(n,c,"INSERT OR REPLACE INTO "+c.storeName+" (key, value) VALUES (?, ?)",[e,t],(function(){i(u)}),(function(e,t){a(t)}))}),(function(t){if(t.code===t.QUOTA_ERR){if(r>0)return void i(F.apply(o,[e,u,n,r-1]));a(t)}}))}))})).catch(a)}));return u(i,n),i}function L(e){return new a((function(t,n){e.transaction((function(r){r.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'",[],(function(n,r){for(var o=[],i=0;i<r.rows.length;i++)o.push(r.rows.item(i).name);t({db:e,storeNames:o})}),(function(e,t){n(t)}))}),(function(e){n(e)}))}))}var M={_driver:"webSQLStorage",_initStorage:function(e){var t=this,n={db:null};if(e)for(var r in e)n[r]="string"!=typeof e[r]?e[r].toString():e[r];var o=new a((function(e,r){try{n.db=openDatabase(n.name,String(n.version),n.description,n.size)}catch(o){return r(o)}n.db.transaction((function(o){C(o,n,(function(){t._dbInfo=n,e()}),(function(e,t){r(t)}))}),r)}));return n.serializer=B,o},_support:"function"==typeof openDatabase,iterate:function(e,t){var n=this,r=new a((function(t,r){n.ready().then((function(){var o=n._dbInfo;o.db.transaction((function(n){T(n,o,"SELECT * FROM "+o.storeName,[],(function(n,r){for(var i=r.rows,a=i.length,u=0;u<a;u++){var c=i.item(u),f=c.value;if(f&&(f=o.serializer.deserialize(f)),void 0!==(f=e(f,c.key,u+1)))return void t(f)}t()}),(function(e,t){r(t)}))}))})).catch(r)}));return u(r,t),r},getItem:function(e,t){var n=this;e=f(e);var r=new a((function(t,r){n.ready().then((function(){var o=n._dbInfo;o.db.transaction((function(n){T(n,o,"SELECT * FROM "+o.storeName+" WHERE key = ? LIMIT 1",[e],(function(e,n){var r=n.rows.length?n.rows.item(0).value:null;r&&(r=o.serializer.deserialize(r)),t(r)}),(function(e,t){r(t)}))}))})).catch(r)}));return u(r,t),r},setItem:function(e,t,n){return F.apply(this,[e,t,n,1])},removeItem:function(e,t){var n=this;e=f(e);var r=new a((function(t,r){n.ready().then((function(){var o=n._dbInfo;o.db.transaction((function(n){T(n,o,"DELETE FROM "+o.storeName+" WHERE key = ?",[e],(function(){t()}),(function(e,t){r(t)}))}))})).catch(r)}));return u(r,t),r},clear:function(e){var t=this,n=new a((function(e,n){t.ready().then((function(){var r=t._dbInfo;r.db.transaction((function(t){T(t,r,"DELETE FROM "+r.storeName,[],(function(){e()}),(function(e,t){n(t)}))}))})).catch(n)}));return u(n,e),n},length:function(e){var t=this,n=new a((function(e,n){t.ready().then((function(){var r=t._dbInfo;r.db.transaction((function(t){T(t,r,"SELECT COUNT(key) as c FROM "+r.storeName,[],(function(t,n){var r=n.rows.item(0).c;e(r)}),(function(e,t){n(t)}))}))})).catch(n)}));return u(n,e),n},key:function(e,t){var n=this,r=new a((function(t,r){n.ready().then((function(){var o=n._dbInfo;o.db.transaction((function(n){T(n,o,"SELECT key FROM "+o.storeName+" WHERE id = ? LIMIT 1",[e+1],(function(e,n){var r=n.rows.length?n.rows.item(0).key:null;t(r)}),(function(e,t){r(t)}))}))})).catch(r)}));return u(r,t),r},keys:function(e){var t=this,n=new a((function(e,n){t.ready().then((function(){var r=t._dbInfo;r.db.transaction((function(t){T(t,r,"SELECT key FROM "+r.storeName,[],(function(t,n){for(var r=[],o=0;o<n.rows.length;o++)r.push(n.rows.item(o).key);e(r)}),(function(e,t){n(t)}))}))})).catch(n)}));return u(n,e),n},dropInstance:function(e,t){t=s.apply(this,arguments);var n=this.config();(e="function"!=typeof e&&e||{}).name||(e.name=e.name||n.name,e.storeName=e.storeName||n.storeName);var r,o=this;return u(r=e.name?new a((function(t){var r;r=e.name===n.name?o._dbInfo.db:openDatabase(e.name,"","",0),t(e.storeName?{db:r,storeNames:[e.storeName]}:L(r))})).then((function(e){return new a((function(t,n){e.db.transaction((function(r){function o(e){return new a((function(t,n){r.executeSql("DROP TABLE IF EXISTS "+e,[],(function(){t()}),(function(e,t){n(t)}))}))}for(var i=[],u=0,c=e.storeNames.length;u<c;u++)i.push(o(e.storeNames[u]));a.all(i).then((function(){t()})).catch((function(e){n(e)}))}),(function(e){n(e)}))}))})):a.reject("Invalid arguments"),t),r}};function z(e,t){var n=e.name+"/";return e.storeName!==t.storeName&&(n+=e.storeName+"/"),n}var P={_driver:"localStorageWrapper",_initStorage:function(e){var t={};if(e)for(var n in e)t[n]=e[n];return t.keyPrefix=z(e,this._defaultConfig),!function(){try{return localStorage.setItem("_localforage_support_test",!0),localStorage.removeItem("_localforage_support_test"),!1}catch(e){return!0}}()||localStorage.length>0?(this._dbInfo=t,t.serializer=B,a.resolve()):a.reject()},_support:function(){try{return"undefined"!=typeof localStorage&&"setItem"in localStorage&&!!localStorage.setItem}catch(e){return!1}}(),iterate:function(e,t){var n=this,r=n.ready().then((function(){for(var t=n._dbInfo,r=t.keyPrefix,o=r.length,i=localStorage.length,a=1,u=0;u<i;u++){var c=localStorage.key(u);if(0===c.indexOf(r)){var f=localStorage.getItem(c);if(f&&(f=t.serializer.deserialize(f)),void 0!==(f=e(f,c.substring(o),a++)))return f}}}));return u(r,t),r},getItem:function(e,t){var n=this;e=f(e);var r=n.ready().then((function(){var t=n._dbInfo,r=localStorage.getItem(t.keyPrefix+e);return r&&(r=t.serializer.deserialize(r)),r}));return u(r,t),r},setItem:function(e,t,n){var r=this;e=f(e);var o=r.ready().then((function(){void 0===t&&(t=null);var n=t;return new a((function(o,i){var a=r._dbInfo;a.serializer.serialize(t,(function(t,r){if(r)i(r);else try{localStorage.setItem(a.keyPrefix+e,t),o(n)}catch(u){"QuotaExceededError"!==u.name&&"NS_ERROR_DOM_QUOTA_REACHED"!==u.name||i(u),i(u)}}))}))}));return u(o,n),o},removeItem:function(e,t){var n=this;e=f(e);var r=n.ready().then((function(){localStorage.removeItem(n._dbInfo.keyPrefix+e)}));return u(r,t),r},clear:function(e){var t=this,n=t.ready().then((function(){for(var e=t._dbInfo.keyPrefix,n=localStorage.length-1;n>=0;n--){var r=localStorage.key(n);0===r.indexOf(e)&&localStorage.removeItem(r)}}));return u(n,e),n},length:function(e){var t=this.keys().then((function(e){return e.length}));return u(t,e),t},key:function(e,t){var n=this,r=n.ready().then((function(){var t,r=n._dbInfo;try{t=localStorage.key(e)}catch(o){t=null}return t&&(t=t.substring(r.keyPrefix.length)),t}));return u(r,t),r},keys:function(e){var t=this,n=t.ready().then((function(){for(var e=t._dbInfo,n=localStorage.length,r=[],o=0;o<n;o++){var i=localStorage.key(o);0===i.indexOf(e.keyPrefix)&&r.push(i.substring(e.keyPrefix.length))}return r}));return u(n,e),n},dropInstance:function(e,t){if(t=s.apply(this,arguments),!(e="function"!=typeof e&&e||{}).name){var n=this.config();e.name=e.name||n.name,e.storeName=e.storeName||n.storeName}var r,o=this;return u(r=e.name?new a((function(t){t(e.storeName?z(e,o._defaultConfig):e.name+"/")})).then((function(e){for(var t=localStorage.length-1;t>=0;t--){var n=localStorage.key(t);0===n.indexOf(e)&&localStorage.removeItem(n)}})):a.reject("Invalid arguments"),t),r}},U=function(e,t){for(var n,r,o=e.length,i=0;i<o;){if((n=e[i])===(r=t)||"number"==typeof n&&"number"==typeof r&&isNaN(n)&&isNaN(r))return!0;i++}return!1},q=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},W={},J={},X={INDEXEDDB:N,WEBSQL:M,LOCALSTORAGE:P},H=[X.INDEXEDDB._driver,X.WEBSQL._driver,X.LOCALSTORAGE._driver],K=["dropInstance"],G=["clear","getItem","iterate","key","keys","length","removeItem","setItem"].concat(K),Q={description:"",driver:H.slice(),name:"localforage",size:4980736,storeName:"keyvaluepairs",version:1};function $(e,t){e[t]=function(){var n=arguments;return e.ready().then((function(){return e[t].apply(e,n)}))}}function V(){for(var e=1;e<arguments.length;e++){var t=arguments[e];if(t)for(var n in t)t.hasOwnProperty(n)&&(arguments[0][n]=q(t[n])?t[n].slice():t[n])}return arguments[0]}var Y=new(function(){function e(t){for(var n in function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),X)if(X.hasOwnProperty(n)){var r=X[n],o=r._driver;this[n]=o,W[o]||this.defineDriver(r)}this._defaultConfig=V({},Q),this._config=V({},this._defaultConfig,t),this._driverSet=null,this._initDriver=null,this._ready=!1,this._dbInfo=null,this._wrapLibraryMethodsWithReady(),this.setDriver(this._config.driver).catch((function(){}))}return e.prototype.config=function(e){if("object"===(void 0===e?"undefined":r(e))){if(this._ready)return new Error("Can't call config() after localforage has been used.");for(var t in e){if("storeName"===t&&(e[t]=e[t].replace(/\W/g,"_")),"version"===t&&"number"!=typeof e[t])return new Error("Database version must be a number.");this._config[t]=e[t]}return!("driver"in e)||!e.driver||this.setDriver(this._config.driver)}return"string"==typeof e?this._config[e]:this._config},e.prototype.defineDriver=function(e,t,n){var r=new a((function(t,n){try{var r=e._driver,o=new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");if(!e._driver)return void n(o);for(var i=G.concat("_initStorage"),c=0,f=i.length;c<f;c++){var s=i[c];if((!U(K,s)||e[s])&&"function"!=typeof e[s])return void n(o)}!function(){for(var t=function(e){return function(){var t=new Error("Method "+e+" is not implemented by the current driver"),n=a.reject(t);return u(n,arguments[arguments.length-1]),n}},n=0,r=K.length;n<r;n++){var o=K[n];e[o]||(e[o]=t(o))}}();var l=function(n){W[r]&&console.info("Redefining LocalForage driver: "+r),W[r]=e,J[r]=n,t()};"_support"in e?e._support&&"function"==typeof e._support?e._support().then(l,n):l(!!e._support):l(!0)}catch(d){n(d)}}));return c(r,t,n),r},e.prototype.driver=function(){return this._driver||null},e.prototype.getDriver=function(e,t,n){var r=W[e]?a.resolve(W[e]):a.reject(new Error("Driver not found."));return c(r,t,n),r},e.prototype.getSerializer=function(e){var t=a.resolve(B);return c(t,e),t},e.prototype.ready=function(e){var t=this,n=t._driverSet.then((function(){return null===t._ready&&(t._ready=t._initDriver()),t._ready}));return c(n,e,e),n},e.prototype.setDriver=function(e,t,n){var r=this;q(e)||(e=[e]);var o=this._getSupportedDrivers(e);function i(){r._config.driver=r.driver()}function u(e){return r._extend(e),i(),r._ready=r._initStorage(r._config),r._ready}var f=null!==this._driverSet?this._driverSet.catch((function(){return a.resolve()})):a.resolve();return this._driverSet=f.then((function(){var e=o[0];return r._dbInfo=null,r._ready=null,r.getDriver(e).then((function(e){r._driver=e._driver,i(),r._wrapLibraryMethodsWithReady(),r._initDriver=function(e){return function(){var t=0;return function n(){for(;t<e.length;){var o=e[t];return t++,r._dbInfo=null,r._ready=null,r.getDriver(o).then(u).catch(n)}i();var c=new Error("No available storage method found.");return r._driverSet=a.reject(c),r._driverSet}()}}(o)}))})).catch((function(){i();var e=new Error("No available storage method found.");return r._driverSet=a.reject(e),r._driverSet})),c(this._driverSet,t,n),this._driverSet},e.prototype.supports=function(e){return!!J[e]},e.prototype._extend=function(e){V(this,e)},e.prototype._getSupportedDrivers=function(e){for(var t=[],n=0,r=e.length;n<r;n++){var o=e[n];this.supports(o)&&t.push(o)}return t},e.prototype._wrapLibraryMethodsWithReady=function(){for(var e=0,t=G.length;e<t;e++)$(this,G[e])},e.prototype.createInstance=function(t){return new e(t)},e}());t.exports=Y},{3:3}]},{},[4])(4)}}]);