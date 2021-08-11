function changeprice(opt,shipp_element, product_element) {
	
	var product_price, ship_price,total,ship_typ;
	frmobj1=eval("document.frmproduct.qty_"+opt);
	frmobj2=eval("document.frmproduct.shipp"+opt);
	shipp_name=document.frmproduct.shippname_name.value;
	
	var x;
	if(frmobj1.length > 1 ){
		
		for (var i=0; i < frmobj1.length; i++){
			
		   if (frmobj1[i].checked) {
				product_price= frmobj1[i].value;
				x=i+1;
				shipin_price=eval("document.frmproduct.qty_ship"+opt+"_"+x).value;
				document.frmproduct.cart_product.value=eval("document.frmproduct.product_name"+opt+"_"+x).value;
				document.frmproduct.tree.value=eval("document.frmproduct.tree"+opt+"_"+x).value;
				document.frmproduct.prodid.value=eval("document.frmproduct.prodid"+opt+"_"+x).value;
				
				
		   }
		}
	}
	else{
		
		if (frmobj1.checked) {
			product_price= frmobj1.value;
			x=1;
			shipin_price=eval("document.frmproduct.qty_ship"+opt+"_"+x).value;
			document.frmproduct.cart_product.value=eval("document.frmproduct.product_name"+opt+"_"+x).value;
			document.frmproduct.tree.value=eval("document.frmproduct.tree"+opt+"_"+x).value;
			document.frmproduct.prodid.value=eval("document.frmproduct.prodid"+opt+"_"+x).value;
				
		 }
		
	}
	
	
	for (var cnt=0; cnt < frmobj2.length; cnt++){
	   if (frmobj2[cnt].checked) {
			ship_typ= frmobj2[cnt].value;
	   }
	}
	
	if(shipin_price.indexOf('~')>-1)
	{
		splt=shipin_price.split('~');
		splt_name=shipp_name.split('~');
		
		if(splt.length>0){
			
			//shipping=parseFloat(splt[ship_typ]);
			shipping = parseFloat(splt[0]);
			if(parseFloat(shipping)>0){
				total=parseFloat(product_price)+shipping;
			}else{
				total=product_price;
				shipping="0.00";
			}
		}
		var shipp_name1=splt_name[ship_typ];
	}else{
		var shipp_name1=shipp_name;
		total=product_price;
		shipping="0.00";
	}
	document.frmproduct.cart_shipping.value=shipp_name1;
	document.frmproduct.cart_shipping_amt.value=shipping;
	document.frmproduct.cart_price.value=parseFloat(product_price);
	document.getElementById(shipp_element).innerHTML=adddecimal(shipping);
	document.getElementById(product_element).innerHTML=adddecimal(total);
}

function changeprice_weight(opt) {
	
	var product_price, ship_price, total;
	frmobj1=eval("document.frmproduct.qty_"+opt);
	
	var x;
	if(frmobj1.length > 1 ){
		
		for (var i=0; i < frmobj1.length; i++){
		   if (frmobj1[i].checked) {
				product_price= frmobj1[i].value;
				x=i+1;
				shipin_price=eval("document.frmproduct.qty_ship"+opt+"_"+x).value;
				document.frmproduct.cart_product.value=eval("document.frmproduct.product_name"+opt+"_"+x).value;
				document.frmproduct.tree.value=eval("document.frmproduct.tree"+opt+"_"+x).value;
				document.frmproduct.prodid.value=eval("document.frmproduct.prodid"+opt+"_"+x).value;
				document.frmproduct.product_weight.value=eval("document.frmproduct.weight"+opt+"_"+x).value;
				
		   }
		}
	}
	else{
		
		 if (frmobj1.checked) {
			
			product_price= frmobj1.value;
			x=1;
			shipin_price=eval("document.frmproduct.qty_ship"+opt+"_"+x).value;
			document.frmproduct.cart_product.value=eval("document.frmproduct.product_name"+opt+"_"+x).value;
			document.frmproduct.tree.value=eval("document.frmproduct.tree"+opt+"_"+x).value;
			document.frmproduct.prodid.value=eval("document.frmproduct.prodid"+opt+"_"+x).value;
			document.frmproduct.product_weight.value=eval("document.frmproduct.weight"+opt+"_"+x).value;
			
	   }
	}
	
	document.frmproduct.cart_price.value= parseFloat(product_price);
	
}

function changeprice_new(opt, product_element){
	
	var product_price, ship_price,total;
	frmobj1=eval("document.frmproduct.qty_"+opt);
	var x;

	
		
		for (var i=0; i < frmobj1.length; i++){
		   if (frmobj1[i].checked) {
				product_price= frmobj1[i].value;
				x=i+1;
				shipin_price=eval("document.frmproduct.qty_ship"+opt+"_"+x).value;
				document.frmproduct.cart_product.value=eval("document.frmproduct.product_name"+opt+"_"+x).value;
				document.frmproduct.tree.value=eval("document.frmproduct.tree"+opt+"_"+x).value;
				document.frmproduct.prodid.value=eval("document.frmproduct.prodid"+opt+"_"+x).value;
				
		   }
		}
	
	
	document.frmproduct.cart_price.value=parseFloat(product_price);
	
	document.getElementById(product_element).innerHTML='$'+adddecimal(product_price);
}

function adddecimal(num) { 
	string = "" + num; 
	if (string.indexOf('.') == -1) 
		return string + '.00'; 
		seperation = string.length - string.indexOf('.'); 
		if (seperation > 3) 
			return string.substring(0,string.length-seperation+3); 
		else if (seperation == 2) 
			return string + '0'; 
		return string; 
} 


/*function  to translate the whole page in different languages but only in online*/
function translator(pattern) {
	var open_in_same_window = 1;
	var my_location = unescape(document.location.toString());
	var new_location ='';
	var new_pattern = '';
	if (my_location.indexOf('translate_c?') != -1) {
		/// From google...
		var indexof_u = my_location.indexOf('u=');
		if (indexof_u == -1) {
			new_location = document.location;
		}
		else {
			var subs = my_location.substring(indexof_u, my_location.length);
			var ss = subs.split('&');
			new_location = ss[0].substring(2, ss[0].length);
		}
	}
	else {
		new_location = document.location;
	}

	indexof_p = pattern.indexOf('|');

	var isen = '';
	if (indexof_p == -1) {
		indexof_p1 = pattern.indexOf('><');
		if (indexof_p1 == -1) {
			new_pattern = pattern;
			if (pattern == 'en') {
				isen = 1;
			}
		}
		else {
			var psplit =pattern.split('><');
			new_pattern = psplit[0]+'|'+psplit[1];
			if (psplit[1] == 'en') {
				isen = 1;
			}
		}
	}
	else {
		var psplit = pattern.split('|');
		new_pattern = psplit[0]+'|'+psplit[1];
		if (psplit[1] == 'en') {
			isen = 1;
		}
	}

	var thisurl = '';
	if (isen == 1) {
		thisurl = new_location;
	}
	else {
		thisurl = 'http://translate.google.com/translate_c?langpair=' + new_pattern + "&u=" + new_location;
	}

	if (open_in_same_window == 1) {
		window.location.href = thisurl;
	}
	else {
		if (CanAnimate ){
			msgWindow=window.open('' ,'subwindow','toolbar=yes,location=yes,directories=yes,status=yes,scrollbars=yes,menubar=yes,resizable=yes,left=0,top=0');
			msgWindow.focus();
			msgWindow.location.href = thisurl;
		}
		else {
			msgWindow=window.open(thisurl,'subwindow','toolbar=yes,location=yes,directories=yes,status=yes,scrollbars=yes,menubar=yes,resizable=yes,left=0,top=0');
		}
	}
}


/*function defined to submit the form for particular products or an object when user click the inquiry button */
function part_obj_inquiry_now(form_submit_link, form_submit_status, form_name, id_val, checkbox_checked_st, checkbox_name) {
	form_object=eval('document.'+form_name);
   
    //this is working for disha exports
	if(checkbox_checked_st == 'Y'){
		var formObj = eval('form_object.'+checkbox_name+'.checked=1');
	}

// 	if(checkbox_checked_st == 'Y'){
// 		var formObj = form_object+'.'+checkbox_name+'.checked=1';
// 	}
	
	if(form_submit_status=='Y'){
		form_object.action=''+form_submit_link+'';
		form_object.id.value=''+id_val+'';
		if(id_val=='cart' || id_val=='basket'){
			form_object.cart_action.value='add';
		}
		form_object.submit();	
	}
	else{
		return true;
	}
}

function part_obj_inquiry_now_new(form_submit_link, form_submit_status, form_name, id_val, checkbox_checked_st, checkbox_name, checkbox_value) {
    //var form_object=eval('document.'+form_name);
	var form = document.createElement("form");
	form.name = form_name;
    form.setAttribute("method", 'post');
    form.setAttribute("action", form_submit_link);
	var hid_field = document.createElement('input');
	hid_field.setAttribute('type','hidden');
	hid_field.setAttribute('name','cart_action');
	form.appendChild(hid_field);
	var hid_fields = document.createElement('input');
	hid_fields.setAttribute('type','hidden');
	hid_fields.setAttribute('name',checkbox_name);
	hid_fields.setAttribute('value',checkbox_value);
	form.appendChild(hid_fields);/**/
	
	//this is working for disha exports
	if(checkbox_checked_st == "Y"){
//		formObj = eval("form_object."+checkbox_name+".checked=1");
		formObj = form.name+'.'+checkbox_name+".checked=1"
	}

// 	if(checkbox_checked_st == 'Y'){
// 		var formObj = form_object+'.'+checkbox_name+'.checked=1';
// 	}
	
	if(form_submit_status=='Y'){
		form.setAttribute('id',id_val);
		if(id_val=='cart' || id_val=='basket'){
			form.cart_action.value='add'
		}
		document.body.appendChild(form);
		form.submit();	
	}
	else{
		return true;
	}
}


/*function defined to check the checkboxes at the time when user click the inquiry button */
function inquiry_now(form_submit_link, form_submit_status, form_name, id_val, price_qty_chk) {
	
	var pp=1, notprod=0;
    form_object=eval('document.'+form_name);
	len=form_object.elements.length;
	var arr_index=0;
	var prod="";	
	for (arr_index=0; arr_index<len; arr_index++) {
		if (form_object.elements[arr_index].type == "checkbox" && form_object.elements[arr_index].checked==true) {
			
			if(price_qty_chk=="Y"){
				var val1=form_object.elements[arr_index].name;
				splt=val1.split('_');
				if(splt.length>0){					
					var price=eval('document.'+form_name+'.price_'+splt[1]+'.value');
					var quantity=eval('document.'+form_name+'.stock_'+splt[1]+'.value');
					var balance_stock=eval('document.'+form_name+'.balance_stock_'+splt[1]+'.value');
					if(quantity=="Y" && price>0 && balance_stock > 1 && (prod.length==0)){
						pp=2;
					}else{
						if(quantity!="Y" || price<=0 || balance_stock < 1){
							var prod =prod+eval('document.'+form_name+'.productName_'+splt[1]+'.value')+" ,";															
							notprod=1;
						}	
								
					}
				}
    		}else{
	    		pp=2;
    		}
	    }
	    else{
    		pp=2;
		}
	}
	if (pp==1) {
		if(notprod==1){
			alert("Products "+prod+" not for sale or out of stock.");
			return false;
		}else{
			alert("You have not selected any Product / Item.\n\nPlease select  and  proceed");
			
			return false;
		}
	}else{
		if (notprod==1) {
			alert("Products "+prod+" not for sale or out of stock.");
			//alert("Product not for sale or out of stock");
		}
		
		if(form_submit_status=='Y'){
			
      		form_object.action=''+form_submit_link+'';
      		form_object.id.value=''+id_val+'';
      		if(id_val=='cart' || id_val=='basket'){
	      		form_object.cart_action.value='add';
      		}
      		form_object.submit();	
  		}
  		else{
	  		return true;
  		}
	}
}

/*function to check/uncheck all the checkboxes in the form*/
function chk_unchk(val, form_name) {
   	dml=eval('document.'+form_name);
   	len=dml.elements.length;
   	var i=0;
   	for (i=0; i<len; i++) {
     	if (dml.elements[i].type == "checkbox") {
        	if (val == 1) { 
           		dml.elements[i].checked=true;
        	} 
			else {
           		dml.elements[i].checked=false;
        	}
     	}   
   	}
}

/*function to open popup*/
function openwin(file,Iwidth,Iheight) {
   var newWin1=window.open(file,'iypWin1','x=0,y=0,toolbar=no,location=no,directories=no,status=no,scrollbars=yes, copyhistory=no,width='+Iwidth+',height='+Iheight+',screenX=0,screenY=0,left=20,top=20');
   newWin1.focus();
}


/*Function  : isProhibited(param) 
  Objective : To check object value is allow or not
  @param    : Object
  Output    :
  	True    : If value is not allowed to enter
  	False   : If value is allowed to enter */
  	
function isProhibited(obj){
	var objval=obj.value;
	invalidstr=new Array("indiamart","india mart", "alibaba","ali baba","tradeindia", "trade-india");
	for(i=0;i<invalidstr.length;i++){
		if (chktrim(objval).toLowerCase().indexOf(chktrim(invalidstr[i]).toLowerCase())>=0){	
			alert("Usage of "+invalidstr[i]+" is Prohibited on this site.") 
			obj.focus();
			return true;		
		}
	}
	return false;
}//end of isProhibited()

/*Function isValid(param) 
  Objective: To check object value is allow or not
  @param   :  Object
  Output   :
  	True   : If value is allowed to enter
  	False  : If value is not allowed to enter */
  
function isValid(obj){
	var objval=obj.value;
    invalidstr = new Array("hotmail", "gmail", "indiatimes", "rediffmail", "yahoo", ".com", ".net",".org", ".co.in", ".co.cn", ".co.ca", ".gov", ".co.uk");
		 		
	for(i=0;i<invalidstr.length;i++){
		if (chktrim(objval).toLowerCase().indexOf(chktrim(invalidstr[i]).toLowerCase())>=0){	
			alert("Please don't use "+invalidstr[i]+".") 
			obj.focus();
			return false;		
		}
	}
	return true;
}//end of isValid


/*following function calls to show any type of validation in any form*/
function dynamic_form_validation(form_object) {
	/*fetching the total number of elements from form*/
	total_elements=(form_object.elements.length);
    
	/*running loop to check the elements of form one by one*/
	for(element_count=0; element_count<total_elements; element_count++) {
		
		/*storing element object*/
		var element_object=form_object.elements[element_count];
		
		/*storing element name*/
		var element_id=element_object.id;
		
		/*storing element value*/
		var element_value=chktrim(element_object.value);
		
		/*storing element type*/
		var element_type=element_object.type;
		
		/*spliting the element namer*/
		var array_split=element_id.split("_");		
		
		var validation_ans=array_split[0].split("-");		
		
		var validation_msg=''+array_split[1]+'';
		
		//alert(element_object+', '+element_id+', '+element_value+', '+element_type+', '+array_split[0]);
		if(validation_ans[0]=='r' || validation_ans[0]=='rp'){
			if(element_type=='select-one'){
				if (element_object.options[element_object.selectedIndex].value=="Select" || element_object.options[element_object.selectedIndex].value=="")  {
					alert(validation_msg);
					element_object.focus();
					return false;
				}
			}
			else if(element_type=='checkbox'){
				if (element_object.checked == false)  {
					alert(validation_msg);
					element_object.focus();
					return false;
				}
			}
			else{
				if(element_value.length<1){
					alert(validation_msg);
					element_object.focus();
					return false;
				}
			}
		}
		if((validation_ans[0]=='p' || validation_ans[0]=='rp') && element_value.length>0){
			if(validation_ans[1]=='2'){
				var alpha_check = /^([a-zA-Z\s])+$/;
				if(!alpha_check.test(element_value)){
					alert(validation_msg);
					element_object.focus();
					return false;
				}
			}			
			else if(validation_ans[1]=='3'){
				var alpha_num_check = /^([a-zA-Z0-9\s])+$/;
				if(!alpha_num_check.test(element_value)){
					alert(validation_msg);
					element_object.focus();
					return false;
				}
			}			
			else if(validation_ans[1]=='4'){
				var email_check = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				if(!email_check.test(element_value)){
					alert(validation_msg);
					element_object.focus();
					return false;
				}
			}			
			else if(validation_ans[1]=='5'){
				var phone_check= /^[0-9+\-\,]+$/;
				if((element_value.length)<8){
					alert(validation_msg);
					element_object.focus();
					return false;
				}
				if(!phone_check.test(element_value)){
					alert(validation_msg);
					element_object.focus();
					return false;
				}
			}			
			else if(validation_ans[1]=='6'){
				var website_check= /^(http|ftp):\/\/(www\.)?.+\.(com|net|org)$/;
				if(!website_check.test(element_value)){
					alert(validation_msg);
					element_object.focus();
					return false;
				}
			}			
			else if(validation_ans[1]=='7'){
				var dob_check= /^([0-9]){2}(\/|-){1}([0-9]){2}(\/|-)([0-9]){4}$/;
				if(!dob_check.test(element_value)){
					alert(validation_msg);
					element_object.focus();
					return false;
				}
			}			
			else if(validation_ans[1]=='8'){
				var int_check= /^([0-9])+$/;
				if(!int_check.test(element_value)){
					alert(validation_msg);
					element_object.focus();
					return false;
				}
			}			
			else if(validation_ans[1]=='9'){
				var float_check= /^([0-9\.])+$/;
				if(!float_check.test(element_value)){
					alert(validation_msg);
					element_object.focus();
					return false;
				}
			}			
		}
	}
	form_object.submit.disabled = true;
}

/*following function calls to show any type of validation in any form*/
function form_validation(form_object) {
	
	
	/*fetching the total number of elements from form*/
	total_elements = (form_object.elements.length);
    
	var email_check = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	
	/*running loop to check the elements of form one by one*/
	for(element_count=0; element_count<total_elements; element_count++) {
		
		/*storing element object*/
		var element_object=form_object.elements[element_count];
		
		/*storing element name*/
		var element_id=element_object.id;		
		
		/*storing element value*/
		var element_value=chktrim(element_object.value);		
		
		/*storing element type*/
		var element_type=element_object.type;		
		
		/*spliting the element namer*/
		var array_split=element_id.split("_");		
		//alert(element_object+', '+element_id+', '+element_value+', '+element_type+', '+array_split[0]);
		if(array_split[0].indexOf('req')!=-1){
			if(element_type=='select-one'){
				if (element_object.options[element_object.selectedIndex].value=="")  {
					alert('Please Select ' +array_split[2]);
					element_object.focus();
					return false;
				}
			}
			else if(element_type=='checkbox'){
				if (element_object.checked == false)  {
					alert('Please check the  ' +array_split[2]);
					element_object.focus();
					return false;
				}
			}
			else{
				if(element_value.length<1){
					alert('Please enter ' +array_split[2]);
					element_object.focus();
					return false;
				}
				else if(element_id.indexOf('_Email-id')!=-1){
					if(!email_check.test(element_value)){
						alert('Please enter valid ' +array_split[2]);
						element_object.focus();
						return false;
					}					
				}
				else if(element_id.indexOf('_int_')!=-1){
					if(!parseInt(element_value)){
						alert('Please enter valid ' +array_split[2]);
						element_object.focus();
						return false;
					}
				}
				else if(array_split[0].indexOf('prohb')!=-1){
					
					if(array_split[0].indexOf('prohb')!=-1 || array_split[0].indexOf('prohb1')!=-1){
					   	//To check indiamart, Alibaba etc words in email field
					   	if(isProhibited(element_object))
					   		return false;
					}
					
					if(array_split[0].indexOf('prohb')!=-1 || array_split[0].indexOf('prohb2')!=-1){
					   	//To check .net .com etc words in company name field
					    if(!isValid(element_object))
					   		return false;
					}
					
				}
			}
		}
		else if(array_split[0].indexOf('prohb')!=-1 && element_value.length>0){
			if(element_id.indexOf('_int_')!=-1){
				if(!parseInt(element_value)){
					alert('Please enter valid ' +array_split[2]);
					element_object.focus();
					return false;
				}
			}
			else{
				if(array_split[0].indexOf('prohb')!=-1 || array_split[0].indexOf('prohb1')!=-1){
				   	//To check indiamart, Alibaba etc words in email field
				   	if(isProhibited(element_object))
				   		return false;
				}
				
				if(array_split[0].indexOf('prohb')!=-1 || array_split[0].indexOf('prohb2')!=-1){
				   	//To check .net .com etc words in company name field
				    if(!isValid(element_object))
				   		return false;
				}
			}
		}
	}
}

/*function to remove the space from the field*/
function chktrim(inputString) {
         if (typeof inputString != "string") { return inputString; }
         var retValue = inputString;
         var ch = retValue.substring(0, 1);
         while (ch == " ") { 
           retValue = retValue.substring(1, retValue.length);
           ch = retValue.substring(0, 1);
         } 
         ch = retValue.substring(retValue.length-1, retValue.length);
         while (ch == " ") { 
            retValue = retValue.substring(0, retValue.length-1);
            ch = retValue.substring(retValue.length-1, retValue.length);
         }
         while (retValue.indexOf("  ") != -1) { 
            retValue = retValue.substring(0, retValue.indexOf("  ")) + retValue.substring(retValue.indexOf("  ")+1, retValue.length); // Again, there are two spaces in each of the strings
         }
         return retValue; 
}


function showme(val) {
	 if(val=="C") {
		document.getElementById('show').style.display = 'block'; 		
	 }
	 else if(val=="Y") {		
		document.getElementById('show').style.display = 'none'; 		
	 }
}

function openWindow(src) {
	
	window.open(src,"mywindow","menubar=0,resizable=1,width=550,height=500")
}

function chk_mail_to_friend(frm) {

	if (frm.frdemailid.value==0) {
    	alert("Please Enter Your Freind E-MailID");
        frm.frdemailid.focus();
        return false;
	}
	if (frm.frdemailid.value.indexOf('@') == -1) {
		alert("Error in e-mail address");
		frm.frdemailid.focus();
		return false;
	}
	if (frm.frdemailid.value.indexOf('.') == -1) {
		alert("Error in e-mail address");
		frm.frdemailid.focus();
		return false;
	}
	if (frm.frdemailid.value.indexOf('@') != frm.frdemailid.value.lastIndexOf('@')) {
		alert("Please Specify One E-mail address only");
		frm.frdemailid.focus();
		return false;
	}
	
	if (frm.name.value==0) {
    	alert("Please Enter Your Name");
        frm.name.focus();
        return false;
	}
	
	if (frm.emailid.value==0) {
    	alert("Please Enter Your E-MailID");
        frm.emailid.focus();
        return false;
	}
	if (frm.emailid.value.indexOf('@') == -1) {
		alert("Error in e-mail address");
		frm.emailid.focus();
		return false;
	}
	if (frm.emailid.value.indexOf('.') == -1) {
		alert("Error in e-mail address");
		frm.emailid.focus();
		return false;
	}
}

function event_send_enquiry(formname) {
	
	if (chktrim(formname.your_name.value).length==0) {
        alert("Please Enter Your Name ");
        formname.your_name.focus();
        return false;
    }
    if (chktrim(formname.emailid.value).length == 0) {
	  alert("Email-Id can't be left blank");
	  formname.emailid.focus();
	  return false;
	}
	if (chktrim(formname.emailid.value).indexOf('@') == -1) {
	  alert("Error in Email-Id");
	  formname.emailid.focus();
	  return false;
	}
	if (chktrim(formname.emailid.value).indexOf('.') == -1) {
	  alert("Error in Email-Id");
	  formname.emailid.focus();
	  return false;
	}
	if (chktrim(formname.emailid.value).indexOf('@') !=  chktrim(formname.emailid.value).lastIndexOf('@')) {
	  alert("Please Specify One Email-Id only");
	  formname.emailid.focus();
	  return false;
	}  
    if (chktrim(formname.address.value).length==0) {
        alert("Please Enter Address ");
        formname.address.focus();
        return false;
    }
	if (chktrim(formname.country.value).length <1) {
        alert("Please Select Country");
        formname.country.focus();
        return false;
	}
	if (chktrim(formname.ph_ccode.value).length <1) {
        alert("Please Enter Phone No.(ISD code)");
        formname.ph_ccode.focus();
        return false;
	}
	if (isNaN(chktrim(formname.ph_ccode.value))) {
		alert ("Please Enter Correct ISD Code For Phone No.(ISD code)");	
		formname.ph_ccode.focus();
		return false;
	}
	if (chktrim(formname.ph_acode.value).length <1) {
        alert("Please Enter Phone No.(STD code)");
        formname.ph_acode.focus();
        return false;
	}
	if (isNaN(chktrim(formname.ph_acode.value))) {
		alert ("Please Enter Correct STD Code For Phone No.(STD code)");	
		formname.ph_acode.focus();
		return false;
	}
	if (chktrim(formname.ph_number.value).length <1) {
        alert("Please Enter Phone No.(Number)");
        formname.ph_number.focus();
        return false;
	}
	if (isNaN(chktrim(formname.ph_number.value))) {
		alert ("Please Enter Correct Number For Phone No.(Number)");	
		formname.ph_number.focus();
		return false;
	}
	if (formname.enq_type.value!='VR') {
		if (chktrim(formname.business_type.value).length==0) {
	        alert("Please Select Business Type");
	        formname.business_type.focus();
	        return false;
		}
	}
}

function chk_hotel_inq_form(formname) {

	if (chktrim(formname.arrival_dd.value).length==0) {
        alert("Please Enter Your Arrival Day ");
        formname.arrival_dd.focus();
        return false;
    }
    if (chktrim(formname.arrival_mm.value).length==0) {
        alert("Please Enter Your Arrival Month ");
        formname.arrival_mm.focus();
        return false;
    }
    if (chktrim(formname.arrival_yyyy.value).length==0) {
        alert("Please Enter Your Arrival Year ");
        formname.arrival_yyyy.focus();
        return false;
    }
    
    if (chktrim(formname.departure_dd.value).length==0) {
        alert("Please Enter Your Departure Day ");
        formname.departure_dd.focus();
        return false;
    }
    if (chktrim(formname.departure_mm.value).length==0) {
        alert("Please Enter Your Departure Month ");
        formname.departure_mm.focus();
        return false;
    }
    if (chktrim(formname.departure_yyyy.value).length==0) {
        alert("Please Enter Your Departure Year ");
        formname.departure_yyyy.focus();
        return false;
    }
    
    if (chktrim(formname.no_rooms.value).length==0) {
        alert("Please Enter No. of Rooms ");
        formname.no_rooms.focus();
        return false;
    }
    if (chktrim(formname.other_req.value).length==0) {
        alert("Please Enter Other Requirements ");
        formname.other_req.focus();
        return false;
    }
    if (chktrim(formname.person_name.value).length==0) {
        alert("Please Enter Your Name ");
        formname.person_name.focus();
        return false;
    }
    if (chktrim(formname.username.value).length==0) {
        alert("Please Enter Your Email ID ");
        formname.username.focus();
        return false;
    }	
    if (chktrim(formname.username.value).length == 0) {
		alert("Email-Id can't be left blank");
		formname.username.focus();
		return false;
	}
	if (chktrim(formname.username.value).indexOf('@') == -1) {
		alert("Error in Email-Id");
		formname.username.focus();
		return false;
	}
	if (chktrim(formname.username.value).indexOf('.') == -1) {
		alert("Error in Email-Id");
		formname.username.focus();
		return false;
	}
	if (chktrim(formname.username.value).indexOf('@') !=  chktrim(formname.username.value).lastIndexOf('@')) {
		alert("Please Specify One Email-Id only");
		formname.emailid.focus();
		return false;
	} 
	if (chktrim(formname.mobile.value).length==0) {
        alert("Please Enter Your Mobile Number ");
        formname.mobile.focus();
        return false;
    }
    if (chktrim(formname.address.value).length==0) {
        alert("Please Enter Your Address ");
        formname.address.focus();
        return false;
    }	
    
    if (chktrim(formname.country.value).length==0) {
        alert("Please Enter Your Country ");
        formname.country.focus();
        return false;
    }
}
function chk_project_inqform(formname, captcha) {
	
	if (chktrim(formname.your_name.value).length==0) {
        alert("Please Enter Your Name ");
        formname.your_name.focus();
        return false;
    }
    if (chktrim(formname.email_id.value).length==0) {
        alert("Please Enter Your Email ID ");
        formname.email_id.focus();
        return false;
    }
    
    var email_check = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if(!email_check.test(formname.email_id.value)){
		alert("Plaese enter a valid Emaail ID.");
		formname.email_id.focus();
		return false;
	}
	if (chktrim(formname.mobile.value).length==0) {
        alert("Please Enter Your Mobile Number ");
        formname.mobile.focus();
        return false;
    }
    if (chktrim(formname.desc.value).length==0) {
        alert("Please Enter Your Requirement ");
        formname.desc.focus();
        return false;
    }
    
    if(captcha=='Y' && chktrim(formname.code.value).length==0){
	    
	    alert("Please Enter Verification Code ");
        formname.code.focus();
        return false;
    }
}

function requirement_form(formname) {
	
	if (chktrim(formname.inq_subject.value).length==0) {
		
        alert("Please Enter Subject ");
        
        formname.inq_subject.focus();
        
        return false;
    }
    
    if (chktrim(formname.inq_desc.value).length==0) {
		
        alert("Please Enter Your Inquiry Description. ");
        
        formname.inq_desc.focus();
        
        return false;
    }
    
    if (chktrim(formname.your_name.value).length==0) {
		
        alert("Please Enter Your Name. ");
        
        formname.your_name.focus();
        
        return false;
    }
    
    if (chktrim(formname.email_id.value).length==0) {
	    
        alert("Please Enter Your Email ID ");
        
        formname.email_id.focus();
        
        return false;
    }	
    
    if (chktrim(formname.email_id.value).length == 0) {
	    
		alert("Email-Id can't be left blank");
		
		formname.email_id.focus();
		
		return false;
	}
	
	if (chktrim(formname.email_id.value).indexOf('@') == -1) {
		
		alert("Error in Email-Id");
		
		formname.email_id.focus();
		
		return false;
	}
	
	if (chktrim(formname.email_id.value).indexOf('.') == -1) {
		
		alert("Error in Email-Id");
		
		formname.email_id.focus();
		
		return false;
	}
	
	if (chktrim(formname.email_id.value).indexOf('@') !=  chktrim(formname.email_id.value).lastIndexOf('@')) {
		
		alert("Please Specify One Email-Id only");
		
		formname.emailid.focus();
		
		return false;
	} 
	
    if (chktrim(formname.contact_no.value).length==0) {
		
        alert("Please Enter Your Contact No. ");
        
        formname.contact_no.focus();
        
        return false;
    }
    
    if (chktrim(formname.address.value).length==0) {
		
        alert("Please Enter Your Full Address ");
        
        formname.address.focus();
        
        return false;
    }
}

function select_item_cart() {
			
	var chk = 0;
	
	for (var i=0; i < document.frmproduct.qty_1.length; i++) {

		if (document.frmproduct.qty_1[i].checked) {
			
			chk = 1;
		}
	}
	
	if(chk==0) {
		
		alert("Please Select Your Item Products ");
		document.frmproduct.qty_1[0].focus();
		return false;
	}
}

function select_item_cart_new() {
	
	if(document.frmproduct.prodid.value=='') {
		
		alert("Please Select Your Item Products ");
		
		return false;
	}
}


function inquiry_checkbox_select(myForm) {

	var checkFound = false;
	var inq_chk_box = false;
	
	for (var counter=0; counter < myForm.length; counter++) {
		
		if((myForm.elements[counter].name).substr(0, 4)=="chk_") {
			
			if ((myForm.elements[counter].type == "checkbox") && (myForm.elements[counter].checked == true)) {
			
				checkFound = true;
			}
			
			inq_chk_box = true;
		}
	}
	
	if (checkFound != true && inq_chk_box==true) {
		
		alert ("Please check at least one checkbox.");
		
		return false;
	}
	
	return true;
}

function newsletter_validation() {
	
	var news_letter_email= document.newsletter.news_letter_email.value;
	
	if((news_letter_email)=="" || (news_letter_email)=="Enter Email"){
		
		alert("Please Enter Email") ;
		document.newsletter.news_letter_email.focus();
		return false;
	}
		
	if((news_letter_email)!=""){
		
		var email_check = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if(!email_check.test(news_letter_email)){
			
			alert("Please Enter Valid Email") ;
			document.newsletter.news_letter_email.value="";
			document.newsletter.news_letter_email.focus();
			return false;
			
		}
	}			
		
	return true;
}