const urlTag = new URLSearchParams(window.location.search).get('tag')
const curPage = new URLSearchParams(window.location.search).get('page') ? new URLSearchParams(window.location.search).get('page') : 1

OmRangeSlider.init({ 
  inputValueStyle: OmRangeSliderInputValueStyles.DEFAULT_COMMA_SEPARATED
});

carregarCategorias()

function carregar(){
  carregarProdutos()
}

function carregarProdutos() {
  const minPrec = document.querySelector('#inputPieces').value.split(',')[0]
  const maxPrec = document.querySelector('#inputPieces').value.split(',')[1]
  const sortPrec = document.querySelector('#selOrderBy').value
  const desconto = document.querySelector('#cbDesc').checked

  let model = document.querySelector('.prod-section').querySelector('.modelo').cloneNode(true)

  document.querySelector('.prod-section').innerHTML = ""

  document.querySelector('.prod-section').appendChild(model)

  fetch(`http://localhost:5000/produto/page/${curPage}?minPrec=${minPrec}&maxPrec=${maxPrec}&sortPrec=${sortPrec}&desconto=${desconto}`, {method: 'GET'})
    .then(response => response.json())
    .then(response => {
      console.log(response.length)
      response.forEach(async p => {
        console.log(p.nome, p.desconto)
        await fetch('http://localhost:5000/arquivos/' + p.imagem, {method: 'GET'})
        .then(response => response.blob())
        .then(img => {
          let card = document.querySelector('.prod-section').querySelector('.modelo').cloneNode(true)
          card.classList.remove('modelo')
          card.querySelector('img').src = montaImagem(img)
          card.querySelector('#prodNome').innerHTML = p.nome
          card.querySelector('#prodDesc').innerHTML = p.descricao
          if (p.desconto > 0) {
            card.querySelector('#prodPrecoOr').innerHTML = 'R$ ' + Number(p.valor).toFixed(2).toString().replace('.', ',')
            card.querySelector('#prodPreco').innerHTML = 'R$ ' + (p.valor - (p.valor * (p.desconto / 100))).toFixed(2).toString().replace('.', ',')
            card.querySelector('#prodPrecoOr').classList.remove('escondido')
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
            card.querySelector('.prod-tags').appendChild(tag)
          })
          document.querySelector('.prod-section').appendChild(card)
        })
        .catch(err => {return "aiaiai"});
        
      })
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
        document.querySelector('.categorias').appendChild(cat)
      })
    })
    .catch(err => console.error(err));
}

if (urlTag !== null) {
  document.querySelector('#mtTag').innerHTML = urlTag 
} else {
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