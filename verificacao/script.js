var token = new URLSearchParams(window.location.search).get('token')

if (token !== null) {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: '{}'
    };
    fetch('https://lamaison.glitch.me/usuario/verificar/', options)
        .then(response => response.json())
        .then(response => {
            if (response.validado) {
                document.querySelector('.success').classList.remove('escondido')
            } else {
                document.querySelector('.fail').classList.remove('escondido')
            }
        })
        .catch(err => {
            document.querySelector('.fail').classList.remove('escondido')
        })
        .finally(() => {
            document.querySelector('.loading-screen').classList.add('escondido')
        })
} else {
    window.location = "../login/index.html"
}
