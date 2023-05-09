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

  fetch("http://localhost:5000/produto/destaques", {
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
        card.querySelector('.btn-add-cart').addEventListener('click', () => cartAddItem(p))
        fetch('http://localhost:5000/arquivos/' + p.imagem, {method: 'GET'})
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
  } else {
    document.querySelector('.cart-length').classList.add('escondido')
    document.querySelector('.cart-total').classList.add('escondido')
    document.querySelector('.btn-finalizar').classList.add('escondido')
    document.querySelector('.empty').classList.remove('escondido')
  }
  
  let modelReset = document.querySelector('.modelo-cart').cloneNode(true)
  document.querySelector('.cart-items').innerHTML = ""
  document.querySelector('.cart-items').appendChild(modelReset)
  calcTotal()
  cart.produtos.forEach(p => {
    let model = document.querySelector('.modelo-cart').cloneNode(true)
    fetch('http://localhost:5000/arquivos/' + p.imagem, {method: 'GET'})
        .then(response => response.blob())
        .then(img => {  
          model.querySelector('img').src = montaImagem(img)
          model.querySelector('img').classList.add('loaded')
          model.querySelector('img').parentNode.classList.add('loaded')
        })
        .catch(err => console.log(err));
    model.querySelector('#ciNome').innerHTML = p.nome
    model.querySelector('#ciPrecoOr').innerHTML = 'R$ ' + Number(p.valor).toFixed(2).toString().replace('.', ',')
    model.querySelector('#ciPreco').innerHTML = 'R$ ' + (p.valor - (p.valor * (p.desconto / 100))).toFixed(2).toString().replace('.', ',')
    if(p.desconto > 0){
      model.querySelector('#ciPrecoOr').classList.remove('escondido')
    }
    model.querySelector('#ciQtde').querySelector('span').innerHTML = p.qtde
    model.querySelector('#ciQtdeMin').addEventListener('click', () => cartSub(p.id))
    model.querySelector('#ciQtdePlus').addEventListener('click', () => cartPlus(p.id))
    model.querySelector('.fa-trash').addEventListener('click', () => cartRemoveItem(p.id))
    model.querySelector('#ciNome').addEventListener('click', () => location.href = '../prod/index.html?idProd=' + p.id)
    model.id = "citem" + p.id
    model.classList.remove('escondido')
    document.querySelector('.cart-items').appendChild(model)
  })

}

function getCart() {
  let cart = JSON.parse(window.localStorage.getItem('lm_cart'))

  if (cart == null) {
    cart = {
      produtos: []
    }
  }
  return cart
}

function cartAddItem(item) {
  let curCart = getCart()
  const indexProduto = curCart.produtos.findIndex((produto) => produto.id === item.id);
  if (indexProduto === -1) {
    item.qtde = 1
    curCart.produtos.push(item)
  } else {
    curCart.produtos[indexProduto].qtde ++
  }

  window.localStorage.setItem('lm_cart', JSON.stringify(curCart))
  carregarCarrinho()
}

function cartRemoveItem(id) {
  let curCart = getCart()
  const indexProduto = curCart.produtos.findIndex((produto) => produto.id === id);
  curCart.produtos.splice(indexProduto, 1)

  window.localStorage.setItem('lm_cart', JSON.stringify(curCart))
  carregarCarrinho()
}

function cartSub(id) {
  let curCart = getCart()
  const indexProduto = curCart.produtos.findIndex((produto) => produto.id === id);
  if (curCart.produtos[indexProduto].qtde > 1) {
    curCart.produtos[indexProduto].qtde -- 
    document.querySelector('#citem' + id).querySelector('#ciQtde').querySelector('span').innerHTML = curCart.produtos[indexProduto].qtde
  }

  window.localStorage.setItem('lm_cart', JSON.stringify(curCart))
  calcTotal()
}

function cartPlus(id) {
  let curCart = getCart()
  const indexProduto = curCart.produtos.findIndex((produto) => produto.id === id);
  if (curCart.produtos[indexProduto].qtde < 10) {
    curCart.produtos[indexProduto].qtde ++
    document.querySelector('#citem' + id).querySelector('#ciQtde').querySelector('span').innerHTML = curCart.produtos[indexProduto].qtde
  }

  window.localStorage.setItem('lm_cart', JSON.stringify(curCart))
  calcTotal()
}

function calcTotal() {
  let cart = getCart()
  var prodSoma = 0
  cart.produtos.forEach(p => prodSoma += parseFloat(p.valor - (p.valor * (p.desconto / 100)).toFixed(2)) * p.qtde)
  document.querySelector('#cartTotal').innerHTML = prodSoma.toFixed(2).replace('.', ',')
}

function montaImagem(file) {
  var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(file);
    return imageUrl
}