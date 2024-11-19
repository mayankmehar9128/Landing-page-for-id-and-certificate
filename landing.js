// Slick slider init

function toggleMenu() {
  const sideNav = document.getElementById("sideNav");
  if (sideNav.style.width === "250px") {
      sideNav.style.width = "0";
  } else {
      sideNav.style.width = "250px";
  }
}


$('.slider').slick({
    arrows: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    centerMode: true,
    variableWidth: true,
    draggable: false
  });
  
  $('.slider')
    .on('beforeChange', function(event, slick, currentSlide, nextSlide){
      $('.slick-list').addClass('do-transition')
    })
    .on('afterChange', function(){
      $('.slick-list').removeClass('do-transition')
    });
     










// Slick slider init

// $('.slider').slick({
//     arrows: true,
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     centerMode: true,
//     variableWidth: true,
//     draggable: false
//   });
  
//   $('.slider')
//     .on('beforeChange', function(event, slick, currentSlide, nextSlide){
//       $('.slick-list').addClass('do-transition')
//     })
//     .on('afterChange', function(){
//       $('.slick-list').removeClass('do-transition')
//     });
     
