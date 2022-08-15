/*!
 * labsValidator.js 2.1.3
 * Author: Cres Jie Labasano
 * URL: https://github.com/cresjie
 * Standalone and lightweight form/data validation for the frontend
 */

(function(global, factory){
	"use strict";
	
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.labsValidator = factory());

})(this, function(global){
	/**
     * The validation rules that imply the field is required.
     */
	var explicitRules = ['required', 'requiredIf', 'requiredUnless', 'requiredWithout'];

	var validators = {
		//format: function(val, par, name, element, helper, list, accessor){}
		minlength: function(val, par){
			if(val) {
				return val.toString().length >= par;
			}
		},
		min: function(val,par){
			
			// check if its a number
			return Number(val) == val ? Number(val) >= par : val.length >= par;
		},
		max: function(val, par){
			// check if its a number
			return Number(val) == val ? Number(val) <= par : val.length <= par;
		},
		email: function(val){
			var re = /^([\w-\+]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    		return re.test(val);
		},
		password: function(val){
			return (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).test(val)
		},
		required: function(val){
			
			return val == null || val === '' ? false : true;
		},
		requiredIf: function(val, par, name, element, helper, list){
			
			var data = par.split(","),
				attrName = data.shift();

			return data.indexOf(list[attrName]) == -1;
		},
		requiredUnless: function(val, par, name, element, helper, list){
			var data = par.split(','),// par.split(':');
				attrName = data.shift();

			return  data.indexOf(list[attrName]) > -1  ? true :this.required(val);
			
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
		in: function(val,par){
			var list = par.split(',');
			return list.indexOf(val) > -1 ? true : false;
		},
		notIn:function(val,par){
			var list = par.split(",");
			return list.indexOf(val) == -1 ? true : false;

		},
		boolean: function(val){
			var acceptable = [true, false, 0, 1, '0', '1'];
			return acceptable.includes(val)
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
		alphaNum: function(val){
			return /^[a-zA-Z0-9]*$/.test(val) ;
		},
		alphaNumDash: function(val){
			return /^[a-zA-Z0-9\-\_]*$/.test(val)
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
			return name+" field is required.";
		},
		requiredIf: function(val, par,name){
			return name+" field is required.";
		},
		requiredUnless: function(val, par, name){
			return name+" field is required.";
		},
		requiredWithout: function(val, par, name, el, list) {
			var fields = par.split(',').join(', ');
			return name+" field is required when "+ fields + " is not present.";
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
	};

	var labsValidator = {
		msgContainer: Array,
		translate: {},
		addValidator: function(name, fn){
			validators[name] = fn;
			return this;
		},
		addValidatorMsg: function(name, fn){
			validatorMessage[name] = fn;
			return this;
		},
		validate: function(attrs, rules, customMessages){
			var pass = true,
				errorMsg = {};

			attrs = attrs || {};
			rules = rules || {};
			customMessages = customMessages || {}; 

			for(var name in rules){
				var _validators = rules[name].split('|');
				
				for(var i in _validators){
					var validatorRaw = _validators[i].split(':');
					var validatorName = helper.toCamelCase(validatorRaw[0]),
						messageRaw = null;
					
					/**
					 * if there's no value, and the validator is not one of the explicit rules, then just skip
					 */
					if( !attrs[name] && explicitRules.indexOf(validatorName) == -1 ) {
						continue;
					}
					
					if(validators[validatorName]){ //if validator name exists el.value, attr.value, helper.toDisplayableName(el.name), el, helper 
						var displayName = labsValidator.translate.hasOwnProperty(name) ? labsValidator.translate[name] : helper.toDisplayableName(name);
						
						if(!validators[validatorName]( attrs[name], validatorRaw[1], displayName,null, helper, attrs, null )) {
							pass = false;
							if(!errorMsg[name]) {
								errorMsg[name] = []; 
							}

							try{
								messageRaw = customMessages[name][validatorName];
							} catch(e) {}

							if( !messageRaw ) {

								messageRaw = validatorMessage[validatorName] || validatorMessage._default;
							}

							var	message = messageRaw.constructor === String ? messageRaw : messageRaw( attrs[name], validatorRaw[1], displayName,null, helper, attrs, null);

							errorMsg[name].push(message)
						} 
					}
				}

				if(errorMsg[name] && labsValidator.msgContainer == String ) {

					errorMsg[name] = errorMsg[name].join(' ');
				}
			}

			
			return {
				pass: pass,
				errorMessages: errorMsg
			};
		},
		helper: helper
	}

	return labsValidator;
	
});