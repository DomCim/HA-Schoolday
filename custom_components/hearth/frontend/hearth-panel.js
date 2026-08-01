const e="0.3.0",t=["#e0603a","#3a86c8","#4f9d69","#c9a227","#8e6bbf","#d1707f"];function i(e,t,i,a){var s,n=arguments.length,r=n<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,a);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(n<3?s(r):n>3?s(t,i,r):s(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const a=globalThis,s=a.ShadowRoot&&(void 0===a.ShadyCSS||a.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),r=new WeakMap;let o=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=r.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(t,e))}return e}toString(){return this.cssText}};const d=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,a)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[a+1],e[0]);return new o(i,e,n)},h=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,n))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:p,getOwnPropertyNames:u,getOwnPropertySymbols:m,getPrototypeOf:g}=Object,f=globalThis,_=f.trustedTypes,v=_?_.emptyScript:"",y=f.reactiveElementPolyfillSupport,b=(e,t)=>e,w={toAttribute(e,t){switch(t){case Boolean:e=e?v:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},$=(e,t)=>!l(e,t),x={attribute:!0,type:String,converter:w,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let k=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=x){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),a=this.getPropertyDescriptor(e,i,t);void 0!==a&&c(this.prototype,e,a)}}static getPropertyDescriptor(e,t,i){const{get:a,set:s}=p(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:a,set(t){const n=a?.call(this);s?.call(this,t),this.requestUpdate(e,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??x}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=g(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...u(e),...m(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(h(e))}else void 0!==e&&t.push(h(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{if(s)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of t){const t=document.createElement("style"),s=a.litNonce;void 0!==s&&t.setAttribute("nonce",s),t.textContent=i.cssText,e.appendChild(t)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),a=this.constructor._$Eu(e,i);if(void 0!==a&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:w).toAttribute(t,i.type);this._$Em=e,null==s?this.removeAttribute(a):this.setAttribute(a,s),this._$Em=null}}_$AK(e,t){const i=this.constructor,a=i._$Eh.get(e);if(void 0!==a&&this._$Em!==a){const e=i.getPropertyOptions(a),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:w;this._$Em=a;const n=s.fromAttribute(t,e.type);this[a]=n??this._$Ej?.get(a)??n,this._$Em=null}}requestUpdate(e,t,i,a=!1,s){if(void 0!==e){const n=this.constructor;if(!1===a&&(s=this[e]),i??=n.getPropertyOptions(e),!((i.hasChanged??$)(s,t)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:a,wrapped:s},n){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==s||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===a&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,a=this[t];!0!==e||this._$AL.has(t)||void 0===a||this.C(t,void 0,i,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[b("elementProperties")]=new Map,k[b("finalized")]=new Map,y?.({ReactiveElement:k}),(f.reactiveElementVersions??=[]).push("2.1.2");const C=globalThis,A=e=>e,S=C.trustedTypes,E=S?S.createPolicy("lit-html",{createHTML:e=>e}):void 0,H="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,L="?"+T,D=`<${L}>`,M=document,z=()=>M.createComment(""),I=e=>null===e||"object"!=typeof e&&"function"!=typeof e,N=Array.isArray,O="[ \t\n\f\r]",P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,V=/-->/g,U=/>/g,j=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,F=/"/g,B=/^(?:script|style|textarea|title)$/i,K=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),Z=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),G=new WeakMap,q=M.createTreeWalker(M,129);function Y(e,t){if(!N(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(t):t}const J=(e,t)=>{const i=e.length-1,a=[];let s,n=2===t?"<svg>":3===t?"<math>":"",r=P;for(let t=0;t<i;t++){const i=e[t];let o,d,h=-1,l=0;for(;l<i.length&&(r.lastIndex=l,d=r.exec(i),null!==d);)l=r.lastIndex,r===P?"!--"===d[1]?r=V:void 0!==d[1]?r=U:void 0!==d[2]?(B.test(d[2])&&(s=RegExp("</"+d[2],"g")),r=j):void 0!==d[3]&&(r=j):r===j?">"===d[0]?(r=s??P,h=-1):void 0===d[1]?h=-2:(h=r.lastIndex-d[2].length,o=d[1],r=void 0===d[3]?j:'"'===d[3]?F:R):r===F||r===R?r=j:r===V||r===U?r=P:(r=j,s=void 0);const c=r===j&&e[t+1].startsWith("/>")?" ":"";n+=r===P?i+D:h>=0?(a.push(o),i.slice(0,h)+H+i.slice(h)+T+c):i+T+(-2===h?t:c)}return[Y(e,n+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),a]};class X{constructor({strings:e,_$litType$:t},i){let a;this.parts=[];let s=0,n=0;const r=e.length-1,o=this.parts,[d,h]=J(e,t);if(this.el=X.createElement(d,i),q.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(a=q.nextNode())&&o.length<r;){if(1===a.nodeType){if(a.hasAttributes())for(const e of a.getAttributeNames())if(e.endsWith(H)){const t=h[n++],i=a.getAttribute(e).split(T),r=/([.?@])?(.*)/.exec(t);o.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?ae:"?"===r[1]?se:"@"===r[1]?ne:ie}),a.removeAttribute(e)}else e.startsWith(T)&&(o.push({type:6,index:s}),a.removeAttribute(e));if(B.test(a.tagName)){const e=a.textContent.split(T),t=e.length-1;if(t>0){a.textContent=S?S.emptyScript:"";for(let i=0;i<t;i++)a.append(e[i],z()),q.nextNode(),o.push({type:2,index:++s});a.append(e[t],z())}}}else if(8===a.nodeType)if(a.data===L)o.push({type:2,index:s});else{let e=-1;for(;-1!==(e=a.data.indexOf(T,e+1));)o.push({type:7,index:s}),e+=T.length-1}s++}}static createElement(e,t){const i=M.createElement("template");return i.innerHTML=e,i}}function Q(e,t,i=e,a){if(t===Z)return t;let s=void 0!==a?i._$Co?.[a]:i._$Cl;const n=I(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),void 0===n?s=void 0:(s=new n(e),s._$AT(e,i,a)),void 0!==a?(i._$Co??=[])[a]=s:i._$Cl=s),void 0!==s&&(t=Q(e,s._$AS(e,t.values),s,a)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,a=(e?.creationScope??M).importNode(t,!0);q.currentNode=a;let s=q.nextNode(),n=0,r=0,o=i[0];for(;void 0!==o;){if(n===o.index){let t;2===o.type?t=new te(s,s.nextSibling,this,e):1===o.type?t=new o.ctor(s,o.name,o.strings,this,e):6===o.type&&(t=new re(s,this,e)),this._$AV.push(t),o=i[++r]}n!==o?.index&&(s=q.nextNode(),n++)}return q.currentNode=M,a}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,a){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Q(this,e,t),I(e)?e===W||null==e||""===e?(this._$AH!==W&&this._$AR(),this._$AH=W):e!==this._$AH&&e!==Z&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>N(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==W&&I(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,a="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=X.createElement(Y(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(t);else{const e=new ee(a,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=G.get(e.strings);return void 0===t&&G.set(e.strings,t=new X(e)),t}k(e){N(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,a=0;for(const s of e)a===t.length?t.push(i=new te(this.O(z()),this.O(z()),this,this.options)):i=t[a],i._$AI(s),a++;a<t.length&&(this._$AR(i&&i._$AB.nextSibling,a),t.length=a)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,a,s){this.type=1,this._$AH=W,this._$AN=void 0,this.element=e,this.name=t,this._$AM=a,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(e,t=this,i,a){const s=this.strings;let n=!1;if(void 0===s)e=Q(this,e,t,0),n=!I(e)||e!==this._$AH&&e!==Z,n&&(this._$AH=e);else{const a=e;let r,o;for(e=s[0],r=0;r<s.length-1;r++)o=Q(this,a[i+r],t,r),o===Z&&(o=this._$AH[r]),n||=!I(o)||o!==this._$AH[r],o===W?e=W:e!==W&&(e+=(o??"")+s[r+1]),this._$AH[r]=o}n&&!a&&this.j(e)}j(e){e===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ae extends ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===W?void 0:e}}class se extends ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==W)}}class ne extends ie{constructor(e,t,i,a,s){super(e,t,i,a,s),this.type=5}_$AI(e,t=this){if((e=Q(this,e,t,0)??W)===Z)return;const i=this._$AH,a=e===W&&i!==W||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==W&&(i===W||a);a&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Q(this,e)}}const oe=C.litHtmlPolyfillSupport;oe?.(X,te),(C.litHtmlVersions??=[]).push("3.3.3");const de=globalThis;class he extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const a=i?.renderBefore??t;let s=a._$litPart$;if(void 0===s){const e=i?.renderBefore??null;a._$litPart$=s=new te(t.insertBefore(z(),e),e,void 0,i??{})}return s._$AI(e),s})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Z}}he._$litElement$=!0,he.finalized=!0,de.litElementHydrateSupport?.({LitElement:he});const le=de.litElementPolyfillSupport;le?.({LitElement:he}),(de.litElementVersions??=[]).push("4.2.2");const ce=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},pe={attribute:!0,type:String,converter:w,reflect:!1,hasChanged:$},ue=(e=pe,t,i)=>{const{kind:a,metadata:s}=i;let n=globalThis.litPropertyMetadata.get(s);if(void 0===n&&globalThis.litPropertyMetadata.set(s,n=new Map),"setter"===a&&((e=Object.create(e)).wrapped=!0),n.set(i.name,e),"accessor"===a){const{name:a}=i;return{set(i){const s=t.get.call(this);t.set.call(this,i),this.requestUpdate(a,s,e,!0,i)},init(t){return void 0!==t&&this.C(a,void 0,e,t),t}}}if("setter"===a){const{name:a}=i;return function(i){const s=this[a];t.call(this,i),this.requestUpdate(a,s,e,!0,i)}}throw Error("Unsupported decorator location: "+a)};function me(e){return(t,i)=>"object"==typeof i?ue(e,t,i):((e,t,i)=>{const a=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),a?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function ge(e){return me({...e,state:!0,attribute:!1})}const fe={"board.missing":"No Hearth board found. Add the Hearth integration.","board.missing_hint":"No Hearth board found. Add the Hearth integration, or set board_entity in this card.","board.no_members":"No family members yet. Add them in the Hearth integration's options.","calendar.month":"Month","calendar.week":"Week","calendar.day":"Day","calendar.previous":"Previous","calendar.today":"Today","calendar.next":"Next","calendar.new_event":"New event","calendar.no_calendars":"No calendars are assigned yet. Open the Hearth integration's options and give your family members their calendars.","calendar.load_failed":"Could not load: {items}","calendar.empty_day":"Nothing planned.","calendar.empty_day_tap":"Nothing planned. Tap to add something.","dialog.title":"New event","dialog.summary":"Title","dialog.calendar":"Calendar","dialog.date":"Date","dialog.all_day":"All day","dialog.from":"From","dialog.to":"To","dialog.note":"Note","dialog.cancel":"Cancel","dialog.save":"Save","dialog.saving":"Saving…","dialog.no_writable":"No writable calendar is configured. Add calendars to a family member, or remove one from the read-only list.","dialog.failed":"The event could not be created.","people.home":"Home","people.away":"Out","agenda.all_day":"All day","agenda.nothing_planned":"Nothing planned","agenda.nothing_coming":"Nothing coming up.","lists.empty":"Nothing on this list","lists.unreachable":"Not reachable right now","lists.show_more":"Show {count} more","lists.add":"Add","lists.add_placeholder":"Add an item","lists.none_configured":"No lists configured. Pick your family lists in the Hearth options, or set entities on this card.","routines.nothing_today":"Nothing today","routines.auto":"Automatic (by time of day)","routines.morning":"Morning","routines.evening":"Evening","routines.both":"Both","routines.none_configured":"No routines for today. Add them under Configure → Edit routines in the Hearth integration.","editor.board_entity":"Board sensor","editor.view":"Opening view","editor.views":"Available views","editor.show_legend":"Show the colour legend","editor.create":"Allow creating events by tapping a day","editor.default_calendar":"Preselected calendar","editor.max_events_per_day":'Events per day before "+N"',"editor.days":"Days ahead","editor.max_events":"Events per day","editor.hide_empty_days":"Hide days with nothing on them","editor.show_events":"Show today's events","editor.show_tasks":"Show open task counts","editor.show_points":"Show points","editor.entities":"To-do lists","editor.allow_add":"Allow adding items","editor.max_items":"Items before collapsing","editor.columns":"Columns","editor.weather_entity":"Weather entity","editor.greeting":"Greeting","editor.show_seconds":"Show seconds","editor.block":"Which block to show","editor.evening_from":"Evening starts at (hour)","editor.show_empty":"Show members with nothing on today","editor.members":"Limit to these members"},_e={en:fe,de:{"board.missing":"Kein Hearth-Board gefunden. Füge die Hearth-Integration hinzu.","board.missing_hint":"Kein Hearth-Board gefunden. Füge die Hearth-Integration hinzu oder setze board_entity in dieser Karte.","board.no_members":"Noch keine Familienmitglieder. Lege sie in den Optionen der Hearth-Integration an.","calendar.month":"Monat","calendar.week":"Woche","calendar.day":"Tag","calendar.previous":"Zurück","calendar.today":"Heute","calendar.next":"Weiter","calendar.new_event":"Neuer Termin","calendar.no_calendars":"Noch keine Kalender zugeordnet. Öffne die Optionen der Hearth-Integration und gib deinen Familienmitgliedern ihre Kalender.","calendar.load_failed":"Konnte nicht geladen werden: {items}","calendar.empty_day":"Nichts geplant.","calendar.empty_day_tap":"Nichts geplant. Zum Eintragen tippen.","dialog.title":"Neuer Termin","dialog.summary":"Titel","dialog.calendar":"Kalender","dialog.date":"Datum","dialog.all_day":"Ganztägig","dialog.from":"Von","dialog.to":"Bis","dialog.note":"Notiz","dialog.cancel":"Abbrechen","dialog.save":"Speichern","dialog.saving":"Speichert…","dialog.no_writable":"Kein beschreibbarer Kalender eingerichtet. Ordne einem Familienmitglied Kalender zu oder nimm einen aus der schreibgeschützten Liste heraus.","dialog.failed":"Der Termin konnte nicht angelegt werden.","people.home":"Zuhause","people.away":"Unterwegs","agenda.all_day":"Ganztägig","agenda.nothing_planned":"Nichts geplant","agenda.nothing_coming":"Nichts in Sicht.","lists.empty":"Diese Liste ist leer","lists.unreachable":"Gerade nicht erreichbar","lists.show_more":"{count} weitere anzeigen","lists.add":"Hinzufügen","lists.add_placeholder":"Eintrag hinzufügen","lists.none_configured":"Keine Listen eingerichtet. Wähle eure Familienlisten in den Hearth-Optionen oder setze entities auf dieser Karte.","routines.nothing_today":"Heute nichts","routines.auto":"Automatisch (nach Tageszeit)","routines.morning":"Morgen","routines.evening":"Abend","routines.both":"Beide","routines.none_configured":"Für heute sind keine Routinen hinterlegt. Trage sie in der Hearth-Integration unter „Konfigurieren → Routinen bearbeiten“ ein.","editor.board_entity":"Board-Sensor","editor.view":"Startansicht","editor.views":"Verfügbare Ansichten","editor.show_legend":"Farblegende anzeigen","editor.create":"Termine per Tippen auf einen Tag anlegen","editor.default_calendar":"Vorausgewählter Kalender","editor.max_events_per_day":"Termine pro Tag vor „+N“","editor.days":"Tage im Voraus","editor.max_events":"Termine pro Tag","editor.hide_empty_days":"Tage ohne Termine ausblenden","editor.show_events":"Heutige Termine anzeigen","editor.show_tasks":"Offene Aufgaben anzeigen","editor.show_points":"Punkte anzeigen","editor.entities":"Aufgabenlisten","editor.allow_add":"Einträge hinzufügen erlauben","editor.max_items":"Einträge vor dem Einklappen","editor.columns":"Spalten","editor.weather_entity":"Wetter-Entität","editor.greeting":"Begrüßung","editor.show_seconds":"Sekunden anzeigen","editor.block":"Welcher Block angezeigt wird","editor.evening_from":"Abend beginnt um (Stunde)","editor.show_empty":"Mitglieder ohne Routine heute anzeigen","editor.members":"Auf diese Mitglieder beschränken"}};function ve(e,t,i){const a=_e[function(e){return(e?.locale?.language||e?.language||"en").toLowerCase().split("-")[0]}(e)]??fe;let s=a[t]??fe[t]??t;if(i)for(const[e,t]of Object.entries(i))s=s.replace(`{${e}}`,String(t));return s}const ye={name:"board_entity",selector:{entity:{domain:"sensor"}}},be=e=>({name:e,selector:{boolean:{}}}),we=(e,t,i)=>({name:e,selector:{number:{min:t,max:i,mode:"box"}}}),$e=(e,t,i=!1)=>({name:e,selector:{select:{options:t,multiple:i,mode:i?"list":"dropdown"}}});class xe extends he{constructor(){super(...arguments),this._config={type:""},this._label=e=>ve(this.hass,`editor.${e.name}`)}setConfig(e){this._config={...e}}_valueChanged(e){e.stopPropagation();const t={...this._config,...e.detail?.value??{}};for(const[e,i]of Object.entries(t))(void 0===i||""===i||Array.isArray(i)&&!i.length)&&delete t[e];var i,a;i="config-changed",a={config:t},this.dispatchEvent(new CustomEvent(i,{detail:a,bubbles:!0,composed:!0}))}render(){return this.hass?K`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this.schema()}
        .computeLabel=${this._label}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:K``}}i([me({attribute:!1})],xe.prototype,"hass",void 0),i([ge()],xe.prototype,"_config",void 0);let ke=class extends xe{schema(){const e=[{value:"month",label:ve(this.hass,"calendar.month")},{value:"week",label:ve(this.hass,"calendar.week")},{value:"day",label:ve(this.hass,"calendar.day")}];return[ye,$e("view",e),$e("views",e,!0),{name:"default_calendar",selector:{entity:{domain:"calendar"}}},we("max_events_per_day",1,10),be("show_legend"),be("create")]}};ke=i([ce("hearth-calendar-card-editor")],ke);let Ce=class extends xe{schema(){return[ye,we("days",1,14),we("max_events",1,20),be("hide_empty_days")]}};Ce=i([ce("hearth-agenda-card-editor")],Ce);let Ae=class extends xe{schema(){return[ye,be("show_events"),we("max_events",1,5),be("show_tasks"),be("show_points")]}};Ae=i([ce("hearth-people-card-editor")],Ae);let Se=class extends xe{schema(){return[ye,{name:"entities",selector:{entity:{domain:"todo",multiple:!0}}},we("columns",1,6),we("max_items",1,50),be("allow_add")]}};Se=i([ce("hearth-lists-card-editor")],Se);let Ee=class extends xe{schema(){return[ye,$e("block",[{value:"auto",label:ve(this.hass,"routines.auto")},{value:"morning",label:ve(this.hass,"routines.morning")},{value:"evening",label:ve(this.hass,"routines.evening")},{value:"both",label:ve(this.hass,"routines.both")}]),we("evening_from",0,23),be("show_empty")]}};Ee=i([ce("hearth-routines-card-editor")],Ee);let He=class extends xe{schema(){return[{name:"weather_entity",selector:{entity:{domain:"weather"}}},{name:"greeting",selector:{text:{}}},be("show_seconds")]}};He=i([ce("hearth-header-card-editor")],He);const Te=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];function Le(e){const t=new Date(e);return t.setHours(0,0,0,0),t}function De(e,t){const i=new Date(e);return i.setDate(i.getDate()+t),i}function Me(e,t){const i=new Date(e);return i.setDate(1),i.setMonth(i.getMonth()+t),i}function ze(e){const t=Le(e);return t.setDate(1),t}function Ie(e,t){const i=Le(e);return De(i,-(i.getDay()-t+7)%7)}function Ne(e,t){return e.getFullYear()===t.getFullYear()&&e.getMonth()===t.getMonth()&&e.getDate()===t.getDate()}function Oe(e){return Ne(e,new Date)}function Pe(e){const t=`${e.getMonth()+1}`.padStart(2,"0"),i=`${e.getDate()}`.padStart(2,"0");return`${e.getFullYear()}-${t}-${i}`}function Ve(e){const t=e=>`${e}`.padStart(2,"0");return`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())} ${t(e.getHours())}:${t(e.getMinutes())}:00`}function Ue(e){const t=e=>`${e}`.padStart(2,"0");return`${t(e.getHours())}:${t(e.getMinutes())}`}function je(e){switch(e.locale?.time_format){case"12":return!0;case"24":return!1;default:return}}function Re(e){return e.locale?.language||e.language||"en"}const Fe=d`
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
`,Be=d`
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
`,Ke=d`
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
`;let Ze=class extends he{constructor(){super(...arguments),this._config={type:""},this._now=new Date}static async getConfigElement(){return document.createElement("hearth-header-card-editor")}static getStubConfig(){return{show_seconds:!1}}setConfig(e){this._config={...e}}getCardSize(){return 2}getGridOptions(){return{columns:"full",rows:"auto"}}connectedCallback(){super.connectedCallback();const e=this._config.show_seconds?1e3:2e4;this._timer=window.setInterval(()=>{this._now=new Date},e)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&(window.clearInterval(this._timer),this._timer=void 0)}_weather(){const e=this._config.weather_entity;if(!e)return W;const t=this.hass.states[e];if(!t)return W;const i=t.attributes?.temperature,a=t.attributes?.temperature_unit??"",s=this.hass.formatEntityState(t);return K`
      <div class="weather">
        <div class="temperature">
          ${"number"==typeof i?`${Math.round(i)}${a}`:"—"}
        </div>
        <div class="condition">${s}</div>
      </div>
    `}render(){if(!this.hass)return K`<ha-card></ha-card>`;const e=Re(this.hass),t=new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit",...this._config.show_seconds?{second:"2-digit"}:{},hour12:je(this.hass)}).format(this._now),i=new Intl.DateTimeFormat(e,{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(this._now);return K`
      <ha-card>
        <div class="bar">
          <div class="left">
            <div class="clock">${t}</div>
            <div class="date">${i}</div>
            ${this._config.greeting?K`<div class="greeting">${this._config.greeting}</div>`:W}
          </div>
          ${this._weather()}
        </div>
      </ha-card>
    `}};Ze.styles=[Fe,d`
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
    `],i([me({attribute:!1})],Ze.prototype,"hass",void 0),i([ge()],Ze.prototype,"_config",void 0),i([ge()],Ze.prototype,"_now",void 0),Ze=i([ce("hearth-header-card")],Ze),window.customCards=window.customCards||[],window.customCards.push({type:"hearth-header-card",name:"Hearth Header",description:"Clock, date and weather, sized to be read from across the room.",preview:!0,documentationURL:"https://github.com/DomCim/Homeassistant-hearth"});function We(e){return!0===e.attributes?.hearth_board}function Ge(e,i){let a;if(i){if(a=e.states[i],!a)return null}else if(a=Object.values(e.states).find(We),!a)return null;const s=a.attributes,n=(Array.isArray(s.members)?s.members:[]).map((e,i)=>{const a=e;return{id:String(a.id??i),name:String(a.name??""),color:a.color||t[i%t.length],avatar:a.avatar??null,person:a.person??null,calendars:a.calendars??[],todo_lists:a.todo_lists??[],order:a.order??i}});n.sort((e,t)=>e.order-t.order||e.name.localeCompare(t.name));const r=e=>Array.isArray(s[e])?s[e]:[];return{entityId:a.entity_id,members:n,sharedCalendars:r("shared_calendars"),sharedTodoLists:r("shared_todo_lists"),readonlyCalendars:r("readonly_calendars")}}function qe(e,t){const i={};for(const t of[...e.sharedCalendars,...e.readonlyCalendars])i[t]={memberId:null,color:"#7a8b99"};for(const t of e.members)for(const e of t.calendars)i[e]={memberId:t.id,color:t.color};return i}function Ye(e){const t=new Set(e.readonlyCalendars),i=[...e.sharedCalendars,...e.members.flatMap(e=>e.calendars)];return[...new Set(i)].filter(e=>!t.has(e))}function Je(e,t){return Object.values(e.states).find(e=>e.attributes?.member_id===t)}function Xe(e,t){const i=e.states[t];return i?.attributes?.friendly_name||t}function Qe(e){return e.date?{date:Le(new Date(`${e.date}T00:00:00`)),allDay:!0}:{date:new Date(e.dateTime),allDay:!1}}async function et(e,t,i,a){const s=`start=${encodeURIComponent(i.toISOString())}&end=${encodeURIComponent(a.toISOString())}`,n=await Promise.all(Object.keys(t).map(async i=>{try{const a=await e.callApi("GET",`calendars/${i}?${s}`);return{entityId:i,events:(a||[]).map(e=>function(e,t,i){if(!e?.start||!e?.end)return null;const a=Qe(e.start),s=Qe(e.end);return Number.isNaN(a.date.getTime())||Number.isNaN(s.date.getTime())?null:{summary:e.summary||"",start:a.date,end:s.date,allDay:a.allDay,calendar:t,memberId:i.memberId,color:i.color,description:e.description,location:e.location,uid:e.uid,recurrenceId:e.recurrence_id}}(e,i,t[i])).filter(e=>null!==e)}}catch(e){return console.warn(`[hearth] could not load ${i}`,e),{entityId:i,events:null}}})),r=[],o=[];for(const e of n)null===e.events?o.push(e.entityId):r.push(...e.events);return r.sort((e,t)=>e.allDay!==t.allDay?e.allDay?-1:1:e.start.getTime()-t.start.getTime()),{events:r,failed:o}}function tt(e,t){const i=[];for(let a=Le(e);a<t;a=De(a,1))i.push(a);return i}function it(e,t){const i=t.map(e=>({key:Pe(e),from:e.getTime(),to:De(e,1).getTime()})),a=new Map(i.map(e=>[e.key,[]]));for(const t of e){const e=t.start.getTime(),s=t.end.getTime();for(const n of i)e<n.to&&s>n.from&&a.get(n.key).push(t)}return a}const at="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z",st="M14,4V6H18V18H14V20H20V4M13,12L9,8V11H1V13H9V16L13,12Z",nt="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z",rt="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z";let ot=class extends he{constructor(){super(...arguments),this._config={type:""},this._events=[],this._loadedSignature="",this._reloadToken=0}static async getConfigElement(){return document.createElement("hearth-people-card-editor")}static getStubConfig(){return{show_events:!0,max_events:2}}setConfig(e){this._config={...e}}getCardSize(){return 4}getGridOptions(){return{columns:"full",rows:"auto"}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>{this._reloadToken+=1,this._maybeFetch()},6e5)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&(window.clearInterval(this._timer),this._timer=void 0)}updated(e){super.updated(e),this._maybeFetch()}async _maybeFetch(){const e=this.hass,t=e?Ge(e,this._config.board_entity):null;if(!e||!t||!1===this._config.show_events)return;const i=qe(t),a=Object.keys(i).sort(),s=Le(new Date),n=a.map(t=>e.states[t]?.last_changed??"-"),r=[s.getTime(),a.join(","),n.join(","),this._reloadToken].join("|");if(r===this._loadedSignature||0===a.length)return;this._loadedSignature=r;const{events:o}=await et(e,i,s,De(s,1));this._loadedSignature===r&&(this._events=o)}_icon(e){return K`<svg viewBox="0 0 24 24"><path d=${e} /></svg>`}_formatTime(e){return new Intl.DateTimeFormat(Re(this.hass),{hour:"numeric",minute:"2-digit",hour12:je(this.hass)}).format(e)}_presence(e){if(!e.person)return null;const t=this.hass.states[e.person]?.state;return t&&"unknown"!==t&&"unavailable"!==t?"home"===t?{label:ve(this.hass,"people.home"),home:!0}:"not_home"===t?{label:ve(this.hass,"people.away"),home:!1}:{label:t,home:!1}:null}_renderMember(e){const t=Je(this.hass,e.id),i=this._presence(e),a=Number(t?.state),s=!1!==this._config.show_tasks&&Number.isFinite(a),n=t?.attributes?.points,r=!1!==this._config.show_points&&"number"==typeof n,o=Le(new Date),d=!1===this._config.show_events?[]:this._events.filter(t=>t.memberId===e.id&&function(e,t){const i=Le(t),a=De(i,1);return e.start<a&&e.end>i}(t,o)).slice(0,this._config.max_events??2),h=e.name.trim().charAt(0).toUpperCase()||"?";return K`
      <div class="person" style=${`--member-color:${e.color}`}>
        <div class="avatar ${i&&!i.home?"away":""}">
          ${e.avatar?K`<img src=${e.avatar} alt="" />`:K`<span>${h}</span>`}
        </div>

        <div class="name">${e.name}</div>

        <div class="chips">
          ${i?K`<span class="chip">
                ${this._icon(i.home?at:st)}${i.label}
              </span>`:W}
          ${s&&a>0?K`<span class="chip">${this._icon(nt)}${a}</span>`:W}
          ${r?K`<span class="chip">${this._icon(rt)}${n}</span>`:W}
        </div>

        ${d.length>0?K`<div class="today">
              ${d.map(e=>K`
                  <div class="today-event">
                    ${e.allDay?W:K`<span class="time">${this._formatTime(e.start)}</span>`}
                    <span class="summary">${e.summary}</span>
                  </div>
                `)}
            </div>`:W}
      </div>
    `}render(){if(!this.hass)return K`<ha-card></ha-card>`;const e=Ge(this.hass,this._config.board_entity);return e&&0!==e.members.length?K`
      <ha-card>
        <div class="strip">${e.members.map(e=>this._renderMember(e))}</div>
      </ha-card>
    `:K`
        <ha-card>
          <div class="notice">${ve(this.hass,"board.no_members")}</div>
        </ha-card>
      `}};ot.styles=[Fe,Be,d`
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
    `],i([me({attribute:!1})],ot.prototype,"hass",void 0),i([ge()],ot.prototype,"_config",void 0),i([ge()],ot.prototype,"_events",void 0),ot=i([ce("hearth-people-card")],ot),window.customCards=window.customCards||[],window.customCards.push({type:"hearth-people-card",name:"Hearth People",description:"Who's home, what's on today, open tasks and points.",preview:!0,documentationURL:"https://github.com/DomCim/Homeassistant-hearth"});let dt=class extends he{constructor(){super(...arguments),this._summary="",this._calendar="",this._dateKey="",this._allDay=!0,this._startTime="",this._endTime="",this._description="",this._saving=!1}connectedCallback(){super.connectedCallback();const e=Ye(this.board);this._calendar=this.defaultCalendar&&e.includes(this.defaultCalendar)?this.defaultCalendar:e[0]??"",this._dateKey=Pe(this.day);const t=new Date(this.day);t.setHours(9,0,0,0),this._startTime=Ue(t),t.setHours(t.getHours()+1),this._endTime=Ue(t)}_close(){this.dispatchEvent(new CustomEvent("hearth-close",{bubbles:!0,composed:!0}))}_onScrimClick(e){e.target===e.currentTarget&&this._close()}async _save(){const e=this._summary.trim();if(!e||!this._calendar||this._saving)return;const t=function(e){const[t,i,a]=e.split("-").map(Number);return new Date(t,i-1,a)}(this._dateKey);let i,a;if(this._allDay)i=t,a=De(t,1);else{const[e,s]=this._startTime.split(":").map(Number),[n,r]=this._endTime.split(":").map(Number);i=new Date(t),i.setHours(e,s,0,0),a=new Date(t),a.setHours(n,r,0,0),a<=i&&(a=De(a,1))}this._saving=!0,this._error=void 0;try{await async function(e,t,i){const a={summary:i.summary};i.description&&(a.description=i.description),i.allDay?(a.start_date=Pe(i.start),a.end_date=Pe(i.end)):(a.start_date_time=Ve(i.start),a.end_date_time=Ve(i.end)),await e.callService("calendar","create_event",a,{entity_id:t})}(this.hass,this._calendar,{summary:e,start:i,end:a,allDay:this._allDay,description:this._description.trim()||void 0}),this.dispatchEvent(new CustomEvent("hearth-created",{bubbles:!0,composed:!0})),this._close()}catch(e){this._error=e instanceof Error?e.message:ve(this.hass,"dialog.failed")}finally{this._saving=!1}}_calendarOptions(){const e=new Map;for(const t of this.board.members)for(const i of t.calendars)e.set(i,t.name);return Ye(this.board).map(t=>{const i=e.get(t),a=i?`${i} — ${Xe(this.hass,t)}`:Xe(this.hass,t);return K`<option value=${t} ?selected=${t===this._calendar}>
        ${a}
      </option>`})}render(){const e=this._calendarOptions(),t=Boolean(this._summary.trim()&&this._calendar)&&!this._saving;return K`
      <div class="scrim" @click=${this._onScrimClick}>
        <div class="sheet" role="dialog" aria-modal="true">
          <h2>${ve(this.hass,"dialog.title")}</h2>

          ${this._error?K`<p class="error">${this._error}</p>`:W}
          ${0===e.length?K`<p class="error">${ve(this.hass,"dialog.no_writable")}</p>`:W}

          <div class="field">
            <label for="summary">${ve(this.hass,"dialog.summary")}</label>
            <input
              id="summary"
              type="text"
              .value=${this._summary}
              autocomplete="off"
              @input=${e=>{this._summary=e.target.value}}
            />
          </div>

          <div class="field">
            <label for="calendar">${ve(this.hass,"dialog.calendar")}</label>
            <select
              id="calendar"
              @change=${e=>{this._calendar=e.target.value}}
            >
              ${e}
            </select>
          </div>

          <div class="field">
            <label for="date">${ve(this.hass,"dialog.date")}</label>
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
            <span>${ve(this.hass,"dialog.all_day")}</span>
            <span class="switch"></span>
          </button>

          ${this._allDay?W:K`
                <div class="row">
                  <div class="field">
                    <label for="from">${ve(this.hass,"dialog.from")}</label>
                    <input
                      id="from"
                      type="time"
                      .value=${this._startTime}
                      @change=${e=>{this._startTime=e.target.value}}
                    />
                  </div>
                  <div class="field">
                    <label for="to">${ve(this.hass,"dialog.to")}</label>
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
            <label for="note">${ve(this.hass,"dialog.note")}</label>
            <textarea
              id="note"
              .value=${this._description}
              @input=${e=>{this._description=e.target.value}}
            ></textarea>
          </div>

          <div class="actions">
            <button class="ghost" @click=${this._close}>${ve(this.hass,"dialog.cancel")}</button>
            <button class="primary" ?disabled=${!t} @click=${this._save}>
              ${ve(this.hass,this._saving?"dialog.saving":"dialog.save")}
            </button>
          </div>
        </div>
      </div>
    `}};dt.styles=[Fe,Be,Ke],i([me({attribute:!1})],dt.prototype,"hass",void 0),i([me({attribute:!1})],dt.prototype,"board",void 0),i([me({attribute:!1})],dt.prototype,"day",void 0),i([me({attribute:!1})],dt.prototype,"defaultCalendar",void 0),i([ge()],dt.prototype,"_summary",void 0),i([ge()],dt.prototype,"_calendar",void 0),i([ge()],dt.prototype,"_dateKey",void 0),i([ge()],dt.prototype,"_allDay",void 0),i([ge()],dt.prototype,"_startTime",void 0),i([ge()],dt.prototype,"_endTime",void 0),i([ge()],dt.prototype,"_description",void 0),i([ge()],dt.prototype,"_saving",void 0),i([ge()],dt.prototype,"_error",void 0),dt=i([ce("hearth-event-dialog")],dt);const ht=["month","week","day"],lt="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z",ct="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",pt="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z",ut="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",mt="M13,14H11V9H13M13,18H11V16H13M1,21H23L12,2L1,21Z";let gt=class extends he{constructor(){super(...arguments),this._config={type:""},this._view="month",this._anchor=Le(new Date),this._events=[],this._failed=[],this._loading=!1,this._loadedSignature="",this._reloadToken=0}static async getConfigElement(){return document.createElement("hearth-calendar-card-editor")}static getStubConfig(){return{view:"month",show_legend:!0,create:!0}}setConfig(e){this._config={...e},e.view&&ht.includes(e.view)&&(this._view=e.view)}getCardSize(){return"month"===this._view?12:8}getGridOptions(){return{columns:"full",rows:"month"===this._view?12:8}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._reload(),3e5)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&(window.clearInterval(this._timer),this._timer=void 0)}updated(e){super.updated(e),this._maybeFetch()}get _board(){return this.hass?Ge(this.hass,this._config.board_entity):null}get _firstDay(){return this.hass?function(e){const t=e.locale?.first_weekday;if(t&&"language"!==t){const e=Te.indexOf(t);if(e>=0)return e}try{const t=new Intl.Locale(e.locale?.language||e.language||"en").weekInfo;if(t?.firstDay)return t.firstDay%7}catch{}return 1}(this.hass):1}_range(){if("month"===this._view){const{start:e,end:t}=function(e,t){const i=Ie(ze(e),t);let a=Ie(De(Me(ze(e),1),-1),t);a=De(a,7);let s=Math.round((a.getTime()-i.getTime())/6048e5);return s<6&&(a=De(a,7*(6-s)),s=6),{start:i,end:a,weeks:s}}(this._anchor,this._firstDay);return{start:e,end:t}}if("week"===this._view){const e=Ie(this._anchor,this._firstDay);return{start:e,end:De(e,7)}}const e=Le(this._anchor);return{start:e,end:De(e,1)}}_reload(){this._reloadToken+=1,this._maybeFetch()}async _maybeFetch(){const e=this.hass,t=this._board;if(!e||!t)return;const i=qe(t),a=Object.keys(i).sort(),{start:s,end:n}=this._range(),r=a.map(t=>e.states[t]?.last_changed??"-"),o=[s.getTime(),n.getTime(),a.join(","),r.join(","),this._reloadToken].join("|");if(o!==this._loadedSignature){if(this._loadedSignature=o,0===a.length)return this._events=[],void(this._failed=[]);this._loading=!0;try{const{events:t,failed:a}=await et(e,i,s,n);this._loadedSignature===o&&(this._events=t,this._failed=a)}finally{this._loadedSignature===o&&(this._loading=!1)}}}_step(e){"month"===this._view?this._anchor=Me(this._anchor,e):"week"===this._view?this._anchor=De(this._anchor,7*e):this._anchor=De(this._anchor,e)}_goToday(){this._anchor=Le(new Date)}_setView(e){this._view=e}get _createEnabled(){return!1!==this._config.create}_openCreate(e){this._createEnabled&&(this._dialogDay=e)}_openDay(e){this._anchor=Le(e),this._view="day"}_formatTime(e){return new Intl.DateTimeFormat(Re(this.hass),{hour:"numeric",minute:"2-digit",hour12:je(this.hass)}).format(e)}_title(){const e=Re(this.hass);if("month"===this._view)return new Intl.DateTimeFormat(e,{month:"long",year:"numeric"}).format(this._anchor);if("week"===this._view){const{start:t,end:i}=this._range();return new Intl.DateTimeFormat(e,{day:"numeric",month:"short",year:"numeric"}).formatRange(t,De(i,-1))}return new Intl.DateTimeFormat(e,{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(this._anchor)}_weekdayLabels(){const e=new Intl.DateTimeFormat(Re(this.hass),{weekday:"short"}),t=Ie(new Date,this._firstDay);return Array.from({length:7},(i,a)=>e.format(De(t,a)))}_icon(e){return K`<svg viewBox="0 0 24 24"><path d=${e} /></svg>`}_renderEvent(e,t){const i=e.allDay?"":this._formatTime(e.start);return K`
      <div
        class="event ${e.allDay?"all-day":""}"
        style=${`--event-color:${e.color}`}
        title=${e.summary}
      >
        ${e.allDay?W:K`<span class="dot"></span><span class="time">${i}</span>`}
        <span class="summary">${e.summary}</span>
        ${t||!e.location?W:K`<span class="location">${e.location}</span>`}
      </div>
    `}_renderMonth(){const{start:e,end:t}=this._range(),i=tt(e,t),a=it(this._events,i),s=this._config.max_events_per_day??3,n=this._anchor.getMonth();return K`
      <div class="weekday-row">
        ${this._weekdayLabels().map(e=>K`<div class="weekday">${e}</div>`)}
      </div>
      <div class="month-grid" style=${"--weeks:"+i.length/7}>
        ${i.map(e=>{const t=a.get(Pe(e))??[],i=t.slice(0,s),r=t.length-i.length;return K`
            <div
              class="day-cell ${e.getMonth()===n?"":"outside"} ${Oe(e)?"today":""}"
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
                ${r>0?K`<button
                      class="more"
                      @click=${t=>{t.stopPropagation(),this._openDay(e)}}
                    >
                      +${r}
                    </button>`:W}
              </div>
            </div>
          `})}
      </div>
    `}_renderWeek(){const{start:e,end:t}=this._range(),i=tt(e,t),a=it(this._events,i),s=new Intl.DateTimeFormat(Re(this.hass),{weekday:"short",day:"numeric"});return K`
      <div class="week-grid">
        ${i.map(e=>{const t=a.get(Pe(e))??[];return K`
            <div
              class="week-column ${Oe(e)?"today":""}"
              @click=${()=>this._openCreate(e)}
            >
              <div class="week-heading">${s.format(e)}</div>
              <div class="week-events">
                ${0===t.length?K`<div class="empty-hint">—</div>`:t.map(e=>this._renderEvent(e,!0))}
              </div>
            </div>
          `})}
      </div>
    `}_renderDay(){const{start:e,end:t}=this._range(),i=it(this._events,tt(e,t)).get(Pe(e))??[];return K`
      <div class="day-list" @click=${()=>this._openCreate(e)}>
        ${0===i.length?K`<div class="empty-day">
              ${ve(this.hass,this._createEnabled?"calendar.empty_day_tap":"calendar.empty_day")}
            </div>`:i.map(e=>this._renderEvent(e,!1))}
      </div>
    `}_renderLegend(e){return!1===this._config.show_legend||0===e.members.length?W:K`
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
          <div class="notice">${ve(this.hass,"board.missing_hint")}</div>
        </ha-card>
      `;const t=qe(e),i=this._config.views??ht;return K`
      <ha-card>
        <div class="toolbar">
          <button class="icon-button" @click=${()=>this._step(-1)} aria-label=${ve(this.hass,"calendar.previous")}>
            ${this._icon(lt)}
          </button>
          <button class="icon-button" @click=${this._goToday} aria-label=${ve(this.hass,"calendar.today")}>
            ${this._icon(pt)}
          </button>
          <button class="icon-button" @click=${()=>this._step(1)} aria-label=${ve(this.hass,"calendar.next")}>
            ${this._icon(ct)}
          </button>
          <h1 class="title">${this._title()}</h1>
          ${i.length>1?K`<div class="segmented">
                ${i.map(e=>K`
                    <button
                      aria-pressed=${this._view===e}
                      @click=${()=>this._setView(e)}
                    >
                      ${ve(this.hass,`calendar.${e}`)}
                    </button>
                  `)}
              </div>`:W}
          ${this._createEnabled?K`<button
                class="icon-button"
                aria-label=${ve(this.hass,"calendar.new_event")}
                @click=${()=>this._openCreate(Le(this._anchor))}
              >
                ${this._icon(ut)}
              </button>`:W}
        </div>

        ${this._renderLegend(e)}
        ${0===Object.keys(t).length?K`<div class="notice">${ve(this.hass,"calendar.no_calendars")}</div>`:W}
        ${this._failed.length>0?K`<div class="warning">
              ${this._icon(mt)}
              <span>${ve(this.hass,"calendar.load_failed",{items:this._failed.join(", ")})}</span>
            </div>`:W}

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
            ></hearth-event-dialog>`:W}
      </ha-card>
    `}};gt.styles=[Fe,Be,d`
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
    `],i([me({attribute:!1})],gt.prototype,"hass",void 0),i([ge()],gt.prototype,"_config",void 0),i([ge()],gt.prototype,"_view",void 0),i([ge()],gt.prototype,"_anchor",void 0),i([ge()],gt.prototype,"_events",void 0),i([ge()],gt.prototype,"_failed",void 0),i([ge()],gt.prototype,"_loading",void 0),i([ge()],gt.prototype,"_dialogDay",void 0),gt=i([ce("hearth-calendar-card")],gt),window.customCards=window.customCards||[],window.customCards.push({type:"hearth-calendar-card",name:"Hearth Calendar",description:"Family calendar as a month, week or day grid, coloured per member.",preview:!0,documentationURL:"https://github.com/DomCim/Homeassistant-hearth"});let ft=class extends he{constructor(){super(...arguments),this._config={type:""},this._events=[],this._loadedSignature="",this._reloadToken=0}static async getConfigElement(){return document.createElement("hearth-agenda-card-editor")}static getStubConfig(){return{days:3,max_events:6}}setConfig(e){this._config={...e}}getCardSize(){return 6}getGridOptions(){return{columns:"full",rows:"auto"}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>{this._reloadToken+=1,this._maybeFetch()},3e5)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&(window.clearInterval(this._timer),this._timer=void 0)}updated(e){super.updated(e),this._maybeFetch()}get _days(){return Math.max(1,this._config.days??3)}async _maybeFetch(){const e=this.hass,t=e?Ge(e,this._config.board_entity):null;if(!e||!t)return;const i=qe(t),a=Object.keys(i).sort(),s=Le(new Date),n=De(s,this._days),r=a.map(t=>e.states[t]?.last_changed??"-"),o=[s.getTime(),n.getTime(),a.join(","),r.join(","),this._reloadToken].join("|");if(o===this._loadedSignature)return;if(this._loadedSignature=o,0===a.length)return void(this._events=[]);const{events:d}=await et(e,i,s,n);this._loadedSignature===o&&(this._events=d)}_formatTime(e){return new Intl.DateTimeFormat(Re(this.hass),{hour:"numeric",minute:"2-digit",hour12:je(this.hass)}).format(e)}_dayLabel(e){const t=Le(new Date),i=Re(this.hass);return Ne(e,t)?new Intl.RelativeTimeFormat(i,{numeric:"auto"}).format(0,"day"):Ne(e,De(t,1))?new Intl.RelativeTimeFormat(i,{numeric:"auto"}).format(1,"day"):new Intl.DateTimeFormat(i,{weekday:"long",day:"numeric",month:"long"}).format(e)}render(){if(!this.hass)return K`<ha-card></ha-card>`;const e=Ge(this.hass,this._config.board_entity);if(!e)return K`<ha-card
        ><div class="notice">${ve(this.hass,"board.missing")}</div></ha-card
      >`;const t=Le(new Date),i=tt(t,De(t,this._days)),a=it(this._events,i),s=this._config.max_events??6,n=new Map(e.members.map(e=>[e.id,e.name])),r=i.filter(e=>!0!==this._config.hide_empty_days||(a.get(Pe(e))?.length??0)>0);return K`
      <ha-card>
        ${0===r.length?K`<div class="notice">${ve(this.hass,"agenda.nothing_coming")}</div>`:r.map(e=>{const t=(a.get(Pe(e))??[]).slice(0,s);return K`
                <section class="day">
                  <h3 class="day-label">${this._dayLabel(e)}</h3>
                  ${0===t.length?K`<div class="empty">${ve(this.hass,"agenda.nothing_planned")}</div>`:t.map(e=>K`
                          <div class="row" style=${`--event-color:${e.color}`}>
                            <span class="when">
                              ${e.allDay?ve(this.hass,"agenda.all_day"):this._formatTime(e.start)}
                            </span>
                            <span class="what">${e.summary}</span>
                            ${e.memberId&&n.has(e.memberId)?K`<span class="who">${n.get(e.memberId)}</span>`:W}
                          </div>
                        `)}
                </section>
              `})}
      </ha-card>
    `}};ft.styles=[Fe,Be,d`
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
    `],i([me({attribute:!1})],ft.prototype,"hass",void 0),i([ge()],ft.prototype,"_config",void 0),i([ge()],ft.prototype,"_events",void 0),ft=i([ce("hearth-agenda-card")],ft),window.customCards=window.customCards||[],window.customCards.push({type:"hearth-agenda-card",name:"Hearth Agenda",description:"The next few days as a list, coloured per family member.",preview:!0,documentationURL:"https://github.com/DomCim/Homeassistant-hearth"});const _t="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",vt="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z",yt="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z",bt="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95Z";let wt=class extends he{constructor(){super(...arguments),this._config={type:""},this._pending=new Set}static async getConfigElement(){return document.createElement("hearth-routines-card-editor")}static getStubConfig(){return{block:"auto",evening_from:14}}setConfig(e){this._config={...e}}getCardSize(){return 6}getGridOptions(){return{columns:"full",rows:"auto"}}get _blocks(){const e=this._config.block??"auto";if("morning"===e||"evening"===e)return[e];if("both"===e)return["morning","evening"];const t=this._config.evening_from??14;return[(new Date).getHours()<t?"morning":"evening"]}_steps(e,t){const i=Je(this.hass,e.id),a=i?.attributes?.[`routine_${t}`];return Array.isArray(a)?a.filter(e=>Boolean(e)&&"object"==typeof e).map(e=>({step:String(e.step??""),done:Boolean(e.done)})):[]}async _toggle(e,t,i){const a=`${e.id}|${t}|${i.step}`;this._pending=new Set(this._pending).add(a);try{await this.hass.callService("hearth","set_routine_step",{member:e.id,block:t,step:i.step,done:!i.done})}catch(e){console.warn("[hearth] could not update routine step",e)}finally{const e=new Set(this._pending);e.delete(a),this._pending=e}}_icon(e,t=""){return K`<svg class=${t} viewBox="0 0 24 24"><path d=${e} /></svg>`}_renderBlock(e,t){const i=this._steps(e,t),a=i.filter(e=>e.done).length,s=i.length>0&&a===i.length;return K`
      <section class="block ${s?"complete":""}">
        <header class="block-head">
          ${this._icon("morning"===t?yt:bt,"block-icon")}
          <span class="progress">${a}/${i.length}</span>
        </header>

        ${0===i.length?K`<div class="empty">${ve(this.hass,"routines.nothing_today")}</div>`:K`
              <div class="bar">
                <div
                  class="bar-fill"
                  style=${`width:${i.length?a/i.length*100:0}%`}
                ></div>
              </div>
              ${i.map(i=>{const a=`${e.id}|${t}|${i.step}`,s=this._pending.has(a),n=s?!i.done:i.done;return K`
                  <button
                    class="step ${n?"done":""} ${s?"pending":""}"
                    @click=${()=>this._toggle(e,t,i)}
                  >
                    ${this._icon(n?vt:_t,"tick")}
                    <span class="label">${i.step}</span>
                  </button>
                `})}
            `}
      </section>
    `}render(){if(!this.hass)return K`<ha-card></ha-card>`;const e=Ge(this.hass,this._config.board_entity);if(!e)return K`<ha-card
        ><div class="notice">${ve(this.hass,"board.missing")}</div></ha-card
      >`;const t=this._blocks,i=this._config.members?.map(e=>e.toLowerCase()),a=e.members.filter(e=>!(i&&!i.includes(e.id.toLowerCase())&&!i.includes(e.name.toLowerCase()))&&(!0===this._config.show_empty||t.some(t=>this._steps(e,t).length>0)));return 0===a.length?K`
        <ha-card>
          <div class="notice">${ve(this.hass,"routines.none_configured")}</div>
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
    `}};function $t(e,t){const i=e.states[t];return i?.attributes?.friendly_name||t}function xt(e,t){return e.states[t]?.attributes?.icon||null}wt.styles=[Fe,Be,d`
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
    `],i([me({attribute:!1})],wt.prototype,"hass",void 0),i([ge()],wt.prototype,"_config",void 0),i([ge()],wt.prototype,"_pending",void 0),wt=i([ce("hearth-routines-card")],wt),window.customCards=window.customCards||[],window.customCards.push({type:"hearth-routines-card",name:"Hearth Routines",description:"Daily routines per child and weekday, ticked off by the kids themselves.",preview:!0,documentationURL:"https://github.com/DomCim/Homeassistant-hearth"});const kt="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z",Ct="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z",At="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",St="M13,14H11V9H13M13,18H11V16H13M1,21H23L12,2L1,21Z";let Et=class extends he{constructor(){super(...arguments),this._config={type:""},this._lists=[],this._expanded=new Set,this._draft="",this._pending=new Set,this._loadedSignature="",this._reloadToken=0}static async getConfigElement(){return document.createElement("hearth-lists-card-editor")}static getStubConfig(){return{columns:3,max_items:8}}setConfig(e){this._config={...e}}getCardSize(){return 6}getGridOptions(){return{columns:"full",rows:"auto"}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._reload(),3e5)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&(window.clearInterval(this._timer),this._timer=void 0)}updated(e){super.updated(e),this._maybeFetch()}get _entityIds(){if(this._config.entities?.length)return this._config.entities;const e=this.hass?Ge(this.hass,this._config.board_entity):null;return e?.sharedTodoLists??[]}_reload(){this._reloadToken+=1,this._maybeFetch()}async _maybeFetch(){const e=this.hass;if(!e)return;const t=this._entityIds,i=t.map(t=>`${e.states[t]?.state??"-"}`),a=[t.join(","),i.join(","),this._reloadToken].join("|");if(a===this._loadedSignature)return;if(this._loadedSignature=a,0===t.length)return void(this._lists=[]);const s=await async function(e,t,i=!1){const a=i?["needs_action","completed"]:["needs_action"];return Promise.all(t.map(async t=>{const i={entityId:t,name:$t(e,t),icon:xt(e,t)};try{const s=await e.callService("todo","get_items",{status:a},{entity_id:t},!1,!0);return{...i,items:s?.response?.[t]?.items??[],ok:!0}}catch(e){return console.warn(`[hearth] could not read ${t}`,e),{...i,items:[],ok:!1}}}))}(e,t);this._loadedSignature===a&&(this._lists=s,this._pending=new Set)}async _toggle(e,t){const i=`${e.entityId}|${t.uid||t.summary}`;this._pending=new Set(this._pending).add(i);try{await async function(e,t,i,a){await e.callService("todo","update_item",{item:i.uid||i.summary,status:a?"completed":"needs_action"},{entity_id:t})}(this.hass,e.entityId,t,"completed"!==t.status)}catch(e){console.warn("[hearth] could not update item",e);const t=new Set(this._pending);return t.delete(i),void(this._pending=t)}this._reload()}async _submitDraft(e){const t=this._draft.trim();if(t){this._draft="";try{await async function(e,t,i){await e.callService("todo","add_item",{item:i},{entity_id:t})}(this.hass,e.entityId,t)}catch(e){console.warn("[hearth] could not add item",e)}this._reload()}}_icon(e){return K`<svg viewBox="0 0 24 24"><path d=${e} /></svg>`}_renderItem(e,t){const i=`${e.entityId}|${t.uid||t.summary}`,a=this._pending.has(i),s=a?"completed"!==t.status:"completed"===t.status;return K`
      <button
        class="item ${s?"done":""} ${a?"pending":""}"
        @click=${()=>this._toggle(e,t)}
      >
        ${this._icon(s?Ct:kt)}
        <span class="item-text">${t.summary}</span>
      </button>
    `}_renderList(e){const t=this._config.max_items??8,i=this._expanded.has(e.entityId)?e.items:e.items.slice(0,t),a=e.items.length-i.length;return K`
      <section class="list">
        <header class="list-header">
          <span class="list-name">${e.name}</span>
          <span class="count">${e.items.length}</span>
        </header>

        ${e.ok?W:K`<div class="warning">
              ${this._icon(St)}<span>${ve(this.hass,"lists.unreachable")}</span>
            </div>`}

        <div class="items">
          ${0===i.length&&e.ok?K`<div class="empty">${ve(this.hass,"lists.empty")}</div>`:i.map(t=>this._renderItem(e,t))}
        </div>

        ${a>0?K`<button
              class="more"
              @click=${()=>{this._expanded=new Set(this._expanded).add(e.entityId)}}
            >
              ${ve(this.hass,"lists.show_more",{count:a})}
            </button>`:W}
        ${!1===this._config.allow_add?W:this._adding===e.entityId?K`
                <form
                  class="add-row"
                  @submit=${t=>{t.preventDefault(),this._submitDraft(e)}}
                >
                  <input
                    type="text"
                    autofocus
                    placeholder=${ve(this.hass,"lists.add_placeholder")}
                    .value=${this._draft}
                    @input=${e=>{this._draft=e.target.value}}
                    @blur=${()=>{this._adding=void 0}}
                  />
                </form>
              `:K`<button
                class="add"
                @click=${()=>{this._draft="",this._adding=e.entityId}}
              >
                ${this._icon(At)}<span>${ve(this.hass,"lists.add")}</span>
              </button>`}
      </section>
    `}render(){return this.hass?0===this._entityIds.length?K`
        <ha-card>
          <div class="notice">${ve(this.hass,"lists.none_configured")}</div>
        </ha-card>
      `:K`
      <ha-card>
        <div class="grid" style=${`--columns:${this._config.columns??3}`}>
          ${this._lists.map(e=>this._renderList(e))}
        </div>
      </ha-card>
    `:K`<ha-card></ha-card>`}};Et.styles=[Fe,Be,d`
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
    `],i([me({attribute:!1})],Et.prototype,"hass",void 0),i([ge()],Et.prototype,"_config",void 0),i([ge()],Et.prototype,"_lists",void 0),i([ge()],Et.prototype,"_expanded",void 0),i([ge()],Et.prototype,"_adding",void 0),i([ge()],Et.prototype,"_draft",void 0),i([ge()],Et.prototype,"_pending",void 0),Et=i([ce("hearth-lists-card")],Et),window.customCards=window.customCards||[],window.customCards.push({type:"hearth-lists-card",name:"Hearth Lists",description:"Shopping lists and checklists as tiles, ticked off with one tap.",preview:!0,documentationURL:"https://github.com/DomCim/Homeassistant-hearth"}),console.info(`%c HEARTH %c ${e} `,"color:#fff;background:#e0603a;font-weight:700;border-radius:3px 0 0 3px;padding:2px 6px","color:#e0603a;background:#2b2118;font-weight:700;border-radius:0 3px 3px 0;padding:2px 6px");export{e as HEARTH_VERSION};
