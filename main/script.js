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
  setTimeout(() => document.querySelector('#carouselText').innerHTML = textCarousel[slideIndex - 1], 250)

  slidesContainer.style.transform = `translateX(${-slideWidth * (slideIndex - 1)}px)`;
}

function borrarse() {
  document.querySelector('#carouselText').classList.add('borrouse')
  setTimeout(() => document.querySelector('#carouselText').classList.remove('borrouse'), 500)
}

function setFav(el) {
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

function setCartFav(el) {
  el.classList.remove('fa-regular')
  el.classList.add('fa-solid')
  el.classList.toggle('cur-item-fav-on')
}

function toggleCart() {
  document.querySelector('.cart-container').classList.toggle('escondido')
}

function carregar() {
  carregarCarrinho()
  carregarProdutos()
}

function carregarProdutos() {

  fetch("http://10.87.207.16:5000/produto/destaques", {
    "method": "GET"
  })
    .then(response => response.json())
    .then(response => {
      response.forEach(p => {
        let card = document.querySelector('.model-hl').cloneNode(true)
        card.querySelector('#prodNome').innerHTML = p.nome
        card.querySelector('#prodNome').addEventListener('click', () => {
          window.location.href = "../prod/index.html?idProd=" + p.id
        })
        card.querySelector('#prodDesc').innerHTML = p.descricao
        console.log(p)
        card.querySelector('.prod-tags').innerHTML = ""
        p.categorias.forEach(c => {
          let span = document.createElement('span')
          span.classList.add('tag')
          span.innerHTML = c.categoria.nome
          span.addEventListener('click', () => {
            window.location.href = "../listaProd/index.html?tag=" + (c.categoria.nome)
          })
          card.querySelector('.prod-tags').appendChild(span)
        })
        card.querySelector('#prodPrecoOr').innerHTML = 'R$ ' + Number(p.valor).toFixed(2).toString().replace('.', ',')
        card.querySelector('#prodPreco').innerHTML = 'R$ ' + (p.valor - (p.valor * (p.desconto / 100))).toFixed(2).toString().replace('.', ',')
        card.querySelector('#desconto').innerHTML = p.desconto + '%'
        fetch('http://10.87.207.16:5000/arquivos/' + p.imagem, {method: 'GET'})
        .then(response => response.blob())
        .then(img => {  
          card.querySelector('img').src = montaImagem(img)
          card.querySelector('img').classList.add('loaded')
          card.querySelector('img').parentNode.classList.add('loaded')
        })
        .catch(err => {return "aiaiai"});
        card.classList.remove('escondido')
        document.querySelector('.section-items').appendChild(card)
      });
    })
    .catch(err => {
      console.error(err);
    });
}

function carregarCarrinho() {
  var cart = getCart()
  if (cart.produtos.length !== 0) {
    document.querySelector('.cart-length').classList.remove('escondido')
    document.querySelector('.cart-total').classList.remove('escondido')
    document.querySelector('.btn-finalizar').classList.remove('escondido')
    document.querySelector('.empty').classList.add('escondido')
    document.querySelector('.cart-length').querySelector('span').innerHTML = cart.produtos.length
  }

  cart.produtos.forEach(p => {
    let model = document.querySelector('.modelo-cart').cloneNode(true)
    fetch('http://10.87.207.16:5000/arquivos/' + p.imagem, {method: 'GET'})
        .then(response => response.blob())
        .then(img => {  
          model.querySelector('img').src = montaImagem(img)
          model.querySelector('img').classList.add('loaded')
          model.querySelector('img').parentNode.classList.add('loaded')
        })
        .catch(err => console.log(err));
  })
}

function montaImagem(file) {
  var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(file);
    return imageUrl
}

function getCart() {
  let cart = JSON.parse(window.localStorage.getItem('lm_cart'))

  if (cart == null) {
    cart = {
      produtos: []
    }
  }

  console.log(JSON.stringify({
    produtos: ['a', 'b', 'c']
  }))
  return cart
}