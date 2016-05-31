var $ = require('jquery')

function SpeechThread(el) {
  this.bubbles = document.querySelectorAll('[data-speech-bubble]')
  this.remaining = Array.prototype.slice.call(this.bubbles)
  this.timer = 0;
}

SpeechThread.prototype.showNext = function() {
  clearTimeout(this.timer)

  if(this.remaining.length > 0) {
    var next = this.remaining.shift()

    $(window).resize()
    next.setAttribute('data-speech-bubble', 'in')

    if(this.remaining.length === 0) {
      $('#contact').attr('data-show', 'in')
    } else {
      this.timer = setTimeout(this.showNext.bind(this), 2500)
    }
  }
}

SpeechThread.prototype.showAll = function() {
  clearTimeout(this.timer)
  $(this.remaining).attr('data-speech-bubble', 'in')
  this.remaining = []
  $('#contact').attr('data-show', 'in')
}

module.exports = SpeechThread