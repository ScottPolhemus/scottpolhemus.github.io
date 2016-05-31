var $ = require('jquery')
var SpeechThread = require('./lib/speech-thread.js')

$(function() {
  var $window = $(window)
  var $html = $('html')
  var $body = $('body')

  $('[data-show-target]').on('click', function(event) {
    var $btn = $(event.target).closest('[data-show-target]')
    var target = $btn.attr('data-show-target')
    if(target) {
      event.preventDefault()
      $(target).attr('data-show', 'in')

      if(target === '#contact' && $(window).scrollTop() > 0) {
        $('html,body').animate({
          scrollTop: 0
        }, 300)
      }
      
      $btn.attr('disabled', 'disabled')
      $btn.off('click')
    }
  })

  $html.one('typekit-finish', function() {
    var thread = new SpeechThread()

    // Click to show next
    $html.on('click', function(event) {
      thread.showNext()
    })

    $html.on('keypress', function(event) {
      if(event.key === ' ' || typeof event.key === 'undefined') {
        thread.showAll()
      }
    })

    resizeBubbles()
    $window.on('resize', resizeBubbles)

    $body.addClass('ready')

    thread.showNext()
  })

  // In case fonts are ready before JS runs...
  if($html.is('.wf-active,.wf-inactive')) {
    $html.trigger('typekit-finish')
  }
})

var $bubbles = $('.speech-bubble');

function resizeBubbles() {
  for(var i = 0; i < $bubbles.length; i++) {
    var el = $bubbles[i]

    if(el.getAttribute('data-speech-bubble') === 'in') {
      el.removeAttribute('style')
    } else {
      var contentHeight = $(el.children[0]).outerHeight(true)
      el.setAttribute('style', 'height: '+contentHeight+'px')
    }
  }
}
