const idUrl = new URLSearchParams(window.location.search).get('idProd')
if (idUrl == null) {
  window.location.href = '../main/index.html'
}

var prod

function carregar() {
  carregarCarrinho()
  carregarProduto()
}

async function carregarProduto() {
  await fetch('https://lamaison.glitch.me/produto/' + idUrl, {method: 'GET'})
  .then(response => response.json())
  .then(response => prod = response)
  .catch(err => console.error(err));
  
  if (prod === null) {
    window.location.href = "../../listaProd/index.html"
  } else {

    document.querySelector('.scan-zone').querySelector('img').src = `http://api.qrserver.com/v1/create-qr-code/?data=lmscan://lmscan?id=${prod.id}&size=500x500`
    document.querySelector('#curProdImage').src = "https://lamaisontest.blob.core.windows.net/arquivos/" + prod.imagem
    document.querySelector('#curProdImage').classList.add('loaded')
    document.querySelector('.prod-image').classList.add('loaded')

    document.querySelector('#prodNome').innerHTML = prod.nome
    document.querySelector('#prodDesc').innerHTML = prod.descricao

    document.title = prod.nome

    if (prod.desconto == 0) {
      document.querySelector('.prod-section').querySelector('#prodPrecoOr').classList.add('escondido')
    } else {
      document.querySelector('.prod-section').querySelector('#prodPrecoOr').innerHTML = 'R$ ' + Number(prod.valor).toFixed(2).toString().replace('.', ',')
    }

    document.querySelector('.prod-section').querySelector('#prodPreco').innerHTML = 'R$ ' + (prod.valor - (prod.valor * (prod.desconto / 100))).toFixed(2).toString().replace('.', ',')

    const medidas = prod.medidas.split('x')

    document.querySelector('#curX').innerHTML = medidas[0] + ' cm'
    document.querySelector('#curY').innerHTML = medidas[1] + ' cm'
    document.querySelector('#curZ').innerHTML = medidas[2] + ' cm'

    prod.categorias.forEach(c => {
      let tag = document.createElement('span')
      tag.classList.add('tag')
      tag.innerHTML = c.categoria.nome
      tag.addEventListener('click', () => {
        window.location.href = '../listaProd/index.html?tag=' + c.categoria.nome.toLowerCase().replace(' ', '_')
      })
      document.querySelector('.prod-tags').appendChild(tag)
    })
  }
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
    model.querySelector('img').src = "https://lamaisontest.blob.core.windows.net/arquivos/" + p.imagem
    model.querySelector('img').classList.add('loaded')
    model.querySelector('img').parentNode.classList.add('loaded')
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