
{%

Dim ar = CurrentQuestion.ParentLoop.AvailableResponses
Dim nbItemsInLoop = ar.Count


Dim adcId = CurrentADC.InstanceId
Dim interconnection = (CurrentADC.PropValue("interconnection") = "1") ' Convert to boolean
Dim maxForInterconnection=CurrentADC.PropValue("maxForInterconnection")

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
		if(Number(associatedSlider.val())>0){
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
	
	
	$(".greyOut{%= adcId %}").each(function(index,slider) {
		sumGreyOut += Number($(slider).val());
	})
	var delta = {%= maxForInterconnection %} -currentValue -sumGreyOut;
	
	$(".movable{%= adcId %}").each(function(index,slider) {
		sumMovable += Number($(slider).val());
	})

	if (sumMovable === 0){
		$(currentSlider).val({%= maxForInterconnection %} - sumGreyOut);
	}else if(sumGreyOut+currentValue>{%= maxForInterconnection %}){
		$(currentSlider).val({%= maxForInterconnection %} - sumGreyOut);
		recalculate{%= adcId %}(currentSlider);
	}else{
		$(".movable{%= adcId %}").each(function(index,slider) {
			var val = Number( ( Number($(slider).val())/sumMovable)*delta );
			$(slider).val(val);
		})
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
	});

	

	$("#adc_{%= adcId %} .noUiSlider").on({
		slide: function(){
		},
		set: function(){
		},
		change: function(){
			$("#adc_{%= adcId %} .noUiSlider").each(function(index,slider) {
				if(!($(slider).hasClass("greyOut{%= adcId %}"))){
					$(slider).addClass('movable{%= adcId %}');
				}
			})	
			$(this).removeClass('movable{%= adcId %}');
			recalculate{%= adcId %}(this);		
		}
	});
	
	
});

{% EndIf %}