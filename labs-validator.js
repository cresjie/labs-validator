(function(window, document, $){'use strict';

	var isReady = false;

	var validators = {
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
		required: function(val, par, name, element, helper, list, accessor){
			
			return val ? true : false;
		},
		requiredIf: function(val, par, name, element, helper, list, accessor){
			
			var data = par.split(":");
			if( list[data[0]] == data[1] ){ 
				return this.required(val);
			}
			return true;
		},
		number: function(val, par){
			return Number(val) ? true : false;
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
		_default: 'Invalid input',
		min: function(val , par){
			return name+" should be atleast "+par;
		},
		max: function(val, par,name){
			return name+" should not be greater than "+par;
		},
		email: function(val){
			return 'Invalid email';
		},
		required: function(val,par,name){
			return name+" is required";
		},
		requiredIf: function(val, par,name){
			return name+" is required";
		},
		number: function(val,par,name){
			return name+" should be a valid number";
		},
		between: function(val,par,name){
			var n = par.split(",");
			return name+" must be between "+n[0]+ " and "+n[1];
		},
		same: function(val, par,name,element,helper){
			return name+" and "+helper.toDisplayableName(par)+ " must match";
		},
		boolean: function(val,par, name){
			return name+" must be true or false";
		},
		startsWith: function(val, par,name){
			return name+" must starts with "+par;
		},
		endsWith: function(val, par, name){
			return name+" must ends with "+par;
		},
		url: function(val,par, name){
			return name+" must be a valid URL";
		},
		alpha: function(val, par,name){
			return name+" may only contain letters";
		},
		alphaNum: function(val,par,name){
			return name+" may only container letters and numbers";
		},
		alphaNumDash: function(val, par, name){
			return name+" may only contain letters, numbers and dash";
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
			str = str.replace(/^./,function(g){return g.toUpperCase()});
			str = str.replace(reg,function(g){return ' '+g[1].toUpperCase();});
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
			attrPrefix: 'validator-'
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

		}

		

		
		__construct.apply(this,arguments);

		//public methods
		return {
			fails: function(){
				return !this.passes();
			},
			passes: function(){
				this.reset();
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

					 		if( validators[validatorName] ){ //if validator name exists in validator functions
					 			
					 			//calls the validator function
					 			// if validator fails set var passes to false 
					 			if( !validators[validatorName](el.value, attr.value, helper.toDisplayableName(el.name), el, helper, list, accessor ) ){ 
					 				passes = false;

					 				if( !errors[i] ){ //if error object doesnt exists
					 					errors[i] = {
					 						element: el,
					 						messages:[],
					 						validatorName: []
					 					};
					 				}
					 				
					 				var messageRaw = validatorMessage[validatorName] || validatorMessage._default;
					 				var	message = messageRaw.constructor === String ? messageRaw : messageRaw(el.value, attr.value, helper.toDisplayableName(el.name), el, helper, list, accessor);

					 				errors[i].messages.push(message);
					 				errors[i].validatorName.push(helper.toDashCase(validatorName) );
					 			}
					 		}
					 	}
					 }
				}
				this.displayErrors();
				return passes;
			},
			displayErrors: function(){
				for(var i in errors){
					helper.addClass(errors[i].element, opts.mainClass + '-field-error');
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

	window.labsValidator.validate = function(attrs, rules){
		var pass = true,errorMsg = {};
		for(var name in rules){
			var _validators = rules[name].split('|');
			
			for(var i in _validators){
				var validatorRaw = _validators[i].split('=');
				var validatorName = helper.toCamelCase(validatorRaw[0]);

				if(validators[validatorName]){ //if validator name exists el.value, attr.value, helper.toDisplayableName(el.name), el, helper 
					
					if(!validators[validatorName]( attrs[name], validatorRaw[1], helper.toDisplayableName(name),null, helper, attrs, null )) {
						pass = false;
						if(!errorMsg[name])
							errorMsg[name] = [];

						var messageRaw = validatorMessage[validatorName] || validatorMessage._default;
						var	message = messageRaw.constructor === String ? messageRaw : messageRaw( attrs[name], validatorRaw[1], helper.toDisplayableName(name),null, helper, attrs, null);
						errorMsg[name].push(message)
					} 
				}
			}
		}

		if(pass)
			return pass;
		return errorMsg;
	}

	labsValidator.test = function(){
		console.log(123);
	}

	docReady(function(e){
		isReady = true;
		
	})
	

})(window, document, jQuery);
