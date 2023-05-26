const inpCPF = document.getElementById('inpCPF');
const inpCEP = document.getElementById('inpCEP');
const inpRua = document.getElementById('inpRua');
const inpNum = document.getElementById('inpNum');
const inpBairro = document.getElementById('inpBairro');
const inpCidade = document.getElementById('inpCidade');
const inpEstado = document.getElementById('inpEstado');
const inpComp = document.getElementById('inpComp');
const inpTel = document.getElementById('inpTel');
const inpNome = document.getElementById('inpNome');
const inpEmail = document.getElementById('inpEmail')
const inpSenha = document.getElementById('inpSenha')
const inpRepSenha = document.getElementById('inpRepSenha')
const dialog = document.querySelector('.dialog')
document.querySelectorAll('input').forEach(i => i.addEventListener('keyup', checkInputs))
var em = false

inpEmail.addEventListener('input', () => {
  if (!inpEmail.value.toLowerCase().match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )) {
    em = false
    inpEmail.classList.add('invalid')
} else {
    em = true
    inpEmail.classList.remove('invalid')
}
})

var cepOn = false
var samePw = false
var cpfValid = false
var pwValid = false

inpSenha.addEventListener('focus', () => dialog.classList.remove('escondido'))
inpSenha.addEventListener('blur', () => dialog.classList.add('escondido'))
inpSenha.addEventListener('input', validarSenha)

  inpTel.addEventListener('input', () => {
    let telefone = inpTel.value;

    // Remove tudo exceto números
    telefone = telefone.replace(/\D/g, '');

    // Insere os parênteses e o hífen
    telefone = telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');

    // Atualiza o valor do input
    inpTel.value = telefone;
  });

  inpCPF.addEventListener('input', () => {
    let cpf = inpCPF.value;

    // Remove tudo exceto números
    cpf = cpf.replace(/\D/g, '');

    // Insere os pontos e traço
    cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');

    // Atualiza o valor do input
    inpCPF.value = cpf;

    if(validarCPF(cpf)){
        inpCPF.classList.remove('invalid')
        cpfValid = true
    } else {
        inpCPF.classList.add('invalid')
        cpfValid = false
    }
  });

  

  inpCEP.addEventListener('input', () => {
    let cep = inpCEP.value;

    // Remove tudo exceto números
    cep = cep.replace(/\D/g, '');

    // Insere o hífen
    cep = cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');

    // Atualiza o valor do input
    inpCEP.value = cep;

    validaCEP(cep)
  });

function showPw(el) {
    el.classList.toggle('fa-eye');
    el.classList.toggle('fa-eye-slash')
    
    let inp = el.parentNode.querySelector('input')

    if (inp.getAttribute('type') === "password") {
        inp.setAttribute('type', 'text')
    }else{
        inp.setAttribute('type', 'password')
    }
}

function validarCPF(cpf) {
    // Remove tudo exceto números
    cpf = cpf.replace(/\D/g, '');
  
    // Verifica se há 11 dígitos
    if (cpf.length !== 11) {
      return false;
    }
  
    // Verifica se todos os dígitos são iguais (número inválido, mas pode passar na validação)
    const primeiroDigito = cpf.charAt(0);
    if (cpf.split('').every(digito => digito === primeiroDigito)) {
      return false;
    }
  
    // Verifica o primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let digitoVerificador = resto < 2 ? 0 : 11 - resto;
    if (digitoVerificador !== parseInt(cpf.charAt(9))) {
      return false;
    }
  
    // Verifica o segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    digitoVerificador = resto < 2 ? 0 : 11 - resto;
    if (digitoVerificador !== parseInt(cpf.charAt(10))) {
      return false;
    }
  
    // Se chegou até aqui, é um CPF válido
    return true;
  }

  function validaCEP(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(response => {
            if (!response.erro) {
                inpRua.value = response.logradouro
                inpComp.value = response.complemento
                inpBairro.value = response.bairro
                inpCidade.value = response.localidade
                inpEstado.value = response.uf
                inpRua.disabled = response.logradouro ? true : false
                inpComp.disabled = response.complemento ? true : false
                inpBairro.disabled = response.bairro ? true : false
                inpCidade.disabled = response.localidade ? true : false
                inpEstado.disabled = response.uf ? true : false
                inpNum.disabled = false
            } else {
                inpRua.value = ""
                inpComp.value = ""
                inpBairro.value = ""
                inpCidade.value = ""
                inpEstado.value = ""
            }
            inpNum.value = ""
            
        })
        .catch(err => console.error(err))
    }
    
  }

  function checkInputs(a) {
    var allTyped = false
    if (a.target.id == "inpSenha" || a.target.id == "inpRepSenha") {
      if (inpSenha.value === inpRepSenha.value) {
        inpRepSenha.classList.remove('invalid')
        samePw = true
      } else {
        inpRepSenha.classList.add('invalid')
        samePw = false
      }
    }
    if (
      inpBairro.value.length > 0 &&
      inpCidade.value.length > 0 &&
      inpRua.value.length > 0 &&
      inpEstado.value.length > 0 &&
      inpCEP.value.length > 0 &&
      inpNum.value.length > 0 &&
      inpNome.value.length > 0 &&
      inpEmail.value.length > 0 &&
      inpSenha.value.length > 0 &&
      inpRepSenha.value.length > 0 &&
      inpCPF.value.length > 0
      ) {
      allTyped = true
    } else {
      allTyped = false
    }
    document.querySelector('button').disabled = !(allTyped && samePw && em && cpfValid && pwValid)
  }

  

  function validarSenha() {
    const val = inpSenha.value
    var test = []
    test.push(/\d/.test(val))
    test.push(/[A-Z]/.test(val))
    test.push(/[a-z]/.test(val))
    test.push(/[!@#$%^&*(),.?":{}|<>]/g.test(val))
    test.push(val.length >= 8)

    console.log(val)

    dialog.querySelectorAll('p').forEach((p, index) => {
      if (index !== 0) {
        p.setAttribute('data-ok', test[index - 1])
      }
    })

    if (test[0] && test[1] && test[2] && test[3] && test[4]) {
      inpSenha.classList.remove('invalid')
      pwValid = true
    }else{
      inpSenha.classList.add('invalid')
      pwValid = false
    }

  }

  function cadastrar() {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        nome: inpNome.value,
        email: inpEmail.value,
        cpf: inpCPF.value.replace(/\D/g, ''),
        senha: inpSenha.value,
        rua: inpRua.value,
        numero: inpRua.value,
        complemento: inpComp.value == "" ? null : inpComp.value,
        bairro: inpBairro.value,
        cep: inpCEP.value.replace(/\D/g, ''),
        cidade: inpCidade.value,
        estado: inpEstado.value,
        telefone: inpTel.value.replace(/\D/g, '') == "" ? null : inpTel.value.replace(/\D/g, '')
      })
    };
    
    fetch('https://lamaison.glitch.me/usuario', options)
      .then(response => response.json())
      .then(response => {
        document.querySelector('.cad-card').classList.add('escondido')
        document.querySelector('.sucesso').classList.remove('escondido')
        console.log(response)
      })
      .catch(err => console.error(err));
  }