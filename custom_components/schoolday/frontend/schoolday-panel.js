const e="0.22.0",t=["#e0603a","#3a86c8","#4f9d69","#c9a227","#8e6bbf","#d1707f"];function s(e,t,s,a){var i,n=arguments.length,o=n<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,s):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,s,a);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(o=(n<3?i(o):n>3?i(t,s,o):i(t,s))||o);return n>3&&o&&Object.defineProperty(t,s,o),o}"function"==typeof SuppressedError&&SuppressedError;const a=globalThis,i=a.ShadowRoot&&(void 0===a.ShadyCSS||a.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),o=new WeakMap;let r=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const s=void 0!==t&&1===t.length;s&&(e=o.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(t,e))}return e}toString(){return this.cssText}};const l=(e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,s,a)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[a+1],e[0]);return new r(s,e,n)},d=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,n))(t)})(e):e,{is:c,defineProperty:h,getOwnPropertyDescriptor:m,getOwnPropertyNames:u,getOwnPropertySymbols:p,getPrototypeOf:b}=Object,g=globalThis,_=g.trustedTypes,y=_?_.emptyScript:"",f=g.reactiveElementPolyfillSupport,w=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?y:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},k=(e,t)=>!c(e,t),$={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:k};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),a=this.getPropertyDescriptor(e,s,t);void 0!==a&&h(this.prototype,e,a)}}static getPropertyDescriptor(e,t,s){const{get:a,set:i}=m(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:a,set(t){const n=a?.call(this);i?.call(this,t),this.requestUpdate(e,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(w("elementProperties")))return;const e=b(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(w("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(w("properties"))){const e=this.properties,t=[...u(e),...p(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(d(e))}else void 0!==e&&t.push(d(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{if(i)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const s of t){const t=document.createElement("style"),i=a.litNonce;void 0!==i&&t.setAttribute("nonce",i),t.textContent=s.cssText,e.appendChild(t)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),a=this.constructor._$Eu(e,s);if(void 0!==a&&!0===s.reflect){const i=(void 0!==s.converter?.toAttribute?s.converter:v).toAttribute(t,s.type);this._$Em=e,null==i?this.removeAttribute(a):this.setAttribute(a,i),this._$Em=null}}_$AK(e,t){const s=this.constructor,a=s._$Eh.get(e);if(void 0!==a&&this._$Em!==a){const e=s.getPropertyOptions(a),i="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=a;const n=i.fromAttribute(t,e.type);this[a]=n??this._$Ej?.get(a)??n,this._$Em=null}}requestUpdate(e,t,s,a=!1,i){if(void 0!==e){const n=this.constructor;if(!1===a&&(i=this[e]),s??=n.getPropertyOptions(e),!((s.hasChanged??k)(i,t)||s.useDefault&&s.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:a,wrapped:i},n){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==i||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===a&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,a=this[t];!0!==e||this._$AL.has(t)||void 0===a||this.C(t,void 0,s,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[w("elementProperties")]=new Map,x[w("finalized")]=new Map,f?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.1.2");const S=globalThis,A=e=>e,j=S.trustedTypes,C=j?j.createPolicy("lit-html",{createHTML:e=>e}):void 0,D="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+E,N=`<${z}>`,T=document,L=()=>T.createComment(""),O=e=>null===e||"object"!=typeof e&&"function"!=typeof e,W=Array.isArray,M="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,H=/>/g,F=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),P=/'/g,I=/"/g,B=/^(?:script|style|textarea|title)$/i,K=(e=>(t,...s)=>({_$litType$:e,strings:t,values:s}))(1),q=Symbol.for("lit-noChange"),Z=Symbol.for("lit-nothing"),V=new WeakMap,G=T.createTreeWalker(T,129);function J(e,t){if(!W(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(t):t}const Y=(e,t)=>{const s=e.length-1,a=[];let i,n=2===t?"<svg>":3===t?"<math>":"",o=R;for(let t=0;t<s;t++){const s=e[t];let r,l,d=-1,c=0;for(;c<s.length&&(o.lastIndex=c,l=o.exec(s),null!==l);)c=o.lastIndex,o===R?"!--"===l[1]?o=U:void 0!==l[1]?o=H:void 0!==l[2]?(B.test(l[2])&&(i=RegExp("</"+l[2],"g")),o=F):void 0!==l[3]&&(o=F):o===F?">"===l[0]?(o=i??R,d=-1):void 0===l[1]?d=-2:(d=o.lastIndex-l[2].length,r=l[1],o=void 0===l[3]?F:'"'===l[3]?I:P):o===I||o===P?o=F:o===U||o===H?o=R:(o=F,i=void 0);const h=o===F&&e[t+1].startsWith("/>")?" ":"";n+=o===R?s+N:d>=0?(a.push(r),s.slice(0,d)+D+s.slice(d)+E+h):s+E+(-2===d?t:h)}return[J(e,n+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),a]};class Q{constructor({strings:e,_$litType$:t},s){let a;this.parts=[];let i=0,n=0;const o=e.length-1,r=this.parts,[l,d]=Y(e,t);if(this.el=Q.createElement(l,s),G.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(a=G.nextNode())&&r.length<o;){if(1===a.nodeType){if(a.hasAttributes())for(const e of a.getAttributeNames())if(e.endsWith(D)){const t=d[n++],s=a.getAttribute(e).split(E),o=/([.?@])?(.*)/.exec(t);r.push({type:1,index:i,name:o[2],strings:s,ctor:"."===o[1]?ae:"?"===o[1]?ie:"@"===o[1]?ne:se}),a.removeAttribute(e)}else e.startsWith(E)&&(r.push({type:6,index:i}),a.removeAttribute(e));if(B.test(a.tagName)){const e=a.textContent.split(E),t=e.length-1;if(t>0){a.textContent=j?j.emptyScript:"";for(let s=0;s<t;s++)a.append(e[s],L()),G.nextNode(),r.push({type:2,index:++i});a.append(e[t],L())}}}else if(8===a.nodeType)if(a.data===z)r.push({type:2,index:i});else{let e=-1;for(;-1!==(e=a.data.indexOf(E,e+1));)r.push({type:7,index:i}),e+=E.length-1}i++}}static createElement(e,t){const s=T.createElement("template");return s.innerHTML=e,s}}function X(e,t,s=e,a){if(t===q)return t;let i=void 0!==a?s._$Co?.[a]:s._$Cl;const n=O(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),void 0===n?i=void 0:(i=new n(e),i._$AT(e,s,a)),void 0!==a?(s._$Co??=[])[a]=i:s._$Cl=i),void 0!==i&&(t=X(e,i._$AS(e,t.values),i,a)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,a=(e?.creationScope??T).importNode(t,!0);G.currentNode=a;let i=G.nextNode(),n=0,o=0,r=s[0];for(;void 0!==r;){if(n===r.index){let t;2===r.type?t=new te(i,i.nextSibling,this,e):1===r.type?t=new r.ctor(i,r.name,r.strings,this,e):6===r.type&&(t=new oe(i,this,e)),this._$AV.push(t),r=s[++o]}n!==r?.index&&(i=G.nextNode(),n++)}return G.currentNode=T,a}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,a){this.type=2,this._$AH=Z,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),O(e)?e===Z||null==e||""===e?(this._$AH!==Z&&this._$AR(),this._$AH=Z):e!==this._$AH&&e!==q&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>W(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==Z&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,a="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=Q.createElement(J(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===a)this._$AH.p(t);else{const e=new ee(a,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=V.get(e.strings);return void 0===t&&V.set(e.strings,t=new Q(e)),t}k(e){W(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,a=0;for(const i of e)a===t.length?t.push(s=new te(this.O(L()),this.O(L()),this,this.options)):s=t[a],s._$AI(i),a++;a<t.length&&(this._$AR(s&&s._$AB.nextSibling,a),t.length=a)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class se{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,a,i){this.type=1,this._$AH=Z,this._$AN=void 0,this.element=e,this.name=t,this._$AM=a,this.options=i,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=Z}_$AI(e,t=this,s,a){const i=this.strings;let n=!1;if(void 0===i)e=X(this,e,t,0),n=!O(e)||e!==this._$AH&&e!==q,n&&(this._$AH=e);else{const a=e;let o,r;for(e=i[0],o=0;o<i.length-1;o++)r=X(this,a[s+o],t,o),r===q&&(r=this._$AH[o]),n||=!O(r)||r!==this._$AH[o],r===Z?e=Z:e!==Z&&(e+=(r??"")+i[o+1]),this._$AH[o]=r}n&&!a&&this.j(e)}j(e){e===Z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ae extends se{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===Z?void 0:e}}class ie extends se{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==Z)}}class ne extends se{constructor(e,t,s,a,i){super(e,t,s,a,i),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??Z)===q)return;const s=this._$AH,a=e===Z&&s!==Z||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,i=e!==Z&&(s===Z||a);a&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class oe{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const re=S.litHtmlPolyfillSupport;re?.(Q,te),(S.litHtmlVersions??=[]).push("3.3.3");const le=globalThis;class de extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const a=s?.renderBefore??t;let i=a._$litPart$;if(void 0===i){const e=s?.renderBefore??null;a._$litPart$=i=new te(t.insertBefore(L(),e),e,void 0,s??{})}return i._$AI(e),i})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}de._$litElement$=!0,de.finalized=!0,le.litElementHydrateSupport?.({LitElement:de});const ce=le.litElementPolyfillSupport;ce?.({LitElement:de}),(le.litElementVersions??=[]).push("4.2.2");const he=e=>(t,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},me={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:k},ue=(e=me,t,s)=>{const{kind:a,metadata:i}=s;let n=globalThis.litPropertyMetadata.get(i);if(void 0===n&&globalThis.litPropertyMetadata.set(i,n=new Map),"setter"===a&&((e=Object.create(e)).wrapped=!0),n.set(s.name,e),"accessor"===a){const{name:a}=s;return{set(s){const i=t.get.call(this);t.set.call(this,s),this.requestUpdate(a,i,e,!0,s)},init(t){return void 0!==t&&this.C(a,void 0,e,t),t}}}if("setter"===a){const{name:a}=s;return function(s){const i=this[a];t.call(this,s),this.requestUpdate(a,i,e,!0,s)}}throw Error("Unsupported decorator location: "+a)};function pe(e){return(t,s)=>"object"==typeof s?ue(e,t,s):((e,t,s)=>{const a=t.hasOwnProperty(s);return t.constructor.createProperty(s,e),a?Object.getOwnPropertyDescriptor(t,s):void 0})(e,t,s)}function be(e){return pe({...e,state:!0,attribute:!1})}function ge(e){switch(e.locale?.time_format){case"12":return!0;case"24":return!1;default:return}}function _e(e){return e.locale?.language||e.language||"en"}const ye=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];function fe(e){return Array.from({length:7},(t,s)=>(e+s)%7)}function we(e){const t=Number(e??0);return Number.isInteger(t)&&t>=0&&t<=6?t:0}const ve=["care","free","sick","event"];function ke(e){const[t,s]=e.split(":").map(Number);return 60*(t||0)+(s||0)}function $e(e=new Date){return 60*e.getHours()+e.getMinutes()}function xe(e,t){if(!e)return t;if(!0!==ge(e))return t;const s=new Date;return s.setHours(Math.floor(ke(t)/60),ke(t)%60,0,0),new Intl.DateTimeFormat(_e(e),{hour:"numeric",minute:"2-digit",hour12:!0}).format(s)}function Se(e){if(!e||"object"!=typeof e)return null;const t=e,s=Ae(t.periods);if(!s.length)return null;const a=je(t.breaks),i={};for(const[e,s]of Object.entries(t.schedules??{})){const t=Ae(s?.periods);t.length&&(i[e]={periods:t,breaks:je(s?.breaks)})}const n={};for(const[e,s]of Object.entries(t.subjects??{}))"string"==typeof s&&(n[e]=s);return{periods:s,breaks:a,subjects:n,cycleWeeks:2===Number(t.cycle_weeks??1)?2:1,weekStart:we(t.week_start),schedules:i}}function Ae(e){return(Array.isArray(e)?e:[]).map(e=>e).filter(e=>"string"==typeof e?.start&&"string"==typeof e?.end).map((e,t)=>({index:Number(e.index??t+1),start:String(e.start),end:String(e.end),startMinutes:ke(String(e.start)),endMinutes:ke(String(e.end))}))}function je(e){return(Array.isArray(e)?e:[]).map(e=>e).filter(e=>"string"==typeof e?.start&&"string"==typeof e?.end).map(e=>({after:Number(e.after??0),start:String(e.start),end:String(e.end),minutes:Number(e.minutes??0)}))}function Ce(e,t){const s=t?e.schedules[t]:void 0;return s?{...e,periods:s.periods,breaks:s.breaks}:e}function De(e){return function(e){const t={};if(!e||"object"!=typeof e)return t;for(const[s,a]of Object.entries(e)){const e=Number(s);if(!Number.isInteger(e)||e<0||e>=14||!Array.isArray(a))continue;const i=a.map(e=>e).filter(e=>Boolean(e)&&"string"==typeof e.subject).map(e=>{const t=Number(e.period??0),s={period:t,subject:String(e.subject),room:"string"==typeof e.room&&e.room?e.room:null};return Array.isArray(e.rotation)&&e.rotation.length>1&&(s.rotation=e.rotation.map(e=>{const s=e??{};return"string"==typeof s.subject&&s.subject?{period:t,subject:s.subject,room:"string"==typeof s.room&&s.room?s.room:null}:null})),s}).sort((e,t)=>e.period-t.period);i.length&&(t[e]=i)}return t}(e?.attributes?.timetable)}function Ee(e){return Array.isArray(e)?e.map(e=>e).filter(e=>Boolean(e)&&"string"==typeof e.title&&e.title).map(e=>({date:"string"==typeof e.date?e.date:"",title:String(e.title),start:"string"==typeof e.start&&e.start?e.start:null,period:"number"==typeof e.period?e.period:null})):[]}function ze(e){const t={};for(const[s,a]of Object.entries(e)){if(!a||"object"!=typeof a){t[s]=null;continue}const e=a;"string"==typeof e.subject&&e.subject?t[s]={period:Number(e.period??s),subject:e.subject,room:"string"==typeof e.room&&e.room?e.room:null}:t[s]=null}return t}function Ne(e,t){const s=e.rotation;return s?.length?s[(t%s.length+s.length)%s.length]??null:e}function Te(e){return t=e?.attributes?.outlook,Array.isArray(t)?t.map(e=>e).filter(e=>Boolean(e)&&"string"==typeof e.date).map(e=>({date:String(e.date),weekday:Number(e.weekday??0),mode:ve.includes(e.mode)?e.mode:"school",label:"string"==typeof e.label&&e.label?e.label:null,week:1===Number(e.week??0)?1:0,rotation:Number.isInteger(e.rotation)?Number(e.rotation):0,...e.changes&&"object"==typeof e.changes?{changes:ze(e.changes)}:{},...Array.isArray(e.exams)&&e.exams.length?{exams:Ee(e.exams)}:{}})).sort((e,t)=>e.date.localeCompare(t.date)):[];var t}function Le(e=new Date){const t=String(e.getMonth()+1).padStart(2,"0"),s=String(e.getDate()).padStart(2,"0");return`${e.getFullYear()}-${t}-${s}`}function Oe(e){return Object.entries(e).some(([e,t])=>Number(e)>=7&&t.length>0)}function We(e,t){const s=fe(t),a=Object.keys(e).map(Number).filter(t=>(e[t]??[]).length>0).map(e=>s.indexOf(e%7));return s.slice(0,Math.max(4,...a)+1)}function Me(e,t,s){return(e[t]??[]).find(e=>e.period===s)}function Re(e,t=$e()){return e.periods.find(e=>t>=e.startMinutes&&t<e.endMinutes)}function Ue(e){return!0===e.attributes?.schoolday_board}function He(e,s){let a;if(s){if(a=e.states[s],!a)return null}else if(a=Object.values(e.states).find(Ue),!a)return null;const i=a.attributes,n=(Array.isArray(i.members)?i.members:[]).map((e,s)=>{const a=e;return{id:String(a.id??s),name:String(a.name??""),color:a.color||t[s%t.length],avatar:a.avatar??null,order:a.order??s}});return n.sort((e,t)=>e.order-t.order||e.name.localeCompare(t.name)),{entityId:a.entity_id,members:n,timetable:Se(i.timetable),schoolToday:!1!==i.school_today,noSchoolReason:"string"==typeof i.no_school_reason?i.no_school_reason:null}}function Fe(e,t){if(!t)return null;if(!t.includes(".")||t.includes("/")||t.includes(":"))return t;const s=e.states[t];if(!s)return t;const a=s.attributes?.entity_picture;return"string"==typeof a&&a?a:null}function Pe(e,t){return Object.values(e.states).find(e=>e.attributes?.member_id===t&&e.entity_id.startsWith("sensor.")&&"timestamp"!==e.attributes?.device_class)}const Ie={"board.missing":"No Schoolday board found. Add the Schoolday integration.","routines.nothing_today":"Nothing today","routines.auto":"Automatic (by time of day)","routines.morning":"Morning","routines.evening":"Evening","routines.both":"Both","routines.none_configured":"No routines for today. Add them under Configure → Edit routines in the Schoolday integration.","routines.sick":"At home ill","routines.packed_for":"for {subject}","timetable.sick":"Ill","timetable.event":"No normal lessons","timetable.changed":"Changed","timetable.exam":"Exam","routines.exam_tomorrow":"Exam tomorrow","stats.percent":"{value}%","stats.window":"over {days} days","stats.window_one":"over one day","stats.streak":"{days} days in a row","stats.best":"best {days}","stats.day_done":"{done} of {asked} done","stats.nothing_asked":"Nothing on","stats.nothing_yet":"Nothing on the record yet. It starts with the first school day.","stats.none_configured":"No routines to keep a record of. Add them under Configure → Edit routines in the Schoolday integration.","stats.sort_board":"The usual family order","stats.sort_rate":"Best record first","homework.nothing":"Nothing to do","homework.all_done":"No homework outstanding.","homework.overdue":"Overdue","homework.today":"Due today","homework.tomorrow":"Due tomorrow","homework.later":"Later","homework.someday":"No date","exams.none":"No exams announced.","exams.this_week":"This week","exams.next_week":"Next week","exams.in_weeks":"In {weeks} weeks","exams.today":"Today","exams.tomorrow":"Tomorrow","exams.in_days":"in {days} days","exams.period":"Period {period}","timetable.no_periods":"No lesson times yet. Add them under Configure → School timetable in the Schoolday integration.","timetable.none_configured":"Nobody has a timetable yet. Add one under Configure → School timetable in the Schoolday integration.","timetable.break":"Break","timetable.no_school":"No school","timetable.free":"Holiday","timetable.care":"Holiday care","timetable.now":"Now","timetable.next":"Next","timetable.remaining":"{minutes} min left","timetable.done_for_today":"School is out for today.","timetable.layout_auto":"Automatic (week, one day when narrow)","timetable.layout_week":"Whole week","timetable.layout_day":"One day","timetable.days_auto":"Automatic (as the timetable needs)","timetable.days_school":"The first five days of the week","timetable.days_week":"All seven days","editor.block":"Which block to show","editor.evening_from":"Evening starts at (hour)","editor.show_empty":"Show members with nothing on today","editor.show_done":"Show what is already done","editor.members":"Limit to these members","editor.member":"Family member","editor.layout":"Layout","editor.week_days":"Days shown","editor.show_rooms":"Show rooms","editor.show_times":"Show lesson times","editor.show_breaks":"Show breaks","editor.hide_empty_periods":"Hide periods nobody has","editor.highlight":"Mark today and the running lesson","editor.roll_days":"Roll past weekdays on to next week","editor.section":"Section to open on","editor.days":"Days shown","editor.show_steps":"Show the tally per step","editor.sort":"Order","admin.tab_timetable":"Timetable","admin.tab_routines":"Routines","admin.tab_family":"Family","admin.tab_subjects":"Subjects","admin.tab_holidays":"Days off","admin.tab_materials":"Material","admin.tab_exceptions":"Exceptions","admin.cycle_one":"One week","admin.cycle_two":"Two weeks (A/B)","admin.cycle_start":"Week A starts in calendar week","admin.cycle_now":"This week is week {week}.","admin.week_start":"Week begins on","admin.all_days":"All seven days","admin.week_a":"Week A","admin.week_b":"Week B","admin.exceptions_hint":"What one date does differently. A label takes the whole day over; tap a period to cancel it or say what runs instead. Dates in the past are dropped by themselves.","admin.exception_date":"Date","admin.exception_label":"What the day is","admin.exception_label_hint":"School trip, sports day — leave empty for a normal day","admin.exception_cancel":"Cancelled","admin.exception_reset":"Back to the timetable","admin.exception_none":"Nothing is different on this date.","admin.exception_add":"Add a date","admin.rotation_add":"Takes turns with another week","admin.rotation_more":"Add a week","admin.rotation_remove":"Remove this week","admin.rotation_week":"Week {week}","admin.rotation_this":"this week","admin.rotation_free":"Free","admin.rotation_hint":"Each week takes the next turn, and after the last one it starts again. Leave a subject empty for a free week.","admin.weekly_title":"Every week, for a while","admin.weekly_hint":"One weekday that is different for a while: a pull-out day at another school, a course this term. With a last date it ends by itself; without one it runs until you remove it.","admin.weekly_weekday":"Weekday","admin.weekly_from":"From","admin.weekly_until":"Until (optional)","admin.weekly_new":"New","admin.weekly_remove":"Remove","admin.weekly_applies_open":"Every {weekday}, with no end: {label}. Anything you change here is on top of it.","admin.weekly_open":"from {from}","admin.rotation_start":"Week 1 of every rotation begins","admin.rotation_shown":"the week shown","admin.this_week":"This week","admin.next_week":"Next week","admin.week_of":"Week of {date}","admin.week_prev":"Previous week","admin.week_next":"Next week","admin.weekly_kind_off":"No school here","admin.weekly_kind_replace":"Other lessons","admin.weekly_off_hint":"Like a school trip: no lessons, no time to leave, nothing to pack. Name the day, or leave the name empty and change single periods.","admin.weekly_replace_hint":"For a day at another school: only the periods filled in below take place, the rest are free. It stays a school day, with its time to leave and packing list.","admin.weekly_label_hint":"Course, project day","admin.weekly_name":"Name (optional)","admin.weekly_name_hint":"Pull-out day","admin.weekly_applies":"Every {weekday} until {until}: {label}. Anything you change here is on top of it.","admin.materials_hint":"What each subject needs brought along. These show up in the evening routine on the day before, for whoever has that subject.","admin.materials_items":"One thing per line","admin.save":"Save","admin.add":"Add","admin.clear":"Clear","admin.remove":"Remove","admin.remove_confirm":"Remove {name}? Their timetable and routines go too.","admin.add_member":"Add a family member","admin.periods":"Lesson times, one per line","admin.schedule":"School","admin.schedule_default":"The usual times","admin.travel":"Way to school (min)","admin.travel_hint":"Gives a leaving time that moves when the first lesson is cancelled. Empty for none.","admin.leave_time":"Leaves on school days at","admin.care_leave_time":"Leaves in holiday care at","admin.leave_time_hint":"For a bus or a lift, which comes at its time whatever is cancelled. Wins over the way to school.","header.leave_in":"leave in {minutes} min","header.leave_now":"time to go","header.leave_at":"leave at {time}","admin.schedule_name":"Name of the school","admin.schedule_hint":"Grammar school, primary school…","admin.schedule_add":"Another school with different times","admin.schedule_remove":"Remove {name}? Its lesson times go with it.","admin.schedule_remove_one":"Remove {name}? {members} goes back to the usual lesson times.","admin.schedule_remove_members":"Remove {name}? {members} go back to the usual lesson times.","admin.periods_first":"Set the lesson times first — the week hangs on them.","admin.no_members":"Nobody is set up yet. Add a family member first.","admin.no_subjects":"No subjects yet. They appear once a timetable has lessons in it.","admin.subject":"Subject","admin.room":"Room","admin.name":"Name","admin.color":"Colour","admin.reset_color":"Reset colour","admin.calendar":"Own calendar","admin.lessons_calendar":"Lessons calendar from school","admin.exams_calendar":"Exams calendar from school","admin.homework_list":"Homework list from school","admin.school_system":"School system (WebUntis, Schulmanager or similar), optional","admin.school_system_hint":"Calendars and lists a school system such as WebUntis or Schulmanager Online already keeps for this child: changes to the timetable, exams and new homework come from them. With WebUntis, switch on “Calendar - cancelled lessons” in its options.","admin.avatar":"Picture","admin.block_morning":"Morning","admin.block_evening":"Evening","admin.day_free":"Day off","admin.day_care":"Holiday care","admin.steps_hint":"One step per line","admin.school_calendars":"Calendars that close the school, one per line","admin.care_keywords":"Holiday-care keywords, one per line","admin.care_hint":"Holiday care","admin.cancel_keywords":"Words that mean a lesson is cancelled, one per line","admin.cancel_hint":"Cancelled","admin.substitute_keywords":"Words that mean somebody else is taking a lesson, one per line","admin.substitute_hint":"Irregular","admin.school_words":"Words from the school system","admin.school_words_hint":"Already set for WebUntis. Only change them if your school system writes something else.","admin.avatar_hint":"For a picture, put in a person entity — the one Home Assistant already has. A URL works too.","admin.colors_hint":"Every subject already has a colour taken from its name. This is only for correcting one.","admin.calendars_hint":"Any event running on these calendars means there is no school, so use calendars that hold nothing else.","editor.weather_entity":"Weather entity","editor.greeting":"Greeting","editor.show_seconds":"Show seconds","editor.show_leave":"Show when to leave for school"},Be={en:Ie,de:{"board.missing":"Kein Schoolday-Board gefunden. Füge die Schoolday-Integration hinzu.","routines.nothing_today":"Heute nichts","routines.auto":"Automatisch (nach Tageszeit)","routines.morning":"Morgen","routines.evening":"Abend","routines.both":"Beide","routines.none_configured":"Für heute sind keine Routinen hinterlegt. Trage sie in der Schoolday-Integration unter „Konfigurieren → Routinen bearbeiten“ ein.","routines.sick":"Krank zu Hause","routines.packed_for":"für {subject}","timetable.sick":"Krank","timetable.event":"Kein regulärer Unterricht","timetable.changed":"Geändert","timetable.exam":"Arbeit","routines.exam_tomorrow":"Morgen Arbeit","stats.percent":"{value} %","stats.window":"über {days} Tage","stats.window_one":"über einen Tag","stats.streak":"{days} Tage in Folge","stats.best":"beste {days}","stats.day_done":"{done} von {asked} erledigt","stats.nothing_asked":"Nichts zu tun","stats.nothing_yet":"Noch nichts aufgezeichnet. Es beginnt mit dem ersten Schultag.","stats.none_configured":"Es gibt keine Routinen, über die sich etwas sagen ließe. Trage sie in der Schoolday-Integration unter „Konfigurieren → Routinen bearbeiten“ ein.","stats.sort_board":"Die übliche Reihenfolge der Familie","stats.sort_rate":"Beste Bilanz zuerst","homework.nothing":"Nichts zu tun","homework.all_done":"Keine offenen Hausaufgaben.","homework.overdue":"Überfällig","homework.today":"Heute fällig","homework.tomorrow":"Morgen fällig","homework.later":"Später","homework.someday":"Ohne Datum","exams.none":"Keine Arbeiten angekündigt.","exams.this_week":"Diese Woche","exams.next_week":"Nächste Woche","exams.in_weeks":"In {weeks} Wochen","exams.today":"Heute","exams.tomorrow":"Morgen","exams.in_days":"in {days} Tagen","exams.period":"{period}. Stunde","timetable.no_periods":"Noch keine Stundenzeiten. Trage sie in der Schoolday-Integration unter „Konfigurieren → Stundenplan“ ein.","timetable.none_configured":"Noch hat niemand einen Stundenplan. Lege ihn in der Schoolday-Integration unter „Konfigurieren → Stundenplan“ an.","timetable.break":"Pause","timetable.no_school":"Schulfrei","timetable.free":"Ferien","timetable.care":"Ferienbetreuung","timetable.now":"Jetzt","timetable.next":"Danach","timetable.remaining":"noch {minutes} min","timetable.done_for_today":"Für heute ist Schule aus.","timetable.layout_auto":"Automatisch (Woche, schmal ein Tag)","timetable.layout_week":"Ganze Woche","timetable.layout_day":"Ein Tag","timetable.days_auto":"Automatisch (wie der Stundenplan es braucht)","timetable.days_school":"Die ersten fünf Tage der Woche","timetable.days_week":"Alle sieben Tage","editor.block":"Welcher Block angezeigt wird","editor.evening_from":"Abend beginnt um (Stunde)","editor.show_empty":"Mitglieder ohne Routine heute anzeigen","editor.show_done":"Bereits Erledigtes anzeigen","editor.members":"Auf diese Mitglieder beschränken","editor.member":"Familienmitglied","editor.layout":"Darstellung","editor.week_days":"Angezeigte Tage","editor.show_rooms":"Räume anzeigen","editor.show_times":"Stundenzeiten anzeigen","editor.show_breaks":"Pausen anzeigen","editor.hide_empty_periods":"Stunden ausblenden, die niemand hat","editor.highlight":"Heute und laufende Stunde hervorheben","editor.roll_days":"Vergangene Wochentage auf nächste Woche weiterrollen","editor.section":"Bereich beim Öffnen","editor.days":"Angezeigte Tage","editor.show_steps":"Bilanz je Schritt anzeigen","editor.sort":"Reihenfolge","admin.tab_timetable":"Stundenplan","admin.tab_routines":"Routinen","admin.tab_family":"Familie","admin.tab_subjects":"Fächer","admin.tab_holidays":"Freie Tage","admin.tab_materials":"Material","admin.tab_exceptions":"Ausnahmen","admin.cycle_one":"Eine Woche","admin.cycle_two":"Zwei Wochen (A/B)","admin.cycle_start":"A-Woche beginnt in KW","admin.cycle_now":"Diese Woche ist Woche {week}.","admin.week_start":"Woche beginnt am","admin.all_days":"Alle sieben Tage","admin.week_a":"A-Woche","admin.week_b":"B-Woche","admin.exceptions_hint":"Was ein einzelnes Datum anders macht. Eine Bezeichnung nimmt den ganzen Tag ein; auf eine Stunde tippen, um sie entfallen zu lassen oder zu sagen, was stattdessen läuft. Vergangene Daten fallen von selbst weg.","admin.exception_date":"Datum","admin.exception_label":"Was der Tag ist","admin.exception_label_hint":"Wandertag, Sportfest — leer lassen für einen normalen Tag","admin.exception_cancel":"Entfällt","admin.exception_reset":"Zurück zum Stundenplan","admin.exception_none":"An diesem Datum ist nichts anders.","admin.exception_add":"Datum hinzufügen","admin.rotation_add":"Wechselt sich mit einer anderen Woche ab","admin.rotation_more":"Woche hinzufügen","admin.rotation_remove":"Diese Woche entfernen","admin.rotation_week":"Woche {week}","admin.rotation_this":"diese Woche","admin.rotation_free":"Frei","admin.rotation_hint":"Jede Woche ist die nächste dran, nach der letzten geht es von vorn los. Ein leeres Fach ist eine freie Woche.","admin.weekly_title":"Jede Woche, für eine Zeit","admin.weekly_hint":"Ein Wochentag, der für eine Zeit anders ist: ein Tag an einer anderen Schule, ein Kurs in diesem Halbjahr. Mit einem letzten Datum endet er von selbst, ohne bleibt er, bis du ihn entfernst.","admin.weekly_weekday":"Wochentag","admin.weekly_from":"Ab","admin.weekly_until":"Bis (optional)","admin.weekly_new":"Neu","admin.weekly_remove":"Entfernen","admin.weekly_applies_open":"Jeden {weekday}, ohne Ende: {label}. Was du hier änderst, kommt noch dazu.","admin.weekly_open":"ab {from}","admin.rotation_start":"Woche 1 jedes Wechsels beginnt am","admin.rotation_shown":"die gezeigte Woche","admin.this_week":"Diese Woche","admin.next_week":"Nächste Woche","admin.week_of":"Woche ab {date}","admin.week_prev":"Vorige Woche","admin.week_next":"Nächste Woche","admin.weekly_kind_off":"Keine Schule hier","admin.weekly_kind_replace":"Andere Stunden","admin.weekly_off_hint":"Wie ein Wandertag: keine Stunden, keine Zeit zum Losgehen, nichts zu packen. Den Tag benennen, oder den Namen leer lassen und einzelne Stunden ändern.","admin.weekly_replace_hint":"Für einen Tag an einer anderen Schule: nur die unten eingetragenen Stunden finden statt, die anderen sind frei. Es bleibt ein Schultag, mit Zeit zum Losgehen und Packliste.","admin.weekly_label_hint":"Kurs, Projekttag","admin.weekly_name":"Name (optional)","admin.weekly_name_hint":"Drehtürtag","admin.weekly_applies":"Jeden {weekday} bis {until}: {label}. Was du hier änderst, kommt noch dazu.","admin.materials_hint":"Was ein Fach an Sachen braucht. Es erscheint am Abend davor in der Abendroutine, bei jedem Kind, das dieses Fach hat.","admin.materials_items":"Eine Sache pro Zeile","admin.save":"Speichern","admin.add":"Hinzufügen","admin.clear":"Leeren","admin.remove":"Entfernen","admin.remove_confirm":"{name} entfernen? Stundenplan und Routinen gehen mit.","admin.add_member":"Familienmitglied hinzufügen","admin.periods":"Stundenzeiten, eine pro Zeile","admin.schedule":"Schule","admin.schedule_default":"Die üblichen Zeiten","admin.travel":"Weg zur Schule (Min.)","admin.travel_hint":"Ergibt eine Losgeh-Zeit, die sich verschiebt, wenn die erste Stunde ausfällt. Leer für keine.","admin.leave_time":"Losgehen an Schultagen um","admin.care_leave_time":"Losgehen in der Ferienbetreuung um","admin.leave_time_hint":"Für Bus oder Fahrgemeinschaft, die kommen, egal was ausfällt. Gilt vor dem Weg zur Schule.","header.leave_in":"los in {minutes} Min.","header.leave_now":"jetzt los!","header.leave_at":"los um {time}","admin.schedule_name":"Name der Schule","admin.schedule_hint":"Gymnasium, Grundschule …","admin.schedule_add":"Weitere Schule mit anderen Zeiten","admin.schedule_remove":"{name} entfernen? Die Stundenzeiten gehen mit.","admin.schedule_remove_one":"{name} entfernen? {members} kommt dann auf die üblichen Stundenzeiten.","admin.schedule_remove_members":"{name} entfernen? {members} kommen dann auf die üblichen Stundenzeiten.","admin.periods_first":"Trage zuerst die Stundenzeiten ein — die Woche hängt daran.","admin.no_members":"Noch ist niemand angelegt. Lege zuerst ein Familienmitglied an.","admin.no_subjects":"Noch keine Fächer. Sie erscheinen, sobald ein Stundenplan Stunden hat.","admin.subject":"Fach","admin.room":"Raum","admin.name":"Name","admin.color":"Farbe","admin.reset_color":"Farbe zurücksetzen","admin.calendar":"Eigener Kalender","admin.lessons_calendar":"Stundenplan-Kalender der Schule","admin.exams_calendar":"Klassenarbeiten-Kalender der Schule","admin.homework_list":"Hausaufgaben-Liste der Schule","admin.school_system":"Schulsystem (WebUntis, Schulmanager o. Ä.), optional","admin.school_system_hint":"Kalender und Listen, die ein Schulsystem wie WebUntis oder Schulmanager Online schon für dieses Kind führt: Daraus kommen Änderungen am Stundenplan, Arbeiten und neue Hausaufgaben. Bei WebUntis dort in den Optionen „Kalender - Ausfallende Stunden“ einschalten.","admin.avatar":"Bild","admin.block_morning":"Morgens","admin.block_evening":"Abends","admin.day_free":"Freier Tag","admin.day_care":"Ferienbetreuung","admin.steps_hint":"Ein Schritt pro Zeile","admin.school_calendars":"Kalender, die die Schule schließen, einer pro Zeile","admin.care_keywords":"Betreuungs-Stichwörter, eines pro Zeile","admin.care_hint":"Ferienbetreuung","admin.cancel_keywords":"Wörter für eine ausgefallene Stunde, eines pro Zeile","admin.cancel_hint":"Entfall","admin.substitute_keywords":"Wörter für eine Vertretungsstunde, eines pro Zeile","admin.substitute_hint":"Vertretung","admin.school_words":"Wörter aus dem Schulsystem","admin.school_words_hint":"Für WebUntis schon eingestellt. Nur ändern, wenn euer Schulsystem etwas anderes schreibt.","admin.avatar_hint":"Für ein Bild eine Person-Entität eintragen — die, die Home Assistant schon kennt. Eine URL geht auch.","admin.colors_hint":"Jedes Fach hat schon eine Farbe, abgeleitet aus seinem Namen. Das hier ist nur zum Korrigieren.","admin.calendars_hint":"Jeder laufende Termin in diesen Kalendern bedeutet schulfrei — nimm also Kalender, in denen nichts anderes steht.","editor.weather_entity":"Wetter-Entität","editor.greeting":"Begrüßung","editor.show_seconds":"Sekunden anzeigen","editor.show_leave":"Losgeh-Zeit für die Schule anzeigen"},he:{"board.missing":"Schoolday לא מוגדר. הוסיפו את האינטגרציה Schoolday.","routines.nothing_today":"אין משימות להיום","routines.auto":"אוטומטי (לפי השעה)","routines.morning":"בוקר","routines.evening":"ערב","routines.both":"בוקר וערב","routines.none_configured":'אין משימות להיום. הוסיפו אותן באינטגרציה Schoolday, תחת "הגדר" ← עריכת שגרות.',"routines.sick":"בבית, חולה","routines.packed_for":"בשביל {subject}","timetable.sick":"חולה","timetable.event":"אין לימודים רגילים","timetable.changed":"שינוי","timetable.exam":"מבחן","routines.exam_tomorrow":"מחר מבחן","stats.percent":"{value}%","stats.window":"ב-{days} הימים האחרונים","stats.window_one":"ביום האחרון","stats.streak":"{days} ימים ברצף","stats.best":"שיא: {days}","stats.day_done":"{done} מתוך {asked} בוצעו","stats.nothing_asked":"לא היו משימות","stats.nothing_yet":"עדיין אין רישום. הוא מתחיל ביום הלימודים הראשון.","stats.none_configured":'אין שגרות לרשום. הוסיפו אותן באינטגרציה Schoolday, תחת "הגדר" ← עריכת שגרות.',"stats.sort_board":"הסדר הרגיל של המשפחה","stats.sort_rate":"הכי עקביים קודם","homework.nothing":"אין מה לעשות","homework.all_done":"אין שיעורי בית פתוחים.","homework.overdue":"באיחור","homework.today":"להיום","homework.tomorrow":"למחר","homework.later":"בהמשך","homework.someday":"בלי תאריך","exams.none":"אין מבחנים קרובים.","exams.this_week":"השבוע","exams.next_week":"בשבוע הבא","exams.in_weeks":"בעוד {weeks} שבועות","exams.today":"היום","exams.tomorrow":"מחר","exams.in_days":"בעוד {days} ימים","exams.period":"שיעור {period}","timetable.no_periods":'עדיין אין זמני שיעורים. הוסיפו אותם באינטגרציה Schoolday, תחת "הגדר" ← זמני שיעורים.',"timetable.none_configured":'לאף אחד עדיין אין מערכת שעות. הוסיפו אחת באינטגרציה Schoolday, תחת "הגדר" ← עריכת מערכת שעות.',"timetable.break":"הפסקה","timetable.no_school":"אין לימודים","timetable.free":"חופש","timetable.care":"מסגרת בחופשה","timetable.now":"עכשיו","timetable.next":"הבא","timetable.remaining":"עוד {minutes} דק׳","timetable.done_for_today":"הלימודים להיום נגמרו.","timetable.layout_auto":"אוטומטי (שבוע, או יום אחד כשאין מקום)","timetable.layout_week":"כל השבוע","timetable.layout_day":"יום אחד","timetable.days_auto":"אוטומטי (לפי מערכת השעות)","timetable.days_school":"חמשת הימים הראשונים בשבוע","timetable.days_week":"כל שבעת הימים","editor.block":"איזו שגרה להציג","editor.evening_from":"הערב מתחיל בשעה","editor.show_empty":"להציג בני משפחה שאין להם כלום היום","editor.show_done":"להציג מה שכבר בוצע","editor.members":"רק בני המשפחה האלה","editor.member":"בן משפחה","editor.layout":"פריסה","editor.week_days":"ימים מוצגים","editor.show_rooms":"להציג חדרים","editor.show_times":"להציג זמני שיעורים","editor.show_breaks":"להציג הפסקות","editor.hide_empty_periods":"להסתיר שעות שאין בהן שיעור לאף אחד","editor.highlight":"לסמן את היום ואת השיעור הנוכחי","editor.roll_days":"ימים שחלפו מוצגים מהשבוע הבא","editor.section":"החלק שנפתח ראשון","editor.days":"ימים מוצגים","editor.show_steps":"להציג כמה פעמים בוצע כל שלב","editor.sort":"מיון","admin.tab_timetable":"מערכת שעות","admin.tab_routines":"שגרות","admin.tab_family":"משפחה","admin.tab_subjects":"מקצועות","admin.tab_holidays":"ימי חופש","admin.tab_materials":"ציוד","admin.tab_exceptions":"שינויים","admin.cycle_one":"שבוע אחד","admin.cycle_two":"שבועיים (א׳/ב׳)","admin.cycle_start":"מספר השבוע בשנה שבו מתחיל שבוע א׳","admin.cycle_now":"השבוע הוא שבוע {week}.","admin.week_start":"היום הראשון בשבוע","admin.all_days":"הצגת כל הימים","admin.week_a":"שבוע א׳","admin.week_b":"שבוע ב׳","admin.exceptions_hint":"שינויים לתאריך מסוים. כתבו תווית כדי לסמן את כל היום, או הקישו על שיעור כדי לבטל אותו או לכתוב מה יהיה במקומו. תאריכים שעברו נמחקים מעצמם.","admin.exception_date":"תאריך","admin.exception_label":"מה יש ביום הזה","admin.exception_label_hint":"טיול שנתי, יום ספורט — השאירו ריק ליום רגיל","admin.exception_cancel":"בוטל","admin.exception_reset":"חזרה למערכת השעות","admin.exception_none":"אין שום שינוי בתאריך הזה.","admin.exception_add":"הוספת תאריך","admin.rotation_add":"שיעור מתחלף (מקצוע אחר בכל שבוע)","admin.rotation_more":"הוספת שבוע לסבב","admin.rotation_remove":"הסרת השבוע הזה","admin.rotation_week":"שבוע {week}","admin.rotation_this":"השבוע הנוכחי","admin.rotation_free":"אין שיעור","admin.rotation_hint":"בשבוע 1 מתקיים המקצוע הראשון ברשימה, בשבוע 2 המקצוע השני, וכן הלאה. אחרי השבוע האחרון חוזרים לשבוע 1. בשבוע שאין בו שיעור, השאירו את המקצוע ריק.","admin.weekly_title":"שינוי קבוע ביום מסוים בשבוע","admin.weekly_hint":"יום אחד בשבוע שנראה אחרת לתקופה מסוימת, למשל יום שליפה בבית ספר אחר או חוג בסמסטר הזה. אם בוחרים תאריך סיום, השינוי מסתיים מעצמו. בלי תאריך סיום, הוא נמשך עד שמוחקים אותו.","admin.weekly_weekday":"איזה יום","admin.weekly_from":"מתאריך","admin.weekly_until":"עד תאריך (לא חובה)","admin.weekly_new":"שינוי חדש","admin.weekly_remove":"מחיקת השינוי","admin.weekly_applies_open":"התאריך הזה נכלל בשינוי שבועי: כל {weekday}, בלי תאריך סיום ({label}). מה שתשנו כאן יחול רק על התאריך הזה, בנוסף לשינוי השבועי.","admin.weekly_open":"מ־{from}","admin.rotation_start":"שבוע 1 של השיעורים המתחלפים (בחרו יום כלשהו באותו שבוע)","admin.rotation_shown":"השבוע שמוצג למעלה","admin.this_week":"השבוע","admin.next_week":"שבוע הבא","admin.week_of":"השבוע שמתחיל ב־{date}","admin.week_prev":"לשבוע הקודם","admin.week_next":"לשבוע הבא","admin.weekly_kind_off":"אין לימודים ביום הזה","admin.weekly_kind_replace":"לימודים במקום אחר","admin.weekly_off_hint":"כמו טיול שנתי: אין שיעורים, אין שעת יציאה ואין מה לארוז. כתבו מה יש ביום הזה, או השאירו ריק ושנו רק שיעורים מסוימים.","admin.weekly_replace_hint":"מתאים ליום שליפה: מתקיימים רק השיעורים שתמלאו למטה, וכל השאר מתבטלים. זה עדיין יום לימודים, עם שעת יציאה ורשימת ציוד.","admin.weekly_label_hint":"למשל: חוג, יום פרויקט","admin.weekly_name":"שם (לא חובה)","admin.weekly_name_hint":"למשל: יום שליפה","admin.weekly_applies":"התאריך הזה נכלל בשינוי שבועי: כל {weekday} עד {until} ({label}). מה שתשנו כאן יחול רק על התאריך הזה, בנוסף לשינוי השבועי.","admin.materials_hint":"מה צריך להביא לכל מקצוע. הפריטים מופיעים בשגרת הערב ביום שלפני, למי שיש לו את המקצוע.","admin.materials_items":"פריט אחד בכל שורה","admin.save":"שמירה","admin.add":"הוספה","admin.clear":"ניקוי","admin.remove":"הסרה","admin.remove_confirm":"להסיר את {name}? גם מערכת השעות והשגרות יימחקו.","admin.add_member":"הוספת בן משפחה","admin.periods":"זמני שיעורים, אחד בכל שורה","admin.schedule":"בית ספר","admin.schedule_default":"הזמנים הרגילים","admin.travel":"זמן הדרך לבית הספר (דק׳)","admin.travel_hint":"משמש לחישוב שעת יציאה, שמתעדכנת כשהשיעור הראשון מבוטל. השאירו ריק אם אין.","admin.leave_time":"שעת יציאה קבועה בימי לימודים","admin.care_leave_time":"שעת יציאה למסגרת בחופשה","admin.leave_time_hint":"להסעה או טרמפ, שיוצאים באותה שעה גם אם שיעור בוטל. גוברת על זמן הדרך.","header.leave_in":"יוצאים בעוד {minutes} דק׳","header.leave_now":"זמן לצאת","header.leave_at":"יוצאים ב-{time}","admin.schedule_name":"שם בית הספר","admin.schedule_hint":"תיכון, יסודי…","admin.schedule_add":"בית ספר נוסף עם זמנים אחרים","admin.schedule_remove":"להסיר את {name}? זמני השיעורים שלו יימחקו איתו.","admin.schedule_remove_one":"להסיר את {name}? {members} חוזר/ת לזמני השיעורים הרגילים.","admin.schedule_remove_members":"להסיר את {name}? {members} חוזרים לזמני השיעורים הרגילים.","admin.periods_first":"קודם הגדירו את זמני השיעורים. מערכת השעות נבנית עליהם.","admin.no_members":"עדיין לא הוגדר אף אחד. הוסיפו קודם בן משפחה.","admin.no_subjects":"עדיין אין מקצועות. הם יופיעו ברגע שיהיו שיעורים במערכת השעות.","admin.subject":"מקצוע","admin.room":"חדר","admin.name":"שם","admin.color":"צבע","admin.reset_color":"החזרת הצבע האוטומטי","admin.calendar":"לוח שנה פרטי","admin.lessons_calendar":"לוח שיעורים מבית הספר","admin.exams_calendar":"לוח מבחנים מבית הספר","admin.homework_list":"רשימת שיעורי בית מבית הספר","admin.school_system":"מערכת בית ספר (WebUntis, Schulmanager וכדומה), אופציונלי","admin.school_system_hint":"לוחות שנה ורשימות שמערכת בית ספר כמו WebUntis או Schulmanager Online כבר מנהלת עבור הילד: מהם מגיעים שינויים במערכת השעות, מבחנים ושיעורי בית חדשים. ב-WebUntis, הפעילו באפשרויות שלה את “Calendar - cancelled lessons”.","admin.avatar":"תמונה","admin.block_morning":"בוקר","admin.block_evening":"ערב","admin.day_free":"יום חופש","admin.day_care":"מסגרת בחופשה","admin.steps_hint":"שלב אחד בכל שורה","admin.school_calendars":"לוחות שנה שסוגרים את בית הספר, אחד בכל שורה","admin.care_keywords":"מילות מפתח למסגרת בחופשה, אחת בכל שורה","admin.care_hint":"קייטנה","admin.cancel_keywords":"מילים שאומרות ששיעור בוטל, אחת בכל שורה","admin.cancel_hint":"בוטל","admin.substitute_keywords":"מילים שאומרות שמישהו אחר מעביר שיעור, אחת בכל שורה","admin.substitute_hint":"מילוי מקום","admin.school_words":"מילים ממערכת בית הספר","admin.school_words_hint":"כבר מוגדר ל-WebUntis. שנו רק אם מערכת בית הספר שלכם כותבת משהו אחר.","admin.avatar_hint":"לתמונה, בחרו ישות person, והתמונה שלה ב-Home Assistant תוצג. אפשר גם כתובת URL.","admin.colors_hint":"לכל מקצוע כבר יש צבע אוטומטי. כאן אפשר לשנות צבע של מקצוע מסוים.","admin.calendars_hint":"כל אירוע שפעיל בלוחות האלה אומר שאין לימודים, אז השתמשו בלוחות שאין בהם שום דבר אחר.","editor.weather_entity":"ישות מזג אוויר","editor.greeting":"ברכה","editor.show_seconds":"להציג שניות","editor.show_leave":"להציג מתי לצאת לבית הספר"}};function Ke(e){return(e?.locale?.language||e?.language||"en").toLowerCase().split("-")[0]}function qe(e,t,s){let a=(Be[Ke(e)]??Ie)[t]??Ie[t]??t;if(s)for(const[e,t]of Object.entries(s))a=a.replace(`{${e}}`,String(t));return a}const Ze=new Set(["he"]);function Ve(e){return Ze.has(Ke(e))}const Ge=e=>({name:e,selector:{boolean:{}}}),Je=(e,t,s)=>({name:e,selector:{number:{min:t,max:s,mode:"box"}}}),Ye=(e,t,s=!1)=>({name:e,selector:{select:{options:t,multiple:s,mode:s?"list":"dropdown"}}});class Qe extends de{constructor(){super(...arguments),this._config={type:""},this._label=e=>qe(this.hass,`editor.${e.name}`)}setConfig(e){this._config={...e}}_valueChanged(e){e.stopPropagation();const t={...this._config,...e.detail?.value??{}};for(const[e,s]of Object.entries(t))(void 0===s||""===s||Array.isArray(s)&&!s.length)&&delete t[e];var s,a;s="config-changed",a={config:t},this.dispatchEvent(new CustomEvent(s,{detail:a,bubbles:!0,composed:!0}))}render(){return this.hass?K`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this.schema()}
        .computeLabel=${this._label}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:K``}}function Xe(e){return(He(e)?.members??[]).map(e=>({value:e.id,label:e.name}))}s([pe({attribute:!1})],Qe.prototype,"hass",void 0),s([be()],Qe.prototype,"_config",void 0);let et=class extends Qe{schema(){const e=Xe(this.hass);return[...e.length>1?[Ye("member",e)]:[],Ye("block",[{value:"auto",label:qe(this.hass,"routines.auto")},{value:"morning",label:qe(this.hass,"routines.morning")},{value:"evening",label:qe(this.hass,"routines.evening")},{value:"both",label:qe(this.hass,"routines.both")}]),Je("evening_from",0,23),Ge("show_empty")]}};et=s([he("schoolday-routines-card-editor")],et);let tt=class extends Qe{schema(){const e=Xe(this.hass);return[...e.length>1?[Ye("member",e)]:[],Je("days",7,30),Ge("show_steps"),...e.length>1?[Ye("sort",[{value:"board",label:qe(this.hass,"stats.sort_board")},{value:"rate",label:qe(this.hass,"stats.sort_rate")}])]:[]]}};tt=s([he("schoolday-stats-card-editor")],tt);let st=class extends Qe{schema(){const e=Xe(this.hass);return[...e.length>1?[Ye("member",e)]:[],Ye("layout",[{value:"auto",label:qe(this.hass,"timetable.layout_auto")},{value:"week",label:qe(this.hass,"timetable.layout_week")},{value:"day",label:qe(this.hass,"timetable.layout_day")}]),Ye("week_days",[{value:"auto",label:qe(this.hass,"timetable.days_auto")},{value:"school",label:qe(this.hass,"timetable.days_school")},{value:"week",label:qe(this.hass,"timetable.days_week")}]),Ge("show_rooms"),Ge("show_times"),Ge("show_breaks"),Ge("hide_empty_periods"),Ge("highlight"),Ge("roll_days")]}};st=s([he("schoolday-timetable-card-editor")],st);let at=class extends Qe{schema(){const e=Xe(this.hass);return[...e.length>1?[Ye("member",e)]:[],Ge("show_done"),Ge("show_empty")]}};at=s([he("schoolday-homework-card-editor")],at);let it=class extends Qe{schema(){const e=Xe(this.hass);return[...e.length>1?[Ye("member",e)]:[],Je("days",1,84)]}};it=s([he("schoolday-exams-card-editor")],it);let nt=class extends Qe{schema(){return[Ye("section",[{value:"timetable",label:qe(this.hass,"admin.tab_timetable")},{value:"routines",label:qe(this.hass,"admin.tab_routines")},{value:"family",label:qe(this.hass,"admin.tab_family")},{value:"subjects",label:qe(this.hass,"admin.tab_subjects")},{value:"materials",label:qe(this.hass,"admin.tab_materials")},{value:"exceptions",label:qe(this.hass,"admin.tab_exceptions")},{value:"holidays",label:qe(this.hass,"admin.tab_holidays")}])]}};nt=s([he("schoolday-admin-card-editor")],nt);let ot=class extends Qe{schema(){return[{name:"weather_entity",selector:{entity:{domain:"weather"}}},{name:"greeting",selector:{text:{}}},Ge("show_seconds"),Ge("show_leave")]}};function rt(e){const t={};for(const[s,a]of Object.entries(e.periods??{})){const e=a??{};t[s]="string"==typeof e.subject&&e.subject?{subject:e.subject,room:"string"==typeof e.room&&e.room?e.room:null}:null}return{label:"string"==typeof e.label&&e.label?e.label:null,periods:t,replace:!0===e.replace}}ot=s([he("schoolday-header-card-editor")],ot);const lt={members:[],routines:{},periods:[],schedules:{},colors:{},schoolCalendars:[],careKeywords:[],cancelKeywords:[],substituteKeywords:[],materials:{},subjects:[],exceptions:{},cycleWeeks:1,cycleAnchor:null,cycleNow:0,rotationNow:0,weeklyExceptions:{},weekStart:0};function dt(e){return Array.isArray(e)?e.filter(e=>"string"==typeof e):[]}function ct(e){return function(e){if(!e||"object"!=typeof e)return lt;const t=e,s=(Array.isArray(t.members)?t.members:[]).map(e=>e).filter(e=>"string"==typeof e?.id&&"string"==typeof e?.name).map(e=>({id:String(e.id),name:String(e.name),color:"string"==typeof e.color?e.color:"#3a86c8",avatar:"string"==typeof e.avatar&&e.avatar?e.avatar:null,order:Number(e.order??0),calendar:"string"==typeof e.calendar&&e.calendar?e.calendar:null,lessonsCalendar:"string"==typeof e.lessons_calendar&&e.lessons_calendar?e.lessons_calendar:null,examsCalendar:"string"==typeof e.exams_calendar&&e.exams_calendar?e.exams_calendar:null,homeworkList:"string"==typeof e.homework_list&&e.homework_list?e.homework_list:null,schedule:"string"==typeof e.schedule&&e.schedule?e.schedule:null,travelMinutes:"number"==typeof e.travel_minutes?e.travel_minutes:null,leaveTime:"string"==typeof e.leave_time&&e.leave_time?e.leave_time:null,careLeaveTime:"string"==typeof e.care_leave_time&&e.care_leave_time?e.care_leave_time:null})).sort((e,t)=>e.order-t.order),a={};for(const[e,s]of Object.entries(t.routines??{})){const t={};for(const[e,a]of Object.entries(s??{})){const s={};for(const[e,t]of Object.entries(a??{})){const a=dt(t);a.length&&(s[e]=a)}t[e]=s}a[e]=t}const i={};for(const[e,s]of Object.entries(t.colors??{}))"string"==typeof s&&(i[e]=s);const n={};for(const[e,s]of Object.entries(t.materials??{})){const t=dt(s);t.length&&(n[e]=t)}const o={};for(const[e,s]of Object.entries(t.exceptions??{})){const t={};for(const[e,a]of Object.entries(s??{}))t[e]=rt(a??{});Object.keys(t).length&&(o[e]=t)}const r={};for(const[e,s]of Object.entries(t.weekly_exceptions??{})){const t=(Array.isArray(s)?s:[]).map(e=>e??{}).filter(e=>Number.isInteger(e.weekday)&&"string"==typeof e.from&&("string"==typeof e.until||null===e.until||void 0===e.until)).map(e=>({...rt(e),weekday:Number(e.weekday),from:String(e.from),until:"string"==typeof e.until&&e.until?e.until:null}));t.length&&(r[e]=t)}return{members:s,routines:a,exceptions:o,periods:dt(t.periods),schedules:Object.fromEntries(Object.entries(t.schedules??{}).map(([e,t])=>[e,dt(t)])),colors:i,schoolCalendars:dt(t.school_calendars),careKeywords:dt(t.care_keywords),cancelKeywords:dt(t.cancel_keywords),substituteKeywords:dt(t.substitute_keywords),materials:n,subjects:dt(t.subjects),cycleWeeks:2===Number(t.cycle_weeks??1)?2:1,cycleAnchor:"string"==typeof t.cycle_anchor?t.cycle_anchor:null,cycleNow:1===Number(t.cycle_now??0)?1:0,rotationNow:Number.isInteger(t.rotation_now)?Number(t.rotation_now):0,weeklyExceptions:r,weekStart:we(t.week_start)}}(e?.attributes?.admin)}function ht(e){return Object.keys(e.states).filter(e=>e.startsWith("calendar.")).sort()}const mt=l`
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
`,ut=l`
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
`;var pt;const bt=["timetable","routines","family","subjects","materials","exceptions","holidays"],gt=["morning","evening"],_t=new Date(2024,0,1);let yt=pt=class extends de{constructor(){super(...arguments),this._config={type:""},this._section="timetable",this._block="morning",this._routineDay="0",this._exceptionDate="",this._allDays=!1,this._adding=!1,this._draftSubject="",this._draftRoom="",this._draftTurns=[],this._weekOffset=0,this._drafts={},this._busy=!1}static async getConfigElement(){return document.createElement("schoolday-admin-card-editor")}static getStubConfig(){return{section:"timetable"}}setConfig(e){this._config={...e},e.section&&bt.includes(e.section)&&(this._section=e.section)}getCardSize(){return 10}getGridOptions(){return{columns:"full",rows:"auto"}}get _board(){return He(this.hass,this._config.board_entity)}_admin(){const e=this._board;return ct(e?this.hass.states[e.entityId]:void 0)}_selected(e){return e.members.find(e=>e.id===this._memberId)??e.members[0]}async _call(e,t){if(!this._busy){this._busy=!0,this._error=void 0;try{await function(e,t,s){return e.callService("schoolday",t,s)}(this.hass,e,t)}catch(e){this._error=function(e){if("string"==typeof e)return e;if(e&&"object"==typeof e){const t=e;for(const e of["message","error"]){const s=t[e];if("string"==typeof s&&s)return s}const s=t.body;if(s&&"string"==typeof s.message&&s.message)return s.message;try{return JSON.stringify(e)}catch{return"Unknown error"}}return String(e)}(e)}finally{this._busy=!1}}}_draft(e,t,s){return this._drafts[`${e}-${t}`]??s}_setDraft(e,t,s){this._drafts={...this._drafts,[`${e}-${t}`]:s}}_weekdayName(e,t){const s=new Date(_t);return s.setDate(s.getDate()+e),new Intl.DateTimeFormat(_e(this.hass),{weekday:t}).format(s)}_memberChips(e,t){return K`
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
    `}_entityField(e,t,s,a,i,n,o=!1){return customElements.get("ha-entity-picker")?K`
        <div class="field grow">
          <ha-entity-picker
            id=${e}
            .hass=${this.hass}
            .value=${a}
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
          list=${i}
          .value=${a}
          placeholder=${`${s}.…`}
          @change=${e=>n(e.target.value)}
        />
      </label>
    `}_entitiesField(e,t,s,a,i){if(!customElements.get("ha-entity-picker"))return this._lines(e,s,a,i);const n=[...s,""];return K`
      <div class="field">
        <span class="label">${e}</span>
        ${n.map((e,a)=>K`
            <ha-entity-picker
              .hass=${this.hass}
              .value=${e}
              .includeDomains=${[t]}
              @value-changed=${e=>{const t=String(e.detail?.value??""),n=[...s];if(a>=n.length){if(!t)return;n.push(t)}else t?n[a]=t:n.splice(a,1);i(n.filter(Boolean))}}
            ></ha-entity-picker>
          `)}
      </div>
    `}_lines(e,t,s,a){return K`
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
          @click=${e=>{const t=e.target.closest(".field"),s=t?.querySelector("textarea");a((s?.value??"").split("\n").map(e=>e.trim()).filter(Boolean))}}
        >
          ${qe(this.hass,"admin.save")}
        </button>
      </label>
    `}_renderCycle(e){const t=e.cycleAnchor?function(e){const[t,s,a]=e.split("-").map(Number);if(!t||!s||!a)return null;const i=new Date(Date.UTC(t,s-1,a));i.setUTCDate(i.getUTCDate()+3-(i.getUTCDay()+6)%7);const n=new Date(Date.UTC(i.getUTCFullYear(),0,4));return n.setUTCDate(n.getUTCDate()+3-(n.getUTCDay()+6)%7),{week:1+Math.round((i.getTime()-n.getTime())/6048e5),year:i.getUTCFullYear()}}(e.cycleAnchor):null,s=e.members.some(e=>Object.values(De(Pe(this.hass,e.id))).some(e=>e.some(e=>e.rotation)));return K`
      <div class="cycle">
        <div class="segmented">
          ${[1,2].map(t=>K`
              <button
                aria-pressed=${e.cycleWeeks===t}
                ?disabled=${this._busy}
                @click=${()=>this._call("set_cycle",{weeks:t})}
              >
                ${qe(this.hass,1===t?"admin.cycle_one":"admin.cycle_two")}
              </button>
            `)}
        </div>
        ${1===e.cycleWeeks&&s?K`
              <label class="field">
                <span class="label">${qe(this.hass,"admin.rotation_start")}</span>
                <input
                  id="rotation-start"
                  type="date"
                  .value=${e.cycleAnchor??""}
                  @change=${e=>{const t=e.target.value;t&&this._call("set_cycle",{weeks:1,anchor:t})}}
                />
              </label>
            `:Z}
        ${e.cycleWeeks>1?K`
              <label class="field">
                <span class="label">${qe(this.hass,"admin.cycle_start")}</span>
                <input
                  id="cycle-week"
                  type="number"
                  min="1"
                  max="53"
                  .value=${t?String(t.week):""}
                  @change=${s=>{const a=Number(s.target.value);a>=1&&a<=53&&this._call("set_cycle",{weeks:e.cycleWeeks,iso_week:a,iso_year:t?.year})}}
                />
              </label>
              <div class="notice quiet">
                ${qe(this.hass,"admin.cycle_now",{week:1===e.cycleNow?"B":"A"})}
              </div>
            `:Z}
        <label class="field">
          <span class="label">${qe(this.hass,"admin.week_start")}</span>
          <select
            id="week-start"
            .value=${String(e.weekStart)}
            ?disabled=${this._busy}
            @change=${async t=>{const s=t.target;await this._call("set_cycle",{weeks:e.cycleWeeks,week_start:ye[Number(s.value)]}),this._error&&(s.value=String(this._admin().weekStart))}}
          >
            ${fe(0).map(t=>K`
                <option value=${String(t)} ?selected=${e.weekStart===t}>
                  ${this._weekdayName(t,"long")}
                </option>
              `)}
          </select>
        </label>
      </div>
    `}_renderTimetable(e){const t=this._selected(e),s=this._board?.timetable,a=t?De(Pe(this.hass,t.id)):{},i=Object.values(a).some(e=>e.some(e=>e.rotation)),n=i?this._weekOffset:0,o=(e,t)=>(e%t+t)%t,r=e.cycleWeeks>1?i?o(e.cycleNow+n,e.cycleWeeks):this._week??e.cycleNow:0,l=this._turn(e,(e.cycleAnchor?e.rotationNow:0)+n),d=fe(e.weekStart),c=We(a,e.weekStart),h=this._allDays?d:c;return K`
      ${this._renderCycle(e)}
      ${this._lines(qe(this.hass,"admin.periods"),e.periods,"08:00-08:45",e=>this._call("set_periods",{periods:e}))}
      ${this._renderSchedules(e)}
      ${s?.periods.length?t?K`
              ${this._memberChips(e,t)}
              ${i?this._renderWeekStep(e,n,r):Z}
              ${e.cycleWeeks>1&&!i?K`<div class="segmented week-pick">
                    ${[0,1].map(e=>K`
                        <button
                          aria-pressed=${r===e}
                          @click=${()=>{this._week=e,this._cell=void 0}}
                        >
                          ${qe(this.hass,0===e?"admin.week_a":"admin.week_b")}
                        </button>
                      `)}
                  </div>`:Z}
              ${c.length<d.length?K`<div class="chips">
                    <button
                      id="all-days"
                      class="chip ${this._allDays?"on":""}"
                      aria-pressed=${this._allDays}
                      @click=${()=>{this._allDays=!this._allDays,this._cell=void 0}}
                    >
                      ${qe(this.hass,"admin.all_days")}
                    </button>
                  </div>`:Z}
              <div
                class="week"
                style=${`grid-template-columns:max-content repeat(${h.length}, minmax(0, 1fr))`}
              >
                <div></div>
                ${h.map(e=>K`<div class="head">${this._weekdayName(e,"short")}</div>`)}
                ${s.periods.map(e=>K`
                    <div class="no">${e.index}</div>
                    ${h.map(t=>{const i=t+7*r,n=`${i}:${e.index}`,d=Me(a,i,e.index),c=d?.rotation,h=d?Ne(d,l):null,m=h?.subject??(c?"–":void 0);return K`
                        <button
                          class="slot ${h?"filled":""} ${c?"rotating":""} ${this._cell===n?"open":""}"
                          style=${h?`--subject:${s.subjects[h.subject]??"var(--schoolday-line)"}`:""}
                          @click=${()=>{this._cell=this._cell===n?void 0:n,this._draftSubject=d?.subject??"",this._draftRoom=d?.room??"",this._draftTurns=(c??[]).map(e=>({subject:e?.subject??"",room:e?.room??""}))}}
                        >
                          <span class="subject" dir="auto" title=${m??""}>${m??"+"}</span>
                          ${h?.room?K`<span class="room"><bdi>${h.room}</bdi></span>`:Z}
                          ${c?K`<span class="turn-mark"
                                >↻ ${o(l,c.length)+1}/${c.length}</span
                              >`:Z}
                        </button>
                      `})}
                  `)}
              </div>
              ${this._cell?this._renderCellEditor(t,l,n):Z}
            `:K`<div class="notice">${qe(this.hass,"admin.no_members")}</div>`:K`<div class="notice">${qe(this.hass,"admin.periods_first")}</div>`}
    `}_weekStartLabel(e,t){const s=new Date,a=(s.getDay()-e.weekStart+7)%7,i=new Date(s.getFullYear(),s.getMonth(),s.getDate()-a+7*t);return`${String(i.getDate()).padStart(2,"0")}.${String(i.getMonth()+1).padStart(2,"0")}.`}_renderWeekStep(e,t,s){const a=Ve(this.hass),i=0===t?qe(this.hass,"admin.this_week"):1===t?qe(this.hass,"admin.next_week"):qe(this.hass,"admin.week_of",{date:this._weekStartLabel(e,t)}),n=e=>{this._weekOffset=t+e,this._cell=void 0};return K`
      <div class="week-step">
        <button class="link" id="week-prev" aria-label=${qe(this.hass,"admin.week_prev")} @click=${()=>n(-1)}>
          ${a?"›":"‹"}
        </button>
        <span id="week-shown">
          ${i}${e.cycleWeeks>1?` · ${qe(this.hass,1===s?"admin.week_b":"admin.week_a")}`:""}
        </span>
        <button class="link" id="week-next" aria-label=${qe(this.hass,"admin.week_next")} @click=${()=>n(1)}>
          ${a?"‹":"›"}
        </button>
        ${0!==t?K`<button class="link" id="week-now" @click=${()=>n(-t)}>
              ${qe(this.hass,"admin.this_week")}
            </button>`:Z}
      </div>
    `}_renderTurns(e,t,s){const a=this._draftTurns,i=(e%a.length+a.length)%a.length,n=(e,t,s)=>{this._draftTurns=a.map((a,i)=>i===e?{...a,[t]:s}:a)};return K`
      <div class="notice quiet">${qe(this.hass,"admin.rotation_hint")}</div>
      ${a.map((e,s)=>K`
          <div class="row turn">
            <span class="label turn-no ${s===i?"now":""}">
              ${qe(this.hass,"admin.rotation_week",{week:String(s+1)})}${s===i?K` · ${qe(this.hass,0===t?"admin.rotation_this":"admin.rotation_shown")}`:Z}
            </span>
            <input
              class="grow subject-in"
              dir="auto"
              list="schoolday-subjects"
              aria-label=${qe(this.hass,"admin.subject")}
              placeholder=${qe(this.hass,"admin.rotation_free")}
              .value=${e.subject}
              @input=${e=>n(s,"subject",e.target.value)}
            />
            <input
              class="grow"
              dir="auto"
              aria-label=${qe(this.hass,"admin.room")}
              placeholder=${qe(this.hass,"admin.room")}
              .value=${e.room}
              @input=${e=>n(s,"room",e.target.value)}
            />
            <button
              class="link"
              aria-label=${qe(this.hass,"admin.rotation_remove")}
              @click=${()=>{const e=a.filter((e,t)=>t!==s);e.length<2?(this._draftSubject=e[0]?.subject??"",this._draftRoom=e[0]?.room??"",this._draftTurns=[]):this._draftTurns=e}}
            >
              ×
            </button>
          </div>
        `)}
      <datalist id="schoolday-subjects">
        ${s.map(e=>K`<option value=${e}></option>`)}
      </datalist>
      ${a.length<8?K`<button
            class="link"
            id="rotation-more"
            @click=${()=>{this._draftTurns=[...a,{subject:"",room:""}]}}
          >
            ${qe(this.hass,"admin.rotation_more")}
          </button>`:Z}
    `}_renderCellEditor(e,t,s){const[a,i]=this._cell.split(":").map(Number),n=a%7,o=Math.floor(a/7),r=(this._board?.timetable?.cycleWeeks??1)>1,l=Object.keys(this._board?.timetable?.subjects??{}).sort();return K`
      <div class="editor">
        <div class="editor-head">
          <bdi>${e.name}</bdi> · ${this._weekdayName(n,"long")}${r?` ${qe(this.hass,1===o?"admin.week_b":"admin.week_a")}`:""} · ${i}.
        </div>
        ${this._draftTurns.length>1?this._renderTurns(t,s,l):K`<div class="row">
          <label class="field grow">
            <span class="label">${qe(this.hass,"admin.subject")}</span>
            <input
              list="schoolday-subjects"
              .value=${this._draftSubject}
              @input=${e=>{this._draftSubject=e.target.value}}
            />
            <datalist id="schoolday-subjects">
              ${l.map(e=>K`<option value=${e}></option>`)}
            </datalist>
          </label>
          <label class="field grow">
            <span class="label">${qe(this.hass,"admin.room")}</span>
            <input
              .value=${this._draftRoom}
              @input=${e=>{this._draftRoom=e.target.value}}
            />
          </label>
        </div>
        <button
          class="link"
          id="rotation-add"
          @click=${()=>{this._draftTurns=[{subject:this._draftSubject,room:this._draftRoom},{subject:"",room:""}]}}
        >
          ${qe(this.hass,"admin.rotation_add")}
        </button>`}
        <div class="row">
          <button
            class="apply"
            ?disabled=${this._busy}
            @click=${async()=>{await this._call("set_lesson",this._draftTurns.length>1?{member:e.id,weekday:n,week:o,period:i,rotation:this._draftTurns.map(e=>({subject:e.subject.trim(),room:e.room.trim()}))}:{member:e.id,weekday:n,week:o,period:i,subject:this._draftSubject,room:this._draftRoom}),this._cell=void 0}}
          >
            ${qe(this.hass,"admin.save")}
          </button>
          <button
            class="danger"
            ?disabled=${this._busy}
            @click=${async()=>{await this._call("set_lesson",{member:e.id,weekday:n,week:o,period:i,subject:""}),this._cell=void 0}}
          >
            ${qe(this.hass,"admin.clear")}
          </button>
        </div>
      </div>
    `}_renderRoutines(e){const t=this._selected(e);if(!t)return K`<div class="notice">${qe(this.hass,"admin.no_members")}</div>`;const s=[...fe(e.weekStart).map(String),"free","care"],a=e=>"free"===e?qe(this.hass,"admin.day_free"):"care"===e?qe(this.hass,"admin.day_care"):this._weekdayName(Number(e),"short");return K`
      ${this._memberChips(e,t)}
      <div class="chips">
        ${gt.map(e=>K`
            <button
              class="chip ${e===this._block?"on":""}"
              @click=${()=>{this._block=e}}
            >
              ${qe(this.hass,`admin.block_${e}`)}
            </button>
          `)}
      </div>
      <div class="chips">
        ${s.map(e=>K`
            <button
              class="chip ${e===this._routineDay?"on":""}"
              @click=${()=>{this._routineDay=e}}
            >
              ${a(e)}
            </button>
          `)}
      </div>
      ${this._lines(`${t.name} · ${qe(this.hass,`admin.block_${this._block}`)} · ${a(this._routineDay)}`,function(e,t,s,a){return e.routines[t]?.[s]?.[a]??[]}(e,t.id,this._block,this._routineDay),qe(this.hass,"admin.steps_hint"),e=>this._call("set_routine",{member:t.id,block:this._block,day:this._routineDay,steps:e}))}
    `}_renderSchedules(e){const t=Object.keys(e.schedules);return K`
      ${t.map(t=>{const s=e.members.filter(e=>e.schedule===t);return K`
          ${this._lines(t,e.schedules[t],"08:15-09:00",e=>this._call("set_periods",{schedule:t,periods:e}))}
          <div class="row">
            <button
              class="danger"
              ?disabled=${this._busy}
              @click=${()=>{const e=s.length?qe(this.hass,1===s.length?"admin.schedule_remove_one":"admin.schedule_remove_members",{name:t,members:s.map(e=>e.name).join(", ")}):qe(this.hass,"admin.schedule_remove",{name:t});confirm(e)&&this._call("set_periods",{schedule:t,periods:[]})}}
            >
              ${qe(this.hass,"admin.remove")}
            </button>
          </div>
        `})}
      ${this._adding?K`
            <div class="row">
              <label class="field grow">
                <span class="label">${qe(this.hass,"admin.schedule_name")}</span>
                <input id="schedule-new" placeholder=${qe(this.hass,"admin.schedule_hint")} />
              </label>
              <button
                class="apply"
                ?disabled=${this._busy}
                @click=${t=>{const s=t.target.getRootNode(),a=s.querySelector("#schedule-new")?.value.trim();a&&this._call("set_periods",{schedule:a,periods:e.periods.length?e.periods:["08:00-08:45"]}).then(()=>{this._adding=!1})}}
              >
                ${qe(this.hass,"admin.add")}
              </button>
            </div>
          `:K`
            <button class="apply" ?disabled=${this._busy} @click=${()=>{this._adding=!0}}>
              ${qe(this.hass,"admin.schedule_add")}
            </button>
          `}
    `}_renderFamily(e){const t=ht(this.hass),s=(a=this.hass,Object.keys(a.states).filter(e=>e.startsWith("person.")).sort());var a;const i=function(e){return Object.keys(e.states).filter(e=>e.startsWith("todo.")).sort()}(this.hass),n=t=>{const s=t?.id??"new";return K`
        <div class="member" style=${`--member-color:${t?.color??"#3a86c8"}`}>
          <div class="row">
            <label class="field grow">
              <span class="label">${qe(this.hass,"admin.name")}</span>
              <input id=${`name-${s}`} .value=${t?.name??""} />
            </label>
            <label class="field">
              <span class="label">${qe(this.hass,"admin.color")}</span>
              <input type="color" id=${`color-${s}`} .value=${t?.color??"#3a86c8"} />
            </label>
          </div>
          <div class="row">
            ${this._entityField(`calendar-${s}`,qe(this.hass,"admin.calendar"),"calendar",this._draft(s,"calendar",t?.calendar??""),"schoolday-calendars",e=>this._setDraft(s,"calendar",e))}
          </div>
          <details
            class="more"
            ?open=${Boolean(t?.lessonsCalendar||t?.examsCalendar||t?.homeworkList)}
          >
            <summary>${qe(this.hass,"admin.school_system")}</summary>
            <div class="notice quiet">${qe(this.hass,"admin.school_system_hint")}</div>
            <div class="row">
            ${this._entityField(`lessons-${s}`,qe(this.hass,"admin.lessons_calendar"),"calendar",this._draft(s,"lessons_calendar",t?.lessonsCalendar??""),"schoolday-calendars",e=>this._setDraft(s,"lessons_calendar",e))}
            ${this._entityField(`exams-${s}`,qe(this.hass,"admin.exams_calendar"),"calendar",this._draft(s,"exams_calendar",t?.examsCalendar??""),"schoolday-calendars",e=>this._setDraft(s,"exams_calendar",e))}
            </div>
            <div class="row">
            ${this._entityField(`homeworklist-${s}`,qe(this.hass,"admin.homework_list"),"todo",this._draft(s,"homework_list",t?.homeworkList??""),"schoolday-todos",e=>this._setDraft(s,"homework_list",e))}
            </div>
          </details>
          <div class="row">
            ${this._entityField(`avatar-${s}`,qe(this.hass,"admin.avatar"),"person",this._draft(s,"avatar",t?.avatar??""),"schoolday-people",e=>this._setDraft(s,"avatar",e),!0)}
          </div>
          <div class="row">
            <label class="field">
              <span class="label">${qe(this.hass,"admin.travel")}</span>
              <input
                type="number"
                min="0"
                max="240"
                inputmode="numeric"
                id=${`travel-${s}`}
                .value=${null!=t?.travelMinutes?String(t.travelMinutes):""}
              />
            </label>
            <div class="notice quiet grow">${qe(this.hass,"admin.travel_hint")}</div>
          </div>
          <div class="row">
            <label class="field">
              <span class="label">${qe(this.hass,"admin.leave_time")}</span>
              <input
                type="time"
                id=${`leave-${s}`}
                .value=${t?.leaveTime??""}
              />
            </label>
            <label class="field">
              <span class="label">${qe(this.hass,"admin.care_leave_time")}</span>
              <input
                type="time"
                id=${`careleave-${s}`}
                .value=${t?.careLeaveTime??""}
              />
            </label>
            <div class="notice quiet grow">${qe(this.hass,"admin.leave_time_hint")}</div>
          </div>
          ${Object.keys(e.schedules).length?K`
                <div class="row">
                  <label class="field grow">
                    <span class="label">${qe(this.hass,"admin.schedule")}</span>
                    <select id=${`schedule-${s}`}>
                      <option value="" ?selected=${!t?.schedule}>
                        ${qe(this.hass,"admin.schedule_default")}
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
              @click=${e=>{const a=e.target.closest(".member"),i=e=>a.querySelector(`#${e}-${s}`)?.value??"";this._call("set_member",{...t?{member:t.id}:{},name:i("name"),color:i("color"),calendar:this._draft(s,"calendar",t?.calendar??""),lessons_calendar:this._draft(s,"lessons_calendar",t?.lessonsCalendar??""),exams_calendar:this._draft(s,"exams_calendar",t?.examsCalendar??""),homework_list:this._draft(s,"homework_list",t?.homeworkList??""),avatar:this._draft(s,"avatar",t?.avatar??""),schedule:i("schedule"),...""!==i("travel").trim()?{travel_minutes:Number(i("travel"))}:{},leave_time:i("leave"),care_leave_time:i("careleave")}).then(()=>{this._drafts={}})}}
            >
              ${qe(this.hass,t?"admin.save":"admin.add")}
            </button>
            ${t?K`
                  <button
                    class="danger"
                    ?disabled=${this._busy}
                    @click=${()=>{confirm(qe(this.hass,"admin.remove_confirm",{name:t.name}))&&this._call("remove_member",{member:t.id})}}
                  >
                    ${qe(this.hass,"admin.remove")}
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
        ${i.map(e=>K`<option value=${e}></option>`)}
      </datalist>
      <div class="notice quiet">${qe(this.hass,"admin.avatar_hint")}</div>
      ${e.members.map(e=>n(e))}
      <div class="sub-head">${qe(this.hass,"admin.add_member")}</div>
      ${n(null)}
    `}_renderSubjects(e){const t=Object.keys(this._board?.timetable?.subjects??{}).sort();return t.length?K`
      <div class="notice quiet">${qe(this.hass,"admin.colors_hint")}</div>
      <div class="subjects">
        ${t.map(t=>{const s=this._board?.timetable?.subjects[t]??"#888888",a=t in e.colors;return K`
            <div class="subject-row">
              <input
                type="color"
                .value=${s}
                @change=${e=>this._call("set_subject_color",{subject:t,color:e.target.value})}
              />
              <span class="name"><bdi>${t}</bdi></span>
              ${a?K`
                    <button
                      class="link"
                      ?disabled=${this._busy}
                      @click=${()=>this._call("set_subject_color",{subject:t})}
                    >
                      ${qe(this.hass,"admin.reset_color")}
                    </button>
                  `:Z}
            </div>
          `})}
      </div>
    `:K`<div class="notice">${qe(this.hass,"admin.no_subjects")}</div>`}_renderMaterials(e){const t=e.subjects.length?e.subjects:Object.keys(this._board?.timetable?.subjects??{}).sort();return t.length?K`
      <div class="notice quiet">${qe(this.hass,"admin.materials_hint")}</div>
      ${t.map(t=>this._lines(t,function(e,t){const s=t.toLowerCase(),a=Object.entries(e.materials).find(([e])=>e.toLowerCase()===s);return a?a[1]:[]}(e,t),qe(this.hass,"admin.materials_items"),e=>this._call("set_materials",{subject:t,items:e})))}
    `:K`<div class="notice">${qe(this.hass,"admin.no_subjects")}</div>`}static _todayKey(){const e=new Date,t=String(e.getMonth()+1).padStart(2,"0");return`${e.getFullYear()}-${t}-${String(e.getDate()).padStart(2,"0")}`}_plannedOn(e,t,s,a){const i=t=>{const s=(t.getDay()-e.weekStart+7)%7;return new Date(t.getFullYear(),t.getMonth(),t.getDate()-s)},[n,o,r]=s.split("-").map(Number),l=new Date(n,o-1,r),d=Math.round((i(l).getTime()-i(new Date).getTime())/6048e5),c=e.cycleWeeks>1&&Oe(t)?((e.cycleNow+d)%e.cycleWeeks+e.cycleWeeks)%e.cycleWeeks:0,h=Me(t,(l.getDay()+6)%7+7*c,a);return h?Ne(h,this._turn(e,e.rotationNow+d)):null}_turn(e,t){return e.cycleWeeks>1&&e.cycleAnchor?Math.floor(t/e.cycleWeeks):t}_periodRows(e,t,s,a,i=!1){return K`
      <div class="exception-periods">
        ${e.periods.map(e=>{const n=t?.periods?.[String(e.index)],o=!!t&&String(e.index)in t.periods,r=s(e.index),l=o?n?.subject??null:r?.subject??null;return K`
            <div class="exception-row">
              <span class="no">${e.index}</span>
              <span class="planned ${o&&!n?"gone":""}">
                ${l??"—"}
              </span>
              <input
                class="replacement"
                dir="auto"
                placeholder=${qe(this.hass,"admin.subject")}
                .value=${n?.subject??""}
                @change=${t=>a({period:e.index,subject:t.target.value})}
              />
              ${i?Z:K`<button
                    class="link ${o&&!n?"on":""}"
                    ?disabled=${this._busy||!r}
                    @click=${()=>a({period:e.index,cancelled:!(o&&!n)})}
                  >
                    ${qe(this.hass,"admin.exception_cancel")}
                  </button>`}
            </div>
          `})}
      </div>
    `}_renderExceptions(e){const t=this._selected(e),s=this._board?.timetable,a=s?Ce(s,t?.schedule??null):void 0;if(!t)return K`<div class="notice">${qe(this.hass,"admin.no_members")}</div>`;if(!a?.periods.length)return K`<div class="notice">${qe(this.hass,"admin.periods_first")}</div>`;const i=pt._todayKey(),n=e.exceptions[t.id]??{},o=this._exceptionDate||i,r=n[o],l=De(Pe(this.hass,t.id)),d=pt._weeklyOn(e.weeklyExceptions[t.id]??[],o),c=Boolean(d?.label&&!d.replace);return K`
      <div class="notice quiet">${qe(this.hass,"admin.exceptions_hint")}</div>
      ${this._memberChips(e,t)}

      <div class="row">
        <label class="field grow">
          <span class="label">${qe(this.hass,"admin.exception_date")}</span>
          <input
            type="date"
            min=${i}
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
        <span class="label">${qe(this.hass,"admin.exception_label")}</span>
        <input
          id="exception-label"
          placeholder=${qe(this.hass,"admin.exception_label_hint")}
          .value=${r?.label??""}
        />
        <button
          class="apply"
          ?disabled=${this._busy}
          @click=${e=>{const s=e.target.closest(".field"),a=s?.querySelector("input");this._call("set_exception",{member:t.id,date:o,label:a?.value??""})}}
        >
          ${qe(this.hass,"admin.save")}
        </button>
      </label>

      ${d?K`<div class="notice" id="weekly-applies">
            ${d.until?qe(this.hass,"admin.weekly_applies",{weekday:this._weekdayName(d.weekday,"long"),until:`${d.until.slice(8)}.${d.until.slice(5,7)}.`,label:d.label??qe(this.hass,"admin.weekly_kind_replace")}):qe(this.hass,"admin.weekly_applies_open",{weekday:this._weekdayName(d.weekday,"long"),label:d.label??qe(this.hass,"admin.weekly_kind_replace")})}
          </div>`:Z}
      ${r?.label||c?Z:this._periodRows(a,r,t=>{if(c)return null;const s=d?pt._weeklyPeriod(d,t):void 0;return void 0!==s?s:this._plannedOn(e,l,o,t)},e=>this._call("set_exception",{member:t.id,date:o,...e}))}
      ${r?K`<button
            class="link"
            ?disabled=${this._busy}
            @click=${()=>this._call("clear_exception",{member:t.id,date:o})}
          >
            ${qe(this.hass,"admin.exception_reset")}
          </button>`:d?Z:K`<div class="notice quiet">${qe(this.hass,"admin.exception_none")}</div>`}
      ${this._renderWeekly(e,t,a,l)}
    `}static _weeklyOn(e,t){const[s,a,i]=t.split("-").map(Number),n=(new Date(s,a-1,i).getDay()+6)%7;return e.find(e=>e.weekday===n&&e.from<=t&&(null===e.until||t<=e.until))}static _weeklyPeriod(e,t){const s=String(t);if(s in e.periods){const a=e.periods[s];return a?{period:t,subject:a.subject,room:a.room}:null}return e.replace?null:void 0}_renderWeekly(e,t,s,a){const i=pt._todayKey(),n=e.weeklyExceptions[t.id]??[],o=this._weekly??{weekday:((new Date).getDay()+6)%7,from:i,until:"",replace:!1},r=n.find(e=>e.weekday===o.weekday&&e.from===o.from),l=r?r.replace:o.replace,d={member:t.id,weekday:o.weekday,from:o.from},c=e=>`${e.slice(8)}.${e.slice(5,7)}.`,h=e=>this._call("set_weekly_exception",{...d,until:o.until,replace:l,...e}),m=Boolean(o.from)&&(void 0!==this._weekly||void 0!==r);return K`
      <h3 class="subhead">${qe(this.hass,"admin.weekly_title")}</h3>
      <div class="notice quiet">${qe(this.hass,"admin.weekly_hint")}</div>
      <div class="chips">
        ${n.map(e=>K`
            <button
              class="chip ${e===r?"on":""}"
              @click=${()=>{this._weekly={weekday:e.weekday,from:e.from,until:e.until??"",replace:e.replace}}}
            >
              ${this._weekdayName(e.weekday,"short")} ·
              ${e.until?K`<bdi dir="ltr">${c(e.from)}–${c(e.until)}</bdi>`:qe(this.hass,"admin.weekly_open",{from:c(e.from)})}
            </button>
          `)}
        ${n.length?K`<button
              class="chip ${r?"":"on"}"
              @click=${()=>{this._weekly=void 0}}
            >
              ${qe(this.hass,"admin.weekly_new")}
            </button>`:Z}
      </div>
      <div class="row dates">
        <label class="field grow">
          <span class="label">${qe(this.hass,"admin.weekly_weekday")}</span>
          <select
            id="weekly-weekday"
            .value=${String(o.weekday)}
            @change=${e=>{this._weekly={...o,weekday:Number(e.target.value)}}}
          >
            ${fe(e.weekStart).map(e=>K`
                <option value=${String(e)} ?selected=${o.weekday===e}>
                  ${this._weekdayName(e,"long")}
                </option>
              `)}
          </select>
        </label>
        <label class="field grow">
          <span class="label">${qe(this.hass,"admin.weekly_from")}</span>
          <input
            id="weekly-from"
            type="date"
            .value=${o.from}
            @change=${e=>{this._weekly={...o,from:e.target.value}}}
          />
        </label>
        <label class="field grow">
          <span class="label">${qe(this.hass,"admin.weekly_until")}</span>
          <input
            id="weekly-until"
            type="date"
            min=${o.from>i?o.from:i}
            .value=${o.until}
            @change=${e=>{const t=e.target.value;this._weekly={...o,until:t},r&&this._call("set_weekly_exception",{...d,until:t})}}
          />
        </label>
      </div>
      <div class="segmented weekly-kind">
        ${[!1,!0].map(e=>K`
            <button
              id=${e?"weekly-replace":"weekly-off"}
              aria-pressed=${l===e}
              ?disabled=${this._busy}
              @click=${()=>{this._weekly={...o,replace:e},r&&r.replace!==e&&this._call("set_weekly_exception",{...d,replace:e})}}
            >
              ${qe(this.hass,e?"admin.weekly_kind_replace":"admin.weekly_kind_off")}
            </button>
          `)}
      </div>
      <div class="notice quiet">
        ${qe(this.hass,l?"admin.weekly_replace_hint":"admin.weekly_off_hint")}
      </div>
      <label class="field">
        <span class="label"
          >${qe(this.hass,l?"admin.weekly_name":"admin.exception_label")}</span
        >
        <input
          id="weekly-label"
          dir="auto"
          placeholder=${qe(this.hass,l?"admin.weekly_name_hint":"admin.weekly_label_hint")}
          .value=${r?.label??""}
        />
        <button
          class="apply"
          id="weekly-save"
          ?disabled=${this._busy||!o.from}
          @click=${e=>{const t=e.target.closest(".field"),s=t?.querySelector("input");h({label:s?.value??""})}}
        >
          ${qe(this.hass,"admin.save")}
        </button>
      </label>
      ${!m||!l&&r?.label?Z:this._periodRows(s,r,t=>{const s=r?pt._weeklyPeriod(r,t):void 0;return void 0!==s?s:l?null:this._plannedOn(e,a,(()=>{const[e,t,s]=o.from.split("-").map(Number),a=new Date(e,t-1,s);a.setDate(a.getDate()+(o.weekday-(a.getDay()+6)%7+7)%7);const i=String(a.getMonth()+1).padStart(2,"0");return`${a.getFullYear()}-${i}-${String(a.getDate()).padStart(2,"0")}`})(),t)},h,l)}
      ${r?K`<button
            class="link"
            id="weekly-remove"
            ?disabled=${this._busy}
            @click=${async()=>{await this._call("clear_weekly_exception",d),this._weekly=void 0}}
          >
            ${qe(this.hass,"admin.weekly_remove")}
          </button>`:Z}
    `}_renderHolidays(e){const t=ht(this.hass);return K`
      <div class="notice quiet">${qe(this.hass,"admin.calendars_hint")}</div>
      <datalist id="schoolday-calendars">
        ${t.map(e=>K`<option value=${e}></option>`)}
      </datalist>
      ${this._entitiesField(qe(this.hass,"admin.school_calendars"),"calendar",e.schoolCalendars,"calendar.schulferien",e=>this._call("set_calendars",{school_calendars:e}))}
      ${this._lines(qe(this.hass,"admin.care_keywords"),e.careKeywords,qe(this.hass,"admin.care_hint"),e=>this._call("set_calendars",{care_keywords:e}))}
      ${e.members.some(e=>e.lessonsCalendar)?K`
            <details class="more">
              <summary>${qe(this.hass,"admin.school_words")}</summary>
              <div class="notice quiet">${qe(this.hass,"admin.school_words_hint")}</div>
              ${this._lines(qe(this.hass,"admin.cancel_keywords"),e.cancelKeywords,qe(this.hass,"admin.cancel_hint"),e=>this._call("set_calendars",{cancel_keywords:e}))}
              ${this._lines(qe(this.hass,"admin.substitute_keywords"),e.substituteKeywords,qe(this.hass,"admin.substitute_hint"),e=>this._call("set_calendars",{substitute_keywords:e}))}
            </details>
          `:Z}
    `}willUpdate(){this.dir=Ve(this.hass)?"rtl":""}render(){if(!this.hass)return K`<ha-card></ha-card>`;if(!this._board)return K`<ha-card><div class="notice">${qe(this.hass,"board.missing")}</div></ha-card>`;const e=this._admin();return K`
      <ha-card>
        <div class="tabs">
          ${bt.map(e=>K`
              <button
                class="tab ${e===this._section?"on":""}"
                @click=${()=>{this._section=e,this._cell=void 0,this._error=void 0}}
              >
                ${qe(this.hass,`admin.tab_${e}`)}
              </button>
            `)}
        </div>
        ${this._error?K`<div class="notice error">${this._error}</div>`:Z}
        <div class="body">
          ${"timetable"===this._section?this._renderTimetable(e):"routines"===this._section?this._renderRoutines(e):"family"===this._section?this._renderFamily(e):"subjects"===this._section?this._renderSubjects(e):"materials"===this._section?this._renderMaterials(e):"exceptions"===this._section?this._renderExceptions(e):this._renderHolidays(e)}
        </div>
      </ha-card>
    `}};yt.styles=[mt,ut,l`
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
      select,
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

      .turn {
        align-items: center;
      }

      .turn input {
        min-width: 0;
        flex: 1 1 6em;
      }

      .turn .subject-in {
        flex-grow: 2;
      }

      /* Above its fields rather than beside them, so a phone keeps the width for the
         subject and the row marked "this week" lines up with the others. */
      .turn-no {
        flex: 1 0 100%;
      }

      .turn .link {
        min-width: var(--schoolday-touch);
      }

      /* A narrow column cuts a long subject off. It ends in an ellipsis at the end of
         its own script — "Deuts…", not "eutsch" — and the cell's title has the rest. */
      .slot .subject {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      /* On a phone five columns leave a cell about sixty pixels: give the subject the
         padding back and a slightly smaller face, so "Musik" fits instead of "Mu…". */
      @media (max-width: 500px) {
        .slot {
          padding: 4px 3px;
          font-size: 0.8rem;
        }
      }

      .slot .turn-mark {
        font-size: 0.7rem;
        font-weight: 400;
        color: var(--schoolday-muted);
      }

      .week-step {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .week-step #week-shown {
        font-weight: 700;
        min-width: 8em;
        text-align: center;
      }

      /* A date field squeezed below this width cuts its own year off. */
      .dates .field {
        min-width: 10em;
      }

      .turn-no.now {
        color: var(--schoolday-today);
        font-weight: 700;
      }

      .subhead {
        margin: 12px 0 0;
        font-size: 1rem;
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
    `],s([pe({attribute:!1})],yt.prototype,"hass",void 0),s([be()],yt.prototype,"_config",void 0),s([be()],yt.prototype,"_section",void 0),s([be()],yt.prototype,"_memberId",void 0),s([be()],yt.prototype,"_block",void 0),s([be()],yt.prototype,"_routineDay",void 0),s([be()],yt.prototype,"_exceptionDate",void 0),s([be()],yt.prototype,"_week",void 0),s([be()],yt.prototype,"_allDays",void 0),s([be()],yt.prototype,"_cell",void 0),s([be()],yt.prototype,"_adding",void 0),s([be()],yt.prototype,"_draftSubject",void 0),s([be()],yt.prototype,"_draftRoom",void 0),s([be()],yt.prototype,"_draftTurns",void 0),s([be()],yt.prototype,"_weekly",void 0),s([be()],yt.prototype,"_weekOffset",void 0),s([be()],yt.prototype,"_drafts",void 0),s([be()],yt.prototype,"_busy",void 0),s([be()],yt.prototype,"_error",void 0),yt=pt=s([he("schoolday-admin-card")],yt),window.customCards=window.customCards??[],window.customCards.push({type:"schoolday-admin-card",name:"Schoolday Admin",description:"Edit the timetable, routines, family and holidays from the dashboard.",preview:!1,documentationURL:"https://github.com/DomCim/HA-Schoolday"});function ft(e){const[t,s,a]=e.split("-").map(Number);return new Date(t,s-1,a)}function wt(e,t){return Math.round((t.getTime()-e.getTime())/864e5)}function vt(e,t){const s=new Date(e),a=(s.getDay()+6)%7;return s.setDate(s.getDate()-(a-t+7)%7),s}let kt=class extends de{constructor(){super(...arguments),this._config={type:""}}static async getConfigElement(){return document.createElement("schoolday-exams-card-editor")}static getStubConfig(){return{}}setConfig(e){this._config={...e}}getCardSize(){return 4}getGridOptions(){return{columns:12,rows:"auto",min_columns:6}}_entries(e){const t=ft(Le()),s=Number(this._config.days),a=[];for(const i of e)for(const e of Ee(Pe(this.hass,i.id)?.attributes?.exams)){if(!/^\d{4}-\d{2}-\d{2}$/.test(e.date))continue;const n=wt(t,ft(e.date));n<0||s>0&&n>=s||a.push({member:i,exam:e,inDays:n})}return a.sort((e,t)=>e.exam.date.localeCompare(t.exam.date)||(e.exam.start??"").localeCompare(t.exam.start??"")||e.member.order-t.member.order)}_weekHead(e){return 0===e?qe(this.hass,"exams.this_week"):1===e?qe(this.hass,"exams.next_week"):qe(this.hass,"exams.in_weeks",{weeks:e})}_weekRange(e){const t=new Date(e);t.setDate(t.getDate()+4);const s=new Intl.DateTimeFormat(_e(this.hass),{day:"numeric",month:"short"});return`${s.format(e)} – ${s.format(t)}`}_when(e){return 0===e?qe(this.hass,"exams.today"):1===e?qe(this.hass,"exams.tomorrow"):qe(this.hass,"exams.in_days",{days:e})}_renderEntry(e,t){const{member:s,exam:a,inDays:i}=e,n=ft(a.date),o=_e(this.hass),r=t?Fe(this.hass,s.avatar):null,l=null!==a.period?qe(this.hass,"exams.period",{period:a.period}):a.start??"";return K`
      <div
        class="exam ${i<=1?"soon":""}"
        style=${`--member-color:${s.color}`}
      >
        <div class="date">
          <span class="weekday">
            ${new Intl.DateTimeFormat(o,{weekday:"short"}).format(n)}
          </span>
          <span class="day">
            ${new Intl.DateTimeFormat(o,{day:"numeric",month:"numeric"}).format(n)}
          </span>
        </div>
        <div class="what">
          <span class="title"><bdi>${a.title}</bdi></span>
          <span class="meta">
            ${t?K`<span class="who">
                  ${r?K`<img class="avatar" src=${r} alt="" />`:Z}
                  <bdi>${s.name}</bdi>
                </span>`:Z}
            ${l?K`<span class="slot">${l}</span>`:Z}
          </span>
        </div>
        <span class="when">${this._when(i)}</span>
      </div>
    `}willUpdate(){this.dir=Ve(this.hass)?"rtl":""}render(){if(!this.hass)return K`<ha-card></ha-card>`;const e=He(this.hass,this._config.board_entity);if(!e)return K`<ha-card><div class="notice">${qe(this.hass,"board.missing")}</div></ha-card>`;const t=(this._config.members??(this._config.member?[this._config.member]:[])).map(e=>e.toLowerCase()),s=e.members.filter(e=>!t.length||t.includes(e.id.toLowerCase())||t.includes(e.name.toLowerCase())),a=this._entries(s);if(!a.length)return K`<ha-card><div class="notice">${qe(this.hass,"exams.none")}</div></ha-card>`;const i=s.length>1,n=e.timetable?.weekStart??0,o=vt(ft(Le()),n),r=new Map;for(const e of a){const t=Math.round(wt(o,vt(ft(e.exam.date),n))/7);r.set(t,[...r.get(t)??[],e])}return K`
      <ha-card>
        ${[...r.entries()].map(([e,t])=>{const s=new Date(o);return s.setDate(s.getDate()+7*e),K`
            <div class="week">
              <div class="week-head">
                <span>${this._weekHead(e)}</span>
                <span class="range">${this._weekRange(s)}</span>
              </div>
              ${t.map(e=>this._renderEntry(e,i))}
            </div>
          `})}
      </ha-card>
    `}};kt.styles=[mt,l`
      ha-card {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 12px;
        box-sizing: border-box;
      }

      .week {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .week-head {
        display: flex;
        align-items: baseline;
        gap: 8px;
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--schoolday-muted);
      }

      .week-head .range {
        font-weight: 400;
        text-transform: none;
        letter-spacing: 0;
      }

      .exam {
        display: flex;
        align-items: center;
        gap: 12px;
        min-height: var(--schoolday-touch);
        padding: 6px 10px;
        border-radius: 8px;
        background: color-mix(in srgb, var(--member-color) 14%, var(--schoolday-surface));
      }

      /* Today and tomorrow are the two days where the list stops being a plan and
         becomes the evening's revision, so they are the ones that stand out. */
      .exam.soon {
        background: color-mix(in srgb, var(--member-color) 24%, var(--schoolday-surface));
      }

      .date {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 44px;
        line-height: 1.15;
        font-variant-numeric: tabular-nums;
      }

      .weekday {
        font-size: 0.72rem;
        text-transform: uppercase;
        color: var(--schoolday-muted);
      }

      /* The child's colour on the date as well as on the name, so a card showing one
         child, which leaves the name off, still says whose list it is. */
      .day {
        font-weight: 700;
        color: var(--member-color);
      }

      .what {
        display: flex;
        flex-direction: column;
        min-width: 0;
        flex: 1;
      }

      .title {
        font-size: 1rem;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .meta {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.8rem;
        color: var(--schoolday-muted);
      }

      .who {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-weight: 600;
        color: var(--member-color);
      }

      .who .avatar {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        object-fit: cover;
      }

      .when {
        flex: none;
        font-size: 0.8rem;
        color: var(--schoolday-muted);
        white-space: nowrap;
      }

      .exam.soon .when {
        font-weight: 700;
        color: var(--primary-text-color);
      }

      .notice {
        padding: 8px 2px;
        color: var(--schoolday-muted);
        font-size: 0.9rem;
      }
    `],s([pe({attribute:!1})],kt.prototype,"hass",void 0),s([be()],kt.prototype,"_config",void 0),kt=s([he("schoolday-exams-card")],kt),window.customCards=window.customCards||[],window.customCards.push({type:"schoolday-exams-card",name:"Schoolday Exams",description:"The exams still to come for every child, week by week.",preview:!0,documentationURL:"https://github.com/DomCim/HA-Schoolday"});let $t=class extends de{constructor(){super(...arguments),this._config={type:""},this._now=new Date}static async getConfigElement(){return document.createElement("schoolday-header-card-editor")}static getStubConfig(){return{show_seconds:!1,show_leave:!0}}setConfig(e){this._config={...e}}getCardSize(){return 2}getGridOptions(){return{columns:"full",rows:"auto"}}connectedCallback(){super.connectedCallback();const e=this._config.show_seconds?1e3:2e4;this._timer=window.setInterval(()=>{this._now=new Date},e)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&(window.clearInterval(this._timer),this._timer=void 0)}_weather(){const e=this._config.weather_entity;if(!e)return Z;const t=this.hass.states[e];if(!t)return Z;const s=t.attributes?.temperature,a=t.attributes?.temperature_unit??"",i=this.hass.formatEntityState(t);return K`
      <div class="weather">
        <div class="temperature">
          ${"number"==typeof s?`${Math.round(s)}${a}`:"—"}
        </div>
        <div class="condition">${i}</div>
      </div>
    `}_leaving(){if(!1===this._config.show_leave)return Z;const e=He(this.hass);if(!e)return Z;const t=this._now,s=t.toDateString(),a=e.members.flatMap(e=>{const a=Pe(this.hass,e.id)?.attributes??{},i=a.leave_at,n=a.leave_until,o=a.school_start;if("string"!=typeof i)return[];const r=new Date(i);if(Number.isNaN(r.getTime())||r.toDateString()!==s)return[];let l="string"==typeof n?new Date(n):null;if(!l&&"string"==typeof o){const[e,t]=o.split(":").map(Number);l=new Date(r),l.setHours(e,t,0,0)}if(!l||Number.isNaN(l.getTime())||t>=l)return[];const d=Math.ceil((r.getTime()-t.getTime())/6e4),c=d<=0?qe(this.hass,"header.leave_now"):d<=60?qe(this.hass,"header.leave_in",{minutes:d}):qe(this.hass,"header.leave_at",{time:new Intl.DateTimeFormat(_e(this.hass),{hour:"2-digit",minute:"2-digit",hour12:ge(this.hass)}).format(r)});return[K`
          <div class=${`leave ${d<=0?"go":d<=10?"soon":""}`} style=${`--member-color:${e.color}`}>
            <span class="dot"></span>
            <span class="who"><bdi>${e.name}</bdi></span>
            <span class="when">${c}</span>
          </div>
        `]});return a.length?K`<div class="leaving">${a}</div>`:Z}willUpdate(){this.dir=Ve(this.hass)?"rtl":""}render(){if(!this.hass)return K`<ha-card></ha-card>`;const e=_e(this.hass),t=new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit",...this._config.show_seconds?{second:"2-digit"}:{},hour12:ge(this.hass)}).format(this._now),s=new Intl.DateTimeFormat(e,{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(this._now);return K`
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
    `}};var xt;$t.styles=[mt,l`
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
    `],s([pe({attribute:!1})],$t.prototype,"hass",void 0),s([be()],$t.prototype,"_config",void 0),s([be()],$t.prototype,"_now",void 0),$t=s([he("schoolday-header-card")],$t),window.customCards=window.customCards||[],window.customCards.push({type:"schoolday-header-card",name:"Schoolday Header",description:"Clock, date and weather, sized to be read from across the room.",preview:!0,documentationURL:"https://github.com/DomCim/HA-Schoolday"});const St=["overdue","today","tomorrow","later","someday"],At="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",jt="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z";let Ct=xt=class extends de{constructor(){super(...arguments),this._config={type:""},this._pending=new Set}static async getConfigElement(){return document.createElement("schoolday-homework-card-editor")}static getStubConfig(){return{}}setConfig(e){this._config={...e}}getCardSize(){return 6}getGridOptions(){return{columns:"full",rows:"auto"}}_list(e){return Object.values(this.hass.states).find(t=>t.entity_id.startsWith("todo.")&&t.attributes?.member_id===e)}_items(e){const t=this._list(e)?.attributes?.homework;return Array.isArray(t)?t.filter(e=>Boolean(e)&&"object"==typeof e).map(e=>({uid:String(e.uid??""),summary:String(e.summary??""),due:"string"==typeof e.due&&e.due?e.due:null,done:Boolean(e.done)})).filter(e=>e.uid&&e.summary):[]}static _bucket(e,t){if(!e)return"someday";if(e<t)return"overdue";if(e===t)return"today";const s=new Date(`${t}T00:00:00`);return s.setDate(s.getDate()+1),e===Le(s)?"tomorrow":"later"}_dueLabel(e){if(!e)return null;const[t,s,a]=e.split("-").map(Number);return new Intl.DateTimeFormat(_e(this.hass),{weekday:"short",day:"numeric",month:"numeric"}).format(new Date(t,s-1,a))}async _toggle(e,t){const s=this._list(e);if(s){this._pending=new Set(this._pending).add(t.uid);try{await this.hass.callService("todo","update_item",{entity_id:s.entity_id,item:t.uid,status:t.done?"needs_action":"completed"})}catch(e){console.warn("[schoolday] could not update homework",e)}finally{const e=new Set(this._pending);e.delete(t.uid),this._pending=e}}}_icon(e,t=""){return K`<svg class=${t} viewBox="0 0 24 24"><path d=${e} /></svg>`}_renderItem(e,t,s){const a=this._pending.has(t.uid),i=a?!t.done:t.done,n="today"===s||"tomorrow"===s?null:this._dueLabel(t.due);return K`
      <button
        class="item ${i?"done":""} ${a?"pending":""}"
        @click=${()=>this._toggle(e.id,t)}
      >
        ${this._icon(i?jt:At,"tick")}
        <span class="label"><bdi>${t.summary}</bdi></span>
        ${n?K`<span class="due">${n}</span>`:Z}
      </button>
    `}willUpdate(){this.dir=Ve(this.hass)?"rtl":""}render(){if(!this.hass)return K`<ha-card></ha-card>`;const e=He(this.hass,this._config.board_entity);if(!e)return K`<ha-card><div class="notice">${qe(this.hass,"board.missing")}</div></ha-card>`;const t=(this._config.members??(this._config.member?[this._config.member]:[])).map(e=>e.toLowerCase()),s=!0===this._config.show_done,a=Le(),i=e.members.filter(e=>!t.length||t.includes(e.id.toLowerCase())||t.includes(e.name.toLowerCase())).map(e=>({member:e,items:this._items(e.id).filter(e=>s||!e.done)})).filter(e=>!0===this._config.show_empty||e.items.length>0);return i.length?K`
      <ha-card>
        <div class="grid">
          ${i.map(({member:e,items:t})=>K`
              <div class="person" style=${`--member-color:${e.color}`}>
                <div class="person-name">
                  ${Fe(this.hass,e.avatar)?K`<img class="avatar" src=${Fe(this.hass,e.avatar)} alt="" />`:Z}
                  <span><bdi>${e.name}</bdi></span>
                  <span class="count">${t.filter(e=>!e.done).length}</span>
                </div>
                ${0===t.length?K`<div class="empty">${qe(this.hass,"homework.nothing")}</div>`:St.map(s=>{const i=t.filter(e=>xt._bucket(e.due,a)===s);return i.length?K`
                        <div class="bucket ${s}">
                          <div class="bucket-head">${qe(this.hass,`homework.${s}`)}</div>
                          ${i.map(t=>this._renderItem(e,t,s))}
                        </div>
                      `:Z})}
              </div>
            `)}
        </div>
      </ha-card>
    `:K`
        <ha-card><div class="notice">${qe(this.hass,"homework.all_done")}</div></ha-card>
      `}};Ct.styles=[mt,ut,l`
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
    `],s([pe({attribute:!1})],Ct.prototype,"hass",void 0),s([be()],Ct.prototype,"_config",void 0),s([be()],Ct.prototype,"_pending",void 0),Ct=xt=s([he("schoolday-homework-card")],Ct),window.customCards=window.customCards||[],window.customCards.push({type:"schoolday-homework-card",name:"Schoolday Homework",description:"What each child still has to do, grouped by when it is due.",preview:!0,documentationURL:"https://github.com/DomCim/HA-Schoolday"});const Dt={morning:"M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z",evening:"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95Z"},Et={unchecked:"M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",checked:"M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z",...Dt};let zt=class extends de{constructor(){super(...arguments),this._config={type:""},this._pending=new Set}static async getConfigElement(){return document.createElement("schoolday-routines-card-editor")}static getStubConfig(){return{block:"auto",evening_from:14}}setConfig(e){this._config={...e}}getCardSize(){return 6}getGridOptions(){return{columns:"full",rows:"auto"}}get _blocks(){const e=this._config.block??"auto";if("morning"===e||"evening"===e)return[e];if("both"===e)return["morning","evening"];const t=this._config.evening_from??14;return[(new Date).getHours()<t?"morning":"evening"]}_steps(e,t){const s=Pe(this.hass,e.id),a=s?.attributes?.[`routine_${t}`];return Array.isArray(a)?a.filter(e=>Boolean(e)&&"object"==typeof e).map(e=>({step:String(e.step??""),done:Boolean(e.done),..."string"==typeof e.subject&&e.subject?{subject:e.subject}:{}})):[]}_examsTomorrow(e){const t=Pe(this.hass,e.id)?.attributes?.tomorrow_exams;return Array.isArray(t)?t.filter(e=>"string"==typeof e&&""!==e):[]}_isSick(e){return"sick"===Pe(this.hass,e.id)?.attributes?.day_mode}async _toggle(e,t,s){const a=`${e.id}|${t}|${s.step}`;this._pending=new Set(this._pending).add(a);try{await this.hass.callService("schoolday","set_routine_step",{member:e.id,block:t,step:s.step,done:!s.done})}catch(e){console.warn("[schoolday] could not update routine step",e)}finally{const e=new Set(this._pending);e.delete(a),this._pending=e}}_icon(e,t=""){return K`<svg class=${t} viewBox="0 0 24 24"><path d=${e} /></svg>`}_renderBlock(e,t){const s=this._steps(e,t),a=s.filter(e=>e.done).length,i=s.length>0&&a===s.length,n="evening"===t?this._examsTomorrow(e):[];return K`
      <section class="block ${i?"complete":""}">
        <header class="block-head">
          ${this._icon("morning"===t?Et.morning:Et.evening,"block-icon")}
          <span class="progress">${a}/${s.length}</span>
        </header>

        ${n.map(e=>K`<div class="exam-note">
            <span class="exam-label">${qe(this.hass,"routines.exam_tomorrow")}</span>
            <span>${e}</span>
          </div>`)}
        ${0===s.length&&n.length?Z:0===s.length?K`<div class="empty">${qe(this.hass,"routines.nothing_today")}</div>`:K`
              <div class="bar">
                <div
                  class="bar-fill"
                  style=${`width:${s.length?a/s.length*100:0}%`}
                ></div>
              </div>
              ${s.map(s=>{const a=`${e.id}|${t}|${s.step}`,i=this._pending.has(a),n=i?!s.done:s.done;return K`
                  <button
                    class="step ${n?"done":""} ${i?"pending":""}"
                    @click=${()=>this._toggle(e,t,s)}
                  >
                    ${this._icon(n?Et.checked:Et.unchecked,"tick")}
                    <span class="label"><bdi>${s.step}</bdi></span>
                    ${s.subject?K`<span
                          class="from"
                          title=${qe(this.hass,"routines.packed_for",{subject:s.subject})}
                          ><bdi>${s.subject}</bdi></span
                        >`:Z}
                  </button>
                `})}
            `}
      </section>
    `}willUpdate(){this.dir=Ve(this.hass)?"rtl":""}render(){if(!this.hass)return K`<ha-card></ha-card>`;const e=He(this.hass,this._config.board_entity);if(!e)return K`<ha-card
        ><div class="notice">${qe(this.hass,"board.missing")}</div></ha-card
      >`;const t=this._blocks,s=(this._config.members??(this._config.member?[this._config.member]:[])).map(e=>e.toLowerCase()),a=e.members.filter(e=>!(s.length&&!s.includes(e.id.toLowerCase())&&!s.includes(e.name.toLowerCase()))&&(!0===this._config.show_empty||(!!this._isSick(e)||t.some(t=>this._steps(e,t).length>0||"evening"===t&&this._examsTomorrow(e).length>0))));return 0===a.length?K`
        <ha-card>
          <div class="notice">${qe(this.hass,"routines.none_configured")}</div>
        </ha-card>
      `:K`
      <ha-card>
        <div class="grid">
          ${a.map(e=>K`
              <div
                class="person ${this._isSick(e)?"sick":""}"
                style=${`--member-color:${e.color}`}
              >
                <div class="person-name">
                  ${Fe(this.hass,e.avatar)?K`<img class="avatar" src=${Fe(this.hass,e.avatar)} alt="" />`:Z}
                  <span><bdi>${e.name}</bdi></span>
                </div>
                ${this._isSick(e)?K`<div class="sick-note">${qe(this.hass,"routines.sick")}</div>`:t.map(t=>this._renderBlock(e,t))}
              </div>
            `)}
        </div>
      </ha-card>
    `}};zt.styles=[mt,ut,l`
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
    `],s([pe({attribute:!1})],zt.prototype,"hass",void 0),s([be()],zt.prototype,"_config",void 0),s([be()],zt.prototype,"_pending",void 0),zt=s([he("schoolday-routines-card")],zt),window.customCards=window.customCards||[],window.customCards.push({type:"schoolday-routines-card",name:"Schoolday Routines",description:"Daily routines per child and weekday, ticked off by the kids themselves.",preview:!0,documentationURL:"https://github.com/DomCim/HA-Schoolday"});const Nt="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M16.53,11.06L15.47,10L10.59,14.88L8.47,12.76L7.41,13.82L10.59,17L16.53,11.06Z";let Tt=class extends de{constructor(){super(...arguments),this._config={type:""}}static async getConfigElement(){return document.createElement("schoolday-stats-card-editor")}static getStubConfig(){return{days:30,show_steps:!0}}setConfig(e){this._config={...e}}getCardSize(){return 6}getGridOptions(){return{columns:"full",rows:"auto"}}_stats(e){const t=Pe(this.hass,e.id)?.attributes?.routine_stats;if(!t||"object"!=typeof t)return null;const s=t;return{date:String(s.date??""),rate:"number"==typeof s.rate?s.rate:null,streak:Number(s.streak??0),best_streak:Number(s.best_streak??0),blocks:s.blocks??{},steps:Array.isArray(s.steps)?s.steps:[],days:Array.isArray(s.days)?s.days:[]}}_window(e){const t=Number(this._config.days),s=Number.isFinite(t)?Math.max(7,t):30;return e.days.slice(-s)}_percent(e){return null===e?"—":qe(this.hass,"stats.percent",{value:e})}_icon(e,t=""){return K`<svg class=${t} viewBox="0 0 24 24"><path d=${e} /></svg>`}_dayTitle(e){const t=new Date(`${e.date}T12:00:00`).toLocaleDateString(_e(this.hass),{weekday:"short",day:"numeric",month:"short"});return"sick"===e.mode?`${t} — ${qe(this.hass,"routines.sick")}`:e.asked?`${t} — ${qe(this.hass,"stats.day_done",{done:e.done,asked:e.asked})}`:`${t} — ${qe(this.hass,"stats.nothing_asked")}`}_renderStrip(e){const t=this._window(e),s=e=>e?new Date(`${e.date}T12:00:00`).toLocaleDateString(_e(this.hass),{day:"numeric",month:"short"}):"";return K`
      <div class="strip">
        ${t.map(t=>{const s=t.asked?t.done/t.asked:0,a=t.date===e.date;return K`
            <div
              class="day ${t.asked?"":"empty"} ${"sick"===t.mode?"sick":""} ${a?"today":""}"
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
      <div class="row" title=${qe(this.hass,`routines.${e}`)}>
        ${this._icon(Dt[e],"row-icon")}
        <div class="meter">
          <div class="meter-fill" style=${`width:${s??0}%`}></div>
        </div>
        <span class="value">${this._percent(s)}</span>
      </div>
    `}_renderStep(e){const t=Dt[e.block];return K`
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
              ${this._icon(Nt,"streak-icon")}
              <span
                >${e.streak>0?qe(this.hass,"stats.streak",{days:e.streak}):qe(this.hass,"stats.best",{days:e.best_streak})}</span
              >
              ${e.streak>0&&e.best_streak>e.streak?K`<span class="best"
                    >${qe(this.hass,"stats.best",{days:e.best_streak})}</span
                  >`:Z}
            `:Z}
      </div>
    `}_renderMember(e,t){const s=this._window(t).filter(e=>e.asked>0).length,a=!1!==this._config.show_steps&&t.steps.length>0;return K`
      <div class="person" style=${`--member-color:${e.color}`}>
        <div class="person-head">
          ${Fe(this.hass,e.avatar)?K`<img class="avatar" src=${Fe(this.hass,e.avatar)} alt="" />`:Z}
          <div class="who">
            <span class="name"><bdi>${e.name}</bdi></span>
            ${s>0?K`<span class="window"
                  >${qe(this.hass,1===s?"stats.window_one":"stats.window",{days:s})}</span
                >`:Z}
          </div>
          <span class="rate">${this._percent(t.rate)}</span>
        </div>

        ${this._renderStreak(t)}

        ${0===s?K`<div class="empty-note">${qe(this.hass,"stats.nothing_yet")}</div>`:K`
              ${this._renderStrip(t)}
              <div class="blocks">
                ${["morning","evening"].map(e=>this._renderBlock(e,t.blocks?.[e]))}
              </div>
              ${a?K`<div class="steps">${t.steps.map(e=>this._renderStep(e))}</div>`:Z}
            `}
      </div>
    `}willUpdate(){this.dir=Ve(this.hass)?"rtl":""}render(){if(!this.hass)return K`<ha-card></ha-card>`;const e=He(this.hass,this._config.board_entity);if(!e)return K`<ha-card><div class="notice">${qe(this.hass,"board.missing")}</div></ha-card>`;const t=(this._config.members??(this._config.member?[this._config.member]:[])).map(e=>e.toLowerCase()),s=e.members.filter(e=>!t.length||t.includes(e.id.toLowerCase())||t.includes(e.name.toLowerCase())).map(e=>({member:e,stats:this._stats(e)})).filter(e=>null!==e.stats&&e.stats.days.some(e=>e.asked>0));return"rate"===this._config.sort&&s.sort((e,t)=>(t.stats.rate??-1)-(e.stats.rate??-1)),0===s.length?K`
        <ha-card><div class="notice">${qe(this.hass,"stats.none_configured")}</div></ha-card>
      `:K`
      <ha-card>
        <div class="grid">
          ${s.map(e=>this._renderMember(e.member,e.stats))}
        </div>
      </ha-card>
    `}};Tt.styles=[mt,ut,l`
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
    `],s([pe({attribute:!1})],Tt.prototype,"hass",void 0),s([be()],Tt.prototype,"_config",void 0),Tt=s([he("schoolday-stats-card")],Tt),window.customCards=window.customCards||[],window.customCards.push({type:"schoolday-stats-card",name:"Schoolday Routine record",description:"How reliably each child gets through their routines, and which steps get skipped.",preview:!0,documentationURL:"https://github.com/DomCim/HA-Schoolday"});const Lt=new Date(2024,0,1);let Ot=class extends de{constructor(){super(...arguments),this._config={type:""},this._narrow=!1,this._tick=0}static async getConfigElement(){return document.createElement("schoolday-timetable-card-editor")}static getStubConfig(){return{layout:"auto",week_days:"auto"}}setConfig(e){this._config={...e}}getCardSize(){return 8}getGridOptions(){return{columns:"full",rows:"auto"}}connectedCallback(){super.connectedCallback(),this._resizeObserver=new ResizeObserver(([e])=>{this._narrow=e.contentRect.width<560}),this._resizeObserver.observe(this),this._timer=setInterval(()=>{this._tick+=1},3e4)}disconnectedCallback(){this._resizeObserver?.disconnect(),this._resizeObserver=void 0,this._timer&&(clearInterval(this._timer),this._timer=void 0),super.disconnectedCallback()}_candidates(e){const t=(this._config.members??(this._config.member?[this._config.member]:[])).map(e=>e.toLowerCase());return e.filter(e=>!t.length||t.includes(e.id.toLowerCase())||t.includes(e.name.toLowerCase())).map(e=>{const t=Pe(this.hass,e.id),s=t?.attributes?.schedule;return{member:e,week:De(t),outlook:Te(t),schedule:"string"==typeof s&&s?s:null}}).filter(e=>{return t=e.week,Object.values(t).some(e=>e.length>0);var t})}_weekdays(e,t){const s=this._config.week_days??"auto";return"week"===s?fe(t):"school"===s?fe(t).slice(0,5):We(e,t)}_weekdayName(e,t){const s=new Date(Lt);return s.setDate(s.getDate()+e),new Intl.DateTimeFormat(_e(this.hass),{weekday:t}).format(s)}_dayFor(e,t){return function(e,t,s){const a=e.filter(e=>e.weekday===t);if(!s)return a[0];const i=Le();return a.find(e=>e.date>=i)??a[a.length-1]}(e,t,!1!==this._config.roll_days)}_columnDate(e,t){const s=function(e){if(!e)return null;const[t,s,a]=e.date.split("-").map(Number);return t&&s&&a?new Date(t,s-1,a):null}(this._dayFor(e,t));return s?new Intl.DateTimeFormat(_e(this.hass),{day:"numeric",month:"numeric"}).format(s):null}_closure(e,t){const s=this._dayFor(e,t);if(!s||"school"===s.mode)return null;const a={care:"timetable.care",sick:"timetable.sick",event:"timetable.event",free:"timetable.free"}[s.mode];return{mode:s.mode,label:("sick"===s.mode?null:s.label)??qe(this.hass,a??"timetable.free")}}_closureRuns(e,t){const s=[];return t.forEach((t,a)=>{const i=this._closure(e,t),n=s[s.length-1];n&&n.closed?.mode===i?.mode&&n.closed?.label===i?.label&&null===n.closed==(null===i)?n.span+=1:s.push({start:a,span:1,closed:i})}),s}_color(e,t){return e.subjects[t]??"var(--schoolday-line)"}_columnLessons(e,t,s){return new Map(function(e,t,s){const a=(e[t+7*(Oe(e)?s?.week??0:0)]??[]).map(e=>Ne(e,s?.rotation??0)).filter(e=>null!==e),i=s?.changes;if(!i)return a.map(e=>({lesson:e,changed:!1}));const n=new Map(a.map(e=>[e.period,{lesson:e,changed:!1}]));for(const[e,t]of Object.entries(i)){const s=Number(e);t?n.set(s,{lesson:{...t,period:s},changed:!0}):n.delete(s)}return[...n.entries()].sort((e,t)=>e[0]-t[0]).map(([,e])=>e)}(e,s,this._dayFor(t,s)).map(e=>[e.lesson.period,e]))}_renderChips(e,t){return e.length<2?Z:K`
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
        <span class="pill closed">${qe(this.hass,"timetable.no_school")}</span>
        ${e?K`<span class="status-text"><bdi>${e}</bdi></span>`:Z}
      </div>
    `}_renderStatus(e,t){if(!1===this._config.highlight)return Z;const s=$e(),a=Re(e,s),i=a?t.get(a.index)?.lesson:void 0;if(a&&i){const t=a.endMinutes-s;return K`
        <div class="status">
          <span class="pill" style=${`--subject:${this._color(e,i.subject)}`}
            >${qe(this.hass,"timetable.now")}</span
          >
          <span class="status-text">
            <bdi>${i.subject}</bdi>${i.room?K` · <bdi>${i.room}</bdi>`:Z}
          </span>
          <span class="status-muted">${qe(this.hass,"timetable.remaining",{minutes:t})}</span>
        </div>
      `}const n=e.periods.find(e=>e.startMinutes>s&&t.has(e.index));if(n){const e=t.get(n.index).lesson;return K`
        <div class="status">
          <span class="pill next">${qe(this.hass,"timetable.next")}</span>
          <span class="status-text">
            <bdi>${e.subject}</bdi>${e.room?K` · <bdi>${e.room}</bdi>`:Z}
          </span>
          <span class="status-muted">${xe(this.hass,n.start)}</span>
        </div>
      `}return t.size?K`<div class="status">
        <span class="status-muted">${qe(this.hass,"timetable.done_for_today")}</span>
      </div>`:Z}_renderCell(e,t,s,a,i,n){if(!t)return K`<div class="cell free ${s?"now":""}" style=${i}></div>`;const{lesson:o,changed:r}=t,l=!1!==this._config.show_rooms&&o.room,d=qe(this.hass,"timetable.exam");return K`
      <div
        class="cell ${s?"now":""} ${r?"changed":""} ${n?"exam":""}"
        style=${`--subject:${this._color(e,o.subject)};${i}`}
        title=${`${o.room?`${o.subject} · ${o.room}`:o.subject}${r?` · ${qe(this.hass,"timetable.changed")}`:""}${n?` · ${d}: ${n.title}`:""}`}
      >
        <span class="subject"><bdi>${o.subject}</bdi></span>
        ${l?K`<span class="room"><bdi>${o.room}</bdi></span>`:Z}
        ${r?K`<span class="swap" aria-label=${qe(this.hass,"timetable.changed")}></span>`:Z}
        ${n?K`<span class="exam-tag">${d}</span>`:Z}
        ${s&&null!==a?K`<div class="progress"><div style=${`width:${Math.round(100*a)}%`}></div></div>`:Z}
      </div>
    `}willUpdate(){this.dir=Ve(this.hass)?"rtl":""}render(){if(!this.hass)return K`<ha-card></ha-card>`;const e=He(this.hass,this._config.board_entity);if(!e)return K`<ha-card><div class="notice">${qe(this.hass,"board.missing")}</div></ha-card>`;const t=e.timetable;if(!t)return K`<ha-card
        ><div class="notice">${qe(this.hass,"timetable.no_periods")}</div></ha-card
      >`;const s=this._candidates(e.members);if(!s.length)return K`<ha-card
        ><div class="notice">${qe(this.hass,"timetable.none_configured")}</div></ha-card
      >`;const a=s.find(e=>e.member.id===this._memberId)??s[0],{member:i,week:n,outlook:o}=a,r=Ce(t,a.schedule),l=this._weekdays(n,r.weekStart),d=function(e=new Date){return(e.getDay()+6)%7}(),c=!1!==this._config.highlight,h=this._config.layout??"auto",m="day"===h||"auto"===h&&this._narrow,u=void 0!==this._day&&l.includes(this._day)?this._day:l.includes(d)?d:l[0],p=m?[u]:l,b=this._closure(o,d),g=p.filter(e=>null===this._closure(o,e)),_=g.length<p.length,y=new Map(p.map(e=>[e,this._columnLessons(n,o,e)])),f=function(e,t){const s=e.periods.filter(t),a=new Set(s.map(e=>e.index)),i=[];for(const t of s){i.push({kind:"period",period:t});const s=e.breaks.find(e=>e.after===t.index&&a.has(t.index+1));s&&i.push({kind:"break",gap:s})}return i}(r,e=>!1===this._config.hide_empty_periods||g.some(t=>y.get(t)?.has(e.index))),w=c&&!b?Re(r):void 0,v=!1!==this._config.show_times,k=!1!==this._config.show_breaks?f:f.filter(e=>"period"===e.kind);return K`
      <ha-card style=${`--member-color:${i.color}`}>
        <div class="head">
          <div class="title">
            ${Fe(this.hass,i.avatar)?K`<img class="avatar" src=${Fe(this.hass,i.avatar)} alt="" />`:K`<span class="dot"></span>`}
            <span><bdi>${i.name}</bdi></span>
          </div>
          ${this._renderChips(s,i)}
        </div>
        ${c&&b?this._renderNoSchool(b.label):c&&l.includes(d)?this._renderStatus(r,this._columnLessons(n,o,d)):Z}
        ${m?K`
              <div class="days">
                ${l.map(e=>K`
                    <button
                      class="chip day ${e===d&&c?"is-today":""}"
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
          style=${`grid-template-columns:${v?"max-content":"min-content"} repeat(${p.length}, minmax(0, 1fr))`}
        >
          <!-- One surface per day, behind everything else in that column. Drawn first
               so the cells paint on top of it without needing a stacking context. -->
          ${p.map((e,t)=>K`<div class="day-panel" style=${`grid-column:${t+2};grid-row:1 / -1`}></div>`)}
          <div class="corner" style="grid-column:1;grid-row:1"></div>
          ${p.map((e,t)=>K`
              <div
                class="col-head ${c&&e===d?"today":""}"
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
          ${k.map((e,t)=>{const s=t+(_?3:2);if("break"===e.kind){const t=`${xe(this.hass,e.gap.start)}–${xe(this.hass,e.gap.end)}`;return K`
                <div
                  class="t-break"
                  style=${`grid-column:1;grid-row:${s}`}
                  title=${`${qe(this.hass,"timetable.break")} · ${t}`}
                >
                  ${qe(this.hass,"timetable.break")}
                </div>
                ${p.map((e,a)=>K`
                    <div
                      class="d-break"
                      style=${`grid-column:${a+2};grid-row:${s}`}
                      title=${`${qe(this.hass,"timetable.break")} · ${t}`}
                    ></div>
                  `)}
              `}const{period:a}=e,i=c?function(e,t=$e()){if(t<e.startMinutes||t>=e.endMinutes)return null;const s=e.endMinutes-e.startMinutes;return s>0?(t-e.startMinutes)/s:0}(a):null;return K`
              <div class="time" style=${`grid-column:1;grid-row:${s}`}>
                <span class="no">${a.index}</span>
                ${v?K`<span class="span"
                      >${xe(this.hass,a.start)}<br />${xe(this.hass,a.end)}</span
                    >`:Z}
              </div>
              ${p.map((e,t)=>null!==this._closure(o,e)?K`<div
                      class="cell closed"
                      style=${`grid-column:${t+2};grid-row:${s}`}
                    ></div>`:this._renderCell(r,y.get(e)?.get(a.index),c&&e===d&&w?.index===a.index,i,`grid-column:${t+2};grid-row:${s}`,this._dayFor(o,e)?.exams?.find(e=>e.period===a.index)))}
            `})}
        </div>
      </ha-card>
    `}};Ot.styles=[mt,ut,l`
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
    `],s([pe({attribute:!1})],Ot.prototype,"hass",void 0),s([be()],Ot.prototype,"_config",void 0),s([be()],Ot.prototype,"_memberId",void 0),s([be()],Ot.prototype,"_day",void 0),s([be()],Ot.prototype,"_narrow",void 0),s([be()],Ot.prototype,"_tick",void 0),Ot=s([he("schoolday-timetable-card")],Ot),window.customCards=window.customCards||[],window.customCards.push({type:"schoolday-timetable-card",name:"Schoolday Timetable",description:"The school timetable per child, colour-coded by subject, with the running lesson marked.",preview:!0,documentationURL:"https://github.com/DomCim/HA-Schoolday"}),console.info(`%c SCHOOLDAY %c ${e} `,"color:#fff;background:#3a86c8;font-weight:700;border-radius:3px 0 0 3px;padding:2px 6px","color:#3a86c8;background:#16212b;font-weight:700;border-radius:0 3px 3px 0;padding:2px 6px");export{e as SCHOOLDAY_VERSION};
