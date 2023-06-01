// const idUrl = new URLSearchParams(window.location.search).get('idProd')
// if (idUrl == null) {
//   window.location.href = '../main/index.html'
// }
console.log(user)
var prodSoma

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
  carregarProdutos(); // Certifique-se de definir essa função corretamente
}


function carregarProdutos() {
  var cart = getCart()

  if (cart.produtos.length < 1) {
    window.location.href = "../../main/index.html"
  }

  let modelReset = document.querySelector('.modelo-cart').cloneNode(true)
  document.querySelector('.card-left').innerHTML = ""
  document.querySelector('.card-left').appendChild(modelReset)
  calcTotal()
  cart.produtos.forEach(p => {
    let model = document.querySelector('.modelo-cart').cloneNode(true)
    model.querySelector('img').src = "https://lamaisontest.blob.core.windows.net/arquivos/" + p.imagem
    model.querySelector('img').classList.add('loaded')
    model.querySelector('img').parentNode.classList.add('loaded')
    model.querySelector('#ciNome').innerHTML = p.nome
    model.querySelector('#ciPreco').innerHTML = 'R$ ' + (p.valor - (p.valor * (p.desconto / 100))).toFixed(2).toString().replace('.', ',')
    model.querySelector('#ciQtde').querySelector('span').innerHTML = p.qtde
    model.querySelector('#ciQtdeMin').addEventListener('click', () => cartSub(p.id))
    model.querySelector('#ciQtdePlus').addEventListener('click', () => cartPlus(p.id))
    model.querySelector('.fa-trash').addEventListener('click', () => cartRemoveItem(p.id))
    model.querySelector('#ciNome').addEventListener('click', () => location.href = '../prod/index.html?idProd=' + p.id)
    model.id = "citem" + p.id

    model.classList.remove('escondido')
    document.querySelector('.card-left').appendChild(model)
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

function toggleModal(){
    document.querySelector('.modal').classList.toggle('escondido')
    if (!document.querySelector('.modal').classList.contains('escondido')) {
      document.body.style.overflow = 'hidden' 
    } else {
      document.body.style.overflow = 'auto'
    }
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

function calcTotal() {
  let cart = getCart()
  prodSoma = 0
  cart.produtos.forEach(p => prodSoma += parseFloat(p.valor - (p.valor * (p.desconto / 100)).toFixed(2)) * p.qtde)
  document.querySelector('#precTotal').innerHTML = "R$ " + prodSoma.toFixed(2).replace('.', ',')
}

function cartRemoveItem(id) {
  let curCart = getCart()
  const indexProduto = curCart.produtos.findIndex((produto) => produto.id === id);
  curCart.produtos.splice(indexProduto, 1)

  window.localStorage.setItem('lm_cart', JSON.stringify(curCart))
  carregarProdutos()
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

function pagamento() {
  paypal.Buttons({
    createOrder: async function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: "1.00"
          }
        }]
      });
    },
    onApprove: async function(data, actions) {
      fetch("https://lamaison.glitch.me/compra", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...getCart(), user, "id_usuario": user.userid})
      }).then(function(res) {
        return res.json();
      }).then(function(data) {
        window.localStorage.removeItem('lm_cart')
        window.location.href = "../../pedidos/index.html"
      }).catch(err => console.error(err));
      
      
    },
    onError: function(err) {
      // Ocorreu um erro
      // Exiba ou manipule o erro adequadamente
      console.error(err);
    }
  }).render('#paypal-button-container');
}