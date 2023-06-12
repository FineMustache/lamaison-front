var desejo = []

async function carregarDesejos() {
  desejo = await fetch("https://lamaison.glitch.me/desejo/" + user.userid, {
    "method": "GET"
  }).then(response => response.json()).then(response => {
    return response}
    )

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
  el.classList.toggle('fa-regular')
  el.classList.toggle('fa-solid')
}

function toggleUser() {
  document.querySelector('.user-container').classList.toggle('escondido')
}

async function carregar() {
  await carregarDesejos()
  carregarUsuario()
  carregarPedidos()
}

function carregarPedidos() {
  const options = {method: 'GET'};
  fetch('https://lamaison.glitch.me/compra/' + user.userid, options)
    .then(response => response.json())
    .then(response => {
      response.forEach(ped => {
        let modelPed = document.querySelector('.pedido').cloneNode(true)
        modelPed.classList.remove('escondido')
        modelPed.querySelector('#idPed').innerHTML = ped.id
        console.log(ped)
        ped.produtos.forEach(pc => {
          let p = pc.produto
          let modelProd = modelPed.querySelector('.pedido-prod').cloneNode(true)
          modelProd.querySelector('img').src = "https://lamaisontest.blob.core.windows.net/arquivos/" + p.imagem
          modelProd.querySelector('#prodQtde').innerHTML = "X " + pc.qtde
          modelProd.querySelector('#prodPreco').innerHTML = "R$ " + (p.valor - p.valor * p.desconto / 100).toFixed(2).replace('.', ',')
          modelProd.classList.remove('escondido')
          modelPed.querySelector('.prod-wrap').appendChild(modelProd)
          
        })
        modelPed.querySelector('#pedStatus').innerHTML = ped.pago ? "Pago" : "Aguardando"
        modelPed.querySelector('#pedPreco').innerHTML = "R$ " + ped.valor.toFixed(2).replace('.',',')
        document.querySelector('.pedidos').appendChild(modelPed)
      })

      if (response.length < 1) {
        document.querySelector('.no-products').classList.remove('escondido')
      } else {
        document.querySelector('.no-products').classList.add('escondido')
      }
    })
    .catch(err => console.error(err));
}

function carregarUsuario() {
  document.querySelector('#uname').innerHTML = user.nome
  document.querySelector('#uemail').innerHTML = user.email
}

function carregarProdutos() {
    let model = document.querySelector('.modelo').cloneNode(true)
    document.querySelector('.prod-section').innerHTML = ""
    document.querySelector('.prod-section').appendChild(model)
  fetch("https://lamaison.glitch.me/desejo/" + user.userid, {
    "method": "GET"
  })
    .then(response => response.json())
    .then(response => {
      response.forEach(d => {
        const p = d.produto
        let card = document.querySelector('.modelo').cloneNode(true)
        card.querySelector('#itemFav').addEventListener('click', () => {
            const options = {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: `{"id":${d.id}}`
              };
              
              fetch('https://lamaison.glitch.me/desejo', options)
                .then(response => response.json())
                .then(async response => {
                    await carregarDesejos()
                    carregarProdutos()
                    if(isInCart(p.id)) setCartFav(document.querySelector('.citem' + p.id).querySelector('#ciItemFav'))
                })
                .catch(err => console.error(err));
        })
        card.querySelector('#prodNome').innerHTML = p.nome
        card.querySelector('#prodNome').addEventListener('click', () => {
          window.location.href = "../prod/index.html?idProd=" + p.id
        })
        card.querySelector('#prodDesc').innerHTML = p.descricao
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
        if (p.desconto > 0) {
          card.querySelector('.desc-area').classList.remove('escondido')
        }
        card.querySelector('#prodPrecoOr').innerHTML = 'R$ ' + Number(p.valor).toFixed(2).toString().replace('.', ',')
        card.querySelector('#prodPreco').innerHTML = 'R$ ' + (p.valor - (p.valor * (p.desconto / 100))).toFixed(2).toString().replace('.', ',')
        card.querySelector('#desconto').innerHTML = p.desconto + '%'
        card.querySelector('.btn-add-cart').addEventListener('click', () => cartAddItem(p))
        card.querySelector('img').src = "https://lamaisontest.blob.core.windows.net/arquivos/" + p.imagem
        card.querySelector('img').classList.add('loaded')
        card.querySelector('img').parentNode.classList.add('loaded')
        card.classList.remove('modelo')
        document.querySelector('.prod-section').appendChild(card)
      });
    })
    .catch(err => {
      console.error(err);
    });
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

function sair() {
  window.localStorage.removeItem('lm_u')
  window.location.reload()
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
        carregarProdutos()
      })
      .catch(err => {
        console.error(err)
        if(isInCart(pid)) setCartFav(document.querySelector('.citem' + pid).querySelector('#ciItemFav'))
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
          carregarProdutos()
        } else {
          if(isInCart(pid)) setCartFav(document.querySelector('.citem' + pid).querySelector('#ciItemFav'))
        }
      })
      .catch(err => {
        console.error(err)
        if(isInCart(pid)) setCartFav(document.querySelector('.citem' + pid).querySelector('#ciItemFav'))
      });
  }
  
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