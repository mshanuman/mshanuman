
var countryarr_isd_value = {AF:'93', AL:'335', DZ:'213', AS:'684', AD:'376', AO:'244', AI:'264', AQ:'672', AG:'268', AR:'54', AM:'374', AW:'297', AU:'61', AT:'43', AZ:'994', BS:'242', BH:'973', BD:'880', BB:'246', BY:'375', BE:'32', BZ:'501', BJ:'229', BM:'441', BT:'975', BO:'591', BA:'387', BW:'267', BV:'47', BR:'55', IO:'246', BN:'673', BG:'359', BF:'226', BI:'257', KH:'855', CM:'237', CA:'1', CV:'238', KY:'345', CF:'236', TD:'235', CL:'56', CN:'86', CX:'61', CC:'61', CO:'57', KM:'269', CG:'242', CK:'682', CR:'506', CI:'225', HR:'385', CU:'53', CY:'357', CZ:'420', DK:'45', DJ:'253', DM:'767', DO:'809', TP:'670', EC:'593', EG:'20', SV:'503', GQ:'240', ER:'291', EE:'372', ET:'251', FK:'500', FO:'298', FJ:'679', FI:'358', FR:'33', FX:'590', GF:'594', PF:'689', TF:'590', GA:'241', GM:'220', GE:'995', DE:'49', GH:'233', GI:'350', GR:'30', GL:'299', GD:'809', GP:'590', GU:'1', GT:'502', GN:'224', GW:'245', GY:'592', HT:'509', HM:'61', HN:'504', HK:'852', HU:'36', IS:'354', IN:'91', ID:'62', IR:'98', IQ:'964', IE:'353', IL:'972', IT:'39', JM:'876', JP:'81', JO:'962', KZ:'7', KE:'254', KI:'686', KP:'850', KR:'82', KW:'965', KG:'7', LA:'856', LV:'371', LB:'961', LS:'266', LR:'231', LY:'218', LI:'423', LT:'370', LU:'352', MO:'853', MK:'389', MG:'261', MW:'265', MY:'60', MV:'960', ML:'223', MT:'356', MH:'692', MQ:'596', MR:'222', MU:'230', YT:'269', MX:'52', FM:'691', MD:'373', MC:'377', MN:'976', MS:'664', MA:'212', MZ:'258', MM:'95', NA:'264', NR:'674', NP:'977', NL:'31', AN:'599', NC:'687', NZ:'64', NI:'505', NE:'227', NG:'234', NU:'683', NF:'672', MP:'670', NO:'47', OM:'968', PK:'92', PW:'680', PA:'507', PG:'675', PY:'595', PE:'51', PH:'63', PN:'872', PL:'48', PR:'787', QA:'974', RE:'262', RO:'40', RU:'7', RW:'250', KN:'869', LC:'758', VC:'784', WS:'685', SM:'378', ST:'239', SA:'966', SN:'221', SC:'248', SL:'232', SG:'65', SK:'421', SI:'386', SB:'677', SO:'252', ZA:'27', GS:'44', ES:'34', LK:'94', SH:'290', PM:'508', SD:'249', SR:'597', SJ:'47', SZ:'268', SE:'46', CH:'41', SY:'963', TW:'886', TJ:'7', TZ:'255', TH:'66', TG:'228', TK:'64', TO:'676', TT:'868', TN:'216', TR:'90', TM:'993', TC:'649', TV:'688', UG:'256', UA:'380', AE:'971', UK:'44', US:'1', UM:'1', UY:'598', UZ:'7', VU:'678', VA:'39', VE:'58', VN:'84', VG:'1', VI:'1', WF:'681', EH:'212', YE:'967', YU:'381', ZR:'243', ZM:'260', ZW:'263', PT:'351'};


function static_inq_form_validate(frm) {
	
	if (frm=="" || frm=="10001") {  //Buisness Inquiry Form
		
		if(chktrim(document.static_form.dynFrm_subject.value).length=="0") {
				
			alert("Please Enter Your Subject");
			document.static_form.dynFrm_subject.focus();
			return false;
		}
		
		if (chktrim(document.static_form.dynFrm_details_2.value).length==0 || chktrim(document.static_form.dynFrm_details_2.value).length<20) {
			
	    	alert("Please Enter Your Requirement Details [ Minimum 20 Characters ]");
	        document.static_form.dynFrm_details_2.focus();
	        return false;
		}
			
		if (chktrim(document.static_form.dynFrm_details_2.value).length>1000) {
			
	    	alert("Please Enter Your Requirement Details [ Maximum 1000 Characters ]");
	        document.static_form.dynFrm_details_2.focus();
	        return false;
		}
	
	    if (chktrim(document.static_form.dynFrm_contact_person.value).length==0) {
		
	    	alert("Please Enter Your Name");
	        document.static_form.dynFrm_contact_person.focus();
	        return false;
		}
		
		if (!document.static_form.comp_name_valid.checked) {
			
	    	if (chktrim(document.static_form.dynFrm_company_name.value).length==0) {
		
		    	alert("Please Enter Company Name");
		        document.static_form.dynFrm_company_name.focus();
		        return false;
			}
		}
		else {
			
			document.getElementById('dynFrm_company_name').setAttribute('disabled', true); 
			document.getElementById('company-name-star').className = 'star dn';
			document.getElementById('company-name-star').style.display='none';
		}
					
		if (document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="") {
			
		  	alert("Please Select Your Country.");
		    document.static_form.dynFrm_country.focus();
		    return false;
		}
		
		if(document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="IN^91" && document.static_form.dynFrm_state.options[document.static_form.dynFrm_state.selectedIndex].value=='') {
			
			alert("Please Select State.");
		    document.static_form.dynFrm_state.focus();
		    return false;
		}
		
		if (document.static_form.email_valid.value=='N' || !document.static_form.email_valid.checked) {
			
			var username = document.static_form.dynFrm_email_id.value;
		
			if(chktrim(username)=='') {
				
				alert("Please enter email.");
				document.static_form.dynFrm_email_id.focus();
				return false;
			}
			
			var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	   		
			if(reg.test(username) == false) {
		
				alert('Please enter valid email.');
				document.static_form.dynFrm_email_id.focus();
				return false;
			}
		}
		else {
			
			document.getElementById('dynFrm_email_id').setAttribute('disabled', true); 
			document.getElementById('email-star').className = 'star dn';
			document.getElementById('email-star').style.display='none';
		}
		
		if (chktrim(document.static_form.dynFrm_phone.value).length==0) {
	
		    alert("Please Enter Mobile Number.");
		    document.static_form.dynFrm_phone.focus();
			return false;
		}
		
					
		var dynFrm_phone_reg = /^[0-9\/,-]+$/;
		
		if(chktrim(document.static_form.dynFrm_phone.value).length>0) {
		    
		    if(isNaN(document.static_form.dynFrm_phone.value)) {
			
				alert("Please enter valid mobile number.Do not enter alphabet or special characters.");
				document.static_form.dynFrm_phone.focus();
				return false;
			}
			if(chktrim(document.static_form.dynFrm_phone.value).length<10 && document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="IN^91") {
				
				alert("Mobile Number Should be 10 digits at least.");
			    document.static_form.dynFrm_phone.focus();
				return false;
			}
			else if(chktrim(document.static_form.dynFrm_phone.value).length<3 || chktrim(document.static_form.dynFrm_phone.value).length>15) {
				
				alert("Mobile Number Should be 3 digits at least.");
			    document.static_form.dynFrm_phone.focus();
				return false;
			}
	    }
	    
		if (document.static_form.code && chktrim(document.static_form.code.value).length==0) {
	
		    alert("Please Enter Security Code Displayed on the Image.");
		    document.static_form.code.focus();
			return false;
		}
	}
	else if (frm=="10002" || frm=="10003") {  //Tour Package Enquiry - Hotel Package Enquiry
		
		if(chktrim(document.static_form.dynFrm_arrival_date.value).length=="0") {
				
			alert("Please add the travel date.");
			document.static_form.dynFrm_arrival_date.focus();
			return false;
		}
		
		if(typeof document.static_form.dynFrm_departure_date != "undefined" && chktrim(document.static_form.dynFrm_departure_date.value).length=="0") {
				
			alert("Please add the departure date.");
			document.static_form.dynFrm_departure_date.focus();
			return false;
		}
		
		if(chktrim(document.static_form.dynFrm_no_of_adults.value).length=="0") {
				
			alert("Please select the no. of persons.");
			document.static_form.dynFrm_no_of_adults.focus();
			return false;
		}
		
		if (frm=="10003") {
		
			if(chktrim(document.static_form.dynFrm_no_of_rooms.value).length=="0") {
					
				alert("Please select the no. of rooms.");
				document.static_form.dynFrm_no_of_rooms.focus();
				return false;
			}
		}
		
		if(chktrim(document.static_form.dynFrm_travel_plan_requirement.value).length=="0") {
				
			alert("Please enter description.");
			document.static_form.dynFrm_travel_plan_requirement.focus();
			return false;
		}
		
		if (document.static_form.code && chktrim(document.static_form.code.value).length==0) {
	
		    alert("Please Enter Security Code Displayed on the Image.");
		    document.static_form.code.focus();
			return false;
		}
		
		if (chktrim(document.static_form.dynFrm_your_name.value).length==0) {
		
	    	alert("Please Enter Your Name");
	        document.static_form.dynFrm_your_name.focus();
	        return false;
		}
		
		var username = document.static_form.dynFrm_your_e_mail.value;
		
		if(chktrim(username)=='') {
			
			alert("Please enter email.");
			document.static_form.dynFrm_your_e_mail.focus();
			return false;
		}
		
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	   		
		if(reg.test(username) == false) {
	
			alert('Please enter valid email.');
			document.static_form.dynFrm_your_e_mail.focus();
			return false;
		}
		
		if (document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="") {
			
		  	alert("Please Select Your Country.");
		    document.static_form.dynFrm_country.focus();
		    return false;
		}
		
		if(document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="IN^+91" && document.static_form.dynFrm_state.options[document.static_form.dynFrm_state.selectedIndex].value=='') {
			
			alert("Please Select State.");
		    document.static_form.dynFrm_state.focus();
		    return false;
		}
		
		if(chktrim(document.static_form.dynFrm_other_city.value).length==0) {
			
			alert("Please enter City.");
		    document.static_form.dynFrm_other_city.focus();
		    return false;
		}
		
		if (chktrim(document.static_form.dynFrm_phone_mobile.value).length==0) {
	
		    alert("Please Enter Mobile Number.");
		    document.static_form.dynFrm_phone_mobile.focus();
			return false;
		}
		
					
		var dynFrm_phone_mobile_reg = /^[0-9\/,-]+$/;
		
		if(chktrim(document.static_form.dynFrm_phone_mobile.value).length>0) {
		    
		    if(!(dynFrm_phone_mobile_reg.test(document.static_form.dynFrm_phone_mobile.value))) {
			
				alert("Please enter valid mobile number.Do not enter alphabet or special characters. Special Characters allowed only [-/,]");
				document.static_form.dynFrm_phone_mobile.focus();
				return false;
			}
			if(chktrim(document.static_form.dynFrm_phone_mobile.value).length<10 && document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="IN^+91") {
				
				alert("Mobile Number Should be 10 digits at least.");
			    document.static_form.dynFrm_phone_mobile.focus();
				return false;
			}
			else if(chktrim(document.static_form.dynFrm_phone_mobile.value).length<3) {
				
				alert("Mobile Number Should be 3 digits at least.");
			    document.static_form.dynFrm_phone_mobile.focus();
				return false;
			}
	    }
	}
	else if (frm=="10004" || frm=="10005") {   // TTW Services Enquiry - TTW Post Requirement Enquiry
		
		if(chktrim(document.static_form.dynFrm_inquiry_for.value).length=="0") {
				
			alert("Please select Enquiry for.");
			document.static_form.dynFrm_inquiry_for.focus();
			return false;
		}
		
		if(document.getElementById('dynFrm_inquiry_for').value=="10099" || document.getElementById('dynFrm_inquiry_for').value=="10335" || document.getElementById('dynFrm_inquiry_for').value=="10102" || document.getElementById('dynFrm_inquiry_for').value=="10101" || document.getElementById('dynFrm_inquiry_for').value=="10322") {
			
			if(chktrim(document.static_form.dynFrm_arrival_date.value).length=="0") {
				
				alert("Please add the departure date.");
				document.static_form.dynFrm_arrival_date.focus();
				return false;
			}
			
			if(document.getElementById('dynFrm_inquiry_for').value!="10322") {
			
				if(document.getElementById('dynFrm_tour_type').checked==true && chktrim(document.static_form.dynFrm_departure_date.value).length=="0") {
						
					alert("Please add the return date.");
					document.static_form.dynFrm_departure_date.focus();
					return false;
				}
			}
			else {
				
				if(chktrim(document.static_form.dynFrm_departure_date.value).length=="0") {
						
					alert("Please add the return date.");
					document.static_form.dynFrm_departure_date.focus();
					return false;
				}
			}
			
			if(chktrim(document.static_form.dynFrm_destination_from.value).length=="0") {
				
				alert("Please enter destination from.");
				document.static_form.dynFrm_destination_from.focus();
				return false;
			}
			
			if(chktrim(document.static_form.dynFrm_destination_to.value).length=="0") {
				
				alert("Please enter destination to.");
				document.static_form.dynFrm_destination_to.focus();
				return false;
			}
			
			if(document.getElementById('dynFrm_inquiry_for').value=="10101") {
			
				if(chktrim(document.static_form.dynFrm_car_no_adults.value).length=="0") {
					
					alert("Please select the no. of persons.");
					document.static_form.dynFrm_car_no_adults.focus();
					return false;
				}
			}
			
			if(document.getElementById('dynFrm_inquiry_for').value!="10101" && document.getElementById('dynFrm_inquiry_for').value!="10322") {
			
				if(chktrim(document.static_form.dynFrm_no_of_adults.value).length=="0") {
					
					alert("Please select the no. of tickets.");
					document.static_form.dynFrm_no_of_adults.focus();
					return false;
				}
			}
		}
		
		if(document.getElementById('dynFrm_inquiry_for').value=="10100" || document.getElementById('dynFrm_inquiry_for').value=="10324") {
			
			if(document.getElementById('dynFrm_inquiry_for').value=="10324") {
			
				if (document.static_form.dynFrm_select_country.options[document.static_form.dynFrm_select_country.selectedIndex].value=="") {
				
				  	alert("Please Select Country.");
				    document.static_form.dynFrm_select_country.focus();
				    return false;
				}
				
				if(chktrim(document.static_form.dynFrm_city_to_travel.value).length=="0") {
			
					alert("Please enter city to travel.");
				    document.static_form.dynFrm_city_to_travel.focus();
				    return false;
				}
			}
			
			if(document.getElementById('dynFrm_inquiry_for').value=="10100") {
			
				if(chktrim(document.static_form.dynFrm_hotel_destination.value).length=="0") {
					
					alert("Please enter Hotel Destination.");
					document.static_form.dynFrm_hotel_destination.focus();
					return false;
				}
			}
			
			if(chktrim(document.static_form.dynFrm_arrival_on.value).length=="0") {
				
				if(document.getElementById('dynFrm_inquiry_for').value=="10100") {
				
					alert("Please add the check in date.");
				}
				else {
					
					alert("Please add the arrival on date.");
				}
				document.static_form.dynFrm_arrival_on.focus();
				return false;
			}
			
			if(document.getElementById('dynFrm_inquiry_for').value=="10100") {
			
				if(chktrim(document.static_form.dynFrm_departure_on.value).length=="0") {
						
					alert("Please add the check out date.");
					document.static_form.dynFrm_departure_on.focus();
					return false;
				}
			}
			
			if(document.getElementById('dynFrm_inquiry_for').value=="10324") {
			
				if(chktrim(document.static_form.dynFrm_duration.value).length=="0") {
					
					alert("Please enter the duration.");
					document.static_form.dynFrm_duration.focus();
					return false;
				}
			}
			
			if(chktrim(document.static_form.dynFrm_no_adults.value).length=="0") {
					
				alert("Please select the no. of persons.");
				document.static_form.dynFrm_no_adults.focus();
				return false;
			}
			
			if(document.getElementById('dynFrm_inquiry_for').value=="10100") {
				
				if(chktrim(document.static_form.dynFrm_no_of_rooms.value).length=="0") {
					
					alert("Please select the no. of rooms.");
					document.static_form.dynFrm_no_of_rooms.focus();
					return false;
				}
			}
			
			if(document.getElementById('dynFrm_inquiry_for').value=="10324" || document.getElementById('dynFrm_inquiry_for').value=="10100") {
		
				if(chktrim(document.static_form.dynFrm_budget.value).length=="0") {
					
					alert("Please select budget.");
					document.static_form.dynFrm_budget.focus();
					return false;
				}
			}
		}
		
		if(document.getElementById('dynFrm_inquiry_for').value=="10105" && document.getElementById('dynFrm_service_type').checked!=true) {
			
			if (document.static_form.dynFrm_visa_for.options[document.static_form.dynFrm_visa_for.selectedIndex].value=="") {
			
			  	alert("Please Select Country.");
			    document.static_form.dynFrm_visa_for.focus();
			    return false;
			}
			
			if (document.static_form.dynFrm_visa_type.options[document.static_form.dynFrm_visa_type.selectedIndex].value=="") {
			
			  	alert("Please select visa type.");
			    document.static_form.dynFrm_visa_type.focus();
			    return false;
			}			
		}
		
		if(chktrim(document.static_form.dynFrm_travel_plan_requirement.value).length=="0") {
				
			alert("Please enter description.");
			document.static_form.dynFrm_travel_plan_requirement.focus();
			return false;
		}
		
		if (document.static_form.code && chktrim(document.static_form.code.value).length==0) {
	
		    alert("Please Enter Security Code Displayed on the Image.");
		    document.static_form.code.focus();
			return false;
		}
		
		if (chktrim(document.static_form.dynFrm_your_name.value).length==0) {
		
	    	alert("Please Enter Your Name");
	        document.static_form.dynFrm_your_name.focus();
	        return false;
		}
		
		var username = document.static_form.dynFrm_your_e_mail.value;
		
		if(chktrim(username)=='') {
			
			alert("Please enter email.");
			document.static_form.dynFrm_your_e_mail.focus();
			return false;
		}
		
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	   		
		if(reg.test(username) == false) {
	
			alert('Please enter valid email.');
			document.static_form.dynFrm_your_e_mail.focus();
			return false;
		}
		
		if (document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="") {
			
		  	alert("Please Select Your Country.");
		    document.static_form.dynFrm_country.focus();
		    return false;
		}
		
		if(document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="IN^+91" && document.static_form.dynFrm_state.options[document.static_form.dynFrm_state.selectedIndex].value=='') {
			
			alert("Please Select State.");
		    document.static_form.dynFrm_state.focus();
		    return false;
		}
		
		if(chktrim(document.static_form.dynFrm_other_city.value).length==0) {
			
			alert("Please enter City.");
		    document.static_form.dynFrm_other_city.focus();
		    return false;
		}
		
		if (chktrim(document.static_form.dynFrm_phone_mobile.value).length==0) {
	
		    alert("Please Enter Mobile Number.");
		    document.static_form.dynFrm_phone_mobile.focus();
			return false;
		}
		
					
		var dynFrm_phone_mobile_reg = /^[0-9\/,-]+$/;
		
		if(chktrim(document.static_form.dynFrm_phone_mobile.value).length>0) {
		    
		    if(!(dynFrm_phone_mobile_reg.test(document.static_form.dynFrm_phone_mobile.value))) {
			
				alert("Please enter valid mobile number.Do not enter alphabet or special characters. Special Characters allowed only [-/,]");
				document.static_form.dynFrm_phone_mobile.focus();
				return false;
			}
			if(chktrim(document.static_form.dynFrm_phone_mobile.value).length<10 && document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="IN^+91") {
				
				alert("Mobile Number Should be 10 digits at least.");
			    document.static_form.dynFrm_phone_mobile.focus();
				return false;
			}
			else if(chktrim(document.static_form.dynFrm_phone_mobile.value).length<3) {
				
				alert("Mobile Number Should be 3 digits at least.");
			    document.static_form.dynFrm_phone_mobile.focus();
				return false;
			}
	    }
	}
	else if (frm=="10006") {  //TTW Other Services Enquiry
	
		if(document.getElementById('dynFrm_inquiry_for').value=="20001") {
			
			if (document.static_form.dynFrm_event_type.options[document.static_form.dynFrm_event_type.selectedIndex].value=="") {
			
			  	alert("Please Select Type Of Event.");
			    document.static_form.dynFrm_event_type.focus();
			    return false;
			}
			
			if(chktrim(document.static_form.dynFrm_event_location.value).length=="0") {
				
				alert("Please enter Event Location.");
				document.static_form.dynFrm_event_location.focus();
				return false;
			}
			
			if(chktrim(document.static_form.dynFrm_event_from_date.value).length=="0") {
				
				alert("Please add the Event Date From.");
				document.static_form.dynFrm_event_from_date.focus();
				return false;
			}
			
			if(chktrim(document.static_form.dynFrm_event_to_date.value).length=="0") {
					
				alert("Please add the Event Date To.");
				document.static_form.dynFrm_event_to_date.focus();
				return false;
			}
		}
		
		if(chktrim(document.static_form.dynFrm_subject.value).length=="0") {
				
			alert("Please enter subject.");
			document.static_form.dynFrm_subject.focus();
			return false;
		}
		
		if(chktrim(document.static_form.dynFrm_travel_plan_requirement.value).length=="0") {
				
			alert("Please enter description.");
			document.static_form.dynFrm_travel_plan_requirement.focus();
			return false;
		}
		
		if (document.static_form.code && chktrim(document.static_form.code.value).length==0) {
	
		    alert("Please Enter Security Code Displayed on the Image.");
		    document.static_form.code.focus();
			return false;
		}
		
		if (chktrim(document.static_form.dynFrm_your_name.value).length==0) {
		
	    	alert("Please Enter Your Name");
	        document.static_form.dynFrm_your_name.focus();
	        return false;
		}
		
		var username = document.static_form.dynFrm_your_e_mail.value;
		
		if(chktrim(username)=='') {
			
			alert("Please enter email.");
			document.static_form.dynFrm_your_e_mail.focus();
			return false;
		}
		
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	   		
		if(reg.test(username) == false) {
	
			alert('Please enter valid email.');
			document.static_form.dynFrm_your_e_mail.focus();
			return false;
		}
		
		if(chktrim(document.static_form.dynFrm_address.value).length=="0") {
				
			alert("Please enter address.");
			document.static_form.dynFrm_address.focus();
			return false;
		}
		
		if (document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="") {
			
		  	alert("Please Select Your Country.");
		    document.static_form.dynFrm_country.focus();
		    return false;
		}
		
		if(document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="IN^+91" && document.static_form.dynFrm_state.options[document.static_form.dynFrm_state.selectedIndex].value=='') {
			
			alert("Please Select State.");
		    document.static_form.dynFrm_state.focus();
		    return false;
		}
		
		if(chktrim(document.static_form.dynFrm_other_city.value).length==0) {
			
			alert("Please enter City.");
		    document.static_form.dynFrm_other_city.focus();
		    return false;
		}
		
		if (chktrim(document.static_form.dynFrm_phone_mobile.value).length==0) {
	
		    alert("Please Enter Mobile Number.");
		    document.static_form.dynFrm_phone_mobile.focus();
			return false;
		}
		
					
		var dynFrm_phone_mobile_reg = /^[0-9\/,-]+$/;
		
		if(chktrim(document.static_form.dynFrm_phone_mobile.value).length>0) {
		    
		    if(!(dynFrm_phone_mobile_reg.test(document.static_form.dynFrm_phone_mobile.value))) {
			
				alert("Please enter valid mobile number.Do not enter alphabet or special characters. Special Characters allowed only [-/,]");
				document.static_form.dynFrm_phone_mobile.focus();
				return false;
			}
			if(chktrim(document.static_form.dynFrm_phone_mobile.value).length<10 && document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="IN^+91") {
				
				alert("Mobile Number Should be 10 digits at least.");
			    document.static_form.dynFrm_phone_mobile.focus();
				return false;
			}
			else if(chktrim(document.static_form.dynFrm_phone_mobile.value).length<3) {
				
				alert("Mobile Number Should be 3 digits at least.");
			    document.static_form.dynFrm_phone_mobile.focus();
				return false;
			}
	    }
	}
	else if (frm=="10007" || frm=="10010" || frm=="10014" || frm=="10016" || frm=="10020" || frm=="10023") {  //REI Enquiry - PI Enquiry - REI Property Enquiry - PI Post Requirement Enquiry - PI Contact Enquiry
	
		if (frm=="10010" || frm=="10016" || frm=="10023") {
		
			if (document.static_form.dynFrm_mem_type.options[document.static_form.dynFrm_mem_type.selectedIndex].value=="") {
			
			  	alert("Please Select Enquiry For.");
			    document.static_form.dynFrm_mem_type.focus();
			    return false;
			}
		}
	
		if (frm=="10010" || frm=="10016" || frm=="10020" || frm=="10023") {
			
			if (chktrim(document.static_form.dynFrm_your_name.value).length==0) {
			
		    	alert("Please Enter Your Name");
		        document.static_form.dynFrm_your_name.focus();
		        return false;
			}
			
		}
		else {
		
		    if (chktrim(document.static_form.dynFrm_contact_person.value).length==0) {
			
		    	alert("Please Enter Your Name");
		        document.static_form.dynFrm_contact_person.focus();
		        return false;
			}
		}
		
		if (frm=="10010" || frm=="10016" || frm=="10023") {
		
			if(document.static_form.dynFrm_mem_type.options[document.static_form.dynFrm_mem_type.selectedIndex].value=="R" && chktrim(document.static_form.dynFrm_company_name.value).length=="0") {
						
				alert("Please Enter Company Name.");
				document.static_form.dynFrm_company_name.focus();
				return false;
			}
		}
		
		if (document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="") {
			
		  	alert("Please Select Your Country.");
		    document.static_form.dynFrm_country.focus();
		    return false;
		}
		
		if (frm=="10010" || frm=="10016" || frm=="10020" || frm=="10023") {
			
			if(document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="IN^91" && document.static_form.dynFrm_state.options[document.static_form.dynFrm_state.selectedIndex].value=='') {
			
				alert("Please Select State.");
			    document.static_form.dynFrm_state.focus();
			    return false;
			}
		}
		else {
		
			if(document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="IN^+91" && document.static_form.dynFrm_state.options[document.static_form.dynFrm_state.selectedIndex].value=='') {
				
				alert("Please Select State.");
			    document.static_form.dynFrm_state.focus();
			    return false;
			}
		}
		
		if (frm=="10010") {
			
			if (chktrim(document.static_form.dynFrm_city.value).length==0) {
			
		    	alert("Please Enter City");
		        document.static_form.dynFrm_city.focus();
		        return false;
			}
			
		}
		
		var username = document.static_form.dynFrm_email_id.value;
		
		if(chktrim(username)=='') {
			
			alert("Please enter email.");
			document.static_form.dynFrm_email_id.focus();
			return false;
		}
		
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	   		
		if(reg.test(username) == false) {
	
			alert('Please enter valid email.');
			document.static_form.dynFrm_email_id.focus();
			return false;
		}
		
		if (chktrim(document.static_form.dynFrm_phone.value).length==0) {
	
		    alert("Please Enter Phone/Mobile Number.");
		    document.static_form.dynFrm_phone.focus();
			return false;
		}
		
					
		var dynFrm_phone_reg = /^[0-9\/,-]+$/;
		
		if(chktrim(document.static_form.dynFrm_phone.value).length>0) {
		    
		    if(isNaN(document.static_form.dynFrm_phone.value)) {
			
				alert("Please enter valid mobile number.Do not enter alphabet or special characters.");
				document.static_form.dynFrm_phone.focus();
				return false;
			}
			
			if (frm=="10010" || frm=="10016" || frm=="10020" || frm=="10023") {
				
				if(chktrim(document.static_form.dynFrm_phone.value).length<3) {
					
					alert("Mobile Number Should be 3 digits at least.");
				    document.static_form.dynFrm_phone.focus();
					return false;
				}
			}
			else {
				
				if(document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="IN^+91" && (chktrim(document.static_form.dynFrm_phone.value).length<10 || chktrim(document.static_form.dynFrm_phone.value).length>10)) {
					
					alert("Please Enter Your 10 digits mobile number.");
				    document.static_form.dynFrm_phone.focus();
					return false;
				}
				else if(document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value!="IN^+91" && (chktrim(document.static_form.dynFrm_phone.value).length<3 || chktrim(document.static_form.dynFrm_phone.value).length>20)) {
					
					alert("Please Enter Your 3 to 20 digits mobile number.");
				    document.static_form.dynFrm_phone.focus();
					return false;
				}
			}
	    }
	    
	    if (chktrim(document.static_form.dynFrm_details_2.value).length==0) {
			
	    	alert("Please Enter Your Requirement Details");
	        document.static_form.dynFrm_details_2.focus();
	        return false;
		}
	    
		if (document.static_form.code && chktrim(document.static_form.code.value).length==0) {
	
		    alert("Please Enter Security Code Displayed on the Image.");
		    document.static_form.code.focus();
			return false;
		}
		
		if(typeof document.static_form.term_cond != "undefined" && !document.static_form.term_cond.checked) {
				
			alert("Please accept Terms & Conditions.");
			document.static_form.term_cond.focus();
			return false;
		}
	}
	else if (frm=="10008") {   //REI Post Requirement
		
		if (document.static_form.dynFrm_property_category.options[document.static_form.dynFrm_property_category.selectedIndex].value=="") {
			
		  	alert("Please Select Property Category.");
		    document.static_form.dynFrm_property_category.focus();
		    return false;
		}
		
		if (chktrim(document.static_form.dynFrm_budget.value).length==0) {
	
		    alert("Please Enter Budget.");
		    document.static_form.dynFrm_budget.focus();
			return false;
		}
		
		if (chktrim(document.static_form.dynFrm_area.value).length==0) {
	
		    alert("Please Enter Area.");
		    document.static_form.dynFrm_area.focus();
			return false;
		}
		
	    if (chktrim(document.static_form.dynFrm_contact_person.value).length==0) {
		
	    	alert("Please Enter Your Name");
	        document.static_form.dynFrm_contact_person.focus();
	        return false;
		}
		
		var username = document.static_form.dynFrm_email_id.value;
		
		if(chktrim(username)=='') {
			
			alert("Please enter E-mail.");
			document.static_form.dynFrm_email_id.focus();
			return false;
		}
		
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	   		
		if(reg.test(username) == false) {
	
			alert('Please enter valid E-mail.');
			document.static_form.dynFrm_email_id.focus();
			return false;
		}
		
		if (document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="") {
			
		  	alert("Please Select Your Country.");
		    document.static_form.dynFrm_country.focus();
		    return false;
		}
		
		if (chktrim(document.static_form.dynFrm_phone.value).length==0) {
	
		    alert("Please Enter Phone/Mobile Number.");
		    document.static_form.dynFrm_phone.focus();
			return false;
		}
		
					
		var dynFrm_phone_reg = /^[0-9\/,-]+$/;
		
		if(chktrim(document.static_form.dynFrm_phone.value).length>0) {
		    
		    if(isNaN(document.static_form.dynFrm_phone.value)) {
			
				alert("Please enter valid phone/mobile number.Do not enter alphabet or special characters.");
				document.static_form.dynFrm_phone.focus();
				return false;
			}
			if(chktrim(document.static_form.dynFrm_phone.value).length<3) {
				
				alert("Mobile Number Should be 3 digits at least.");
			    document.static_form.dynFrm_phone.focus();
				return false;
			}
	    }
	    
		if (document.static_form.code && chktrim(document.static_form.code.value).length==0) {
	
		    alert("Please Enter Security Code Displayed on the Image.");
		    document.static_form.code.focus();
			return false;
		}
	}
	else if (frm=="10009") {  //PI Post Resume
		
	    if (chktrim(document.static_form.dynFrm_your_name.value).length==0) {
		
	    	alert("Please Enter Your Name");
	        document.static_form.dynFrm_your_name.focus();
	        return false;
		}
		
		var username = document.static_form.dynFrm_email_id.value;
		
		if(chktrim(username)=='') {
			
			alert("Please enter email.");
			document.static_form.dynFrm_email_id.focus();
			return false;
		}
		
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	   		
		if(reg.test(username) == false) {
	
			alert('Please enter valid email.');
			document.static_form.dynFrm_email_id.focus();
			return false;
		}
		
		if (document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="") {
			
		  	alert("Please Select Your Country.");
		    document.static_form.dynFrm_country.focus();
		    return false;
		}
		
		if(document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="IN^91" && document.static_form.dynFrm_state.options[document.static_form.dynFrm_state.selectedIndex].value=='') {
			
			alert("Please Select State.");
		    document.static_form.dynFrm_state.focus();
		    return false;
		}
		
		if (chktrim(document.static_form.dynFrm_city.value).length==0) {
		
	    	alert("Please Enter Your City");
	        document.static_form.dynFrm_city.focus();
	        return false;
		}
		
		if (chktrim(document.static_form.dynFrm_mobile_phone.value).length==0) {
	
		    alert("Please Enter Mobile Number.");
		    document.static_form.dynFrm_mobile_phone.focus();
			return false;
		}
		
					
		var dynFrm_mobile_phone_reg = /^[0-9\/,-]+$/;
		
		if(chktrim(document.static_form.dynFrm_mobile_phone.value).length>0) {
		    
		    if(!(dynFrm_mobile_phone_reg.test(document.static_form.dynFrm_mobile_phone.value))) {
			
				alert("Please enter valid mobile number.Do not enter alphabet or special characters. Special Characters allowed only [-/,]");
				document.static_form.dynFrm_mobile_phone.value='';
				document.static_form.dynFrm_mobile_phone.focus();
				return false;
			}
			if(chktrim(document.static_form.dynFrm_mobile_phone.value).length<3) {
				
				alert("Mobile Number Should be 3 digits at least.");
			    document.static_form.dynFrm_mobile_phone.focus();
				return false;
			}
	    }
	    
		if (chktrim(document.static_form.dynFrm_education_details.value).length==0) {
			
	    	alert("Please Enter Your Education Details");
	        document.static_form.dynFrm_education_details.focus();
	        return false;
		}
		
		if (document.static_form.dynFrm_exp_in_years.options[document.static_form.dynFrm_exp_in_years.selectedIndex].value=="") {
			
		  	alert("Please Select Exp. In Years.");
		    document.static_form.dynFrm_exp_in_years.focus();
		    return false;
		}
		
		if (document.static_form.dynFrm_exp_in_months.options[document.static_form.dynFrm_exp_in_months.selectedIndex].value=="") {
			
		  	alert("Please Select Exp. In Months.");
		    document.static_form.dynFrm_exp_in_months.focus();
		    return false;
		}
		
		if (document.static_form.dynFrm_exp_in_years.options[document.static_form.dynFrm_exp_in_years.selectedIndex].value!="0") {
		
			if (document.static_form.dynFrm_salary_lac.options[document.static_form.dynFrm_salary_lac.selectedIndex].value=="" && document.static_form.dynFrm_salary_mnth.options[document.static_form.dynFrm_salary_mnth.selectedIndex].value=="") {
				
			  	alert("Please Select Salary.");
			    document.static_form.dynFrm_salary_lac.focus();
			    return false;
			}
		}
		
	    if (chktrim(document.static_form.dynFrm_key_skills.value).length==0) {
			
	    	alert("Please Enter Your Key Skills");
	        document.static_form.dynFrm_key_skills.focus();
	        return false;
		}
		
		if (chktrim(document.static_form.dynFrm_paste_your_resume.value).length==0 && chktrim(document.static_form.dynFrm_attach_resume_file.value).length==0) {
			
	    	alert("Please Paste or Attach Your Resume");
	        document.static_form.dynFrm_paste_your_resume.focus();
	        return false;
		}
	    
		if (document.static_form.code && chktrim(document.static_form.code.value).length==0) {
	
		    alert("Please Enter Security Code Displayed on the Image.");
		    document.static_form.code.focus();
			return false;
		}
		
		if(typeof document.static_form.term_cond != "undefined" && !document.static_form.term_cond.checked) {
				
			alert("Please accept Terms & Conditions.");
			document.static_form.term_cond.focus();
			return false;
		}
	}
	else if (frm=="10011") {  //TTW Hotel Enquiry
		
		if (chktrim(document.static_form.dynFrm_your_name.value).length==0) {
		
	    	alert("Please Enter Your Name");
	        document.static_form.dynFrm_your_name.focus();
	        return false;
		}
		
		if (chktrim(document.static_form.dynFrm_phone_mobile.value).length==0) {
	
		    alert("Please Enter Mobile Number.");
		    document.static_form.dynFrm_phone_mobile.focus();
			return false;
		}
					
		var dynFrm_phone_mobile_reg = /^[0-9\/,-]+$/;
		
		if(chktrim(document.static_form.dynFrm_phone_mobile.value).length>0) {
		    
		    if(!(dynFrm_phone_mobile_reg.test(document.static_form.dynFrm_phone_mobile.value))) {
			
				alert("Please enter valid mobile number.Do not enter alphabet or special characters. Special Characters allowed only [-/,]");
				document.static_form.dynFrm_phone_mobile.focus();
				return false;
			}
			if(chktrim(document.static_form.dynFrm_phone_mobile.value).length<10 && document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="IN^+91") {
				
				alert("Mobile Number Should be 10 digits at least.");
			    document.static_form.dynFrm_phone_mobile.focus();
				return false;
			}
			else if(chktrim(document.static_form.dynFrm_phone_mobile.value).length<3) {
				
				alert("Mobile Number Should be 3 digits at least.");
			    document.static_form.dynFrm_phone_mobile.focus();
				return false;
			}
	    }
		
		var username = document.static_form.dynFrm_your_e_mail.value;
		
		if(chktrim(username)=='') {
			
			alert("Please enter email.");
			document.static_form.dynFrm_your_e_mail.focus();
			return false;
		}
		
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	   		
		if(reg.test(username) == false) {
	
			alert('Please enter valid email.');
			document.static_form.dynFrm_your_e_mail.focus();
			return false;
		}
		
		if(chktrim(document.static_form.dynFrm_room_type.value).length=="0") {
					
			alert("Please select the room type.");
			document.static_form.dynFrm_room_type.focus();
			return false;
		}
		
	    if(chktrim(document.static_form.dynFrm_arrival_date.value).length=="0") {
				
			alert("Please add the arrival date.");
			document.static_form.dynFrm_arrival_date.focus();
			return false;
		}
		
		if(chktrim(document.static_form.dynFrm_departure_date.value).length=="0") {
				
			alert("Please add the departure date.");
			document.static_form.dynFrm_departure_date.focus();
			return false;
		}
		
		if(chktrim(document.static_form.dynFrm_no_of_rooms.value).length=="0") {
					
			alert("Please select the no. of rooms.");
			document.static_form.dynFrm_no_of_rooms.focus();
			return false;
		}
		
		if(chktrim(document.static_form.dynFrm_no_of_adults.value).length=="0") {
				
			alert("Please select the no. of persons.");
			document.static_form.dynFrm_no_of_adults.focus();
			return false;
		}		
	}
	else if (frm=="10012") {   //REI Post Property
		
		if (document.static_form.dynFrm_property_category.options[document.static_form.dynFrm_property_category.selectedIndex].value=="") {
			
		  	alert("Please Select Property Category.");
		    document.static_form.dynFrm_property_category.focus();
		    return false;
		}
		
		if (chktrim(document.static_form.dynFrm_area.value).length==0) {
	
		    alert("Please Enter Area.");
		    document.static_form.dynFrm_area.focus();
			return false;
		}
		
		if (chktrim(document.static_form.dynFrm_budget.value).length==0) {
	
		    alert("Please Enter your selling Price.");
		    document.static_form.dynFrm_budget.focus();
			return false;
		}
		
		if (chktrim(document.static_form.dynFrm_details_2.value).length==0) {
		
	    	alert("Please Enter Property Description");
	        document.static_form.dynFrm_details_2.focus();
	        return false;
		}
		
	    if (chktrim(document.static_form.dynFrm_contact_person.value).length==0) {
		
	    	alert("Please Enter Your Name");
	        document.static_form.dynFrm_contact_person.focus();
	        return false;
		}
		
		var username = document.static_form.dynFrm_email_id.value;
		
		if(chktrim(username)=='') {
			
			alert("Please enter E-mail.");
			document.static_form.dynFrm_email_id.focus();
			return false;
		}
		
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	   		
		if(reg.test(username) == false) {
	
			alert('Please enter valid E-mail.');
			document.static_form.dynFrm_email_id.focus();
			return false;
		}
		
		if (chktrim(document.static_form.dynFrm_address.value).length==0) {
		
	    	alert("Please Enter Address");
	        document.static_form.dynFrm_address.focus();
	        return false;
		}
		
		if (chktrim(document.static_form.dynFrm_city.value).length==0) {
		
	    	alert("Please Enter City Name");
	        document.static_form.dynFrm_city.focus();
	        return false;
		}
		
		if (document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="") {
			
		  	alert("Please Select Your Country.");
		    document.static_form.dynFrm_country.focus();
		    return false;
		}
		
		if (chktrim(document.static_form.dynFrm_phone.value).length==0) {
	
		    alert("Please Enter Phone/Mobile Number.");
		    document.static_form.dynFrm_phone.focus();
			return false;
		}
		
					
		var dynFrm_phone_reg = /^[0-9\/,-]+$/;
		
		if(chktrim(document.static_form.dynFrm_phone.value).length>0) {
		    
		    if(isNaN(document.static_form.dynFrm_phone.value)) {
			
				alert("Please enter valid phone/mobile number.Do not enter alphabet or special characters.");
				document.static_form.dynFrm_phone.focus();
				return false;
			}
			if(chktrim(document.static_form.dynFrm_phone.value).length<3) {
				
				alert("Mobile Number Should be 3 digits at least.");
			    document.static_form.dynFrm_phone.focus();
				return false;
			}
	    }
	    
		if (document.static_form.code && chktrim(document.static_form.code.value).length==0) {
	
		    alert("Please Enter Security Code Displayed on the Image.");
		    document.static_form.code.focus();
			return false;
		}
	}
	else if (frm=="10013" || frm=="10015") {  //TTW Car Coach Enquiry or TTW Bus Booking Enquiry
		
		if(chktrim(document.static_form.dynFrm_destination_from.value).length=="0") {
				
			alert("Please enter destination from.");
			document.static_form.dynFrm_destination_from.focus();
			return false;
		}
		
		if(chktrim(document.static_form.dynFrm_destination_to.value).length=="0") {
			
			alert("Please enter destination to.");
			document.static_form.dynFrm_destination_to.focus();
			return false;
		}
		
	    if(chktrim(document.static_form.dynFrm_arrival_date.value).length=="0") {
				
			alert("Please add the arrival date.");
			document.static_form.dynFrm_arrival_date.focus();
			return false;
		}
		
		if(document.getElementById('dynFrm_tour_type').value=="Round Trip" && chktrim(document.static_form.dynFrm_departure_date.value).length=="0") {
						
			alert("Please add the return date.");
			document.static_form.dynFrm_departure_date.focus();
			return false;
		}
		
		if(chktrim(document.static_form.dynFrm_car_no_adults.value).length=="0") {
					
			alert("Please select the no. of persons.");
			document.static_form.dynFrm_car_no_adults.focus();
			return false;
		}
		
		if (chktrim(document.static_form.dynFrm_your_name.value).length==0) {
		
	    	alert("Please Enter Your Name");
	        document.static_form.dynFrm_your_name.focus();
	        return false;
		}
		
		if (chktrim(document.static_form.dynFrm_phone_mobile.value).length==0) {
	
		    alert("Please Enter Mobile Number.");
		    document.static_form.dynFrm_phone_mobile.focus();
			return false;
		}
					
		var dynFrm_phone_mobile_reg = /^[0-9\/,-]+$/;
		
		if(chktrim(document.static_form.dynFrm_phone_mobile.value).length>0) {
		    
		    if(!(dynFrm_phone_mobile_reg.test(document.static_form.dynFrm_phone_mobile.value))) {
			
				alert("Please enter valid mobile number.Do not enter alphabet or special characters. Special Characters allowed only [-/,]");
				document.static_form.dynFrm_phone_mobile.focus();
				return false;
			}
			if(chktrim(document.static_form.dynFrm_phone_mobile.value).length<10 && document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="IN^+91") {
				
				alert("Mobile Number Should be 10 digits at least.");
			    document.static_form.dynFrm_phone_mobile.focus();
				return false;
			}
			else if(chktrim(document.static_form.dynFrm_phone_mobile.value).length<3) {
				
				alert("Mobile Number Should be 3 digits at least.");
			    document.static_form.dynFrm_phone_mobile.focus();
				return false;
			}
	    }
		
		var username = document.static_form.dynFrm_your_e_mail.value;
		
		if(chktrim(username)=='') {
			
			alert("Please enter email.");
			document.static_form.dynFrm_your_e_mail.focus();
			return false;
		}
		
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	   		
		if(reg.test(username) == false) {
	
			alert('Please enter valid email.');
			document.static_form.dynFrm_your_e_mail.focus();
			return false;
		}				
	}
	else if (frm=="10017") {  //REI Property Enquiry Popup
	
	    if (chktrim(document.static_form.dynFrm_contact_person.value).length==0) {
		
	    	alert("Please Enter Your Name");
	        document.static_form.dynFrm_contact_person.focus();
	        return false;
		}
		
		var username = document.static_form.dynFrm_email_id.value;
		
		if(chktrim(username)=='') {
			
			alert("Please enter email.");
			document.static_form.dynFrm_email_id.focus();
			return false;
		}
		
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	   		
		if(reg.test(username) == false) {
	
			alert('Please enter valid email.');
			document.static_form.dynFrm_email_id.focus();
			return false;
		}
		
		if (document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="") {
			
		  	alert("Please Select Your Country.");
		    document.static_form.dynFrm_country.focus();
		    return false;
		}
		
		if (chktrim(document.static_form.dynFrm_phone.value).length==0) {
	
		    alert("Please Enter Phone/Mobile Number.");
		    document.static_form.dynFrm_phone.focus();
			return false;
		}
		
					
		var dynFrm_phone_reg = /^[0-9\/,-]+$/;
		
		if(chktrim(document.static_form.dynFrm_phone.value).length>0) {
		    
		    if(isNaN(document.static_form.dynFrm_phone.value)) {
			
				alert("Please enter valid mobile number.Do not enter alphabet or special characters.");
				document.static_form.dynFrm_phone.focus();
				return false;
			}
			
			if(document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="IN^+91" && (chktrim(document.static_form.dynFrm_phone.value).length<10 || chktrim(document.static_form.dynFrm_phone.value).length>10)) {
				
				alert("Please Enter Your 10 digits mobile number.");
			    document.static_form.dynFrm_phone.focus();
				return false;
			}
			else if(document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value!="IN^+91" && (chktrim(document.static_form.dynFrm_phone.value).length<3 || chktrim(document.static_form.dynFrm_phone.value).length>15)) {
				
				alert("Please Enter Your 3 to 15 digits mobile number.");
			    document.static_form.dynFrm_phone.focus();
				return false;
			}
	    }
	    
	    if (chktrim(document.static_form.dynFrm_details_2.value).length==0) {
			
	    	alert("Please Enter Your Requirement Details");
	        document.static_form.dynFrm_details_2.focus();
	        return false;
		}
	    
		if (document.static_form.code && chktrim(document.static_form.code.value).length==0) {
	
		    alert("Please Enter Security Code Displayed on the Image.");
		    document.static_form.code.focus();
			return false;
		}
	}
	else if (frm=="10018") {  //EI Footer Inquiry form
	
		if(chktrim(document.footer_form.dynFrm_subject.value).length=="0") {
				
			jQuery('#footer_subject').parent().find('span.dif').text('Please Enter Name of Product / Service.')
			document.footer_form.dynFrm_subject.focus();
			return false;
		}
		else{
			
			jQuery('#footer_subject').parent().find('span.dif').text('')
		}
		
		if (chktrim(document.footer_form.dynFrm_details_2.value).length==0 || chktrim(document.footer_form.dynFrm_details_2.value).length<20) {
			
			jQuery('#footer_details_2').parent().find('span.dif').text('Please Enter Your Requirement Details [ Minimum 20 Characters ].')
	        document.footer_form.dynFrm_details_2.focus();
	        return false;
		}
		else{
			
			jQuery('#footer_details_2').parent().find('span.dif').text('')
		}
		
		if (chktrim(document.footer_form.dynFrm_details_2.value).length>1000) {
			
			jQuery('#footer_details_2').parent().find('span.dif').text('Please Enter Your Requirement Details [ Maximum 1000 Characters ].')
	        document.footer_form.dynFrm_details_2.focus();
	        return false;
		}
		else{
			
			jQuery('#footer_details_2').parent().find('span.dif').text('')
		}
	
	    if (chktrim(document.footer_form.dynFrm_contact_person.value).length==0) {
		
		    jQuery('#footer_contact_person').parent().find('span.dif').text('Please Enter Your Name.')
	        document.footer_form.dynFrm_contact_person.focus();
	        return false;
		}
		else{
			
			jQuery('#footer_contact_person').parent().find('span.dif').text('')
		}
		
		var username = document.footer_form.dynFrm_email_id.value;
		
		if(chktrim(username)=='') {
			
			jQuery('#footer_email_id').parent().find('span.dif').text('Please enter email.')
			document.footer_form.dynFrm_email_id.focus();
			return false;
		}
		else{
			
			jQuery('#footer_email_id').parent().find('span.dif').text('')
		}
		
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	   		
		if(reg.test(username) == false) {
	
			jQuery('#footer_email_id').parent().find('span.dif').text('Please enter valid email.')
			document.footer_form.dynFrm_email_id.focus();
			return false;
		}
		else{
			
			jQuery('#footer_email_id').parent().find('span.dif').text('')
		}
		
		if (document.footer_form.dynFrm_country.options[document.footer_form.dynFrm_country.selectedIndex].value=="") {
			
			jQuery('#footer_country').parent().find('span.dif').text('Please Select Your Country.')
		    document.footer_form.dynFrm_country.focus();
		    return false;
		}
		else{
			
			jQuery('#footer_country').parent().find('span.dif').text('')
		}
		
		if (chktrim(document.footer_form.dynFrm_phone.value).length==0) {
	
			jQuery('#footer_phone').parents('.phonemsg').find('span.dif').text('Please Enter Phone/Mobile Number.')
		    document.footer_form.dynFrm_phone.focus();
			return false;
		}
		else{
			
			jQuery('#phone_popup').parents('.phonemsg').find('span.dif').text('')
		}
					
		var dynFrm_phone_reg = /^[0-9\/,-]+$/;
		
		if(chktrim(document.footer_form.dynFrm_phone.value).length>0) {
		    
		    if(isNaN(document.footer_form.dynFrm_phone.value)) {
			
			    jQuery('#footer_phone').parents('.phonemsg').find('span.dif').text('Please enter valid mobile number.Do not enter alphabet or special characters.')
				document.footer_form.dynFrm_phone.focus();
				return false;
			}
			else{
				
				jQuery('#phone_popup').parents('.phonemsg').find('span.dif').text('')
			}
		
			if(document.footer_form.dynFrm_country.options[document.footer_form.dynFrm_country.selectedIndex].value=="IN^91" && (chktrim(document.footer_form.dynFrm_phone.value).length<10 || chktrim(document.footer_form.dynFrm_phone.value).length>10)) {
				
				jQuery('#footer_phone').parents('.phonemsg').find('span.dif').text('Please Enter Your 10 digits mobile number.')
			    document.footer_form.dynFrm_phone.focus();
				return false;
			}
			else if(document.footer_form.dynFrm_country.options[document.footer_form.dynFrm_country.selectedIndex].value!="IN^+91" && (chktrim(document.footer_form.dynFrm_phone.value).length<3 || chktrim(document.footer_form.dynFrm_phone.value).length>15)) {
				
				jQuery('#footer_phone').parents('.phonemsg').find('span.dif').text('Please Enter Your 3 to 15 digits mobile number.')
			    document.footer_form.dynFrm_phone.focus();
				return false;
			}
			else{
				
				jQuery('#phone_popup').parents('.phonemsg').find('span.dif').text('')
			}
	    }	    
	}
	else if (frm=="10019" || frm=="10026") {  //EI Pop up Product Enquiry Form
		
		if (chktrim(document.static_form.dynFrm_contact_person.value).length==0) {
			
		    jQuery('#dynFrm_contact_person').parent().find('span.red').text('Please Enter Your Name')
	        document.static_form.dynFrm_contact_person.focus();
	        return false;
		}
		else{
			
			jQuery('#dynFrm_contact_person').parent().find('span.red').text('')
		}
		
		var username = document.static_form.dynFrm_email_id.value;
				
		if (chktrim(username)=='') {
			
		    jQuery('#dynFrm_email_id').parent().find('span.red').text('Please enter email.')
	        document.static_form.dynFrm_email_id.focus();
	        return false;
		}
		else{
			
			jQuery('#dynFrm_email_id').parent().find('span.red').text('')
		}
		
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	   		
		if(reg.test(username) == false) {
			
		    jQuery('#dynFrm_email_id').parent().find('span.red').text('Please enter valid email.')
	        document.static_form.dynFrm_email_id.focus();
	        return false;
		}
		else{
			
			jQuery('#dynFrm_email_id').parent().find('span.red').text('')
		}
		
		if (chktrim(document.static_form.dynFrm_phone.value).length==0) {
			
		    jQuery('#phone_popup').parents('.phonemsg').find('span.red').text('Please Enter Phone/Mobile Number.')
	        document.static_form.dynFrm_phone.focus();
	        return false;
		}
		else{
			
			jQuery('#phone_popup').parents('.phonemsg').find('span.red').text('')
		}
					
		var dynFrm_phone_reg = /^[0-9\/,-]+$/;
		
		if(chktrim(document.static_form.dynFrm_phone.value).length>0) {
			
			if(isNaN(document.static_form.dynFrm_phone.value)) {
			
			    jQuery('#phone_popup').parents('.phonemsg').find('span.red').text('Please enter valid mobile number.Do not enter alphabet or special characters.')
		        document.static_form.dynFrm_phone.focus();
		        return false;
			}
			else{
			
				jQuery('#phone_popup').parents('.phonemsg').find('span.red').text('')
			}
		    
		    if(document.static_form.dynFrm_country.value=="IN^91" && (chktrim(document.static_form.dynFrm_phone.value).length<10 || chktrim(document.static_form.dynFrm_phone.value).length>10)) {
			
			    jQuery('#phone_popup').parents('.phonemsg').find('span.red').text('Please Enter Your 10 digits mobile number.')
		        document.static_form.dynFrm_phone.focus();
		        return false;
			}	
			else if(document.static_form.dynFrm_country.value!="IN^+91" && (chktrim(document.static_form.dynFrm_phone.value).length<3 || chktrim(document.static_form.dynFrm_phone.value).length>15)) {
				
				jQuery('#phone_popup').parents('.phonemsg').find('span.red').text('Please Enter Your 3 to 15 digits mobile number.')
		        document.static_form.dynFrm_phone.focus();
		        return false;
			}
			else{
			
				jQuery('#phone_popup').parents('.phonemsg').find('span.red').text('')
			}
	    }
	    
	    if (frm=="10019") {
		    
		    if(typeof document.static_form.order_value != "undefined") {
	    
			    if (chktrim(document.static_form.order_value.value).length!=0 && document.static_form.order_value_currency.options[document.static_form.order_value_currency.selectedIndex].value=="") {
			        
			        jQuery('#order_value_currency').parent().find('span.red').text('Please Select Currency.')
			        document.static_form.order_value_currency.focus();
			        return false;
				}	
				else{
					
					jQuery('#order_value_currency').parent().find('span.red').text('')
				}
			    
				if (chktrim(document.static_form.order_value.value).length==0 && document.static_form.order_value_currency.options[document.static_form.order_value_currency.selectedIndex].value!="") {
				
					jQuery('#order_value').parent().find('span.red').text('Please Enter Order Value.')
			        document.static_form.order_value.focus();
			        return false;
				}
				else{
					
					jQuery('#order_value').parent().find('span.red').text('')
				}
			}
		}
		
	    if (chktrim(document.static_form.dynFrm_details_2.value).length==0 || chktrim(document.static_form.dynFrm_details_2.value).length<20) {
			
		    jQuery('#dynFrm_details_2').parent().find('span.red').text('Please Enter Your Requirement Details [ Minimum 20 Characters ]')
	        document.static_form.dynFrm_details_2.focus();
	        return false;
		}
		else{
			
			jQuery('#dynFrm_details_2').parent().find('span.red').text('')
		}
		
		if (chktrim(document.static_form.dynFrm_details_2.value).length>1000) {
			
			jQuery('#dynFrm_details_2').parent().find('span.red').text('Please Enter Your Requirement Details [ Maximum 1000 Characters ]')
	        document.static_form.dynFrm_details_2.focus();
	        return false;
		}  
		else{
			
			jQuery('#dynFrm_details_2').parent().find('span.red').text('')
		}  
	}
	else if (frm=="10021") {  //Send Email Pop up Enquiry
	
		if(typeof document.email_form.dynFrm_subject != "undefined") {
	
			if (chktrim(document.email_form.dynFrm_subject.value).length==0) {
			
			    jQuery('#dynFrm_subject').parent().find('span.red').text('Please Enter Product / Service Looking For')
		        document.email_form.dynFrm_subject.focus();
		        return false;
			}
			else{
				
				jQuery('#dynFrm_subject').parent().find('span.red').text('')
			} 
		}
		
		if (chktrim(document.email_form.dynFrm_details_2.value).length==0 || chktrim(document.email_form.dynFrm_details_2.value).length<20) {
			jQuery('#dynFrm_details_2').parent().find('span.red').text('Please Enter Your Requirement Details [ Minimum 20 Characters ]')
	        document.email_form.dynFrm_details_2.focus();
	        return false;
		}
		else{
			
			jQuery('#dynFrm_details_2').parent().find('span.red').text('')
		}
		
		if (chktrim(document.email_form.dynFrm_details_2.value).length>1000) {
			
			jQuery('#dynFrm_details_2').parent().find('span.red').text('Please Enter Your Requirement Details [ Maximum 1000 Characters ]')
	        document.email_form.dynFrm_details_2.focus();
	        return false;
		}
		else{
			
			jQuery('#dynFrm_details_2').parent().find('span.red').text('')
		} 
	
	    if (chktrim(document.email_form.dynFrm_contact_person.value).length==0) {
		
		    jQuery('#dynFrm_contact_person').parent().find('span.red').text('Please Enter Your Name')
	        document.email_form.dynFrm_contact_person.focus();
	        return false;
		}
		else{
			
			jQuery('#dynFrm_contact_person').parent().find('span.red').text('')
		} 
		
		var username = document.email_form.dynFrm_email_id.value;
		
		if(chktrim(username)=='') {
			
			jQuery('#dynFrm_email_id').parent().find('span.red').text('Please enter email.')
			document.email_form.dynFrm_email_id.focus();
			return false;
		}
		else{
			
			jQuery('#dynFrm_email_id').parent().find('span.red').text('')
		}
		
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	   		
		if(reg.test(username) == false) {
	
			jQuery('#dynFrm_email_id').parent().find('span.red').text('Please enter valid email.')
			document.email_form.dynFrm_email_id.focus();
			return false;
		}
		else{
			
			jQuery('#dynFrm_email_id').parent().find('span.red').text('')
		}
		
		if (document.email_form.dynFrm_country.options[document.email_form.dynFrm_country.selectedIndex].value=="") {
			
			jQuery('#dynFrm_country').parent().find('span.red').text('Please Select Your Country.')
		    document.email_form.dynFrm_country.focus();
		    return false;
		}
		else{
			
			jQuery('#dynFrm_country').parent().find('span.red').text('')
		}
		
		if (chktrim(document.email_form.dynFrm_phone.value).length==0) {
	
			jQuery('#dynFrm_phone').parent().find('span.red').text('Please Enter Phone/Mobile Number.')
		    document.email_form.dynFrm_phone.focus();
			return false;
		}
		else{
			
			jQuery('#dynFrm_phone').parent().find('span.red').text('')
		}		
					
		var dynFrm_phone_reg = /^[0-9\/,-]+$/;
		
		if(chktrim(document.email_form.dynFrm_phone.value).length>0) {
		    
		    if(isNaN(document.email_form.dynFrm_phone.value)) {
			    
				jQuery('#dynFrm_phone').parent().find('span.red').text('Please enter valid mobile number.Do not enter alphabet or special characters.')
				document.email_form.dynFrm_phone.focus();
				return false;
			}
			else{
			
				jQuery('#dynFrm_phone').parent().find('span.red').text('')
			}
		
			if(document.email_form.dynFrm_country.options[document.email_form.dynFrm_country.selectedIndex].value=="IN^91" && (chktrim(document.email_form.dynFrm_phone.value).length<10 || chktrim(document.email_form.dynFrm_phone.value).length>10)) {
				
				jQuery('#dynFrm_phone').parent().find('span.red').text('Please Enter Your 10 digits mobile number.')
			    document.email_form.dynFrm_phone.focus();
				return false;
			}
			else if(document.email_form.dynFrm_country.options[document.email_form.dynFrm_country.selectedIndex].value!="IN^+91" && (chktrim(document.email_form.dynFrm_phone.value).length<3 || chktrim(document.email_form.dynFrm_phone.value).length>15)) {
				
				jQuery('#dynFrm_phone').parent().find('span.red').text('Please Enter Your 3 to 15 digits mobile number.')
			    document.email_form.dynFrm_phone.focus();
				return false;
			}
			else{
			
				jQuery('#dynFrm_phone').parent().find('span.red').text('')
			}
	    }	    
	}
	else if (frm=="10022") {  // Send SMS Pop up Enquiry
	
		if (chktrim(document.sms_form.dynFrm_details_2.value).length==0 || chktrim(document.sms_form.dynFrm_details_2.value).length<20) {
			jQuery('#dynFrm_details_2').parent().find('span.red').text('Please Enter Your Requirement Details [ Minimum 20 Characters ]')
	        document.sms_form.dynFrm_details_2.focus();
	        return false;
		}
		else{
			
			jQuery('#dynFrm_details_2').parent().find('span.red').text('')
		}
		
		if (chktrim(document.sms_form.dynFrm_details_2.value).length>1000) {
			
			jQuery('#dynFrm_details_2').parent().find('span.red').text('Please Enter Your Requirement Details [ Maximum 1000 Characters ]')
	        document.sms_form.dynFrm_details_2.focus();
	        return false;
		}
		else{
			
			jQuery('#dynFrm_details_2').parent().find('span.red').text('')
		} 
	
	    if (chktrim(document.sms_form.dynFrm_contact_person.value).length==0) {
		
		    jQuery('#dynFrm_contact_person').parent().find('span.red').text('Please Enter Your Name')
	        document.sms_form.dynFrm_contact_person.focus();
	        return false;
		}
		else{
			
			jQuery('#dynFrm_contact_person').parent().find('span.red').text('')
		} 
		
		var username = document.sms_form.dynFrm_email_id.value;
		
		if(chktrim(username)=='') {
			
			jQuery('#dynFrm_email_id').parent().find('span.red').text('Please enter email.')
			document.sms_form.dynFrm_email_id.focus();
			return false;
		}
		else{
			
			jQuery('#dynFrm_email_id').parent().find('span.red').text('')
		}
		
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	   		
		if(reg.test(username) == false) {
	
			jQuery('#dynFrm_email_id').parent().find('span.red').text('Please enter valid email.')
			document.sms_form.dynFrm_email_id.focus();
			return false;
		}
		else{
			
			jQuery('#dynFrm_email_id').parent().find('span.red').text('')
		}
		
		if (document.sms_form.dynFrm_country.options[document.sms_form.dynFrm_country.selectedIndex].value=="") {
			
			jQuery('#dynFrm_country').parent().find('span.red').text('Please Select Your Country.')
		    document.sms_form.dynFrm_country.focus();
		    return false;
		}
		else{
			
			jQuery('#dynFrm_country').parent().find('span.red').text('')
		}
		
		if (chktrim(document.sms_form.dynFrm_phone.value).length==0) {
	
			jQuery('#dynFrm_phone').parent().find('span.red').text('Please Enter Phone/Mobile Number.')
		    document.sms_form.dynFrm_phone.focus();
			return false;
		}
		else{
			
			jQuery('#dynFrm_phone').parent().find('span.red').text('')
		}		
					
		var dynFrm_phone_reg = /^[0-9\/,-]+$/;
		
		if(chktrim(document.sms_form.dynFrm_phone.value).length>0) {
		    
		    if(isNaN(document.sms_form.dynFrm_phone.value)) {
			    
				jQuery('#dynFrm_phone').parent().find('span.red').text('Please enter valid mobile number.Do not enter alphabet or special characters.')
				document.sms_form.dynFrm_phone.focus();
				return false;
			}
			else{
			
				jQuery('#dynFrm_phone').parent().find('span.red').text('')
			}
		
			if(document.sms_form.dynFrm_country.options[document.sms_form.dynFrm_country.selectedIndex].value=="IN^91" && (chktrim(document.sms_form.dynFrm_phone.value).length<10 || chktrim(document.sms_form.dynFrm_phone.value).length>10)) {
				
				jQuery('#dynFrm_phone').parent().find('span.red').text('Please Enter Your 10 digits mobile number.')
			    document.sms_form.dynFrm_phone.focus();
				return false;
			}
			else if(document.sms_form.dynFrm_country.options[document.sms_form.dynFrm_country.selectedIndex].value!="IN^+91" && (chktrim(document.sms_form.dynFrm_phone.value).length<3 || chktrim(document.sms_form.dynFrm_phone.value).length>15)) {
				
				jQuery('#dynFrm_phone').parent().find('span.red').text('Please Enter Your 3 to 15 digits mobile number.')
			    document.sms_form.dynFrm_phone.focus();
				return false;
			}
			else{
			
				jQuery('#dynFrm_phone').parent().find('span.red').text('')
			}
	    }	    
	}
	else if (frm=="10024" || frm=="10027") {  //EI Product Detail Page Inquiry form
	
	    if (chktrim(document.products_form.dynFrm_contact_person.value).length==0) {
		
		    jQuery('#detail_contact_person').parent().find('span.red').text('Please Enter Your Name')
	        document.products_form.dynFrm_contact_person.focus();
	        return false;
		}
		else{
			
			jQuery('#detail_contact_person').parent().find('span.red').text('')
		}
		
		var username = document.products_form.dynFrm_email_id.value;
		
		if(chktrim(username)=='') {
			
			jQuery('#detail_email_id').parent().find('span.red').text('Please enter email.')
			document.products_form.dynFrm_email_id.focus();
			return false;
		}
		else{
			
			jQuery('#detail_email_id').parent().find('span.red').text('')
		}
		
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	   		
		if(reg.test(username) == false) {
	
			jQuery('#detail_email_id').parent().find('span.red').text('Please enter valid email.')
			document.products_form.dynFrm_email_id.focus();
			return false;
		}
		else{
			
			jQuery('#detail_email_id').parent().find('span.red').text('')
		}
		
		if (chktrim(document.products_form.dynFrm_phone.value).length==0) {
	
			jQuery('#phone_popup').parents('.phonemsg').find('span.red').text('Please Enter Phone/Mobile Number.')
		    document.products_form.dynFrm_phone.focus();
			return false;
		}
		else{
			
			jQuery('#phone_popup').parent().find('span.red').text('')
		}
					
		var dynFrm_phone_reg = /^[0-9\/,-]+$/;
		
		if(chktrim(document.products_form.dynFrm_phone.value).length>0) {
		    
		    if(isNaN(document.products_form.dynFrm_phone.value)) {
			
			    jQuery('#phone_popup').parents('.phonemsg').find('span.red').text('Please enter valid mobile number.Do not enter alphabet or special characters.')
				document.products_form.dynFrm_phone.focus();
				return false;
			}
			else{
			
				jQuery('#phone_popup').parents('.phonemsg').find('span.red').text('')
			}
			
			if(document.products_form.dynFrm_country.value=="IN^91" && (chktrim(document.products_form.dynFrm_phone.value).length<10 || chktrim(document.products_form.dynFrm_phone.value).length>10)) {
				
				jQuery('#phone_popup').parents('.phonemsg').find('span.red').text('Please Enter Your 10 digits mobile number.')
			    document.products_form.dynFrm_phone.focus();
				return false;
			}
			else if(document.products_form.dynFrm_country.value!="IN^+91" && (chktrim(document.products_form.dynFrm_phone.value).length<3 || chktrim(document.products_form.dynFrm_phone.value).length>15)) {
				
				jQuery('#phone_popup').parents('.phonemsg').find('span.red').text('Please Enter Your 3 to 15 digits mobile number.')
			    document.products_form.dynFrm_phone.focus();
				return false;
			}
			else{
			
				jQuery('#phone_popup').parents('.phonemsg').find('span.red').text('')
			}
	    }
	    
	    if (frm=="10024") {
	    
		    if (chktrim(document.products_form.order_value.value).length!=0 && document.products_form.order_value_currency.options[document.products_form.order_value_currency.selectedIndex].value=="") {
			
			    jQuery('#order_value_currency').parent().find('span.red').text('Please Select Currency.')
		        document.products_form.order_value_currency.focus();
		        return false;
			}	
			else{
				
				jQuery('#order_value_currency').parent().find('span.red').text('')
			}
		    
			if (chktrim(document.products_form.order_value.value).length==0 && document.products_form.order_value_currency.options[document.products_form.order_value_currency.selectedIndex].value!="") {
			
				jQuery('#order_value').parent().find('span.red').text('Please Enter Order Value.')
		        document.products_form.order_value.focus();
		        return false;
			}
			else{
				
				jQuery('#order_value').parent().find('span.red').text('')
			}
		}
		
	    if (chktrim(document.products_form.dynFrm_details_2.value).length==0 || chktrim(document.products_form.dynFrm_details_2.value).length<20) {
			
		    jQuery('#detail_details_2').parent().find('span.red').text('Please Enter Your Requirement Details [ Minimum 20 Characters ]')
	        document.products_form.dynFrm_details_2.focus();
	        return false;
		}
		else{
			
			jQuery('#detail_details_2').parent().find('span.red').text('')
		}
		
		if (chktrim(document.products_form.dynFrm_details_2.value).length>1000) {
			
			jQuery('#detail_details_2').parent().find('span.red').text('Please Enter Your Requirement Details [ Maximum 1000 Characters ]')
	        document.products_form.dynFrm_details_2.focus();
	        return false;
		} 
		else{
			
			jQuery('#detail_details_2').parent().find('span.red').text('')
		}   
	}
	else if (frm=="10025") {  //REI Property Detail Page Enquiry
	
	    if (chktrim(document.static_form.dynFrm_contact_person.value).length==0) {
		
	    	jQuery('#dynFrm_contact_person_10025').parent().find('span.red').text('Please Enter Your Name.');
	        document.static_form.dynFrm_contact_person.focus();
	        return false;
		}
		else{
			
			jQuery('#dynFrm_contact_person_10025').parent().find('span.red').text('')
		}
		
		var username = document.static_form.dynFrm_email_id.value;
		
		if(chktrim(username)=='') {
			
			jQuery('#dynFrm_email_id_10025').parent().find('span.red').text('Please enter email.');
			document.static_form.dynFrm_email_id.focus();
			return false;
		}
		else{
			
			jQuery('#dynFrm_email_id_10025').parent().find('span.red').text('')
		}
		
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	   		
		if(reg.test(username) == false) {
	
			jQuery('#dynFrm_email_id_10025').parent().find('span.red').text('Please enter valid email.');
			document.static_form.dynFrm_email_id.focus();
			return false;
		}
		else{
			
			jQuery('#dynFrm_email_id_10025').parent().find('span.red').text('')
		}
		
		if (document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="") {
			
		  	jQuery('#dynFrm_country_10025').parent().find('span.red').text('Please Select Your Country.');
		    document.static_form.dynFrm_country.focus();
		    return false;
		}
		else{
			
			jQuery('#dynFrm_country_10025').parent().find('span.red').text('')
		}
		
		if (chktrim(document.static_form.dynFrm_phone.value).length==0) {
	
		    jQuery('#dynFrm_phone_10025').parent().find('span.red').text('Please Enter Phone/Mobile Number.');
		    document.static_form.dynFrm_phone.focus();
			return false;
		}
		else{
			
			jQuery('#dynFrm_phone_10025').parent().find('span.red').text('')
		}
		
					
		var dynFrm_phone_reg = /^[0-9\/,-]+$/;
		
		if(chktrim(document.static_form.dynFrm_phone.value).length>0) {
		    
		    if(isNaN(document.static_form.dynFrm_phone.value)) {
			    
				jQuery('#dynFrm_phone_10025').parent().find('span.red').text('Please enter valid mobile number.Do not enter alphabet or special characters.');
				document.static_form.dynFrm_phone.focus();
				return false;
			}
			else{
			
				jQuery('#dynFrm_phone_10025').parent().find('span.red').text('')
			}
		
			if(document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value=="IN^+91" && (chktrim(document.static_form.dynFrm_phone.value).length<10 || chktrim(document.static_form.dynFrm_phone.value).length>10)) {
				
				jQuery('#dynFrm_phone_10025').parent().find('span.red').text('Please Enter Your 10 digits mobile number.');
			    document.static_form.dynFrm_phone.focus();
				return false;
			}
			else if(document.static_form.dynFrm_country.options[document.static_form.dynFrm_country.selectedIndex].value!="IN^+91" && (chktrim(document.static_form.dynFrm_phone.value).length<3 || chktrim(document.static_form.dynFrm_phone.value).length>15)) {
				
				jQuery('#dynFrm_phone_10025').parent().find('span.red').text('Please Enter Your 3 to 15 digits mobile number.');
			    document.static_form.dynFrm_phone.focus();
				return false;
			}
			else{
			
				jQuery('#dynFrm_phone_10025').parent().find('span.red').text('')
			}
	    }
	    
	    if (chktrim(document.static_form.dynFrm_details_2.value).length==0) {
			
	    	jQuery('#dynFrm_details_2_10025').parent().find('span.red').text('Please Enter Your Requirement Details.');
	        document.static_form.dynFrm_details_2.focus();
	        return false;
		}
		else{
			
			jQuery('#dynFrm_details_2_10025').parent().find('span.red').text('')
		}
	    
		if (document.static_form.code && chktrim(document.static_form.code.value).length==0) {
			
			if (chktrim(document.static_form.code.value).length==0) {
			
				jQuery('#code_10025').parent().find('span.red').text('Please Enter Security Code Displayed on the Image.');
			    document.static_form.code.focus();
				return false;
			}
			else{
			
				jQuery('#dynFrm_details_2_10025').parent().find('span.red').text('')
			}
		}
	}
}