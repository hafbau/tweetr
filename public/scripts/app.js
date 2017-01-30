/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
"use strict";

// Document load IIFE
$(function(){

  (function() {
    $.ajax({
      url: `/gethandle`,
      type: 'get',
      contentType: 'text'
    }).then(function(handle) {
        loadTweets(handle);
        if (handle) {
          $('.login, .register').remove();
          $('#nav-bar').append(loggedInNav(handle));
        }
    });
  })();

  // Initial load of tweets - it maintains the windows.scroll binding

  // Toggling the new tweet form with the compose button
  $('#nav-bar').on('click', '.compose', composeToggler);

  // character counting
  $('#tweet-text').on('keyup', charCounting);

  // New tweet submit event handler
  $('.new-tweet form').on('submit', newTweetHandler);

  // Liking Tweets
  $('#tweets').on('click', '.fa-heart', likesHandler);

  // Show registration form
  $('.register').on('click', showRegistration);

  // Show login form
  $('.login').on('click', showLogin);

  $('#modal form').on('submit', function(e) {
    e.preventDefault();
    let $this = $(this);
    $.post($this[0].action, $this.serialize())
    .fail(function(res) {
      $this.find('.tooltiptext').text(res.responseText)
      .css('opacity', 1).show();
    }).success(function(handle) {
      $('.login, .register').remove();
      $('#nav-bar').append(loggedInNav(handle));
      $this[0].reset();
      $('#modal').hide();

    });
  })

  // Events binding for hiding #modal on click or ESC
  $('#modal').on('click', hideOnClick);
  $(document).on('keyup', hideModalOnEsc);

  // for pagination
  $(window).on('scroll', bindScroll);
});