var desejo = []
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

function toggleUser() {
  document.querySelector('.user-container').classList.toggle('escondido')
  document.querySelector('.cart-container').classList.add('escondido')
}

async function carregar(){
  minPrec = document.querySelector('#inputPieces').value.split(',')[0]
  maxPrec = document.querySelector('#inputPieces').value.split(',')[1]
  sortPrec = document.querySelector('#selOrderBy').value
  desconto = document.querySelector('#cbDesc').checked
  await carregarDesejos()
  carregarProdutos()
  carregarCarrinho()
  carregarUsuario()
}

function carregarUsuario() {
  document.querySelector('#uname').innerHTML = user.nome
  document.querySelector('#uemail').innerHTML = user.email
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

  fetch(`https://lamaison.glitch.me/produto/page/${curPage}?minPrec=${minPrec}&maxPrec=${maxPrec}&sortPrec=${sortPrec}&desconto=${desconto}&tag=${urlTag}`, {method: 'GET'})
    .then(response => response.json())
    .then(response => {
      console.log(response)
      getCount(response.count)
      response.produtos.forEach(async p => {
        console.log(p.nome, p.desconto)
        let card = document.querySelector('.prod-section').querySelector('.modelo').cloneNode(true)
        
        card.querySelector('img').src = "https://lamaisontest.blob.core.windows.net/arquivos/" + p.imagem
        card.querySelector('img').classList.add('loaded')
        card.querySelector('img').parentNode.classList.add('loaded')
        
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
          desejo.forEach(d => {
            if (d.id_produto === p.id) {
              setFav(card.querySelector('#itemFav'))
            }
          })
          card.querySelector('#itemFav').addEventListener('click', () => {
            if(isInCart(p.id)) setCartFav(document.querySelector('.citem' + p.id).querySelector('#ciItemFav'))
            setFav(document.querySelector('.p' + p.id).querySelector('#itemFav'))
            addFav(p.id, card.querySelector('#itemFav'))
          })
          card.querySelector('.btn-add-cart').addEventListener('click', () => cartAddItem(p))
          card.classList.add('p' + p.id)
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

  fetch('https://lamaison.glitch.me/categoria', options)
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
  
  function toggleCart() {
    document.querySelector('.cart-container').classList.toggle('escondido')
    document.querySelector('.user-container').classList.add('escondido')
  }
  
  function toggleUser() {
    document.querySelector('.user-container').classList.toggle('escondido')
    document.querySelector('.cart-container').classList.add('escondido')
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
      if (p.desconto > 0) {
        model.querySelector('#ciPrecoOr').classList.remove('escondido')
      }
      model.querySelector('#ciQtde').querySelector('span').innerHTML = p.qtde
      model.querySelector('#ciQtdeMin').addEventListener('click', () => cartSub(p.id))
      model.querySelector('#ciQtdePlus').addEventListener('click', () => cartPlus(p.id))
      model.querySelector('.fa-trash').addEventListener('click', () => cartRemoveItem(p.id))
      model.querySelector('#ciNome').addEventListener('click', () => location.href = '../prod/index.html?idProd=' + p.id)
      model.classList.add("citem" + p.id)
      desejo.forEach(d => {
        if (d.id_produto === p.id) {
          setCartFav(model.querySelector('#ciItemFav'))
        }
      })
      model.querySelector('#ciItemFav').addEventListener('click', () => {
        setCartFav(document.querySelector('.citem' + p.id).querySelector('#ciItemFav'))
        setFav(document.querySelector('.p' + p.id).querySelector('#itemFav'))
        addFav(p.id, model.querySelector('#ciItemFav'))
      })
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
      document.querySelector('.citem' + id).querySelector('#ciQtde').querySelector('span').innerHTML = curCart.produtos[indexProduto].qtde
    }
  
    window.localStorage.setItem('lm_cart', JSON.stringify(curCart))
    calcTotal()
  }
  
  function cartPlus(id) {
    let curCart = getCart()
    const indexProduto = curCart.produtos.findIndex((produto) => produto.id === id);
    if (curCart.produtos[indexProduto].qtde < 10) {
      curCart.produtos[indexProduto].qtde ++
      document.querySelector('.citem' + id).querySelector('#ciQtde').querySelector('span').innerHTML = curCart.produtos[indexProduto].qtde
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

async function carregarDesejos() {
  desejo = await fetch("https://lamaison.glitch.me/desejo/" + user.userid, {
    "method": "GET"
  }).then(response => response.json()).then(response => {
    return response}
    )

}

function addFav(pid) {
  let fav = -1
  desejo.forEach(d => {
    if (d.id_produto === pid) {
      fav = d.id
    }
  })

  if (fav !== -1) {
    const options = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: `{"id":${fav}}`
    };
    
    fetch('https://lamaison.glitch.me/desejo', options)
      .then(response => response.json())
      .then(async response => {
        await carregarDesejos()
      })
      .catch(err => {
        console.error(err)
        if(isInCart(pid)) setCartFav(document.querySelector('.citem' + pid).querySelector('#ciItemFav'))
        setFav(document.querySelector('.p' + pid).querySelector('#itemFav'))
      });
  } else {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: `{"id_usuario":${user.userid},"id_produto":${pid}}`
    };
    
    fetch('https://lamaison.glitch.me/desejo', options)
      .then(response => response.json())
      .then(async response => {
        if (response.count) {
          await carregarDesejos()
        } else {
          if(isInCart(pid)) setCartFav(document.querySelector('.citem' + pid).querySelector('#ciItemFav'))
          setFav(document.querySelector('.p' + pid).querySelector('#itemFav'))
        }
      })
      .catch(err => {
        console.error(err)
        if(isInCart(pid)) setCartFav(document.querySelector('.citem' + pid).querySelector('#ciItemFav'))
        setFav(document.querySelector('.p' + pid).querySelector('#itemFav'))
      });
  }
  
}

  function setCartFav(el) {
    el.classList.toggle('fa-regular')
    el.classList.toggle('fa-solid')
    el.classList.toggle('cur-item-fav-on')
  }

  function isInCart(pid) {
    var cart = getCart().produtos
    let tem = false
    cart.forEach(p => {
      if (pid == p.id) {
        tem = true
      }
    })
  
    return tem
  }