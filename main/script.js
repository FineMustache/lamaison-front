let slideIndex = 1;
let slides = document.querySelectorAll('.slide');
let slidesContainer = document.querySelector('.slides');
let textCarousel = [
  'Transforme os ares da sua casa',
  'Destaque o ambiente do seu negócio',
  'Um novo visual para seu Escritório'
]

showSlide(slideIndex);

function changeSlide(n) {
  showSlide(slideIndex += n);
}

function showSlide(n) {
let slideWidth = slides[0].clientWidth;
  if (n > slides.length) {
    slideIndex = 1;
  }    
  if (n < 1) {
    slideIndex = slides.length;
  }
  setTimeout(() => {

  }, 250)
  borrarse()
  setTimeout(() => document.querySelector('#carouselText').innerHTML = textCarousel[slideIndex-1], 250)
  
  slidesContainer.style.transform = `translateX(${-slideWidth * (slideIndex - 1)}px)`;
}

function borrarse() {
  document.querySelector('#carouselText').classList.add('borrouse')
  setTimeout(() => document.querySelector('#carouselText').classList.remove('borrouse'), 500)
}

function setFav(el){
  el.classList.toggle('fa-regular')
  el.classList.toggle('fa-solid')
  el.classList.toggle('item-fav-on')
}

// const options = {method: 'GET'};

// fetch('http://10.87.207.16:5000/arquivos/quadro-terroso-1681383833155.jpg', options)
//   .then(response => response.blob())
//   .then(response => {
//     var urlCreator = window.URL || window.webkitURL;
//     var imageUrl = urlCreator.createObjectURL(response);
//     let img = document.createElement('img')
//     img.src = imageUrl
//     document.body.appendChild(img)
//   })
//   .catch(err => console.error(err));


function hoverFav(index, el) {
  if (!el.classList.contains('cur-item-fav-on')) {
      if (index == 1) {
          el.classList.remove('fa-regular')
          el.classList.add('fa-solid')
      } else {
          el.classList.add('fa-regular')
          el.classList.remove('fa-solid')
      }
  }
  
}

function setCartFav(el){
  el.classList.remove('fa-regular')
  el.classList.add('fa-solid')
  el.classList.toggle('cur-item-fav-on')
}

function toggleCart() {
  document.querySelector('.cart-container').classList.toggle('escondido')
}