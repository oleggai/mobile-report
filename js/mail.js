function sendMail(){
    try {
    	var to = $("#mail-to").val(),
        	from = $("#mail-from").val(),
        	subject = $("#mail-subject").val(),
        	body = $("section#line-details div.content").html();
    
    	if(!validateEmail(to) || !validateEmail(from)){
    		navigator.notification.alert("Email address is invalid!", null, "Warning!");
        	return;
    	}
    
    	localStorage.setItem("email", from);
    
    	if(subject == "" || subject == null){
    		navigator.notification.alert("Subject can't be empty!", null, "Warning!");
        	return;
    	}
    
    	$('#shadow').show();
    
    
    
    	$.ajax({
    		async: true,
        	type: 'POST',
        	url: EmailURL,
        	timeout: 20000,
        	error: function() {
          		$('#shadow').hide();
          		navigator.notification.alert("Mail not sended!", null, "Warning!");
        	},
        	data: {	to: to,
               		from: from,
              		subject: subject,
          			body: body}
    	}).success(function(status) {
            
        	$('#shadow').hide();
            if(status){
                $("section#mail button.left").click();
            	navigator.notification.alert("Mail sended!", null, "Success!");
            } else {
                navigator.notification.alert("Mail not sended!", null, "Warning!");
            }
    	});
    
    
    
    } catch (e) {
    	$('#shadow').hide();
        navigator.notification.alert("Mail not sended!", null, "Warning!");
    }
}

function validateEmail(email){
	var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-z0-9]{2,4})+$/;
    return (reg.test(email)) ? true : false;
}