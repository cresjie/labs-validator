





# labs-validator
lightweight and standalone javascript validator. Inspired by Laravel Validator in a form of javascript.


# Install

```
$ npm i labs-validator --save
```
If you need HTML and <form\> validation support, checkout the [v1 here](https://github.com/cresjie/labs-validator/tree/v1)

API Usage
----------
```Javascript
labsValidator.validate(inputObject, rules, [customMessages]);
```
Breaking Changes 2.0.x to 2.1.x
----------

 - use colon (:) as parameter indicator (same as Laravel validator) unlike the v2.0.x which uses equal sign (=)

Sample Basic Usage
----------
```Javascript
var labsValidator = require('labs-validator'); //for js modules

var input = {email: 'test'};
var rules = {
  name: 'required',
  email: 'required|email',
  password: 'required|min:6',
  confirm_password: 'required|same:password',
  country: 'required|in:Philippines,USA,China,UK', //only the specified values are accepted
  city: 'requiredIf:country,Philippines' //city is required if the country is Philippines
};

var result = labsValidator.validate(input, rules);
// or, for non js-module
var result = window.labsValidator.validate(input, rules);

if (result.pass) {
  // do something
} else {
  console.log(result.errorMessages)
}

```
Custom Messages
-----------
```Javascript
labsValidator.validate(input, rules, {
      country: {
        required: 'Custom message for required country.',
        in: 'another custom message.'
      }
    });
```
 Validation rules are separated by '|' 




Validation Rules
-----------
 - **min**
  - minimum value if number or minimum  length for string  
 - **max**
  -maximum value if number or maximum length for string. 
 - **email**
  - value must be an email
 - **required**
  - the field is required
 - **requiredIf**
  -the field is required if the other field matches a value. e.g validator-requiredIf="team:we are one", first argument is the field, the second is the value of the field
 - **number**
  - the value of the field must be a valid number
 - **between**
  - the value of the field must between the arguments. e.g validator-between="5,10"
 - **same**
  - the value of the field must be the as the other field. e.g <input type="password" name="confirm_password" validator-same="password">
 - **in**
  - the value of the field must be in the list. e.g validator-in="good,better,best"
 - **not-in**
  - the value of the field must not be in the list e.g validator-not-in="good,better,best"
 - **boolean**
  - the value of the field must be either of the following: true,false,1,0,'1','0'
 - **startsWith**
  - the value of the fiel must start the same as the argument. e.g validator-startsWith="my name"
 - **endsWith**
  - the value of the field must ends the same as the argument. validator-endsWith="cool"
 - **regexp**
  - the value of the field must match the regular expression in the argument
 - **url**
  - value must be a valid url 
 - **alpha**
  - value must be a letter 
 - **alphaNum**
  - value must be a letter or numbers 
 - **alphaNumDash**
  - value must be a letter, number or a dash 
 
Extending Validation
------------
 - **labsValidator.addValidator(name,fn);**
  - callback function should return a boolean value
  - function arguments: value, parameter, name, element, helper
```javascript  
labsValidator.addValidator('required',function(value){
    return value ? true : false;
});

labsValidator.addValidator('date', function(v){
    return dayjs(v).isValid();
});
```
 - **labsValidator.addValidatorMsg(name,fn);**
  - callback function should return a message (string)
  - function arguments: value, parameter, name, element, helper
```javascript
labsValidator.addValidatorMsg('required',function(value, par, name){
  return name + ' is required';  
});
labsValidator.addValidatorMsg('date',function(value, par, name){
  return name + ' is shoud be valid date.';  
});
```

Global Translate
------------
add key-value to the **translate** attribute
```Javascript
labsValidator.translate.administrative_area_level_2  = 'Province';
labsValidator.translate.fname = 'First Name';

//outputs the error messages into
"Province field is required."
"First Name field is required."
````


### Inertiajs
Inertiajs re-maps the laravel error message bag into a string instead of an array. In other match and have a uniform syntax through out the frontend and backend, declare the **msgContainer** as String
```Javascript
labsValidator.msgContainer = String; //declare this
var result = labsValidator.validate(input, rules);
console.log(result.errorMessages);
````

### Backbonejs
the labsValidator.validate() is also a perfect validator for backbonejs **Model**

```javascript
var User = Backbone.Model.extend({
  validate: function(attrs){
    var validation = labsValidator.validate(attrs,{
      email: 'required|email',
      password: 'required|min:8',
      name: 'required',
      country: 'required|in:Philippines,USA,China,UK',
      city: 'requiredIf:country:Philippines'
    });
    
    if( !validation.pass )
      return validation.errorMessages;
  }

});

var user1 = new User;

console.log(user1.isValid());
console.log(user1.validationError);
```
