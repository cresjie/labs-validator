(function(window, document){'use strict';

	var isReady = true;

 	window.labsValidator = function(){ //labsValidator class

		var form,
			opts,
			errors = {};

		var defaults = {
			errorWrapper: 'p',
			mainClass: 'labs-validator',
			attrPrefix: 'validator-'
		};

		var helper = {
			getValueOf: function(name){
				if(form[name])
					return form[name].value;
			},
			getFiles: function(name){
				if(form[name])
					return form[name].files;
			},
			toSnakeCase: function(str,separator){
				separator = typeof separator !== 'undefined' ? separator: '_';
				return str;
			},
			toCamelCase: function(str,separator){
				separator = typeof separator !== 'undefined' ? separator: '_';
				return str;
			},
			toDashCase: function(str,separator){
				separator = typeof separator !== 'undefined' ? separator: '_';
				return str;
			},
			copy: function(obj, obj2){
				for(var k in obj2)
					obj[k] = obj[k];
				return obj;
			},
			addClass: function(el, className){
				if(el.className){
					var classList = el.className.split(' ');
					classList.push(className);
					el.className = classList.join(' ');
				}
				return this;
			}
		};

		function __construct(formId,opt){

			if( isReady ){
				_init(formId,opt);
			}else{
				// 
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
					elements = form.elements;

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
					 			if( !validators[validatorName](el.value, attr.value, helper.toSnakeCase(el.name), el, helper ) ){ 
					 				passes = false;

					 				if( !errors[i] ){ //if error object doesnt exists
					 					errors[i] = {
					 						element: el,
					 						messages:[],
					 						validatorName: []
					 					};
					 				}

					 				var messageRaw = validatorMessage[validatorName] || validatorMessage._default;
					 				var	message = messageRaw.constructor === String ? messageRaw : messageRaw(el.value, attr.value, helper.toSnakeCase(el.name), el, helper);

					 				errors[i].messages.push(message);
					 				errors[i].validatorName.push(helper.toDashCase(validatorName) );
					 			}
					 		}
					 	}
					 }
				}
				return passes;
			},
			displayErrors: function(){
				for(var i in errors){
					for(var msgI in errors[i].messages){
						var wrapper = document.createElement(opts.errorWrapper);
						wrapper.innerHTML = errors[i].messages[msgI];
						helper.addClass(wrapper, opts.mainClass + " " + errors[i].validatorName.join(' ') );
						errors[i].element.insertAdjacentHTML('afterEnd',wrapper);

					}
				}
				return this;
			},
			reset: function(){
				errors = {};
				removeErrors();
				return this;
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

	

})(window, document);

var validators = {
		min: function(val,par){
			var n = Number(val);
			if( n ){
				return 	n >= par;
			}
			return val.length >= par;
		},
		max: function(val, par){
			return !this.min(val, par);
		},
		required: function(val){
			return val ? true : false;
		},
		requiredIf: function(val, par, name, element, helper){
			var data = par.split(":");
			if( helper.getValueOf(data[0]) == data[1] ){ 
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
		same: function(val,par,name,element,helper){
			return val == helper.getValueOf(par);

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

//validator email
var validatorMessage = {
	_default: 'Invalid input',
	min: function(val , par){
		return name+" should be atleast "+par;
	},
	max: function(val, par,name){
		return name+" should not be greater than "+par;
	},
	require: function(val,par,name){
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
		return name+" and "+helper.toSnakeCase(par)+ " must match";
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
