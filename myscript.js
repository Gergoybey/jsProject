
$(document).ready(function (){
	
        console.log("poczatek: ");
	
		$('#regExp').validate({pattern : '^[1-9][0-9]*'});
		$('#pass').validatePass();
		$('#email').validateEmail();
		$('#entropy').validateEntropy({threshold : 2}).animate().hide('slow').show('slow');
		$('#post').postCode($('#city'));
	
        //$(':text').validate({pattern : '^[1-9][0-9]*'});
    
        console.log("koniec: ");

});




