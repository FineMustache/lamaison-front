const inpEmail = document.querySelector('#inpEmail')
const inpSenha = document.querySelector('#inpSenha')

inpEmail.addEventListener('keyup', validateInputs)

inpSenha.addEventListener('keyup', validateInputs)

function validateInputs() {
    let em = false
    let sen = false

    if (!inpEmail.value.toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )) {
        em = false
        inpEmail.classList.add('invalid')
    } else {
        em = true
        inpEmail.classList.remove('invalid')
    }

    if (inpSenha.value.length === 0) {
        sen = false
    } else {
        sen = true
    }

    if (em && sen) {
        document.querySelector('button').disabled = false
    }else{
        document.querySelector('button').disabled = true
    }

}

function showPw(el) {
    el.classList.toggle('fa-eye');
    el.classList.toggle('fa-eye-slash')

    if (document.querySelector('#inpSenha').getAttribute('type') === "password") {
        document.querySelector('#inpSenha').setAttribute('type', 'text')
    }else{
        document.querySelector('#inpSenha').setAttribute('type', 'password')
    }
}

function login() {
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: inpEmail.value,
            senha: inpSenha.value
        })
      };
      
      fetch('https://lamaison.glitch.me/usuarioLogin', options)
        .then(response => response.json())
        .then(response => {
            if (response.validacao) {
                window.localStorage.setItem('lm_u', JSON.stringify(response))
                window.location.href = "../main/index.html"
            } else {
                document.querySelector('#error').innerHTML = response.erro
                document.querySelector('.error-message').classList.remove('h0')
            }
        })
        .catch(err => console.error(err));
}