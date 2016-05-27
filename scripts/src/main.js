var $ = require('jquery')

$(function() {
  var $window = $(window)
  var $html = $('html')
  var $body = $('body')

  $window.on('resize', resizeBubbles);

  $('[data-show]').on('click', function(event) {
    event.preventDefault();
    var $btn = $(event.target).closest('[data-show]')
    var showTarget = $btn.attr('data-show')
    if(showTarget) {
      $(showTarget).attr('data-click-in', 'in')
      $btn.attr('disabled', 'disabled')

      if(showTarget === '#contact' && $(window).scrollTop() > 0) {
        $('html,body').animate({
          scrollTop: 0
        }, 300)
      }
    }
  })

  $html.one('typekit-finish', function() {
    var thread = new SpeechThread()

    resizeBubbles()

    // Click to show next
    $html.on('click', function(event) {
      thread.showNext()
    })

    $html.on('keypress', function(event) {
      if(event.key === ' ' || typeof event.key === 'undefined') {
        thread.showAll()
        $('[data-show="#contact"]').click()
      }
    })

    $body.addClass('ready')
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

function SpeechThread(el) {
  this.bubbles = document.querySelectorAll('[data-speech-bubble]')
  this.remaining = Array.prototype.slice.call(this.bubbles)
  this.timer = 0;

  this.showNext()
}

SpeechThread.prototype.showNext = function() {
  clearTimeout(this.timer)

  if(this.remaining.length > 0) {
    var next = this.remaining.shift()

    resizeBubbles()
    next.setAttribute('data-speech-bubble', 'in')

    this.timer = setTimeout(this.showNext.bind(this), 2500)
  }
}

SpeechThread.prototype.showAll = function() {
  clearTimeout(this.timer)
  $(this.remaining).attr('data-speech-bubble', 'in')
  this.remaining = []
}