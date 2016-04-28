(function($) {

		
		$.get("kody.csv", function(response) {
			//console.log(response);
			console.log(response.split("\n")[600].split(";")[2]);
		});

        var check = function (toCheck,submitButton) {
            var valid = true;
            for (var i = 0, len = toCheck.length; i < len; i++) {
                if (!(toCheck[i]())){
                    valid = false;
                }
            }
            submitButton.attr("disabled", !valid);
        };
        
		var kody;
		
		var findCityName = function (code){
			return kody[code];
		}
		
		var setCityName = function (field,code){
			
			if (kody === undefined){
				
				$.get("kody.csv", function(response) {
				
					kody = [];
					response = response.split("\n");
					for(var i = 0 ; i < response.length ; i++){
						var row = response[i].split(";");
						kody[row[0]] = row[2];
					}
					console.log(kody);
					field.val(findCityName(code))
				});
			}else{
				field.val(findCityName(code));
			}
			
		}
		
        var addValidation = function ($input,validationF){
            var $form = $input.closest('form');
                
                var _validationF = function () {
                    var valid = validationF();
                    if (valid) {
                        $input.removeClass("error");
                    }
                    else{
                        $input.addClass("error");
                    }
                    return valid;
                };
            
                if ($form.data('check') === undefined){
                    var toCheck = [];
                    $form.data('check',toCheck);
                    toCheck.push(_validationF);
                }else{
                    $form.data('check').push(_validationF);
                }
                
                check($form.data('check'),$form.find(':submit'));
                $input.blur(function() {    
                    check($form.data('check'),$form.find(':submit'));
                });
        };
        
        var count = function (char , string){
            var count = 0;
            for (var i = 0; i < string.length ; i++ ){
                if (string[i] === char){
                    count++;
                }
            }
            return count;
        };
        
		var probs = function(text){
			var probs = [];
			for(var i = 0; i<text.length; i++) {
				if (probs[text[i]] === undefined){
					var c = count(text[i],text);
					var prob = c / text.length;
					probs[text[i]] = prob;
				}
			}
			return probs;
		};
		
		
		
        $.fn.postCode = function (cityField) {
            return this.each(function() {
                
				console.log("OK");
				var reg = new RegExp("^[0-9]{2}-[0-9]{3}$");
				
				$th = $(this);
				$th.blur(function() { 
					console.log("OK");   
					if (reg.test($th.val())){
						console.log("OK2");
						setCityName(cityField,$th.val());
					}
                });
            });
        };
		
		
        $.fn.validateEntropy = function (options) {
            return this.each(function() {
                var settings = $.extend({
                        threshold : 1.5
                }, options);
                
                var threshold = settings.threshold;
                var $input = $(this);
                                
                addValidation($(this),function (){
                    var text = $input.val();
                    
                    var entropy = 0;
					
					var p = probs(text);
					for (var i in p) {
                        entropy -= p[i] * Math.log2(p[i]);
					}
					
					console.log("entropy=" + entropy);
                    return (entropy >= threshold);
                });
            });
        };
        
    
        
        $.fn.validatePass = function(){
            return this.each(function() {
                var $input = $(this);
                
                var validationF = function (){
                    var text = $input.val();
                    var digitRE = new RegExp('\\d', 'g'), digits = 0;
                    var bigRE = new RegExp('[A-Z]', 'g'), big = 0;
                    var smallRE = new RegExp('[a-z]', 'g'), small = 0;
                    var length = text.length;
                    
                    while(digitRE.exec(text)) digits++;
                    while(bigRE.exec(text)) big++;
                    while(smallRE.exec(text)) small++;
                    
                    
                    var valid = (digits >= 2 && big >= 2 && small >=2 && length>=8);
                    
                    return valid;
                };
                addValidation($(this),validationF);
            });
        };
        
        $.fn.validate = function(options){
            return this.each(function() {
                var settings = $.extend({
                        pattern : "Podaj wartość"
                }, options);
                
                var pattern = new RegExp(settings.pattern);
                var $input = $(this);
                
                var validationF = function (){
                    return pattern.test($input.val());
                };
                addValidation($(this),validationF);
            });
        };

        $.fn.validateEmail = function (){
            return $(this).validate({pattern : "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"});
        };


})(jQuery);