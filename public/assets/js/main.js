(function($) {
    "use strict";
  
    const $documentOn = $(document);
    const $windowOn = $(window);
  
    $documentOn.ready( function() {
  
      //>> Mobile Menu Js Start <<//
      $('#mobile-menu').meanmenu({
        meanMenuContainer: '.mobile-menu',
        meanScreenWidth: "991",
        meanExpand: ['<i class="far fa-plus"></i>'],
    });
  
    $('#mobile-menus').meanmenu({
        meanMenuContainer: '.mobile-menus',
        meanScreenWidth: "1920",
        meanExpand: ['<i class="far fa-plus"></i>'],
      });
      
      //>> Sidebar Toggle Js Start <<//
      $(".offcanvas__close,.offcanvas__overlay").on("click", function () {
        $(".offcanvas__info").removeClass("info-open");
        $(".offcanvas__overlay").removeClass("overlay-open");
      });
      $(".sidebar__toggle").on("click", function () {
        $(".offcanvas__info").addClass("info-open");
        $(".offcanvas__overlay").addClass("overlay-open");
      });
  
      //>> Body Overlay Js Start <<//
      $(".body-overlay").on("click", function () {
        $(".offcanvas__area").removeClass("offcanvas-opened");
        $(".df-search-area").removeClass("opened");
        $(".body-overlay").removeClass("opened");
      });
  

    /* ================================
     Back To Top Button Js Start
    ================================ */

  // Function to toggle back-to-top button visibility
    function toggleBackTop() {
        if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
            $("#gt-back-top").addClass("show");
        } else {
            $("#gt-back-top").removeClass("show");
        }
    }

    // On scroll
    $windowOn.on('scroll', function() {
        toggleBackTop();
    });

    // On document ready, force hide the button
    $(document).ready(function() {
        $("#gt-back-top").removeClass("show");
    });

    // On click
    $documentOn.on('click', '#gt-back-top', function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
        return false;
    });

    
      //>> Sticky Header Js Start <<//
  
      $windowOn.on("scroll", function () {
        if ($(this).scrollTop() > 250) {
          $("#header-sticky").addClass("sticky");
        } else {
          $("#header-sticky").removeClass("sticky");
        }
      });      
      
      //>> Video Popup Start <<//
      $(".img-popup").magnificPopup({
        type: "image",
        gallery: {
          enabled: true,
        },
      });

      $(".img-popup2").magnificPopup({
        type: "image",
        gallery: {
          enabled: true,
        },
      });
  
      $(".video-popup").magnificPopup({
        type: "iframe",
        callbacks: {},
      });
  
      //>> Counterup Start <<//
      $(".gt-count").counterUp({
        delay: 15,
        time: 4000,
      });
  
      //>> Wow Animation Start <<//
      new WOW().init();
  
      //>> Nice Select Start <<//
        if ($('.single-select').length) {
          $('.single-select').niceSelect();
      }

     //>> Marque Text Slider Start <<//
      if($('.marquee-text-slider').length > 0) {
        const marqueeTextSlider = new Swiper(".marquee-text-slider", {
            slidesPerView: 'auto',
            spaceBetween: 20,
            freemode: true,
            centeredSlides: true,
            loop: true,
            speed: 6000,
            allowTouchMove: false,
            autoplay: {
                delay: 1,
                disableOnInteraction: true,
            },
        });
    }

    
   const mySwiper = new Swiper('.swiper-container', {
   effect: 'coverflow',
   slidesPerView: 'auto',
   centeredSlides: true,
    
   coverflowEffect: {
    slideShadows: true,
    rotate: 20,
    stretch: 100,
    depth: 850,
    modifier: 1,
  },
   navigation: {
    nextEl: '.array-next',
    prevEl: '.array-prev',
  },
});


    

    //>> Marque Text Slider-2 Start <<//
    if($('.marquee-text-slider-2').length > 0) {
        const marqueeTextSlider2 = new Swiper(".marquee-text-slider-2", {
            slidesPerView: 'auto',
            spaceBetween: 20,
            freemode: true,
            centeredSlides: true,
            loop: true,
            speed: 6000,
            allowTouchMove: false,
            autoplay: {
                delay: 1,
                disableOnInteraction: true,
            },
        });
    }

    //>> Gt Testimonial box Slider — handled by React TestimonialSliders on Next.js <<//
    // (original theme inits these in static HTML; see TestimonialSliders.tsx)

        // Left Side: Testimonial Content Slider
    if ($('.th-testimonial-slider').length > 0 && $('.swiper-image').length > 0) {

        const imageSwiper = new Swiper('.swiper-image', {
        effect: 'cards',
        grabCursor: true,
        loop: true,
        keyboard: {
        enabled: true,
        onlyInViewport: false,
        },
        navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        },
        cardsEffect: {
        rotate: 0,
        perSlideRotate: 0,
        perSlideOffset: 3
        },
        });
        
        const contentSwiper = new Swiper('.th-testimonial-slider', {
        spaceBetween: 30,
        speed: 1300,
        loop: true,
        autoplay: {
        delay: 2000,
        disableOnInteraction: false,
        },
        navigation: {
        nextEl: '.array-prev',
        prevEl: '.array-next',
        },
        breakpoints: {
        0: { slidesPerView: 1 },
        575: { slidesPerView: 1 },
        767: { slidesPerView: 1 },
        991: { slidesPerView: 1 },
        1199: { slidesPerView: 1 },
        1399: { slidesPerView: 1 },
        },
        });
        
        // Link the two Swipers
        contentSwiper.controller.control = imageSwiper;
        imageSwiper.controller.control = contentSwiper;
        }

    //>> Gt-Testimonial Slider Start <<//
        if($('.gt-testimonial-slider-2').length > 0) {
        const gtTestimonialSlider2 = new Swiper(".gt-testimonial-slider-2", {
            spaceBetween: 30,
            speed: 1300,
            loop: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: ".array-prev",
                prevEl: ".array-next",
            },
            breakpoints: {
                1199: {
                    slidesPerView: 1,
                },
                991: {
                    slidesPerView: 1,
                },
                767: {
                    slidesPerView: 1,
                },
                575: {
                    slidesPerView: 1,
                },
                0: {
                    slidesPerView: 1,
                },
            },
        });
    }

    //>> Gt-Instagram Slider Start <<//
     if($('.gt-instagram-slider').length > 0) {
        const gtInstagramSlider = new Swiper(".gt-instagram-slider", {
            spaceBetween: 30,
            speed: 1300,
            loop: true,
            centeredSlides: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },

            breakpoints: {
                1199: {
                    slidesPerView: 12,
                },
                991: {
                    slidesPerView: 10,
                },
                767: {
                    slidesPerView: 7,
                },
                575: {
                    slidesPerView: 4,
                },
                0: {
                    slidesPerView: 3,
                },
            },
        });
    }

    //>> Gt-Brand Slider Start <<//
    if($('.gt-brand-slider').length > 0) {
        const gtBrandSlider = new Swiper(".gt-brand-slider", {
            spaceBetween: 30,
            speed: 1300,
            loop: true,
            centeredSlides: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            breakpoints: {
                1199: {
                    slidesPerView: 6,
                },
                991: {
                    slidesPerView: 4,
                },
                767: {
                    slidesPerView: 3,
                },
                575: {
                    slidesPerView: 3,
                },
                0: {
                    slidesPerView:1,
                },
            },
        });
    }

    //>> Gt-Artist Slider Start <<//
    if($('.gt-artist-slider').length > 0) {
        const gtArtistSlider = new Swiper(".gt-artist-slider", {
            spaceBetween: 30,
            speed: 1300,
            loop: true,
            centeredSlides: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: ".array-prev",
                prevEl: ".array-next",
            },
            breakpoints: {
                1499: {
                    slidesPerView: 6,
                },
                1199: {
                    slidesPerView: 5,
                },
                991: {
                    slidesPerView: 3,
                },
                767: {
                    slidesPerView: 2,
                },
                575: {
                    slidesPerView: 2,
                },
                0: {
                    slidesPerView: 1,
                },
            },
        });
    }

    //>> Gt-Artist Slider Start <<//
    if($('.gt-speaker-slider').length > 0) {
        const gtSpeakerSlider = new Swiper(".gt-speaker-slider", {
            spaceBetween: 30,
            speed: 1300,
            loop: true,
            centeredSlides: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: ".array-prev",
                prevEl: ".array-next",
            },
            breakpoints: {
                1499: {
                    slidesPerView: 5,
                },
                1199: {
                    slidesPerView: 4,
                },
                991: {
                    slidesPerView: 3,
                },
                767: {
                    slidesPerView: 2,
                },
                575: {
                    slidesPerView: 2,
                },
                0: {
                    slidesPerView: 1,
                },
            },
        });
    }

    //>> Gt-event-schedule-item-4 Hover Image Show Slider Start <<//
        const scheduleItems = document.querySelectorAll(".gt-event-schedule-item-4");

        scheduleItems.forEach((item) => {
            const imageHover = item.querySelector(".image-hover");

            item.addEventListener("mousemove", (event) => {
                const rect = item.getBoundingClientRect();
                const dx = event.clientX - rect.left;
                const dy = event.clientY - rect.top;

                imageHover.style.transform = `translate(${dx}px, ${dy}px) rotate(28.57deg)`;
                imageHover.style.opacity = "1";
                imageHover.style.visibility = "visible";
            });

            item.addEventListener("mouseleave", () => {
                imageHover.style.opacity = "0";
                imageHover.style.visibility = "hidden";
            });
        });


    //>> CountDown Start <<//
    document.querySelectorAll(".gt-coming-soon-time").forEach(container => {
      const eventTimeAttr = container.getAttribute("data-event-time");
      if (!eventTimeAttr) return;

      const eventTime = new Date(eventTimeAttr).getTime();

      const dayEl = container.querySelector(".gt-day");
      const hourEl = container.querySelector(".gt-hour");
      const minEl = container.querySelector(".gt-min");
      const secEl = container.querySelector(".gt-sec");

      const updateCountdown = () => {
        const now = new Date().getTime();
        const diff = eventTime - now;

        if (diff <= 0) {
          clearInterval(timer);
          container.innerHTML = "<p class='countdown-ended'>Countdown has ended!</p>";
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        dayEl.textContent = String(days).padStart(2, "0");
        hourEl.textContent = String(hours).padStart(2, "0");
        minEl.textContent = String(minutes).padStart(2, "0");
        secEl.textContent = String(seconds).padStart(2, "0");
      };

      updateCountdown(); // Initial call
      const timer = setInterval(updateCountdown, 1000);
    });



    // Select all play buttons inside swiper slides

    const playButtons = document.querySelectorAll('.play-btn');
    if (!playButtons.length) return;

    const audio = new Audio();
    let isPlaying = false;
    let currentButton = null;
    let isLoading = false;

    const tracks = [
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    ];

    // Update button icon and aria-pressed
    function updatePlayButton(button, playing) {
        if (!button) return;
        button.innerHTML = playing
        ? '<i class="fas fa-pause" aria-hidden="true"></i>'
        : '<i class="fas fa-play" aria-hidden="true"></i>';
        button.setAttribute('aria-pressed', playing);
    }

    // Reset button to play state
    function resetPlayButton(button) {
        if (!button) return;
        updatePlayButton(button, false);
    }

    // Play button click handler
    playButtons.forEach((btn, index) => {
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('aria-pressed', 'false');

        btn.addEventListener('click', () => {
        if (isLoading) return; // prevent action while loading

        if (isPlaying && currentButton === btn) {
            audio.pause();
            return;
        }

        if (isPlaying && currentButton !== btn) {
            audio.pause();
            resetPlayButton(currentButton);
        }

        isLoading = true;
        audio.src = tracks[index] || tracks[0];
        audio.play().catch(err => {
            console.error('Playback failed:', err);
            isLoading = false;
        });

        currentButton = btn;
        isPlaying = true;
        updatePlayButton(btn, true);
        });

        // Keyboard support
        btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
        }
        });
    });

    audio.addEventListener('pause', () => {
        if (currentButton) {
        updatePlayButton(currentButton, false);
        }
        isPlaying = false;
        isLoading = false;
    });

    audio.addEventListener('ended', () => {
        if (currentButton) {
        updatePlayButton(currentButton, false);
        }
        isPlaying = false;
        isLoading = false;
    });

    audio.addEventListener('playing', () => {
        isLoading = false;
    });

   /* ================================
        Quantity Increment/Decrement Js Start
    ================================ */
    const quantityButtons = document.querySelectorAll(".quantityIncrement, .quantityDecrement");
    if (quantityButtons.length) {
        quantityButtons.forEach((button) => {
            button.addEventListener("click", function () {
                const input = button.parentElement.querySelector("input");
                let value = parseInt(input.value, 10) || 0;

                if (button.classList.contains("quantityIncrement")) {
                    input.value = value + 1;
                } else if (button.classList.contains("quantityDecrement") && value > 1) {
                    input.value = value - 1;
                }
            });
        });
    }

    /* ================================
       Payment Method Update Js Start
    ================================ */

    function updatePaymentMethod() {
        let paymentMethod = $("input[name='pay-method']:checked").val();
        $(".payment").html(paymentMethod);
    }

    // Initial load
    updatePaymentMethod();

    // On click of radio option
    $(".checkout-radio-single input[name='pay-method']").on("change", function () {
        updatePaymentMethod();
    });
    
    }); // End Document Ready Function

    /* ================================
       Additional Quantity Controls Js Start
    ================================ */

    const inputs = document.querySelectorAll('#qty, #qty2, #qty3');
    const btnminus = document.querySelectorAll('.qtyminus');
    const btnplus = document.querySelectorAll('.qtyplus');

    if (inputs.length > 0 && btnminus.length > 0 && btnplus.length > 0) {
        inputs.forEach(function(input, index) {
            const min = Number(input.getAttribute('min')) || 0;
            const max = Number(input.getAttribute('max')) || 9999;
            const step = Number(input.getAttribute('step')) || 1;

            function qtyminus(e) {
                e.preventDefault();
                let current = Number(input.value);
                let newval = current - step;
                if (newval < min) newval = min;
                input.value = newval;
            }

            function qtyplus(e) {
                e.preventDefault();
                let current = Number(input.value);
                let newval = current + step;
                if (newval > max) newval = max;
                input.value = newval;
            }

            btnminus[index].addEventListener('click', qtyminus);
            btnplus[index].addEventListener('click', qtyplus);
        });
    }
    

        document.querySelectorAll('.accordion-button').forEach((button, index, buttons) => {
        button.addEventListener('click', function (e) {
        const targetCollapse = document.querySelector(this.dataset.bsTarget);

        // If this one is already open
        if (targetCollapse.classList.contains('show')) {
            e.preventDefault(); // Stop default toggle
            const instance = bootstrap.Collapse.getInstance(targetCollapse);
            instance.hide(); // Close this one

            // Then open the next one
            const nextButton = buttons[index + 1];
            if (nextButton) {
            const nextCollapse = document.querySelector(nextButton.dataset.bsTarget);
            const nextInstance = bootstrap.Collapse.getOrCreateInstance(nextCollapse);
            nextInstance.show();
            }
        }
        });
    });

    //>> Search Start <<//
     if ($(".search-toggler").length) {
        $(".search-toggler").on("click", function(e) {
            e.preventDefault();
            $(".search-popup").toggleClass("active");
            $("body").toggleClass("locked");
        });
    }

    //>> MouseCursor Start <<//
    if ($(".mouseCursor").length > 0) {
        function itCursor() {
            var myCursor = jQuery(".mouseCursor");
            if (myCursor.length) {
                if ($("body")) {
                    const e = document.querySelector(".cursor-inner"),
                        t = document.querySelector(".cursor-outer");
                    let n,
                        i = 0,
                        o = !1;
                    (window.onmousemove = function(s) {
                        o ||
                            (t.style.transform =
                                "translate(" + s.clientX + "px, " + s.clientY + "px)"),
                            (e.style.transform =
                                "translate(" + s.clientX + "px, " + s.clientY + "px)"),
                            (n = s.clientY),
                            (i = s.clientX);
                    }),
                    $("body").on(
                            "mouseenter",
                            "button, a, .cursor-pointer",
                            function() {
                                e.classList.add("cursor-hover"),
                                    t.classList.add("cursor-hover");
                            }
                        ),
                        $("body").on(
                            "mouseleave",
                            "button, a, .cursor-pointer",
                            function() {
                                ($(this).is("a", "button") &&
                                    $(this).closest(".cursor-pointer").length) ||
                                (e.classList.remove("cursor-hover"),
                                    t.classList.remove("cursor-hover"));
                            }
                        ),
                        (e.style.visibility = "visible"),
                        (t.style.visibility = "visible");
                }
            }
        }
        itCursor();
    }
    
    function loader() {
        $windowOn.on('load', function() {
            // Animate loader off screen
            $(".preloader").addClass('loaded');
            $(".preloader").delay(200).fadeOut();
        });
    }
    
    loader();
  
  })(jQuery); // End jQuery