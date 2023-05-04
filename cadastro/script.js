function showPw(el) {
    el.classList.toggle('fa-eye');
    el.classList.toggle('fa-eye-slash')

    if (document.querySelector('#inpSenha').getAttribute('type') === "password") {
        document.querySelector('#inpSenha').setAttribute('type', 'text')
    }else{
        document.querySelector('#inpSenha').setAttribute('type', 'password')
    }
}