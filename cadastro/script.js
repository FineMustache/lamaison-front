const inpCPF = document.getElementById('inpCPF');
const inpCEP = document.getElementById('inpCEP');
const inpRua = document.getElementById('inpRua');
const inpNum = document.getElementById('inpNum');
const inpBairro = document.getElementById('inpBairro');
const inpCidade = document.getElementById('inpCidade');
const inpEstado = document.getElementById('inpEstado');
const inpComp = document.getElementById('inpComp');
const inpTel = document.getElementById('inpTel');

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
    } else {
        inpCPF.classList.add('invalid')
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
            
        })
        .catch(err => console.error(err))
    }
    
  }