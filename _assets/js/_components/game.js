
///////////////////////////////////////
//      Competition game
///////////////////////////////////////


$('.prize-builder__option').click(function(e){
  e.preventDefault();

  var parent = $('.prize-builder'),
      steps = $('.prize-builder__steps'),
      step_number = $(this).attr('data-step'),
      step_answer = $(this).attr('data-option'),
      result = $('.prize-builder__result');


  // SAVE RESULTS ###################
  // save results from the steps onto the #result element
  result.attr("data-result-" + step_number, step_answer);


  // GO TO NEXT Q ###################
  var current_step = $('.prize-builder__step.is-active');
  var next_step = current_step.next('.prize-builder__step');
  current_step.fadeOut().removeClass('is-active');
  next_step.fadeIn().addClass('is-active');




  // BUILD AND SHOW RESULTS ###################
  // if last step answered
  if( next_step.length == 0 ) {

    // answers
    var result1 = result.attr('data-result-1'),
        result2 = result.attr('data-result-2'),
        result3 = result.attr('data-result-3'),
        result4 = result.attr('data-result-4'),
        result5 = result.attr('data-result-5'),
        result6 = result.attr('data-result-6');

    $('.prize-builder__result-option').each(function(){
      if(
        ($(this).attr('data-result-id') == result1) ||
        ($(this).attr('data-result-id') == result2) ||
        ($(this).attr('data-result-id') == result3) ||
        ($(this).attr('data-result-id') == result4) ||
        ($(this).attr('data-result-id') == result5) ||
        ($(this).attr('data-result-id') == result6)
      ){
        $(this).addClass('option-selected');
      }else{
        $(this).addClass('option-eliminated').hide();
      }
    });

    parent.addClass('prize-builder--complete');

  }

});

// RESET GAME ###################
// $('.game__reset').click(function(e){
//   e.preventDefault();
//
//   var parent = $('.prize-builder'),
//       steps = $('.prize-builder__steps'),
//       result = $('.prize-builder__result');
//
//   var current_step = steps.find('.prize-builder__step--active');
//   var first_step = $('.prize-builder__step').first();
//   current_step.removeClass('prize-builder__step--active');
//   first_step.show().addClass('prize-builder__step--active');
//
//   result.removeAttr('data-result-1');
//   result.removeAttr('data-result-2');
//   result.removeAttr('data-result-3');
//   result.removeAttr('data-result-4');
//   result.removeAttr('data-result-5');
//
//   parent.removeClass('prize-builder--complete');
// });






