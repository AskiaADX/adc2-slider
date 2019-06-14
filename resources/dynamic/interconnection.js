
{%

Dim ar = CurrentQuestion.ParentLoop.Answers
Dim nbItemsInLoop = ar.Count


Dim adcId = CurrentADC.InstanceId
Dim interconnection = (CurrentADC.PropValue("interconnection") = "1")
Dim maxForInterconnection = CurrentADC.PropValue("maxValue")
Dim hideHandle = CurrentADC.PropValue("hideHandle")

If interconnection = true Then
%}



function dim{%= adcId %}(cbid){
	associatedSliderid = cbid.replace("freeze","myslider");
	associatedSlider=$("#"+associatedSliderid);

	if(document.getElementById(cbid).checked) {
		associatedSlider.attr("disabled","disabled");
		associatedSlider.addClass("greyOut{%= adcId %}");
		associatedSlider.removeClass('movable{%= adcId %}');
		associatedSlider.parents('.sliderContainer').removeClass('selected');
     }else{
		associatedSlider.removeAttr("disabled");
		associatedSlider.removeClass("greyOut{%= adcId %}");
        associatedSlider.addClass('movable{%= adcId %}');
		if(Number(associatedSlider.val())>= 0){
			associatedSlider.parents('.sliderContainer').addClass('selected');
		}
	 }
}

function computeSum () {
	var sum = 0.0;
	$(".sliders").each(function(index,slider) {
		sum += Number($(slider).val());
	})
	return sum.toFixed(2);
};

function recalculate{%= adcId %} (currentSlider) {

	$(currentSlider).parents('.sliderContainer').addClass('selected');

	var currentValue = Number($(currentSlider).val());
	var sumGreyOut = 0.0;
	var sumMovable = 0.0;
	var nbSlidersMovable = 0;
    var nbMovable = 0;


	$(".greyOut{%= adcId %}").each(function(index,slider) {
		sumGreyOut += Number($(slider).val());
	})
	var delta = {%= maxForInterconnection %} -currentValue -sumGreyOut;

	$(".movable{%= adcId %}").each(function(index,slider) {
        nbMovable += 1;
		sumMovable += Number($(slider).val());
	})

	if (nbMovable > 1 && currentValue !== sumMovable) {
    	$(".movable{%= adcId %}").each(function(index,slider) {
        	if ($(slider)[0].id !== $(currentSlider)[0].id) {
            	var val = Number( ( Number($(slider).val())  / (sumMovable - Number($(currentSlider).val())) ) * delta );
        		$(slider).val(val);
        	} else if (($(slider)[0].id === $(currentSlider)[0].id) && (delta < 0) ) {
                var val = Number( currentValue + delta );
        		$(slider).val(val);
            }
    	});
    } else if (nbMovable > 1 && currentValue === sumMovable) {
        $(".movable{%= adcId %}").each(function(index,slider) {
        	if ($(slider)[0].id !== $(currentSlider)[0].id) {
            	var val = Number( delta / (nbMovable - 1) );
        		$(slider).val(val);
        	} else if (($(slider)[0].id === $(currentSlider)[0].id) && (delta < 0) ) {
                var val = Number( currentValue + delta );
        		$(slider).val(val);
            }
    	});
    } else {
        if (delta < 0) {
            var val = Number( currentValue + delta );
        	$(currentSlider).val(val);
        }
    }

	$("#adc_{%= adcId %} .noUiSlider").each(function(index,slider) {
		if(Number($(slider).val())==0){
			$(slider).parents('.sliderContainer').removeClass('selected');
		}
	})

};

$(document).ready(function() {

	$('#adc_{%= adcId %} .noUiSlider').each(function(i) {
		$(this).attr('id','myslider{%= adcId %}_'+(i+1));
        {% If (hideHandle = "0") Then %}
        $(this).addClass('movable{%= adcId %}');
        {% EndIf %}
	});



	$("#adc_{%= adcId %} .noUiSlider").on({
		slide: function(){
		},
		set: function(){
		},
		change: function(){
            if (!($(this).hasClass("greyOut{%= adcId %}"))) {
            	$(this).addClass('movable{%= adcId %}');
            }
			recalculate{%= adcId %}(this);
		}
	});


});

{% EndIf %}
