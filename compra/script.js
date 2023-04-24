// const idUrl = new URLSearchParams(window.location.search).get('idProd')
// if (idUrl == null) {
//   window.location.href = '../main/index.html'
// }

function copy(i) {
  var copyText = document.getElementById("copy");

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

   // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);

  i.setAttribute('class', 'fa-solid fa-check')
  setTimeout(() => {
    i.setAttribute('class', 'fa-sharp fa-regular fa-copy')
  }, 3000)

  copyText.setSelectionRange(0,0)
}


function carregar() {
  carregarProduto()
}

function carregarProduto() {

}

function setCurFav(el){
    el.classList.remove('fa-regular')
    el.classList.add('fa-solid')
    el.classList.toggle('cur-item-fav-on')
  }

  function setFav(el){
    el.classList.toggle('fa-regular')
    el.classList.toggle('fa-solid')
    el.classList.toggle('item-fav-on')
  }

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

function toggleModal(){
    document.querySelector('.modal').classList.toggle('escondido')
    if (!document.querySelector('.modal').classList.contains('escondido')) {
      document.body.style.overflow = 'hidden' 
    } else {
      document.body.style.overflow = 'auto'
    }
}