/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=window,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),e=new WeakMap;class n{constructor(t,i,e){if(this._$cssResult$=!0,e!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=i}get styleSheet(){let t=this.o;const s=this.t;if(i&&void 0===t){const i=void 0!==s&&1===s.length;i&&(t=e.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&e.set(s,t))}return t}toString(){return this.cssText}}const o=(t,...i)=>{const e=1===t.length?t[0]:i.reduce(((i,s,e)=>i+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[e+1]),t[0]);return new n(e,t,s)},r=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let i="";for(const s of t.cssRules)i+=s.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(i)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var l;const h=window,a=h.trustedTypes,u=a?a.emptyScript:"",c=h.reactiveElementPolyfillSupport,d={toAttribute(t,i){switch(i){case Boolean:t=t?u:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},v=(t,i)=>i!==t&&(i==i||t==t),p={attribute:!0,type:String,converter:d,reflect:!1,hasChanged:v},f="finalized";class g extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var i;this.finalize(),(null!==(i=this.h)&&void 0!==i?i:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Ep(s,i);void 0!==e&&(this._$Ev.set(e,s),t.push(e))})),t}static createProperty(t,i=p){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e)}}static getPropertyDescriptor(t,i,s){return{get(){return this[i]},set(e){const n=this[t];this[i]=e,this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||p}static finalize(){if(this.hasOwnProperty(f))return!1;this[f]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)i.unshift(r(t))}else void 0!==t&&i.push(r(t));return i}static _$Ep(t,i){const s=i.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var i,s;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t))}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i])}))}createRenderRoot(){var s;const e=null!==(s=this.shadowRoot)&&void 0!==s?s:this.attachShadow(this.constructor.shadowRootOptions);return((s,e)=>{i?s.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((i=>{const e=document.createElement("style"),n=t.litNonce;void 0!==n&&e.setAttribute("nonce",n),e.textContent=i.cssText,s.appendChild(e)}))})(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}))}attributeChangedCallback(t,i,s){this._$AK(t,s)}_$EO(t,i,s=p){var e;const n=this.constructor._$Ep(t,s);if(void 0!==n&&!0===s.reflect){const o=(void 0!==(null===(e=s.converter)||void 0===e?void 0:e.toAttribute)?s.converter:d).toAttribute(i,s.type);this._$El=t,null==o?this.removeAttribute(n):this.setAttribute(n,o),this._$El=null}}_$AK(t,i){var s;const e=this.constructor,n=e._$Ev.get(t);if(void 0!==n&&this._$El!==n){const t=e.getPropertyOptions(n),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:d;this._$El=n,this[n]=o.fromAttribute(i,t.type),this._$El=null}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||v)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$Ek()}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(s)}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var b;g[f]=!0,g.elementProperties=new Map,g.elementStyles=[],g.shadowRootOptions={mode:"open"},null==c||c({ReactiveElement:g}),(null!==(l=h.reactiveElementVersions)&&void 0!==l?l:h.reactiveElementVersions=[]).push("1.6.3");const y=window,m=y.trustedTypes,w=m?m.createPolicy("lit-html",{createHTML:t=>t}):void 0,_="$lit$",$=`lit$${(Math.random()+"").slice(9)}$`,x="?"+$,S=`<${x}>`,k=document,C=()=>k.createComment(""),A=t=>null===t||"object"!=typeof t&&"function"!=typeof t,E=Array.isArray,N="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,T=/-->/g,j=/>/g,M=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),P=/'/g,R=/"/g,O=/^(?:script|style|textarea|title)$/i,I=(t=>(i,...s)=>({_$litType$:t,strings:i,values:s}))(1),z=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),L=new WeakMap,q=k.createTreeWalker(k,129,null,!1);function V(t,i){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==w?w.createHTML(i):i}const D=(t,i)=>{const s=t.length-1,e=[];let n,o=2===i?"<svg>":"",r=U;for(let i=0;i<s;i++){const s=t[i];let l,h,a=-1,u=0;for(;u<s.length&&(r.lastIndex=u,h=r.exec(s),null!==h);)u=r.lastIndex,r===U?"!--"===h[1]?r=T:void 0!==h[1]?r=j:void 0!==h[2]?(O.test(h[2])&&(n=RegExp("</"+h[2],"g")),r=M):void 0!==h[3]&&(r=M):r===M?">"===h[0]?(r=null!=n?n:U,a=-1):void 0===h[1]?a=-2:(a=r.lastIndex-h[2].length,l=h[1],r=void 0===h[3]?M:'"'===h[3]?R:P):r===R||r===P?r=M:r===T||r===j?r=U:(r=M,n=void 0);const c=r===M&&t[i+1].startsWith("/>")?" ":"";o+=r===U?s+S:a>=0?(e.push(l),s.slice(0,a)+_+s.slice(a)+$+c):s+$+(-2===a?(e.push(void 0),i):c)}return[V(t,o+(t[s]||"<?>")+(2===i?"</svg>":"")),e]};class F{constructor({strings:t,_$litType$:i},s){let e;this.parts=[];let n=0,o=0;const r=t.length-1,l=this.parts,[h,a]=D(t,i);if(this.el=F.createElement(h,s),q.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes)}for(;null!==(e=q.nextNode())&&l.length<r;){if(1===e.nodeType){if(e.hasAttributes()){const t=[];for(const i of e.getAttributeNames())if(i.endsWith(_)||i.startsWith($)){const s=a[o++];if(t.push(i),void 0!==s){const t=e.getAttribute(s.toLowerCase()+_).split($),i=/([.?@])?(.*)/.exec(s);l.push({type:1,index:n,name:i[2],strings:t,ctor:"."===i[1]?K:"?"===i[1]?Q:"@"===i[1]?X:Z})}else l.push({type:6,index:n})}for(const i of t)e.removeAttribute(i)}if(O.test(e.tagName)){const t=e.textContent.split($),i=t.length-1;if(i>0){e.textContent=m?m.emptyScript:"";for(let s=0;s<i;s++)e.append(t[s],C()),q.nextNode(),l.push({type:2,index:++n});e.append(t[i],C())}}}else if(8===e.nodeType)if(e.data===x)l.push({type:2,index:n});else{let t=-1;for(;-1!==(t=e.data.indexOf($,t+1));)l.push({type:7,index:n}),t+=$.length-1}n++}}static createElement(t,i){const s=k.createElement("template");return s.innerHTML=t,s}}function H(t,i,s=t,e){var n,o,r,l;if(i===z)return i;let h=void 0!==e?null===(n=s._$Co)||void 0===n?void 0:n[e]:s._$Cl;const a=A(i)?void 0:i._$litDirective$;return(null==h?void 0:h.constructor)!==a&&(null===(o=null==h?void 0:h._$AO)||void 0===o||o.call(h,!1),void 0===a?h=void 0:(h=new a(t),h._$AT(t,s,e)),void 0!==e?(null!==(r=(l=s)._$Co)&&void 0!==r?r:l._$Co=[])[e]=h:s._$Cl=h),void 0!==h&&(i=H(t,h._$AS(t,i.values),h,e)),i}class J{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var i;const{el:{content:s},parts:e}=this._$AD,n=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:k).importNode(s,!0);q.currentNode=n;let o=q.nextNode(),r=0,l=0,h=e[0];for(;void 0!==h;){if(r===h.index){let i;2===h.type?i=new W(o,o.nextSibling,this,t):1===h.type?i=new h.ctor(o,h.name,h.strings,this,t):6===h.type&&(i=new Y(o,this,t)),this._$AV.push(i),h=e[++l]}r!==(null==h?void 0:h.index)&&(o=q.nextNode(),r++)}return q.currentNode=k,n}v(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++}}class W{constructor(t,i,s,e){var n;this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cp=null===(n=null==e?void 0:e.isConnected)||void 0===n||n}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===(null==t?void 0:t.nodeType)&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=H(this,t,i),A(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==z&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>E(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==B&&A(this._$AH)?this._$AA.nextSibling.data=t:this.$(k.createTextNode(t)),this._$AH=t}g(t){var i;const{values:s,_$litType$:e}=t,n="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=F.createElement(V(e.h,e.h[0]),this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===n)this._$AH.v(s);else{const t=new J(n,this),i=t.u(this.options);t.v(s),this.$(i),this._$AH=t}}_$AC(t){let i=L.get(t.strings);return void 0===i&&L.set(t.strings,i=new F(t)),i}T(t){E(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const n of t)e===i.length?i.push(s=new W(this.k(C()),this.k(C()),this,this.options)):s=i[e],s._$AI(n),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e)}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var i;void 0===this._$AM&&(this._$Cp=t,null===(i=this._$AP)||void 0===i||i.call(this,t))}}class Z{constructor(t,i,s,e,n){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=B}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const n=this.strings;let o=!1;if(void 0===n)t=H(this,t,i,0),o=!A(t)||t!==this._$AH&&t!==z,o&&(this._$AH=t);else{const e=t;let r,l;for(t=n[0],r=0;r<n.length-1;r++)l=H(this,e[s+r],i,r),l===z&&(l=this._$AH[r]),o||(o=!A(l)||l!==this._$AH[r]),l===B?t=B:t!==B&&(t+=(null!=l?l:"")+n[r+1]),this._$AH[r]=l}o&&!e&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class K extends Z{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}const G=m?m.emptyScript:"";class Q extends Z{constructor(){super(...arguments),this.type=4}j(t){t&&t!==B?this.element.setAttribute(this.name,G):this.element.removeAttribute(this.name)}}class X extends Z{constructor(t,i,s,e,n){super(t,i,s,e,n),this.type=5}_$AI(t,i=this){var s;if((t=null!==(s=H(this,t,i,0))&&void 0!==s?s:B)===z)return;const e=this._$AH,n=t===B&&e!==B||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,o=t!==B&&(e===B||n);n&&this.element.removeEventListener(this.name,this,e),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t)}}class Y{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){H(this,t)}}const tt=y.litHtmlPolyfillSupport;null==tt||tt(F,W),(null!==(b=y.litHtmlVersions)&&void 0!==b?b:y.litHtmlVersions=[]).push("2.8.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var it,st;class et extends g{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,i;const s=super.createRenderRoot();return null!==(t=(i=this.renderOptions).renderBefore)&&void 0!==t||(i.renderBefore=s.firstChild),s}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,i,s)=>{var e,n;const o=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let r=o._$litPart$;if(void 0===r){const t=null!==(n=null==s?void 0:s.renderBefore)&&void 0!==n?n:null;o._$litPart$=r=new W(i.insertBefore(C(),t),t,void 0,null!=s?s:{})}return r._$AI(t),r})(i,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return z}}et.finalized=!0,et._$litElement$=!0,null===(it=globalThis.litElementHydrateSupport)||void 0===it||it.call(globalThis,{LitElement:et});const nt=globalThis.litElementPolyfillSupport;function ot(t,i,s){return Math.floor((t-i)/2)+s+i}function rt(t,i,s){return 2*t-2*s-i}null==nt||nt({LitElement:et}),(null!==(st=globalThis.litElementVersions)&&void 0!==st?st:globalThis.litElementVersions=[]).push("3.3.3");const lt=0,ht=1,at=2,ut=3;class ct{name;seed;is_bye;extra_info;constructor(t,i,s=!1,e){this.name=e,this.seed=t,this.is_bye=s,this.extra_info=i}static bye(t){return new ct(t,{},this.is_bye=!0,"Bye")}}class dt{num;id;player_1;player_2;player_1_score;player_2_score;result;next_winner;next_looser;previous_up;previous_down;column;extra_info;constructor(t,i,s=null){this.num=t,null==s&&(s=String(t)),this.column=i,this.id=s,this.player_1=null,this.player_2=null,this.player_1_score=0,this.player_2_score=0,this.result=lt,this.next_winner=null,this.next_looser=null,this.previous_up=null,this.previous_down=null,this.extra_info={}}hasPrevious(){return null!==this.previous_up}hasNext(){return null!==this.next_winner}hasPlayers(){return null!==this.player_1&&null!==this.player_2}}class vt{stages_columns_number=null;per_column_stage=null;n_players=null;n_stages=null;players=null;stages=null;first_non_executed_stage=0;constructor(t){this.players=t,this.n_players=t.length,this.n_stages=this.n_players-1,this.stages_columns_number=function(t){let i=[];for(let s=1;s<t;s*=2)i.push(s);return i.reverse(),i}(this.n_stages),this.first_non_executed_stage=0,this._createStages(),this._assignPlayers(this.stages[this.stages.length-1],[...this.players]),this._updateFirstNonExecutedStage()}_createStages(){let t=[],i=[],s=0,e=0;for(let n=0;n<this.stages_columns_number.length;n++){i[n]=[];let o=this.stages_columns_number[n],r=s;for(s+=o;e<s;){let s=new dt(e,n);n+1<this.stages_columns_number.length&&(s.next_winner=ot(e,r,o)),n>0&&(s.previous_up=rt(e,r,o),s.previous_down=s.previous_up+1),t.push(s),i[n].push(e),e++}}this.stages=t,this.per_column_stage=i}_assignPlayers(t,i){if(2==i.length)return t.player_1=i[0],void(t.player_2=i[1]);let s=[],e=[];for(;i.length>3;)s.push(i.shift()),e.push(i.shift()),e.push(i.shift()),s.push(i.shift());this._assignPlayers(this.stages[t.previous_up],s),this._assignPlayers(this.stages[t.previous_down],e)}assignUniqueToColumnStages(t,i,s){for(let e=0;e<this.per_column_stage.length;e++){let n=this.per_column_stage[e];for(let o of n){this.stages[o].extra_info[t]=i.slice(s*e,s*e+s)}}}consolePrint(){var t,i,s;console.log("--- Printing current tree ---"),t=this.stages[this.stages.length-1],i=t=>{let i="";return i+=t.player_1?` ${t.player_1.name}`:" -",i+=" vs ",i+=t.player_2?`${t.player_2.name}`:"-",i+=` (${t.player_1_score} - ${t.player_2_score})`,String(t.num)+i},s=t=>t.hasPrevious()?[this.stages[t.previous_up],this.stages[t.previous_down]]:[],function t(e,n){const o=0===n.length,r=s(e)||[];let l="";o||(l=r&&0!==r.length?"┬ ":"─ ");const h=i(e,`${n}${l}`);"string"==typeof h&&console.log(`${n}${l}${h}`);let a=n;if(!o){const t="└─"===n.slice(-2);a=n.slice(0,-2)+(t?"  ":"│ ")}const u=a+"├─",c=a+"└─";r.forEach(((i,s)=>{t(i,r.length-1===s?c:u)}))}(t,""),console.log("\n")}validate(){for(let t of this.stages)t.hasPrevious()&&(t.num===this.stages[t.previous_up].next_winner&&t.num===this.stages[t.previous_down].next_winner||console.error(`[test_previous_stage] Invalid stage found ${t.num} `)),t.hasNext()&&t.num!==this.stages[t.next_winner].previous_up&&t.num!==this.stages[t.next_winner].previous_down&&console.error(`[test_next_stage] Invalid stage found ${t.num} `)}_updateFirstNonExecutedStage(){for(let t of this.stages)if(t.result==lt){if(t.player_2.is_bye){this.addResultVictory(t.num,ht);continue}if(t.player_1.is_bye){this.addResultVictory(t.num,at);continue}return this.first_non_executed_stage=t.num,void(t.hasPlayers()||console.error("First non executed stage should have players"))}this.finished=!0}getNextStage(){return this.finished?null:this.stages[this.first_non_executed_stage]}addResultPoints(t,i,s){let e=this.stages[t];e.player_1_score=i,e.player_2_score=s;let n=ut;i>s&&(n=ht),i<s&&(n=at),this.addResultVictory(t,n)}addResultVictory(t,i){i==ut&&console.error("Not implemented");let s=this.stages[t];s.result=i;let e=ht==i?s.player_1:s.player_2;if(s.hasNext()){let i=this.stages[s.next_winner];i.previous_up==t?i.player_1=e:i.player_2=e}this._updateFirstNonExecutedStage()}}class pt{constructor(){this.players=null,this.bracket=null}_createPlayers(t,i,s){let e=[];for(let i=0;i<t.length;i++in t){let n=t[i];e.push(new ct(i,n,!1,s(n)))}for(;e.length<i;)e.push(ct.bye(e.length));return e}create(t,i=(t=>t.name)){let s=function(t){let i=t;i|=i>>1,i|=i>>2,i|=i>>4,i|=i>>8,i|=i>>16,i|=i>>32;let s=i-(i>>1);return s=s==t?s:2*s,s}(t.length);this.players=this._createPlayers(t,s,i),this.bracket=new vt(this.players)}assignUniqueToColumnStages(t,i,s){this.bracket.assignUniqueToColumnStages(t,i,s)}hasNextStage(){return!this.bracket.finished}getNextStage(){return this.bracket.getNextStage()}load(t){}addResultPoints(t,i,s){this.bracket.addResultPoints(t,i,s)}addResultVictory(t,i){this.bracket.addResultVictory(t,i)}}function ft(){return o`
        .t-row {
            display: flex;
            flex-direction: row;
        }

        .t-column {
            display: flex;
            flex-direction: column;
        }

        .t-hide {
            visibility: hidden;
        }
        
        .gap-5 {
            gap: 5%;
        }
    `}window.customElements.define("tournament-stage",class extends et{static get styles(){return[ft(),o`
            .stage-players {
                border: 1px solid black;
                border-radius: 10px;
            }

            .p-name {
                padding: 0.3rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: clip;
                width: 10rem;
                height: 1rem;
                display: flex;
                align-items: center;
            }

            .p-color-band {
                min-width: 0.6rem;
                min-height: 100%;
            }

            .p-color-band-top {
                border-radius: 10px 0 0 0;
            }

            .p-color-band-bottom {
                border-radius: 0 0 0 10px;
            }

            .p-green {
                background-color: #638c80;
            }

            .pt-green {
                color: #04400b;
            }

            .p-blue {
                background-color: #43a9dd;
            }

            .pt-blue {
                color: #9d9be1;
            }

            .p-grey {
                background-color: #b2c4cb;
            }

            .pt-grey {
                color: #b2c4cb;
            }

            .p-red {
                background-color: #f09ca2;
            }

            .pt-red {
                color: #a70000;
            }
            
            .arrow {
                position: absolute;
                width: 100px;
                height: 2rem;
                border: 0;
                background-color: black;
                clip-path: polygon(80% 45%, 80% 30%, 100% 55%, 80% 82%, 80% 65%, 0 65%, 0 45%);
                border-radius: 0.01px;
                padding: 1px;
                margin: -1px;
            }

            .p-score {
                padding-right: 5px;
                padding-left: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-left: 1px solid;
                border-color: black;
                font-weight: bold;
            }

            .back-line {
                position: absolute;
                width: 2.5rem;
                height: 1px;
                border: 1px sold black;
            }
        `]}static get properties(){return{stage:{type:dt}}}constructor(){super()}render(){this._getIsBye(this.stage.player_1)||this._getIsBye(this.stage.player_2);let t="grey",i="grey";return this.stage.hasPlayers()&&(t="blue",i="blue"),this.stage.result==ht&&(t="green",i="red"),this.stage.result==at&&(t="grey",i="red"),I`
            <div class="t-row ${""}">
                <div class="stage-players t-column">
                    <div class="t-row p-row">
                        <div class="p-color-band p-color-band-top p-${t}"></div>
                        <div class="p-name">${this._getName(this.stage.player_1)}</div>
                        <div class="p-score pt-${t}">${this.stage.player_1_score}</div>
                    </div>
                    <div class="t-row p-row">
                        <div class="p-color-band p-color-band-bottom p-${i}"></div>
                        <div class="p-name">${this._getName(this.stage.player_2)}</div>
                        <div class="p-score pt-${i}">${this.stage.player_2_score}</div>
                    </div>
                </div>
                <div class="arrow-parent">
                    <div class="back-line" style="">
                </div>
                </duv>
            </div>
        `}_onClick(){}_getName(t){return null!==t?t.name:""}_getIsBye(t){return null!==t&&t.is_bye}});class gt extends et{static get styles(){return[ft(),o`
        .per-stage-column {
          gap: 1rem;
          justify-content: space-around;
        }
      `]}static get properties(){return{tournament:{type:pt}}}constructor(){super(),this.t=null}_print_stages(t,i){let s=[];for(let e of i){let i=t.stages[e];s.push(I`<tournament-stage id="${i.num}" .stage="${i}"></tournament-stage>`)}return s}_print_columns(t){let i=[];for(let s=0;s<t.per_column_stage.length;s++){let e=t.per_column_stage[s];i.push(I`<div class="t-column per-stage-column">${this._print_stages(t,e)}</div>`)}return i}setTournament(t){this.t=t,this.requestUpdate()}i(t){}render(){if(!this.t)return I``;let t=this.t.bracket;return I`<div class="t-row gap-5">${this._print_columns(t)}</div>`}_onClick(){this.count++,this.dispatchEvent(new CustomEvent("count-changed"))}}window.customElements.define("tournament-viewer",gt);export{gt as TournamentViewer};
