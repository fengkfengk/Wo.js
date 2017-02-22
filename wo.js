( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}
}(typeof window !== "undefined" ? window : this, function(window, noGlobal){
	"use strict";
	/* 
	 *工具类
	 *@namespace tool
	 */
	const flagElemRE = /\s*<([\w]+)[^>]*>\s*/i;   
	const simpleRE  = /^[_a-zA-Z](\w)*$/i;

	
	var T = {
		type(value){
			var exp = toString.call(value);
			var exec = /^\[Object (\w+)\]/i.exec(exp);
			return  exec ? exec[1].toLowerCase(): typeof value;
		},
		isPlainObject: (value) => T.type(value) == "object",
		isNumber: (value) => T.type(value) == "number",
		isObject: (value) => typeof value == "object",
		isArray: (value) => T.type(value) == "array",
		isElemNode: (value) => !!value && typeof value == "object" && value.nodeType == 1,
		toArray: (arr) => Array.from(arr),
		likeArray(arr){
			if(T.isArray(arr) == "array") return arr;
			return T.isObject(arr) && (arr.length === 0 || (T.isNumber(arr.length) && arr.length > 0 && !!arr[arr.length - 1]))
		}
	}
	var arrPro   = Array.prototype,
		forEach  = arrPro.forEach,
		map      = arrPro.map,
		filter   = arrPro.filter,
		push     = arrPro.push;
	var W = function(selector, context){
		return Wo.init(selector, context);
	}
	W.map    = (dom, fn) => map.call(dom, fn);
	W.each   = (dom, fn) => forEach.call(dom, fn);
	W.filter = (dom, fn) => filter.call(dom, fn);

	W.fn = {
		map(fn){
			return W(W.map(this, fn));
		},
		each(fn){
			return W(W.each(this, fn));
		},
		filter(fn){
			return W(W.filter(this, fn));
		},
		children(selector){
			var dom = [];
			this.each(elem => {
				W(elem.childNodes).map(function(elem){

				})
			})
		},
		find(selector){
			var type = T.type(selector);
			var dom  = [];
			if (type == "string") {
				this.each(function(elem){
					let elems = Wo.qsa(selector, elem);
					push.apply(dom, elems);
				})
			} 	
			return W(dom);
		},
		not(selector) {
			var type = T.type(selector);
			if (type == "string") {

			}
		},
		addClass(value = ""){
			this.each(elem => {
				elem.className += " " + value
			})
			return this;
		},
		remove(){

		},
		attr(key, value){
			var attribute = (elem, key, value) =>{
				if (!T.isElemNode(elem)) return;
				if (!value) {
					return elem.getAttribute(key);
				} else {
					elem.setAttribute(key, value);
				}
			} 
			if (!value) {
				return attribute(this[0], key);
			}
			this.each(function(elem, i){
				attribute(elem, key, value);
			});
			return this;			
		}
	}
	W.prototype = W.fn;
	var Wo = {
		init(selector, context){
			var type = T.type(selector), dom = [];

			if (type == "string") {
				if(flagElemRE.test(selector)) 
					this.flagElement(selector, context)
			    else 
					dom = this.qsa(selector.trim(), context)
			}  else if(T.likeArray(selector)) {

				dom = T.toArray(selector).filter(function(elem){
					if (T.isElemNode(elem)){
						return elem;
					} else if(T.type(elem) == "string"){
						return W.qsa(elem)
					} else {
						return false;
					}
				});
			}  else if(T.isElemNode(selector)) {         //如果为dom节点
				dom = selector;
			}
			if (!dom) dom = []
			else if (dom.length == null)  dom = [dom] 

			dom.selector = selector;
			return new Wo.W(dom, context);
		},
		W(dom = [], context){
			var keys = Array.from(dom),
				len  = this.length = keys.length;
			this.selector = dom.selector;     
			while(len--){
				this[len] = keys[len];
			}
		},
		flagElement(selector, context){
			let isSimple = false;

		},
		qsa(selector, context = document){
			var firstEle = selector[0],
				mayId    = firstEle == "#",
				mayClass = !mayId && firstEle == ".",
				match    = (!mayId && !mayClass) ? selector : selector.slice(1),
				isSimple = simpleRE.test(match),
				dom;

			if (isSimple) {
				if (mayId && match) 			dom = document.getElementById(match);
				else if (mayClass && match) 	dom = context.getElementsByClassName(match)
				else if (match)                 dom = context.getElementsByTagName(match);
				else                            dom = context.querySelectorAll(selector)
			} 
			else dom = context.querySelectorAll(selector);
			return dom;
		},
		matches(element, selector){
			 var arr = ["matches", "webkitMatchesSelector", "mozMatchesSelector", "oMatchesSelector", "matchesSelector"],
				matchesSelector;
			if (
				arr.some(key => !!( matchesSelector = element[key]))
			 )  return matchesSelector.call(element, selector); 
			
			var parent = element.parentNode || document;
			var dom = Array.from(Wo.qsa(selector, parent));
			if (
				dom.some(elem => elem == element)
			)     return true;
			else  return false;
		}
	};
	Wo.W.prototype = W.fn
	
	window.$ = window.$ || W; 

	log(W("#parent, #child").filter(function(elem){
		return W(elem).attr("cid") > 20
	}));


}) )