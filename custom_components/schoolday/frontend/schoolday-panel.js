const e="0.5.2",t=["#e0603a","#3a86c8","#4f9d69","#c9a227","#8e6bbf","#d1707f"];function s(e,t,s,i){var o,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,s,i);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(n=(r<3?o(n):r>3?o(t,s,n):o(t,s))||n);return r>3&&n&&Object.defineProperty(t,s,n),n}"function"==typeof SuppressedError&&SuppressedError;const i=globalThis,o=i.ShadowRoot&&(void 0===i.ShadyCSS||i.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),n=new WeakMap;let a=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(o&&void 0===e){const s=void 0!==t&&1===t.length;s&&(e=n.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&n.set(t,e))}return e}toString(){return this.cssText}};const d=(e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,s,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1],e[0]);return new a(s,e,r)},l=o?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new a("string"==typeof e?e:e+"",void 0,r))(t)})(e):e,{is:c,defineProperty:h,getOwnPropertyDescriptor:u,getOwnPropertyNames:p,getOwnPropertySymbols:m,getPrototypeOf:g}=Object,f=globalThis,b=f.trustedTypes,y=b?b.emptyScript:"",_=f.reactiveElementPolyfillSupport,v=(e,t)=>e,$={toAttribute(e,t){switch(t){case Boolean:e=e?y:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},w=(e,t)=>!c(e,t),x={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:w};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let A=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=x){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);void 0!==i&&h(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:o}=u(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const r=i?.call(this);o?.call(this,t),this.requestUpdate(e,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??x}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=g(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...p(e),...m(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(l(e))}else void 0!==e&&t.push(l(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{if(o)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const s of t){const t=document.createElement("style"),o=i.litNonce;void 0!==o&&t.setAttribute("nonce",o),t.textContent=s.cssText,e.appendChild(t)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:$).toAttribute(t,s.type);this._$Em=e,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(e,t){const s=this.constructor,i=s._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=s.getPropertyOptions(i),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:$;this._$Em=i;const r=o.fromAttribute(t,e.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(e,t,s,i=!1,o){if(void 0!==e){const r=this.constructor;if(!1===i&&(o=this[e]),s??=r.getPropertyOptions(e),!((s.hasChanged??w)(o,t)||s.useDefault&&s.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:o},r){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==o||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,s,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[v("elementProperties")]=new Map,A[v("finalized")]=new Map,_?.({ReactiveElement:A}),(f.reactiveElementVersions??=[]).push("2.1.2");const S=globalThis,k=e=>e,C=S.trustedTypes,E=C?C.createPolicy("lit-html",{createHTML:e=>e}):void 0,M="$lit$",L=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+L,O=`<${z}>`,j=document,P=()=>j.createComment(""),N=e=>null===e||"object"!=typeof e&&"function"!=typeof e,T=Array.isArray,U="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,D=/>/g,I=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,W=/"/g,F=/^(?:script|style|textarea|title)$/i,q=(e=>(t,...s)=>({_$litType$:e,strings:t,values:s}))(1),V=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),Z=new WeakMap,G=j.createTreeWalker(j,129);function J(e,t){if(!T(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(t):t}const Y=(e,t)=>{const s=e.length-1,i=[];let o,r=2===t?"<svg>":3===t?"<math>":"",n=H;for(let t=0;t<s;t++){const s=e[t];let a,d,l=-1,c=0;for(;c<s.length&&(n.lastIndex=c,d=n.exec(s),null!==d);)c=n.lastIndex,n===H?"!--"===d[1]?n=R:void 0!==d[1]?n=D:void 0!==d[2]?(F.test(d[2])&&(o=RegExp("</"+d[2],"g")),n=I):void 0!==d[3]&&(n=I):n===I?">"===d[0]?(n=o??H,l=-1):void 0===d[1]?l=-2:(l=n.lastIndex-d[2].length,a=d[1],n=void 0===d[3]?I:'"'===d[3]?W:B):n===W||n===B?n=I:n===R||n===D?n=H:(n=I,o=void 0);const h=n===I&&e[t+1].startsWith("/>")?" ":"";r+=n===H?s+O:l>=0?(i.push(a),s.slice(0,l)+M+s.slice(l)+L+h):s+L+(-2===l?t:h)}return[J(e,r+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class Q{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let o=0,r=0;const n=e.length-1,a=this.parts,[d,l]=Y(e,t);if(this.el=Q.createElement(d,s),G.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=G.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(M)){const t=l[r++],s=i.getAttribute(e).split(L),n=/([.?@])?(.*)/.exec(t);a.push({type:1,index:o,name:n[2],strings:s,ctor:"."===n[1]?ie:"?"===n[1]?oe:"@"===n[1]?re:se}),i.removeAttribute(e)}else e.startsWith(L)&&(a.push({type:6,index:o}),i.removeAttribute(e));if(F.test(i.tagName)){const e=i.textContent.split(L),t=e.length-1;if(t>0){i.textContent=C?C.emptyScript:"";for(let s=0;s<t;s++)i.append(e[s],P()),G.nextNode(),a.push({type:2,index:++o});i.append(e[t],P())}}}else if(8===i.nodeType)if(i.data===z)a.push({type:2,index:o});else{let e=-1;for(;-1!==(e=i.data.indexOf(L,e+1));)a.push({type:7,index:o}),e+=L.length-1}o++}}static createElement(e,t){const s=j.createElement("template");return s.innerHTML=e,s}}function X(e,t,s=e,i){if(t===V)return t;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const r=N(t)?void 0:t._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(e),o._$AT(e,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(t=X(e,o._$AS(e,t.values),o,i)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??j).importNode(t,!0);G.currentNode=i;let o=G.nextNode(),r=0,n=0,a=s[0];for(;void 0!==a;){if(r===a.index){let t;2===a.type?t=new te(o,o.nextSibling,this,e):1===a.type?t=new a.ctor(o,a.name,a.strings,this,e):6===a.type&&(t=new ne(o,this,e)),this._$AV.push(t),a=s[++n]}r!==a?.index&&(o=G.nextNode(),r++)}return G.currentNode=j,i}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),N(e)?e===K||null==e||""===e?(this._$AH!==K&&this._$AR(),this._$AH=K):e!==this._$AH&&e!==V&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>T(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==K&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(j.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,i="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=Q.createElement(J(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new ee(i,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=Z.get(e.strings);return void 0===t&&Z.set(e.strings,t=new Q(e)),t}k(e){T(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const o of e)i===t.length?t.push(s=new te(this.O(P()),this.O(P()),this,this.options)):s=t[i],s._$AI(o),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class se{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,o){this.type=1,this._$AH=K,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=K}_$AI(e,t=this,s,i){const o=this.strings;let r=!1;if(void 0===o)e=X(this,e,t,0),r=!N(e)||e!==this._$AH&&e!==V,r&&(this._$AH=e);else{const i=e;let n,a;for(e=o[0],n=0;n<o.length-1;n++)a=X(this,i[s+n],t,n),a===V&&(a=this._$AH[n]),r||=!N(a)||a!==this._$AH[n],a===K?e=K:e!==K&&(e+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!i&&this.j(e)}j(e){e===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ie extends se{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===K?void 0:e}}class oe extends se{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==K)}}class re extends se{constructor(e,t,s,i,o){super(e,t,s,i,o),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??K)===V)return;const s=this._$AH,i=e===K&&s!==K||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==K&&(s===K||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ne{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const ae=S.litHtmlPolyfillSupport;ae?.(Q,te),(S.litHtmlVersions??=[]).push("3.3.3");const de=globalThis;class le extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const i=s?.renderBefore??t;let o=i._$litPart$;if(void 0===o){const e=s?.renderBefore??null;i._$litPart$=o=new te(t.insertBefore(P(),e),e,void 0,s??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}le._$litElement$=!0,le.finalized=!0,de.litElementHydrateSupport?.({LitElement:le});const ce=de.litElementPolyfillSupport;ce?.({LitElement:le}),(de.litElementVersions??=[]).push("4.2.2");const he=e=>(t,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},ue={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:w},pe=(e=ue,t,s)=>{const{kind:i,metadata:o}=s;let r=globalThis.litPropertyMetadata.get(o);if(void 0===r&&globalThis.litPropertyMetadata.set(o,r=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),r.set(s.name,e),"accessor"===i){const{name:i}=s;return{set(s){const o=t.get.call(this);t.set.call(this,s),this.requestUpdate(i,o,e,!0,s)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=s;return function(s){const o=this[i];t.call(this,s),this.requestUpdate(i,o,e,!0,s)}}throw Error("Unsupported decorator location: "+i)};function me(e){return(t,s)=>"object"==typeof s?pe(e,t,s):((e,t,s)=>{const i=t.hasOwnProperty(s);return t.constructor.createProperty(s,e),i?Object.getOwnPropertyDescriptor(t,s):void 0})(e,t,s)}function ge(e){return me({...e,state:!0,attribute:!1})}function fe(e){switch(e.locale?.time_format){case"12":return!0;case"24":return!1;default:return}}function be(e){return e.locale?.language||e.language||"en"}function ye(e){const[t,s]=e.split(":").map(Number);return 60*(t||0)+(s||0)}function _e(e=new Date){return 60*e.getHours()+e.getMinutes()}function ve(e,t){if(!e)return t;if(!0!==fe(e))return t;const s=new Date;return s.setHours(Math.floor(ye(t)/60),ye(t)%60,0,0),new Intl.DateTimeFormat(be(e),{hour:"numeric",minute:"2-digit",hour12:!0}).format(s)}function $e(e){if(!e||"object"!=typeof e)return null;const t=e,s=(Array.isArray(t.periods)?t.periods:[]).map(e=>e).filter(e=>"string"==typeof e?.start&&"string"==typeof e?.end).map((e,t)=>({index:Number(e.index??t+1),start:String(e.start),end:String(e.end),startMinutes:ye(String(e.start)),endMinutes:ye(String(e.end))}));if(!s.length)return null;const i=(Array.isArray(t.breaks)?t.breaks:[]).map(e=>e).filter(e=>"string"==typeof e?.start&&"string"==typeof e?.end).map(e=>({after:Number(e.after??0),start:String(e.start),end:String(e.end),minutes:Number(e.minutes??0)})),o={};for(const[e,s]of Object.entries(t.subjects??{}))"string"==typeof s&&(o[e]=s);return{periods:s,breaks:i,subjects:o}}function we(e){return function(e){const t={};if(!e||"object"!=typeof e)return t;for(const[s,i]of Object.entries(e)){const e=Number(s);if(!Number.isInteger(e)||e<0||e>6||!Array.isArray(i))continue;const o=i.map(e=>e).filter(e=>Boolean(e)&&"string"==typeof e.subject).map(e=>({period:Number(e.period??0),subject:String(e.subject),room:"string"==typeof e.room&&e.room?e.room:null})).sort((e,t)=>e.period-t.period);o.length&&(t[e]=o)}return t}(e?.attributes?.timetable)}function xe(e,t,s){return(e[t]??[]).find(e=>e.period===s)}function Ae(e,t=_e()){return e.periods.find(e=>t>=e.startMinutes&&t<e.endMinutes)}function Se(e){return!0===e.attributes?.schoolday_board}function ke(e,s){let i;if(s){if(i=e.states[s],!i)return null}else if(i=Object.values(e.states).find(Se),!i)return null;const o=i.attributes,r=(Array.isArray(o.members)?o.members:[]).map((e,s)=>{const i=e;return{id:String(i.id??s),name:String(i.name??""),color:i.color||t[s%t.length],avatar:i.avatar??null,order:i.order??s}});return r.sort((e,t)=>e.order-t.order||e.name.localeCompare(t.name)),{entityId:i.entity_id,members:r,timetable:$e(o.timetable),schoolToday:!1!==o.school_today,noSchoolReason:"string"==typeof o.no_school_reason?o.no_school_reason:null}}function Ce(e,t){return Object.values(e.states).find(e=>e.attributes?.member_id===t)}const Ee={"board.missing":"No Schoolday board found. Add the Schoolday integration.","routines.nothing_today":"Nothing today","routines.auto":"Automatic (by time of day)","routines.morning":"Morning","routines.evening":"Evening","routines.both":"Both","routines.none_configured":"No routines for today. Add them under Configure → Edit routines in the Schoolday integration.","timetable.no_periods":"No lesson times yet. Add them under Configure → School timetable in the Schoolday integration.","timetable.none_configured":"Nobody has a timetable yet. Add one under Configure → School timetable in the Schoolday integration.","timetable.break":"Break","timetable.no_school":"No school","timetable.now":"Now","timetable.next":"Next","timetable.remaining":"{minutes} min left","timetable.done_for_today":"School is out for today.","timetable.layout_auto":"Automatic (week, one day when narrow)","timetable.layout_week":"Whole week","timetable.layout_day":"One day","timetable.days_auto":"Automatic (as the timetable needs)","timetable.days_school":"Monday to Friday","timetable.days_week":"All seven days","editor.block":"Which block to show","editor.evening_from":"Evening starts at (hour)","editor.show_empty":"Show members with nothing on today","editor.members":"Limit to these members","editor.member":"Family member","editor.layout":"Layout","editor.week_days":"Days shown","editor.show_rooms":"Show rooms","editor.show_times":"Show lesson times","editor.show_breaks":"Show breaks","editor.hide_empty_periods":"Hide periods nobody has","editor.highlight":"Mark today and the running lesson","editor.weather_entity":"Weather entity","editor.greeting":"Greeting","editor.show_seconds":"Show seconds"},Me={en:Ee,de:{"board.missing":"Kein Schoolday-Board gefunden. Füge die Schoolday-Integration hinzu.","routines.nothing_today":"Heute nichts","routines.auto":"Automatisch (nach Tageszeit)","routines.morning":"Morgen","routines.evening":"Abend","routines.both":"Beide","routines.none_configured":"Für heute sind keine Routinen hinterlegt. Trage sie in der Schoolday-Integration unter „Konfigurieren → Routinen bearbeiten“ ein.","timetable.no_periods":"Noch keine Stundenzeiten. Trage sie in der Schoolday-Integration unter „Konfigurieren → Stundenplan“ ein.","timetable.none_configured":"Noch hat niemand einen Stundenplan. Lege ihn in der Schoolday-Integration unter „Konfigurieren → Stundenplan“ an.","timetable.break":"Pause","timetable.no_school":"Schulfrei","timetable.now":"Jetzt","timetable.next":"Danach","timetable.remaining":"noch {minutes} min","timetable.done_for_today":"Für heute ist Schule aus.","timetable.layout_auto":"Automatisch (Woche, schmal ein Tag)","timetable.layout_week":"Ganze Woche","timetable.layout_day":"Ein Tag","timetable.days_auto":"Automatisch (wie der Stundenplan es braucht)","timetable.days_school":"Montag bis Freitag","timetable.days_week":"Alle sieben Tage","editor.block":"Welcher Block angezeigt wird","editor.evening_from":"Abend beginnt um (Stunde)","editor.show_empty":"Mitglieder ohne Routine heute anzeigen","editor.members":"Auf diese Mitglieder beschränken","editor.member":"Familienmitglied","editor.layout":"Darstellung","editor.week_days":"Angezeigte Tage","editor.show_rooms":"Räume anzeigen","editor.show_times":"Stundenzeiten anzeigen","editor.show_breaks":"Pausen anzeigen","editor.hide_empty_periods":"Stunden ausblenden, die niemand hat","editor.highlight":"Heute und laufende Stunde hervorheben","editor.weather_entity":"Wetter-Entität","editor.greeting":"Begrüßung","editor.show_seconds":"Sekunden anzeigen"}};function Le(e,t,s){const i=Me[function(e){return(e?.locale?.language||e?.language||"en").toLowerCase().split("-")[0]}(e)]??Ee;let o=i[t]??Ee[t]??t;if(s)for(const[e,t]of Object.entries(s))o=o.replace(`{${e}}`,String(t));return o}const ze=e=>({name:e,selector:{boolean:{}}}),Oe=(e,t,s=!1)=>({name:e,selector:{select:{options:t,multiple:s,mode:s?"list":"dropdown"}}});class je extends le{constructor(){super(...arguments),this._config={type:""},this._label=e=>Le(this.hass,`editor.${e.name}`)}setConfig(e){this._config={...e}}_valueChanged(e){e.stopPropagation();const t={...this._config,...e.detail?.value??{}};for(const[e,s]of Object.entries(t))(void 0===s||""===s||Array.isArray(s)&&!s.length)&&delete t[e];var s,i;s="config-changed",i={config:t},this.dispatchEvent(new CustomEvent(s,{detail:i,bubbles:!0,composed:!0}))}render(){return this.hass?q`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this.schema()}
        .computeLabel=${this._label}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:q``}}s([me({attribute:!1})],je.prototype,"hass",void 0),s([ge()],je.prototype,"_config",void 0);let Pe=class extends je{schema(){return[Oe("block",[{value:"auto",label:Le(this.hass,"routines.auto")},{value:"morning",label:Le(this.hass,"routines.morning")},{value:"evening",label:Le(this.hass,"routines.evening")},{value:"both",label:Le(this.hass,"routines.both")}]),(e="evening_from",t=0,s=23,{name:e,selector:{number:{min:t,max:s,mode:"box"}}}),ze("show_empty")];var e,t,s}};Pe=s([he("schoolday-routines-card-editor")],Pe);let Ne=class extends je{schema(){const e=(ke(this.hass)?.members??[]).map(e=>({value:e.id,label:e.name}));return[...e.length>1?[Oe("member",e)]:[],Oe("layout",[{value:"auto",label:Le(this.hass,"timetable.layout_auto")},{value:"week",label:Le(this.hass,"timetable.layout_week")},{value:"day",label:Le(this.hass,"timetable.layout_day")}]),Oe("week_days",[{value:"auto",label:Le(this.hass,"timetable.days_auto")},{value:"school",label:Le(this.hass,"timetable.days_school")},{value:"week",label:Le(this.hass,"timetable.days_week")}]),ze("show_rooms"),ze("show_times"),ze("show_breaks"),ze("hide_empty_periods"),ze("highlight")]}};Ne=s([he("schoolday-timetable-card-editor")],Ne);let Te=class extends je{schema(){return[{name:"weather_entity",selector:{entity:{domain:"weather"}}},{name:"greeting",selector:{text:{}}},ze("show_seconds")]}};Te=s([he("schoolday-header-card-editor")],Te);const Ue=d`
  :host {
    --schoolday-gap: 8px;
    --schoolday-radius: 12px;
    --schoolday-touch: 44px;
    --schoolday-muted: var(--secondary-text-color, #7a7a7a);
    --schoolday-line: var(--divider-color, rgba(127, 127, 127, 0.25));
    --schoolday-surface: var(--card-background-color, #fff);
    --schoolday-surface-alt: rgba(127, 127, 127, 0.08);
    --schoolday-today: var(--primary-color, #03a9f4);
  }
`,He=d`
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
`;let Re=class extends le{constructor(){super(...arguments),this._config={type:""},this._now=new Date}static async getConfigElement(){return document.createElement("schoolday-header-card-editor")}static getStubConfig(){return{show_seconds:!1}}setConfig(e){this._config={...e}}getCardSize(){return 2}getGridOptions(){return{columns:"full",rows:"auto"}}connectedCallback(){super.connectedCallback();const e=this._config.show_seconds?1e3:2e4;this._timer=window.setInterval(()=>{this._now=new Date},e)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&(window.clearInterval(this._timer),this._timer=void 0)}_weather(){const e=this._config.weather_entity;if(!e)return K;const t=this.hass.states[e];if(!t)return K;const s=t.attributes?.temperature,i=t.attributes?.temperature_unit??"",o=this.hass.formatEntityState(t);return q`
      <div class="weather">
        <div class="temperature">
          ${"number"==typeof s?`${Math.round(s)}${i}`:"—"}
        </div>
        <div class="condition">${o}</div>
      </div>
    `}render(){if(!this.hass)return q`<ha-card></ha-card>`;const e=be(this.hass),t=new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit",...this._config.show_seconds?{second:"2-digit"}:{},hour12:fe(this.hass)}).format(this._now),s=new Intl.DateTimeFormat(e,{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(this._now);return q`
      <ha-card>
        <div class="bar">
          <div class="left">
            <div class="clock">${t}</div>
            <div class="date">${s}</div>
            ${this._config.greeting?q`<div class="greeting">${this._config.greeting}</div>`:K}
          </div>
          ${this._weather()}
        </div>
      </ha-card>
    `}};Re.styles=[Ue,d`
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
        color: var(--schoolday-muted);
      }
    `],s([me({attribute:!1})],Re.prototype,"hass",void 0),s([ge()],Re.prototype,"_config",void 0),s([ge()],Re.prototype,"_now",void 0),Re=s([he("schoolday-header-card")],Re),window.customCards=window.customCards||[],window.customCards.push({type:"schoolday-header-card",name:"Schoolday Header",description:"Clock, date and weather, sized to be read from across the room.",preview:!0,documentationURL:"https://github.com/DomCim/HA-Schoolday"});const De="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",Ie="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z",Be="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z",We="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95Z";let Fe=class extends le{constructor(){super(...arguments),this._config={type:""},this._pending=new Set}static async getConfigElement(){return document.createElement("schoolday-routines-card-editor")}static getStubConfig(){return{block:"auto",evening_from:14}}setConfig(e){this._config={...e}}getCardSize(){return 6}getGridOptions(){return{columns:"full",rows:"auto"}}get _blocks(){const e=this._config.block??"auto";if("morning"===e||"evening"===e)return[e];if("both"===e)return["morning","evening"];const t=this._config.evening_from??14;return[(new Date).getHours()<t?"morning":"evening"]}_steps(e,t){const s=Ce(this.hass,e.id),i=s?.attributes?.[`routine_${t}`];return Array.isArray(i)?i.filter(e=>Boolean(e)&&"object"==typeof e).map(e=>({step:String(e.step??""),done:Boolean(e.done)})):[]}async _toggle(e,t,s){const i=`${e.id}|${t}|${s.step}`;this._pending=new Set(this._pending).add(i);try{await this.hass.callService("schoolday","set_routine_step",{member:e.id,block:t,step:s.step,done:!s.done})}catch(e){console.warn("[schoolday] could not update routine step",e)}finally{const e=new Set(this._pending);e.delete(i),this._pending=e}}_icon(e,t=""){return q`<svg class=${t} viewBox="0 0 24 24"><path d=${e} /></svg>`}_renderBlock(e,t){const s=this._steps(e,t),i=s.filter(e=>e.done).length,o=s.length>0&&i===s.length;return q`
      <section class="block ${o?"complete":""}">
        <header class="block-head">
          ${this._icon("morning"===t?Be:We,"block-icon")}
          <span class="progress">${i}/${s.length}</span>
        </header>

        ${0===s.length?q`<div class="empty">${Le(this.hass,"routines.nothing_today")}</div>`:q`
              <div class="bar">
                <div
                  class="bar-fill"
                  style=${`width:${s.length?i/s.length*100:0}%`}
                ></div>
              </div>
              ${s.map(s=>{const i=`${e.id}|${t}|${s.step}`,o=this._pending.has(i),r=o?!s.done:s.done;return q`
                  <button
                    class="step ${r?"done":""} ${o?"pending":""}"
                    @click=${()=>this._toggle(e,t,s)}
                  >
                    ${this._icon(r?Ie:De,"tick")}
                    <span class="label">${s.step}</span>
                  </button>
                `})}
            `}
      </section>
    `}render(){if(!this.hass)return q`<ha-card></ha-card>`;const e=ke(this.hass,this._config.board_entity);if(!e)return q`<ha-card
        ><div class="notice">${Le(this.hass,"board.missing")}</div></ha-card
      >`;const t=this._blocks,s=this._config.members?.map(e=>e.toLowerCase()),i=e.members.filter(e=>!(s&&!s.includes(e.id.toLowerCase())&&!s.includes(e.name.toLowerCase()))&&(!0===this._config.show_empty||t.some(t=>this._steps(e,t).length>0)));return 0===i.length?q`
        <ha-card>
          <div class="notice">${Le(this.hass,"routines.none_configured")}</div>
        </ha-card>
      `:q`
      <ha-card>
        <div class="grid">
          ${i.map(e=>q`
              <div class="person" style=${`--member-color:${e.color}`}>
                <div class="person-name">
                  ${e.avatar?q`<img class="avatar" src=${e.avatar} alt="" />`:K}
                  <span>${e.name}</span>
                </div>
                ${t.map(t=>this._renderBlock(e,t))}
              </div>
            `)}
        </div>
      </ha-card>
    `}};Fe.styles=[Ue,He,d`
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
        text-align: left;
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

      .empty,
      .notice {
        padding: 8px 2px;
        color: var(--schoolday-muted);
        font-size: 0.9rem;
      }
    `],s([me({attribute:!1})],Fe.prototype,"hass",void 0),s([ge()],Fe.prototype,"_config",void 0),s([ge()],Fe.prototype,"_pending",void 0),Fe=s([he("schoolday-routines-card")],Fe),window.customCards=window.customCards||[],window.customCards.push({type:"schoolday-routines-card",name:"Schoolday Routines",description:"Daily routines per child and weekday, ticked off by the kids themselves.",preview:!0,documentationURL:"https://github.com/DomCim/HA-Schoolday"});const qe=new Date(2024,0,1);let Ve=class extends le{constructor(){super(...arguments),this._config={type:""},this._narrow=!1,this._tick=0}static async getConfigElement(){return document.createElement("schoolday-timetable-card-editor")}static getStubConfig(){return{layout:"auto",week_days:"auto"}}setConfig(e){this._config={...e}}getCardSize(){return 8}getGridOptions(){return{columns:"full",rows:"auto"}}connectedCallback(){super.connectedCallback(),this._resizeObserver=new ResizeObserver(([e])=>{this._narrow=e.contentRect.width<560}),this._resizeObserver.observe(this),this._timer=setInterval(()=>{this._tick+=1},3e4)}disconnectedCallback(){this._resizeObserver?.disconnect(),this._resizeObserver=void 0,this._timer&&(clearInterval(this._timer),this._timer=void 0),super.disconnectedCallback()}_candidates(e){const t=(this._config.members??(this._config.member?[this._config.member]:[])).map(e=>e.toLowerCase());return e.filter(e=>!t.length||t.includes(e.id.toLowerCase())||t.includes(e.name.toLowerCase())).map(e=>({member:e,week:we(Ce(this.hass,e.id))})).filter(e=>{return t=e.week,Object.values(t).some(e=>e.length>0);var t})}_weekdays(e){const t=this._config.week_days??"auto";if("week"===t)return[0,1,2,3,4,5,6];if("school"===t)return[0,1,2,3,4];const s=Object.keys(e).map(Number).filter(t=>(e[t]??[]).length>0),i=Math.max(4,...s);return Array.from({length:i+1},(e,t)=>t)}_weekdayName(e,t){const s=new Date(qe);return s.setDate(s.getDate()+e),new Intl.DateTimeFormat(be(this.hass),{weekday:t}).format(s)}_color(e,t){return e.subjects[t]??"var(--schoolday-line)"}_renderChips(e,t){return e.length<2?K:q`
      <div class="chips">
        ${e.map(({member:e})=>q`
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
    `}_renderNoSchool(e){return q`
      <div class="status">
        <span class="pill closed">${Le(this.hass,"timetable.no_school")}</span>
        ${e?q`<span class="status-text">${e}</span>`:K}
      </div>
    `}_renderStatus(e,t,s){if(!1===this._config.highlight)return K;const i=_e(),o=Ae(e,i),r=o?xe(t,s,o.index):void 0;if(o&&r){const t=o.endMinutes-i;return q`
        <div class="status">
          <span class="pill" style=${`--subject:${this._color(e,r.subject)}`}
            >${Le(this.hass,"timetable.now")}</span
          >
          <span class="status-text">
            ${r.subject}${r.room?q` · ${r.room}`:K}
          </span>
          <span class="status-muted">${Le(this.hass,"timetable.remaining",{minutes:t})}</span>
        </div>
      `}const n=function(e,t,s,i=_e()){for(const o of e.periods){if(o.startMinutes<=i)continue;const e=xe(t,s,o.index);if(e)return{lesson:e,period:o}}return null}(e,t,s,i);return n?q`
        <div class="status">
          <span class="pill next">${Le(this.hass,"timetable.next")}</span>
          <span class="status-text">
            ${n.lesson.subject}${n.lesson.room?q` · ${n.lesson.room}`:K}
          </span>
          <span class="status-muted">${ve(this.hass,n.period.start)}</span>
        </div>
      `:(t[s]??[]).length?q`<div class="status">
        <span class="status-muted">${Le(this.hass,"timetable.done_for_today")}</span>
      </div>`:K}_renderCell(e,t,s,i,o,r){const n=xe(t,s,i);if(!n)return q`<div class="cell free ${o?"now":""}"></div>`;const a=!1!==this._config.show_rooms&&n.room;return q`
      <div
        class="cell ${o?"now":""}"
        style=${`--subject:${this._color(e,n.subject)}`}
        title=${n.room?`${n.subject} · ${n.room}`:n.subject}
      >
        <span class="subject">${n.subject}</span>
        ${a?q`<span class="room">${n.room}</span>`:K}
        ${o&&null!==r?q`<div class="progress"><div style=${`width:${Math.round(100*r)}%`}></div></div>`:K}
      </div>
    `}render(){if(!this.hass)return q`<ha-card></ha-card>`;const e=ke(this.hass,this._config.board_entity);if(!e)return q`<ha-card><div class="notice">${Le(this.hass,"board.missing")}</div></ha-card>`;const t=e.timetable;if(!t)return q`<ha-card
        ><div class="notice">${Le(this.hass,"timetable.no_periods")}</div></ha-card
      >`;const s=this._candidates(e.members);if(!s.length)return q`<ha-card
        ><div class="notice">${Le(this.hass,"timetable.none_configured")}</div></ha-card
      >`;const i=s.find(e=>e.member.id===this._memberId)??s[0],{member:o,week:r}=i,n=this._weekdays(r),a=function(e=new Date){return(e.getDay()+6)%7}(),d=!1!==this._config.highlight,l=this._config.layout??"auto",c="day"===l||"auto"===l&&this._narrow,h=void 0!==this._day&&n.includes(this._day)?this._day:n.includes(a)?a:n[0],u=c?[h]:n,p=function(e,t){const s=e.periods.filter(t),i=new Set(s.map(e=>e.index)),o=[];for(const t of s){o.push({kind:"period",period:t});const s=e.breaks.find(e=>e.after===t.index&&i.has(t.index+1));s&&o.push({kind:"break",gap:s})}return o}(t,e=>!1===this._config.hide_empty_periods||u.some(t=>void 0!==xe(r,t,e.index))),m=d&&e.schoolToday?Ae(t):void 0,g=!1!==this._config.show_times,f=!1!==this._config.show_breaks;return q`
      <ha-card style=${`--member-color:${o.color}`}>
        <div class="head">
          <div class="title">
            ${o.avatar?q`<img class="avatar" src=${o.avatar} alt="" />`:q`<span class="dot"></span>`}
            <span>${o.name}</span>
          </div>
          ${this._renderChips(s,o)}
        </div>
        ${d&&!e.schoolToday?this._renderNoSchool(e.noSchoolReason):d&&n.includes(a)?this._renderStatus(t,r,a):K}
        ${c?q`
              <div class="days">
                ${n.map(e=>q`
                    <button
                      class="chip day ${e===a&&d?"is-today":""}"
                      aria-pressed=${e===h}
                      @click=${()=>{this._day=e}}
                    >
                      ${this._weekdayName(e,"short")}
                    </button>
                  `)}
              </div>
            `:K}

        <div
          class="grid"
          style=${`grid-template-columns:${g?"max-content":"min-content"} repeat(${u.length}, minmax(0, 1fr))`}
        >
          <div class="corner"></div>
          ${u.map(e=>q`
              <div class="col-head ${d&&e===a?"today":""}">
                ${this._weekdayName(e,c?"long":"short")}
              </div>
            `)}
          ${p.map(e=>{if("break"===e.kind)return f?q`
                    <div class="break">
                      <span class="line"></span>
                      <span
                        >${Le(this.hass,"timetable.break")} ·
                        ${ve(this.hass,e.gap.start)}–${ve(this.hass,e.gap.end)}</span
                      >
                      <span class="line"></span>
                    </div>
                  `:K;const{period:s}=e,i=d?function(e,t=_e()){if(t<e.startMinutes||t>=e.endMinutes)return null;const s=e.endMinutes-e.startMinutes;return s>0?(t-e.startMinutes)/s:0}(s):null;return q`
              <div class="time">
                <span class="no">${s.index}</span>
                ${g?q`<span class="span"
                      >${ve(this.hass,s.start)}<br />${ve(this.hass,s.end)}</span
                    >`:K}
              </div>
              ${u.map(e=>this._renderCell(t,r,e,s.index,d&&e===a&&m?.index===s.index,i))}
            `})}
        </div>
      </ha-card>
    `}};Ve.styles=[Ue,He,d`
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
        gap: 4px;
        align-items: stretch;
      }

      .col-head {
        padding: 2px 0 4px;
        text-align: center;
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--schoolday-muted);
      }

      .col-head.today {
        color: var(--text-primary-color, #fff);
        background: var(--schoolday-today);
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

      .break {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 1px 0;
        font-size: 0.7rem;
        color: var(--schoolday-muted);
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
    `],s([me({attribute:!1})],Ve.prototype,"hass",void 0),s([ge()],Ve.prototype,"_config",void 0),s([ge()],Ve.prototype,"_memberId",void 0),s([ge()],Ve.prototype,"_day",void 0),s([ge()],Ve.prototype,"_narrow",void 0),s([ge()],Ve.prototype,"_tick",void 0),Ve=s([he("schoolday-timetable-card")],Ve),window.customCards=window.customCards||[],window.customCards.push({type:"schoolday-timetable-card",name:"Schoolday Timetable",description:"The school timetable per child, colour-coded by subject, with the running lesson marked.",preview:!0,documentationURL:"https://github.com/DomCim/HA-Schoolday"}),console.info(`%c SCHOOLDAY %c ${e} `,"color:#fff;background:#3a86c8;font-weight:700;border-radius:3px 0 0 3px;padding:2px 6px","color:#3a86c8;background:#16212b;font-weight:700;border-radius:0 3px 3px 0;padding:2px 6px");export{e as SCHOOLDAY_VERSION};
