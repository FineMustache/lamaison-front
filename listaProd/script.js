const urlTag = new URLSearchParams(window.location.search).get('tag')

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

  function carregar() {
    document.querySelector('#mtTag').innerHTML = urlTag
  }