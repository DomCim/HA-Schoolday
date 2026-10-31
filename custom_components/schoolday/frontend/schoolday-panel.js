const e="0.18.0",t=["#e0603a","#3a86c8","#4f9d69","#c9a227","#8e6bbf","#d1707f"];function s(e,t,s,i){var a,n=arguments.length,o=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,s,i);else for(var r=e.length-1;r>=0;r--)(a=e[r])&&(o=(n<3?a(o):n>3?a(t,s,o):a(t,s))||o);return n>3&&o&&Object.defineProperty(t,s,o),o}"function"==typeof SuppressedError&&SuppressedError;const i=globalThis,a=i.ShadowRoot&&(void 0===i.ShadyCSS||i.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),o=new WeakMap;let r=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(a&&void 0===e){const s=void 0!==t&&1===t.length;s&&(e=o.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(t,e))}return e}toString(){return this.cssText}};const d=(e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,s,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1],e[0]);return new r(s,e,n)},l=a?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,n))(t)})(e):e,{is:c,defineProperty:h,getOwnPropertyDescriptor:m,getOwnPropertyNames:u,getOwnPropertySymbols:p,getPrototypeOf:b}=Object,g=globalThis,_=g.trustedTypes,y=_?_.emptyScript:"",f=g.reactiveElementPolyfillSupport,v=(e,t)=>e,w={toAttribute(e,t){switch(t){case Boolean:e=e?y:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},$=(e,t)=>!c(e,t),x={attribute:!0,type:String,converter:w,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let k=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=x){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);void 0!==i&&h(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:a}=m(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const n=i?.call(this);a?.call(this,t),this.requestUpdate(e,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??x}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=b(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...u(e),...p(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(l(e))}else void 0!==e&&t.push(l(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{if(a)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const s of t){const t=document.createElement("style"),a=i.litNonce;void 0!==a&&t.setAttribute("nonce",a),t.textContent=s.cssText,e.appendChild(t)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(void 0!==i&&!0===s.reflect){const a=(void 0!==s.converter?.toAttribute?s.converter:w).toAttribute(t,s.type);this._$Em=e,null==a?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(e,t){const s=this.constructor,i=s._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=s.getPropertyOptions(i),a="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:w;this._$Em=i;const n=a.fromAttribute(t,e.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(e,t,s,i=!1,a){if(void 0!==e){const n=this.constructor;if(!1===i&&(a=this[e]),s??=n.getPropertyOptions(e),!((s.hasChanged??$)(a,t)||s.useDefault&&s.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:a},n){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==a||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,s,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[v("elementProperties")]=new Map,k[v("finalized")]=new Map,f?.({ReactiveElement:k}),(g.reactiveElementVersions??=[]).push("2.1.2");const S=globalThis,A=e=>e,C=S.trustedTypes,j=C?C.createPolicy("lit-html",{createHTML:e=>e}):void 0,E="$lit$",z=`lit$${Math.random().toFixed(9).slice(2)}$`,D="?"+z,L=`<${D}>`,T=document,N=()=>T.createComment(""),O=e=>null===e||"object"!=typeof e&&"function"!=typeof e,M=Array.isArray,U="[ \t\n\f\r]",W=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,R=/>/g,F=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),P=/'/g,B=/"/g,I=/^(?:script|style|textarea|title)$/i,K=(e=>(t,...s)=>({_$litType$:e,strings:t,values:s}))(1),q=Symbol.for("lit-noChange"),Z=Symbol.for("lit-nothing"),V=new WeakMap,G=T.createTreeWalker(T,129);function J(e,t){if(!M(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==j?j.createHTML(t):t}const Y=(e,t)=>{const s=e.length-1,i=[];let a,n=2===t?"<svg>":3===t?"<math>":"",o=W;for(let t=0;t<s;t++){const s=e[t];let r,d,l=-1,c=0;for(;c<s.length&&(o.lastIndex=c,d=o.exec(s),null!==d);)c=o.lastIndex,o===W?"!--"===d[1]?o=H:void 0!==d[1]?o=R:void 0!==d[2]?(I.test(d[2])&&(a=RegExp("</"+d[2],"g")),o=F):void 0!==d[3]&&(o=F):o===F?">"===d[0]?(o=a??W,l=-1):void 0===d[1]?l=-2:(l=o.lastIndex-d[2].length,r=d[1],o=void 0===d[3]?F:'"'===d[3]?B:P):o===B||o===P?o=F:o===H||o===R?o=W:(o=F,a=void 0);const h=o===F&&e[t+1].startsWith("/>")?" ":"";n+=o===W?s+L:l>=0?(i.push(r),s.slice(0,l)+E+s.slice(l)+z+h):s+z+(-2===l?t:h)}return[J(e,n+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class Q{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let a=0,n=0;const o=e.length-1,r=this.parts,[d,l]=Y(e,t);if(this.el=Q.createElement(d,s),G.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=G.nextNode())&&r.length<o;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(E)){const t=l[n++],s=i.getAttribute(e).split(z),o=/([.?@])?(.*)/.exec(t);r.push({type:1,index:a,name:o[2],strings:s,ctor:"."===o[1]?ie:"?"===o[1]?ae:"@"===o[1]?ne:se}),i.removeAttribute(e)}else e.startsWith(z)&&(r.push({type:6,index:a}),i.removeAttribute(e));if(I.test(i.tagName)){const e=i.textContent.split(z),t=e.length-1;if(t>0){i.textContent=C?C.emptyScript:"";for(let s=0;s<t;s++)i.append(e[s],N()),G.nextNode(),r.push({type:2,index:++a});i.append(e[t],N())}}}else if(8===i.nodeType)if(i.data===D)r.push({type:2,index:a});else{let e=-1;for(;-1!==(e=i.data.indexOf(z,e+1));)r.push({type:7,index:a}),e+=z.length-1}a++}}static createElement(e,t){const s=T.createElement("template");return s.innerHTML=e,s}}function X(e,t,s=e,i){if(t===q)return t;let a=void 0!==i?s._$Co?.[i]:s._$Cl;const n=O(t)?void 0:t._$litDirective$;return a?.constructor!==n&&(a?._$AO?.(!1),void 0===n?a=void 0:(a=new n(e),a._$AT(e,s,i)),void 0!==i?(s._$Co??=[])[i]=a:s._$Cl=a),void 0!==a&&(t=X(e,a._$AS(e,t.values),a,i)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??T).importNode(t,!0);G.currentNode=i;let a=G.nextNode(),n=0,o=0,r=s[0];for(;void 0!==r;){if(n===r.index){let t;2===r.type?t=new te(a,a.nextSibling,this,e):1===r.type?t=new r.ctor(a,r.name,r.strings,this,e):6===r.type&&(t=new oe(a,this,e)),this._$AV.push(t),r=s[++o]}n!==r?.index&&(a=G.nextNode(),n++)}return G.currentNode=T,i}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=Z,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),O(e)?e===Z||null==e||""===e?(this._$AH!==Z&&this._$AR(),this._$AH=Z):e!==this._$AH&&e!==q&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>M(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==Z&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,i="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=Q.createElement(J(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new ee(i,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=V.get(e.strings);return void 0===t&&V.set(e.strings,t=new Q(e)),t}k(e){M(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const a of e)i===t.length?t.push(s=new te(this.O(N()),this.O(N()),this,this.options)):s=t[i],s._$AI(a),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class se{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,a){this.type=1,this._$AH=Z,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=a,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=Z}_$AI(e,t=this,s,i){const a=this.strings;let n=!1;if(void 0===a)e=X(this,e,t,0),n=!O(e)||e!==this._$AH&&e!==q,n&&(this._$AH=e);else{const i=e;let o,r;for(e=a[0],o=0;o<a.length-1;o++)r=X(this,i[s+o],t,o),r===q&&(r=this._$AH[o]),n||=!O(r)||r!==this._$AH[o],r===Z?e=Z:e!==Z&&(e+=(r??"")+a[o+1]),this._$AH[o]=r}n&&!i&&this.j(e)}j(e){e===Z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ie extends se{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===Z?void 0:e}}class ae extends se{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==Z)}}class ne extends se{constructor(e,t,s,i,a){super(e,t,s,i,a),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??Z)===q)return;const s=this._$AH,i=e===Z&&s!==Z||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==Z&&(s===Z||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class oe{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const re=S.litHtmlPolyfillSupport;re?.(Q,te),(S.litHtmlVersions??=[]).push("3.3.3");const de=globalThis;class le extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const i=s?.renderBefore??t;let a=i._$litPart$;if(void 0===a){const e=s?.renderBefore??null;i._$litPart$=a=new te(t.insertBefore(N(),e),e,void 0,s??{})}return a._$AI(e),a})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}le._$litElement$=!0,le.finalized=!0,de.litElementHydrateSupport?.({LitElement:le});const ce=de.litElementPolyfillSupport;ce?.({LitElement:le}),(de.litElementVersions??=[]).push("4.2.2");const he=e=>(t,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},me={attribute:!0,type:String,converter:w,reflect:!1,hasChanged:$},ue=(e=me,t,s)=>{const{kind:i,metadata:a}=s;let n=globalThis.litPropertyMetadata.get(a);if(void 0===n&&globalThis.litPropertyMetadata.set(a,n=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),n.set(s.name,e),"accessor"===i){const{name:i}=s;return{set(s){const a=t.get.call(this);t.set.call(this,s),this.requestUpdate(i,a,e,!0,s)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=s;return function(s){const a=this[i];t.call(this,s),this.requestUpdate(i,a,e,!0,s)}}throw Error("Unsupported decorator location: "+i)};function pe(e){return(t,s)=>"object"==typeof s?ue(e,t,s):((e,t,s)=>{const i=t.hasOwnProperty(s);return t.constructor.createProperty(s,e),i?Object.getOwnPropertyDescriptor(t,s):void 0})(e,t,s)}function be(e){return pe({...e,state:!0,attribute:!1})}function ge(e){switch(e.locale?.time_format){case"12":return!0;case"24":return!1;default:return}}function _e(e){return e.locale?.language||e.language||"en"}const ye=["care","free","sick","event"];function fe(e){const[t,s]=e.split(":").map(Number);return 60*(t||0)+(s||0)}function ve(e=new Date){return 60*e.getHours()+e.getMinutes()}function we(e,t){if(!e)return t;if(!0!==ge(e))return t;const s=new Date;return s.setHours(Math.floor(fe(t)/60),fe(t)%60,0,0),new Intl.DateTimeFormat(_e(e),{hour:"numeric",minute:"2-digit",hour12:!0}).format(s)}function $e(e){if(!e||"object"!=typeof e)return null;const t=e,s=xe(t.periods);if(!s.length)return null;const i=ke(t.breaks),a={};for(const[e,s]of Object.entries(t.schedules??{})){const t=xe(s?.periods);t.length&&(a[e]={periods:t,breaks:ke(s?.breaks)})}const n={};for(const[e,s]of Object.entries(t.subjects??{}))"string"==typeof s&&(n[e]=s);return{periods:s,breaks:i,subjects:n,cycleWeeks:2===Number(t.cycle_weeks??1)?2:1,schedules:a}}function xe(e){return(Array.isArray(e)?e:[]).map(e=>e).filter(e=>"string"==typeof e?.start&&"string"==typeof e?.end).map((e,t)=>({index:Number(e.index??t+1),start:String(e.start),end:String(e.end),startMinutes:fe(String(e.start)),endMinutes:fe(String(e.end))}))}function ke(e){return(Array.isArray(e)?e:[]).map(e=>e).filter(e=>"string"==typeof e?.start&&"string"==typeof e?.end).map(e=>({after:Number(e.after??0),start:String(e.start),end:String(e.end),minutes:Number(e.minutes??0)}))}function Se(e,t){const s=t?e.schedules[t]:void 0;return s?{...e,periods:s.periods,breaks:s.breaks}:e}function Ae(e){return function(e){const t={};if(!e||"object"!=typeof e)return t;for(const[s,i]of Object.entries(e)){const e=Number(s);if(!Number.isInteger(e)||e<0||e>=14||!Array.isArray(i))continue;const a=i.map(e=>e).filter(e=>Boolean(e)&&"string"==typeof e.subject).map(e=>({period:Number(e.period??0),subject:String(e.subject),room:"string"==typeof e.room&&e.room?e.room:null})).sort((e,t)=>e.period-t.period);a.length&&(t[e]=a)}return t}(e?.attributes?.timetable)}function Ce(e){return Array.isArray(e)?e.map(e=>e).filter(e=>Boolean(e)&&"string"==typeof e.title&&e.title).map(e=>({date:"string"==typeof e.date?e.date:"",title:String(e.title),start:"string"==typeof e.start&&e.start?e.start:null,period:"number"==typeof e.period?e.period:null})):[]}function je(e){const t={};for(const[s,i]of Object.entries(e)){if(!i||"object"!=typeof i){t[s]=null;continue}const e=i;"string"==typeof e.subject&&e.subject?t[s]={period:Number(e.period??s),subject:e.subject,room:"string"==typeof e.room&&e.room?e.room:null}:t[s]=null}return t}function Ee(e,t,s){const i=function(e){return Object.entries(e).some(([e,t])=>Number(e)>=7&&t.length>0)}(e)?s?.week??0:0,a=e[t+7*i]??[],n=s?.changes;if(!n)return a.map(e=>({lesson:e,changed:!1}));const o=new Map(a.map(e=>[e.period,{lesson:e,changed:!1}]));for(const[e,t]of Object.entries(n)){const s=Number(e);t?o.set(s,{lesson:{...t,period:s},changed:!0}):o.delete(s)}return[...o.entries()].sort((e,t)=>e[0]-t[0]).map(([,e])=>e)}function ze(e){return t=e?.attributes?.outlook,Array.isArray(t)?t.map(e=>e).filter(e=>Boolean(e)&&"string"==typeof e.date).map(e=>({date:String(e.date),weekday:Number(e.weekday??0),mode:ye.includes(e.mode)?e.mode:"school",label:"string"==typeof e.label&&e.label?e.label:null,week:1===Number(e.week??0)?1:0,...e.changes&&"object"==typeof e.changes?{changes:je(e.changes)}:{},...Array.isArray(e.exams)&&e.exams.length?{exams:Ce(e.exams)}:{}})).sort((e,t)=>e.date.localeCompare(t.date)):[];var t}function De(e=new Date){const t=String(e.getMonth()+1).padStart(2,"0"),s=String(e.getDate()).padStart(2,"0");return`${e.getFullYear()}-${t}-${s}`}function Le(e,t,s){return(e[t]??[]).find(e=>e.period===s)}function Te(e,t=ve()){return e.periods.find(e=>t>=e.startMinutes&&t<e.endMinutes)}function Ne(e){return!0===e.attributes?.schoolday_board}function Oe(e,s){let i;if(s){if(i=e.states[s],!i)return null}else if(i=Object.values(e.states).find(Ne),!i)return null;const a=i.attributes,n=(Array.isArray(a.members)?a.members:[]).map((e,s)=>{const i=e;return{id:String(i.id??s),name:String(i.name??""),color:i.color||t[s%t.length],avatar:i.avatar??null,order:i.order??s}});return n.sort((e,t)=>e.order-t.order||e.name.localeCompare(t.name)),{entityId:i.entity_id,members:n,timetable:$e(a.timetable),schoolToday:!1!==a.school_today,noSchoolReason:"string"==typeof a.no_school_reason?a.no_school_reason:null}}function Me(e,t){if(!t)return null;if(!t.includes(".")||t.includes("/")||t.includes(":"))return t;const s=e.states[t];if(!s)return t;const i=s.attributes?.entity_picture;return"string"==typeof i&&i?i:null}function Ue(e,t){return Object.values(e.states).find(e=>e.attributes?.member_id===t&&e.entity_id.startsWith("sensor.")&&"timestamp"!==e.attributes?.device_class)}const We={"board.missing":"No Schoolday board found. Add the Schoolday integration.","routines.nothing_today":"Nothing today","routines.auto":"Automatic (by time of day)","routines.morning":"Morning","routines.evening":"Evening","routines.both":"Both","routines.none_configured":"No routines for today. Add them under Configure → Edit routines in the Schoolday integration.","routines.sick":"At home ill","routines.packed_for":"for {subject}","timetable.sick":"Ill","timetable.event":"No normal lessons","timetable.changed":"Changed","timetable.exam":"Exam","routines.exam_tomorrow":"Exam tomorrow","stats.percent":"{value}%","stats.window":"over {days} days","stats.window_one":"over one day","stats.streak":"{days} days in a row","stats.best":"best {days}","stats.day_done":"{done} of {asked} done","stats.nothing_asked":"Nothing on","stats.nothing_yet":"Nothing on the record yet. It starts with the first school day.","stats.none_configured":"No routines to keep a record of. Add them under Configure → Edit routines in the Schoolday integration.","stats.sort_board":"The usual family order","stats.sort_rate":"Best record first","homework.nothing":"Nothing to do","homework.all_done":"No homework outstanding.","homework.overdue":"Overdue","homework.today":"Due today","homework.tomorrow":"Due tomorrow","homework.later":"Later","homework.someday":"No date","timetable.no_periods":"No lesson times yet. Add them under Configure → School timetable in the Schoolday integration.","timetable.none_configured":"Nobody has a timetable yet. Add one under Configure → School timetable in the Schoolday integration.","timetable.break":"Break","timetable.no_school":"No school","timetable.free":"Holiday","timetable.care":"Holiday care","timetable.now":"Now","timetable.next":"Next","timetable.remaining":"{minutes} min left","timetable.done_for_today":"School is out for today.","timetable.layout_auto":"Automatic (week, one day when narrow)","timetable.layout_week":"Whole week","timetable.layout_day":"One day","timetable.days_auto":"Automatic (as the timetable needs)","timetable.days_school":"Monday to Friday","timetable.days_week":"All seven days","editor.block":"Which block to show","editor.evening_from":"Evening starts at (hour)","editor.show_empty":"Show members with nothing on today","editor.show_done":"Show what is already done","editor.members":"Limit to these members","editor.member":"Family member","editor.layout":"Layout","editor.week_days":"Days shown","editor.show_rooms":"Show rooms","editor.show_times":"Show lesson times","editor.show_breaks":"Show breaks","editor.hide_empty_periods":"Hide periods nobody has","editor.highlight":"Mark today and the running lesson","editor.roll_days":"Roll past weekdays on to next week","editor.section":"Section to open on","editor.days":"Days shown","editor.show_steps":"Show the tally per step","editor.sort":"Order","admin.tab_timetable":"Timetable","admin.tab_routines":"Routines","admin.tab_family":"Family","admin.tab_subjects":"Subjects","admin.tab_holidays":"Days off","admin.tab_materials":"Material","admin.tab_exceptions":"Exceptions","admin.cycle_one":"One week","admin.cycle_two":"Two weeks (A/B)","admin.cycle_start":"Week A starts in calendar week","admin.cycle_now":"This week is week {week}.","admin.week_a":"Week A","admin.week_b":"Week B","admin.exceptions_hint":"What one date does differently. A label takes the whole day over; tap a period to cancel it or say what runs instead. Dates in the past are dropped by themselves.","admin.exception_date":"Date","admin.exception_label":"What the day is","admin.exception_label_hint":"School trip, sports day — leave empty for a normal day","admin.exception_cancel":"Cancelled","admin.exception_reset":"Back to the timetable","admin.exception_none":"Nothing is different on this date.","admin.exception_add":"Add a date","admin.materials_hint":"What each subject needs brought along. These show up in the evening routine on the day before, for whoever has that subject.","admin.materials_items":"One thing per line","admin.save":"Save","admin.add":"Add","admin.clear":"Clear","admin.remove":"Remove","admin.remove_confirm":"Remove {name}? Their timetable and routines go too.","admin.add_member":"Add a family member","admin.periods":"Lesson times, one per line","admin.schedule":"School","admin.schedule_default":"The usual times","admin.travel":"Way to school (min)","admin.travel_hint":"Gives a leaving time that moves when the first lesson is cancelled. Empty for none.","admin.leave_time":"Leaves on school days at","admin.care_leave_time":"Leaves in holiday care at","admin.leave_time_hint":"For a bus or a lift, which comes at its time whatever is cancelled. Wins over the way to school.","header.leave_in":"leave in {minutes} min","header.leave_now":"time to go","header.leave_at":"leave at {time}","admin.schedule_name":"Name of the school","admin.schedule_hint":"Grammar school, primary school…","admin.schedule_add":"Another school with different times","admin.schedule_remove":"Remove {name}? Its lesson times go with it.","admin.schedule_remove_one":"Remove {name}? {members} goes back to the usual lesson times.","admin.schedule_remove_members":"Remove {name}? {members} go back to the usual lesson times.","admin.periods_first":"Set the lesson times first — the week hangs on them.","admin.no_members":"Nobody is set up yet. Add a family member first.","admin.no_subjects":"No subjects yet. They appear once a timetable has lessons in it.","admin.subject":"Subject","admin.room":"Room","admin.name":"Name","admin.color":"Colour","admin.calendar":"Own calendar","admin.lessons_calendar":"Lessons calendar from school","admin.exams_calendar":"Exams calendar from school","admin.homework_list":"Homework list from school","admin.school_system":"School system (WebUntis, Schulmanager or similar), optional","admin.school_system_hint":"Calendars and lists a school system such as WebUntis or Schulmanager Online already keeps for this child: changes to the timetable, exams and new homework come from them. With WebUntis, switch on “Calendar - cancelled lessons” in its options.","admin.avatar":"Picture","admin.block_morning":"Morning","admin.block_evening":"Evening","admin.day_free":"Day off","admin.day_care":"Holiday care","admin.steps_hint":"One step per line","admin.school_calendars":"Calendars that close the school, one per line","admin.care_keywords":"Holiday-care keywords, one per line","admin.care_hint":"Holiday care","admin.cancel_keywords":"Words that mean a lesson is cancelled, one per line","admin.cancel_hint":"Cancelled","admin.substitute_keywords":"Words that mean somebody else is taking a lesson, one per line","admin.substitute_hint":"Irregular","admin.school_words":"Words from the school system","admin.school_words_hint":"Already set for WebUntis. Only change them if your school system writes something else.","admin.avatar_hint":"For a picture, put in a person entity — the one Home Assistant already has. A URL works too.","admin.colors_hint":"Every subject already has a colour taken from its name. This is only for correcting one.","admin.calendars_hint":"Any event running on these calendars means there is no school, so use calendars that hold nothing else.","editor.weather_entity":"Weather entity","editor.greeting":"Greeting","editor.show_seconds":"Show seconds","editor.show_leave":"Show when to leave for school"},He={en:We,de:{"board.missing":"Kein Schoolday-Board gefunden. Füge die Schoolday-Integration hinzu.","routines.nothing_today":"Heute nichts","routines.auto":"Automatisch (nach Tageszeit)","routines.morning":"Morgen","routines.evening":"Abend","routines.both":"Beide","routines.none_configured":"Für heute sind keine Routinen hinterlegt. Trage sie in der Schoolday-Integration unter „Konfigurieren → Routinen bearbeiten“ ein.","routines.sick":"Krank zu Hause","routines.packed_for":"für {subject}","timetable.sick":"Krank","timetable.event":"Kein regulärer Unterricht","timetable.changed":"Geändert","timetable.exam":"Arbeit","routines.exam_tomorrow":"Morgen Arbeit","stats.percent":"{value} %","stats.window":"über {days} Tage","stats.window_one":"über einen Tag","stats.streak":"{days} Tage in Folge","stats.best":"beste {days}","stats.day_done":"{done} von {asked} erledigt","stats.nothing_asked":"Nichts zu tun","stats.nothing_yet":"Noch nichts aufgezeichnet. Es beginnt mit dem ersten Schultag.","stats.none_configured":"Es gibt keine Routinen, über die sich etwas sagen ließe. Trage sie in der Schoolday-Integration unter „Konfigurieren → Routinen bearbeiten“ ein.","stats.sort_board":"Die übliche Reihenfolge der Familie","stats.sort_rate":"Beste Bilanz zuerst","homework.nothing":"Nichts zu tun","homework.all_done":"Keine offenen Hausaufgaben.","homework.overdue":"Überfällig","homework.today":"Heute fällig","homework.tomorrow":"Morgen fällig","homework.later":"Später","homework.someday":"Ohne Datum","timetable.no_periods":"Noch keine Stundenzeiten. Trage sie in der Schoolday-Integration unter „Konfigurieren → Stundenplan“ ein.","timetable.none_configured":"Noch hat niemand einen Stundenplan. Lege ihn in der Schoolday-Integration unter „Konfigurieren → Stundenplan“ an.","timetable.break":"Pause","timetable.no_school":"Schulfrei","timetable.free":"Ferien","timetable.care":"Ferienbetreuung","timetable.now":"Jetzt","timetable.next":"Danach","timetable.remaining":"noch {minutes} min","timetable.done_for_today":"Für heute ist Schule aus.","timetable.layout_auto":"Automatisch (Woche, schmal ein Tag)","timetable.layout_week":"Ganze Woche","timetable.layout_day":"Ein Tag","timetable.days_auto":"Automatisch (wie der Stundenplan es braucht)","timetable.days_school":"Montag bis Freitag","timetable.days_week":"Alle sieben Tage","editor.block":"Welcher Block angezeigt wird","editor.evening_from":"Abend beginnt um (Stunde)","editor.show_empty":"Mitglieder ohne Routine heute anzeigen","editor.show_done":"Bereits Erledigtes anzeigen","editor.members":"Auf diese Mitglieder beschränken","editor.member":"Familienmitglied","editor.layout":"Darstellung","editor.week_days":"Angezeigte Tage","editor.show_rooms":"Räume anzeigen","editor.show_times":"Stundenzeiten anzeigen","editor.show_breaks":"Pausen anzeigen","editor.hide_empty_periods":"Stunden ausblenden, die niemand hat","editor.highlight":"Heute und laufende Stunde hervorheben","editor.roll_days":"Vergangene Wochentage auf nächste Woche weiterrollen","editor.section":"Bereich beim Öffnen","editor.days":"Angezeigte Tage","editor.show_steps":"Bilanz je Schritt anzeigen","editor.sort":"Reihenfolge","admin.tab_timetable":"Stundenplan","admin.tab_routines":"Routinen","admin.tab_family":"Familie","admin.tab_subjects":"Fächer","admin.tab_holidays":"Freie Tage","admin.tab_materials":"Material","admin.tab_exceptions":"Ausnahmen","admin.cycle_one":"Eine Woche","admin.cycle_two":"Zwei Wochen (A/B)","admin.cycle_start":"A-Woche beginnt in KW","admin.cycle_now":"Diese Woche ist Woche {week}.","admin.week_a":"A-Woche","admin.week_b":"B-Woche","admin.exceptions_hint":"Was ein einzelnes Datum anders macht. Eine Bezeichnung nimmt den ganzen Tag ein; auf eine Stunde tippen, um sie entfallen zu lassen oder zu sagen, was stattdessen läuft. Vergangene Daten fallen von selbst weg.","admin.exception_date":"Datum","admin.exception_label":"Was der Tag ist","admin.exception_label_hint":"Wandertag, Sportfest — leer lassen für einen normalen Tag","admin.exception_cancel":"Entfällt","admin.exception_reset":"Zurück zum Stundenplan","admin.exception_none":"An diesem Datum ist nichts anders.","admin.exception_add":"Datum hinzufügen","admin.materials_hint":"Was ein Fach an Sachen braucht. Es erscheint am Abend davor in der Abendroutine, bei jedem Kind, das dieses Fach hat.","admin.materials_items":"Eine Sache pro Zeile","admin.save":"Speichern","admin.add":"Hinzufügen","admin.clear":"Leeren","admin.remove":"Entfernen","admin.remove_confirm":"{name} entfernen? Stundenplan und Routinen gehen mit.","admin.add_member":"Familienmitglied hinzufügen","admin.periods":"Stundenzeiten, eine pro Zeile","admin.schedule":"Schule","admin.schedule_default":"Die üblichen Zeiten","admin.travel":"Weg zur Schule (Min.)","admin.travel_hint":"Ergibt eine Losgeh-Zeit, die sich verschiebt, wenn die erste Stunde ausfällt. Leer für keine.","admin.leave_time":"Losgehen an Schultagen um","admin.care_leave_time":"Losgehen in der Ferienbetreuung um","admin.leave_time_hint":"Für Bus oder Fahrgemeinschaft, die kommen, egal was ausfällt. Gilt vor dem Weg zur Schule.","header.leave_in":"los in {minutes} Min.","header.leave_now":"jetzt los!","header.leave_at":"los um {time}","admin.schedule_name":"Name der Schule","admin.schedule_hint":"Gymnasium, Grundschule …","admin.schedule_add":"Weitere Schule mit anderen Zeiten","admin.schedule_remove":"{name} entfernen? Die Stundenzeiten gehen mit.","admin.schedule_remove_one":"{name} entfernen? {members} kommt dann auf die üblichen Stundenzeiten.","admin.schedule_remove_members":"{name} entfernen? {members} kommen dann auf die üblichen Stundenzeiten.","admin.periods_first":"Trage zuerst die Stundenzeiten ein — die Woche hängt daran.","admin.no_members":"Noch ist niemand angelegt. Lege zuerst ein Familienmitglied an.","admin.no_subjects":"Noch keine Fächer. Sie erscheinen, sobald ein Stundenplan Stunden hat.","admin.subject":"Fach","admin.room":"Raum","admin.name":"Name","admin.color":"Farbe","admin.calendar":"Eigener Kalender","admin.lessons_calendar":"Stundenplan-Kalender der Schule","admin.exams_calendar":"Klassenarbeiten-Kalender der Schule","admin.homework_list":"Hausaufgaben-Liste der Schule","admin.school_system":"Schulsystem (WebUntis, Schulmanager o. Ä.), optional","admin.school_system_hint":"Kalender und Listen, die ein Schulsystem wie WebUntis oder Schulmanager Online schon für dieses Kind führt: Daraus kommen Änderungen am Stundenplan, Arbeiten und neue Hausaufgaben. Bei WebUntis dort in den Optionen „Kalender - Ausfallende Stunden“ einschalten.","admin.avatar":"Bild","admin.block_morning":"Morgens","admin.block_evening":"Abends","admin.day_free":"Freier Tag","admin.day_care":"Ferienbetreuung","admin.steps_hint":"Ein Schritt pro Zeile","admin.school_calendars":"Kalender, die die Schule schließen, einer pro Zeile","admin.care_keywords":"Betreuungs-Stichwörter, eines pro Zeile","admin.care_hint":"Ferienbetreuung","admin.cancel_keywords":"Wörter für eine ausgefallene Stunde, eines pro Zeile","admin.cancel_hint":"Entfall","admin.substitute_keywords":"Wörter für eine Vertretungsstunde, eines pro Zeile","admin.substitute_hint":"Vertretung","admin.school_words":"Wörter aus dem Schulsystem","admin.school_words_hint":"Für WebUntis schon eingestellt. Nur ändern, wenn euer Schulsystem etwas anderes schreibt.","admin.avatar_hint":"Für ein Bild eine Person-Entität eintragen — die, die Home Assistant schon kennt. Eine URL geht auch.","admin.colors_hint":"Jedes Fach hat schon eine Farbe, abgeleitet aus seinem Namen. Das hier ist nur zum Korrigieren.","admin.calendars_hint":"Jeder laufende Termin in diesen Kalendern bedeutet schulfrei — nimm also Kalender, in denen nichts anderes steht.","editor.weather_entity":"Wetter-Entität","editor.greeting":"Begrüßung","editor.show_seconds":"Sekunden anzeigen","editor.show_leave":"Losgeh-Zeit für die Schule anzeigen"},he:{"board.missing":"לא נמצא לוח של Schoolday. הוסיפו את האינטגרציה Schoolday.","routines.nothing_today":"אין כלום היום","routines.auto":"אוטומטי (לפי שעה ביום)","routines.morning":"בוקר","routines.evening":"ערב","routines.both":"שניהם","routines.none_configured":"אין שגרות להיום. הוסיפו אותן תחת „הגדר“ ← עריכת שגרות באינטגרציה Schoolday.","routines.sick":"בבית, חולה","routines.packed_for":"בשביל {subject}","timetable.sick":"חולה","timetable.event":"אין לימודים רגילים","timetable.changed":"שינוי","timetable.exam":"מבחן","routines.exam_tomorrow":"מחר מבחן","stats.percent":"{value}%","stats.window":"ב-{days} ימים","stats.window_one":"ביום אחד","stats.streak":"{days} ימים ברצף","stats.best":"שיא {days}","stats.day_done":"{done} מתוך {asked} בוצעו","stats.nothing_asked":"לא היה כלום","stats.nothing_yet":"עדיין אין רישום. הוא מתחיל ביום הלימודים הראשון.","stats.none_configured":"אין שגרות לרשום. הוסיפו אותן תחת „הגדר“ ← עריכת שגרות באינטגרציה Schoolday.","stats.sort_board":"הסדר הרגיל של המשפחה","stats.sort_rate":"הרישום הטוב ביותר קודם","homework.nothing":"אין מה לעשות","homework.all_done":"אין שיעורי בית פתוחים.","homework.overdue":"באיחור","homework.today":"להיום","homework.tomorrow":"למחר","homework.later":"בהמשך","homework.someday":"בלי תאריך","timetable.no_periods":"עדיין אין זמני שיעורים. הוסיפו אותם תחת „הגדר“ ← זמני שיעורים באינטגרציה Schoolday.","timetable.none_configured":"לאף אחד עדיין אין מערכת שעות. הוסיפו אחת תחת „הגדר“ ← עריכת מערכת שעות באינטגרציה Schoolday.","timetable.break":"הפסקה","timetable.no_school":"אין לימודים","timetable.free":"חופש","timetable.care":"מסגרת בחופשה","timetable.now":"עכשיו","timetable.next":"הבא","timetable.remaining":"עוד {minutes} דק׳","timetable.done_for_today":"הלימודים להיום נגמרו.","timetable.layout_auto":"אוטומטי (שבוע, יום אחד כשצר)","timetable.layout_week":"כל השבוע","timetable.layout_day":"יום אחד","timetable.days_auto":"אוטומטי (לפי מה שהמערכת צריכה)","timetable.days_school":"שני עד שישי","timetable.days_week":"כל שבעת הימים","editor.block":"איזה חלק להציג","editor.evening_from":"הערב מתחיל בשעה","editor.show_empty":"להציג בני משפחה שאין להם כלום היום","editor.show_done":"להציג מה שכבר בוצע","editor.members":"רק בני המשפחה האלה","editor.member":"בן משפחה","editor.layout":"פריסה","editor.week_days":"ימים מוצגים","editor.show_rooms":"להציג חדרים","editor.show_times":"להציג זמני שיעורים","editor.show_breaks":"להציג הפסקות","editor.hide_empty_periods":"להסתיר שיעורים שאין לאף אחד","editor.highlight":"לסמן את היום ואת השיעור הנוכחי","editor.roll_days":"ימים שעברו עוברים לשבוע הבא","editor.section":"החלק שנפתח ראשון","editor.days":"ימים מוצגים","editor.show_steps":"להציג את הספירה לכל שלב","editor.sort":"סדר","admin.tab_timetable":"מערכת שעות","admin.tab_routines":"שגרות","admin.tab_family":"משפחה","admin.tab_subjects":"מקצועות","admin.tab_holidays":"ימי חופש","admin.tab_materials":"ציוד","admin.tab_exceptions":"חריגים","admin.cycle_one":"שבוע אחד","admin.cycle_two":"שבועיים (א׳/ב׳)","admin.cycle_start":"שבוע א׳ מתחיל בשבוע מספר","admin.cycle_now":"השבוע הוא שבוע {week}.","admin.week_a":"שבוע א׳","admin.week_b":"שבוע ב׳","admin.exceptions_hint":"מה שתאריך אחד עושה אחרת. תווית תופסת את כל היום; הקישו על שיעור כדי לבטל אותו או לכתוב מה מתקיים במקומו. תאריכים שעברו נמחקים מעצמם.","admin.exception_date":"תאריך","admin.exception_label":"מה היום הזה","admin.exception_label_hint":"טיול שנתי, יום ספורט — השאירו ריק ליום רגיל","admin.exception_cancel":"בוטל","admin.exception_reset":"חזרה למערכת השעות","admin.exception_none":"אין שום שינוי בתאריך הזה.","admin.exception_add":"הוספת תאריך","admin.materials_hint":"מה צריך להביא לכל מקצוע. הפריטים מופיעים בשגרת הערב ביום שלפני, למי שיש לו את המקצוע.","admin.materials_items":"פריט אחד בכל שורה","admin.save":"שמירה","admin.add":"הוספה","admin.clear":"ניקוי","admin.remove":"הסרה","admin.remove_confirm":"להסיר את {name}? גם מערכת השעות והשגרות יימחקו.","admin.add_member":"הוספת בן משפחה","admin.periods":"זמני שיעורים, אחד בכל שורה","admin.schedule":"בית ספר","admin.schedule_default":"הזמנים הרגילים","admin.travel":"הדרך לבית הספר (דק׳)","admin.travel_hint":"נותן שעת יציאה שזזה כשהשיעור הראשון מבוטל. ריק אם אין.","admin.leave_time":"יציאה בימי לימודים בשעה","admin.care_leave_time":"יציאה למסגרת בחופשה בשעה","admin.leave_time_hint":"להסעה או טרמפ, שמגיעים בזמן שלהם לא משנה מה בוטל. גובר על הדרך לבית הספר.","header.leave_in":"יוצאים בעוד {minutes} דק׳","header.leave_now":"זמן לצאת","header.leave_at":"יוצאים ב-{time}","admin.schedule_name":"שם בית הספר","admin.schedule_hint":"תיכון, יסודי…","admin.schedule_add":"בית ספר נוסף עם זמנים אחרים","admin.schedule_remove":"להסיר את {name}? זמני השיעורים שלו יימחקו איתו.","admin.schedule_remove_one":"להסיר את {name}? {members} חוזר/ת לזמני השיעורים הרגילים.","admin.schedule_remove_members":"להסיר את {name}? {members} חוזרים לזמני השיעורים הרגילים.","admin.periods_first":"קודם הגדירו את זמני השיעורים — השבוע נבנה עליהם.","admin.no_members":"עדיין לא הוגדר אף אחד. הוסיפו קודם בן משפחה.","admin.no_subjects":"עדיין אין מקצועות. הם יופיעו ברגע שבמערכת שעות יהיו שיעורים.","admin.subject":"מקצוע","admin.room":"חדר","admin.name":"שם","admin.color":"צבע","admin.calendar":"לוח שנה פרטי","admin.lessons_calendar":"לוח שיעורים מבית הספר","admin.exams_calendar":"לוח מבחנים מבית הספר","admin.homework_list":"רשימת שיעורי בית מבית הספר","admin.school_system":"מערכת בית ספר (WebUntis, Schulmanager וכדומה), אופציונלי","admin.school_system_hint":"לוחות שנה ורשימות שמערכת בית ספר כמו WebUntis או Schulmanager Online כבר מנהלת עבור הילד: מהם מגיעים שינויים במערכת השעות, מבחנים ושיעורי בית חדשים. ב-WebUntis, הפעילו באפשרויות שלה את “Calendar - cancelled lessons”.","admin.avatar":"תמונה","admin.block_morning":"בוקר","admin.block_evening":"ערב","admin.day_free":"יום חופש","admin.day_care":"מסגרת בחופשה","admin.steps_hint":"שלב אחד בכל שורה","admin.school_calendars":"לוחות שנה שסוגרים את בית הספר, אחד בכל שורה","admin.care_keywords":"מילות מפתח למסגרת בחופשה, אחת בכל שורה","admin.care_hint":"קייטנה","admin.cancel_keywords":"מילים שאומרות ששיעור בוטל, אחת בכל שורה","admin.cancel_hint":"בוטל","admin.substitute_keywords":"מילים שאומרות שמישהו אחר מעביר שיעור, אחת בכל שורה","admin.substitute_hint":"מילוי מקום","admin.school_words":"מילים ממערכת בית הספר","admin.school_words_hint":"כבר מוגדר ל-WebUntis. שנו רק אם מערכת בית הספר שלכם כותבת משהו אחר.","admin.avatar_hint":"לתמונה, הכניסו ישות person — זו ש-Home Assistant כבר מכיר. גם כתובת URL עובדת.","admin.colors_hint":"לכל מקצוע כבר יש צבע שנלקח מהשם שלו. זה רק כדי לתקן אחד.","admin.calendars_hint":"כל אירוע שפעיל בלוחות האלה אומר שאין לימודים, אז השתמשו בלוחות שאין בהם שום דבר אחר.","editor.weather_entity":"ישות מזג אוויר","editor.greeting":"ברכה","editor.show_seconds":"להציג שניות","editor.show_leave":"להציג מתי לצאת לבית הספר"}};function Re(e){return(e?.locale?.language||e?.language||"en").toLowerCase().split("-")[0]}function Fe(e,t,s){let i=(He[Re(e)]??We)[t]??We[t]??t;if(s)for(const[e,t]of Object.entries(s))i=i.replace(`{${e}}`,String(t));return i}const Pe=new Set(["he"]);function Be(e){return Pe.has(Re(e))}const Ie=e=>({name:e,selector:{boolean:{}}}),Ke=(e,t,s)=>({name:e,selector:{number:{min:t,max:s,mode:"box"}}}),qe=(e,t,s=!1)=>({name:e,selector:{select:{options:t,multiple:s,mode:s?"list":"dropdown"}}});class Ze extends le{constructor(){super(...arguments),this._config={type:""},this._label=e=>Fe(this.hass,`editor.${e.name}`)}setConfig(e){this._config={...e}}_valueChanged(e){e.stopPropagation();const t={...this._config,...e.detail?.value??{}};for(const[e,s]of Object.entries(t))(void 0===s||""===s||Array.isArray(s)&&!s.length)&&delete t[e];var s,i;s="config-changed",i={config:t},this.dispatchEvent(new CustomEvent(s,{detail:i,bubbles:!0,composed:!0}))}render(){return this.hass?K`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this.schema()}
        .computeLabel=${this._label}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:K``}}function Ve(e){return(Oe(e)?.members??[]).map(e=>({value:e.id,label:e.name}))}s([pe({attribute:!1})],Ze.prototype,"hass",void 0),s([be()],Ze.prototype,"_config",void 0);let Ge=class extends Ze{schema(){const e=Ve(this.hass);return[...e.length>1?[qe("member",e)]:[],qe("block",[{value:"auto",label:Fe(this.hass,"routines.auto")},{value:"morning",label:Fe(this.hass,"routines.morning")},{value:"evening",label:Fe(this.hass,"routines.evening")},{value:"both",label:Fe(this.hass,"routines.both")}]),Ke("evening_from",0,23),Ie("show_empty")]}};Ge=s([he("schoolday-routines-card-editor")],Ge);let Je=class extends Ze{schema(){const e=Ve(this.hass);return[...e.length>1?[qe("member",e)]:[],Ke("days",7,30),Ie("show_steps"),...e.length>1?[qe("sort",[{value:"board",label:Fe(this.hass,"stats.sort_board")},{value:"rate",label:Fe(this.hass,"stats.sort_rate")}])]:[]]}};Je=s([he("schoolday-stats-card-editor")],Je);let Ye=class extends Ze{schema(){const e=Ve(this.hass);return[...e.length>1?[qe("member",e)]:[],qe("layout",[{value:"auto",label:Fe(this.hass,"timetable.layout_auto")},{value:"week",label:Fe(this.hass,"timetable.layout_week")},{value:"day",label:Fe(this.hass,"timetable.layout_day")}]),qe("week_days",[{value:"auto",label:Fe(this.hass,"timetable.days_auto")},{value:"school",label:Fe(this.hass,"timetable.days_school")},{value:"week",label:Fe(this.hass,"timetable.days_week")}]),Ie("show_rooms"),Ie("show_times"),Ie("show_breaks"),Ie("hide_empty_periods"),Ie("highlight"),Ie("roll_days")]}};Ye=s([he("schoolday-timetable-card-editor")],Ye);let Qe=class extends Ze{schema(){const e=Ve(this.hass);return[...e.length>1?[qe("member",e)]:[],Ie("show_done"),Ie("show_empty")]}};Qe=s([he("schoolday-homework-card-editor")],Qe);let Xe=class extends Ze{schema(){return[qe("section",[{value:"timetable",label:Fe(this.hass,"admin.tab_timetable")},{value:"routines",label:Fe(this.hass,"admin.tab_routines")},{value:"family",label:Fe(this.hass,"admin.tab_family")},{value:"subjects",label:Fe(this.hass,"admin.tab_subjects")},{value:"materials",label:Fe(this.hass,"admin.tab_materials")},{value:"exceptions",label:Fe(this.hass,"admin.tab_exceptions")},{value:"holidays",label:Fe(this.hass,"admin.tab_holidays")}])]}};Xe=s([he("schoolday-admin-card-editor")],Xe);let et=class extends Ze{schema(){return[{name:"weather_entity",selector:{entity:{domain:"weather"}}},{name:"greeting",selector:{text:{}}},Ie("show_seconds"),Ie("show_leave")]}};et=s([he("schoolday-header-card-editor")],et);const tt={members:[],routines:{},periods:[],schedules:{},colors:{},schoolCalendars:[],careKeywords:[],cancelKeywords:[],substituteKeywords:[],materials:{},subjects:[],exceptions:{},cycleWeeks:1,cycleAnchor:null,cycleNow:0};function st(e){return Array.isArray(e)?e.filter(e=>"string"==typeof e):[]}function it(e){return function(e){if(!e||"object"!=typeof e)return tt;const t=e,s=(Array.isArray(t.members)?t.members:[]).map(e=>e).filter(e=>"string"==typeof e?.id&&"string"==typeof e?.name).map(e=>({id:String(e.id),name:String(e.name),color:"string"==typeof e.color?e.color:"#3a86c8",avatar:"string"==typeof e.avatar&&e.avatar?e.avatar:null,order:Number(e.order??0),calendar:"string"==typeof e.calendar&&e.calendar?e.calendar:null,lessonsCalendar:"string"==typeof e.lessons_calendar&&e.lessons_calendar?e.lessons_calendar:null,examsCalendar:"string"==typeof e.exams_calendar&&e.exams_calendar?e.exams_calendar:null,homeworkList:"string"==typeof e.homework_list&&e.homework_list?e.homework_list:null,schedule:"string"==typeof e.schedule&&e.schedule?e.schedule:null,travelMinutes:"number"==typeof e.travel_minutes?e.travel_minutes:null,leaveTime:"string"==typeof e.leave_time&&e.leave_time?e.leave_time:null,careLeaveTime:"string"==typeof e.care_leave_time&&e.care_leave_time?e.care_leave_time:null})).sort((e,t)=>e.order-t.order),i={};for(const[e,s]of Object.entries(t.routines??{})){const t={};for(const[e,i]of Object.entries(s??{})){const s={};for(const[e,t]of Object.entries(i??{})){const i=st(t);i.length&&(s[e]=i)}t[e]=s}i[e]=t}const a={};for(const[e,s]of Object.entries(t.colors??{}))"string"==typeof s&&(a[e]=s);const n={};for(const[e,s]of Object.entries(t.materials??{})){const t=st(s);t.length&&(n[e]=t)}const o={};for(const[e,s]of Object.entries(t.exceptions??{})){const t={};for(const[e,i]of Object.entries(s??{})){const s=i??{},a={};for(const[e,t]of Object.entries(s.periods??{})){const s=t??{};a[e]="string"==typeof s.subject&&s.subject?{subject:s.subject,room:"string"==typeof s.room&&s.room?s.room:null}:null}t[e]={label:"string"==typeof s.label&&s.label?s.label:null,periods:a}}Object.keys(t).length&&(o[e]=t)}return{members:s,routines:i,exceptions:o,periods:st(t.periods),schedules:Object.fromEntries(Object.entries(t.schedules??{}).map(([e,t])=>[e,st(t)])),colors:a,schoolCalendars:st(t.school_calendars),careKeywords:st(t.care_keywords),cancelKeywords:st(t.cancel_keywords),substituteKeywords:st(t.substitute_keywords),materials:n,subjects:st(t.subjects),cycleWeeks:2===Number(t.cycle_weeks??1)?2:1,cycleAnchor:"string"==typeof t.cycle_anchor?t.cycle_anchor:null,cycleNow:1===Number(t.cycle_now??0)?1:0}}(e?.attributes?.admin)}function at(e){return Object.keys(e.states).filter(e=>e.startsWith("calendar.")).sort()}const nt=d`
  :host {
    --schoolday-gap: 8px;
    --schoolday-radius: 12px;
    --schoolday-touch: 44px;
    --schoolday-muted: var(--secondary-text-color, #7a7a7a);
    --schoolday-line: var(--divider-color, rgba(127, 127, 127, 0.25));
    --schoolday-surface: var(--card-background-color, #fff);
    --schoolday-surface-alt: rgba(127, 127, 127, 0.08);
    --schoolday-today: var(--primary-color, #03a9f4);
    /* A day off and a day in care are both "no lessons" and nothing alike otherwise,
       so each gets its own colour. Neither is drawn from the subject palette: they are
       not subjects, and a household should not have to wonder whether the sand block
       is a holiday or somebody's Art lesson. */
    --schoolday-holiday: #b08d57;
    --schoolday-care: #2f7f8f;
    /* A third kind of closed day, and the only one that is nobody's good news. Muted
       rather than alarming: the board says what is, it does not fuss. */
    --schoolday-sick: #8a8f98;
    /* A day the school took over — a trip, a sports day. The child is at school, just
       not at their timetable, so it reads as an occasion rather than as a day off. */
    --schoolday-event: #7a5ea8;
  }
`,ot=d`
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
    min-width: var(--schoolday-touch);
    min-height: var(--schoolday-touch);
    border-radius: 50%;
    color: var(--schoolday-muted);
  }

  .icon-button:active {
    background: var(--schoolday-surface-alt);
  }

  .icon-button svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }

  .segmented {
    display: inline-flex;
    border: 1px solid var(--schoolday-line);
    border-radius: calc(var(--schoolday-touch) / 2);
    overflow: hidden;
  }

  .segmented button {
    min-height: 36px;
    padding: 0 14px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--schoolday-muted);
  }

  .segmented button[aria-pressed='true'] {
    background: var(--schoolday-today);
    color: var(--text-primary-color, #fff);
  }
`;var rt;const dt=["timetable","routines","family","subjects","materials","exceptions","holidays"],lt=["morning","evening"],ct=new Date(2024,0,1);let ht=rt=class extends le{constructor(){super(...arguments),this._config={type:""},this._section="timetable",this._block="morning",this._routineDay="0",this._exceptionDate="",this._adding=!1,this._draftSubject="",this._draftRoom="",this._drafts={},this._busy=!1}static async getConfigElement(){return document.createElement("schoolday-admin-card-editor")}static getStubConfig(){return{section:"timetable"}}setConfig(e){this._config={...e},e.section&&dt.includes(e.section)&&(this._section=e.section)}getCardSize(){return 10}getGridOptions(){return{columns:"full",rows:"auto"}}get _board(){return Oe(this.hass,this._config.board_entity)}_admin(){const e=this._board;return it(e?this.hass.states[e.entityId]:void 0)}_selected(e){return e.members.find(e=>e.id===this._memberId)??e.members[0]}async _call(e,t){if(!this._busy){this._busy=!0,this._error=void 0;try{await function(e,t,s){return e.callService("schoolday",t,s)}(this.hass,e,t)}catch(e){this._error=function(e){if("string"==typeof e)return e;if(e&&"object"==typeof e){const t=e;for(const e of["message","error"]){const s=t[e];if("string"==typeof s&&s)return s}const s=t.body;if(s&&"string"==typeof s.message&&s.message)return s.message;try{return JSON.stringify(e)}catch{return"Unknown error"}}return String(e)}(e)}finally{this._busy=!1}}}_draft(e,t,s){return this._drafts[`${e}-${t}`]??s}_setDraft(e,t,s){this._drafts={...this._drafts,[`${e}-${t}`]:s}}_weekdayName(e,t){const s=new Date(ct);return s.setDate(s.getDate()+e),new Intl.DateTimeFormat(_e(this.hass),{weekday:t}).format(s)}_memberChips(e,t){return K`
      <div class="chips">
        ${e.members.map(e=>K`
            <button
              class="chip ${e.id===t?.id?"on":""}"
              style=${`--member-color:${e.color}`}
              @click=${()=>{this._memberId=e.id,this._cell=void 0}}
            >
              <bdi>${e.name}</bdi>
            </button>
          `)}
      </div>
    `}_entityField(e,t,s,i,a,n,o=!1){return customElements.get("ha-entity-picker")?K`
        <div class="field grow">
          <ha-entity-picker
            id=${e}
            .hass=${this.hass}
            .value=${i}
            .label=${t}
            .includeDomains=${[s]}
            .allowCustomEntity=${o}
            @value-changed=${e=>n(e.detail?.value??"")}
          ></ha-entity-picker>
        </div>
      `:K`
      <label class="field grow">
        <span class="label">${t}</span>
        <input
          id=${e}
          list=${a}
          .value=${i}
          placeholder=${`${s}.…`}
          @change=${e=>n(e.target.value)}
        />
      </label>
    `}_entitiesField(e,t,s,i,a){if(!customElements.get("ha-entity-picker"))return this._lines(e,s,i,a);const n=[...s,""];return K`
      <div class="field">
        <span class="label">${e}</span>
        ${n.map((e,i)=>K`
            <ha-entity-picker
              .hass=${this.hass}
              .value=${e}
              .includeDomains=${[t]}
              @value-changed=${e=>{const t=String(e.detail?.value??""),n=[...s];if(i>=n.length){if(!t)return;n.push(t)}else t?n[i]=t:n.splice(i,1);a(n.filter(Boolean))}}
            ></ha-entity-picker>
          `)}
      </div>
    `}_lines(e,t,s,i){return K`
      <label class="field">
        <span class="label"><bdi>${e}</bdi></span>
        <textarea
          id=${`lines-${e}`}
          rows=${Math.max(3,t.length+1)}
          placeholder=${s}
          .value=${t.join("\n")}
        ></textarea>
        <button
          class="apply"
          ?disabled=${this._busy}
          @click=${e=>{const t=e.target.closest(".field"),s=t?.querySelector("textarea");i((s?.value??"").split("\n").map(e=>e.trim()).filter(Boolean))}}
        >
          ${Fe(this.hass,"admin.save")}
        </button>
      </label>
    `}_renderCycle(e){const t=e.cycleAnchor?function(e){const[t,s,i]=e.split("-").map(Number);if(!t||!s||!i)return null;const a=new Date(Date.UTC(t,s-1,i));a.setUTCDate(a.getUTCDate()+3-(a.getUTCDay()+6)%7);const n=new Date(Date.UTC(a.getUTCFullYear(),0,4));return n.setUTCDate(n.getUTCDate()+3-(n.getUTCDay()+6)%7),{week:1+Math.round((a.getTime()-n.getTime())/6048e5),year:a.getUTCFullYear()}}(e.cycleAnchor):null;return K`
      <div class="cycle">
        <div class="segmented">
          ${[1,2].map(t=>K`
              <button
                aria-pressed=${e.cycleWeeks===t}
                ?disabled=${this._busy}
                @click=${()=>this._call("set_cycle",{weeks:t})}
              >
                ${Fe(this.hass,1===t?"admin.cycle_one":"admin.cycle_two")}
              </button>
            `)}
        </div>
        ${e.cycleWeeks>1?K`
              <label class="field">
                <span class="label">${Fe(this.hass,"admin.cycle_start")}</span>
                <input
                  id="cycle-week"
                  type="number"
                  min="1"
                  max="53"
                  .value=${t?String(t.week):""}
                  @change=${e=>{const s=Number(e.target.value);s>=1&&s<=53&&this._call("set_cycle",{weeks:2,iso_week:s,iso_year:t?.year})}}
                />
              </label>
              <div class="notice quiet">
                ${Fe(this.hass,"admin.cycle_now",{week:1===e.cycleNow?"B":"A"})}
              </div>
            `:Z}
      </div>
    `}_renderTimetable(e){const t=this._selected(e),s=this._board?.timetable,i=t?Ae(Ue(this.hass,t.id)):{},a=e.cycleWeeks>1?this._week??e.cycleNow:0,n=[0,1,2,3,4,5,6].filter(e=>e<=4||(i[e]??[]).length>0||(i[e+7]??[]).length>0);return K`
      ${this._renderCycle(e)}
      ${this._lines(Fe(this.hass,"admin.periods"),e.periods,"08:00-08:45",e=>this._call("set_periods",{periods:e}))}
      ${this._renderSchedules(e)}
      ${s?.periods.length?t?K`
              ${this._memberChips(e,t)}
              ${e.cycleWeeks>1?K`<div class="segmented week-pick">
                    ${[0,1].map(e=>K`
                        <button
                          aria-pressed=${a===e}
                          @click=${()=>{this._week=e,this._cell=void 0}}
                        >
                          ${Fe(this.hass,0===e?"admin.week_a":"admin.week_b")}
                        </button>
                      `)}
                  </div>`:Z}
              <div
                class="week"
                style=${`grid-template-columns:max-content repeat(${n.length}, minmax(0, 1fr))`}
              >
                <div></div>
                ${n.map(e=>K`<div class="head">${this._weekdayName(e,"short")}</div>`)}
                ${s.periods.map(e=>K`
                    <div class="no">${e.index}</div>
                    ${n.map(t=>{const n=t+7*a,o=`${n}:${e.index}`,r=Le(i,n,e.index);return K`
                        <button
                          class="slot ${r?"filled":""} ${this._cell===o?"open":""}"
                          style=${r?`--subject:${s.subjects[r.subject]??"var(--schoolday-line)"}`:""}
                          @click=${()=>{this._cell=this._cell===o?void 0:o,this._draftSubject=r?.subject??"",this._draftRoom=r?.room??""}}
                        >
                          <span class="subject"><bdi>${r?.subject??"+"}</bdi></span>
                          ${r?.room?K`<span class="room"><bdi>${r.room}</bdi></span>`:Z}
                        </button>
                      `})}
                  `)}
              </div>
              ${this._cell?this._renderCellEditor(t):Z}
            `:K`<div class="notice">${Fe(this.hass,"admin.no_members")}</div>`:K`<div class="notice">${Fe(this.hass,"admin.periods_first")}</div>`}
    `}_renderCellEditor(e){const[t,s]=this._cell.split(":").map(Number),i=t%7,a=Math.floor(t/7),n=(this._board?.timetable?.cycleWeeks??1)>1,o=Object.keys(this._board?.timetable?.subjects??{}).sort();return K`
      <div class="editor">
        <div class="editor-head">
          <bdi>${e.name}</bdi> · ${this._weekdayName(i,"long")}${n?` ${Fe(this.hass,1===a?"admin.week_b":"admin.week_a")}`:""} · ${s}.
        </div>
        <div class="row">
          <label class="field grow">
            <span class="label">${Fe(this.hass,"admin.subject")}</span>
            <input
              list="schoolday-subjects"
              .value=${this._draftSubject}
              @input=${e=>{this._draftSubject=e.target.value}}
            />
            <datalist id="schoolday-subjects">
              ${o.map(e=>K`<option value=${e}></option>`)}
            </datalist>
          </label>
          <label class="field grow">
            <span class="label">${Fe(this.hass,"admin.room")}</span>
            <input
              .value=${this._draftRoom}
              @input=${e=>{this._draftRoom=e.target.value}}
            />
          </label>
        </div>
        <div class="row">
          <button
            class="apply"
            ?disabled=${this._busy}
            @click=${async()=>{await this._call("set_lesson",{member:e.id,weekday:i,week:a,period:s,subject:this._draftSubject,room:this._draftRoom}),this._cell=void 0}}
          >
            ${Fe(this.hass,"admin.save")}
          </button>
          <button
            class="danger"
            ?disabled=${this._busy}
            @click=${async()=>{await this._call("set_lesson",{member:e.id,weekday:i,week:a,period:s,subject:""}),this._cell=void 0}}
          >
            ${Fe(this.hass,"admin.clear")}
          </button>
        </div>
      </div>
    `}_renderRoutines(e){const t=this._selected(e);if(!t)return K`<div class="notice">${Fe(this.hass,"admin.no_members")}</div>`;const s=e=>"free"===e?Fe(this.hass,"admin.day_free"):"care"===e?Fe(this.hass,"admin.day_care"):this._weekdayName(Number(e),"short");return K`
      ${this._memberChips(e,t)}
      <div class="chips">
        ${lt.map(e=>K`
            <button
              class="chip ${e===this._block?"on":""}"
              @click=${()=>{this._block=e}}
            >
              ${Fe(this.hass,`admin.block_${e}`)}
            </button>
          `)}
      </div>
      <div class="chips">
        ${["0","1","2","3","4","5","6","free","care"].map(e=>K`
            <button
              class="chip ${e===this._routineDay?"on":""}"
              @click=${()=>{this._routineDay=e}}
            >
              ${s(e)}
            </button>
          `)}
      </div>
      ${this._lines(`${t.name} · ${Fe(this.hass,`admin.block_${this._block}`)} · ${s(this._routineDay)}`,function(e,t,s,i){return e.routines[t]?.[s]?.[i]??[]}(e,t.id,this._block,this._routineDay),Fe(this.hass,"admin.steps_hint"),e=>this._call("set_routine",{member:t.id,block:this._block,day:this._routineDay,steps:e}))}
    `}_renderSchedules(e){const t=Object.keys(e.schedules);return K`
      ${t.map(t=>{const s=e.members.filter(e=>e.schedule===t);return K`
          ${this._lines(t,e.schedules[t],"08:15-09:00",e=>this._call("set_periods",{schedule:t,periods:e}))}
          <div class="row">
            <button
              class="danger"
              ?disabled=${this._busy}
              @click=${()=>{const e=s.length?Fe(this.hass,1===s.length?"admin.schedule_remove_one":"admin.schedule_remove_members",{name:t,members:s.map(e=>e.name).join(", ")}):Fe(this.hass,"admin.schedule_remove",{name:t});confirm(e)&&this._call("set_periods",{schedule:t,periods:[]})}}
            >
              ${Fe(this.hass,"admin.remove")}
            </button>
          </div>
        `})}
      ${this._adding?K`
            <div class="row">
              <label class="field grow">
                <span class="label">${Fe(this.hass,"admin.schedule_name")}</span>
                <input id="schedule-new" placeholder=${Fe(this.hass,"admin.schedule_hint")} />
              </label>
              <button
                class="apply"
                ?disabled=${this._busy}
                @click=${t=>{const s=t.target.getRootNode(),i=s.querySelector("#schedule-new")?.value.trim();i&&this._call("set_periods",{schedule:i,periods:e.periods.length?e.periods:["08:00-08:45"]}).then(()=>{this._adding=!1})}}
              >
                ${Fe(this.hass,"admin.add")}
              </button>
            </div>
          `:K`
            <button class="apply" ?disabled=${this._busy} @click=${()=>{this._adding=!0}}>
              ${Fe(this.hass,"admin.schedule_add")}
            </button>
          `}
    `}_renderFamily(e){const t=at(this.hass),s=(i=this.hass,Object.keys(i.states).filter(e=>e.startsWith("person.")).sort());var i;const a=function(e){return Object.keys(e.states).filter(e=>e.startsWith("todo.")).sort()}(this.hass),n=t=>{const s=t?.id??"new";return K`
        <div class="member" style=${`--member-color:${t?.color??"#3a86c8"}`}>
          <div class="row">
            <label class="field grow">
              <span class="label">${Fe(this.hass,"admin.name")}</span>
              <input id=${`name-${s}`} .value=${t?.name??""} />
            </label>
            <label class="field">
              <span class="label">${Fe(this.hass,"admin.color")}</span>
              <input type="color" id=${`color-${s}`} .value=${t?.color??"#3a86c8"} />
            </label>
          </div>
          <div class="row">
            ${this._entityField(`calendar-${s}`,Fe(this.hass,"admin.calendar"),"calendar",this._draft(s,"calendar",t?.calendar??""),"schoolday-calendars",e=>this._setDraft(s,"calendar",e))}
          </div>
          <details
            class="more"
            ?open=${Boolean(t?.lessonsCalendar||t?.examsCalendar||t?.homeworkList)}
          >
            <summary>${Fe(this.hass,"admin.school_system")}</summary>
            <div class="notice quiet">${Fe(this.hass,"admin.school_system_hint")}</div>
            <div class="row">
            ${this._entityField(`lessons-${s}`,Fe(this.hass,"admin.lessons_calendar"),"calendar",this._draft(s,"lessons_calendar",t?.lessonsCalendar??""),"schoolday-calendars",e=>this._setDraft(s,"lessons_calendar",e))}
            ${this._entityField(`exams-${s}`,Fe(this.hass,"admin.exams_calendar"),"calendar",this._draft(s,"exams_calendar",t?.examsCalendar??""),"schoolday-calendars",e=>this._setDraft(s,"exams_calendar",e))}
            </div>
            <div class="row">
            ${this._entityField(`homeworklist-${s}`,Fe(this.hass,"admin.homework_list"),"todo",this._draft(s,"homework_list",t?.homeworkList??""),"schoolday-todos",e=>this._setDraft(s,"homework_list",e))}
            </div>
          </details>
          <div class="row">
            ${this._entityField(`avatar-${s}`,Fe(this.hass,"admin.avatar"),"person",this._draft(s,"avatar",t?.avatar??""),"schoolday-people",e=>this._setDraft(s,"avatar",e),!0)}
          </div>
          <div class="row">
            <label class="field">
              <span class="label">${Fe(this.hass,"admin.travel")}</span>
              <input
                type="number"
                min="0"
                max="240"
                inputmode="numeric"
                id=${`travel-${s}`}
                .value=${null!=t?.travelMinutes?String(t.travelMinutes):""}
              />
            </label>
            <div class="notice quiet grow">${Fe(this.hass,"admin.travel_hint")}</div>
          </div>
          <div class="row">
            <label class="field">
              <span class="label">${Fe(this.hass,"admin.leave_time")}</span>
              <input
                type="time"
                id=${`leave-${s}`}
                .value=${t?.leaveTime??""}
              />
            </label>
            <label class="field">
              <span class="label">${Fe(this.hass,"admin.care_leave_time")}</span>
              <input
                type="time"
                id=${`careleave-${s}`}
                .value=${t?.careLeaveTime??""}
              />
            </label>
            <div class="notice quiet grow">${Fe(this.hass,"admin.leave_time_hint")}</div>
          </div>
          ${Object.keys(e.schedules).length?K`
                <div class="row">
                  <label class="field grow">
                    <span class="label">${Fe(this.hass,"admin.schedule")}</span>
                    <select id=${`schedule-${s}`}>
                      <option value="" ?selected=${!t?.schedule}>
                        ${Fe(this.hass,"admin.schedule_default")}
                      </option>
                      ${Object.keys(e.schedules).map(e=>K`
                          <option value=${e} ?selected=${t?.schedule===e}>
                            ${e}
                          </option>
                        `)}
                    </select>
                  </label>
                </div>
              `:Z}
          <div class="row">
            <button
              class="apply"
              ?disabled=${this._busy}
              @click=${e=>{const i=e.target.closest(".member"),a=e=>i.querySelector(`#${e}-${s}`)?.value??"";this._call("set_member",{...t?{member:t.id}:{},name:a("name"),color:a("color"),calendar:this._draft(s,"calendar",t?.calendar??""),lessons_calendar:this._draft(s,"lessons_calendar",t?.lessonsCalendar??""),exams_calendar:this._draft(s,"exams_calendar",t?.examsCalendar??""),homework_list:this._draft(s,"homework_list",t?.homeworkList??""),avatar:this._draft(s,"avatar",t?.avatar??""),schedule:a("schedule"),...""!==a("travel").trim()?{travel_minutes:Number(a("travel"))}:{},leave_time:a("leave"),care_leave_time:a("careleave")}).then(()=>{this._drafts={}})}}
            >
              ${Fe(this.hass,t?"admin.save":"admin.add")}
            </button>
            ${t?K`
                  <button
                    class="danger"
                    ?disabled=${this._busy}
                    @click=${()=>{confirm(Fe(this.hass,"admin.remove_confirm",{name:t.name}))&&this._call("remove_member",{member:t.id})}}
                  >
                    ${Fe(this.hass,"admin.remove")}
                  </button>
                `:Z}
          </div>
        </div>
      `};return K`
      <datalist id="schoolday-calendars">
        ${t.map(e=>K`<option value=${e}></option>`)}
      </datalist>
      <datalist id="schoolday-people">
        ${s.map(e=>K`<option value=${e}></option>`)}
      </datalist>
      <datalist id="schoolday-todos">
        ${a.map(e=>K`<option value=${e}></option>`)}
      </datalist>
      <div class="notice quiet">${Fe(this.hass,"admin.avatar_hint")}</div>
      ${e.members.map(e=>n(e))}
      <div class="sub-head">${Fe(this.hass,"admin.add_member")}</div>
      ${n(null)}
    `}_renderSubjects(e){const t=Object.keys(this._board?.timetable?.subjects??{}).sort();return t.length?K`
      <div class="notice quiet">${Fe(this.hass,"admin.colors_hint")}</div>
      <div class="subjects">
        ${t.map(t=>{const s=this._board?.timetable?.subjects[t]??"#888888",i=t in e.colors;return K`
            <div class="subject-row">
              <input
                type="color"
                .value=${s}
                @change=${e=>this._call("set_subject_color",{subject:t,color:e.target.value})}
              />
              <span class="name"><bdi>${t}</bdi></span>
              ${i?K`
                    <button
                      class="link"
                      ?disabled=${this._busy}
                      @click=${()=>this._call("set_subject_color",{subject:t})}
                    >
                      ${Fe(this.hass,"admin.reset_color")}
                    </button>
                  `:Z}
            </div>
          `})}
      </div>
    `:K`<div class="notice">${Fe(this.hass,"admin.no_subjects")}</div>`}_renderMaterials(e){const t=e.subjects.length?e.subjects:Object.keys(this._board?.timetable?.subjects??{}).sort();return t.length?K`
      <div class="notice quiet">${Fe(this.hass,"admin.materials_hint")}</div>
      ${t.map(t=>this._lines(t,function(e,t){const s=t.toLowerCase(),i=Object.entries(e.materials).find(([e])=>e.toLowerCase()===s);return i?i[1]:[]}(e,t),Fe(this.hass,"admin.materials_items"),e=>this._call("set_materials",{subject:t,items:e})))}
    `:K`<div class="notice">${Fe(this.hass,"admin.no_subjects")}</div>`}static _todayKey(){const e=new Date,t=String(e.getMonth()+1).padStart(2,"0");return`${e.getFullYear()}-${t}-${String(e.getDate()).padStart(2,"0")}`}_renderExceptions(e){const t=this._selected(e),s=this._board?.timetable,i=s?Se(s,t?.schedule??null):void 0;if(!t)return K`<div class="notice">${Fe(this.hass,"admin.no_members")}</div>`;if(!i?.periods.length)return K`<div class="notice">${Fe(this.hass,"admin.periods_first")}</div>`;const a=rt._todayKey(),n=e.exceptions[t.id]??{},o=this._exceptionDate||a,r=n[o],d=Ae(Ue(this.hass,t.id)),l=(new Date(`${o}T00:00:00`).getDay()+6)%7;return K`
      <div class="notice quiet">${Fe(this.hass,"admin.exceptions_hint")}</div>
      ${this._memberChips(e,t)}

      <div class="row">
        <label class="field grow">
          <span class="label">${Fe(this.hass,"admin.exception_date")}</span>
          <input
            type="date"
            min=${a}
            .value=${o}
            @change=${e=>{this._exceptionDate=e.target.value}}
          />
        </label>
        ${Object.keys(n).length?K`<div class="chips">
              ${Object.keys(n).sort().map(e=>K`
                    <button
                      class="chip ${e===o?"on":""}"
                      @click=${()=>{this._exceptionDate=e}}
                    >
                      ${e.slice(8)}.${e.slice(5,7)}.
                    </button>
                  `)}
            </div>`:Z}
      </div>

      <label class="field">
        <span class="label">${Fe(this.hass,"admin.exception_label")}</span>
        <input
          id="exception-label"
          placeholder=${Fe(this.hass,"admin.exception_label_hint")}
          .value=${r?.label??""}
        />
        <button
          class="apply"
          ?disabled=${this._busy}
          @click=${e=>{const s=e.target.closest(".field"),i=s?.querySelector("input");this._call("set_exception",{member:t.id,date:o,label:i?.value??""})}}
        >
          ${Fe(this.hass,"admin.save")}
        </button>
      </label>

      ${r?.label?Z:K`
            <div class="exception-periods">
              ${i.periods.map(e=>{const s=r?.periods?.[String(e.index)],i=!!r&&String(e.index)in r.periods,a=Le(d,l,e.index),n=i?s?.subject??null:a?.subject??null;return K`
                  <div class="exception-row">
                    <span class="no">${e.index}</span>
                    <span class="planned ${i&&!s?"gone":""}">
                      ${n??"—"}
                    </span>
                    <input
                      class="replacement"
                      placeholder=${Fe(this.hass,"admin.subject")}
                      .value=${s?.subject??""}
                      @change=${s=>this._call("set_exception",{member:t.id,date:o,period:e.index,subject:s.target.value})}
                    />
                    <button
                      class="link ${i&&!s?"on":""}"
                      ?disabled=${this._busy||!a}
                      @click=${()=>this._call("set_exception",{member:t.id,date:o,period:e.index,cancelled:!(i&&!s)})}
                    >
                      ${Fe(this.hass,"admin.exception_cancel")}
                    </button>
                  </div>
                `})}
            </div>
          `}
      ${r?K`<button
            class="link"
            ?disabled=${this._busy}
            @click=${()=>this._call("clear_exception",{member:t.id,date:o})}
          >
            ${Fe(this.hass,"admin.exception_reset")}
          </button>`:K`<div class="notice quiet">${Fe(this.hass,"admin.exception_none")}</div>`}
    `}_renderHolidays(e){const t=at(this.hass);return K`
      <div class="notice quiet">${Fe(this.hass,"admin.calendars_hint")}</div>
      <datalist id="schoolday-calendars">
        ${t.map(e=>K`<option value=${e}></option>`)}
      </datalist>
      ${this._entitiesField(Fe(this.hass,"admin.school_calendars"),"calendar",e.schoolCalendars,"calendar.schulferien",e=>this._call("set_calendars",{school_calendars:e}))}
      ${this._lines(Fe(this.hass,"admin.care_keywords"),e.careKeywords,Fe(this.hass,"admin.care_hint"),e=>this._call("set_calendars",{care_keywords:e}))}
      ${e.members.some(e=>e.lessonsCalendar)?K`
            <details class="more">
              <summary>${Fe(this.hass,"admin.school_words")}</summary>
              <div class="notice quiet">${Fe(this.hass,"admin.school_words_hint")}</div>
              ${this._lines(Fe(this.hass,"admin.cancel_keywords"),e.cancelKeywords,Fe(this.hass,"admin.cancel_hint"),e=>this._call("set_calendars",{cancel_keywords:e}))}
              ${this._lines(Fe(this.hass,"admin.substitute_keywords"),e.substituteKeywords,Fe(this.hass,"admin.substitute_hint"),e=>this._call("set_calendars",{substitute_keywords:e}))}
            </details>
          `:Z}
    `}willUpdate(){this.dir=Be(this.hass)?"rtl":""}render(){if(!this.hass)return K`<ha-card></ha-card>`;if(!this._board)return K`<ha-card><div class="notice">${Fe(this.hass,"board.missing")}</div></ha-card>`;const e=this._admin();return K`
      <ha-card>
        <div class="tabs">
          ${dt.map(e=>K`
              <button
                class="tab ${e===this._section?"on":""}"
                @click=${()=>{this._section=e,this._cell=void 0,this._error=void 0}}
              >
                ${Fe(this.hass,`admin.tab_${e}`)}
              </button>
            `)}
        </div>
        ${this._error?K`<div class="notice error">${this._error}</div>`:Z}
        <div class="body">
          ${"timetable"===this._section?this._renderTimetable(e):"routines"===this._section?this._renderRoutines(e):"family"===this._section?this._renderFamily(e):"subjects"===this._section?this._renderSubjects(e):"materials"===this._section?this._renderMaterials(e):"exceptions"===this._section?this._renderExceptions(e):this._renderHolidays(e)}
        </div>
      </ha-card>
    `}};ht.styles=[nt,ot,d`
      :host {
        display: block;
      }

      ha-card {
        padding: 12px;
      }

      .tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 12px;
      }

      .tab,
      .chip {
        min-height: var(--schoolday-touch);
        padding: 6px 12px;
        border-radius: 999px;
        background: var(--schoolday-surface-alt);
        font-size: 0.9rem;
      }

      .tab.on {
        background: var(--schoolday-today);
        color: var(--text-primary-color, #fff);
        font-weight: 700;
      }

      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin: 8px 0;
      }

      .chip.on {
        background: color-mix(in srgb, var(--member-color, var(--schoolday-today)) 30%, transparent);
        font-weight: 700;
      }

      .body {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .field.grow {
        flex: 1;
        min-width: 0;
      }

      .label {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--schoolday-muted);
      }

      input,
      textarea {
        font: inherit;
        color: inherit;
        min-height: var(--schoolday-touch);
        padding: 6px 10px;
        box-sizing: border-box;
        border-radius: 8px;
        border: 1px solid var(--schoolday-line);
        background: var(--schoolday-surface);
      }

      input[type='color'] {
        width: 56px;
        padding: 2px;
      }

      textarea {
        resize: vertical;
        line-height: 1.5;
      }

      .cycle {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        gap: 12px;
        margin-bottom: 10px;
      }

      .cycle .field {
        max-width: 160px;
      }

      .week-pick {
        margin-bottom: 8px;
      }

      .row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: flex-end;
      }

      /* One row per period: what the timetable says, what runs instead, and the way
         to say it does not run at all. Three columns rather than a dialog, because
         a substitution is usually one word and should cost one tap. */
      .exception-periods {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin: 8px 0;
      }

      .exception-row {
        display: grid;
        grid-template-columns: 2ch minmax(0, 1fr) minmax(0, 1fr) max-content;
        align-items: center;
        gap: 8px;
      }

      .exception-row .planned {
        color: var(--schoolday-muted);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .exception-row .planned.gone {
        text-decoration: line-through;
      }

      .exception-row .link.on {
        color: var(--error-color, #d33);
        font-weight: 700;
      }

      .apply,
      .danger,
      .link {
        align-self: flex-start;
        min-height: var(--schoolday-touch);
        padding: 6px 14px;
        border-radius: 8px;
        font-weight: 700;
        background: var(--schoolday-surface-alt);
      }

      .apply {
        background: color-mix(in srgb, var(--schoolday-today) 25%, transparent);
      }

      .danger {
        color: var(--error-color, #d33);
      }

      .link {
        background: none;
        font-weight: 400;
        text-decoration: underline;
        color: var(--schoolday-muted);
      }

      button[disabled] {
        opacity: 0.5;
      }

      .week {
        display: grid;
        row-gap: 4px;
        column-gap: 8px;
        align-items: stretch;
      }

      .head {
        text-align: center;
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--schoolday-muted);
      }

      .no {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-inline-end: 4px;
        font-weight: 700;
        color: var(--schoolday-muted);
      }

      .slot {
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: var(--schoolday-touch);
        padding: 4px 8px;
        overflow: hidden;
        border-radius: 8px;
        border: 1px dashed var(--schoolday-line);
        background: none;
        color: var(--schoolday-muted);
        font-size: 0.9rem;
      }

      .slot.filled {
        border: none;
        border-inline-start: 3px solid var(--subject);
        background: color-mix(in srgb, var(--subject) 22%, transparent);
        color: inherit;
        font-weight: 700;
      }

      .slot.open {
        outline: 2px solid var(--schoolday-today);
      }

      .slot .room {
        font-size: 0.75rem;
        font-weight: 400;
        color: var(--schoolday-muted);
      }

      .editor,
      .member {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 10px;
        border-radius: 10px;
        background: var(--schoolday-surface-alt);
        border-inline-start: 3px solid var(--member-color, var(--schoolday-today));
      }

      .editor-head,
      .sub-head {
        font-weight: 700;
      }

      .subjects {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .subject-row {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .subject-row .name {
        flex: 1;
        font-weight: 700;
      }

      .notice {
        padding: 10px;
        border-radius: 10px;
        background: var(--schoolday-surface-alt);
        color: var(--schoolday-muted);
      }

      .notice.quiet {
        font-size: 0.85rem;
      }

      /* What most households never need stays folded away, so the form reads as
         short as it is for them. */
      .more > summary {
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--schoolday-muted);
        padding: 4px 0;
      }

      .more > * + * {
        margin-top: 8px;
      }

      .notice.error {
        color: var(--error-color, #d33);
        background: color-mix(in srgb, var(--error-color, #d33) 12%, transparent);
      }
    `],s([pe({attribute:!1})],ht.prototype,"hass",void 0),s([be()],ht.prototype,"_config",void 0),s([be()],ht.prototype,"_section",void 0),s([be()],ht.prototype,"_memberId",void 0),s([be()],ht.prototype,"_block",void 0),s([be()],ht.prototype,"_routineDay",void 0),s([be()],ht.prototype,"_exceptionDate",void 0),s([be()],ht.prototype,"_week",void 0),s([be()],ht.prototype,"_cell",void 0),s([be()],ht.prototype,"_adding",void 0),s([be()],ht.prototype,"_draftSubject",void 0),s([be()],ht.prototype,"_draftRoom",void 0),s([be()],ht.prototype,"_drafts",void 0),s([be()],ht.prototype,"_busy",void 0),s([be()],ht.prototype,"_error",void 0),ht=rt=s([he("schoolday-admin-card")],ht),window.customCards=window.customCards??[],window.customCards.push({type:"schoolday-admin-card",name:"Schoolday Admin",description:"Edit the timetable, routines, family and holidays from the dashboard.",preview:!1,documentationURL:"https://github.com/DomCim/HA-Schoolday"});let mt=class extends le{constructor(){super(...arguments),this._config={type:""},this._now=new Date}static async getConfigElement(){return document.createElement("schoolday-header-card-editor")}static getStubConfig(){return{show_seconds:!1,show_leave:!0}}setConfig(e){this._config={...e}}getCardSize(){return 2}getGridOptions(){return{columns:"full",rows:"auto"}}connectedCallback(){super.connectedCallback();const e=this._config.show_seconds?1e3:2e4;this._timer=window.setInterval(()=>{this._now=new Date},e)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&(window.clearInterval(this._timer),this._timer=void 0)}_weather(){const e=this._config.weather_entity;if(!e)return Z;const t=this.hass.states[e];if(!t)return Z;const s=t.attributes?.temperature,i=t.attributes?.temperature_unit??"",a=this.hass.formatEntityState(t);return K`
      <div class="weather">
        <div class="temperature">
          ${"number"==typeof s?`${Math.round(s)}${i}`:"—"}
        </div>
        <div class="condition">${a}</div>
      </div>
    `}_leaving(){if(!1===this._config.show_leave)return Z;const e=Oe(this.hass);if(!e)return Z;const t=this._now,s=t.toDateString(),i=e.members.flatMap(e=>{const i=Ue(this.hass,e.id)?.attributes??{},a=i.leave_at,n=i.leave_until,o=i.school_start;if("string"!=typeof a)return[];const r=new Date(a);if(Number.isNaN(r.getTime())||r.toDateString()!==s)return[];let d="string"==typeof n?new Date(n):null;if(!d&&"string"==typeof o){const[e,t]=o.split(":").map(Number);d=new Date(r),d.setHours(e,t,0,0)}if(!d||Number.isNaN(d.getTime())||t>=d)return[];const l=Math.ceil((r.getTime()-t.getTime())/6e4),c=l<=0?Fe(this.hass,"header.leave_now"):l<=60?Fe(this.hass,"header.leave_in",{minutes:l}):Fe(this.hass,"header.leave_at",{time:new Intl.DateTimeFormat(_e(this.hass),{hour:"2-digit",minute:"2-digit",hour12:ge(this.hass)}).format(r)});return[K`
          <div class=${`leave ${l<=0?"go":l<=10?"soon":""}`} style=${`--member-color:${e.color}`}>
            <span class="dot"></span>
            <span class="who"><bdi>${e.name}</bdi></span>
            <span class="when">${c}</span>
          </div>
        `]});return i.length?K`<div class="leaving">${i}</div>`:Z}willUpdate(){this.dir=Be(this.hass)?"rtl":""}render(){if(!this.hass)return K`<ha-card></ha-card>`;const e=_e(this.hass),t=new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit",...this._config.show_seconds?{second:"2-digit"}:{},hour12:ge(this.hass)}).format(this._now),s=new Intl.DateTimeFormat(e,{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(this._now);return K`
      <ha-card>
        <div class="bar">
          <div class="left">
            <div class="clock">${t}</div>
            <div class="date">${s}</div>
            ${this._config.greeting?K`<div class="greeting">${this._config.greeting}</div>`:Z}
          </div>
          ${this._weather()}
        </div>
        ${this._leaving()}
      </ha-card>
    `}};var ut;mt.styles=[nt,d`
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
        color: var(--schoolday-muted);
      }

      .weather {
        text-align: end;
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
        color: var(--schoolday-muted);
      }

      .leaving {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 20px;
        margin-top: 12px;
      }

      .leave {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.15rem;
        font-variant-numeric: tabular-nums;
      }

      .leave .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--member-color);
      }

      .leave .who {
        font-weight: 700;
      }

      .leave.soon .when {
        color: var(--warning-color, #f4a100);
        font-weight: 700;
      }

      .leave.go .when {
        color: var(--error-color, #db4437);
        font-weight: 700;
      }
    `],s([pe({attribute:!1})],mt.prototype,"hass",void 0),s([be()],mt.prototype,"_config",void 0),s([be()],mt.prototype,"_now",void 0),mt=s([he("schoolday-header-card")],mt),window.customCards=window.customCards||[],window.customCards.push({type:"schoolday-header-card",name:"Schoolday Header",description:"Clock, date and weather, sized to be read from across the room.",preview:!0,documentationURL:"https://github.com/DomCim/HA-Schoolday"});const pt=["overdue","today","tomorrow","later","someday"],bt="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",gt="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z";let _t=ut=class extends le{constructor(){super(...arguments),this._config={type:""},this._pending=new Set}static async getConfigElement(){return document.createElement("schoolday-homework-card-editor")}static getStubConfig(){return{}}setConfig(e){this._config={...e}}getCardSize(){return 6}getGridOptions(){return{columns:"full",rows:"auto"}}_list(e){return Object.values(this.hass.states).find(t=>t.entity_id.startsWith("todo.")&&t.attributes?.member_id===e)}_items(e){const t=this._list(e)?.attributes?.homework;return Array.isArray(t)?t.filter(e=>Boolean(e)&&"object"==typeof e).map(e=>({uid:String(e.uid??""),summary:String(e.summary??""),due:"string"==typeof e.due&&e.due?e.due:null,done:Boolean(e.done)})).filter(e=>e.uid&&e.summary):[]}static _bucket(e,t){if(!e)return"someday";if(e<t)return"overdue";if(e===t)return"today";const s=new Date(`${t}T00:00:00`);return s.setDate(s.getDate()+1),e===De(s)?"tomorrow":"later"}_dueLabel(e){if(!e)return null;const[t,s,i]=e.split("-").map(Number);return new Intl.DateTimeFormat(_e(this.hass),{weekday:"short",day:"numeric",month:"numeric"}).format(new Date(t,s-1,i))}async _toggle(e,t){const s=this._list(e);if(s){this._pending=new Set(this._pending).add(t.uid);try{await this.hass.callService("todo","update_item",{entity_id:s.entity_id,item:t.uid,status:t.done?"needs_action":"completed"})}catch(e){console.warn("[schoolday] could not update homework",e)}finally{const e=new Set(this._pending);e.delete(t.uid),this._pending=e}}}_icon(e,t=""){return K`<svg class=${t} viewBox="0 0 24 24"><path d=${e} /></svg>`}_renderItem(e,t,s){const i=this._pending.has(t.uid),a=i?!t.done:t.done,n="today"===s||"tomorrow"===s?null:this._dueLabel(t.due);return K`
      <button
        class="item ${a?"done":""} ${i?"pending":""}"
        @click=${()=>this._toggle(e.id,t)}
      >
        ${this._icon(a?gt:bt,"tick")}
        <span class="label"><bdi>${t.summary}</bdi></span>
        ${n?K`<span class="due">${n}</span>`:Z}
      </button>
    `}willUpdate(){this.dir=Be(this.hass)?"rtl":""}render(){if(!this.hass)return K`<ha-card></ha-card>`;const e=Oe(this.hass,this._config.board_entity);if(!e)return K`<ha-card><div class="notice">${Fe(this.hass,"board.missing")}</div></ha-card>`;const t=(this._config.members??(this._config.member?[this._config.member]:[])).map(e=>e.toLowerCase()),s=!0===this._config.show_done,i=De(),a=e.members.filter(e=>!t.length||t.includes(e.id.toLowerCase())||t.includes(e.name.toLowerCase())).map(e=>({member:e,items:this._items(e.id).filter(e=>s||!e.done)})).filter(e=>!0===this._config.show_empty||e.items.length>0);return a.length?K`
      <ha-card>
        <div class="grid">
          ${a.map(({member:e,items:t})=>K`
              <div class="person" style=${`--member-color:${e.color}`}>
                <div class="person-name">
                  ${Me(this.hass,e.avatar)?K`<img class="avatar" src=${Me(this.hass,e.avatar)} alt="" />`:Z}
                  <span><bdi>${e.name}</bdi></span>
                  <span class="count">${t.filter(e=>!e.done).length}</span>
                </div>
                ${0===t.length?K`<div class="empty">${Fe(this.hass,"homework.nothing")}</div>`:pt.map(s=>{const a=t.filter(e=>ut._bucket(e.due,i)===s);return a.length?K`
                        <div class="bucket ${s}">
                          <div class="bucket-head">${Fe(this.hass,`homework.${s}`)}</div>
                          ${a.map(t=>this._renderItem(e,t,s))}
                        </div>
                      `:Z})}
              </div>
            `)}
        </div>
      </ha-card>
    `:K`
        <ha-card><div class="notice">${Fe(this.hass,"homework.all_done")}</div></ha-card>
      `}};_t.styles=[nt,ot,d`
      ha-card {
        padding: 12px;
        box-sizing: border-box;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: var(--schoolday-gap);
      }

      .person {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        border-radius: var(--schoolday-radius);
        background: color-mix(in srgb, var(--member-color) 10%, transparent);
        border-top: 3px solid var(--member-color);
      }

      .person-name {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.15rem;
        font-weight: 700;
      }

      .person-name .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--member-color);
      }

      /* How much is left, where the eye lands first — the number is the whole point
         of walking past this card. */
      .count {
        margin-inline-start: auto;
        min-width: 26px;
        padding: 1px 8px;
        border-radius: 12px;
        background: var(--member-color);
        color: var(--text-primary-color, #fff);
        font-size: 0.85rem;
        font-variant-numeric: tabular-nums;
        text-align: center;
      }

      .bucket-head {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--schoolday-muted);
        margin-bottom: 2px;
      }

      /* Late work is the one thing on this card that is not merely information. */
      .bucket.overdue .bucket-head {
        color: var(--error-color, #d33);
      }

      .item {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        min-height: calc(var(--schoolday-touch) + 4px);
        padding: 4px 8px;
        margin-bottom: 2px;
        box-sizing: border-box;
        border-radius: 8px;
        text-align: start;
        font-size: 1rem;
        background: color-mix(in srgb, var(--member-color) 20%, var(--schoolday-surface));
      }

      .bucket.overdue .item {
        background: color-mix(in srgb, var(--error-color, #d33) 16%, var(--schoolday-surface));
      }

      .item:active {
        background: color-mix(in srgb, var(--member-color) 32%, var(--schoolday-surface));
      }

      .item .tick {
        width: 26px;
        height: 26px;
        flex: none;
        fill: var(--schoolday-muted);
        transition: fill 140ms ease;
      }

      .item.done .tick {
        fill: var(--member-color);
      }

      .item.done .label {
        text-decoration: line-through;
        color: var(--schoolday-muted);
      }

      .item.pending {
        opacity: 0.65;
      }

      .label {
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .due {
        flex: none;
        margin-inline-start: auto;
        color: var(--schoolday-muted);
        font-size: 0.75rem;
        white-space: nowrap;
      }

      .empty,
      .notice {
        padding: 8px 2px;
        color: var(--schoolday-muted);
        font-size: 0.9rem;
      }
    `],s([pe({attribute:!1})],_t.prototype,"hass",void 0),s([be()],_t.prototype,"_config",void 0),s([be()],_t.prototype,"_pending",void 0),_t=ut=s([he("schoolday-homework-card")],_t),window.customCards=window.customCards||[],window.customCards.push({type:"schoolday-homework-card",name:"Schoolday Homework",description:"What each child still has to do, grouped by when it is due.",preview:!0,documentationURL:"https://github.com/DomCim/HA-Schoolday"});const yt={morning:"M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z",evening:"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95Z"},ft={unchecked:"M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",checked:"M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z",...yt};let vt=class extends le{constructor(){super(...arguments),this._config={type:""},this._pending=new Set}static async getConfigElement(){return document.createElement("schoolday-routines-card-editor")}static getStubConfig(){return{block:"auto",evening_from:14}}setConfig(e){this._config={...e}}getCardSize(){return 6}getGridOptions(){return{columns:"full",rows:"auto"}}get _blocks(){const e=this._config.block??"auto";if("morning"===e||"evening"===e)return[e];if("both"===e)return["morning","evening"];const t=this._config.evening_from??14;return[(new Date).getHours()<t?"morning":"evening"]}_steps(e,t){const s=Ue(this.hass,e.id),i=s?.attributes?.[`routine_${t}`];return Array.isArray(i)?i.filter(e=>Boolean(e)&&"object"==typeof e).map(e=>({step:String(e.step??""),done:Boolean(e.done),..."string"==typeof e.subject&&e.subject?{subject:e.subject}:{}})):[]}_examsTomorrow(e){const t=Ue(this.hass,e.id)?.attributes?.tomorrow_exams;return Array.isArray(t)?t.filter(e=>"string"==typeof e&&""!==e):[]}_isSick(e){return"sick"===Ue(this.hass,e.id)?.attributes?.day_mode}async _toggle(e,t,s){const i=`${e.id}|${t}|${s.step}`;this._pending=new Set(this._pending).add(i);try{await this.hass.callService("schoolday","set_routine_step",{member:e.id,block:t,step:s.step,done:!s.done})}catch(e){console.warn("[schoolday] could not update routine step",e)}finally{const e=new Set(this._pending);e.delete(i),this._pending=e}}_icon(e,t=""){return K`<svg class=${t} viewBox="0 0 24 24"><path d=${e} /></svg>`}_renderBlock(e,t){const s=this._steps(e,t),i=s.filter(e=>e.done).length,a=s.length>0&&i===s.length,n="evening"===t?this._examsTomorrow(e):[];return K`
      <section class="block ${a?"complete":""}">
        <header class="block-head">
          ${this._icon("morning"===t?ft.morning:ft.evening,"block-icon")}
          <span class="progress">${i}/${s.length}</span>
        </header>

        ${n.map(e=>K`<div class="exam-note">
            <span class="exam-label">${Fe(this.hass,"routines.exam_tomorrow")}</span>
            <span>${e}</span>
          </div>`)}
        ${0===s.length&&n.length?Z:0===s.length?K`<div class="empty">${Fe(this.hass,"routines.nothing_today")}</div>`:K`
              <div class="bar">
                <div
                  class="bar-fill"
                  style=${`width:${s.length?i/s.length*100:0}%`}
                ></div>
              </div>
              ${s.map(s=>{const i=`${e.id}|${t}|${s.step}`,a=this._pending.has(i),n=a?!s.done:s.done;return K`
                  <button
                    class="step ${n?"done":""} ${a?"pending":""}"
                    @click=${()=>this._toggle(e,t,s)}
                  >
                    ${this._icon(n?ft.checked:ft.unchecked,"tick")}
                    <span class="label"><bdi>${s.step}</bdi></span>
                    ${s.subject?K`<span
                          class="from"
                          title=${Fe(this.hass,"routines.packed_for",{subject:s.subject})}
                          ><bdi>${s.subject}</bdi></span
                        >`:Z}
                  </button>
                `})}
            `}
      </section>
    `}willUpdate(){this.dir=Be(this.hass)?"rtl":""}render(){if(!this.hass)return K`<ha-card></ha-card>`;const e=Oe(this.hass,this._config.board_entity);if(!e)return K`<ha-card
        ><div class="notice">${Fe(this.hass,"board.missing")}</div></ha-card
      >`;const t=this._blocks,s=(this._config.members??(this._config.member?[this._config.member]:[])).map(e=>e.toLowerCase()),i=e.members.filter(e=>!(s.length&&!s.includes(e.id.toLowerCase())&&!s.includes(e.name.toLowerCase()))&&(!0===this._config.show_empty||(!!this._isSick(e)||t.some(t=>this._steps(e,t).length>0||"evening"===t&&this._examsTomorrow(e).length>0))));return 0===i.length?K`
        <ha-card>
          <div class="notice">${Fe(this.hass,"routines.none_configured")}</div>
        </ha-card>
      `:K`
      <ha-card>
        <div class="grid">
          ${i.map(e=>K`
              <div
                class="person ${this._isSick(e)?"sick":""}"
                style=${`--member-color:${e.color}`}
              >
                <div class="person-name">
                  ${Me(this.hass,e.avatar)?K`<img class="avatar" src=${Me(this.hass,e.avatar)} alt="" />`:Z}
                  <span><bdi>${e.name}</bdi></span>
                </div>
                ${this._isSick(e)?K`<div class="sick-note">${Fe(this.hass,"routines.sick")}</div>`:t.map(t=>this._renderBlock(e,t))}
              </div>
            `)}
        </div>
      </ha-card>
    `}};vt.styles=[nt,ot,d`
      ha-card {
        padding: 12px;
        box-sizing: border-box;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: var(--schoolday-gap);
      }

      .person {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        border-radius: var(--schoolday-radius);
        background: color-mix(in srgb, var(--member-color) 10%, transparent);
        border-top: 3px solid var(--member-color);
      }

      .person-name {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.15rem;
        font-weight: 700;
      }

      .person-name .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--member-color);
      }

      .block-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--schoolday-muted);
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
        background: var(--schoolday-line);
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
        min-height: calc(var(--schoolday-touch) + 4px);
        padding: 4px 8px;
        margin-bottom: 2px;
        box-sizing: border-box;
        border-radius: 8px;
        text-align: start;
        font-size: 1rem;
        background: color-mix(in srgb, var(--member-color) 20%, var(--schoolday-surface));
      }

      .step:active {
        background: color-mix(in srgb, var(--member-color) 32%, var(--schoolday-surface));
      }

      .step .tick {
        width: 26px;
        height: 26px;
        flex: none;
        fill: var(--schoolday-muted);
        transition: fill 140ms ease;
      }

      .step.done .tick {
        fill: var(--member-color);
      }

      .step.done .label {
        text-decoration: line-through;
        color: var(--schoolday-muted);
      }

      .step.pending {
        opacity: 0.65;
      }

      .label {
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* The subject that put this step on the list. Quiet on purpose: it is the
         reason, not the instruction, and the instruction is what gets read. */
      .from {
        flex: none;
        margin-inline-start: auto;
        padding: 2px 8px;
        border-radius: 10px;
        background: color-mix(in srgb, var(--member-color) 26%, transparent);
        color: var(--schoolday-muted);
        font-size: 0.7rem;
        font-weight: 700;
        white-space: nowrap;
      }

      /* Tomorrow's exam, above the evening's steps. In the member's colour like the
         rest of their column, and without a tick box: it is something to know tonight,
         not something to get done. */
      .exam-note {
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin-bottom: 8px;
        padding: 8px 10px;
        border-radius: 10px;
        border-inline-start: 3px solid var(--member-color);
        background: color-mix(in srgb, var(--member-color) 16%, transparent);
        font-size: 0.9rem;
        font-weight: 600;
      }

      .exam-label {
        flex: none;
        color: var(--schoolday-muted);
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      /* Ill is drawn as a day that is not happening rather than as an empty list:
         a child in bed still has a place on the board. */
      .person.sick {
        background: var(--schoolday-surface-alt);
        border-top-color: var(--schoolday-line);
      }

      .person.sick .person-name {
        color: var(--schoolday-muted);
      }

      .sick-note {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: var(--schoolday-touch);
        border-radius: 10px;
        border-inline-start: 3px solid var(--schoolday-sick);
        background: color-mix(in srgb, var(--schoolday-sick) 22%, transparent);
        color: var(--primary-text-color);
        font-size: 0.85rem;
        font-weight: 700;
      }

      .empty,
      .notice {
        padding: 8px 2px;
        color: var(--schoolday-muted);
        font-size: 0.9rem;
      }
    `],s([pe({attribute:!1})],vt.prototype,"hass",void 0),s([be()],vt.prototype,"_config",void 0),s([be()],vt.prototype,"_pending",void 0),vt=s([he("schoolday-routines-card")],vt),window.customCards=window.customCards||[],window.customCards.push({type:"schoolday-routines-card",name:"Schoolday Routines",description:"Daily routines per child and weekday, ticked off by the kids themselves.",preview:!0,documentationURL:"https://github.com/DomCim/HA-Schoolday"});const wt="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M16.53,11.06L15.47,10L10.59,14.88L8.47,12.76L7.41,13.82L10.59,17L16.53,11.06Z";let $t=class extends le{constructor(){super(...arguments),this._config={type:""}}static async getConfigElement(){return document.createElement("schoolday-stats-card-editor")}static getStubConfig(){return{days:30,show_steps:!0}}setConfig(e){this._config={...e}}getCardSize(){return 6}getGridOptions(){return{columns:"full",rows:"auto"}}_stats(e){const t=Ue(this.hass,e.id)?.attributes?.routine_stats;if(!t||"object"!=typeof t)return null;const s=t;return{date:String(s.date??""),rate:"number"==typeof s.rate?s.rate:null,streak:Number(s.streak??0),best_streak:Number(s.best_streak??0),blocks:s.blocks??{},steps:Array.isArray(s.steps)?s.steps:[],days:Array.isArray(s.days)?s.days:[]}}_window(e){const t=Number(this._config.days),s=Number.isFinite(t)?Math.max(7,t):30;return e.days.slice(-s)}_percent(e){return null===e?"—":Fe(this.hass,"stats.percent",{value:e})}_icon(e,t=""){return K`<svg class=${t} viewBox="0 0 24 24"><path d=${e} /></svg>`}_dayTitle(e){const t=new Date(`${e.date}T12:00:00`).toLocaleDateString(_e(this.hass),{weekday:"short",day:"numeric",month:"short"});return"sick"===e.mode?`${t} — ${Fe(this.hass,"routines.sick")}`:e.asked?`${t} — ${Fe(this.hass,"stats.day_done",{done:e.done,asked:e.asked})}`:`${t} — ${Fe(this.hass,"stats.nothing_asked")}`}_renderStrip(e){const t=this._window(e),s=e=>e?new Date(`${e.date}T12:00:00`).toLocaleDateString(_e(this.hass),{day:"numeric",month:"short"}):"";return K`
      <div class="strip">
        ${t.map(t=>{const s=t.asked?t.done/t.asked:0,i=t.date===e.date;return K`
            <div
              class="day ${t.asked?"":"empty"} ${"sick"===t.mode?"sick":""} ${i?"today":""}"
              title=${this._dayTitle(t)}
            >
              <i style=${`height:${t.asked?Math.max(100*s,4):0}%`}></i>
            </div>
          `})}
      </div>
      <div class="axis">
        <span>${s(t[0])}</span>
        <span>${s(t[t.length-1])}</span>
      </div>
    `}_renderBlock(e,t){const s=t?.rate??null;return K`
      <div class="row" title=${Fe(this.hass,`routines.${e}`)}>
        ${this._icon(yt[e],"row-icon")}
        <div class="meter">
          <div class="meter-fill" style=${`width:${s??0}%`}></div>
        </div>
        <span class="value">${this._percent(s)}</span>
      </div>
    `}_renderStep(e){const t=yt[e.block];return K`
      <div class="row step">
        ${t?this._icon(t,"row-icon"):Z}
        <span class="label" title=${e.step}><bdi>${e.step}</bdi></span>
        <div class="meter">
          <div class="meter-fill" style=${`width:${e.rate??0}%`}></div>
        </div>
        <span class="value">${e.done}/${e.asked}</span>
      </div>
    `}_renderStreak(e){return K`
      <div class="streak">
        ${e.best_streak>0?K`
              ${this._icon(wt,"streak-icon")}
              <span
                >${e.streak>0?Fe(this.hass,"stats.streak",{days:e.streak}):Fe(this.hass,"stats.best",{days:e.best_streak})}</span
              >
              ${e.streak>0&&e.best_streak>e.streak?K`<span class="best"
                    >${Fe(this.hass,"stats.best",{days:e.best_streak})}</span
                  >`:Z}
            `:Z}
      </div>
    `}_renderMember(e,t){const s=this._window(t).filter(e=>e.asked>0).length,i=!1!==this._config.show_steps&&t.steps.length>0;return K`
      <div class="person" style=${`--member-color:${e.color}`}>
        <div class="person-head">
          ${Me(this.hass,e.avatar)?K`<img class="avatar" src=${Me(this.hass,e.avatar)} alt="" />`:Z}
          <div class="who">
            <span class="name"><bdi>${e.name}</bdi></span>
            ${s>0?K`<span class="window"
                  >${Fe(this.hass,1===s?"stats.window_one":"stats.window",{days:s})}</span
                >`:Z}
          </div>
          <span class="rate">${this._percent(t.rate)}</span>
        </div>

        ${this._renderStreak(t)}

        ${0===s?K`<div class="empty-note">${Fe(this.hass,"stats.nothing_yet")}</div>`:K`
              ${this._renderStrip(t)}
              <div class="blocks">
                ${["morning","evening"].map(e=>this._renderBlock(e,t.blocks?.[e]))}
              </div>
              ${i?K`<div class="steps">${t.steps.map(e=>this._renderStep(e))}</div>`:Z}
            `}
      </div>
    `}willUpdate(){this.dir=Be(this.hass)?"rtl":""}render(){if(!this.hass)return K`<ha-card></ha-card>`;const e=Oe(this.hass,this._config.board_entity);if(!e)return K`<ha-card><div class="notice">${Fe(this.hass,"board.missing")}</div></ha-card>`;const t=(this._config.members??(this._config.member?[this._config.member]:[])).map(e=>e.toLowerCase()),s=e.members.filter(e=>!t.length||t.includes(e.id.toLowerCase())||t.includes(e.name.toLowerCase())).map(e=>({member:e,stats:this._stats(e)})).filter(e=>null!==e.stats&&e.stats.days.some(e=>e.asked>0));return"rate"===this._config.sort&&s.sort((e,t)=>(t.stats.rate??-1)-(e.stats.rate??-1)),0===s.length?K`
        <ha-card><div class="notice">${Fe(this.hass,"stats.none_configured")}</div></ha-card>
      `:K`
      <ha-card>
        <div class="grid">
          ${s.map(e=>this._renderMember(e.member,e.stats))}
        </div>
      </ha-card>
    `}};$t.styles=[nt,ot,d`
      ha-card {
        padding: 12px;
        box-sizing: border-box;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: var(--schoolday-gap);
      }

      .person {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
        border-radius: var(--schoolday-radius);
        background: color-mix(in srgb, var(--member-color) 10%, transparent);
        border-top: 3px solid var(--member-color);
      }

      .person-head {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--member-color);
      }

      .who {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      .name {
        font-size: 1.15rem;
        font-weight: 700;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* The window the figure covers, next to the figure itself. A rate with no period
         attached is not a fact, it is a mood. */
      .window {
        color: var(--schoolday-muted);
        font-size: 0.7rem;
      }

      /* The headline, and the only large number on the card. In ink rather than in the
         member's colour: the colour is already carrying who this is, and a number that
         changes hue with the child is a number that is hard to compare. */
      .rate {
        margin-inline-start: auto;
        font-size: 1.9rem;
        font-weight: 700;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }

      .streak {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: -4px;
        min-height: 18px;
        color: var(--schoolday-muted);
        font-size: 0.8rem;
        font-weight: 600;
      }

      .streak-icon {
        width: 16px;
        height: 16px;
        flex: none;
        fill: var(--member-color);
      }

      .streak .best {
        margin-inline-start: auto;
        font-weight: 400;
      }

      /* One column per day, magnitude by height. Anchored to a baseline that is drawn,
         so a day nobody did anything on is visibly a day rather than a gap. */
      .strip {
        display: flex;
        align-items: flex-end;
        gap: 2px;
        height: 56px;
        padding-bottom: 3px;
        border-bottom: 1px solid var(--schoolday-line);
      }

      .day {
        display: flex;
        align-items: flex-end;
        flex: 1 1 0;
        min-width: 3px;
        height: 100%;
        position: relative;
      }

      .day i {
        display: block;
        width: 100%;
        min-height: 2px;
        border-radius: 3px 3px 0 0;
        background: var(--member-color);
      }

      /* A day that asked for nothing — a holiday with no list — is a baseline tick and
         not a bar. Shape, not shade: it must not read as a day that went badly. */
      .day.empty i {
        height: 2px;
        background: var(--schoolday-line);
      }

      .day.sick i {
        height: 2px;
        background: var(--schoolday-sick);
      }

      /* Today is still running, so its bar is drawn as provisional rather than as a
         result: it is the one column that is expected to grow before bedtime. */
      .day.today i {
        opacity: 0.45;
      }

      .day.today::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -4px;
        height: 2px;
        border-radius: 1px;
        background: var(--member-color);
      }

      .axis {
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
        color: var(--schoolday-muted);
        font-size: 0.7rem;
      }

      .blocks,
      .steps {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .steps {
        padding-top: 8px;
        border-top: 1px solid var(--schoolday-line);
      }

      .row {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.85rem;
      }

      .row-icon {
        width: 16px;
        height: 16px;
        flex: none;
        fill: var(--schoolday-muted);
      }

      .row .label {
        flex: 1 1 40%;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .meter {
        flex: 1 1 40%;
        height: 6px;
        border-radius: 3px;
        background: var(--schoolday-line);
        overflow: hidden;
      }

      .meter-fill {
        height: 100%;
        border-radius: 3px;
        background: var(--member-color);
      }

      .value {
        flex: none;
        min-width: 3.2em;
        text-align: end;
        color: var(--schoolday-muted);
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }

      .empty-note,
      .notice {
        padding: 8px 2px;
        color: var(--schoolday-muted);
        font-size: 0.9rem;
      }
    `],s([pe({attribute:!1})],$t.prototype,"hass",void 0),s([be()],$t.prototype,"_config",void 0),$t=s([he("schoolday-stats-card")],$t),window.customCards=window.customCards||[],window.customCards.push({type:"schoolday-stats-card",name:"Schoolday Routine record",description:"How reliably each child gets through their routines, and which steps get skipped.",preview:!0,documentationURL:"https://github.com/DomCim/HA-Schoolday"});const xt=new Date(2024,0,1);let kt=class extends le{constructor(){super(...arguments),this._config={type:""},this._narrow=!1,this._tick=0}static async getConfigElement(){return document.createElement("schoolday-timetable-card-editor")}static getStubConfig(){return{layout:"auto",week_days:"auto"}}setConfig(e){this._config={...e}}getCardSize(){return 8}getGridOptions(){return{columns:"full",rows:"auto"}}connectedCallback(){super.connectedCallback(),this._resizeObserver=new ResizeObserver(([e])=>{this._narrow=e.contentRect.width<560}),this._resizeObserver.observe(this),this._timer=setInterval(()=>{this._tick+=1},3e4)}disconnectedCallback(){this._resizeObserver?.disconnect(),this._resizeObserver=void 0,this._timer&&(clearInterval(this._timer),this._timer=void 0),super.disconnectedCallback()}_candidates(e){const t=(this._config.members??(this._config.member?[this._config.member]:[])).map(e=>e.toLowerCase());return e.filter(e=>!t.length||t.includes(e.id.toLowerCase())||t.includes(e.name.toLowerCase())).map(e=>{const t=Ue(this.hass,e.id),s=t?.attributes?.schedule;return{member:e,week:Ae(t),outlook:ze(t),schedule:"string"==typeof s&&s?s:null}}).filter(e=>{return t=e.week,Object.values(t).some(e=>e.length>0);var t})}_weekdays(e){const t=this._config.week_days??"auto";if("week"===t)return[0,1,2,3,4,5,6];if("school"===t)return[0,1,2,3,4];const s=Object.keys(e).map(Number).filter(t=>(e[t]??[]).length>0).map(e=>e%7),i=Math.max(4,...s);return Array.from({length:i+1},(e,t)=>t)}_weekdayName(e,t){const s=new Date(xt);return s.setDate(s.getDate()+e),new Intl.DateTimeFormat(_e(this.hass),{weekday:t}).format(s)}_dayFor(e,t){return function(e,t,s){const i=e.filter(e=>e.weekday===t);if(!s)return i[0];const a=De();return i.find(e=>e.date>=a)??i[i.length-1]}(e,t,!1!==this._config.roll_days)}_columnDate(e,t){const s=function(e){if(!e)return null;const[t,s,i]=e.date.split("-").map(Number);return t&&s&&i?new Date(t,s-1,i):null}(this._dayFor(e,t));return s?new Intl.DateTimeFormat(_e(this.hass),{day:"numeric",month:"numeric"}).format(s):null}_closure(e,t){const s=this._dayFor(e,t);if(!s||"school"===s.mode)return null;const i={care:"timetable.care",sick:"timetable.sick",event:"timetable.event",free:"timetable.free"}[s.mode];return{mode:s.mode,label:("sick"===s.mode?null:s.label)??Fe(this.hass,i??"timetable.free")}}_closureRuns(e,t){const s=[];return t.forEach((t,i)=>{const a=this._closure(e,t),n=s[s.length-1];n&&n.closed?.mode===a?.mode&&n.closed?.label===a?.label&&null===n.closed==(null===a)?n.span+=1:s.push({start:i,span:1,closed:a})}),s}_color(e,t){return e.subjects[t]??"var(--schoolday-line)"}_columnLessons(e,t,s){return new Map(Ee(e,s,this._dayFor(t,s)).map(e=>[e.lesson.period,e]))}_renderChips(e,t){return e.length<2?Z:K`
      <div class="chips">
        ${e.map(({member:e})=>K`
            <button
              class="chip"
              style=${`--member-color:${e.color}`}
              aria-pressed=${e.id===t.id}
              @click=${()=>{this._memberId=e.id}}
            >
              <bdi>${e.name}</bdi>
            </button>
          `)}
      </div>
    `}_renderNoSchool(e){return K`
      <div class="status">
        <span class="pill closed">${Fe(this.hass,"timetable.no_school")}</span>
        ${e?K`<span class="status-text"><bdi>${e}</bdi></span>`:Z}
      </div>
    `}_renderStatus(e,t){if(!1===this._config.highlight)return Z;const s=ve(),i=Te(e,s),a=i?t.get(i.index)?.lesson:void 0;if(i&&a){const t=i.endMinutes-s;return K`
        <div class="status">
          <span class="pill" style=${`--subject:${this._color(e,a.subject)}`}
            >${Fe(this.hass,"timetable.now")}</span
          >
          <span class="status-text">
            <bdi>${a.subject}</bdi>${a.room?K` · <bdi>${a.room}</bdi>`:Z}
          </span>
          <span class="status-muted">${Fe(this.hass,"timetable.remaining",{minutes:t})}</span>
        </div>
      `}const n=e.periods.find(e=>e.startMinutes>s&&t.has(e.index));if(n){const e=t.get(n.index).lesson;return K`
        <div class="status">
          <span class="pill next">${Fe(this.hass,"timetable.next")}</span>
          <span class="status-text">
            <bdi>${e.subject}</bdi>${e.room?K` · <bdi>${e.room}</bdi>`:Z}
          </span>
          <span class="status-muted">${we(this.hass,n.start)}</span>
        </div>
      `}return t.size?K`<div class="status">
        <span class="status-muted">${Fe(this.hass,"timetable.done_for_today")}</span>
      </div>`:Z}_renderCell(e,t,s,i,a,n){if(!t)return K`<div class="cell free ${s?"now":""}" style=${a}></div>`;const{lesson:o,changed:r}=t,d=!1!==this._config.show_rooms&&o.room,l=Fe(this.hass,"timetable.exam");return K`
      <div
        class="cell ${s?"now":""} ${r?"changed":""} ${n?"exam":""}"
        style=${`--subject:${this._color(e,o.subject)};${a}`}
        title=${`${o.room?`${o.subject} · ${o.room}`:o.subject}${r?` · ${Fe(this.hass,"timetable.changed")}`:""}${n?` · ${l}: ${n.title}`:""}`}
      >
        <span class="subject"><bdi>${o.subject}</bdi></span>
        ${d?K`<span class="room"><bdi>${o.room}</bdi></span>`:Z}
        ${r?K`<span class="swap" aria-label=${Fe(this.hass,"timetable.changed")}></span>`:Z}
        ${n?K`<span class="exam-tag">${l}</span>`:Z}
        ${s&&null!==i?K`<div class="progress"><div style=${`width:${Math.round(100*i)}%`}></div></div>`:Z}
      </div>
    `}willUpdate(){this.dir=Be(this.hass)?"rtl":""}render(){if(!this.hass)return K`<ha-card></ha-card>`;const e=Oe(this.hass,this._config.board_entity);if(!e)return K`<ha-card><div class="notice">${Fe(this.hass,"board.missing")}</div></ha-card>`;const t=e.timetable;if(!t)return K`<ha-card
        ><div class="notice">${Fe(this.hass,"timetable.no_periods")}</div></ha-card
      >`;const s=this._candidates(e.members);if(!s.length)return K`<ha-card
        ><div class="notice">${Fe(this.hass,"timetable.none_configured")}</div></ha-card
      >`;const i=s.find(e=>e.member.id===this._memberId)??s[0],{member:a,week:n,outlook:o}=i,r=Se(t,i.schedule),d=this._weekdays(n),l=function(e=new Date){return(e.getDay()+6)%7}(),c=!1!==this._config.highlight,h=this._config.layout??"auto",m="day"===h||"auto"===h&&this._narrow,u=void 0!==this._day&&d.includes(this._day)?this._day:d.includes(l)?l:d[0],p=m?[u]:d,b=this._closure(o,l),g=p.filter(e=>null===this._closure(o,e)),_=g.length<p.length,y=new Map(p.map(e=>[e,this._columnLessons(n,o,e)])),f=function(e,t){const s=e.periods.filter(t),i=new Set(s.map(e=>e.index)),a=[];for(const t of s){a.push({kind:"period",period:t});const s=e.breaks.find(e=>e.after===t.index&&i.has(t.index+1));s&&a.push({kind:"break",gap:s})}return a}(r,e=>!1===this._config.hide_empty_periods||g.some(t=>y.get(t)?.has(e.index))),v=c&&!b?Te(r):void 0,w=!1!==this._config.show_times,$=!1!==this._config.show_breaks?f:f.filter(e=>"period"===e.kind);return K`
      <ha-card style=${`--member-color:${a.color}`}>
        <div class="head">
          <div class="title">
            ${Me(this.hass,a.avatar)?K`<img class="avatar" src=${Me(this.hass,a.avatar)} alt="" />`:K`<span class="dot"></span>`}
            <span><bdi>${a.name}</bdi></span>
          </div>
          ${this._renderChips(s,a)}
        </div>
        ${c&&b?this._renderNoSchool(b.label):c&&d.includes(l)?this._renderStatus(r,this._columnLessons(n,o,l)):Z}
        ${m?K`
              <div class="days">
                ${d.map(e=>K`
                    <button
                      class="chip day ${e===l&&c?"is-today":""}"
                      aria-pressed=${e===u}
                      @click=${()=>{this._day=e}}
                    >
                      ${this._weekdayName(e,"short")}
                      ${this._columnDate(o,e)?K`<span class="chip-date"
                            >${this._columnDate(o,e)}</span
                          >`:Z}
                    </button>
                  `)}
              </div>
            `:Z}

        <div
          class="grid"
          style=${`grid-template-columns:${w?"max-content":"min-content"} repeat(${p.length}, minmax(0, 1fr))`}
        >
          <!-- One surface per day, behind everything else in that column. Drawn first
               so the cells paint on top of it without needing a stacking context. -->
          ${p.map((e,t)=>K`<div class="day-panel" style=${`grid-column:${t+2};grid-row:1 / -1`}></div>`)}
          <div class="corner" style="grid-column:1;grid-row:1"></div>
          ${p.map((e,t)=>K`
              <div
                class="col-head ${c&&e===l?"today":""}"
                style=${`grid-column:${t+2};grid-row:1`}
              >
                <span class="col-day"
                  >${this._weekdayName(e,m?"long":"short")}</span
                >
                ${r.cycleWeeks>1?K`<span class="col-week"
                      >${1===this._dayFor(o,e)?.week?"B":"A"}</span
                    >`:Z}
                ${this._columnDate(o,e)?K`<span class="col-date">${this._columnDate(o,e)}</span>`:Z}
              </div>
            `)}
          ${_?this._closureRuns(o,p).map(e=>e.closed?K`
                      <div
                        class="closure ${e.closed.mode}"
                        style=${`grid-column:${e.start+2} / span ${e.span};grid-row:2`}
                        title=${e.closed.label}
                      >
                        <bdi>${e.closed.label}</bdi>
                      </div>
                    `:K`
                      <div
                        style=${`grid-column:${e.start+2} / span ${e.span};grid-row:2`}
                      ></div>
                    `):Z}
          ${$.map((e,t)=>{const s=t+(_?3:2);if("break"===e.kind){const t=`${we(this.hass,e.gap.start)}–${we(this.hass,e.gap.end)}`;return K`
                <div
                  class="t-break"
                  style=${`grid-column:1;grid-row:${s}`}
                  title=${`${Fe(this.hass,"timetable.break")} · ${t}`}
                >
                  ${Fe(this.hass,"timetable.break")}
                </div>
                ${p.map((e,i)=>K`
                    <div
                      class="d-break"
                      style=${`grid-column:${i+2};grid-row:${s}`}
                      title=${`${Fe(this.hass,"timetable.break")} · ${t}`}
                    ></div>
                  `)}
              `}const{period:i}=e,a=c?function(e,t=ve()){if(t<e.startMinutes||t>=e.endMinutes)return null;const s=e.endMinutes-e.startMinutes;return s>0?(t-e.startMinutes)/s:0}(i):null;return K`
              <div class="time" style=${`grid-column:1;grid-row:${s}`}>
                <span class="no">${i.index}</span>
                ${w?K`<span class="span"
                      >${we(this.hass,i.start)}<br />${we(this.hass,i.end)}</span
                    >`:Z}
              </div>
              ${p.map((e,t)=>null!==this._closure(o,e)?K`<div
                      class="cell closed"
                      style=${`grid-column:${t+2};grid-row:${s}`}
                    ></div>`:this._renderCell(r,y.get(e)?.get(i.index),c&&e===l&&v?.index===i.index,a,`grid-column:${t+2};grid-row:${s}`,this._dayFor(o,e)?.exams?.find(e=>e.period===i.index)))}
            `})}
        </div>
      </ha-card>
    `}};kt.styles=[nt,ot,d`
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
        gap: var(--schoolday-gap);
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

      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--member-color);
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
        border: 1px solid var(--schoolday-line);
        border-radius: 18px;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--schoolday-muted);
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

      .pill.next,
      .pill.closed {
        background: var(--schoolday-surface-alt);
        color: var(--schoolday-muted);
      }

      .status-text {
        font-weight: 600;
      }

      .status-muted {
        color: var(--schoolday-muted);
        font-size: 0.85rem;
      }

      .grid {
        display: grid;
        /* Wider between the days than between the periods: the eye needs a bigger gap
           across than down to read five columns as five days rather than one field. */
        row-gap: 4px;
        column-gap: 10px;
        align-items: stretch;
      }

      /* One unbroken surface per day, spanning the head and every period. This is what
         lets the eye take a column as one day instead of a run of loose chips — and it
         has to sit behind them, which is why nothing in this grid is auto-placed. */
      /* A day that is not happening keeps its place in the grid so the rows still line
         up, but carries nothing: stated outright rather than left to an undefined
         --subject quietly invalidating the chip's own background. */
      .cell.closed {
        background: none;
        border-inline-start: none;
      }

      .day-panel {
        border-radius: 12px;
        background: var(--schoolday-surface-alt);
        /* Vertical only. Widening it would eat into the column gap that separates one
           day from the next, and the last day would push the grid into a scrollbar. */
        margin: -6px 0;
      }

      .col-head {
        padding: 2px 0 4px;
        text-align: center;
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--schoolday-muted);
      }

      /* Which week of the cycle this column belongs to. Only drawn by an A/B school,
         where it is the difference between two entirely different Tuesdays. */
      .col-week {
        margin-inline-start: 4px;
        padding: 0 4px;
        border-radius: 5px;
        background: color-mix(in srgb, currentColor 20%, transparent);
        font-size: 0.65rem;
      }

      .col-head.today {
        color: var(--text-primary-color, #fff);
        background: var(--schoolday-today);
        border-radius: 8px;
      }

      /* Sits under the date rather than beside it: the two are different questions —
         which day, and whether it is happening. */
      .closure {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: var(--schoolday-touch);
        padding: 6px 8px;
        margin-bottom: 2px;
        box-sizing: border-box;
        overflow: hidden;
        border-radius: 10px;
        border-inline-start: 3px solid var(--closure);
        background: color-mix(in srgb, var(--closure) 22%, transparent);
        color: var(--primary-text-color);
        font-size: 0.78rem;
        font-weight: 700;
        line-height: 1.2;
        text-align: center;
      }

      .closure.free {
        --closure: var(--schoolday-holiday);
      }

      .closure.care {
        --closure: var(--schoolday-care);
      }

      .closure.sick {
        --closure: var(--schoolday-sick);
      }

      .closure.event {
        --closure: var(--schoolday-event);
      }

      /* A lesson that is not the one the timetable promised. Marked rather than merely
         shown: a substitution the reader cannot see is worse than no substitution
         layer at all, because they would trust the wrong thing without knowing. */
      .cell.changed {
        outline: 2px dashed color-mix(in srgb, var(--subject) 65%, transparent);
        outline-offset: -2px;
      }

      .cell.changed .swap {
        position: absolute;
        top: 3px;
        inset-inline-end: 4px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--subject);
      }

      .cell {
        position: relative;
      }

      /* An exam is the one lesson of the week that changes what the evening before
         looks like, so it is labelled in words rather than with another dot to learn.
         On the card's own surface rather than in the subject colour: the subject
         colours are derived from names and some are pale, and a label that is only
         legible on half the subjects is not a label. */
      .cell .exam-tag {
        position: absolute;
        inset-inline-end: 4px;
        bottom: 3px;
        padding: 0 5px;
        border: 1px solid var(--subject);
        border-radius: 999px;
        background: var(--schoolday-surface);
        color: var(--primary-text-color);
        font-size: 0.6rem;
        font-weight: 700;
        line-height: 1.5;
        letter-spacing: 0.02em;
      }

      .time {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-inline-end: 8px;
        text-align: end;
        font-size: 0.68rem;
        line-height: 1.25;
        color: var(--schoolday-muted);
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
        min-height: var(--schoolday-touch);
        padding: 4px 8px;
        box-sizing: border-box;
        overflow: hidden;
        border-radius: 10px;
        border-inline-start: 3px solid var(--subject);
        background: color-mix(in srgb, var(--subject) 22%, transparent);
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
        color: var(--schoolday-muted);
      }

      /* A free period is drawn, not left out: the grid has to keep its shape, and an
         empty slot with nothing in it reads as a rendering fault. */
      .cell.free {
        background: transparent;
        border: 1px dashed var(--schoolday-line);
        opacity: 0.6;
      }

      .cell.now {
        box-shadow: inset 0 0 0 2px var(--schoolday-today);
      }

      .progress {
        height: 3px;
        margin-top: 4px;
        border-radius: 2px;
        background: var(--schoolday-line);
        overflow: hidden;
      }

      .progress > div {
        height: 100%;
        background: var(--schoolday-today);
      }

      .t-break {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-block: 1px;
        padding-inline-end: 4px;
        font-size: 0.65rem;
        line-height: 1;
        color: var(--schoolday-muted);
        white-space: nowrap;
      }

      .d-break {
        display: flex;
        align-items: center;
        padding: 1px 0;
        min-height: 0.65rem;
      }

      .d-break::before {
        content: '';
        flex: 1;
        height: 1px;
        margin: 0 10px;
        background: var(--schoolday-line);
      }

      .break .line {
        flex: 1;
        height: 1px;
        background: var(--schoolday-line);
      }

      .notice {
        padding: 8px 2px;
        color: var(--schoolday-muted);
        font-size: 0.9rem;
      }
    `],s([pe({attribute:!1})],kt.prototype,"hass",void 0),s([be()],kt.prototype,"_config",void 0),s([be()],kt.prototype,"_memberId",void 0),s([be()],kt.prototype,"_day",void 0),s([be()],kt.prototype,"_narrow",void 0),s([be()],kt.prototype,"_tick",void 0),kt=s([he("schoolday-timetable-card")],kt),window.customCards=window.customCards||[],window.customCards.push({type:"schoolday-timetable-card",name:"Schoolday Timetable",description:"The school timetable per child, colour-coded by subject, with the running lesson marked.",preview:!0,documentationURL:"https://github.com/DomCim/HA-Schoolday"}),console.info(`%c SCHOOLDAY %c ${e} `,"color:#fff;background:#3a86c8;font-weight:700;border-radius:3px 0 0 3px;padding:2px 6px","color:#3a86c8;background:#16212b;font-weight:700;border-radius:0 3px 3px 0;padding:2px 6px");export{e as SCHOOLDAY_VERSION};
