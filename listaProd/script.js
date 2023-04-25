var urlTag = new URLSearchParams(window.location.search).get('tag')
var curPage = new URLSearchParams(window.location.search).get('page') ? new URLSearchParams(window.location.search).get('page') : 1
var count
var minPrec
var maxPrec
var sortPrec
var desconto

OmRangeSlider.init({ 
  inputValueStyle: OmRangeSliderInputValueStyles.DEFAULT_COMMA_SEPARATED
});

carregarCategorias()

function carregar(){
  minPrec = document.querySelector('#inputPieces').value.split(',')[0]
  maxPrec = document.querySelector('#inputPieces').value.split(',')[1]
  sortPrec = document.querySelector('#selOrderBy').value
  desconto = document.querySelector('#cbDesc').checked
  carregarProdutos()
}

function getCount(count){
    document.querySelector('.paginacao').innerHTML = ""
    const pagenum = Math.ceil(count / 15)
    for (let i = 1; i <= pagenum; i++) {
      let li = document.createElement('li')  
      let span = document.createElement('span')
      span.innerHTML = i
      span.addEventListener('click', () => {
        curPage = i
        document.querySelector('.paginacao').querySelectorAll('li').forEach(s => s.classList.remove('cur-page'))
        carregarProdutos()
      })
      li.appendChild(span)
      document.querySelector('.paginacao').appendChild(li)
    }
}

function aplicarFiltros() {
  minPrec = document.querySelector('#inputPieces').value.split(',')[0]
  maxPrec = document.querySelector('#inputPieces').value.split(',')[1]
  sortPrec = document.querySelector('#selOrderBy').value
  desconto = document.querySelector('#cbDesc').checked
  curPage = 1
  carregarProdutos()
}

function carregarProdutos() {
  let model = document.querySelector('.prod-section').querySelector('.modelo').cloneNode(true)

  document.querySelector('.prod-section').innerHTML = ""

  document.querySelector('.prod-section').appendChild(model)

  fetch(`http://localhost:5000/produto/page/${curPage}?minPrec=${minPrec}&maxPrec=${maxPrec}&sortPrec=${sortPrec}&desconto=${desconto}&tag=${urlTag}`, {method: 'GET'})
    .then(response => response.json())
    .then(response => {
      console.log(response)
      getCount(response.count)
      response.produtos.forEach(async p => {
        console.log(p.nome, p.desconto)
        let card = document.querySelector('.prod-section').querySelector('.modelo').cloneNode(true)
        fetch('http://localhost:5000/arquivos/' + p.imagem, {method: 'GET'})
        .then(response => response.blob())
        .then(img => {  
          card.querySelector('img').src = montaImagem(img)
          card.querySelector('img').classList.add('loaded')
          card.querySelector('img').parentNode.classList.add('loaded')
        })
        .catch(err => {return "aiaiai"});
        
          card.classList.remove('modelo')
          
          card.querySelector('#prodNome').innerHTML = p.nome
          card.querySelector('#prodNome').addEventListener('click', () => {
            window.location.href = '../prod/index.html?idProd=' + p.id
          })
          card.querySelector('#prodDesc').innerHTML = p.descricao
          if (p.desconto > 0) {
            card.querySelector('#prodPrecoOr').innerHTML = 'R$ ' + Number(p.valor).toFixed(2).toString().replace('.', ',')
            card.querySelector('#prodPreco').innerHTML = 'R$ ' + (p.valor - (p.valor * (p.desconto / 100))).toFixed(2).toString().replace('.', ',')
            card.querySelector('#desconto').innerHTML = p.desconto + '%'
            card.querySelector('.desc-area').classList.remove('escondido')
          } else {
            card.querySelector('#prodPreco').innerHTML = 'R$ ' + Number(p.valor).toFixed(2).toString().replace('.', ',')
          }

          p.categorias.forEach(c => {
            let tag = document.createElement('span')
            tag.classList.add('tag')
            tag.innerHTML = c.categoria.nome
            tag.addEventListener('click', () => {
              window.location.href = '../listaProd/index.html?tag=' + c.categoria.nome.toLowerCase().replace(' ', '_')
            })
            tag.addEventListener('click', () => {
              console.log("a")
              let query = window.location.href.split('?')[1]
              let location = window.location.href.split('?')[0] + "?"
              query.split('&').forEach(q => {
                if (q.startsWith('tag')) {
                  q = "tag=" + c.nome.toLowerCase().replace(' ', '_')
                  location = location + q + "&"
                }
              })
              window.location.href = location
            })
            card.querySelector('.prod-tags').appendChild(tag)
          })
          document.querySelector('.prod-section').appendChild(card)
      })
      if (response.count !== 0) {
        document.querySelector('.no-products').classList.add('escondido')
        document.querySelector('.paginacao').querySelectorAll('li').item(curPage-1).classList.add('cur-page') 
      } else {
        document.querySelector('.no-products').classList.remove('escondido')
      }
    })
    .catch(err => console.error(err));
}

function carregarCategorias() {
  const options = {method: 'GET'};

  fetch('http://localhost:5000/categoria', options)
    .then(response => response.json())
    .then(response => {
      response.forEach(c => {
        let cat = document.querySelector('.categorias').querySelector('.modelo').cloneNode(true)
        cat.innerHTML = c.nome
        cat.classList.remove('modelo')
        cat.addEventListener('click', () => {
          let query = window.location.href.split('?')[1]
          let location = window.location.href.split('?')[0] + "?"
          if (query !== undefined) {
            query.split('&').forEach(q => {
              if (q.startsWith('tag')) {
                q = "tag=" + c.nome.toLowerCase().replace(' ', '_')
                location = location + q + "&"
              }
            })
          } else {
            location = location + "tag=" + c.nome.toLowerCase().replace(' ', '_')
          }
          
          window.location.href = location
        })
        document.querySelector('.categorias').appendChild(cat)
      })
    })
    .catch(err => console.error(err));
}

if (urlTag !== null) {
  document.querySelector('#mtTag').innerHTML = urlTag[0].toUpperCase() + urlTag.slice(1).replace('_', ' ')
} else {
  urlTag = "all"
  document.querySelector('.main-title').classList.add('escondido')
}

document.querySelector('.paginacao').querySelectorAll('a').forEach(a => {
  if (a.innerHTML == curPage) {
    a.parentElement.classList.add('cur-page')
  }
})

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

  function montaImagem(file) {
    var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(file);
      return imageUrl
  }