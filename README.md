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
        if(validator.passes()){
		alert('Submitted');
	}else{
		e.preventDefault();
	}
  });
  
```
