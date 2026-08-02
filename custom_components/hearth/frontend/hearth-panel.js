const e="0.4.0",t=["#e0603a","#3a86c8","#4f9d69","#c9a227","#8e6bbf","#d1707f"];function i(e,t,i,a){var s,r=arguments.length,n=r<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,a);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(n=(r<3?s(n):r>3?s(t,i,n):s(t,i))||n);return r>3&&n&&Object.defineProperty(t,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const a=globalThis,s=a.ShadowRoot&&(void 0===a.ShadyCSS||a.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),n=new WeakMap;let o=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=n.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(t,e))}return e}toString(){return this.cssText}};const d=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,a)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[a+1],e[0]);return new o(i,e,r)},l=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,r))(t)})(e):e,{is:h,defineProperty:c,getOwnPropertyDescriptor:p,getOwnPropertyNames:u,getOwnPropertySymbols:m,getPrototypeOf:g}=Object,f=globalThis,_=f.trustedTypes,y=_?_.emptyScript:"",b=f.reactiveElementPolyfillSupport,v=(e,t)=>e,w={toAttribute(e,t){switch(t){case Boolean:e=e?y:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},x=(e,t)=>!h(e,t),$={attribute:!0,type:String,converter:w,reflect:!1,useDefault:!1,hasChanged:x};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let k=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),a=this.getPropertyDescriptor(e,i,t);void 0!==a&&c(this.prototype,e,a)}}static getPropertyDescriptor(e,t,i){const{get:a,set:s}=p(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:a,set(t){const r=a?.call(this);s?.call(this,t),this.requestUpdate(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=g(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...u(e),...m(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(l(e))}else void 0!==e&&t.push(l(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{if(s)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of t){const t=document.createElement("style"),s=a.litNonce;void 0!==s&&t.setAttribute("nonce",s),t.textContent=i.cssText,e.appendChild(t)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),a=this.constructor._$Eu(e,i);if(void 0!==a&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:w).toAttribute(t,i.type);this._$Em=e,null==s?this.removeAttribute(a):this.setAttribute(a,s),this._$Em=null}}_$AK(e,t){const i=this.constructor,a=i._$Eh.get(e);if(void 0!==a&&this._$Em!==a){const e=i.getPropertyOptions(a),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:w;this._$Em=a;const r=s.fromAttribute(t,e.type);this[a]=r??this._$Ej?.get(a)??r,this._$Em=null}}requestUpdate(e,t,i,a=!1,s){if(void 0!==e){const r=this.constructor;if(!1===a&&(s=this[e]),i??=r.getPropertyOptions(e),!((i.hasChanged??x)(s,t)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:a,wrapped:s},r){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==s||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===a&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,a=this[t];!0!==e||this._$AL.has(t)||void 0===a||this.C(t,void 0,i,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[v("elementProperties")]=new Map,k[v("finalized")]=new Map,b?.({ReactiveElement:k}),(f.reactiveElementVersions??=[]).push("2.1.2");const C=globalThis,A=e=>e,S=C.trustedTypes,H=S?S.createPolicy("lit-html",{createHTML:e=>e}):void 0,T="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,L="?"+E,D=`<${L}>`,z=document,M=()=>z.createComment(""),N=e=>null===e||"object"!=typeof e&&"function"!=typeof e,I=Array.isArray,j="[ \t\n\f\r]",O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,P=/-->/g,U=/>/g,V=RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,F=/"/g,B=/^(?:script|style|textarea|title)$/i,K=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),W=Symbol.for("lit-noChange"),Z=Symbol.for("lit-nothing"),G=new WeakMap,q=z.createTreeWalker(z,129);function Y(e,t){if(!I(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==H?H.createHTML(t):t}const J=(e,t)=>{const i=e.length-1,a=[];let s,r=2===t?"<svg>":3===t?"<math>":"",n=O;for(let t=0;t<i;t++){const i=e[t];let o,d,l=-1,h=0;for(;h<i.length&&(n.lastIndex=h,d=n.exec(i),null!==d);)h=n.lastIndex,n===O?"!--"===d[1]?n=P:void 0!==d[1]?n=U:void 0!==d[2]?(B.test(d[2])&&(s=RegExp("</"+d[2],"g")),n=V):void 0!==d[3]&&(n=V):n===V?">"===d[0]?(n=s??O,l=-1):void 0===d[1]?l=-2:(l=n.lastIndex-d[2].length,o=d[1],n=void 0===d[3]?V:'"'===d[3]?F:R):n===F||n===R?n=V:n===P||n===U?n=O:(n=V,s=void 0);const c=n===V&&e[t+1].startsWith("/>")?" ":"";r+=n===O?i+D:l>=0?(a.push(o),i.slice(0,l)+T+i.slice(l)+E+c):i+E+(-2===l?t:c)}return[Y(e,r+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),a]};class X{constructor({strings:e,_$litType$:t},i){let a;this.parts=[];let s=0,r=0;const n=e.length-1,o=this.parts,[d,l]=J(e,t);if(this.el=X.createElement(d,i),q.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(a=q.nextNode())&&o.length<n;){if(1===a.nodeType){if(a.hasAttributes())for(const e of a.getAttributeNames())if(e.endsWith(T)){const t=l[r++],i=a.getAttribute(e).split(E),n=/([.?@])?(.*)/.exec(t);o.push({type:1,index:s,name:n[2],strings:i,ctor:"."===n[1]?ae:"?"===n[1]?se:"@"===n[1]?re:ie}),a.removeAttribute(e)}else e.startsWith(E)&&(o.push({type:6,index:s}),a.removeAttribute(e));if(B.test(a.tagName)){const e=a.textContent.split(E),t=e.length-1;if(t>0){a.textContent=S?S.emptyScript:"";for(let i=0;i<t;i++)a.append(e[i],M()),q.nextNode(),o.push({type:2,index:++s});a.append(e[t],M())}}}else if(8===a.nodeType)if(a.data===L)o.push({type:2,index:s});else{let e=-1;for(;-1!==(e=a.data.indexOf(E,e+1));)o.push({type:7,index:s}),e+=E.length-1}s++}}static createElement(e,t){const i=z.createElement("template");return i.innerHTML=e,i}}function Q(e,t,i=e,a){if(t===W)return t;let s=void 0!==a?i._$Co?.[a]:i._$Cl;const r=N(t)?void 0:t._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),void 0===r?s=void 0:(s=new r(e),s._$AT(e,i,a)),void 0!==a?(i._$Co??=[])[a]=s:i._$Cl=s),void 0!==s&&(t=Q(e,s._$AS(e,t.values),s,a)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,a=(e?.creationScope??z).importNode(t,!0);q.currentNode=a;let s=q.nextNode(),r=0,n=0,o=i[0];for(;void 0!==o;){if(r===o.index){let t;2===o.type?t=new te(s,s.nextSibling,this,e):1===o.type?t=new o.ctor(s,o.name,o.strings,this,e):6===o.type&&(t=new ne(s,this,e)),this._$AV.push(t),o=i[++n]}r!==o?.index&&(s=q.nextNode(),r++)}return q.currentNode=z,a}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,a){this.type=2,this._$AH=Z,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Q(this,e,t),N(e)?e===Z||null==e||""===e?(this._$AH!==Z&&this._$AR(),this._$AH=Z):e!==this._$AH&&e!==W&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>I(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==Z&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(z.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,a="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=X.createElement(Y(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(t);else{const e=new ee(a,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=G.get(e.strings);return void 0===t&&G.set(e.strings,t=new X(e)),t}k(e){I(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,a=0;for(const s of e)a===t.length?t.push(i=new te(this.O(M()),this.O(M()),this,this.options)):i=t[a],i._$AI(s),a++;a<t.length&&(this._$AR(i&&i._$AB.nextSibling,a),t.length=a)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,a,s){this.type=1,this._$AH=Z,this._$AN=void 0,this.element=e,this.name=t,this._$AM=a,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Z}_$AI(e,t=this,i,a){const s=this.strings;let r=!1;if(void 0===s)e=Q(this,e,t,0),r=!N(e)||e!==this._$AH&&e!==W,r&&(this._$AH=e);else{const a=e;let n,o;for(e=s[0],n=0;n<s.length-1;n++)o=Q(this,a[i+n],t,n),o===W&&(o=this._$AH[n]),r||=!N(o)||o!==this._$AH[n],o===Z?e=Z:e!==Z&&(e+=(o??"")+s[n+1]),this._$AH[n]=o}r&&!a&&this.j(e)}j(e){e===Z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ae extends ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===Z?void 0:e}}class se extends ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==Z)}}class re extends ie{constructor(e,t,i,a,s){super(e,t,i,a,s),this.type=5}_$AI(e,t=this){if((e=Q(this,e,t,0)??Z)===W)return;const i=this._$AH,a=e===Z&&i!==Z||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==Z&&(i===Z||a);a&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ne{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Q(this,e)}}const oe=C.litHtmlPolyfillSupport;oe?.(X,te),(C.litHtmlVersions??=[]).push("3.3.3");const de=globalThis;class le extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const a=i?.renderBefore??t;let s=a._$litPart$;if(void 0===s){const e=i?.renderBefore??null;a._$litPart$=s=new te(t.insertBefore(M(),e),e,void 0,i??{})}return s._$AI(e),s})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}le._$litElement$=!0,le.finalized=!0,de.litElementHydrateSupport?.({LitElement:le});const he=de.litElementPolyfillSupport;he?.({LitElement:le}),(de.litElementVersions??=[]).push("4.2.2");const ce=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},pe={attribute:!0,type:String,converter:w,reflect:!1,hasChanged:x},ue=(e=pe,t,i)=>{const{kind:a,metadata:s}=i;let r=globalThis.litPropertyMetadata.get(s);if(void 0===r&&globalThis.litPropertyMetadata.set(s,r=new Map),"setter"===a&&((e=Object.create(e)).wrapped=!0),r.set(i.name,e),"accessor"===a){const{name:a}=i;return{set(i){const s=t.get.call(this);t.set.call(this,i),this.requestUpdate(a,s,e,!0,i)},init(t){return void 0!==t&&this.C(a,void 0,e,t),t}}}if("setter"===a){const{name:a}=i;return function(i){const s=this[a];t.call(this,i),this.requestUpdate(a,s,e,!0,i)}}throw Error("Unsupported decorator location: "+a)};function me(e){return(t,i)=>"object"==typeof i?ue(e,t,i):((e,t,i)=>{const a=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),a?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function ge(e){return me({...e,state:!0,attribute:!1})}const fe=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];function _e(e){const t=new Date(e);return t.setHours(0,0,0,0),t}function ye(e,t){const i=new Date(e);return i.setDate(i.getDate()+t),i}function be(e,t){const i=new Date(e);return i.setDate(1),i.setMonth(i.getMonth()+t),i}function ve(e){const t=_e(e);return t.setDate(1),t}function we(e,t){const i=_e(e);return ye(i,-(i.getDay()-t+7)%7)}function xe(e,t){return e.getFullYear()===t.getFullYear()&&e.getMonth()===t.getMonth()&&e.getDate()===t.getDate()}function $e(e){return xe(e,new Date)}function ke(e){const t=`${e.getMonth()+1}`.padStart(2,"0"),i=`${e.getDate()}`.padStart(2,"0");return`${e.getFullYear()}-${t}-${i}`}function Ce(e){const t=e=>`${e}`.padStart(2,"0");return`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())} ${t(e.getHours())}:${t(e.getMinutes())}:00`}function Ae(e){const t=e=>`${e}`.padStart(2,"0");return`${t(e.getHours())}:${t(e.getMinutes())}`}function Se(e){switch(e.locale?.time_format){case"12":return!0;case"24":return!1;default:return}}function He(e){return e.locale?.language||e.language||"en"}function Te(e){const[t,i]=e.split(":").map(Number);return 60*(t||0)+(i||0)}function Ee(e=new Date){return 60*e.getHours()+e.getMinutes()}function Le(e,t){if(!e)return t;if(!0!==Se(e))return t;const i=new Date;return i.setHours(Math.floor(Te(t)/60),Te(t)%60,0,0),new Intl.DateTimeFormat(He(e),{hour:"numeric",minute:"2-digit",hour12:!0}).format(i)}function De(e){if(!e||"object"!=typeof e)return null;const t=e,i=(Array.isArray(t.periods)?t.periods:[]).map(e=>e).filter(e=>"string"==typeof e?.start&&"string"==typeof e?.end).map((e,t)=>({index:Number(e.index??t+1),start:String(e.start),end:String(e.end),startMinutes:Te(String(e.start)),endMinutes:Te(String(e.end))}));if(!i.length)return null;const a=(Array.isArray(t.breaks)?t.breaks:[]).map(e=>e).filter(e=>"string"==typeof e?.start&&"string"==typeof e?.end).map(e=>({after:Number(e.after??0),start:String(e.start),end:String(e.end),minutes:Number(e.minutes??0)})),s={};for(const[e,i]of Object.entries(t.subjects??{}))"string"==typeof i&&(s[e]=i);return{periods:i,breaks:a,subjects:s}}function ze(e){return function(e){const t={};if(!e||"object"!=typeof e)return t;for(const[i,a]of Object.entries(e)){const e=Number(i);if(!Number.isInteger(e)||e<0||e>6||!Array.isArray(a))continue;const s=a.map(e=>e).filter(e=>Boolean(e)&&"string"==typeof e.subject).map(e=>({period:Number(e.period??0),subject:String(e.subject),room:"string"==typeof e.room&&e.room?e.room:null})).sort((e,t)=>e.period-t.period);s.length&&(t[e]=s)}return t}(e?.attributes?.timetable)}function Me(e,t,i){return(e[t]??[]).find(e=>e.period===i)}function Ne(e,t=Ee()){return e.periods.find(e=>t>=e.startMinutes&&t<e.endMinutes)}function Ie(e){return!0===e.attributes?.hearth_board}function je(e,i){let a;if(i){if(a=e.states[i],!a)return null}else if(a=Object.values(e.states).find(Ie),!a)return null;const s=a.attributes,r=(Array.isArray(s.members)?s.members:[]).map((e,i)=>{const a=e;return{id:String(a.id??i),name:String(a.name??""),color:a.color||t[i%t.length],avatar:a.avatar??null,person:a.person??null,calendars:a.calendars??[],todo_lists:a.todo_lists??[],order:a.order??i}});r.sort((e,t)=>e.order-t.order||e.name.localeCompare(t.name));const n=e=>Array.isArray(s[e])?s[e]:[];return{entityId:a.entity_id,members:r,sharedCalendars:n("shared_calendars"),sharedTodoLists:n("shared_todo_lists"),readonlyCalendars:n("readonly_calendars"),timetable:De(s.timetable)}}function Oe(e,t){const i={};for(const t of[...e.sharedCalendars,...e.readonlyCalendars])i[t]={memberId:null,color:"#7a8b99"};for(const t of e.members)for(const e of t.calendars)i[e]={memberId:t.id,color:t.color};return i}function Pe(e){const t=new Set(e.readonlyCalendars),i=[...e.sharedCalendars,...e.members.flatMap(e=>e.calendars)];return[...new Set(i)].filter(e=>!t.has(e))}function Ue(e,t){return Object.values(e.states).find(e=>e.attributes?.member_id===t)}function Ve(e,t){const i=e.states[t];return i?.attributes?.friendly_name||t}const Re={"board.missing":"No Hearth board found. Add the Hearth integration.","board.missing_hint":"No Hearth board found. Add the Hearth integration, or set board_entity in this card.","board.no_members":"No family members yet. Add them in the Hearth integration's options.","calendar.month":"Month","calendar.week":"Week","calendar.day":"Day","calendar.previous":"Previous","calendar.today":"Today","calendar.next":"Next","calendar.new_event":"New event","calendar.no_calendars":"No calendars are assigned yet. Open the Hearth integration's options and give your family members their calendars.","calendar.load_failed":"Could not load: {items}","calendar.empty_day":"Nothing planned.","calendar.empty_day_tap":"Nothing planned. Tap to add something.","dialog.title":"New event","dialog.summary":"Title","dialog.calendar":"Calendar","dialog.date":"Date","dialog.all_day":"All day","dialog.from":"From","dialog.to":"To","dialog.note":"Note","dialog.cancel":"Cancel","dialog.save":"Save","dialog.saving":"Saving…","dialog.no_writable":"No writable calendar is configured. Add calendars to a family member, or remove one from the read-only list.","dialog.failed":"The event could not be created.","people.home":"Home","people.away":"Out","agenda.all_day":"All day","agenda.nothing_planned":"Nothing planned","agenda.nothing_coming":"Nothing coming up.","lists.empty":"Nothing on this list","lists.unreachable":"Not reachable right now","lists.show_more":"Show {count} more","lists.add":"Add","lists.add_placeholder":"Add an item","lists.none_configured":"No lists configured. Pick your family lists in the Hearth options, or set entities on this card.","routines.nothing_today":"Nothing today","routines.auto":"Automatic (by time of day)","routines.morning":"Morning","routines.evening":"Evening","routines.both":"Both","routines.none_configured":"No routines for today. Add them under Configure → Edit routines in the Hearth integration.","timetable.no_periods":"No lesson times yet. Add them under Configure → School timetable in the Hearth integration.","timetable.none_configured":"Nobody has a timetable yet. Add one under Configure → School timetable in the Hearth integration.","timetable.break":"Break","timetable.now":"Now","timetable.next":"Next","timetable.remaining":"{minutes} min left","timetable.done_for_today":"School is out for today.","timetable.layout_auto":"Automatic (week, one day when narrow)","timetable.layout_week":"Whole week","timetable.layout_day":"One day","timetable.days_auto":"Automatic (as the timetable needs)","timetable.days_school":"Monday to Friday","timetable.days_week":"All seven days","editor.board_entity":"Board sensor","editor.view":"Opening view","editor.views":"Available views","editor.show_legend":"Show the colour legend","editor.create":"Allow creating events by tapping a day","editor.default_calendar":"Preselected calendar","editor.max_events_per_day":'Events per day before "+N"',"editor.days":"Days ahead","editor.max_events":"Events per day","editor.hide_empty_days":"Hide days with nothing on them","editor.show_events":"Show today's events","editor.show_tasks":"Show open task counts","editor.show_points":"Show points","editor.entities":"To-do lists","editor.allow_add":"Allow adding items","editor.max_items":"Items before collapsing","editor.columns":"Columns","editor.weather_entity":"Weather entity","editor.greeting":"Greeting","editor.show_seconds":"Show seconds","editor.block":"Which block to show","editor.evening_from":"Evening starts at (hour)","editor.show_empty":"Show members with nothing on today","editor.members":"Limit to these members","editor.member":"Family member","editor.layout":"Layout","editor.week_days":"Days shown","editor.show_rooms":"Show rooms","editor.show_breaks":"Show breaks","editor.show_times":"Show lesson times","editor.hide_empty_periods":"Hide periods nobody has","editor.highlight":"Mark today and the running lesson"},Fe={en:Re,de:{"board.missing":"Kein Hearth-Board gefunden. Füge die Hearth-Integration hinzu.","board.missing_hint":"Kein Hearth-Board gefunden. Füge die Hearth-Integration hinzu oder setze board_entity in dieser Karte.","board.no_members":"Noch keine Familienmitglieder. Lege sie in den Optionen der Hearth-Integration an.","calendar.month":"Monat","calendar.week":"Woche","calendar.day":"Tag","calendar.previous":"Zurück","calendar.today":"Heute","calendar.next":"Weiter","calendar.new_event":"Neuer Termin","calendar.no_calendars":"Noch keine Kalender zugeordnet. Öffne die Optionen der Hearth-Integration und gib deinen Familienmitgliedern ihre Kalender.","calendar.load_failed":"Konnte nicht geladen werden: {items}","calendar.empty_day":"Nichts geplant.","calendar.empty_day_tap":"Nichts geplant. Zum Eintragen tippen.","dialog.title":"Neuer Termin","dialog.summary":"Titel","dialog.calendar":"Kalender","dialog.date":"Datum","dialog.all_day":"Ganztägig","dialog.from":"Von","dialog.to":"Bis","dialog.note":"Notiz","dialog.cancel":"Abbrechen","dialog.save":"Speichern","dialog.saving":"Speichert…","dialog.no_writable":"Kein beschreibbarer Kalender eingerichtet. Ordne einem Familienmitglied Kalender zu oder nimm einen aus der schreibgeschützten Liste heraus.","dialog.failed":"Der Termin konnte nicht angelegt werden.","people.home":"Zuhause","people.away":"Unterwegs","agenda.all_day":"Ganztägig","agenda.nothing_planned":"Nichts geplant","agenda.nothing_coming":"Nichts in Sicht.","lists.empty":"Diese Liste ist leer","lists.unreachable":"Gerade nicht erreichbar","lists.show_more":"{count} weitere anzeigen","lists.add":"Hinzufügen","lists.add_placeholder":"Eintrag hinzufügen","lists.none_configured":"Keine Listen eingerichtet. Wähle eure Familienlisten in den Hearth-Optionen oder setze entities auf dieser Karte.","routines.nothing_today":"Heute nichts","routines.auto":"Automatisch (nach Tageszeit)","routines.morning":"Morgen","routines.evening":"Abend","routines.both":"Beide","routines.none_configured":"Für heute sind keine Routinen hinterlegt. Trage sie in der Hearth-Integration unter „Konfigurieren → Routinen bearbeiten“ ein.","timetable.no_periods":"Noch keine Stundenzeiten. Trage sie in der Hearth-Integration unter „Konfigurieren → Stundenplan“ ein.","timetable.none_configured":"Noch hat niemand einen Stundenplan. Lege ihn in der Hearth-Integration unter „Konfigurieren → Stundenplan“ an.","timetable.break":"Pause","timetable.now":"Jetzt","timetable.next":"Danach","timetable.remaining":"noch {minutes} min","timetable.done_for_today":"Für heute ist Schule aus.","timetable.layout_auto":"Automatisch (Woche, schmal ein Tag)","timetable.layout_week":"Ganze Woche","timetable.layout_day":"Ein Tag","timetable.days_auto":"Automatisch (wie der Stundenplan es braucht)","timetable.days_school":"Montag bis Freitag","timetable.days_week":"Alle sieben Tage","editor.board_entity":"Board-Sensor","editor.view":"Startansicht","editor.views":"Verfügbare Ansichten","editor.show_legend":"Farblegende anzeigen","editor.create":"Termine per Tippen auf einen Tag anlegen","editor.default_calendar":"Vorausgewählter Kalender","editor.max_events_per_day":"Termine pro Tag vor „+N“","editor.days":"Tage im Voraus","editor.max_events":"Termine pro Tag","editor.hide_empty_days":"Tage ohne Termine ausblenden","editor.show_events":"Heutige Termine anzeigen","editor.show_tasks":"Offene Aufgaben anzeigen","editor.show_points":"Punkte anzeigen","editor.entities":"Aufgabenlisten","editor.allow_add":"Einträge hinzufügen erlauben","editor.max_items":"Einträge vor dem Einklappen","editor.columns":"Spalten","editor.weather_entity":"Wetter-Entität","editor.greeting":"Begrüßung","editor.show_seconds":"Sekunden anzeigen","editor.block":"Welcher Block angezeigt wird","editor.evening_from":"Abend beginnt um (Stunde)","editor.show_empty":"Mitglieder ohne Routine heute anzeigen","editor.members":"Auf diese Mitglieder beschränken","editor.member":"Familienmitglied","editor.layout":"Darstellung","editor.week_days":"Angezeigte Tage","editor.show_rooms":"Räume anzeigen","editor.show_breaks":"Pausen anzeigen","editor.show_times":"Stundenzeiten anzeigen","editor.hide_empty_periods":"Stunden ausblenden, die niemand hat","editor.highlight":"Heute und laufende Stunde hervorheben"}};function Be(e,t,i){const a=Fe[function(e){return(e?.locale?.language||e?.language||"en").toLowerCase().split("-")[0]}(e)]??Re;let s=a[t]??Re[t]??t;if(i)for(const[e,t]of Object.entries(i))s=s.replace(`{${e}}`,String(t));return s}const Ke={name:"board_entity",selector:{entity:{domain:"sensor"}}},We=e=>({name:e,selector:{boolean:{}}}),Ze=(e,t,i)=>({name:e,selector:{number:{min:t,max:i,mode:"box"}}}),Ge=(e,t,i=!1)=>({name:e,selector:{select:{options:t,multiple:i,mode:i?"list":"dropdown"}}});class qe extends le{constructor(){super(...arguments),this._config={type:""},this._label=e=>Be(this.hass,`editor.${e.name}`)}setConfig(e){this._config={...e}}_valueChanged(e){e.stopPropagation();const t={...this._config,...e.detail?.value??{}};for(const[e,i]of Object.entries(t))(void 0===i||""===i||Array.isArray(i)&&!i.length)&&delete t[e];var i,a;i="config-changed",a={config:t},this.dispatchEvent(new CustomEvent(i,{detail:a,bubbles:!0,composed:!0}))}render(){return this.hass?K`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this.schema()}
        .computeLabel=${this._label}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:K``}}i([me({attribute:!1})],qe.prototype,"hass",void 0),i([ge()],qe.prototype,"_config",void 0);let Ye=class extends qe{schema(){const e=[{value:"month",label:Be(this.hass,"calendar.month")},{value:"week",label:Be(this.hass,"calendar.week")},{value:"day",label:Be(this.hass,"calendar.day")}];return[Ke,Ge("view",e),Ge("views",e,!0),{name:"default_calendar",selector:{entity:{domain:"calendar"}}},Ze("max_events_per_day",1,10),We("show_legend"),We("create")]}};Ye=i([ce("hearth-calendar-card-editor")],Ye);let Je=class extends qe{schema(){return[Ke,Ze("days",1,14),Ze("max_events",1,20),We("hide_empty_days")]}};Je=i([ce("hearth-agenda-card-editor")],Je);let Xe=class extends qe{schema(){return[Ke,We("show_events"),Ze("max_events",1,5),We("show_tasks"),We("show_points")]}};Xe=i([ce("hearth-people-card-editor")],Xe);let Qe=class extends qe{schema(){return[Ke,{name:"entities",selector:{entity:{domain:"todo",multiple:!0}}},Ze("columns",1,6),Ze("max_items",1,50),We("allow_add")]}};Qe=i([ce("hearth-lists-card-editor")],Qe);let et=class extends qe{schema(){return[Ke,Ge("block",[{value:"auto",label:Be(this.hass,"routines.auto")},{value:"morning",label:Be(this.hass,"routines.morning")},{value:"evening",label:Be(this.hass,"routines.evening")},{value:"both",label:Be(this.hass,"routines.both")}]),Ze("evening_from",0,23),We("show_empty")]}};et=i([ce("hearth-routines-card-editor")],et);let tt=class extends qe{schema(){const e=(je(this.hass)?.members??[]).map(e=>({value:e.id,label:e.name}));return[Ke,...e.length>1?[Ge("member",e)]:[],Ge("layout",[{value:"auto",label:Be(this.hass,"timetable.layout_auto")},{value:"week",label:Be(this.hass,"timetable.layout_week")},{value:"day",label:Be(this.hass,"timetable.layout_day")}]),Ge("week_days",[{value:"auto",label:Be(this.hass,"timetable.days_auto")},{value:"school",label:Be(this.hass,"timetable.days_school")},{value:"week",label:Be(this.hass,"timetable.days_week")}]),We("show_rooms"),We("show_times"),We("show_breaks"),We("hide_empty_periods"),We("highlight")]}};tt=i([ce("hearth-timetable-card-editor")],tt);let it=class extends qe{schema(){return[{name:"weather_entity",selector:{entity:{domain:"weather"}}},{name:"greeting",selector:{text:{}}},We("show_seconds")]}};it=i([ce("hearth-header-card-editor")],it);const at=d`
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
`,st=d`
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
`,rt=d`
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
`;let nt=class extends le{constructor(){super(...arguments),this._config={type:""},this._now=new Date}static async getConfigElement(){return document.createElement("hearth-header-card-editor")}static getStubConfig(){return{show_seconds:!1}}setConfig(e){this._config={...e}}getCardSize(){return 2}getGridOptions(){return{columns:"full",rows:"auto"}}connectedCallback(){super.connectedCallback();const e=this._config.show_seconds?1e3:2e4;this._timer=window.setInterval(()=>{this._now=new Date},e)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&(window.clearInterval(this._timer),this._timer=void 0)}_weather(){const e=this._config.weather_entity;if(!e)return Z;const t=this.hass.states[e];if(!t)return Z;const i=t.attributes?.temperature,a=t.attributes?.temperature_unit??"",s=this.hass.formatEntityState(t);return K`
      <div class="weather">
        <div class="temperature">
          ${"number"==typeof i?`${Math.round(i)}${a}`:"—"}
        </div>
        <div class="condition">${s}</div>
      </div>
    `}render(){if(!this.hass)return K`<ha-card></ha-card>`;const e=He(this.hass),t=new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit",...this._config.show_seconds?{second:"2-digit"}:{},hour12:Se(this.hass)}).format(this._now),i=new Intl.DateTimeFormat(e,{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(this._now);return K`
      <ha-card>
        <div class="bar">
          <div class="left">
            <div class="clock">${t}</div>
            <div class="date">${i}</div>
            ${this._config.greeting?K`<div class="greeting">${this._config.greeting}</div>`:Z}
          </div>
          ${this._weather()}
        </div>
      </ha-card>
    `}};function ot(e){return e.date?{date:_e(new Date(`${e.date}T00:00:00`)),allDay:!0}:{date:new Date(e.dateTime),allDay:!1}}async function dt(e,t,i,a){const s=`start=${encodeURIComponent(i.toISOString())}&end=${encodeURIComponent(a.toISOString())}`,r=await Promise.all(Object.keys(t).map(async i=>{try{const a=await e.callApi("GET",`calendars/${i}?${s}`);return{entityId:i,events:(a||[]).map(e=>function(e,t,i){if(!e?.start||!e?.end)return null;const a=ot(e.start),s=ot(e.end);return Number.isNaN(a.date.getTime())||Number.isNaN(s.date.getTime())?null:{summary:e.summary||"",start:a.date,end:s.date,allDay:a.allDay,calendar:t,memberId:i.memberId,color:i.color,description:e.description,location:e.location,uid:e.uid,recurrenceId:e.recurrence_id}}(e,i,t[i])).filter(e=>null!==e)}}catch(e){return console.warn(`[hearth] could not load ${i}`,e),{entityId:i,events:null}}})),n=[],o=[];for(const e of r)null===e.events?o.push(e.entityId):n.push(...e.events);return n.sort((e,t)=>e.allDay!==t.allDay?e.allDay?-1:1:e.start.getTime()-t.start.getTime()),{events:n,failed:o}}function lt(e,t){const i=[];for(let a=_e(e);a<t;a=ye(a,1))i.push(a);return i}function ht(e,t){const i=t.map(e=>({key:ke(e),from:e.getTime(),to:ye(e,1).getTime()})),a=new Map(i.map(e=>[e.key,[]]));for(const t of e){const e=t.start.getTime(),s=t.end.getTime();for(const r of i)e<r.to&&s>r.from&&a.get(r.key).push(t)}return a}nt.styles=[at,d`
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
    `],i([me({attribute:!1})],nt.prototype,"hass",void 0),i([ge()],nt.prototype,"_config",void 0),i([ge()],nt.prototype,"_now",void 0),nt=i([ce("hearth-header-card")],nt),window.customCards=window.customCards||[],window.customCards.push({type:"hearth-header-card",name:"Hearth Header",description:"Clock, date and weather, sized to be read from across the room.",preview:!0,documentationURL:"https://github.com/DomCim/Homeassistant-hearth"});const ct="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z",pt="M14,4V6H18V18H14V20H20V4M13,12L9,8V11H1V13H9V16L13,12Z",ut="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z",mt="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z";let gt=class extends le{constructor(){super(...arguments),this._config={type:""},this._events=[],this._loadedSignature="",this._reloadToken=0}static async getConfigElement(){return document.createElement("hearth-people-card-editor")}static getStubConfig(){return{show_events:!0,max_events:2}}setConfig(e){this._config={...e}}getCardSize(){return 4}getGridOptions(){return{columns:"full",rows:"auto"}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>{this._reloadToken+=1,this._maybeFetch()},6e5)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&(window.clearInterval(this._timer),this._timer=void 0)}updated(e){super.updated(e),this._maybeFetch()}async _maybeFetch(){const e=this.hass,t=e?je(e,this._config.board_entity):null;if(!e||!t||!1===this._config.show_events)return;const i=Oe(t),a=Object.keys(i).sort(),s=_e(new Date),r=a.map(t=>e.states[t]?.last_changed??"-"),n=[s.getTime(),a.join(","),r.join(","),this._reloadToken].join("|");if(n===this._loadedSignature||0===a.length)return;this._loadedSignature=n;const{events:o}=await dt(e,i,s,ye(s,1));this._loadedSignature===n&&(this._events=o)}_icon(e){return K`<svg viewBox="0 0 24 24"><path d=${e} /></svg>`}_formatTime(e){return new Intl.DateTimeFormat(He(this.hass),{hour:"numeric",minute:"2-digit",hour12:Se(this.hass)}).format(e)}_presence(e){if(!e.person)return null;const t=this.hass.states[e.person]?.state;return t&&"unknown"!==t&&"unavailable"!==t?"home"===t?{label:Be(this.hass,"people.home"),home:!0}:"not_home"===t?{label:Be(this.hass,"people.away"),home:!1}:{label:t,home:!1}:null}_renderMember(e){const t=Ue(this.hass,e.id),i=this._presence(e),a=Number(t?.state),s=!1!==this._config.show_tasks&&Number.isFinite(a),r=t?.attributes?.points,n=!1!==this._config.show_points&&"number"==typeof r,o=_e(new Date),d=!1===this._config.show_events?[]:this._events.filter(t=>t.memberId===e.id&&function(e,t){const i=_e(t),a=ye(i,1);return e.start<a&&e.end>i}(t,o)).slice(0,this._config.max_events??2),l=e.name.trim().charAt(0).toUpperCase()||"?";return K`
      <div class="person" style=${`--member-color:${e.color}`}>
        <div class="avatar ${i&&!i.home?"away":""}">
          ${e.avatar?K`<img src=${e.avatar} alt="" />`:K`<span>${l}</span>`}
        </div>

        <div class="name">${e.name}</div>

        <div class="chips">
          ${i?K`<span class="chip">
                ${this._icon(i.home?ct:pt)}${i.label}
              </span>`:Z}
          ${s&&a>0?K`<span class="chip">${this._icon(ut)}${a}</span>`:Z}
          ${n?K`<span class="chip">${this._icon(mt)}${r}</span>`:Z}
        </div>

        ${d.length>0?K`<div class="today">
              ${d.map(e=>K`
                  <div class="today-event">
                    ${e.allDay?Z:K`<span class="time">${this._formatTime(e.start)}</span>`}
                    <span class="summary">${e.summary}</span>
                  </div>
                `)}
            </div>`:Z}
      </div>
    `}render(){if(!this.hass)return K`<ha-card></ha-card>`;const e=je(this.hass,this._config.board_entity);return e&&0!==e.members.length?K`
      <ha-card>
        <div class="strip">${e.members.map(e=>this._renderMember(e))}</div>
      </ha-card>
    `:K`
        <ha-card>
          <div class="notice">${Be(this.hass,"board.no_members")}</div>
        </ha-card>
      `}};gt.styles=[at,st,d`
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
    `],i([me({attribute:!1})],gt.prototype,"hass",void 0),i([ge()],gt.prototype,"_config",void 0),i([ge()],gt.prototype,"_events",void 0),gt=i([ce("hearth-people-card")],gt),window.customCards=window.customCards||[],window.customCards.push({type:"hearth-people-card",name:"Hearth People",description:"Who's home, what's on today, open tasks and points.",preview:!0,documentationURL:"https://github.com/DomCim/Homeassistant-hearth"});let ft=class extends le{constructor(){super(...arguments),this._summary="",this._calendar="",this._dateKey="",this._allDay=!0,this._startTime="",this._endTime="",this._description="",this._saving=!1}connectedCallback(){super.connectedCallback();const e=Pe(this.board);this._calendar=this.defaultCalendar&&e.includes(this.defaultCalendar)?this.defaultCalendar:e[0]??"",this._dateKey=ke(this.day);const t=new Date(this.day);t.setHours(9,0,0,0),this._startTime=Ae(t),t.setHours(t.getHours()+1),this._endTime=Ae(t)}_close(){this.dispatchEvent(new CustomEvent("hearth-close",{bubbles:!0,composed:!0}))}_onScrimClick(e){e.target===e.currentTarget&&this._close()}async _save(){const e=this._summary.trim();if(!e||!this._calendar||this._saving)return;const t=function(e){const[t,i,a]=e.split("-").map(Number);return new Date(t,i-1,a)}(this._dateKey);let i,a;if(this._allDay)i=t,a=ye(t,1);else{const[e,s]=this._startTime.split(":").map(Number),[r,n]=this._endTime.split(":").map(Number);i=new Date(t),i.setHours(e,s,0,0),a=new Date(t),a.setHours(r,n,0,0),a<=i&&(a=ye(a,1))}this._saving=!0,this._error=void 0;try{await async function(e,t,i){const a={summary:i.summary};i.description&&(a.description=i.description),i.allDay?(a.start_date=ke(i.start),a.end_date=ke(i.end)):(a.start_date_time=Ce(i.start),a.end_date_time=Ce(i.end)),await e.callService("calendar","create_event",a,{entity_id:t})}(this.hass,this._calendar,{summary:e,start:i,end:a,allDay:this._allDay,description:this._description.trim()||void 0}),this.dispatchEvent(new CustomEvent("hearth-created",{bubbles:!0,composed:!0})),this._close()}catch(e){this._error=e instanceof Error?e.message:Be(this.hass,"dialog.failed")}finally{this._saving=!1}}_calendarOptions(){const e=new Map;for(const t of this.board.members)for(const i of t.calendars)e.set(i,t.name);return Pe(this.board).map(t=>{const i=e.get(t),a=i?`${i} — ${Ve(this.hass,t)}`:Ve(this.hass,t);return K`<option value=${t} ?selected=${t===this._calendar}>
        ${a}
      </option>`})}render(){const e=this._calendarOptions(),t=Boolean(this._summary.trim()&&this._calendar)&&!this._saving;return K`
      <div class="scrim" @click=${this._onScrimClick}>
        <div class="sheet" role="dialog" aria-modal="true">
          <h2>${Be(this.hass,"dialog.title")}</h2>

          ${this._error?K`<p class="error">${this._error}</p>`:Z}
          ${0===e.length?K`<p class="error">${Be(this.hass,"dialog.no_writable")}</p>`:Z}

          <div class="field">
            <label for="summary">${Be(this.hass,"dialog.summary")}</label>
            <input
              id="summary"
              type="text"
              .value=${this._summary}
              autocomplete="off"
              @input=${e=>{this._summary=e.target.value}}
            />
          </div>

          <div class="field">
            <label for="calendar">${Be(this.hass,"dialog.calendar")}</label>
            <select
              id="calendar"
              @change=${e=>{this._calendar=e.target.value}}
            >
              ${e}
            </select>
          </div>

          <div class="field">
            <label for="date">${Be(this.hass,"dialog.date")}</label>
            <input
              id="date"
              type="date"
              .value=${this._dateKey}
              @change=${e=>{this._dateKey=e.target.value}}
            />
          </div>

          <button
            id="allday"
            class="switch-row"
            role="switch"
            aria-checked=${this._allDay}
            @click=${()=>{this._allDay=!this._allDay}}
          >
            <span>${Be(this.hass,"dialog.all_day")}</span>
            <span class="switch"></span>
          </button>

          ${this._allDay?Z:K`
                <div class="row">
                  <div class="field">
                    <label for="from">${Be(this.hass,"dialog.from")}</label>
                    <input
                      id="from"
                      type="time"
                      .value=${this._startTime}
                      @change=${e=>{this._startTime=e.target.value}}
                    />
                  </div>
                  <div class="field">
                    <label for="to">${Be(this.hass,"dialog.to")}</label>
                    <input
                      id="to"
                      type="time"
                      .value=${this._endTime}
                      @change=${e=>{this._endTime=e.target.value}}
                    />
                  </div>
                </div>
              `}

          <div class="field">
            <label for="note">${Be(this.hass,"dialog.note")}</label>
            <textarea
              id="note"
              .value=${this._description}
              @input=${e=>{this._description=e.target.value}}
            ></textarea>
          </div>

          <div class="actions">
            <button class="ghost" @click=${this._close}>${Be(this.hass,"dialog.cancel")}</button>
            <button class="primary" ?disabled=${!t} @click=${this._save}>
              ${Be(this.hass,this._saving?"dialog.saving":"dialog.save")}
            </button>
          </div>
        </div>
      </div>
    `}};ft.styles=[at,st,rt],i([me({attribute:!1})],ft.prototype,"hass",void 0),i([me({attribute:!1})],ft.prototype,"board",void 0),i([me({attribute:!1})],ft.prototype,"day",void 0),i([me({attribute:!1})],ft.prototype,"defaultCalendar",void 0),i([ge()],ft.prototype,"_summary",void 0),i([ge()],ft.prototype,"_calendar",void 0),i([ge()],ft.prototype,"_dateKey",void 0),i([ge()],ft.prototype,"_allDay",void 0),i([ge()],ft.prototype,"_startTime",void 0),i([ge()],ft.prototype,"_endTime",void 0),i([ge()],ft.prototype,"_description",void 0),i([ge()],ft.prototype,"_saving",void 0),i([ge()],ft.prototype,"_error",void 0),ft=i([ce("hearth-event-dialog")],ft);const _t=["month","week","day"],yt="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z",bt="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",vt="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z",wt="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",xt="M13,14H11V9H13M13,18H11V16H13M1,21H23L12,2L1,21Z";let $t=class extends le{constructor(){super(...arguments),this._config={type:""},this._view="month",this._anchor=_e(new Date),this._events=[],this._failed=[],this._loading=!1,this._loadedSignature="",this._reloadToken=0}static async getConfigElement(){return document.createElement("hearth-calendar-card-editor")}static getStubConfig(){return{view:"month",show_legend:!0,create:!0}}setConfig(e){this._config={...e},e.view&&_t.includes(e.view)&&(this._view=e.view)}getCardSize(){return"month"===this._view?12:8}getGridOptions(){return{columns:"full",rows:"month"===this._view?12:8}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._reload(),3e5)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&(window.clearInterval(this._timer),this._timer=void 0)}updated(e){super.updated(e),this._maybeFetch()}get _board(){return this.hass?je(this.hass,this._config.board_entity):null}get _firstDay(){return this.hass?function(e){const t=e.locale?.first_weekday;if(t&&"language"!==t){const e=fe.indexOf(t);if(e>=0)return e}try{const t=new Intl.Locale(e.locale?.language||e.language||"en").weekInfo;if(t?.firstDay)return t.firstDay%7}catch{}return 1}(this.hass):1}_range(){if("month"===this._view){const{start:e,end:t}=function(e,t){const i=we(ve(e),t);let a=we(ye(be(ve(e),1),-1),t);a=ye(a,7);let s=Math.round((a.getTime()-i.getTime())/6048e5);return s<6&&(a=ye(a,7*(6-s)),s=6),{start:i,end:a,weeks:s}}(this._anchor,this._firstDay);return{start:e,end:t}}if("week"===this._view){const e=we(this._anchor,this._firstDay);return{start:e,end:ye(e,7)}}const e=_e(this._anchor);return{start:e,end:ye(e,1)}}_reload(){this._reloadToken+=1,this._maybeFetch()}async _maybeFetch(){const e=this.hass,t=this._board;if(!e||!t)return;const i=Oe(t),a=Object.keys(i).sort(),{start:s,end:r}=this._range(),n=a.map(t=>e.states[t]?.last_changed??"-"),o=[s.getTime(),r.getTime(),a.join(","),n.join(","),this._reloadToken].join("|");if(o!==this._loadedSignature){if(this._loadedSignature=o,0===a.length)return this._events=[],void(this._failed=[]);this._loading=!0;try{const{events:t,failed:a}=await dt(e,i,s,r);this._loadedSignature===o&&(this._events=t,this._failed=a)}finally{this._loadedSignature===o&&(this._loading=!1)}}}_step(e){"month"===this._view?this._anchor=be(this._anchor,e):"week"===this._view?this._anchor=ye(this._anchor,7*e):this._anchor=ye(this._anchor,e)}_goToday(){this._anchor=_e(new Date)}_setView(e){this._view=e}get _createEnabled(){return!1!==this._config.create}_openCreate(e){this._createEnabled&&(this._dialogDay=e)}_openDay(e){this._anchor=_e(e),this._view="day"}_formatTime(e){return new Intl.DateTimeFormat(He(this.hass),{hour:"numeric",minute:"2-digit",hour12:Se(this.hass)}).format(e)}_title(){const e=He(this.hass);if("month"===this._view)return new Intl.DateTimeFormat(e,{month:"long",year:"numeric"}).format(this._anchor);if("week"===this._view){const{start:t,end:i}=this._range();return new Intl.DateTimeFormat(e,{day:"numeric",month:"short",year:"numeric"}).formatRange(t,ye(i,-1))}return new Intl.DateTimeFormat(e,{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(this._anchor)}_weekdayLabels(){const e=new Intl.DateTimeFormat(He(this.hass),{weekday:"short"}),t=we(new Date,this._firstDay);return Array.from({length:7},(i,a)=>e.format(ye(t,a)))}_icon(e){return K`<svg viewBox="0 0 24 24"><path d=${e} /></svg>`}_renderEvent(e,t){const i=e.allDay?"":this._formatTime(e.start);return K`
      <div
        class="event ${e.allDay?"all-day":""}"
        style=${`--event-color:${e.color}`}
        title=${e.summary}
      >
        ${e.allDay?Z:K`<span class="dot"></span><span class="time">${i}</span>`}
        <span class="summary">${e.summary}</span>
        ${t||!e.location?Z:K`<span class="location">${e.location}</span>`}
      </div>
    `}_renderMonth(){const{start:e,end:t}=this._range(),i=lt(e,t),a=ht(this._events,i),s=this._config.max_events_per_day??3,r=this._anchor.getMonth();return K`
      <div class="weekday-row">
        ${this._weekdayLabels().map(e=>K`<div class="weekday">${e}</div>`)}
      </div>
      <div class="month-grid" style=${"--weeks:"+i.length/7}>
        ${i.map(e=>{const t=a.get(ke(e))??[],i=t.slice(0,s),n=t.length-i.length;return K`
            <div
              class="day-cell ${e.getMonth()===r?"":"outside"} ${$e(e)?"today":""}"
              @click=${()=>this._openCreate(e)}
            >
              <button
                class="day-number"
                @click=${t=>{t.stopPropagation(),this._openDay(e)}}
              >
                ${e.getDate()}
              </button>
              <div class="day-events">
                ${i.map(e=>this._renderEvent(e,!0))}
                ${n>0?K`<button
                      class="more"
                      @click=${t=>{t.stopPropagation(),this._openDay(e)}}
                    >
                      +${n}
                    </button>`:Z}
              </div>
            </div>
          `})}
      </div>
    `}_renderWeek(){const{start:e,end:t}=this._range(),i=lt(e,t),a=ht(this._events,i),s=new Intl.DateTimeFormat(He(this.hass),{weekday:"short",day:"numeric"});return K`
      <div class="week-grid">
        ${i.map(e=>{const t=a.get(ke(e))??[];return K`
            <div
              class="week-column ${$e(e)?"today":""}"
              @click=${()=>this._openCreate(e)}
            >
              <div class="week-heading">${s.format(e)}</div>
              <div class="week-events">
                ${0===t.length?K`<div class="empty-hint">—</div>`:t.map(e=>this._renderEvent(e,!0))}
              </div>
            </div>
          `})}
      </div>
    `}_renderDay(){const{start:e,end:t}=this._range(),i=ht(this._events,lt(e,t)).get(ke(e))??[];return K`
      <div class="day-list" @click=${()=>this._openCreate(e)}>
        ${0===i.length?K`<div class="empty-day">
              ${Be(this.hass,this._createEnabled?"calendar.empty_day_tap":"calendar.empty_day")}
            </div>`:i.map(e=>this._renderEvent(e,!1))}
      </div>
    `}_renderLegend(e){return!1===this._config.show_legend||0===e.members.length?Z:K`
      <div class="legend">
        ${e.members.map(e=>K`
            <span class="legend-item">
              <span class="swatch" style=${`background:${e.color}`}></span>
              ${e.name}
            </span>
          `)}
      </div>
    `}render(){if(!this.hass)return K`<ha-card></ha-card>`;const e=this._board;if(!e)return K`
        <ha-card>
          <div class="notice">${Be(this.hass,"board.missing_hint")}</div>
        </ha-card>
      `;const t=Oe(e),i=this._config.views??_t;return K`
      <ha-card>
        <div class="toolbar">
          <button class="icon-button" @click=${()=>this._step(-1)} aria-label=${Be(this.hass,"calendar.previous")}>
            ${this._icon(yt)}
          </button>
          <button class="icon-button" @click=${this._goToday} aria-label=${Be(this.hass,"calendar.today")}>
            ${this._icon(vt)}
          </button>
          <button class="icon-button" @click=${()=>this._step(1)} aria-label=${Be(this.hass,"calendar.next")}>
            ${this._icon(bt)}
          </button>
          <h1 class="title">${this._title()}</h1>
          ${i.length>1?K`<div class="segmented">
                ${i.map(e=>K`
                    <button
                      aria-pressed=${this._view===e}
                      @click=${()=>this._setView(e)}
                    >
                      ${Be(this.hass,`calendar.${e}`)}
                    </button>
                  `)}
              </div>`:Z}
          ${this._createEnabled?K`<button
                class="icon-button"
                aria-label=${Be(this.hass,"calendar.new_event")}
                @click=${()=>this._openCreate(_e(this._anchor))}
              >
                ${this._icon(wt)}
              </button>`:Z}
        </div>

        ${this._renderLegend(e)}
        ${0===Object.keys(t).length?K`<div class="notice">${Be(this.hass,"calendar.no_calendars")}</div>`:Z}
        ${this._failed.length>0?K`<div class="warning">
              ${this._icon(xt)}
              <span>${Be(this.hass,"calendar.load_failed",{items:this._failed.join(", ")})}</span>
            </div>`:Z}

        <div class="body ${this._loading?"loading":""}">
          ${"month"===this._view?this._renderMonth():"week"===this._view?this._renderWeek():this._renderDay()}
        </div>

        ${this._dialogDay?K`<hearth-event-dialog
              .hass=${this.hass}
              .board=${e}
              .day=${this._dialogDay}
              .defaultCalendar=${this._config.default_calendar}
              @hearth-close=${()=>{this._dialogDay=void 0}}
              @hearth-created=${()=>this._reload()}
            ></hearth-event-dialog>`:Z}
      </ha-card>
    `}};$t.styles=[at,st,d`
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
    `],i([me({attribute:!1})],$t.prototype,"hass",void 0),i([ge()],$t.prototype,"_config",void 0),i([ge()],$t.prototype,"_view",void 0),i([ge()],$t.prototype,"_anchor",void 0),i([ge()],$t.prototype,"_events",void 0),i([ge()],$t.prototype,"_failed",void 0),i([ge()],$t.prototype,"_loading",void 0),i([ge()],$t.prototype,"_dialogDay",void 0),$t=i([ce("hearth-calendar-card")],$t),window.customCards=window.customCards||[],window.customCards.push({type:"hearth-calendar-card",name:"Hearth Calendar",description:"Family calendar as a month, week or day grid, coloured per member.",preview:!0,documentationURL:"https://github.com/DomCim/Homeassistant-hearth"});let kt=class extends le{constructor(){super(...arguments),this._config={type:""},this._events=[],this._loadedSignature="",this._reloadToken=0}static async getConfigElement(){return document.createElement("hearth-agenda-card-editor")}static getStubConfig(){return{days:3,max_events:6}}setConfig(e){this._config={...e}}getCardSize(){return 6}getGridOptions(){return{columns:"full",rows:"auto"}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>{this._reloadToken+=1,this._maybeFetch()},3e5)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&(window.clearInterval(this._timer),this._timer=void 0)}updated(e){super.updated(e),this._maybeFetch()}get _days(){return Math.max(1,this._config.days??3)}async _maybeFetch(){const e=this.hass,t=e?je(e,this._config.board_entity):null;if(!e||!t)return;const i=Oe(t),a=Object.keys(i).sort(),s=_e(new Date),r=ye(s,this._days),n=a.map(t=>e.states[t]?.last_changed??"-"),o=[s.getTime(),r.getTime(),a.join(","),n.join(","),this._reloadToken].join("|");if(o===this._loadedSignature)return;if(this._loadedSignature=o,0===a.length)return void(this._events=[]);const{events:d}=await dt(e,i,s,r);this._loadedSignature===o&&(this._events=d)}_formatTime(e){return new Intl.DateTimeFormat(He(this.hass),{hour:"numeric",minute:"2-digit",hour12:Se(this.hass)}).format(e)}_dayLabel(e){const t=_e(new Date),i=He(this.hass);return xe(e,t)?new Intl.RelativeTimeFormat(i,{numeric:"auto"}).format(0,"day"):xe(e,ye(t,1))?new Intl.RelativeTimeFormat(i,{numeric:"auto"}).format(1,"day"):new Intl.DateTimeFormat(i,{weekday:"long",day:"numeric",month:"long"}).format(e)}render(){if(!this.hass)return K`<ha-card></ha-card>`;const e=je(this.hass,this._config.board_entity);if(!e)return K`<ha-card
        ><div class="notice">${Be(this.hass,"board.missing")}</div></ha-card
      >`;const t=_e(new Date),i=lt(t,ye(t,this._days)),a=ht(this._events,i),s=this._config.max_events??6,r=new Map(e.members.map(e=>[e.id,e.name])),n=i.filter(e=>!0!==this._config.hide_empty_days||(a.get(ke(e))?.length??0)>0);return K`
      <ha-card>
        ${0===n.length?K`<div class="notice">${Be(this.hass,"agenda.nothing_coming")}</div>`:n.map(e=>{const t=(a.get(ke(e))??[]).slice(0,s);return K`
                <section class="day">
                  <h3 class="day-label">${this._dayLabel(e)}</h3>
                  ${0===t.length?K`<div class="empty">${Be(this.hass,"agenda.nothing_planned")}</div>`:t.map(e=>K`
                          <div class="row" style=${`--event-color:${e.color}`}>
                            <span class="when">
                              ${e.allDay?Be(this.hass,"agenda.all_day"):this._formatTime(e.start)}
                            </span>
                            <span class="what">${e.summary}</span>
                            ${e.memberId&&r.has(e.memberId)?K`<span class="who">${r.get(e.memberId)}</span>`:Z}
                          </div>
                        `)}
                </section>
              `})}
      </ha-card>
    `}};kt.styles=[at,st,d`
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
    `],i([me({attribute:!1})],kt.prototype,"hass",void 0),i([ge()],kt.prototype,"_config",void 0),i([ge()],kt.prototype,"_events",void 0),kt=i([ce("hearth-agenda-card")],kt),window.customCards=window.customCards||[],window.customCards.push({type:"hearth-agenda-card",name:"Hearth Agenda",description:"The next few days as a list, coloured per family member.",preview:!0,documentationURL:"https://github.com/DomCim/Homeassistant-hearth"});const Ct="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",At="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z",St="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z",Ht="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95Z";let Tt=class extends le{constructor(){super(...arguments),this._config={type:""},this._pending=new Set}static async getConfigElement(){return document.createElement("hearth-routines-card-editor")}static getStubConfig(){return{block:"auto",evening_from:14}}setConfig(e){this._config={...e}}getCardSize(){return 6}getGridOptions(){return{columns:"full",rows:"auto"}}get _blocks(){const e=this._config.block??"auto";if("morning"===e||"evening"===e)return[e];if("both"===e)return["morning","evening"];const t=this._config.evening_from??14;return[(new Date).getHours()<t?"morning":"evening"]}_steps(e,t){const i=Ue(this.hass,e.id),a=i?.attributes?.[`routine_${t}`];return Array.isArray(a)?a.filter(e=>Boolean(e)&&"object"==typeof e).map(e=>({step:String(e.step??""),done:Boolean(e.done)})):[]}async _toggle(e,t,i){const a=`${e.id}|${t}|${i.step}`;this._pending=new Set(this._pending).add(a);try{await this.hass.callService("hearth","set_routine_step",{member:e.id,block:t,step:i.step,done:!i.done})}catch(e){console.warn("[hearth] could not update routine step",e)}finally{const e=new Set(this._pending);e.delete(a),this._pending=e}}_icon(e,t=""){return K`<svg class=${t} viewBox="0 0 24 24"><path d=${e} /></svg>`}_renderBlock(e,t){const i=this._steps(e,t),a=i.filter(e=>e.done).length,s=i.length>0&&a===i.length;return K`
      <section class="block ${s?"complete":""}">
        <header class="block-head">
          ${this._icon("morning"===t?St:Ht,"block-icon")}
          <span class="progress">${a}/${i.length}</span>
        </header>

        ${0===i.length?K`<div class="empty">${Be(this.hass,"routines.nothing_today")}</div>`:K`
              <div class="bar">
                <div
                  class="bar-fill"
                  style=${`width:${i.length?a/i.length*100:0}%`}
                ></div>
              </div>
              ${i.map(i=>{const a=`${e.id}|${t}|${i.step}`,s=this._pending.has(a),r=s?!i.done:i.done;return K`
                  <button
                    class="step ${r?"done":""} ${s?"pending":""}"
                    @click=${()=>this._toggle(e,t,i)}
                  >
                    ${this._icon(r?At:Ct,"tick")}
                    <span class="label">${i.step}</span>
                  </button>
                `})}
            `}
      </section>
    `}render(){if(!this.hass)return K`<ha-card></ha-card>`;const e=je(this.hass,this._config.board_entity);if(!e)return K`<ha-card
        ><div class="notice">${Be(this.hass,"board.missing")}</div></ha-card
      >`;const t=this._blocks,i=this._config.members?.map(e=>e.toLowerCase()),a=e.members.filter(e=>!(i&&!i.includes(e.id.toLowerCase())&&!i.includes(e.name.toLowerCase()))&&(!0===this._config.show_empty||t.some(t=>this._steps(e,t).length>0)));return 0===a.length?K`
        <ha-card>
          <div class="notice">${Be(this.hass,"routines.none_configured")}</div>
        </ha-card>
      `:K`
      <ha-card>
        <div class="grid">
          ${a.map(e=>K`
              <div class="person" style=${`--member-color:${e.color}`}>
                <div class="person-name">${e.name}</div>
                ${t.map(t=>this._renderBlock(e,t))}
              </div>
            `)}
        </div>
      </ha-card>
    `}};Tt.styles=[at,st,d`
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
    `],i([me({attribute:!1})],Tt.prototype,"hass",void 0),i([ge()],Tt.prototype,"_config",void 0),i([ge()],Tt.prototype,"_pending",void 0),Tt=i([ce("hearth-routines-card")],Tt),window.customCards=window.customCards||[],window.customCards.push({type:"hearth-routines-card",name:"Hearth Routines",description:"Daily routines per child and weekday, ticked off by the kids themselves.",preview:!0,documentationURL:"https://github.com/DomCim/Homeassistant-hearth"});const Et=new Date(2024,0,1);let Lt=class extends le{constructor(){super(...arguments),this._config={type:""},this._narrow=!1,this._tick=0}static async getConfigElement(){return document.createElement("hearth-timetable-card-editor")}static getStubConfig(){return{layout:"auto",week_days:"auto"}}setConfig(e){this._config={...e}}getCardSize(){return 8}getGridOptions(){return{columns:"full",rows:"auto"}}connectedCallback(){super.connectedCallback(),this._resizeObserver=new ResizeObserver(([e])=>{this._narrow=e.contentRect.width<560}),this._resizeObserver.observe(this),this._timer=setInterval(()=>{this._tick+=1},3e4)}disconnectedCallback(){this._resizeObserver?.disconnect(),this._resizeObserver=void 0,this._timer&&(clearInterval(this._timer),this._timer=void 0),super.disconnectedCallback()}_candidates(e){const t=(this._config.members??(this._config.member?[this._config.member]:[])).map(e=>e.toLowerCase());return e.filter(e=>!t.length||t.includes(e.id.toLowerCase())||t.includes(e.name.toLowerCase())).map(e=>({member:e,week:ze(Ue(this.hass,e.id))})).filter(e=>{return t=e.week,Object.values(t).some(e=>e.length>0);var t})}_weekdays(e){const t=this._config.week_days??"auto";if("week"===t)return[0,1,2,3,4,5,6];if("school"===t)return[0,1,2,3,4];const i=Object.keys(e).map(Number).filter(t=>(e[t]??[]).length>0),a=Math.max(4,...i);return Array.from({length:a+1},(e,t)=>t)}_weekdayName(e,t){const i=new Date(Et);return i.setDate(i.getDate()+e),new Intl.DateTimeFormat(He(this.hass),{weekday:t}).format(i)}_color(e,t){return e.subjects[t]??"var(--hearth-line)"}_renderChips(e,t){return e.length<2?Z:K`
      <div class="chips">
        ${e.map(({member:e})=>K`
            <button
              class="chip"
              style=${`--member-color:${e.color}`}
              aria-pressed=${e.id===t.id}
              @click=${()=>{this._memberId=e.id}}
            >
              ${e.name}
            </button>
          `)}
      </div>
    `}_renderStatus(e,t,i){if(!1===this._config.highlight)return Z;const a=Ee(),s=Ne(e,a),r=s?Me(t,i,s.index):void 0;if(s&&r){const t=s.endMinutes-a;return K`
        <div class="status">
          <span class="pill" style=${`--subject:${this._color(e,r.subject)}`}
            >${Be(this.hass,"timetable.now")}</span
          >
          <span class="status-text">
            ${r.subject}${r.room?K` · ${r.room}`:Z}
          </span>
          <span class="status-muted">${Be(this.hass,"timetable.remaining",{minutes:t})}</span>
        </div>
      `}const n=function(e,t,i,a=Ee()){for(const s of e.periods){if(s.startMinutes<=a)continue;const e=Me(t,i,s.index);if(e)return{lesson:e,period:s}}return null}(e,t,i,a);return n?K`
        <div class="status">
          <span class="pill next">${Be(this.hass,"timetable.next")}</span>
          <span class="status-text">
            ${n.lesson.subject}${n.lesson.room?K` · ${n.lesson.room}`:Z}
          </span>
          <span class="status-muted">${Le(this.hass,n.period.start)}</span>
        </div>
      `:(t[i]??[]).length?K`<div class="status">
        <span class="status-muted">${Be(this.hass,"timetable.done_for_today")}</span>
      </div>`:Z}_renderCell(e,t,i,a,s,r){const n=Me(t,i,a);if(!n)return K`<div class="cell free ${s?"now":""}"></div>`;const o=!1!==this._config.show_rooms&&n.room;return K`
      <div
        class="cell ${s?"now":""}"
        style=${`--subject:${this._color(e,n.subject)}`}
        title=${n.room?`${n.subject} · ${n.room}`:n.subject}
      >
        <span class="subject">${n.subject}</span>
        ${o?K`<span class="room">${n.room}</span>`:Z}
        ${s&&null!==r?K`<div class="progress"><div style=${`width:${Math.round(100*r)}%`}></div></div>`:Z}
      </div>
    `}render(){if(!this.hass)return K`<ha-card></ha-card>`;const e=je(this.hass,this._config.board_entity);if(!e)return K`<ha-card><div class="notice">${Be(this.hass,"board.missing")}</div></ha-card>`;const t=e.timetable;if(!t)return K`<ha-card
        ><div class="notice">${Be(this.hass,"timetable.no_periods")}</div></ha-card
      >`;const i=this._candidates(e.members);if(!i.length)return K`<ha-card
        ><div class="notice">${Be(this.hass,"timetable.none_configured")}</div></ha-card
      >`;const a=i.find(e=>e.member.id===this._memberId)??i[0],{member:s,week:r}=a,n=this._weekdays(r),o=function(e=new Date){return(e.getDay()+6)%7}(),d=!1!==this._config.highlight,l=this._config.layout??"auto",h="day"===l||"auto"===l&&this._narrow,c=void 0!==this._day&&n.includes(this._day)?this._day:n.includes(o)?o:n[0],p=h?[c]:n,u=function(e,t){const i=e.periods.filter(t),a=new Set(i.map(e=>e.index)),s=[];for(const t of i){s.push({kind:"period",period:t});const i=e.breaks.find(e=>e.after===t.index&&a.has(t.index+1));i&&s.push({kind:"break",gap:i})}return s}(t,e=>!1===this._config.hide_empty_periods||p.some(t=>void 0!==Me(r,t,e.index))),m=d?Ne(t):void 0,g=!1!==this._config.show_times,f=!1!==this._config.show_breaks;return K`
      <ha-card style=${`--member-color:${s.color}`}>
        <div class="head">
          <div class="title">
            <span class="dot"></span>
            <span>${s.name}</span>
          </div>
          ${this._renderChips(i,s)}
        </div>
        ${d&&n.includes(o)?this._renderStatus(t,r,o):Z}
        ${h?K`
              <div class="days">
                ${n.map(e=>K`
                    <button
                      class="chip day ${e===o&&d?"is-today":""}"
                      aria-pressed=${e===c}
                      @click=${()=>{this._day=e}}
                    >
                      ${this._weekdayName(e,"short")}
                    </button>
                  `)}
              </div>
            `:Z}

        <div
          class="grid"
          style=${`grid-template-columns:${g?"max-content":"min-content"} repeat(${p.length}, minmax(0, 1fr))`}
        >
          <div class="corner"></div>
          ${p.map(e=>K`
              <div class="col-head ${d&&e===o?"today":""}">
                ${this._weekdayName(e,h?"long":"short")}
              </div>
            `)}
          ${u.map(e=>{if("break"===e.kind)return f?K`
                    <div class="break">
                      <span class="line"></span>
                      <span
                        >${Be(this.hass,"timetable.break")} ·
                        ${Le(this.hass,e.gap.start)}–${Le(this.hass,e.gap.end)}</span
                      >
                      <span class="line"></span>
                    </div>
                  `:Z;const{period:i}=e,a=d?function(e,t=Ee()){if(t<e.startMinutes||t>=e.endMinutes)return null;const i=e.endMinutes-e.startMinutes;return i>0?(t-e.startMinutes)/i:0}(i):null;return K`
              <div class="time">
                <span class="no">${i.index}</span>
                ${g?K`<span class="span"
                      >${Le(this.hass,i.start)}<br />${Le(this.hass,i.end)}</span
                    >`:Z}
              </div>
              ${p.map(e=>this._renderCell(t,r,e,i.index,d&&e===o&&m?.index===i.index,a))}
            `})}
        </div>
      </ha-card>
    `}};function Dt(e,t){const i=e.states[t];return i?.attributes?.friendly_name||t}function zt(e,t){return e.states[t]?.attributes?.icon||null}Lt.styles=[at,st,d`
      /* The card measures itself to decide between the week and a single day, and an
         inline host has no width worth measuring. */
      :host {
        display: block;
      }

      ha-card {
        padding: 12px;
        box-sizing: border-box;
      }

      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: var(--hearth-gap);
        margin-bottom: 8px;
      }

      .title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.15rem;
        font-weight: 700;
      }

      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--member-color);
      }

      .chips,
      .days {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .days {
        margin-bottom: 8px;
      }

      .chip {
        min-height: 36px;
        padding: 0 14px;
        border: 1px solid var(--hearth-line);
        border-radius: 18px;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--hearth-muted);
      }

      .chip[aria-pressed='true'] {
        border-color: var(--member-color);
        background: color-mix(in srgb, var(--member-color) 18%, transparent);
        color: var(--primary-text-color);
      }

      .chip.day.is-today {
        text-decoration: underline;
        text-underline-offset: 3px;
      }

      .status {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 10px;
        font-size: 0.95rem;
      }

      .pill {
        padding: 3px 10px;
        border-radius: 12px;
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        background: color-mix(in srgb, var(--subject) 22%, transparent);
        color: var(--primary-text-color);
      }

      .pill.next {
        background: var(--hearth-surface-alt);
        color: var(--hearth-muted);
      }

      .status-text {
        font-weight: 600;
      }

      .status-muted {
        color: var(--hearth-muted);
        font-size: 0.85rem;
      }

      .grid {
        display: grid;
        gap: 4px;
        align-items: stretch;
      }

      .col-head {
        padding: 2px 0 4px;
        text-align: center;
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--hearth-muted);
      }

      .col-head.today {
        color: var(--text-primary-color, #fff);
        background: var(--hearth-today);
        border-radius: 8px;
      }

      .time {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-right: 8px;
        text-align: right;
        font-size: 0.68rem;
        line-height: 1.25;
        color: var(--hearth-muted);
        white-space: nowrap;
      }

      .time .no {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--primary-text-color);
      }

      .cell {
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: var(--hearth-touch);
        padding: 4px 8px;
        box-sizing: border-box;
        overflow: hidden;
        border-radius: 10px;
        border-left: 3px solid var(--subject);
        background: color-mix(in srgb, var(--subject) 18%, transparent);
      }

      .cell .subject {
        font-size: 0.95rem;
        font-weight: 600;
        line-height: 1.15;
        overflow-wrap: anywhere;
      }

      .cell .room {
        margin-top: 2px;
        font-size: 0.72rem;
        color: var(--hearth-muted);
      }

      /* A free period is drawn, not left out: the grid has to keep its shape, and an
         empty slot with nothing in it reads as a rendering fault. */
      .cell.free {
        background: transparent;
        border: 1px dashed var(--hearth-line);
        opacity: 0.6;
      }

      .cell.now {
        box-shadow: inset 0 0 0 2px var(--hearth-today);
      }

      .progress {
        height: 3px;
        margin-top: 4px;
        border-radius: 2px;
        background: var(--hearth-line);
        overflow: hidden;
      }

      .progress > div {
        height: 100%;
        background: var(--hearth-today);
      }

      .break {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 1px 0;
        font-size: 0.7rem;
        color: var(--hearth-muted);
      }

      .break .line {
        flex: 1;
        height: 1px;
        background: var(--hearth-line);
      }

      .notice {
        padding: 8px 2px;
        color: var(--hearth-muted);
        font-size: 0.9rem;
      }
    `],i([me({attribute:!1})],Lt.prototype,"hass",void 0),i([ge()],Lt.prototype,"_config",void 0),i([ge()],Lt.prototype,"_memberId",void 0),i([ge()],Lt.prototype,"_day",void 0),i([ge()],Lt.prototype,"_narrow",void 0),i([ge()],Lt.prototype,"_tick",void 0),Lt=i([ce("hearth-timetable-card")],Lt),window.customCards=window.customCards||[],window.customCards.push({type:"hearth-timetable-card",name:"Hearth Timetable",description:"The school timetable per child, colour-coded by subject, with the running lesson marked.",preview:!0,documentationURL:"https://github.com/DomCim/Homeassistant-hearth"});const Mt="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z",Nt="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z",It="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",jt="M13,14H11V9H13M13,18H11V16H13M1,21H23L12,2L1,21Z";let Ot=class extends le{constructor(){super(...arguments),this._config={type:""},this._lists=[],this._expanded=new Set,this._draft="",this._pending=new Set,this._loadedSignature="",this._reloadToken=0}static async getConfigElement(){return document.createElement("hearth-lists-card-editor")}static getStubConfig(){return{columns:3,max_items:8}}setConfig(e){this._config={...e}}getCardSize(){return 6}getGridOptions(){return{columns:"full",rows:"auto"}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._reload(),3e5)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&(window.clearInterval(this._timer),this._timer=void 0)}updated(e){super.updated(e),this._maybeFetch()}get _entityIds(){if(this._config.entities?.length)return this._config.entities;const e=this.hass?je(this.hass,this._config.board_entity):null;return e?.sharedTodoLists??[]}_reload(){this._reloadToken+=1,this._maybeFetch()}async _maybeFetch(){const e=this.hass;if(!e)return;const t=this._entityIds,i=t.map(t=>`${e.states[t]?.state??"-"}`),a=[t.join(","),i.join(","),this._reloadToken].join("|");if(a===this._loadedSignature)return;if(this._loadedSignature=a,0===t.length)return void(this._lists=[]);const s=await async function(e,t,i=!1){const a=i?["needs_action","completed"]:["needs_action"];return Promise.all(t.map(async t=>{const i={entityId:t,name:Dt(e,t),icon:zt(e,t)};try{const s=await e.callService("todo","get_items",{status:a},{entity_id:t},!1,!0);return{...i,items:s?.response?.[t]?.items??[],ok:!0}}catch(e){return console.warn(`[hearth] could not read ${t}`,e),{...i,items:[],ok:!1}}}))}(e,t);this._loadedSignature===a&&(this._lists=s,this._pending=new Set)}async _toggle(e,t){const i=`${e.entityId}|${t.uid||t.summary}`;this._pending=new Set(this._pending).add(i);try{await async function(e,t,i,a){await e.callService("todo","update_item",{item:i.uid||i.summary,status:a?"completed":"needs_action"},{entity_id:t})}(this.hass,e.entityId,t,"completed"!==t.status)}catch(e){console.warn("[hearth] could not update item",e);const t=new Set(this._pending);return t.delete(i),void(this._pending=t)}this._reload()}async _submitDraft(e){const t=this._draft.trim();if(t){this._draft="";try{await async function(e,t,i){await e.callService("todo","add_item",{item:i},{entity_id:t})}(this.hass,e.entityId,t)}catch(e){console.warn("[hearth] could not add item",e)}this._reload()}}_icon(e){return K`<svg viewBox="0 0 24 24"><path d=${e} /></svg>`}_renderItem(e,t){const i=`${e.entityId}|${t.uid||t.summary}`,a=this._pending.has(i),s=a?"completed"!==t.status:"completed"===t.status;return K`
      <button
        class="item ${s?"done":""} ${a?"pending":""}"
        @click=${()=>this._toggle(e,t)}
      >
        ${this._icon(s?Nt:Mt)}
        <span class="item-text">${t.summary}</span>
      </button>
    `}_renderList(e){const t=this._config.max_items??8,i=this._expanded.has(e.entityId)?e.items:e.items.slice(0,t),a=e.items.length-i.length;return K`
      <section class="list">
        <header class="list-header">
          <span class="list-name">${e.name}</span>
          <span class="count">${e.items.length}</span>
        </header>

        ${e.ok?Z:K`<div class="warning">
              ${this._icon(jt)}<span>${Be(this.hass,"lists.unreachable")}</span>
            </div>`}

        <div class="items">
          ${0===i.length&&e.ok?K`<div class="empty">${Be(this.hass,"lists.empty")}</div>`:i.map(t=>this._renderItem(e,t))}
        </div>

        ${a>0?K`<button
              class="more"
              @click=${()=>{this._expanded=new Set(this._expanded).add(e.entityId)}}
            >
              ${Be(this.hass,"lists.show_more",{count:a})}
            </button>`:Z}
        ${!1===this._config.allow_add?Z:this._adding===e.entityId?K`
                <form
                  class="add-row"
                  @submit=${t=>{t.preventDefault(),this._submitDraft(e)}}
                >
                  <input
                    type="text"
                    autofocus
                    placeholder=${Be(this.hass,"lists.add_placeholder")}
                    .value=${this._draft}
                    @input=${e=>{this._draft=e.target.value}}
                    @blur=${()=>{this._adding=void 0}}
                  />
                </form>
              `:K`<button
                class="add"
                @click=${()=>{this._draft="",this._adding=e.entityId}}
              >
                ${this._icon(It)}<span>${Be(this.hass,"lists.add")}</span>
              </button>`}
      </section>
    `}render(){return this.hass?0===this._entityIds.length?K`
        <ha-card>
          <div class="notice">${Be(this.hass,"lists.none_configured")}</div>
        </ha-card>
      `:K`
      <ha-card>
        <div class="grid" style=${`--columns:${this._config.columns??3}`}>
          ${this._lists.map(e=>this._renderList(e))}
        </div>
      </ha-card>
    `:K`<ha-card></ha-card>`}};Ot.styles=[at,st,d`
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
    `],i([me({attribute:!1})],Ot.prototype,"hass",void 0),i([ge()],Ot.prototype,"_config",void 0),i([ge()],Ot.prototype,"_lists",void 0),i([ge()],Ot.prototype,"_expanded",void 0),i([ge()],Ot.prototype,"_adding",void 0),i([ge()],Ot.prototype,"_draft",void 0),i([ge()],Ot.prototype,"_pending",void 0),Ot=i([ce("hearth-lists-card")],Ot),window.customCards=window.customCards||[],window.customCards.push({type:"hearth-lists-card",name:"Hearth Lists",description:"Shopping lists and checklists as tiles, ticked off with one tap.",preview:!0,documentationURL:"https://github.com/DomCim/Homeassistant-hearth"}),console.info(`%c HEARTH %c ${e} `,"color:#fff;background:#e0603a;font-weight:700;border-radius:3px 0 0 3px;padding:2px 6px","color:#e0603a;background:#2b2118;font-weight:700;border-radius:0 3px 3px 0;padding:2px 6px");export{e as HEARTH_VERSION};
