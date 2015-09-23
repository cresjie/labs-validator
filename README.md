# labs-validator
standalone javascript form validator

Basic Usage
----------
add "validator-..." attribute to the element

```html
  <body>
    <form id="test-form">
			<div class="form-group">
				<label>email<label>
				<input type="text" name="email_address" validator-required validator-email>
			</div>
			<div class="form-group">
				<label>Password</label>
				<input type="password" name="password" validator-required>
			</div>
			<div class="form-group">
				<label>Confirm Password</label>
				<input type="password" name="confirm_password" validator-required validator-same="password">
			</div>
			<button>Submit</button>
		</form> 
  
  </body>

```

```javascript
//pass the form element id in the labsValidator constructor
  var validator = new labsValidator('test-form');
  
  
  
  document.getElementById('test-form').addEventListener('submit',function(e){
        //we'll validate the inputs before the form is submitted
        if(validator.passes()){ //method passes() return true if the inputs are valid
		alert('Submitted');
	}else{
		
		e.preventDefault();
	}
  });
  
```

Public methods
----------

 - **fails()**
  - returns true if validator fails
 - **passes()**
  - returns true if validator success
 - **displayErrors()**
  - displays validation error in the frontend
 - **reset()**
  - removes validation error in the frontend
  - clears the validation error messages


Extending Validation
------------
 - **labsValidator.addValidator(name,fn);**
  - callback function should return a boolean value
  - function arguments: value, parameter, name, element, helper
```javascript  
labsValidator.addValidator('required',function(value){
  	return value ? true : false;
	})
```
 - **labsValidator.addValidatorMsg(name,fn);**
  - callback function should return a message (string)
  - function arguments: value, parameter, name, element, helper
```javascript
labsValidator.addValidatorMsg('required',function(value,name){
	return name + ' is required';  
});
```

Validators Attributes
-----------
 - **validator-min**
  - minimum value if number or minimum  length for string  
 - **validator-max**
  -maximum value if number or maximum length for string. 
 - **validator-email**
  - value must be an email
 - **validator-required**
  - the field is required
 - **validator-requiredIf**
  -the field is required if the other field matches a value. e.g validator-requiredIf="team:we are one", first argument is the field, the second is the value of the field
 - **validator-number**
  - the value of the field must be a valid number
 - **validator-between**
  - the value of the field must between the arguments. e.g validator-between="5,10"
 - **validator-same**
  - the value of the field must be the as the other field. e.g <input type="password" name="confirm_password" validator-same="password">
 - **validator-_in**
  - the value of the field must be in the list. e.g validator-_in="good,better,best"
 - **validator-not-in**
  - the value of the field must not be in the list e.g validator-not-in="good,better,best"
 - **validator-boolean**
  - the value of the field must be either of the following: true,false,1,0,'1','0'
 - **validator-startsWith**
  - the value of the fiel must start the same as the argument. e.g validator-startsWith="my name"
 - **validator-endsWith**
  - the value of the field must ends the same as the argument. validator-endsWith="cool"
 - **validator-regexp**
  - the value of the field must match the regular expression in the argument
 - **validator-url**
  - value must be a valid url 
 - **validator-alpha**
  - value must be a letter 
 - **validator-alphaNum**
  - value must be a letter or numbers 
 - **validator-alphaNumDash**
  - value must be a letter, number or a dash 
 

