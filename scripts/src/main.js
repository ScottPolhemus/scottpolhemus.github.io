var $ = require('jquery')
var ScrollIn = require('scroll-in')

var speechBubbles = $('.speech-bubble')

function resizeBubbles() {
  for(var i = 0; i < speechBubbles.length; i++) {
    var el = speechBubbles[i]
    var contentHeight = $(el.children[0]).outerHeight(true)
    el.setAttribute('style', 'height: '+contentHeight+'px')
  }
}

$(function() {
  var $window = $(window)
  var $html = $('html')

  $('[data-show]').on('click', function(event) {
    var target = event.target.getAttribute('data-show')
    event.target.setAttribute('disabled', 'disabled')
    $(target).attr('data-click-in', 'in')
  })

  $window.on('resize', resizeBubbles)

  $html.one('typekit-finish', function() {
    resizeBubbles()
    $('body').addClass('ready')

    new ScrollIn({
      stagger: 1500
    })
  })

  if($html.is('.wf-active,.wf-inactive')) {
    $html.trigger('typekit-finish')
  }
})