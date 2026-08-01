const t="0.2.0",e=["#e0603a","#3a86c8","#4f9d69","#c9a227","#8e6bbf","#d1707f"];function i(t,e,i,s){var r,a=arguments.length,n=a<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,s);else for(var o=t.length-1;o>=0;o--)(r=t[o])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const s=globalThis,r=s.ShadowRoot&&(void 0===s.ShadyCSS||s.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,a=Symbol(),n=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==a)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(r&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const d=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,a)},h=r?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,a))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:p,getOwnPropertyNames:u,getOwnPropertySymbols:m,getPrototypeOf:g}=Object,f=globalThis,_=f.trustedTypes,v=_?_.emptyScript:"",y=f.reactiveElementPolyfillSupport,b=(t,e)=>t,w={toAttribute(t,e){switch(e){case Boolean:t=t?v:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},x=(t,e)=>!l(t,e),$={attribute:!0,type:String,converter:w,reflect:!1,useDefault:!1,hasChanged:x};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let k=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=p(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const a=s?.call(this);r?.call(this,e),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=g(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...u(t),...m(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(h(t))}else void 0!==t&&e.push(h(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(r)t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of e){const e=document.createElement("style"),r=s.litNonce;void 0!==r&&e.setAttribute("nonce",r),e.textContent=i.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:w).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:w;this._$Em=s;const a=r.fromAttribute(e,t.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const a=this.constructor;if(!1===s&&(r=this[t]),i??=a.getPropertyOptions(t),!((i.hasChanged??x)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},a){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),!0!==r||void 0!==a)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[b("elementProperties")]=new Map,k[b("finalized")]=new Map,y?.({ReactiveElement:k}),(f.reactiveElementVersions??=[]).push("2.1.2");const C=globalThis,A=t=>t,S=C.trustedTypes,H=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,L="$lit$",D=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+D,E=`<${T}>`,M=document,z=()=>M.createComment(""),I=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,P="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,V=/>/g,j=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,F=/"/g,B=/^(?:script|style|textarea|title)$/i,Z=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),W=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),K=new WeakMap,G=M.createTreeWalker(M,129);function Y(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==H?H.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,s=[];let r,a=2===e?"<svg>":3===e?"<math>":"",n=N;for(let e=0;e<i;e++){const i=t[e];let o,d,h=-1,l=0;for(;l<i.length&&(n.lastIndex=l,d=n.exec(i),null!==d);)l=n.lastIndex,n===N?"!--"===d[1]?n=U:void 0!==d[1]?n=V:void 0!==d[2]?(B.test(d[2])&&(r=RegExp("</"+d[2],"g")),n=j):void 0!==d[3]&&(n=j):n===j?">"===d[0]?(n=r??N,h=-1):void 0===d[1]?h=-2:(h=n.lastIndex-d[2].length,o=d[1],n=void 0===d[3]?j:'"'===d[3]?F:R):n===F||n===R?n=j:n===U||n===V?n=N:(n=j,r=void 0);const c=n===j&&t[e+1].startsWith("/>")?" ":"";a+=n===N?i+E:h>=0?(s.push(o),i.slice(0,h)+L+i.slice(h)+D+c):i+D+(-2===h?e:c)}return[Y(t,a+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class X{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,a=0;const n=t.length-1,o=this.parts,[d,h]=J(t,e);if(this.el=X.createElement(d,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=G.nextNode())&&o.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(L)){const e=h[a++],i=s.getAttribute(t).split(D),n=/([.?@])?(.*)/.exec(e);o.push({type:1,index:r,name:n[2],strings:i,ctor:"."===n[1]?st:"?"===n[1]?rt:"@"===n[1]?at:it}),s.removeAttribute(t)}else t.startsWith(D)&&(o.push({type:6,index:r}),s.removeAttribute(t));if(B.test(s.tagName)){const t=s.textContent.split(D),e=t.length-1;if(e>0){s.textContent=S?S.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],z()),G.nextNode(),o.push({type:2,index:++r});s.append(t[e],z())}}}else if(8===s.nodeType)if(s.data===T)o.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(D,t+1));)o.push({type:7,index:r}),t+=D.length-1}r++}}static createElement(t,e){const i=M.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,s){if(e===W)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const a=I(e)?void 0:e._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),void 0===a?r=void 0:(r=new a(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=Q(t,r._$AS(t,e.values),r,s)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??M).importNode(e,!0);G.currentNode=s;let r=G.nextNode(),a=0,n=0,o=i[0];for(;void 0!==o;){if(a===o.index){let e;2===o.type?e=new et(r,r.nextSibling,this,t):1===o.type?e=new o.ctor(r,o.name,o.strings,this,t):6===o.type&&(e=new nt(r,this,t)),this._$AV.push(e),o=i[++n]}a!==o?.index&&(r=G.nextNode(),a++)}return G.currentNode=M,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),I(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&I(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=X.createElement(Y(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new tt(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=K.get(t.strings);return void 0===e&&K.set(t.strings,e=new X(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new et(this.O(z()),this.O(z()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=q}_$AI(t,e=this,i,s){const r=this.strings;let a=!1;if(void 0===r)t=Q(this,t,e,0),a=!I(t)||t!==this._$AH&&t!==W,a&&(this._$AH=t);else{const s=t;let n,o;for(t=r[0],n=0;n<r.length-1;n++)o=Q(this,s[i+n],e,n),o===W&&(o=this._$AH[n]),a||=!I(o)||o!==this._$AH[n],o===q?t=q:t!==q&&(t+=(o??"")+r[n+1]),this._$AH[n]=o}a&&!s&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class rt extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class at extends it{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??q)===W)return;const i=this._$AH,s=t===q&&i!==q||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==q&&(i===q||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const ot=C.litHtmlPolyfillSupport;ot?.(X,et),(C.litHtmlVersions??=[]).push("3.3.3");const dt=globalThis;class ht extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new et(e.insertBefore(z(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}ht._$litElement$=!0,ht.finalized=!0,dt.litElementHydrateSupport?.({LitElement:ht});const lt=dt.litElementPolyfillSupport;lt?.({LitElement:ht}),(dt.litElementVersions??=[]).push("4.2.2");const ct=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},pt={attribute:!0,type:String,converter:w,reflect:!1,hasChanged:x},ut=(t=pt,e,i)=>{const{kind:s,metadata:r}=i;let a=globalThis.litPropertyMetadata.get(r);if(void 0===a&&globalThis.litPropertyMetadata.set(r,a=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),a.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function mt(t){return(e,i)=>"object"==typeof i?ut(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function gt(t){return mt({...t,state:!0,attribute:!1})}const ft=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];function _t(t){const e=new Date(t);return e.setHours(0,0,0,0),e}function vt(t,e){const i=new Date(t);return i.setDate(i.getDate()+e),i}function yt(t,e){const i=new Date(t);return i.setDate(1),i.setMonth(i.getMonth()+e),i}function bt(t){const e=_t(t);return e.setDate(1),e}function wt(t,e){const i=_t(t);return vt(i,-(i.getDay()-e+7)%7)}function xt(t,e){return t.getFullYear()===e.getFullYear()&&t.getMonth()===e.getMonth()&&t.getDate()===e.getDate()}function $t(t){return xt(t,new Date)}function kt(t){const e=`${t.getMonth()+1}`.padStart(2,"0"),i=`${t.getDate()}`.padStart(2,"0");return`${t.getFullYear()}-${e}-${i}`}function Ct(t){const e=t=>`${t}`.padStart(2,"0");return`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())} ${e(t.getHours())}:${e(t.getMinutes())}:00`}function At(t){const e=t=>`${t}`.padStart(2,"0");return`${e(t.getHours())}:${e(t.getMinutes())}`}function St(t){switch(t.locale?.time_format){case"12":return!0;case"24":return!1;default:return}}function Ht(t){return t.locale?.language||t.language||"en"}const Lt=d`
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
`,Dt=d`
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
`,Tt=d`
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
`;let Et=class extends ht{constructor(){super(...arguments),this._config={type:""},this._now=new Date}setConfig(t){this._config={...t}}getCardSize(){return 2}getGridOptions(){return{columns:"full",rows:"auto"}}connectedCallback(){super.connectedCallback();const t=this._config.show_seconds?1e3:2e4;this._timer=window.setInterval(()=>{this._now=new Date},t)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&(window.clearInterval(this._timer),this._timer=void 0)}_weather(){const t=this._config.weather_entity;if(!t)return q;const e=this.hass.states[t];if(!e)return q;const i=e.attributes?.temperature,s=e.attributes?.temperature_unit??"",r=this.hass.formatEntityState(e);return Z`
      <div class="weather">
        <div class="temperature">
          ${"number"==typeof i?`${Math.round(i)}${s}`:"—"}
        </div>
        <div class="condition">${r}</div>
      </div>
    `}render(){if(!this.hass)return Z`<ha-card></ha-card>`;const t=Ht(this.hass),e=new Intl.DateTimeFormat(t,{hour:"2-digit",minute:"2-digit",...this._config.show_seconds?{second:"2-digit"}:{},hour12:St(this.hass)}).format(this._now),i=new Intl.DateTimeFormat(t,{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(this._now);return Z`
      <ha-card>
        <div class="bar">
          <div class="left">
            <div class="clock">${e}</div>
            <div class="date">${i}</div>
            ${this._config.greeting?Z`<div class="greeting">${this._config.greeting}</div>`:q}
          </div>
          ${this._weather()}
        </div>
      </ha-card>
    `}};Et.styles=[Lt,d`
      ha-card {
        padding: 16px 20px;
        box-sizing: border-box;
      }

      .bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
      }

      .clock {
        font-size: 3.2rem;
        font-weight: 300;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }

      .date {
        margin-top: 4px;
        font-size: 1.05rem;
        font-weight: 600;
      }

      .greeting {
        margin-top: 2px;
        font-size: 0.9rem;
        color: var(--hearth-muted);
      }

      .weather {
        text-align: right;
      }

      .temperature {
        font-size: 2.2rem;
        font-weight: 300;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }

      .condition {
        margin-top: 4px;
        font-size: 0.9rem;
        color: var(--hearth-muted);
      }
    `],i([mt({attribute:!1})],Et.prototype,"hass",void 0),i([gt()],Et.prototype,"_config",void 0),i([gt()],Et.prototype,"_now",void 0),Et=i([ct("hearth-header-card")],Et),window.customCards=window.customCards||[],window.customCards.push({type:"hearth-header-card",name:"Hearth Header",description:"Clock, date and weather, sized to be read from across the room.",preview:!0,documentationURL:"https://github.com/DomCim/Homeassistant-hearth"});function Mt(t){return!0===t.attributes?.hearth_board}function zt(t,i){let s;if(i){if(s=t.states[i],!s)return null}else if(s=Object.values(t.states).find(Mt),!s)return null;const r=s.attributes,a=(Array.isArray(r.members)?r.members:[]).map((t,i)=>{const s=t;return{id:String(s.id??i),name:String(s.name??""),color:s.color||e[i%e.length],avatar:s.avatar??null,person:s.person??null,calendars:s.calendars??[],todo_lists:s.todo_lists??[],order:s.order??i}});a.sort((t,e)=>t.order-e.order||t.name.localeCompare(e.name));const n=t=>Array.isArray(r[t])?r[t]:[];return{entityId:s.entity_id,members:a,sharedCalendars:n("shared_calendars"),sharedTodoLists:n("shared_todo_lists"),readonlyCalendars:n("readonly_calendars")}}function It(t,e){const i={};for(const e of[...t.sharedCalendars,...t.readonlyCalendars])i[e]={memberId:null,color:"#7a8b99"};for(const e of t.members)for(const t of e.calendars)i[t]={memberId:e.id,color:e.color};return i}function Ot(t){const e=new Set(t.readonlyCalendars),i=[...t.sharedCalendars,...t.members.flatMap(t=>t.calendars)];return[...new Set(i)].filter(t=>!e.has(t))}function Pt(t,e){return Object.values(t.states).find(t=>t.attributes?.member_id===e)}function Nt(t,e){const i=t.states[e];return i?.attributes?.friendly_name||e}function Ut(t){return t.date?{date:_t(new Date(`${t.date}T00:00:00`)),allDay:!0}:{date:new Date(t.dateTime),allDay:!1}}async function Vt(t,e,i,s){const r=`start=${encodeURIComponent(i.toISOString())}&end=${encodeURIComponent(s.toISOString())}`,a=await Promise.all(Object.keys(e).map(async i=>{try{const s=await t.callApi("GET",`calendars/${i}?${r}`);return{entityId:i,events:(s||[]).map(t=>function(t,e,i){if(!t?.start||!t?.end)return null;const s=Ut(t.start),r=Ut(t.end);return Number.isNaN(s.date.getTime())||Number.isNaN(r.date.getTime())?null:{summary:t.summary||"",start:s.date,end:r.date,allDay:s.allDay,calendar:e,memberId:i.memberId,color:i.color,description:t.description,location:t.location,uid:t.uid,recurrenceId:t.recurrence_id}}(t,i,e[i])).filter(t=>null!==t)}}catch(t){return console.warn(`[hearth] could not load ${i}`,t),{entityId:i,events:null}}})),n=[],o=[];for(const t of a)null===t.events?o.push(t.entityId):n.push(...t.events);return n.sort((t,e)=>t.allDay!==e.allDay?t.allDay?-1:1:t.start.getTime()-e.start.getTime()),{events:n,failed:o}}function jt(t,e){const i=[];for(let s=_t(t);s<e;s=vt(s,1))i.push(s);return i}function Rt(t,e){const i=e.map(t=>({key:kt(t),from:t.getTime(),to:vt(t,1).getTime()})),s=new Map(i.map(t=>[t.key,[]]));for(const e of t){const t=e.start.getTime(),r=e.end.getTime();for(const a of i)t<a.to&&r>a.from&&s.get(a.key).push(e)}return s}const Ft="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z",Bt="M14,4V6H18V18H14V20H20V4M13,12L9,8V11H1V13H9V16L13,12Z",Zt="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z",Wt="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z";let qt=class extends ht{constructor(){super(...arguments),this._config={type:""},this._events=[],this._loadedSignature="",this._reloadToken=0}setConfig(t){this._config={...t}}getCardSize(){return 4}getGridOptions(){return{columns:"full",rows:"auto"}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>{this._reloadToken+=1,this._maybeFetch()},6e5)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&(window.clearInterval(this._timer),this._timer=void 0)}updated(t){super.updated(t),this._maybeFetch()}async _maybeFetch(){const t=this.hass,e=t?zt(t,this._config.board_entity):null;if(!t||!e||!1===this._config.show_events)return;const i=It(e),s=Object.keys(i).sort(),r=_t(new Date),a=s.map(e=>t.states[e]?.last_changed??"-"),n=[r.getTime(),s.join(","),a.join(","),this._reloadToken].join("|");if(n===this._loadedSignature||0===s.length)return;this._loadedSignature=n;const{events:o}=await Vt(t,i,r,vt(r,1));this._loadedSignature===n&&(this._events=o)}_icon(t){return Z`<svg viewBox="0 0 24 24"><path d=${t} /></svg>`}_formatTime(t){return new Intl.DateTimeFormat(Ht(this.hass),{hour:"numeric",minute:"2-digit",hour12:St(this.hass)}).format(t)}_presence(t){if(!t.person)return null;const e=this.hass.states[t.person]?.state;return e&&"unknown"!==e&&"unavailable"!==e?"home"===e?{label:"Home",home:!0}:"not_home"===e?{label:"Out",home:!1}:{label:e,home:!1}:null}_renderMember(t){const e=Pt(this.hass,t.id),i=this._presence(t),s=Number(e?.state),r=!1!==this._config.show_tasks&&Number.isFinite(s),a=e?.attributes?.points,n=!1!==this._config.show_points&&"number"==typeof a,o=_t(new Date),d=!1===this._config.show_events?[]:this._events.filter(e=>e.memberId===t.id&&function(t,e){const i=_t(e),s=vt(i,1);return t.start<s&&t.end>i}(e,o)).slice(0,this._config.max_events??2),h=t.name.trim().charAt(0).toUpperCase()||"?";return Z`
      <div class="person" style=${`--member-color:${t.color}`}>
        <div class="avatar ${i&&!i.home?"away":""}">
          ${t.avatar?Z`<img src=${t.avatar} alt="" />`:Z`<span>${h}</span>`}
        </div>

        <div class="name">${t.name}</div>

        <div class="chips">
          ${i?Z`<span class="chip">
                ${this._icon(i.home?Ft:Bt)}${i.label}
              </span>`:q}
          ${r&&s>0?Z`<span class="chip">${this._icon(Zt)}${s}</span>`:q}
          ${n?Z`<span class="chip">${this._icon(Wt)}${a}</span>`:q}
        </div>

        ${d.length>0?Z`<div class="today">
              ${d.map(t=>Z`
                  <div class="today-event">
                    ${t.allDay?q:Z`<span class="time">${this._formatTime(t.start)}</span>`}
                    <span class="summary">${t.summary}</span>
                  </div>
                `)}
            </div>`:q}
      </div>
    `}render(){if(!this.hass)return Z`<ha-card></ha-card>`;const t=zt(this.hass,this._config.board_entity);return t&&0!==t.members.length?Z`
      <ha-card>
        <div class="strip">${t.members.map(t=>this._renderMember(t))}</div>
      </ha-card>
    `:Z`
        <ha-card>
          <div class="notice">
            No family members yet. Add them in the Hearth integration's options.
          </div>
        </ha-card>
      `}};qt.styles=[Lt,Dt,d`
      ha-card {
        padding: 12px;
        box-sizing: border-box;
      }

      .strip {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: var(--hearth-gap);
      }

      .person {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 12px 8px;
        border-radius: var(--hearth-radius);
        background: color-mix(in srgb, var(--member-color) 12%, transparent);
        border-top: 3px solid var(--member-color);
      }

      .avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        overflow: hidden;
        background: var(--member-color);
        color: #fff;
        font-size: 1.5rem;
        font-weight: 700;
      }

      /* Someone who is out reads as dimmed at a glance from across the room. */
      .avatar.away {
        opacity: 0.45;
        filter: grayscale(0.5);
      }

      .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .name {
        font-weight: 700;
        font-size: 1rem;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
      }

      .chips {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 4px;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        padding: 2px 8px;
        border-radius: 10px;
        background: var(--hearth-surface);
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--hearth-muted);
      }

      .chip svg {
        width: 14px;
        height: 14px;
        fill: currentColor;
      }

      .today {
        display: flex;
        flex-direction: column;
        gap: 2px;
        width: 100%;
        margin-top: 2px;
      }

      .today-event {
        display: flex;
        gap: 4px;
        font-size: 0.75rem;
        line-height: 1.3;
        min-width: 0;
      }

      .time {
        font-variant-numeric: tabular-nums;
        font-weight: 700;
        flex: none;
      }

      .summary {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .notice {
        padding: 16px 8px;
        color: var(--hearth-muted);
        font-size: 0.9rem;
      }
    `],i([mt({attribute:!1})],qt.prototype,"hass",void 0),i([gt()],qt.prototype,"_config",void 0),i([gt()],qt.prototype,"_events",void 0),qt=i([ct("hearth-people-card")],qt),window.customCards=window.customCards||[],window.customCards.push({type:"hearth-people-card",name:"Hearth People",description:"Who's home, what's on today, open tasks and points.",preview:!0,documentationURL:"https://github.com/DomCim/Homeassistant-hearth"});let Kt=class extends ht{constructor(){super(...arguments),this._summary="",this._calendar="",this._dateKey="",this._allDay=!0,this._startTime="",this._endTime="",this._description="",this._saving=!1}connectedCallback(){super.connectedCallback();const t=Ot(this.board);this._calendar=this.defaultCalendar&&t.includes(this.defaultCalendar)?this.defaultCalendar:t[0]??"",this._dateKey=kt(this.day);const e=new Date(this.day);e.setHours(9,0,0,0),this._startTime=At(e),e.setHours(e.getHours()+1),this._endTime=At(e)}_close(){this.dispatchEvent(new CustomEvent("hearth-close",{bubbles:!0,composed:!0}))}_onScrimClick(t){t.target===t.currentTarget&&this._close()}async _save(){const t=this._summary.trim();if(!t||!this._calendar||this._saving)return;const e=function(t){const[e,i,s]=t.split("-").map(Number);return new Date(e,i-1,s)}(this._dateKey);let i,s;if(this._allDay)i=e,s=vt(e,1);else{const[t,r]=this._startTime.split(":").map(Number),[a,n]=this._endTime.split(":").map(Number);i=new Date(e),i.setHours(t,r,0,0),s=new Date(e),s.setHours(a,n,0,0),s<=i&&(s=vt(s,1))}this._saving=!0,this._error=void 0;try{await async function(t,e,i){const s={summary:i.summary};i.description&&(s.description=i.description),i.allDay?(s.start_date=kt(i.start),s.end_date=kt(i.end)):(s.start_date_time=Ct(i.start),s.end_date_time=Ct(i.end)),await t.callService("calendar","create_event",s,{entity_id:e})}(this.hass,this._calendar,{summary:t,start:i,end:s,allDay:this._allDay,description:this._description.trim()||void 0}),this.dispatchEvent(new CustomEvent("hearth-created",{bubbles:!0,composed:!0})),this._close()}catch(t){this._error=t instanceof Error?t.message:"The event could not be created."}finally{this._saving=!1}}_calendarOptions(){const t=new Map;for(const e of this.board.members)for(const i of e.calendars)t.set(i,e.name);return Ot(this.board).map(e=>{const i=t.get(e),s=i?`${i} — ${Nt(this.hass,e)}`:Nt(this.hass,e);return Z`<option value=${e} ?selected=${e===this._calendar}>
        ${s}
      </option>`})}render(){const t=this._calendarOptions(),e=Boolean(this._summary.trim()&&this._calendar)&&!this._saving;return Z`
      <div class="scrim" @click=${this._onScrimClick}>
        <div class="sheet" role="dialog" aria-modal="true">
          <h2>New event</h2>

          ${this._error?Z`<p class="error">${this._error}</p>`:q}
          ${0===t.length?Z`<p class="error">
                No writable calendar is configured. Add calendars to a family member, or
                remove one from the read-only list.
              </p>`:q}

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

          ${this._allDay?q:Z`
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
    `}};Kt.styles=[Lt,Dt,Tt],i([mt({attribute:!1})],Kt.prototype,"hass",void 0),i([mt({attribute:!1})],Kt.prototype,"board",void 0),i([mt({attribute:!1})],Kt.prototype,"day",void 0),i([mt({attribute:!1})],Kt.prototype,"defaultCalendar",void 0),i([gt()],Kt.prototype,"_summary",void 0),i([gt()],Kt.prototype,"_calendar",void 0),i([gt()],Kt.prototype,"_dateKey",void 0),i([gt()],Kt.prototype,"_allDay",void 0),i([gt()],Kt.prototype,"_startTime",void 0),i([gt()],Kt.prototype,"_endTime",void 0),i([gt()],Kt.prototype,"_description",void 0),i([gt()],Kt.prototype,"_saving",void 0),i([gt()],Kt.prototype,"_error",void 0),Kt=i([ct("hearth-event-dialog")],Kt);const Gt=["month","week","day"],Yt={month:"Month",week:"Week",day:"Day"},Jt="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z",Xt="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",Qt="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z",te="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",ee="M13,14H11V9H13M13,18H11V16H13M1,21H23L12,2L1,21Z";let ie=class extends ht{constructor(){super(...arguments),this._config={type:""},this._view="month",this._anchor=_t(new Date),this._events=[],this._failed=[],this._loading=!1,this._loadedSignature="",this._reloadToken=0}setConfig(t){this._config={...t},t.view&&Gt.includes(t.view)&&(this._view=t.view)}getCardSize(){return"month"===this._view?12:8}getGridOptions(){return{columns:"full",rows:"month"===this._view?12:8}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._reload(),3e5)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&(window.clearInterval(this._timer),this._timer=void 0)}updated(t){super.updated(t),this._maybeFetch()}get _board(){return this.hass?zt(this.hass,this._config.board_entity):null}get _firstDay(){return this.hass?function(t){const e=t.locale?.first_weekday;if(e&&"language"!==e){const t=ft.indexOf(e);if(t>=0)return t}try{const e=new Intl.Locale(t.locale?.language||t.language||"en").weekInfo;if(e?.firstDay)return e.firstDay%7}catch{}return 1}(this.hass):1}_range(){if("month"===this._view){const{start:t,end:e}=function(t,e){const i=wt(bt(t),e);let s=wt(vt(yt(bt(t),1),-1),e);s=vt(s,7);let r=Math.round((s.getTime()-i.getTime())/6048e5);return r<6&&(s=vt(s,7*(6-r)),r=6),{start:i,end:s,weeks:r}}(this._anchor,this._firstDay);return{start:t,end:e}}if("week"===this._view){const t=wt(this._anchor,this._firstDay);return{start:t,end:vt(t,7)}}const t=_t(this._anchor);return{start:t,end:vt(t,1)}}_reload(){this._reloadToken+=1,this._maybeFetch()}async _maybeFetch(){const t=this.hass,e=this._board;if(!t||!e)return;const i=It(e),s=Object.keys(i).sort(),{start:r,end:a}=this._range(),n=s.map(e=>t.states[e]?.last_changed??"-"),o=[r.getTime(),a.getTime(),s.join(","),n.join(","),this._reloadToken].join("|");if(o!==this._loadedSignature){if(this._loadedSignature=o,0===s.length)return this._events=[],void(this._failed=[]);this._loading=!0;try{const{events:e,failed:s}=await Vt(t,i,r,a);this._loadedSignature===o&&(this._events=e,this._failed=s)}finally{this._loadedSignature===o&&(this._loading=!1)}}}_step(t){"month"===this._view?this._anchor=yt(this._anchor,t):"week"===this._view?this._anchor=vt(this._anchor,7*t):this._anchor=vt(this._anchor,t)}_goToday(){this._anchor=_t(new Date)}_setView(t){this._view=t}get _createEnabled(){return!1!==this._config.create}_openCreate(t){this._createEnabled&&(this._dialogDay=t)}_openDay(t){this._anchor=_t(t),this._view="day"}_formatTime(t){return new Intl.DateTimeFormat(Ht(this.hass),{hour:"numeric",minute:"2-digit",hour12:St(this.hass)}).format(t)}_title(){const t=Ht(this.hass);if("month"===this._view)return new Intl.DateTimeFormat(t,{month:"long",year:"numeric"}).format(this._anchor);if("week"===this._view){const{start:e,end:i}=this._range();return new Intl.DateTimeFormat(t,{day:"numeric",month:"short",year:"numeric"}).formatRange(e,vt(i,-1))}return new Intl.DateTimeFormat(t,{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(this._anchor)}_weekdayLabels(){const t=new Intl.DateTimeFormat(Ht(this.hass),{weekday:"short"}),e=wt(new Date,this._firstDay);return Array.from({length:7},(i,s)=>t.format(vt(e,s)))}_icon(t){return Z`<svg viewBox="0 0 24 24"><path d=${t} /></svg>`}_renderEvent(t,e){const i=t.allDay?"":this._formatTime(t.start);return Z`
      <div
        class="event ${t.allDay?"all-day":""}"
        style=${`--event-color:${t.color}`}
        title=${t.summary}
      >
        ${t.allDay?q:Z`<span class="dot"></span><span class="time">${i}</span>`}
        <span class="summary">${t.summary}</span>
        ${e||!t.location?q:Z`<span class="location">${t.location}</span>`}
      </div>
    `}_renderMonth(){const{start:t,end:e}=this._range(),i=jt(t,e),s=Rt(this._events,i),r=this._config.max_events_per_day??3,a=this._anchor.getMonth();return Z`
      <div class="weekday-row">
        ${this._weekdayLabels().map(t=>Z`<div class="weekday">${t}</div>`)}
      </div>
      <div class="month-grid" style=${"--weeks:"+i.length/7}>
        ${i.map(t=>{const e=s.get(kt(t))??[],i=e.slice(0,r),n=e.length-i.length;return Z`
            <div
              class="day-cell ${t.getMonth()===a?"":"outside"} ${$t(t)?"today":""}"
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
                ${n>0?Z`<button
                      class="more"
                      @click=${e=>{e.stopPropagation(),this._openDay(t)}}
                    >
                      +${n}
                    </button>`:q}
              </div>
            </div>
          `})}
      </div>
    `}_renderWeek(){const{start:t,end:e}=this._range(),i=jt(t,e),s=Rt(this._events,i),r=new Intl.DateTimeFormat(Ht(this.hass),{weekday:"short",day:"numeric"});return Z`
      <div class="week-grid">
        ${i.map(t=>{const e=s.get(kt(t))??[];return Z`
            <div
              class="week-column ${$t(t)?"today":""}"
              @click=${()=>this._openCreate(t)}
            >
              <div class="week-heading">${r.format(t)}</div>
              <div class="week-events">
                ${0===e.length?Z`<div class="empty-hint">—</div>`:e.map(t=>this._renderEvent(t,!0))}
              </div>
            </div>
          `})}
      </div>
    `}_renderDay(){const{start:t,end:e}=this._range(),i=Rt(this._events,jt(t,e)).get(kt(t))??[];return Z`
      <div class="day-list" @click=${()=>this._openCreate(t)}>
        ${0===i.length?Z`<div class="empty-day">
              Nothing planned.${this._createEnabled?" Tap to add something.":""}
            </div>`:i.map(t=>this._renderEvent(t,!1))}
      </div>
    `}_renderLegend(t){return!1===this._config.show_legend||0===t.members.length?q:Z`
      <div class="legend">
        ${t.members.map(t=>Z`
            <span class="legend-item">
              <span class="swatch" style=${`background:${t.color}`}></span>
              ${t.name}
            </span>
          `)}
      </div>
    `}render(){if(!this.hass)return Z`<ha-card></ha-card>`;const t=this._board;if(!t)return Z`
        <ha-card>
          <div class="notice">
            No Hearth board found. Add the Hearth integration, or set
            <code>board_entity</code> in this card's configuration.
          </div>
        </ha-card>
      `;const e=It(t),i=this._config.views??Gt;return Z`
      <ha-card>
        <div class="toolbar">
          <button class="icon-button" @click=${()=>this._step(-1)} aria-label="Previous">
            ${this._icon(Jt)}
          </button>
          <button class="icon-button" @click=${this._goToday} aria-label="Today">
            ${this._icon(Qt)}
          </button>
          <button class="icon-button" @click=${()=>this._step(1)} aria-label="Next">
            ${this._icon(Xt)}
          </button>
          <h1 class="title">${this._title()}</h1>
          ${i.length>1?Z`<div class="segmented">
                ${i.map(t=>Z`
                    <button
                      aria-pressed=${this._view===t}
                      @click=${()=>this._setView(t)}
                    >
                      ${Yt[t]}
                    </button>
                  `)}
              </div>`:q}
          ${this._createEnabled?Z`<button
                class="icon-button"
                aria-label="New event"
                @click=${()=>this._openCreate(_t(this._anchor))}
              >
                ${this._icon(te)}
              </button>`:q}
        </div>

        ${this._renderLegend(t)}
        ${0===Object.keys(e).length?Z`<div class="notice">
              No calendars are assigned yet. Open the Hearth integration's options and give
              your family members their calendars.
            </div>`:q}
        ${this._failed.length>0?Z`<div class="warning">
              ${this._icon(ee)}
              <span>Could not load: ${this._failed.join(", ")}</span>
            </div>`:q}

        <div class="body ${this._loading?"loading":""}">
          ${"month"===this._view?this._renderMonth():"week"===this._view?this._renderWeek():this._renderDay()}
        </div>

        ${this._dialogDay?Z`<hearth-event-dialog
              .hass=${this.hass}
              .board=${t}
              .day=${this._dialogDay}
              .defaultCalendar=${this._config.default_calendar}
              @hearth-close=${()=>{this._dialogDay=void 0}}
              @hearth-created=${()=>this._reload()}
            ></hearth-event-dialog>`:q}
      </ha-card>
    `}};ie.styles=[Lt,Dt,d`
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
    `],i([mt({attribute:!1})],ie.prototype,"hass",void 0),i([gt()],ie.prototype,"_config",void 0),i([gt()],ie.prototype,"_view",void 0),i([gt()],ie.prototype,"_anchor",void 0),i([gt()],ie.prototype,"_events",void 0),i([gt()],ie.prototype,"_failed",void 0),i([gt()],ie.prototype,"_loading",void 0),i([gt()],ie.prototype,"_dialogDay",void 0),ie=i([ct("hearth-calendar-card")],ie),window.customCards=window.customCards||[],window.customCards.push({type:"hearth-calendar-card",name:"Hearth Calendar",description:"Family calendar as a month, week or day grid, coloured per member.",preview:!0,documentationURL:"https://github.com/DomCim/Homeassistant-hearth"});let se=class extends ht{constructor(){super(...arguments),this._config={type:""},this._events=[],this._loadedSignature="",this._reloadToken=0}setConfig(t){this._config={...t}}getCardSize(){return 6}getGridOptions(){return{columns:"full",rows:"auto"}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>{this._reloadToken+=1,this._maybeFetch()},3e5)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&(window.clearInterval(this._timer),this._timer=void 0)}updated(t){super.updated(t),this._maybeFetch()}get _days(){return Math.max(1,this._config.days??3)}async _maybeFetch(){const t=this.hass,e=t?zt(t,this._config.board_entity):null;if(!t||!e)return;const i=It(e),s=Object.keys(i).sort(),r=_t(new Date),a=vt(r,this._days),n=s.map(e=>t.states[e]?.last_changed??"-"),o=[r.getTime(),a.getTime(),s.join(","),n.join(","),this._reloadToken].join("|");if(o===this._loadedSignature)return;if(this._loadedSignature=o,0===s.length)return void(this._events=[]);const{events:d}=await Vt(t,i,r,a);this._loadedSignature===o&&(this._events=d)}_formatTime(t){return new Intl.DateTimeFormat(Ht(this.hass),{hour:"numeric",minute:"2-digit",hour12:St(this.hass)}).format(t)}_dayLabel(t){const e=_t(new Date),i=Ht(this.hass);return xt(t,e)?new Intl.RelativeTimeFormat(i,{numeric:"auto"}).format(0,"day"):xt(t,vt(e,1))?new Intl.RelativeTimeFormat(i,{numeric:"auto"}).format(1,"day"):new Intl.DateTimeFormat(i,{weekday:"long",day:"numeric",month:"long"}).format(t)}render(){if(!this.hass)return Z`<ha-card></ha-card>`;const t=zt(this.hass,this._config.board_entity);if(!t)return Z`<ha-card
        ><div class="notice">No Hearth board found. Add the Hearth integration.</div></ha-card
      >`;const e=_t(new Date),i=jt(e,vt(e,this._days)),s=Rt(this._events,i),r=this._config.max_events??6,a=new Map(t.members.map(t=>[t.id,t.name])),n=i.filter(t=>!0!==this._config.hide_empty_days||(s.get(kt(t))?.length??0)>0);return Z`
      <ha-card>
        ${0===n.length?Z`<div class="notice">Nothing coming up.</div>`:n.map(t=>{const e=(s.get(kt(t))??[]).slice(0,r);return Z`
                <section class="day">
                  <h3 class="day-label">${this._dayLabel(t)}</h3>
                  ${0===e.length?Z`<div class="empty">Nothing planned</div>`:e.map(t=>Z`
                          <div class="row" style=${`--event-color:${t.color}`}>
                            <span class="when">
                              ${t.allDay?"All day":this._formatTime(t.start)}
                            </span>
                            <span class="what">${t.summary}</span>
                            ${t.memberId&&a.has(t.memberId)?Z`<span class="who">${a.get(t.memberId)}</span>`:q}
                          </div>
                        `)}
                </section>
              `})}
      </ha-card>
    `}};se.styles=[Lt,Dt,d`
      ha-card {
        padding: 12px;
        box-sizing: border-box;
      }

      .day + .day {
        margin-top: 14px;
      }

      .day-label {
        margin: 0 0 6px;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--hearth-muted);
      }

      .row {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: var(--hearth-touch);
        padding: 4px 10px;
        margin-bottom: 4px;
        border-radius: 8px;
        border-left: 4px solid var(--event-color);
        background: color-mix(in srgb, var(--event-color) 12%, transparent);
      }

      .when {
        flex: none;
        min-width: 62px;
        font-variant-numeric: tabular-nums;
        font-weight: 700;
        font-size: 0.85rem;
      }

      .what {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .who {
        flex: none;
        padding: 2px 8px;
        border-radius: 10px;
        background: var(--event-color);
        color: #fff;
        font-size: 0.72rem;
        font-weight: 700;
      }

      .empty,
      .notice {
        padding: 8px 2px;
        color: var(--hearth-muted);
        font-size: 0.85rem;
      }
    `],i([mt({attribute:!1})],se.prototype,"hass",void 0),i([gt()],se.prototype,"_config",void 0),i([gt()],se.prototype,"_events",void 0),se=i([ct("hearth-agenda-card")],se),window.customCards=window.customCards||[],window.customCards.push({type:"hearth-agenda-card",name:"Hearth Agenda",description:"The next few days as a list, coloured per family member.",preview:!0,documentationURL:"https://github.com/DomCim/Homeassistant-hearth"});const re="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",ae="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z",ne="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z",oe="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95Z";let de=class extends ht{constructor(){super(...arguments),this._config={type:""},this._pending=new Set}setConfig(t){this._config={...t}}getCardSize(){return 6}getGridOptions(){return{columns:"full",rows:"auto"}}get _blocks(){const t=this._config.block??"auto";if("morning"===t||"evening"===t)return[t];if("both"===t)return["morning","evening"];const e=this._config.evening_from??14;return[(new Date).getHours()<e?"morning":"evening"]}_steps(t,e){const i=Pt(this.hass,t.id),s=i?.attributes?.[`routine_${e}`];return Array.isArray(s)?s.filter(t=>Boolean(t)&&"object"==typeof t).map(t=>({step:String(t.step??""),done:Boolean(t.done)})):[]}async _toggle(t,e,i){const s=`${t.id}|${e}|${i.step}`;this._pending=new Set(this._pending).add(s);try{await this.hass.callService("hearth","set_routine_step",{member:t.id,block:e,step:i.step,done:!i.done})}catch(t){console.warn("[hearth] could not update routine step",t)}finally{const t=new Set(this._pending);t.delete(s),this._pending=t}}_icon(t,e=""){return Z`<svg class=${e} viewBox="0 0 24 24"><path d=${t} /></svg>`}_renderBlock(t,e){const i=this._steps(t,e),s=i.filter(t=>t.done).length,r=i.length>0&&s===i.length;return Z`
      <section class="block ${r?"complete":""}">
        <header class="block-head">
          ${this._icon("morning"===e?ne:oe,"block-icon")}
          <span class="progress">${s}/${i.length}</span>
        </header>

        ${0===i.length?Z`<div class="empty">Heute nichts</div>`:Z`
              <div class="bar">
                <div
                  class="bar-fill"
                  style=${`width:${i.length?s/i.length*100:0}%`}
                ></div>
              </div>
              ${i.map(i=>{const s=`${t.id}|${e}|${i.step}`,r=this._pending.has(s),a=r?!i.done:i.done;return Z`
                  <button
                    class="step ${a?"done":""} ${r?"pending":""}"
                    @click=${()=>this._toggle(t,e,i)}
                  >
                    ${this._icon(a?ae:re,"tick")}
                    <span class="label">${i.step}</span>
                  </button>
                `})}
            `}
      </section>
    `}render(){if(!this.hass)return Z`<ha-card></ha-card>`;const t=zt(this.hass,this._config.board_entity);if(!t)return Z`<ha-card
        ><div class="notice">No Hearth board found. Add the Hearth integration.</div></ha-card
      >`;const e=this._blocks,i=this._config.members?.map(t=>t.toLowerCase()),s=t.members.filter(t=>!(i&&!i.includes(t.id.toLowerCase())&&!i.includes(t.name.toLowerCase()))&&(!0===this._config.show_empty||e.some(e=>this._steps(t,e).length>0)));return 0===s.length?Z`
        <ha-card>
          <div class="notice">
            Für heute sind keine Routinen hinterlegt. Trage sie in den Hearth-Optionen
            unter „Routinen bearbeiten“ ein.
          </div>
        </ha-card>
      `:Z`
      <ha-card>
        <div class="grid">
          ${s.map(t=>Z`
              <div class="person" style=${`--member-color:${t.color}`}>
                <div class="person-name">${t.name}</div>
                ${e.map(e=>this._renderBlock(t,e))}
              </div>
            `)}
        </div>
      </ha-card>
    `}};function he(t,e){const i=t.states[e];return i?.attributes?.friendly_name||e}function le(t,e){return t.states[e]?.attributes?.icon||null}de.styles=[Lt,Dt,d`
      ha-card {
        padding: 12px;
        box-sizing: border-box;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: var(--hearth-gap);
      }

      .person {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        border-radius: var(--hearth-radius);
        background: color-mix(in srgb, var(--member-color) 10%, transparent);
        border-top: 3px solid var(--member-color);
      }

      .person-name {
        font-size: 1.15rem;
        font-weight: 700;
      }

      .block-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--hearth-muted);
      }

      .block-icon {
        width: 20px;
        height: 20px;
        fill: currentColor;
      }

      .progress {
        font-size: 0.85rem;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
      }

      .block.complete .progress {
        color: var(--member-color);
      }

      .bar {
        height: 4px;
        border-radius: 2px;
        background: var(--hearth-line);
        overflow: hidden;
        margin-bottom: 4px;
      }

      .bar-fill {
        height: 100%;
        background: var(--member-color);
        transition: width 180ms ease;
      }

      .step {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        min-height: calc(var(--hearth-touch) + 4px);
        padding: 4px 8px;
        margin-bottom: 2px;
        box-sizing: border-box;
        border-radius: 8px;
        text-align: left;
        font-size: 1rem;
        background: var(--hearth-surface);
      }

      .step:active {
        background: var(--hearth-surface-alt);
      }

      .step .tick {
        width: 26px;
        height: 26px;
        flex: none;
        fill: var(--hearth-line);
        transition: fill 140ms ease;
      }

      .step.done .tick {
        fill: var(--member-color);
      }

      .step.done .label {
        text-decoration: line-through;
        color: var(--hearth-muted);
      }

      .step.pending {
        opacity: 0.65;
      }

      .label {
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .empty,
      .notice {
        padding: 8px 2px;
        color: var(--hearth-muted);
        font-size: 0.9rem;
      }
    `],i([mt({attribute:!1})],de.prototype,"hass",void 0),i([gt()],de.prototype,"_config",void 0),i([gt()],de.prototype,"_pending",void 0),de=i([ct("hearth-routines-card")],de),window.customCards=window.customCards||[],window.customCards.push({type:"hearth-routines-card",name:"Hearth Routines",description:"Daily routines per child and weekday, ticked off by the kids themselves.",preview:!0,documentationURL:"https://github.com/DomCim/Homeassistant-hearth"});const ce="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z",pe="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z",ue="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",me="M13,14H11V9H13M13,18H11V16H13M1,21H23L12,2L1,21Z";let ge=class extends ht{constructor(){super(...arguments),this._config={type:""},this._lists=[],this._expanded=new Set,this._draft="",this._pending=new Set,this._loadedSignature="",this._reloadToken=0}setConfig(t){this._config={...t}}getCardSize(){return 6}getGridOptions(){return{columns:"full",rows:"auto"}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._reload(),3e5)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&(window.clearInterval(this._timer),this._timer=void 0)}updated(t){super.updated(t),this._maybeFetch()}get _entityIds(){if(this._config.entities?.length)return this._config.entities;const t=this.hass?zt(this.hass,this._config.board_entity):null;return t?.sharedTodoLists??[]}_reload(){this._reloadToken+=1,this._maybeFetch()}async _maybeFetch(){const t=this.hass;if(!t)return;const e=this._entityIds,i=e.map(e=>`${t.states[e]?.state??"-"}`),s=[e.join(","),i.join(","),this._reloadToken].join("|");if(s===this._loadedSignature)return;if(this._loadedSignature=s,0===e.length)return void(this._lists=[]);const r=await async function(t,e,i=!1){const s=i?["needs_action","completed"]:["needs_action"];return Promise.all(e.map(async e=>{const i={entityId:e,name:he(t,e),icon:le(t,e)};try{const r=await t.callService("todo","get_items",{status:s},{entity_id:e},!1,!0);return{...i,items:r?.response?.[e]?.items??[],ok:!0}}catch(t){return console.warn(`[hearth] could not read ${e}`,t),{...i,items:[],ok:!1}}}))}(t,e);this._loadedSignature===s&&(this._lists=r,this._pending=new Set)}async _toggle(t,e){const i=`${t.entityId}|${e.uid||e.summary}`;this._pending=new Set(this._pending).add(i);try{await async function(t,e,i,s){await t.callService("todo","update_item",{item:i.uid||i.summary,status:s?"completed":"needs_action"},{entity_id:e})}(this.hass,t.entityId,e,"completed"!==e.status)}catch(t){console.warn("[hearth] could not update item",t);const e=new Set(this._pending);return e.delete(i),void(this._pending=e)}this._reload()}async _submitDraft(t){const e=this._draft.trim();if(e){this._draft="";try{await async function(t,e,i){await t.callService("todo","add_item",{item:i},{entity_id:e})}(this.hass,t.entityId,e)}catch(t){console.warn("[hearth] could not add item",t)}this._reload()}}_icon(t){return Z`<svg viewBox="0 0 24 24"><path d=${t} /></svg>`}_renderItem(t,e){const i=`${t.entityId}|${e.uid||e.summary}`,s=this._pending.has(i),r=s?"completed"!==e.status:"completed"===e.status;return Z`
      <button
        class="item ${r?"done":""} ${s?"pending":""}"
        @click=${()=>this._toggle(t,e)}
      >
        ${this._icon(r?pe:ce)}
        <span class="item-text">${e.summary}</span>
      </button>
    `}_renderList(t){const e=this._config.max_items??8,i=this._expanded.has(t.entityId)?t.items:t.items.slice(0,e),s=t.items.length-i.length;return Z`
      <section class="list">
        <header class="list-header">
          <span class="list-name">${t.name}</span>
          <span class="count">${t.items.length}</span>
        </header>

        ${t.ok?q:Z`<div class="warning">
              ${this._icon(me)}<span>Not reachable right now</span>
            </div>`}

        <div class="items">
          ${0===i.length&&t.ok?Z`<div class="empty">Nothing on this list</div>`:i.map(e=>this._renderItem(t,e))}
        </div>

        ${s>0?Z`<button
              class="more"
              @click=${()=>{this._expanded=new Set(this._expanded).add(t.entityId)}}
            >
              Show ${s} more
            </button>`:q}
        ${!1===this._config.allow_add?q:this._adding===t.entityId?Z`
                <form
                  class="add-row"
                  @submit=${e=>{e.preventDefault(),this._submitDraft(t)}}
                >
                  <input
                    type="text"
                    autofocus
                    placeholder="Add an item"
                    .value=${this._draft}
                    @input=${t=>{this._draft=t.target.value}}
                    @blur=${()=>{this._adding=void 0}}
                  />
                </form>
              `:Z`<button
                class="add"
                @click=${()=>{this._draft="",this._adding=t.entityId}}
              >
                ${this._icon(ue)}<span>Add</span>
              </button>`}
      </section>
    `}render(){return this.hass?0===this._entityIds.length?Z`
        <ha-card>
          <div class="notice">
            No lists configured. Pick your family lists in the Hearth integration's options,
            or set <code>entities</code> on this card.
          </div>
        </ha-card>
      `:Z`
      <ha-card>
        <div class="grid" style=${`--columns:${this._config.columns??3}`}>
          ${this._lists.map(t=>this._renderList(t))}
        </div>
      </ha-card>
    `:Z`<ha-card></ha-card>`}};ge.styles=[Lt,Dt,d`
      ha-card {
        padding: 12px;
        box-sizing: border-box;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: var(--hearth-gap);
      }

      @media (min-width: 900px) {
        .grid {
          grid-template-columns: repeat(var(--columns, 3), 1fr);
        }
      }

      .list {
        display: flex;
        flex-direction: column;
        border-radius: var(--hearth-radius);
        background: var(--hearth-surface-alt);
        padding: 10px;
      }

      .list-header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;
        padding-bottom: 6px;
        margin-bottom: 4px;
        border-bottom: 1px solid var(--hearth-line);
      }

      .list-name {
        font-weight: 700;
        font-size: 1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .count {
        flex: none;
        font-size: 0.8rem;
        font-variant-numeric: tabular-nums;
        color: var(--hearth-muted);
      }

      .items {
        display: flex;
        flex-direction: column;
      }

      .item {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: var(--hearth-touch);
        padding: 4px 2px;
        text-align: left;
        border-radius: 6px;
      }

      .item:active {
        background: var(--hearth-line);
      }

      .item svg {
        width: 22px;
        height: 22px;
        flex: none;
        fill: var(--hearth-muted);
      }

      .item.done svg {
        fill: var(--hearth-today);
      }

      .item.done .item-text {
        text-decoration: line-through;
        color: var(--hearth-muted);
      }

      .item.pending {
        opacity: 0.6;
      }

      .item-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .empty,
      .notice {
        padding: 10px 2px;
        color: var(--hearth-muted);
        font-size: 0.85rem;
      }

      .notice code {
        background: var(--hearth-surface-alt);
        padding: 1px 5px;
        border-radius: 4px;
      }

      .more,
      .add {
        display: flex;
        align-items: center;
        gap: 6px;
        min-height: var(--hearth-touch);
        padding: 0 2px;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--hearth-muted);
      }

      .add svg {
        width: 20px;
        height: 20px;
        fill: currentColor;
      }

      .add-row input {
        font: inherit;
        color: inherit;
        width: 100%;
        min-height: var(--hearth-touch);
        padding: 6px 10px;
        box-sizing: border-box;
        background: var(--hearth-surface);
        border: 1px solid var(--hearth-today);
        border-radius: 8px;
      }

      .warning {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 2px;
        color: var(--warning-color, #b8860b);
        font-size: 0.8rem;
      }

      .warning svg {
        width: 16px;
        height: 16px;
        fill: currentColor;
      }
    `],i([mt({attribute:!1})],ge.prototype,"hass",void 0),i([gt()],ge.prototype,"_config",void 0),i([gt()],ge.prototype,"_lists",void 0),i([gt()],ge.prototype,"_expanded",void 0),i([gt()],ge.prototype,"_adding",void 0),i([gt()],ge.prototype,"_draft",void 0),i([gt()],ge.prototype,"_pending",void 0),ge=i([ct("hearth-lists-card")],ge),window.customCards=window.customCards||[],window.customCards.push({type:"hearth-lists-card",name:"Hearth Lists",description:"Shopping lists and checklists as tiles, ticked off with one tap.",preview:!0,documentationURL:"https://github.com/DomCim/Homeassistant-hearth"}),console.info(`%c HEARTH %c ${t} `,"color:#fff;background:#e0603a;font-weight:700;border-radius:3px 0 0 3px;padding:2px 6px","color:#e0603a;background:#2b2118;font-weight:700;border-radius:0 3px 3px 0;padding:2px 6px");export{t as HEARTH_VERSION};
