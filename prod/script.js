const idUrl = new URLSearchParams(window.location.search).get('idProd')
if (idUrl == null) {
  window.location.href = '../main/index.html'
}

var prod

fetch('http://localhost:5000/produto/' + idUrl, {method: 'GET'})
  .then(response => response.json())
  .then(response => prod = response)
  .catch(err => console.error(err));


function carregar() {
  carregarProduto()
}

function carregarProduto() {

  fetch('http://localhost:5000/arquivos/' + prod.imagem, {method: 'GET'})
    .then(response => response.blob())
    .then(response => {
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(response);
      document.querySelector('#curProdImage').src = imageUrl
      document.querySelector('#curProdImage').classList.add('loaded')
      document.querySelector('.prod-image').classList.add('loaded')
    })
    .catch(err => console.error(err));

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