var app=function(){"use strict";function e(){}function n(e){return e()}function t(){return Object.create(null)}function a(e){e.forEach(n)}function i(e){return"function"==typeof e}function l(e,n){return e!=e?n==n:e!==n||e&&"object"==typeof e||"function"==typeof e}function r(e,n){e.appendChild(n)}function s(e,n,t){e.insertBefore(n,t||null)}function o(e){e.parentNode.removeChild(e)}function c(e,n){for(let t=0;t<e.length;t+=1)e[t]&&e[t].d(n)}function u(e){return document.createElement(e)}function d(e){return document.createTextNode(e)}function h(){return d(" ")}function p(){return d("")}function f(e,n,t,a){return e.addEventListener(n,t,a),()=>e.removeEventListener(n,t,a)}function m(e,n,t){null==t?e.removeAttribute(n):e.getAttribute(n)!==t&&e.setAttribute(n,t)}function g(e,n){n=""+n,e.wholeText!==n&&(e.data=n)}function v(e,n){e.value=null==n?"":n}function y(e,n,t,a){e.style.setProperty(n,t,a?"important":"")}function w(e,n,t){e.classList[t?"add":"remove"](n)}class C{constructor(e=null){this.a=e,this.e=this.n=null}m(e,n,t=null){this.e||(this.e=u(n.nodeName),this.t=n,this.h(e)),this.i(t)}h(e){this.e.innerHTML=e,this.n=Array.from(this.e.childNodes)}i(e){for(let n=0;n<this.n.length;n+=1)s(this.t,this.n[n],e)}p(e){this.d(),this.h(e),this.i(this.a)}d(){this.n.forEach(o)}}let b;function $(e){b=e}function x(){const e=function(){if(!b)throw new Error("Function called outside component initialization");return b}();return(n,t)=>{const a=e.$$.callbacks[n];if(a){const i=function(e,n){const t=document.createEvent("CustomEvent");return t.initCustomEvent(e,!1,!1,n),t}(n,t);a.slice().forEach((n=>{n.call(e,i)}))}}}const T=[],k=[],q=[],L=[],R=Promise.resolve();let H=!1;function A(e){q.push(e)}let N=!1;const _=new Set;function O(){if(!N){N=!0;do{for(let e=0;e<T.length;e+=1){const n=T[e];$(n),D(n.$$)}for($(null),T.length=0;k.length;)k.pop()();for(let e=0;e<q.length;e+=1){const n=q[e];_.has(n)||(_.add(n),n())}q.length=0}while(T.length);for(;L.length;)L.pop()();H=!1,N=!1,_.clear()}}function D(e){if(null!==e.fragment){e.update(),a(e.before_update);const n=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,n),e.after_update.forEach(A)}}const E=new Set;let P;function M(e,n){e&&e.i&&(E.delete(e),e.i(n))}function j(e,n,t,a){if(e&&e.o){if(E.has(e))return;E.add(e),P.c.push((()=>{E.delete(e),a&&(t&&e.d(1),a())})),e.o(n)}}function S(e){e&&e.c()}function I(e,t,l,r){const{fragment:s,on_mount:o,on_destroy:c,after_update:u}=e.$$;s&&s.m(t,l),r||A((()=>{const t=o.map(n).filter(i);c?c.push(...t):a(t),e.$$.on_mount=[]})),u.forEach(A)}function z(e,n){const t=e.$$;null!==t.fragment&&(a(t.on_destroy),t.fragment&&t.fragment.d(n),t.on_destroy=t.fragment=null,t.ctx=[])}function U(e,n){-1===e.$$.dirty[0]&&(T.push(e),H||(H=!0,R.then(O)),e.$$.dirty.fill(0)),e.$$.dirty[n/31|0]|=1<<n%31}function F(n,i,l,r,s,c,u=[-1]){const d=b;$(n);const h=n.$$={fragment:null,ctx:null,props:c,update:e,not_equal:s,bound:t(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(d?d.$$.context:i.context||[]),callbacks:t(),dirty:u,skip_bound:!1};let p=!1;if(h.ctx=l?l(n,i.props||{},((e,t,...a)=>{const i=a.length?a[0]:t;return h.ctx&&s(h.ctx[e],h.ctx[e]=i)&&(!h.skip_bound&&h.bound[e]&&h.bound[e](i),p&&U(n,e)),t})):[],h.update(),p=!0,a(h.before_update),h.fragment=!!r&&r(h.ctx),i.target){if(i.hydrate){const e=function(e){return Array.from(e.childNodes)}(i.target);h.fragment&&h.fragment.l(e),e.forEach(o)}else h.fragment&&h.fragment.c();i.intro&&M(n.$$.fragment),I(n,i.target,i.anchor,i.customElement),O()}$(d)}class B{$destroy(){z(this,1),this.$destroy=e}$on(e,n){const t=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return t.push(n),()=>{const e=t.indexOf(n);-1!==e&&t.splice(e,1)}}$set(e){var n;this.$$set&&(n=e,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}var V={},W={};function X(e){return new Function("d","return {"+e.map((function(e,n){return JSON.stringify(e)+": d["+n+'] || ""'})).join(",")+"}")}function Z(e){var n=Object.create(null),t=[];return e.forEach((function(e){for(var a in e)a in n||t.push(n[a]=a)})),t}function K(e,n){var t=e+"",a=t.length;return a<n?new Array(n-a+1).join(0)+t:t}function G(e){var n,t=e.getUTCHours(),a=e.getUTCMinutes(),i=e.getUTCSeconds(),l=e.getUTCMilliseconds();return isNaN(e)?"Invalid Date":((n=e.getUTCFullYear())<0?"-"+K(-n,6):n>9999?"+"+K(n,6):K(n,4))+"-"+K(e.getUTCMonth()+1,2)+"-"+K(e.getUTCDate(),2)+(l?"T"+K(t,2)+":"+K(a,2)+":"+K(i,2)+"."+K(l,3)+"Z":i?"T"+K(t,2)+":"+K(a,2)+":"+K(i,2)+"Z":a||t?"T"+K(t,2)+":"+K(a,2)+"Z":"")}var J=function(e){var n=new RegExp('["'+e+"\n\r]"),t=e.charCodeAt(0);function a(e,n){var a,i=[],l=e.length,r=0,s=0,o=l<=0,c=!1;function u(){if(o)return W;if(c)return c=!1,V;var n,a,i=r;if(34===e.charCodeAt(i)){for(;r++<l&&34!==e.charCodeAt(r)||34===e.charCodeAt(++r););return(n=r)>=l?o=!0:10===(a=e.charCodeAt(r++))?c=!0:13===a&&(c=!0,10===e.charCodeAt(r)&&++r),e.slice(i+1,n-1).replace(/""/g,'"')}for(;r<l;){if(10===(a=e.charCodeAt(n=r++)))c=!0;else if(13===a)c=!0,10===e.charCodeAt(r)&&++r;else if(a!==t)continue;return e.slice(i,n)}return o=!0,e.slice(i,l)}for(10===e.charCodeAt(l-1)&&--l,13===e.charCodeAt(l-1)&&--l;(a=u())!==W;){for(var d=[];a!==V&&a!==W;)d.push(a),a=u();n&&null==(d=n(d,s++))||i.push(d)}return i}function i(n,t){return n.map((function(n){return t.map((function(e){return r(n[e])})).join(e)}))}function l(n){return n.map(r).join(e)}function r(e){return null==e?"":e instanceof Date?G(e):n.test(e+="")?'"'+e.replace(/"/g,'""')+'"':e}return{parse:function(e,n){var t,i,l=a(e,(function(e,a){if(t)return t(e,a-1);i=e,t=n?function(e,n){var t=X(e);return function(a,i){return n(t(a),i,e)}}(e,n):X(e)}));return l.columns=i||[],l},parseRows:a,format:function(n,t){return null==t&&(t=Z(n)),[t.map(r).join(e)].concat(i(n,t)).join("\n")},formatBody:function(e,n){return null==n&&(n=Z(e)),i(e,n).join("\n")},formatRows:function(e){return e.map(l).join("\n")},formatRow:l,formatValue:r}}(",").parse;function Y(e){for(var n in e){var t,a,i=e[n].trim();if(i)if("true"===i)i=!0;else if("false"===i)i=!1;else if("NaN"===i)i=NaN;else if(isNaN(t=+i)){if(!(a=i.match(/^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/)))continue;Q&&a[4]&&!a[7]&&(i=i.replace(/-/g,"/").replace(/T/," ")),i=new Date(i)}else i=t;else i=null;e[n]=i}return e}const Q=new Date("2019-01-01T00:00").getHours()||new Date("2019-07-01T00:00").getHours();const ee="https://raw.githubusercontent.com/theojolliffe/healthindexlads/main/csv/includedHealthAreas.csv",ne="https://raw.githubusercontent.com/ONSvisual/census-data/main/json/place/",te="https://raw.githubusercontent.com/theojolliffe/healthindexlads/main/",ae="https://raw.githubusercontent.com/ONSvisual/census-data/main/json/quantiles/quartiles_",ie={ew:{name:"",pl:""},wd:{name:"Ward",pl:"Wards"},lad:{name:"District",pl:"Districts"},"Upper Tier Local Authority":{name:"Local Authority",pl:"Local Authorities"},rgn:{name:"Region",pl:"Regions"},ctry:{name:"Country",pl:"Countries"}};function le(e,n,t){const a=e.slice();return a[32]=n[t],a[35]=n,a[34]=t,a}function re(e,n,t){const a=e.slice();return a[32]=n[t],a[33]=n,a[34]=t,a}function se(e){let n,t,a,i,l,c,p,v=(e[0]?e[0]:"Select one")+"";return{c(){n=u("a"),t=u("span"),a=d(v),i=h(),l=u("span"),l.textContent=" ",m(t,"class","svelte-qdzmwx"),m(l,"class","button svelte-qdzmwx"),w(l,"search",e[3]),w(l,"down",!e[3]),m(n,"id","toggle"),m(n,"class","svelte-qdzmwx")},m(o,u){s(o,n,u),r(n,t),r(t,a),r(n,i),r(n,l),c||(p=f(n,"click",e[12]),c=!0)},p(e,n){1&n[0]&&v!==(v=(e[0]?e[0]:"Select one")+"")&&g(a,v),8&n[0]&&w(l,"search",e[3]),8&n[0]&&w(l,"down",!e[3])},d(e){e&&o(n),c=!1,p()}}}function oe(e){let n,t,i,l,c,p,v,y,w=e[6][e[1]]+"",C=e[2]&&ce(e);return{c(){n=u("a"),t=u("span"),i=d(w),l=h(),C&&C.c(),c=h(),p=u("span"),p.textContent=" ",m(t,"class","selection svelte-qdzmwx"),m(p,"class","button close svelte-qdzmwx"),m(n,"id","toggle"),m(n,"class","selected svelte-qdzmwx")},m(a,o){s(a,n,o),r(n,t),r(t,i),r(t,l),C&&C.m(t,null),r(n,c),r(n,p),v||(y=[f(p,"click",e[14]),f(n,"click",e[12])],v=!0)},p(e,n){66&n[0]&&w!==(w=e[6][e[1]]+"")&&g(i,w),e[2]?C?C.p(e,n):(C=ce(e),C.c(),C.m(t,null)):C&&(C.d(1),C=null)},d(e){e&&o(n),C&&C.d(),v=!1,a(y)}}}function ce(e){let n,t,a=e[6][e[2]]+"";return{c(){n=u("small"),t=d(a),m(n,"class","svelte-qdzmwx")},m(e,a){s(e,n,a),r(n,t)},p(e,n){68&n[0]&&a!==(a=e[6][e[2]]+"")&&g(t,a)},d(e){e&&o(n)}}}function ue(e){let n,t,i,l,c,d;function p(e,n){return e[4].length<3?fe:e[9][0]&&e[2]?pe:e[9][0]?he:de}let g=p(e),w=g(e);return{c(){n=u("div"),t=u("input"),i=h(),l=u("ul"),w.c(),m(t,"type","text"),m(t,"placeholder",""),m(t,"autocomplete","false"),m(t,"class","svelte-qdzmwx"),m(l,"class","svelte-qdzmwx"),m(n,"id","dropdown"),y(n,"top","0"),m(n,"class","svelte-qdzmwx")},m(a,o){s(a,n,o),r(n,t),v(t,e[4]),e[23](t),r(n,i),r(n,l),w.m(l,null),e[30](n),c||(d=[f(t,"input",e[22]),f(t,"keyup",e[16])],c=!0)},p(e,n){16&n[0]&&t.value!==e[4]&&v(t,e[4]),g===(g=p(e))&&w?w.p(e,n):(w.d(1),w=g(e),w&&(w.c(),w.m(l,null)))},d(t){t&&o(n),e[23](null),w.d(),e[30](null),c=!1,a(d)}}}function de(n){let t;return{c(){t=u("li"),t.textContent="No results",m(t,"class","svelte-qdzmwx")},m(e,n){s(e,t,n)},p:e,d(e){e&&o(t)}}}function he(e){let n,t=e[9],a=[];for(let n=0;n<t.length;n+=1)a[n]=me(le(e,t,n));return{c(){for(let e=0;e<a.length;e+=1)a[e].c();n=p()},m(e,t){for(let n=0;n<a.length;n+=1)a[n].m(e,t);s(e,n,t)},p(e,i){if(11010&i[0]){let l;for(t=e[9],l=0;l<t.length;l+=1){const r=le(e,t,l);a[l]?a[l].p(r,i):(a[l]=me(r),a[l].c(),a[l].m(n.parentNode,n))}for(;l<a.length;l+=1)a[l].d(1);a.length=t.length}},d(e){c(a,e),e&&o(n)}}}function pe(e){let n,t=e[9],a=[];for(let n=0;n<t.length;n+=1)a[n]=ge(re(e,t,n));return{c(){for(let e=0;e<a.length;e+=1)a[e].c();n=p()},m(e,t){for(let n=0;n<a.length;n+=1)a[n].m(e,t);s(e,n,t)},p(e,i){if(11014&i[0]){let l;for(t=e[9],l=0;l<t.length;l+=1){const r=re(e,t,l);a[l]?a[l].p(r,i):(a[l]=ge(r),a[l].c(),a[l].m(n.parentNode,n))}for(;l<a.length;l+=1)a[l].d(1);a.length=t.length}},d(e){c(a,e),e&&o(n)}}}function fe(n){let t;return{c(){t=u("li"),t.textContent="Type a name...",m(t,"class","svelte-qdzmwx")},m(e,n){s(e,t,n)},p:e,d(e){e&&o(t)}}}function me(e){let n,t,i,l,c,p=e[32][e[1]]+"",v=e[34];function y(){return e[27](e[32])}function C(){return e[28](e[34])}const b=()=>e[29](n,v),$=()=>e[29](null,v);return{c(){n=u("li"),t=d(p),i=h(),m(n,"class","svelte-qdzmwx"),w(n,"highlight",e[8]==e[34])},m(e,a){s(e,n,a),r(n,t),r(n,i),b(),l||(c=[f(n,"click",y),f(n,"mouseover",C)],l=!0)},p(a,i){e=a,514&i[0]&&p!==(p=e[32][e[1]]+"")&&g(t,p),v!==e[34]&&($(),v=e[34],b()),256&i[0]&&w(n,"highlight",e[8]==e[34])},d(e){e&&o(n),$(),l=!1,a(c)}}}function ge(e){let n,t,i,l,c,p,v,y,C=e[32][e[1]]+"",b=e[32][e[2]]+"",$=e[34];function x(){return e[24](e[32])}function T(){return e[25](e[34])}const k=()=>e[26](n,$),q=()=>e[26](null,$);return{c(){n=u("li"),t=d(C),i=h(),l=u("small"),c=d(b),p=h(),m(l,"class","svelte-qdzmwx"),m(n,"class","svelte-qdzmwx"),w(n,"highlight",e[8]==e[34])},m(e,a){s(e,n,a),r(n,t),r(n,i),r(n,l),r(l,c),r(n,p),k(),v||(y=[f(n,"click",x),f(n,"mouseover",T)],v=!0)},p(a,i){e=a,514&i[0]&&C!==(C=e[32][e[1]]+"")&&g(t,C),516&i[0]&&b!==(b=e[32][e[2]]+"")&&g(c,b),$!==e[34]&&(q(),$=e[34],k()),256&i[0]&&w(n,"highlight",e[8]==e[34])},d(e){e&&o(n),q(),v=!1,a(y)}}}function ve(n){let t,a,i,l;function c(e,n){return e[6]&&!e[3]?oe:se}let d=c(n),p=d(n),g=n[7]&&ue(n);return{c(){t=u("div"),p.c(),a=h(),g&&g.c(),m(t,"id","select"),m(t,"class","svelte-qdzmwx"),w(t,"active",n[7])},m(e,o){s(e,t,o),p.m(t,null),r(t,a),g&&g.m(t,null),i||(l=f(t,"keydown",n[15]),i=!0)},p(e,n){d===(d=c(e))&&p?p.p(e,n):(p.d(1),p=d(e),p&&(p.c(),p.m(t,a))),e[7]?g?g.p(e,n):(g=ue(e),g.c(),g.m(t,null)):g&&(g.d(1),g=null),128&n[0]&&w(t,"active",e[7])},i:e,o:e,d(e){e&&o(t),p.d(),g&&g.d(),i=!1,l()}}}function ye(e,n,t){let a;const i=x();let l,r,s,{options:o}=n,{selected:c=null}=n,{placeholder:u="Find an area..."}=n,{value:d="code"}=n,{label:h="name"}=n,{group:p=null}=n,{search:f=!1}=n,m=c,g=c?o.find((e=>{e[d],c[d]})):null,v=!1,y="",w=null,C=[];function b(e){t(17,c=e),t(7,v=!1),i("select",{selected:e,value:e[d]})}return e.$$set=e=>{"options"in e&&t(18,o=e.options),"selected"in e&&t(17,c=e.selected),"placeholder"in e&&t(0,u=e.placeholder),"value"in e&&t(19,d=e.value),"label"in e&&t(1,h=e.label),"group"in e&&t(2,p=e.group),"search"in e&&t(3,f=e.search)},e.$$.update=()=>{16&e.$$.dirty[0]&&t(21,a=y?new RegExp(y,"i"):null),2359298&e.$$.dirty[0]&&(t(9,l=a?o.filter((e=>a.test(e[h]))):o),t(8,w=0)),32&e.$$.dirty[0]&&(document.onclick=function(e){e.target!==r&&(t(7,v=!1),t(8,w=0))}),1966080&e.$$.dirty[0]&&m!=c&&(t(6,g=o.find((e=>e[d]==c[d]))),t(20,m=c))},[u,h,p,f,y,r,g,v,w,l,s,C,function(e){var n;e.stopPropagation(),t(4,y=""),t(7,v=!v),(n=10,new Promise((e=>setTimeout(e,n)))).then((()=>{s&&v&&s.focus()}))},b,function(e){e.stopPropagation(),t(17,c=null),t(20,m=null),t(6,g=null),i("select",{selected:null,value:null})},function(e){v&&l[0]&&Number.isInteger(w)&&(38===e.keyCode?(t(8,w-=w>0?1:0),C[w].scrollIntoView({block:"nearest",inline:"start"})):40===e.keyCode&&(t(8,w+=w<l.length-1?1:0),C[w].scrollIntoView({block:"nearest",inline:"end"})))},function(e){l[0]&&Number.isInteger(w)&&13===e.keyCode&&b(l[w])},c,o,d,m,a,function(){y=this.value,t(4,y)},function(e){k[e?"unshift":"push"]((()=>{s=e,t(10,s)}))},e=>b(e),e=>t(8,w=e),function(e,n){k[e?"unshift":"push"]((()=>{C[n]=e,t(11,C)}))},e=>b(e),e=>t(8,w=e),function(e,n){k[e?"unshift":"push"]((()=>{C[n]=e,t(11,C)}))},function(e){k[e?"unshift":"push"]((()=>{r=e,t(5,r)}))}]}class we extends B{constructor(e){super(),F(this,e,ye,ve,l,{options:18,selected:17,placeholder:0,value:19,label:1,group:2,search:3},[-1,-1])}}function Ce(n){let t;return{c(){t=u("div"),t.innerHTML="<strong>Warning!</strong> This is a prototype. Data likely to contain inaccuracies.",m(t,"class","warning svelte-srzfvi")},m(e,n){s(e,t,n)},p:e,i:e,o:e,d(e){e&&o(t)}}}class be extends B{constructor(e){super(),F(this,e,null,Ce,l,{})}}function $e(e){let n,t,a,i=e[4](e[0])+"",l=e[3](e[0])+"";return{c(){n=u("div"),t=h(),a=u("div"),y(n,"font-weight","600")},m(e,r){s(e,n,r),n.innerHTML=i,s(e,t,r),s(e,a,r),a.innerHTML=l},p(e,t){1&t&&i!==(i=e[4](e[0])+"")&&(n.innerHTML=i),1&t&&l!==(l=e[3](e[0])+"")&&(a.innerHTML=l)},d(e){e&&o(n),e&&o(t),e&&o(a)}}}function xe(n){let t,a,i,l,c,d,g=n[1]&&$e(n);return{c(){t=u("script"),i=h(),g&&g.c(),l=p(),t.src!==(a="https://unpkg.com/rosaenlg@3.0.1/dist/rollup/rosaenlg_tiny_en_US_3.0.1_comp.js")&&m(t,"src","https://unpkg.com/rosaenlg@3.0.1/dist/rollup/rosaenlg_tiny_en_US_3.0.1_comp.js")},m(e,a){r(document.head,t),s(e,i,a),g&&g.m(e,a),s(e,l,a),c||(d=f(t,"load",n[2]),c=!0)},p(e,[n]){e[1]?g?g.p(e,n):(g=$e(e),g.c(),g.m(l.parentNode,l)):g&&(g.d(1),g=null)},i:e,o:e,d(e){o(t),e&&o(i),g&&g.d(e),e&&o(l),c=!1,d()}}}function Te(e,n,t){let{place:a}=n,i=!1;return e.$$set=e=>{"place"in e&&t(0,a=e.place)},[a,i,()=>{t(1,i=!0)},function(e){let n=e.priority2018.Highest.map((e=>(e.pos="improvement",e))),t=e.priority2018.Lowest.map((e=>(e.pos="decline",e))),a=n.concat(t).filter((e=>"Subdomain"==e["Index level"]));return a.sort((function(e,n){return e.hlRank-n.hlRank})),console.log("place",e),console.log("subDomains",a),rosaenlg_en_US.render("\nmixin intro\n    synz\n        syn\n            | #[+value(place.name)] saw England’s\n\nmixin firstSen(i)\n    | #[+value(place.name)] \n    if (subDomain[i].hlRankType==\"Rank\")\n        | has England's\n        | #[+value(subDomain[i].hlRank, {'ORDINAL_TEXTUAL':true})] highest score for\n    else\n        | saw England’s\n        | #[+value(subDomain[i].hlRank, {'ORDINAL_TEXTUAL':true})] greatest #[+value(subDomain[i].pos)] in \n    i #[+value((subDomain[i].Measure).toLowerCase())] \n    i \n    if (subDomain[i].hlRankType==\"Change1year Rank\")\n        | between 2017 and 2018 \n    else if (subDomain[i].hlRankType==\"Change3year Rank\")\n        | in the three years between 2015 and 2018\n    | .\n\nmixin subd(i)\n    | #[+value(subDomain[i].Measure)] \n    | is a subdomain of \n    | #[+value(subDomain[i].Domain)]\n    | which looks at\n    eachz indic in Object.keys(place.data[subDomain[i].Domain].subdomains[subDomain[i].Measure].indicators) with { separator:',', last_separator:'and' }\n        i #[+value(indic.toLowerCase())]\n        i\n    | .\n\nmixin topBot(i, yr)\n    | top \n    | #[+value(place.data[subDomain[i].Domain].subdomains[subDomain[i].Measure].total[yr].Rank/149, {'FORMAT': '0%'})]\n\nmixin secondSen(i)\n    if (subDomain[i].hlRankType==\"Change1year Rank\")\n        | From 2017 to 2018,\n        | #[+value(place.name)] went from \n        | #[+topBot(i, 2017)]\n        | (index 107.9) \n    else\n        | From 2015 to 2018,\n        | #[+value(place.name)] went from \n        | #[+topBot(i, 2015)]\n        | (index 107.9) \n    | to \n    | #[+topBot(i, 2018)]  \n    | (112.7) \n    | for \n    | #[+value(subDomain[i].Measure.toLowerCase())]\n    if !(subDomain[i].hlRankType==\"Rank\")\n        | , giving it England’s \n        | #[+value(place.data[subDomain[i].Domain].subdomains[subDomain[i].Measure].total[2018].Rank, {'ORDINAL_TEXTUAL':true})] \n        | highest score\n    | .\n\nmixin lastSen(i)\n    | This change was largely driven by \n    if (subDomain[i].hlRankType==\"Change1year Rank\")\n        if (negs.includes((indicators[i][0].indi).toLowerCase()))\n            | decline in the rate of \n            | #[+value((indicators[i][0].indi).toLowerCase())] \n            | (index improved by #[+value(indicators[i][0][2018].Change1year)]) and \n        else\n            | improvements in \n            | #[+value((indicators[i][0].indi).toLowerCase())] \n            | (#[+value(indicators[i][0][2018].Change1year, {'FORMAT': '+0.0'})]) and \n        if (negs.includes((indicators[i][1].indi).toLowerCase()))\n            | a decline in the rate of \n            | #[+value((indicators[i][1].indi).toLowerCase())] \n            | (index improved by #[+value(indicators[i][1][2018].Change1year)] points), \n        else\n            | improvements in \n            | #[+value((indicators[i][1].indi).toLowerCase())] \n            | (#[+value(indicators[i][1][2018].Change1year, {'FORMAT': '+0.0'})]), \n        if (indicators[i][indicators[i].length-1][2018].Change1year<0)\n            | however there was also a decline in \n            | #[+value((indicators[i][indicators[i].length-1].indi).toLowerCase())]\n            | (#[+value(indicators[i][indicators[i].length-1][2018].Change1year, {'FORMAT': '+0.0'})]).\n    else\n        if (negs.includes((indicators[i][0].indi).toLowerCase()))\n            | decline in the rate of \n            | #[+value((indicators[i][0].indi).toLowerCase())] \n            | (index improved by #[+value(indicators[i][0][2018].Change3year)]) and \n        else\n            | improvements in \n            | #[+value((indicators[i][0].indi).toLowerCase())] \n            | (#[+value(indicators[i][0][2018].Change3year, {'FORMAT': '+0.0'})]) and \n        if (negs.includes((indicators[i][1].indi).toLowerCase()))\n            | a decline in the rate of \n            | #[+value((indicators[i][1].indi).toLowerCase())] \n            | (index improved by #[+value(indicators[i][1][2018].Change3year)] points), \n        else\n            | improvements in \n            | #[+value((indicators[i][1].indi).toLowerCase())] \n            | (#[+value(indicators[i][1][2018].Change3year, {'FORMAT': '+0.0'})]), \n        if (indicators[i][indicators[i].length-1][2018].Change3year<0)\n            | however there was also a decline in \n            | #[+value((indicators[i][indicators[i].length-1].indi).toLowerCase())]\n            | (#[+value(indicators[i][indicators[i].length-1][2018].Change3year, {'FORMAT': '+0.0'})]).\n\nmixin para(i)\n    p #[+firstSen(i)]\n    p #[+subd(i)]\n    p #[+secondSen(i)] \n    p #[+lastSen(i)]\n\nhr\np < MAIN INDEX GRAPHS >\nhr\np #[+para(0)]\nhr\np < CHART >\nhr\np #[+para(1)]\nhr\np < CHART >\nhr\np #[+para(2)]\nhr\np < CHART >\nhr\np #[+para(3)]\nhr\np < CHART >\n",{language:"en_UK",place:e,subDomain:a,negs:["smoking","anxiety"],indicators:function(e){let n=[];for(let t=0;t<a.length;t++){let i=e[a[t].Domain].subdomains[a[t].Subdomain].indicators,l=[];for(const[e,n]of Object.entries(i))n.indi=e,l.push({}),l[l.length-1]=n;l.sort((function(e,n){return n[2018].Change3year-e[2018].Change3year})),n.push(l)}return n}(e.data)})},function(e){return rosaenlg_en_US.render("\nmixin updown\n    if (place.data.Overall.total[2018].Change1year > 0)\n        | up\n    else if (place.data.Overall.total[2018].Change1year < 0)\n        | down\n\nmixin sidDiff\n    // This needs to be replaced with a calculation for significant difference when we reieve the data, -0.4 was the national ave change\n    if (Math.abs(place.data.Overall.total[2018].Change1year-(-0.4))<0.3)\n        | a decline inline with the average across England.\n    else if (place.data.Overall.total[2018].Change1year-(-0.4)<-0.3)\n        | a slightly greater decline than the average across England.\n\np\n    | #[+value(place.name)] \n    | has an overall health index of \n    | #[+value(place.data.Overall.total[2018].value)].\n    | This is determined by scores for three domains; \n    | Healthy Lives (#[+value(place.data['Healthy Lives'].total[2018].value)]), \n    | Healthy People (#[+value(place.data['Healthy People'].total[2018].value)]) and \n    | Healthy Places (#[+value(place.data['Healthy Places'].total[2018].value)]).\n\np \n    | #[+value(place.name)] \n    | was ranked \n    | #[+value(place.data.Overall.total[2018].Rank, {'ORDINAL_NUMBER':true })] \n    | healthiest out of 149 districts in England. It's index score was \n    | #[+updown] \n    | #[+value(Math.abs(place.data.Overall.total[2018].Change1year/100), {'FORMAT': '0.0%'})]\n    | on last year;\n    | #[+sidDiff]\n\np\n    | A score of 100 equates to the average across England when the index was first calculated in 2015.\n",{language:"en_UK",place:e})}]}class ke extends B{constructor(e){super(),F(this,e,Te,xe,l,{place:0})}}const qe=e=>{if(e<10)return["","first","second","third","fourth","fifth","sixth","seventh","eighth","ninth"][e];const n=e%10,t=e%100;return 1===n&&11!==t?e+"st":2===n&&12!==t?e+"nd":3===n&&13!==t?e+"rd":e+"th"};function Le(e){if(e<10)return["","","second","third","fourth","fifth","sixth","seventh","eighth","ninth"][e];var n=e%10,t=e%100;return 1==n&&11!=t?e+"st":2==n&&12!=t?e+"nd":3==n&&13!=t?e+"rd":e+"th"}let Re={};[{varCode:"ranking_1_sent",comment:"TOTAL POPULATION",template:"{Current?:{Change1year?Between 2017 and 2018,:In the three years from 2015 to 2018,}}{firstPara? {ladName}:{Current?This area: this area}} {Current?has:saw} England's {ordinalSuffix} {Current?highest score for:{rankIsNegative?greatest decline:greatest improvement in}} {measure}."},{varCode:"domain_1_sent",comment:"POPULATION CHANGE",template:"Barnet has a health index score of 100, the 32nd healthiest district in England."},{varCode:"domain_2_sent",comment:"PROPORTION OVER 65",template:"Barnet's overall health has improved since scoring 99 in 2015."}].forEach((e=>{Re[e.varCode]=e.template}));let He=!0;function Ae(e,n,t,a){let i=e;for(let e=0;e<t.length;e++)i=i[t[e]];let l=function(e,n){let t;"data"==n[0]&&("Overall"==n[1]?t="overall health":"Healthy Places"==n[1]?t="environmental factors associated with health":"Healthy Lives"==n[1]?t="health-related behaviours":"Healthy People"==n[1]&&(t="health outcomes"));"priority2018"==n[0]&&(t=e.Measure.toLowerCase());return t}(i,t);return((e,n)=>{if("string"!=typeof e)throw new TypeError("Expected a string, got "+typeof e);let t=1,a=e.charAt(0);const i=function(){return a},l=function(n){throw JSON.stringify({name:"Robo-journalist error",message:n,at:t,text:e})},r=function(n){return n&&n!==a&&l("Expected '"+n+"' instead of '"+a+"'"),a=e.charAt(t),t+=1,a},s=function(e){return e in n||l(`${e} is not a key of the data dictionary.`),n[e]},o=function(e){const n=e.split(" "),t={"+":(e,n)=>e+n,"-":(e,n)=>e-n,"*":(e,n)=>e*n,"/":(e,n)=>e/n,"<":(e,n)=>e<n,">":(e,n)=>e>n,"<=":(e,n)=>e<=n,">=":(e,n)=>e>=n},a=[];for(const e of n)if(/^-?\d+$/.test(e))a.push(Number(e));else if(e in t){const n=Number(a.pop()),i=Number(a.pop());a.push(t[e](i,n))}else if("~abs"===e)a[a.length-1]=Math.abs(a[a.length-1]);else if("~ord"===e)a[a.length-1]=qe(Number(a[a.length-1]));else if("~ord'"===e){let e=qe(Number(a.pop()));"first"===e?e="":e+=" ",a.push(e)}else"^"===e.charAt(0)?a[a.length-1]=s(e.slice(1))(a[a.length-1]):a.push(s(e));return 1!==a.length&&l("Invalid RPN"),a[0]},c=function(e){r("?");const n=d();r(":");const t=d();return r("}"),e?n:t},u=function(){if(r("{"),":"===a)return r(":"),r("}"),":";let e="";for(;i();){if("}"===a)return r("}"),o(e);if("?"===a)return c(o(e));e+=a,r()}l("Braces not closed")},d=function(){let e="";for(;i();){if(":"===a||"}"===a)return e;"{"!==a?(e+=a,r()):e+=u()}return e},h=d();return""!==a&&l(`Didn't expect '${a}'`),h})(Re.ranking_1_sent,{Change1year:Ne(i,t,"Change1year"),Change3year:Ne(i,t,"Change3year"),Current:Ne(i,t,"Current"),firstPara:0==a|3==a,ladName:e.name,ordinalSuffix:Le("data"==t[0]?i.Rank:i.hlRank),rankIsNegative:"Lowest"==t[1],regionName:"London",londonOrWales:!1,measure:l,intro:He})}function Ne(e,n,t){let a;return"priority2018"==n[0]&&("Current"==t&&(e.hlRankType.includes("Change")||(He=!(1==He),a=!0)),e.hlRankType.includes(t)?(He=!(1==He),a=!0):a=!1),"data"==n[0]&&("Current"==t?(He=!(1==He),a=!0):a=!1),a}function _e(e,n,t){const a=e.slice();return a[14]=n[t],a[16]=t,a}function Oe(e,n,t){const a=e.slice();return a[17]=n[t],a[16]=t,a}function De(e){let n,t,a,i,l,c,p,f,v,w,C,b,$,x,T,q,R,H,A,N,_,O,D,E,P,U,F,B,V,W,X,Z,K,G,J,Y,Q,ee,ne,te,ae,ie,le,re,se,oe,ce,ue,de,he,pe,fe,me,ge,ve,ye,Ce,be,$e,xe,Te,qe,Le,Re,He,Ne,_e,Oe,De,Pe,Se,Ie,ze,Ue,Fe,Be,Ve,We,Xe,Ze,Ke,Ge,Je,Ye,Qe,en,nn,tn,an,ln,rn=e[3].name+"",sn=e[2].name+"",on=e[2].data.Overall.total[2018].value+"",cn=Ae(e[2],0,["data","Overall","total","2018"],0)+"",un=e[2].data["Healthy Lives"].total[2018].value+"",dn=Ae(e[2],0,["data","Healthy Lives","total","2018"],1)+"",hn=e[2].data["Healthy People"].total[2018].value+"",pn=Ae(e[2],0,["data","Healthy People","total","2018"],2)+"",fn=e[2].data["Healthy Places"].total[2018].value+"",mn=Ae(e[2],0,["data","Healthy Places","total","2018"],3)+"",gn=Ae(e[2],0,["priority2018","Highest",0],0)+"",vn=Ae(e[2],0,["priority2018","Highest",1],1)+"",yn=Ae(e[2],0,["priority2018","Highest",2],2)+"",wn=Ae(e[2],0,["priority2018","Lowest",3],3)+"",Cn=Ae(e[2],0,["priority2018","Lowest",4],4)+"",bn=Ae(e[2],0,["priority2018","Lowest",5],5)+"",$n=e[3].parents[0]&&Ee(e),xn=e[3].parents[0]&&Me(e);function Tn(n){e[8](n)}let kn={options:e[0],group:"typenm",search:!0};void 0!==e[1]&&(kn.selected=e[1]),q=new we({props:kn}),k.push((()=>function(e,n,t){const a=e.$$.props[n];void 0!==a&&(e.$$.bound[a]=t,t(e.$$.ctx[a]))}(q,"selected",Tn))),q.$on("select",e[9]),O=new ke({props:{place:e[2]}});let qn=e[3].children[0]&&je(e);return{c(){n=u("div"),t=u("div"),$n&&$n.c(),a=h(),i=d(rn),l=h(),c=u("div"),p=u("div"),f=u("span"),v=d("Health Index:  "),w=d(sn),C=u("br"),b=h(),xn&&xn.c(),$=h(),x=u("div"),T=u("div"),S(q.$$.fragment),H=h(),A=u("div"),N=u("br"),_=h(),S(O.$$.fragment),D=h(),E=u("hr"),P=h(),U=u("div"),F=u("h3"),B=d("Health index: "),V=d(on),W=h(),X=u("div"),Z=u("p"),K=d(cn),G=h(),J=u("div"),Y=u("h4"),Q=d("Healthy Lives: "),ee=d(un),ne=h(),te=u("div"),ae=u("p"),ie=d(dn),le=h(),re=u("div"),se=u("h4"),oe=d("Healthy People: "),ce=d(hn),ue=h(),de=u("div"),he=u("p"),pe=d(pn),fe=h(),me=u("div"),ge=u("h4"),ve=d("Healthy Places: "),ye=d(fn),Ce=h(),be=u("div"),$e=u("p"),xe=d(mn),Te=h(),qe=u("hr"),Le=h(),Re=u("div"),He=u("p"),Ne=d(gn),_e=h(),Oe=u("div"),De=u("p"),Pe=d(vn),Se=h(),Ie=u("div"),ze=u("p"),Ue=d(yn),Fe=h(),Be=u("div"),Ve=u("p"),We=d(wn),Xe=h(),Ze=u("div"),Ke=u("p"),Ge=d(Cn),Je=h(),Ye=u("div"),Qe=u("p"),en=d(bn),nn=h(),qn&&qn.c(),tn=h(),an=u("div"),an.innerHTML='<div><img src="https://onsvisual.github.io/svelte-scrolly/img/ons-logo-pos-en.svg" alt="Office for National Statistics" class="svelte-2qp4su"/></div> \n\t<div class="right svelte-2qp4su"><span class="text-small svelte-2qp4su">Source: Census 2011, with change +/- from Census 2001.</span></div>',m(t,"class","text-small svelte-2qp4su"),m(n,"class","grid svelte-2qp4su"),m(f,"class","text-big svelte-2qp4su"),y(T,"width","240px"),y(T,"float","right"),m(c,"class","grid-2 svelte-2qp4su"),m(F,"class","svelte-2qp4su"),m(Z,"class","svelte-2qp4su"),m(X,"class","svelte-2qp4su"),m(Y,"class","svelte-2qp4su"),m(ae,"class","svelte-2qp4su"),m(te,"class","svelte-2qp4su"),m(se,"class","svelte-2qp4su"),m(he,"class","svelte-2qp4su"),m(de,"class","svelte-2qp4su"),m(ge,"class","svelte-2qp4su"),m($e,"class","svelte-2qp4su"),m(be,"class","svelte-2qp4su"),m(He,"class","svelte-2qp4su"),m(Re,"class","svelte-2qp4su"),m(De,"class","svelte-2qp4su"),m(Oe,"class","svelte-2qp4su"),m(ze,"class","svelte-2qp4su"),m(Ie,"class","svelte-2qp4su"),m(Ve,"class","svelte-2qp4su"),m(Be,"class","svelte-2qp4su"),m(Ke,"class","svelte-2qp4su"),m(Ze,"class","svelte-2qp4su"),m(Qe,"class","svelte-2qp4su"),m(Ye,"class","svelte-2qp4su"),m(A,"class","profile-grid mt svelte-2qp4su"),m(an,"class","grid-2 mt svelte-2qp4su")},m(e,o){s(e,n,o),r(n,t),$n&&$n.m(t,null),r(t,a),r(t,i),s(e,l,o),s(e,c,o),r(c,p),r(p,f),r(f,v),r(f,w),r(p,C),r(p,b),xn&&xn.m(p,null),r(c,$),r(c,x),r(x,T),I(q,T,null),s(e,H,o),s(e,A,o),r(A,N),r(A,_),I(O,A,null),r(A,D),r(A,E),r(A,P),r(A,U),r(U,F),r(F,B),r(F,V),r(A,W),r(A,X),r(X,Z),r(Z,K),r(A,G),r(A,J),r(J,Y),r(Y,Q),r(Y,ee),r(A,ne),r(A,te),r(te,ae),r(ae,ie),r(A,le),r(A,re),r(re,se),r(se,oe),r(se,ce),r(A,ue),r(A,de),r(de,he),r(he,pe),r(A,fe),r(A,me),r(me,ge),r(ge,ve),r(ge,ye),r(A,Ce),r(A,be),r(be,$e),r($e,xe),r(A,Te),r(A,qe),r(A,Le),r(A,Re),r(Re,He),r(He,Ne),r(A,_e),r(A,Oe),r(Oe,De),r(De,Pe),r(A,Se),r(A,Ie),r(Ie,ze),r(ze,Ue),r(A,Fe),r(A,Be),r(Be,Ve),r(Ve,We),r(A,Xe),r(A,Ze),r(Ze,Ke),r(Ke,Ge),r(A,Je),r(A,Ye),r(Ye,Qe),r(Qe,en),s(e,nn,o),qn&&qn.m(e,o),s(e,tn,o),s(e,an,o),ln=!0},p(e,n){e[3].parents[0]?$n?$n.p(e,n):($n=Ee(e),$n.c(),$n.m(t,a)):$n&&($n.d(1),$n=null),(!ln||8&n)&&rn!==(rn=e[3].name+"")&&g(i,rn),(!ln||4&n)&&sn!==(sn=e[2].name+"")&&g(w,sn),e[3].parents[0]?xn?xn.p(e,n):(xn=Me(e),xn.c(),xn.m(p,null)):xn&&(xn.d(1),xn=null);const l={};var r;1&n&&(l.options=e[0]),!R&&2&n&&(R=!0,l.selected=e[1],r=()=>R=!1,L.push(r)),q.$set(l);const s={};4&n&&(s.place=e[2]),O.$set(s),(!ln||4&n)&&on!==(on=e[2].data.Overall.total[2018].value+"")&&g(V,on),(!ln||4&n)&&cn!==(cn=Ae(e[2],0,["data","Overall","total","2018"],0)+"")&&g(K,cn),(!ln||4&n)&&un!==(un=e[2].data["Healthy Lives"].total[2018].value+"")&&g(ee,un),(!ln||4&n)&&dn!==(dn=Ae(e[2],0,["data","Healthy Lives","total","2018"],1)+"")&&g(ie,dn),(!ln||4&n)&&hn!==(hn=e[2].data["Healthy People"].total[2018].value+"")&&g(ce,hn),(!ln||4&n)&&pn!==(pn=Ae(e[2],0,["data","Healthy People","total","2018"],2)+"")&&g(pe,pn),(!ln||4&n)&&fn!==(fn=e[2].data["Healthy Places"].total[2018].value+"")&&g(ye,fn),(!ln||4&n)&&mn!==(mn=Ae(e[2],0,["data","Healthy Places","total","2018"],3)+"")&&g(xe,mn),(!ln||4&n)&&gn!==(gn=Ae(e[2],0,["priority2018","Highest",0],0)+"")&&g(Ne,gn),(!ln||4&n)&&vn!==(vn=Ae(e[2],0,["priority2018","Highest",1],1)+"")&&g(Pe,vn),(!ln||4&n)&&yn!==(yn=Ae(e[2],0,["priority2018","Highest",2],2)+"")&&g(Ue,yn),(!ln||4&n)&&wn!==(wn=Ae(e[2],0,["priority2018","Lowest",3],3)+"")&&g(We,wn),(!ln||4&n)&&Cn!==(Cn=Ae(e[2],0,["priority2018","Lowest",4],4)+"")&&g(Ge,Cn),(!ln||4&n)&&bn!==(bn=Ae(e[2],0,["priority2018","Lowest",5],5)+"")&&g(en,bn),e[3].children[0]?qn?qn.p(e,n):(qn=je(e),qn.c(),qn.m(tn.parentNode,tn)):qn&&(qn.d(1),qn=null)},i(e){ln||(M(q.$$.fragment,e),M(O.$$.fragment,e),ln=!0)},o(e){j(q.$$.fragment,e),j(O.$$.fragment,e),ln=!1},d(e){e&&o(n),$n&&$n.d(),e&&o(l),e&&o(c),xn&&xn.d(),z(q),e&&o(H),e&&o(A),z(O),e&&o(nn),qn&&qn.d(e),e&&o(tn),e&&o(an)}}}function Ee(e){let n,t=e[3].parents.reverse(),a=[];for(let n=0;n<t.length;n+=1)a[n]=Pe(Oe(e,t,n));return{c(){for(let e=0;e<a.length;e+=1)a[e].c();n=p()},m(e,t){for(let n=0;n<a.length;n+=1)a[n].m(e,t);s(e,n,t)},p(e,i){if(40&i){let l;for(t=e[3].parents.reverse(),l=0;l<t.length;l+=1){const r=Oe(e,t,l);a[l]?a[l].p(r,i):(a[l]=Pe(r),a[l].c(),a[l].m(n.parentNode,n))}for(;l<a.length;l+=1)a[l].d(1);a.length=t.length}},d(e){c(a,e),e&&o(n)}}}function Pe(e){let n,t,a,i,l,c,h,v=e[17].name+"";function y(){return e[7](e[17])}return{c(){n=u("a"),t=d(v),l=p(),m(n,"href",a="#"+e[17].code),m(n,"class","svelte-2qp4su"),i=new C(l)},m(e,a){s(e,n,a),r(n,t),i.m(" &gt; ",e,a),s(e,l,a),c||(h=f(n,"click",y),c=!0)},p(i,l){e=i,8&l&&v!==(v=e[17].name+"")&&g(t,v),8&l&&a!==(a="#"+e[17].code)&&m(n,"href",a)},d(e){e&&o(n),e&&o(l),e&&i.d(),c=!1,h()}}}function Me(e){let n,t,a,i=ie[e[3].type].name+"",l=e[3].parents[e[3].parents.length-1].name+"";return{c(){n=d(i),t=d(" in "),a=d(l)},m(e,i){s(e,n,i),s(e,t,i),s(e,a,i)},p(e,t){8&t&&i!==(i=ie[e[3].type].name+"")&&g(n,i),8&t&&l!==(l=e[3].parents[e[3].parents.length-1].name+"")&&g(a,l)},d(e){e&&o(n),e&&o(t),e&&o(a)}}}function je(e){let n,t,a,i,l,p,f,v,y,w=e[3].children[0].typepl+"",C=e[3].name+"",b=e[3].children,$=[];for(let n=0;n<b.length;n+=1)$[n]=Se(_e(e,b,n));return{c(){n=u("div"),t=u("div"),a=u("span"),i=d(w),l=d(" within "),p=d(C),f=u("br"),v=h(),y=u("span");for(let e=0;e<$.length;e+=1)$[e].c();m(a,"class","text-label svelte-2qp4su"),m(y,"class","text-small svelte-2qp4su"),m(n,"class","grid mt svelte-2qp4su")},m(e,o){s(e,n,o),r(n,t),r(t,a),r(a,i),r(a,l),r(a,p),r(t,f),r(t,v),r(t,y);for(let e=0;e<$.length;e+=1)$[e].m(y,null)},p(e,n){if(8&n&&w!==(w=e[3].children[0].typepl+"")&&g(i,w),8&n&&C!==(C=e[3].name+"")&&g(p,C),40&n){let t;for(b=e[3].children,t=0;t<b.length;t+=1){const a=_e(e,b,t);$[t]?$[t].p(a,n):($[t]=Se(a),$[t].c(),$[t].m(y,null))}for(;t<$.length;t+=1)$[t].d(1);$.length=b.length}},d(e){e&&o(n),c($,e)}}}function Se(e){let n,t,a,i,l,c,h=e[14].name+"",p=e[16]<e[3].children.length-1?", ":"";function v(){return e[10](e[14])}return{c(){n=u("a"),t=d(h),i=d(p),m(n,"href",a="#"+e[14].code),m(n,"class","svelte-2qp4su")},m(e,a){s(e,n,a),r(n,t),s(e,i,a),l||(c=f(n,"click",v),l=!0)},p(l,r){e=l,8&r&&h!==(h=e[14].name+"")&&g(t,h),8&r&&a!==(a="#"+e[14].code)&&m(n,"href",a),8&r&&p!==(p=e[16]<e[3].children.length-1?", ":"")&&g(i,p)},d(e){e&&o(n),e&&o(i),l=!1,c()}}}function Ie(e){let n,t,i,l;n=new be({});let r=e[3]&&e[4]&&De(e);return{c(){S(n.$$.fragment),t=h(),r&&r.c(),i=p()},m(e,a){I(n,e,a),s(e,t,a),r&&r.m(e,a),s(e,i,a),l=!0},p(e,[n]){e[3]&&e[4]?r?(r.p(e,n),24&n&&M(r,1)):(r=De(e),r.c(),M(r,1),r.m(i.parentNode,i)):r&&(P={r:0,c:[],p:P},j(r,1,1,(()=>{r=null})),P.r||a(P.c),P=P.p)},i(e){l||(M(n.$$.fragment,e),M(r),l=!0)},o(e){j(n.$$.fragment,e),j(r),l=!1},d(e){z(n,e),e&&o(t),r&&r.d(e),e&&o(i)}}}function ze(e,n,t){let a,i,l,r,s;function o(e){fetch(ne+e+".json").then((e=>e.json())).then((n=>{n.children=a.filter((n=>n.parent==e)),n.count>20?fetch(ae+n.type+".json").then((e=>e.json())).then((e=>{t(3,r=n)})):t(3,r=n)}))}function c(e){fetch(te+e+".json").then((e=>e.json())).then((e=>{t(2,l=e),console.log("Place Health",l)}))}(async function(e){let n=await fetch(e),t=await n.text();return await J(t,Y)})(ee).then((e=>{e.forEach((e=>{e.typepl=ie[e.type].pl,e.typenm=ie[e.type].name})),t(0,a=e.sort(((e,n)=>e.name.localeCompare(n.name)))),t(1,i=a.find((e=>"Barnet"==e.name))),function(){const e="K04000001";fetch(ne+e+".json").then((e=>e.json())).then((n=>{n.children=a.filter((n=>n.parent==e)),t(4,s=n)}))}(),o(i.code),c(i.code)}));return[a,i,l,r,s,o,c,e=>o(e.code),function(e){i=e,t(1,i)},()=>{i&&c(i.code)},e=>o(e.code)]}return new class extends B{constructor(e){super(),F(this,e,ze,Ie,l,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
