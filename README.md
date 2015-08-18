# labs-validator
standalone javascript form validator

Basic Usage
----------
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
  var validator = new labsValidator('myFormId');
  
  document.getElementById('test-form').addEventListener('submit',function(e){
        if(validator.passes()){
					alert('Submitted');
				}else{
					e.preventDefault();
				}
  });
  
```
