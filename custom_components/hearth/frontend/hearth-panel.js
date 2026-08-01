const t="0.1.0",e=["#e0603a","#3a86c8","#4f9d69","#c9a227","#8e6bbf","#d1707f"];function i(t,e,i,r){var s,a=arguments.length,n=a<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,r);else for(var o=t.length-1;o>=0;o--)(s=t[o])&&(n=(a<3?s(n):a>3?s(e,i,n):s(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const r=globalThis,s=r.ShadowRoot&&(void 0===r.ShadyCSS||r.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,a=Symbol(),n=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==a)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const l=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,r)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[r+1],t[0]);return new o(i,t,a)},d=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,a))(e)})(t):t,{is:h,defineProperty:c,getOwnPropertyDescriptor:p,getOwnPropertyNames:u,getOwnPropertySymbols:m,getPrototypeOf:f}=Object,g=globalThis,_=g.trustedTypes,y=_?_.emptyScript:"",v=g.reactiveElementPolyfillSupport,$=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?y:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},w=(t,e)=>!h(t,e),x={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:w};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let A=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(t,i,e);void 0!==r&&c(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){const{get:r,set:s}=p(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:r,set(e){const a=r?.call(this);s?.call(this,e),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty($("elementProperties")))return;const t=f(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($("properties"))){const t=this.properties,e=[...u(t),...m(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(d(t))}else void 0!==t&&e.push(d(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(s)t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of e){const e=document.createElement("style"),s=r.litNonce;void 0!==s&&e.setAttribute("nonce",s),e.textContent=i.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(void 0!==r&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(r):this.setAttribute(r,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,r=i._$Eh.get(t);if(void 0!==r&&this._$Em!==r){const t=i.getPropertyOptions(r),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=r;const a=s.fromAttribute(e,t.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(t,e,i,r=!1,s){if(void 0!==t){const a=this.constructor;if(!1===r&&(s=this[t]),i??=a.getPropertyOptions(t),!((i.hasChanged??w)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:r,wrapped:s},a){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),!0!==s||void 0!==a)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===r&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,r=this[e];!0!==t||this._$AL.has(e)||void 0===r||this.C(e,void 0,i,r)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[$("elementProperties")]=new Map,A[$("finalized")]=new Map,v?.({ReactiveElement:A}),(g.reactiveElementVersions??=[]).push("2.1.2");const k=globalThis,E=t=>t,S=k.trustedTypes,C=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,D="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,H="?"+T,M=`<${H}>`,P=document,O=()=>P.createComment(""),N=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,R="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,L=/>/g,j=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),V=/'/g,F=/"/g,B=/^(?:script|style|textarea|title)$/i,W=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),q=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),Z=new WeakMap,Y=P.createTreeWalker(P,129);function G(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,r=[];let s,a=2===e?"<svg>":3===e?"<math>":"",n=z;for(let e=0;e<i;e++){const i=t[e];let o,l,d=-1,h=0;for(;h<i.length&&(n.lastIndex=h,l=n.exec(i),null!==l);)h=n.lastIndex,n===z?"!--"===l[1]?n=I:void 0!==l[1]?n=L:void 0!==l[2]?(B.test(l[2])&&(s=RegExp("</"+l[2],"g")),n=j):void 0!==l[3]&&(n=j):n===j?">"===l[0]?(n=s??z,d=-1):void 0===l[1]?d=-2:(d=n.lastIndex-l[2].length,o=l[1],n=void 0===l[3]?j:'"'===l[3]?F:V):n===F||n===V?n=j:n===I||n===L?n=z:(n=j,s=void 0);const c=n===j&&t[e+1].startsWith("/>")?" ":"";a+=n===z?i+M:d>=0?(r.push(o),i.slice(0,d)+D+i.slice(d)+T+c):i+T+(-2===d?e:c)}return[G(t,a+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),r]};class X{constructor({strings:t,_$litType$:e},i){let r;this.parts=[];let s=0,a=0;const n=t.length-1,o=this.parts,[l,d]=J(t,e);if(this.el=X.createElement(l,i),Y.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(r=Y.nextNode())&&o.length<n;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(D)){const e=d[a++],i=r.getAttribute(t).split(T),n=/([.?@])?(.*)/.exec(e);o.push({type:1,index:s,name:n[2],strings:i,ctor:"."===n[1]?rt:"?"===n[1]?st:"@"===n[1]?at:it}),r.removeAttribute(t)}else t.startsWith(T)&&(o.push({type:6,index:s}),r.removeAttribute(t));if(B.test(r.tagName)){const t=r.textContent.split(T),e=t.length-1;if(e>0){r.textContent=S?S.emptyScript:"";for(let i=0;i<e;i++)r.append(t[i],O()),Y.nextNode(),o.push({type:2,index:++s});r.append(t[e],O())}}}else if(8===r.nodeType)if(r.data===H)o.push({type:2,index:s});else{let t=-1;for(;-1!==(t=r.data.indexOf(T,t+1));)o.push({type:7,index:s}),t+=T.length-1}s++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,r){if(e===q)return e;let s=void 0!==r?i._$Co?.[r]:i._$Cl;const a=N(e)?void 0:e._$litDirective$;return s?.constructor!==a&&(s?._$AO?.(!1),void 0===a?s=void 0:(s=new a(t),s._$AT(t,i,r)),void 0!==r?(i._$Co??=[])[r]=s:i._$Cl=s),void 0!==s&&(e=Q(t,s._$AS(t,e.values),s,r)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,r=(t?.creationScope??P).importNode(e,!0);Y.currentNode=r;let s=Y.nextNode(),a=0,n=0,o=i[0];for(;void 0!==o;){if(a===o.index){let e;2===o.type?e=new et(s,s.nextSibling,this,t):1===o.type?e=new o.ctor(s,o.name,o.strings,this,t):6===o.type&&(e=new nt(s,this,t)),this._$AV.push(e),o=i[++n]}a!==o?.index&&(s=Y.nextNode(),a++)}return Y.currentNode=P,r}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,r){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),N(t)?t===K||null==t||""===t?(this._$AH!==K&&this._$AR(),this._$AH=K):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==K&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,r="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=X.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(e);else{const t=new tt(r,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=Z.get(t.strings);return void 0===e&&Z.set(t.strings,e=new X(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,r=0;for(const s of t)r===e.length?e.push(i=new et(this.O(O()),this.O(O()),this,this.options)):i=e[r],i._$AI(s),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=E(t).nextSibling;E(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,r,s){this.type=1,this._$AH=K,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=K}_$AI(t,e=this,i,r){const s=this.strings;let a=!1;if(void 0===s)t=Q(this,t,e,0),a=!N(t)||t!==this._$AH&&t!==q,a&&(this._$AH=t);else{const r=t;let n,o;for(t=s[0],n=0;n<s.length-1;n++)o=Q(this,r[i+n],e,n),o===q&&(o=this._$AH[n]),a||=!N(o)||o!==this._$AH[n],o===K?t=K:t!==K&&(t+=(o??"")+s[n+1]),this._$AH[n]=o}a&&!r&&this.j(t)}j(t){t===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class rt extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===K?void 0:t}}class st extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==K)}}class at extends it{constructor(t,e,i,r,s){super(t,e,i,r,s),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??K)===q)return;const i=this._$AH,r=t===K&&i!==K||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==K&&(i===K||r);r&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const ot=k.litHtmlPolyfillSupport;ot?.(X,et),(k.litHtmlVersions??=[]).push("3.3.3");const lt=globalThis;class dt extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const r=i?.renderBefore??e;let s=r._$litPart$;if(void 0===s){const t=i?.renderBefore??null;r._$litPart$=s=new et(e.insertBefore(O(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}dt._$litElement$=!0,dt.finalized=!0,lt.litElementHydrateSupport?.({LitElement:dt});const ht=lt.litElementPolyfillSupport;ht?.({LitElement:dt}),(lt.litElementVersions??=[]).push("4.2.2");const ct=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},pt={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:w},ut=(t=pt,e,i)=>{const{kind:r,metadata:s}=i;let a=globalThis.litPropertyMetadata.get(s);if(void 0===a&&globalThis.litPropertyMetadata.set(s,a=new Map),"setter"===r&&((t=Object.create(t)).wrapped=!0),a.set(i.name,t),"accessor"===r){const{name:r}=i;return{set(i){const s=e.get.call(this);e.set.call(this,i),this.requestUpdate(r,s,t,!0,i)},init(e){return void 0!==e&&this.C(r,void 0,t,e),e}}}if("setter"===r){const{name:r}=i;return function(i){const s=this[r];e.call(this,i),this.requestUpdate(r,s,t,!0,i)}}throw Error("Unsupported decorator location: "+r)};function mt(t){return(e,i)=>"object"==typeof i?ut(t,e,i):((t,e,i)=>{const r=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),r?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function ft(t){return mt({...t,state:!0,attribute:!1})}function gt(t){return!0===t.attributes?.hearth_board}function _t(t,e){const i={};for(const e of[...t.sharedCalendars,...t.readonlyCalendars])i[e]={memberId:null,color:"#7a8b99"};for(const e of t.members)for(const t of e.calendars)i[t]={memberId:e.id,color:e.color};return i}function yt(t){const e=new Set(t.readonlyCalendars),i=[...t.sharedCalendars,...t.members.flatMap(t=>t.calendars)];return[...new Set(i)].filter(t=>!e.has(t))}function vt(t,e){const i=t.states[e];return i?.attributes?.friendly_name||e}const $t=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];function bt(t){const e=new Date(t);return e.setHours(0,0,0,0),e}function wt(t,e){const i=new Date(t);return i.setDate(i.getDate()+e),i}function xt(t,e){const i=new Date(t);return i.setDate(1),i.setMonth(i.getMonth()+e),i}function At(t){const e=bt(t);return e.setDate(1),e}function kt(t,e){const i=bt(t);return wt(i,-(i.getDay()-e+7)%7)}function Et(t){return function(t,e){return t.getFullYear()===e.getFullYear()&&t.getMonth()===e.getMonth()&&t.getDate()===e.getDate()}(t,new Date)}function St(t){const e=`${t.getMonth()+1}`.padStart(2,"0"),i=`${t.getDate()}`.padStart(2,"0");return`${t.getFullYear()}-${e}-${i}`}function Ct(t){const e=t=>`${t}`.padStart(2,"0");return`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())} ${e(t.getHours())}:${e(t.getMinutes())}:00`}function Dt(t){const e=t=>`${t}`.padStart(2,"0");return`${e(t.getHours())}:${e(t.getMinutes())}`}function Tt(t){switch(t.locale?.time_format){case"12":return!0;case"24":return!1;default:return}}function Ht(t){return t.locale?.language||t.language||"en"}function Mt(t){return t.date?{date:bt(new Date(`${t.date}T00:00:00`)),allDay:!0}:{date:new Date(t.dateTime),allDay:!1}}async function Pt(t,e,i,r){const s=`start=${encodeURIComponent(i.toISOString())}&end=${encodeURIComponent(r.toISOString())}`,a=await Promise.all(Object.keys(e).map(async i=>{try{const r=await t.callApi("GET",`calendars/${i}?${s}`);return{entityId:i,events:(r||[]).map(t=>function(t,e,i){if(!t?.start||!t?.end)return null;const r=Mt(t.start),s=Mt(t.end);return Number.isNaN(r.date.getTime())||Number.isNaN(s.date.getTime())?null:{summary:t.summary||"",start:r.date,end:s.date,allDay:r.allDay,calendar:e,memberId:i.memberId,color:i.color,description:t.description,location:t.location,uid:t.uid,recurrenceId:t.recurrence_id}}(t,i,e[i])).filter(t=>null!==t)}}catch(t){return console.warn(`[hearth] could not load ${i}`,t),{entityId:i,events:null}}})),n=[],o=[];for(const t of a)null===t.events?o.push(t.entityId):n.push(...t.events);return n.sort((t,e)=>t.allDay!==e.allDay?t.allDay?-1:1:t.start.getTime()-e.start.getTime()),{events:n,failed:o}}function Ot(t,e){const i=[];for(let r=bt(t);r<e;r=wt(r,1))i.push(r);return i}function Nt(t,e){const i=e.map(t=>({key:St(t),from:t.getTime(),to:wt(t,1).getTime()})),r=new Map(i.map(t=>[t.key,[]]));for(const e of t){const t=e.start.getTime(),s=e.end.getTime();for(const a of i)t<a.to&&s>a.from&&r.get(a.key).push(e)}return r}const Ut=l`
  :host {
    --hearth-gap: 8px;
    --hearth-radius: 12px;
    --hearth-touch: 44px;
    --hearth-muted: var(--secondary-text-color, #7a7a7a);
    --hearth-line: var(--divider-color, rgba(127, 127, 127, 0.25));
    --hearth-surface: var(--card-background-color, #fff);
    --hearth-surface-alt: rgba(127, 127, 127, 0.08);
    --hearth-today: var(--primary-color, #03a9f4);
  }
`,Rt=l`
  button {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--hearth-touch);
    min-height: var(--hearth-touch);
    border-radius: 50%;
    color: var(--hearth-muted);
  }

  .icon-button:active {
    background: var(--hearth-surface-alt);
  }

  .icon-button svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }

  .segmented {
    display: inline-flex;
    border: 1px solid var(--hearth-line);
    border-radius: calc(var(--hearth-touch) / 2);
    overflow: hidden;
  }

  .segmented button {
    min-height: 36px;
    padding: 0 14px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--hearth-muted);
  }

  .segmented button[aria-pressed='true'] {
    background: var(--hearth-today);
    color: var(--text-primary-color, #fff);
  }
`,zt=l`
  .scrim {
    position: fixed;
    inset: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(0, 0, 0, 0.5);
  }

  .sheet {
    width: min(560px, 100%);
    max-height: 90vh;
    overflow-y: auto;
    background: var(--hearth-surface);
    color: var(--primary-text-color);
    border-radius: var(--hearth-radius);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
    padding: 20px;
    box-sizing: border-box;
  }

  .sheet h2 {
    margin: 0 0 16px;
    font-size: 1.25rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 14px;
  }

  .field > label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--hearth-muted);
  }

  .field input[type='text'],
  .field input[type='date'],
  .field input[type='time'],
  .field textarea,
  .field select {
    font: inherit;
    color: inherit;
    min-height: var(--hearth-touch);
    padding: 8px 12px;
    box-sizing: border-box;
    background: var(--hearth-surface-alt);
    border: 1px solid var(--hearth-line);
    border-radius: 8px;
  }

  .field textarea {
    min-height: 72px;
    resize: vertical;
  }

  .row {
    display: flex;
    gap: var(--hearth-gap);
  }

  .row > .field {
    flex: 1;
  }

  /* The whole row toggles, so the target is the row rather than a 13px native box. */
  .switch-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: calc(var(--hearth-touch) + 8px);
    margin-bottom: 14px;
    padding: 0 12px;
    box-sizing: border-box;
    background: var(--hearth-surface-alt);
    border: 1px solid var(--hearth-line);
    border-radius: 8px;
    font: inherit;
    color: inherit;
    text-align: left;
  }

  .switch-row:active {
    border-color: var(--hearth-today);
  }

  .switch {
    position: relative;
    flex: none;
    width: 52px;
    height: 30px;
    border-radius: 15px;
    background: var(--hearth-line);
    transition: background 140ms ease;
  }

  .switch::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
    transition: transform 140ms ease;
  }

  .switch-row[aria-checked='true'] .switch {
    background: var(--hearth-today);
  }

  .switch-row[aria-checked='true'] .switch::after {
    transform: translateX(22px);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--hearth-gap);
    margin-top: 20px;
  }

  .actions button {
    min-height: var(--hearth-touch);
    padding: 0 20px;
    border-radius: 8px;
    font-weight: 600;
  }

  .actions .primary {
    background: var(--hearth-today);
    color: var(--text-primary-color, #fff);
  }

  .actions .primary[disabled] {
    opacity: 0.5;
    cursor: default;
  }

  .actions .ghost {
    color: var(--hearth-muted);
  }

  .error {
    margin: 0 0 12px;
    padding: 10px 12px;
    border-radius: 8px;
    background: rgba(200, 60, 60, 0.12);
    color: var(--error-color, #c33);
    font-size: 0.85rem;
  }
`;let It=class extends dt{constructor(){super(...arguments),this._summary="",this._calendar="",this._dateKey="",this._allDay=!0,this._startTime="",this._endTime="",this._description="",this._saving=!1}connectedCallback(){super.connectedCallback();const t=yt(this.board);this._calendar=this.defaultCalendar&&t.includes(this.defaultCalendar)?this.defaultCalendar:t[0]??"",this._dateKey=St(this.day);const e=new Date(this.day);e.setHours(9,0,0,0),this._startTime=Dt(e),e.setHours(e.getHours()+1),this._endTime=Dt(e)}_close(){this.dispatchEvent(new CustomEvent("hearth-close",{bubbles:!0,composed:!0}))}_onScrimClick(t){t.target===t.currentTarget&&this._close()}async _save(){const t=this._summary.trim();if(!t||!this._calendar||this._saving)return;const e=function(t){const[e,i,r]=t.split("-").map(Number);return new Date(e,i-1,r)}(this._dateKey);let i,r;if(this._allDay)i=e,r=wt(e,1);else{const[t,s]=this._startTime.split(":").map(Number),[a,n]=this._endTime.split(":").map(Number);i=new Date(e),i.setHours(t,s,0,0),r=new Date(e),r.setHours(a,n,0,0),r<=i&&(r=wt(r,1))}this._saving=!0,this._error=void 0;try{await async function(t,e,i){const r={summary:i.summary};i.description&&(r.description=i.description),i.allDay?(r.start_date=St(i.start),r.end_date=St(i.end)):(r.start_date_time=Ct(i.start),r.end_date_time=Ct(i.end)),await t.callService("calendar","create_event",r,{entity_id:e})}(this.hass,this._calendar,{summary:t,start:i,end:r,allDay:this._allDay,description:this._description.trim()||void 0}),this.dispatchEvent(new CustomEvent("hearth-created",{bubbles:!0,composed:!0})),this._close()}catch(t){this._error=t instanceof Error?t.message:"The event could not be created."}finally{this._saving=!1}}_calendarOptions(){const t=new Map;for(const e of this.board.members)for(const i of e.calendars)t.set(i,e.name);return yt(this.board).map(e=>{const i=t.get(e),r=i?`${i} — ${vt(this.hass,e)}`:vt(this.hass,e);return W`<option value=${e} ?selected=${e===this._calendar}>
        ${r}
      </option>`})}render(){const t=this._calendarOptions(),e=Boolean(this._summary.trim()&&this._calendar)&&!this._saving;return W`
      <div class="scrim" @click=${this._onScrimClick}>
        <div class="sheet" role="dialog" aria-modal="true">
          <h2>New event</h2>

          ${this._error?W`<p class="error">${this._error}</p>`:K}
          ${0===t.length?W`<p class="error">
                No writable calendar is configured. Add calendars to a family member, or
                remove one from the read-only list.
              </p>`:K}

          <div class="field">
            <label for="summary">Title</label>
            <input
              id="summary"
              type="text"
              .value=${this._summary}
              autocomplete="off"
              @input=${t=>{this._summary=t.target.value}}
            />
          </div>

          <div class="field">
            <label for="calendar">Calendar</label>
            <select
              id="calendar"
              @change=${t=>{this._calendar=t.target.value}}
            >
              ${t}
            </select>
          </div>

          <div class="field">
            <label for="date">Date</label>
            <input
              id="date"
              type="date"
              .value=${this._dateKey}
              @change=${t=>{this._dateKey=t.target.value}}
            />
          </div>

          <button
            id="allday"
            class="switch-row"
            role="switch"
            aria-checked=${this._allDay}
            @click=${()=>{this._allDay=!this._allDay}}
          >
            <span>All day</span>
            <span class="switch"></span>
          </button>

          ${this._allDay?K:W`
                <div class="row">
                  <div class="field">
                    <label for="from">From</label>
                    <input
                      id="from"
                      type="time"
                      .value=${this._startTime}
                      @change=${t=>{this._startTime=t.target.value}}
                    />
                  </div>
                  <div class="field">
                    <label for="to">To</label>
                    <input
                      id="to"
                      type="time"
                      .value=${this._endTime}
                      @change=${t=>{this._endTime=t.target.value}}
                    />
                  </div>
                </div>
              `}

          <div class="field">
            <label for="note">Note</label>
            <textarea
              id="note"
              .value=${this._description}
              @input=${t=>{this._description=t.target.value}}
            ></textarea>
          </div>

          <div class="actions">
            <button class="ghost" @click=${this._close}>Cancel</button>
            <button class="primary" ?disabled=${!e} @click=${this._save}>
              ${this._saving?"Saving…":"Save"}
            </button>
          </div>
        </div>
      </div>
    `}};It.styles=[Ut,Rt,zt],i([mt({attribute:!1})],It.prototype,"hass",void 0),i([mt({attribute:!1})],It.prototype,"board",void 0),i([mt({attribute:!1})],It.prototype,"day",void 0),i([mt({attribute:!1})],It.prototype,"defaultCalendar",void 0),i([ft()],It.prototype,"_summary",void 0),i([ft()],It.prototype,"_calendar",void 0),i([ft()],It.prototype,"_dateKey",void 0),i([ft()],It.prototype,"_allDay",void 0),i([ft()],It.prototype,"_startTime",void 0),i([ft()],It.prototype,"_endTime",void 0),i([ft()],It.prototype,"_description",void 0),i([ft()],It.prototype,"_saving",void 0),i([ft()],It.prototype,"_error",void 0),It=i([ct("hearth-event-dialog")],It);const Lt=["month","week","day"],jt={month:"Month",week:"Week",day:"Day"},Vt="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z",Ft="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",Bt="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z",Wt="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",qt="M13,14H11V9H13M13,18H11V16H13M1,21H23L12,2L1,21Z";let Kt=class extends dt{constructor(){super(...arguments),this._config={type:""},this._view="month",this._anchor=bt(new Date),this._events=[],this._failed=[],this._loading=!1,this._loadedSignature="",this._reloadToken=0}setConfig(t){this._config={...t},t.view&&Lt.includes(t.view)&&(this._view=t.view)}getCardSize(){return"month"===this._view?12:8}getGridOptions(){return{columns:"full",rows:"month"===this._view?12:8}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._reload(),3e5)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&(window.clearInterval(this._timer),this._timer=void 0)}updated(t){super.updated(t),this._maybeFetch()}get _board(){return this.hass?function(t,i){let r;if(i){if(r=t.states[i],!r)return null}else if(r=Object.values(t.states).find(gt),!r)return null;const s=r.attributes,a=(Array.isArray(s.members)?s.members:[]).map((t,i)=>{const r=t;return{id:String(r.id??i),name:String(r.name??""),color:r.color||e[i%e.length],avatar:r.avatar??null,person:r.person??null,calendars:r.calendars??[],todo_lists:r.todo_lists??[],order:r.order??i}});a.sort((t,e)=>t.order-e.order||t.name.localeCompare(e.name));const n=t=>Array.isArray(s[t])?s[t]:[];return{entityId:r.entity_id,members:a,sharedCalendars:n("shared_calendars"),sharedTodoLists:n("shared_todo_lists"),readonlyCalendars:n("readonly_calendars")}}(this.hass,this._config.board_entity):null}get _firstDay(){return this.hass?function(t){const e=t.locale?.first_weekday;if(e&&"language"!==e){const t=$t.indexOf(e);if(t>=0)return t}try{const e=new Intl.Locale(t.locale?.language||t.language||"en").weekInfo;if(e?.firstDay)return e.firstDay%7}catch{}return 1}(this.hass):1}_range(){if("month"===this._view){const{start:t,end:e}=function(t,e){const i=kt(At(t),e);let r=kt(wt(xt(At(t),1),-1),e);r=wt(r,7);let s=Math.round((r.getTime()-i.getTime())/6048e5);return s<6&&(r=wt(r,7*(6-s)),s=6),{start:i,end:r,weeks:s}}(this._anchor,this._firstDay);return{start:t,end:e}}if("week"===this._view){const t=kt(this._anchor,this._firstDay);return{start:t,end:wt(t,7)}}const t=bt(this._anchor);return{start:t,end:wt(t,1)}}_reload(){this._reloadToken+=1,this._maybeFetch()}async _maybeFetch(){const t=this.hass,e=this._board;if(!t||!e)return;const i=_t(e),r=Object.keys(i).sort(),{start:s,end:a}=this._range(),n=r.map(e=>t.states[e]?.last_changed??"-"),o=[s.getTime(),a.getTime(),r.join(","),n.join(","),this._reloadToken].join("|");if(o!==this._loadedSignature){if(this._loadedSignature=o,0===r.length)return this._events=[],void(this._failed=[]);this._loading=!0;try{const{events:e,failed:r}=await Pt(t,i,s,a);this._loadedSignature===o&&(this._events=e,this._failed=r)}finally{this._loadedSignature===o&&(this._loading=!1)}}}_step(t){"month"===this._view?this._anchor=xt(this._anchor,t):"week"===this._view?this._anchor=wt(this._anchor,7*t):this._anchor=wt(this._anchor,t)}_goToday(){this._anchor=bt(new Date)}_setView(t){this._view=t}get _createEnabled(){return!1!==this._config.create}_openCreate(t){this._createEnabled&&(this._dialogDay=t)}_openDay(t){this._anchor=bt(t),this._view="day"}_formatTime(t){return new Intl.DateTimeFormat(Ht(this.hass),{hour:"numeric",minute:"2-digit",hour12:Tt(this.hass)}).format(t)}_title(){const t=Ht(this.hass);if("month"===this._view)return new Intl.DateTimeFormat(t,{month:"long",year:"numeric"}).format(this._anchor);if("week"===this._view){const{start:e,end:i}=this._range();return new Intl.DateTimeFormat(t,{day:"numeric",month:"short",year:"numeric"}).formatRange(e,wt(i,-1))}return new Intl.DateTimeFormat(t,{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(this._anchor)}_weekdayLabels(){const t=new Intl.DateTimeFormat(Ht(this.hass),{weekday:"short"}),e=kt(new Date,this._firstDay);return Array.from({length:7},(i,r)=>t.format(wt(e,r)))}_icon(t){return W`<svg viewBox="0 0 24 24"><path d=${t} /></svg>`}_renderEvent(t,e){const i=t.allDay?"":this._formatTime(t.start);return W`
      <div
        class="event ${t.allDay?"all-day":""}"
        style=${`--event-color:${t.color}`}
        title=${t.summary}
      >
        ${t.allDay?K:W`<span class="dot"></span><span class="time">${i}</span>`}
        <span class="summary">${t.summary}</span>
        ${e||!t.location?K:W`<span class="location">${t.location}</span>`}
      </div>
    `}_renderMonth(){const{start:t,end:e}=this._range(),i=Ot(t,e),r=Nt(this._events,i),s=this._config.max_events_per_day??3,a=this._anchor.getMonth();return W`
      <div class="weekday-row">
        ${this._weekdayLabels().map(t=>W`<div class="weekday">${t}</div>`)}
      </div>
      <div class="month-grid" style=${"--weeks:"+i.length/7}>
        ${i.map(t=>{const e=r.get(St(t))??[],i=e.slice(0,s),n=e.length-i.length;return W`
            <div
              class="day-cell ${t.getMonth()===a?"":"outside"} ${Et(t)?"today":""}"
              @click=${()=>this._openCreate(t)}
            >
              <button
                class="day-number"
                @click=${e=>{e.stopPropagation(),this._openDay(t)}}
              >
                ${t.getDate()}
              </button>
              <div class="day-events">
                ${i.map(t=>this._renderEvent(t,!0))}
                ${n>0?W`<button
                      class="more"
                      @click=${e=>{e.stopPropagation(),this._openDay(t)}}
                    >
                      +${n}
                    </button>`:K}
              </div>
            </div>
          `})}
      </div>
    `}_renderWeek(){const{start:t,end:e}=this._range(),i=Ot(t,e),r=Nt(this._events,i),s=new Intl.DateTimeFormat(Ht(this.hass),{weekday:"short",day:"numeric"});return W`
      <div class="week-grid">
        ${i.map(t=>{const e=r.get(St(t))??[];return W`
            <div
              class="week-column ${Et(t)?"today":""}"
              @click=${()=>this._openCreate(t)}
            >
              <div class="week-heading">${s.format(t)}</div>
              <div class="week-events">
                ${0===e.length?W`<div class="empty-hint">—</div>`:e.map(t=>this._renderEvent(t,!0))}
              </div>
            </div>
          `})}
      </div>
    `}_renderDay(){const{start:t,end:e}=this._range(),i=Nt(this._events,Ot(t,e)).get(St(t))??[];return W`
      <div class="day-list" @click=${()=>this._openCreate(t)}>
        ${0===i.length?W`<div class="empty-day">
              Nothing planned.${this._createEnabled?" Tap to add something.":""}
            </div>`:i.map(t=>this._renderEvent(t,!1))}
      </div>
    `}_renderLegend(t){return!1===this._config.show_legend||0===t.members.length?K:W`
      <div class="legend">
        ${t.members.map(t=>W`
            <span class="legend-item">
              <span class="swatch" style=${`background:${t.color}`}></span>
              ${t.name}
            </span>
          `)}
      </div>
    `}render(){if(!this.hass)return W`<ha-card></ha-card>`;const t=this._board;if(!t)return W`
        <ha-card>
          <div class="notice">
            No Hearth board found. Add the Hearth integration, or set
            <code>board_entity</code> in this card's configuration.
          </div>
        </ha-card>
      `;const e=_t(t),i=this._config.views??Lt;return W`
      <ha-card>
        <div class="toolbar">
          <button class="icon-button" @click=${()=>this._step(-1)} aria-label="Previous">
            ${this._icon(Vt)}
          </button>
          <button class="icon-button" @click=${this._goToday} aria-label="Today">
            ${this._icon(Bt)}
          </button>
          <button class="icon-button" @click=${()=>this._step(1)} aria-label="Next">
            ${this._icon(Ft)}
          </button>
          <h1 class="title">${this._title()}</h1>
          ${i.length>1?W`<div class="segmented">
                ${i.map(t=>W`
                    <button
                      aria-pressed=${this._view===t}
                      @click=${()=>this._setView(t)}
                    >
                      ${jt[t]}
                    </button>
                  `)}
              </div>`:K}
          ${this._createEnabled?W`<button
                class="icon-button"
                aria-label="New event"
                @click=${()=>this._openCreate(bt(this._anchor))}
              >
                ${this._icon(Wt)}
              </button>`:K}
        </div>

        ${this._renderLegend(t)}
        ${0===Object.keys(e).length?W`<div class="notice">
              No calendars are assigned yet. Open the Hearth integration's options and give
              your family members their calendars.
            </div>`:K}
        ${this._failed.length>0?W`<div class="warning">
              ${this._icon(qt)}
              <span>Could not load: ${this._failed.join(", ")}</span>
            </div>`:K}

        <div class="body ${this._loading?"loading":""}">
          ${"month"===this._view?this._renderMonth():"week"===this._view?this._renderWeek():this._renderDay()}
        </div>

        ${this._dialogDay?W`<hearth-event-dialog
              .hass=${this.hass}
              .board=${t}
              .day=${this._dialogDay}
              .defaultCalendar=${this._config.default_calendar}
              @hearth-close=${()=>{this._dialogDay=void 0}}
              @hearth-created=${()=>this._reload()}
            ></hearth-event-dialog>`:K}
      </ha-card>
    `}};Kt.styles=[Ut,Rt,l`
      ha-card {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
        padding: 12px;
        box-sizing: border-box;
      }

      .toolbar {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-wrap: wrap;
      }

      .title {
        flex: 1;
        margin: 0 8px;
        font-size: 1.3rem;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        padding: 8px 4px 4px;
      }

      .legend-item {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.85rem;
        color: var(--hearth-muted);
      }

      .swatch {
        width: 12px;
        height: 12px;
        border-radius: 3px;
      }

      .notice,
      .empty-day {
        padding: 20px 8px;
        color: var(--hearth-muted);
        font-size: 0.9rem;
      }

      .notice code {
        background: var(--hearth-surface-alt);
        padding: 1px 5px;
        border-radius: 4px;
      }

      .warning {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 4px;
        padding: 8px 10px;
        border-radius: 8px;
        background: rgba(230, 160, 30, 0.14);
        color: var(--warning-color, #b8860b);
        font-size: 0.82rem;
      }

      .warning svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
        flex: none;
      }

      .body {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        transition: opacity 120ms ease;
      }

      .body.loading {
        opacity: 0.55;
      }

      /* --- month --- */

      .weekday-row {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
        padding: 6px 0 4px;
      }

      .weekday {
        text-align: center;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--hearth-muted);
      }

      .month-grid {
        flex: 1;
        min-height: 0;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: repeat(var(--weeks, 6), minmax(64px, 1fr));
        gap: 2px;
      }

      .day-cell {
        display: flex;
        flex-direction: column;
        min-width: 0;
        padding: 2px;
        border-radius: 8px;
        background: var(--hearth-surface-alt);
        overflow: hidden;
      }

      .day-cell.outside {
        opacity: 0.45;
      }

      .day-cell.today {
        outline: 2px solid var(--hearth-today);
        outline-offset: -2px;
      }

      .day-number {
        align-self: flex-start;
        min-width: 26px;
        height: 26px;
        border-radius: 13px;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--hearth-muted);
      }

      .day-cell.today .day-number {
        background: var(--hearth-today);
        color: var(--text-primary-color, #fff);
      }

      .day-events {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
        overflow: hidden;
      }

      .more {
        align-self: flex-start;
        padding: 0 4px;
        font-size: 0.7rem;
        font-weight: 700;
        color: var(--hearth-muted);
      }

      /* --- week --- */

      .week-grid {
        flex: 1;
        min-height: 0;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
      }

      .week-column {
        display: flex;
        flex-direction: column;
        min-width: 0;
        border-radius: 8px;
        background: var(--hearth-surface-alt);
        overflow: hidden;
      }

      .week-column.today {
        outline: 2px solid var(--hearth-today);
        outline-offset: -2px;
      }

      .week-heading {
        padding: 6px 4px;
        text-align: center;
        font-size: 0.8rem;
        font-weight: 700;
        border-bottom: 1px solid var(--hearth-line);
      }

      .week-events {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        gap: 3px;
        padding: 4px 3px;
        overflow-y: auto;
      }

      .empty-hint {
        text-align: center;
        color: var(--hearth-muted);
        opacity: 0.5;
      }

      /* --- day --- */

      .day-list {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 8px 2px;
        overflow-y: auto;
      }

      .day-list .event {
        min-height: var(--hearth-touch);
        font-size: 1rem;
        align-items: center;
      }

      /* --- events --- */

      .event {
        display: flex;
        align-items: baseline;
        gap: 5px;
        min-width: 0;
        padding: 3px 6px;
        border-radius: 5px;
        border-left: 3px solid var(--event-color);
        background: color-mix(in srgb, var(--event-color) 18%, transparent);
        font-size: 0.78rem;
        line-height: 1.25;
      }

      .event.all-day {
        background: var(--event-color);
        color: #fff;
        border-left-color: transparent;
        font-weight: 600;
      }

      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--event-color);
        flex: none;
      }

      .time {
        font-variant-numeric: tabular-nums;
        font-weight: 600;
        flex: none;
      }

      .summary {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .location {
        color: var(--hearth-muted);
        font-size: 0.75rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `],i([mt({attribute:!1})],Kt.prototype,"hass",void 0),i([ft()],Kt.prototype,"_config",void 0),i([ft()],Kt.prototype,"_view",void 0),i([ft()],Kt.prototype,"_anchor",void 0),i([ft()],Kt.prototype,"_events",void 0),i([ft()],Kt.prototype,"_failed",void 0),i([ft()],Kt.prototype,"_loading",void 0),i([ft()],Kt.prototype,"_dialogDay",void 0),Kt=i([ct("hearth-calendar-card")],Kt),window.customCards=window.customCards||[],window.customCards.push({type:"hearth-calendar-card",name:"Hearth Calendar",description:"Family calendar as a month, week or day grid, coloured per member.",preview:!0,documentationURL:"https://github.com/DomCim/Homeassistant-daely"}),console.info(`%c HEARTH %c ${t} `,"color:#fff;background:#e0603a;font-weight:700;border-radius:3px 0 0 3px;padding:2px 6px","color:#e0603a;background:#2b2118;font-weight:700;border-radius:0 3px 3px 0;padding:2px 6px");export{t as HEARTH_VERSION};
