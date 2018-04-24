/**
 * labsValidator.js 1.1.6
 * Author: Cres Jie Labasano
 * Email: cresjie@gmail.com
 * Standalone and lightweight form/data validation for the frontend
 */
(function(window, document, $){'use strict';
	if( typeof jQuery != 'undefined' )
		$ = jQuery;
		
	var isReady = false;
	/**
     * The validation rules that imply the field is required.
     */
	var explicitRules = ['required', 'requiredIf', 'requiredUnless', 'requiredWithout'];

	var validators = {
		minlength: function(val, par){
			if(val) {
				return val.toString().length >= par;
			}
		},
		min: function(val,par){
			if(val){
				var n = Number(val);
				if( n ){
					return 	n >= par;
				}
				return val.length >= par;
			}
			
		},
		max: function(val, par){
			return !this.min(val, par);
		},
		email: function(val){
			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    		return re.test(val);
		},
		password: function(val){
			return (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).test(val)
		},
		required: function(val, par, name, element, helper, list, accessor){
			
			return val == null || val === '' ? false : true;
		},
		requiredIf: function(val, par, name, element, helper, list){
			
			var data = par.split(":");

			if( list[data[0]] == data[1] ){ 
				return this.required(val);
			}
			return true;
		},
		requiredUnless: function(val, par, name, element, helper, list){
			var data = par.split(':');
			return  list[data[0]] == data[1]  ? true :this.required(val);
			
		},
		requiredWithout: function(val, par, name, element, helper, list){
			var fields = par.split(',');
			for(var i in fields) {
				if( list[fields[i]] == null && val == null ) {
					return false;
				}
			}
			return true;
		},
		number: function(val, par){
			return Number(val) == val;
		},
		between:function(val,par){
			var n = par.split(",");
			return val >= n[0] && val <= n[1];
		},
		same: function(val,par,name,element,helper, list, accessor){
			return val == list[par];

		},
		_in: function(val,par){
			var list = par.split(',');
			return list.indexOf(val) > -1 ? true : false;
		},
		notIn:function(val,par){
			var list = par.split(",");
			return list.indexOf(val) == -1 ? true : false;

		},
		boolean: function(val){
			var acceptable = [true, false, 0, 1, '0', '1'];
			return acceptable.indexOf(val) ? true: false;
		},
		startsWith: function(val,par){
			var r = new RegExp('^'+par);
			return r.test(val);
		},
		endsWith: function(val, par){
			var r = new RegExp(par+'$');
			return r.test(val);
		},
		regexp: function(val, par){
			var reg = new RegExp(par);
			return reg.test(val);
		},
		url: function(val){
			try{
				new URL(val);
				return true;
			}catch(e){
				return false;
			}
		},
		alpha: function(val){
			return /^[a-zA-Z]*$/.test(val);
		},
		alphaNum: function(){
			return /^[a-zA-Z0-9]*$/.test(val) ;
		},
		alphaNumDash: function(){
			return /^[a-zA-Z0-9\-]*$/.test(val)
		}

	};

	var validatorMessage = {
		_default: 'Invalid input.',
		minlength: function(val , par, name){
			return name+" should be atleast "+par+'.';
		},
		min: function(val, par, name){
			return name+" should be atleast "+par+'.';
		},
		max: function(val, par,name){
			return name+" should not be greater than "+par+'.';
		},
		email: function(val){
			return 'Invalid email.';
		},
		password: function(){
			return "Password must be at least 8 characters, contain at least one uppercase, lowercase, and a number.";
		},
		required: function(val,par,name){
			return name+" is required.";
		},
		requiredIf: function(val, par,name){
			return name+" is required.";
		},
		requiredUnless: function(val, par, name){
			return name+" is required.";
		},
		requiredWithout: function(val, par, name, el, list) {
			var fields = par.split(',').join(', ');
			return name+" is required when "+ fields + " is not present.";
		},
		number: function(val,par,name){
			return name+" should be a valid number.";
		},
		between: function(val,par,name){
			var n = par.split(",");
			return name+" must be between "+n[0]+ " and "+n[1]+'.';
		},
		same: function(val, par,name,element,helper){
			return name+" and "+helper.toDisplayableName(par)+ " must match.";
		},
		boolean: function(val,par, name){
			return name+" must be true or false.";
		},
		startsWith: function(val, par,name){
			return name+" must starts with "+par+'.';
		},
		endsWith: function(val, par, name){
			return name+" must ends with "+par+'.';
		},
		url: function(val,par, name){
			return name+" must be a valid URL.";
		},
		alpha: function(val, par,name){
			return name+" may only contain letters.";
		},
		alphaNum: function(val,par,name){
			return name+" may only container letters and numbers.";
		},
		alphaNumDash: function(val, par, name){
			return name+" may only contain letters, numbers and dash.";
		}
	};



	function docReady(callback){
		if( document.addEventListener){
			document.addEventListener( "DOMContentLoaded",function(e){
				callback.call(this,e);

			});
		}else if(document.attachEvent ){
			 document.attachEvent("onreadystatechange",function(){
			 	if ( document.readyState === "complete" ){
			 		callback.call(this,e);
			 	}
			 });

		}
	}

	var helper = {
		
		toDisplayableName: function(str, separator){
			separator = typeof separator !== 'undefined' ? separator: '[\-_]';
			var reg = new RegExp(separator + '.','g');
			str = str.replace(reg,function(g){return ' '+g[1].toLowerCase();}).trim();
			str = str.replace(/^./,function(g){return g.toUpperCase()});
			
			return str;
		},
		toSnakeCase: function(str,separator){
			separator = typeof separator !== 'undefined' ? separator: '[\-_]';
			str = this.toCamelCase(str,separator);
			return str;
		},
		toCamelCase: function(str,separator){
			separator = typeof separator !== 'undefined' ? separator: '[\-_]';
			var reg = new RegExp(separator + '([a-z])','g');
			return str.replace(reg,function(g){return g[1].toUpperCase();});
			
		},
		toDashCase: function(str,separator){
			separator = typeof separator !== 'undefined' ? separator: '_';
			return str.replace(/\s+/g,separator).toLowerCase();
		},
		copy: function(obj, obj2){
			for(var k in obj2)
				obj[k] = obj[k];
			return obj;
		},
		addClass: function(el, className){

			var classList = el.className.split(' ');
			classList.push(className);
			el.className = classList.join(' ');

		
			return this;
		}
	};
	
 	window.labsValidator = function(){ //labsValidator class

		var form,
			opts,
			errors = {};

		var defaults = {
			errorWrapper: 'p',
			mainClass: 'labs-validator',
			errorFieldClass: 'labs-validator-error-field',
			attrPrefix: 'validator-',
			autoDisplayErrors: true
		};

		var accessor = {
			getValueOf: function(name){
			if(form[name])
				return form[name].value;
			},
			getFiles: function(name){
				if(form[name])
					return form[name].files;
			}
		}
		

		function __construct(formId,opt){

			if( isReady ){
				_init(formId,opt);

			}else{

				if($){
					$(function(){
						isReady = true;
						_init(formId,opt);
					})
				}else{
					docReady(function(){
						isReady = true;
						_init(formId,opt);
					});
				}
					
				
			}
		}


		function _init(formId, opt){
			form = document.getElementById(formId);
			opts = helper.copy(defaults, opt);


		}

		function removeErrors(){
			var elements = form.getElementsByClassName(opts.mainClass),
				length = elements.length;

			for(var i = 0;i < length;i++){
				elements.item(0).remove();
			}
			
			elements = form.getElementsByClassName(opts.errorFieldClass);
			length = elements.length;
			for(var i = 0; i < length; i++){
				
				var el = elements.item(0),
					classList = el.className.split(' '),
					loc = classList.indexOf(opts.errorFieldClass);
				
				if(loc > -1) {
					classList.splice(loc,1)
					el.className = classList.join(' ');
				}
				
			}

		}

		

		
		__construct.apply(this,arguments);

		//public methods
		return {
			fails: function(){
				return !this.passes();
			},
			/**
			 * Object customMessages
			 * @return boolean
			 */
			passes: function(customMessages){
				this.reset();

				customMessages = customMessages || {};

				var passes = true,
					elements = form.elements,
					list= {};

				for(var i =0;i< elements.length; i++){
					list[elements[i].name] = elements[i].value;
				}

				

				for(var i =0;i < elements.length; i++){  //loop through each elements
					
					 var el = elements[i];
					  var	attrs = el.attributes;
					 	
					 for(var attrI = 0;attrI < attrs.length; attrI++){ //loop throuh each attributes in element
					 	var attr = attrs[attrI];
					 	
					 	
					 	if( validators.startsWith( attr.name, opts.attrPrefix) ){ // if attribute starts with 
					 		var validatorName = helper.toCamelCase( attr.name.replace(opts.attrPrefix,'') );

					 		/**
							 * if there's no value, and the validator is not one of the explicit rules, then just skip
							 */
					 		if( !form[el.name].value && explicitRules.indexOf(validatorName) == -1 ) {
								continue;
							}

					 		if( validators[validatorName] ){ //if validator name exists in validator functions
					 			
					 			//calls the validator function
					 			// if validator fails set var passes to false 

					 			if( !validators[validatorName](form[el.name].value, attr.value, helper.toDisplayableName(el.name), el, helper, list, accessor ) ){ 
					 				passes = false;

					 				if( !errors[i] ){ //if error object doesnt exists
					 					errors[i] = {
					 						element: el,
					 						messages:[],
					 						validatorName: []
					 					};
					 				}
					 				try {
					 					var messageRaw = customMessages[name][validatorName];
					 				} catch(e) {
					 					var messageRaw = validatorMessage[validatorName] || validatorMessage._default;
					 				}
					 				
					 				var	message = messageRaw.constructor === String ? messageRaw : messageRaw(el.value, attr.value, helper.toDisplayableName(el.name), el, helper, list, accessor);

					 				errors[i].messages.push(message);
					 				errors[i].validatorName.push(helper.toDashCase(validatorName) );
					 			}
					 		}

					 		/**
					 		 * if the value does not pass in the validation required
					 		 * then just stop continuing through other validators 
					 		 */

					 		if(validatorName == 'required' && !passes) {
					 			break;
					 		}
					 	}
					 }
				}
				if(opts.autoDisplayErrors) {
					this.displayErrors();
				}
				
				return passes;
			},
			displayErrors: function(){ 
				for(var i in errors){
					helper.addClass(errors[i].element, opts.errorFieldClass);
					for(var msgI in errors[i].messages){
						var wrapper = document.createElement(opts.errorWrapper);
						wrapper.innerHTML = errors[i].messages[msgI];
						helper.addClass(wrapper, opts.mainClass + " " + errors[i].validatorName.join(' ') );
						errors[i].element.insertAdjacentHTML('afterEnd',wrapper.outerHTML);

					}
				}
				return this;
			},
			reset: function(){
				errors = {};
				removeErrors();
				return this;
			},
			getErrors: function(){
				return errors;
			}
		};
		
		
	};

	window.labsValidator.addValidator = function(name, fn){
		validators[name] = fn;
		return this;
	};
	window.labsValidator.addValidatorMsg = function(name, fn){
		validatorMessage[name] = fn;
		return this;
	}

	window.labsValidator.helper = helper;


	/**
	 * Object attrs
	 * Object rules
	 * Object customMessages
	 * @return Object
	 */
	window.labsValidator.validate = function(attrs, rules, customMessages){
		var pass = true,
			errorMsg = {};

		attrs = attrs || {};
		rules = rules || {};
		customMessages = customMessages || {}; 

		for(var name in rules){
			var _validators = rules[name].split('|');
			
			for(var i in _validators){
				var validatorRaw = _validators[i].split('=');
				var validatorName = helper.toCamelCase(validatorRaw[0]);
				
				/**
				 * if there's no value, and the validator is not one of the explicit rules, then just skip
				 */
				if( !attrs[name] && explicitRules.indexOf(validatorName) == -1 ) {
					continue;
				}

				if(validators[validatorName]){ //if validator name exists el.value, attr.value, helper.toDisplayableName(el.name), el, helper 
					
					if(!validators[validatorName]( attrs[name], validatorRaw[1], helper.toDisplayableName(name),null, helper, attrs, null )) {
						pass = false;
						if(!errorMsg[name]) {
							errorMsg[name] = [];
						}

						try{
							var messageRaw = customMessages[name][validatorName];
						} catch(e) {
							var messageRaw = validatorMessage[validatorName] || validatorMessage._default;
						}
						
						var	message = messageRaw.constructor === String ? messageRaw : messageRaw( attrs[name], validatorRaw[1], helper.toDisplayableName(name),null, helper, attrs, null);
						errorMsg[name].push(message)
					} 
				}
			}
		}

		/*if(pass) {
			return pass;
		}
			
		return errorMsg;*/
		return {
			pass: pass,
			errorMessages: errorMsg
		};
	}

	

	docReady(function(e){
		isReady = true;
		
	})
	

})(window, document);
