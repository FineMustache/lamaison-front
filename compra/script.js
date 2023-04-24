// const idUrl = new URLSearchParams(window.location.search).get('idProd')
// if (idUrl == null) {
//   window.location.href = '../main/index.html'
// }

var prod

fetch('http://10.87.207.16:5000/produto/' + idUrl, {method: 'GET'})
  .then(response => response.json())
  .then(response => prod = response)
  .catch(err => console.error(err));


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
    document.body.style.overflow = 'hidden'
}