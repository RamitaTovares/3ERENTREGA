//Fake Databases de Usuarios de la ferreteria
const usuarios = [{
    nombre: 'Rama',
    mail: 'ramiro.tovares@mail.com',
    pass: 'rama123'
},
{
    nombre: 'Maqui',
    mail: 'maqui@mail.com',
    pass: 'maqui123'
},
{
    nombre: 'Brian',
    mail: 'brian@mail.com',
    pass: 'brian'
}]

const puestos = [{
    nombre: "Rama",
    puesto: "Director",
    edad: 30,
    antiguedad: 2,
    sueldo: 100000,
    img: './img/rama.jpg'
}, {
    nombre: "Carlos",
    puesto: "Gerente",
    edad: 58,
    antiguedad: 28,
    sueldo: 80000,
    img: './img/Carlos.jpg'
}, {
    nombre: "Juan",
    puesto: "supervisor",
    edad: 27,
    antiguedad: 2,
    sueldo: 70000 ,
    img: './img/juan.jpg'
}
]

const btnSwal = document.getElementById('botonSwal');
const mailLogin = document.getElementById('emailLogin'),
    passLogin = document.getElementById('passwordLogin'),
    recordar = document.getElementById('recordarme'),
    btnLogin = document.getElementById('login'),
    modalEl = document.getElementById('modalLogin'),
    modal = new bootstrap.Modal(modalEl),
    contTarjetas = document.getElementById('tarjetas'),
    toggles = document.querySelectorAll('.toggles');




    
function validarUsuario(usersDB, user, pass) {
    let encontrado = usersDB.find((userDB) => userDB.mail == user);

 
    if (typeof encontrado === 'undefined') {
        return false;
    } else {
       
        if (encontrado.pass != pass) {
            return false;
        } else {
            Swal.fire(
                'Entraste Satisfactoriamente, a la base de DATOS',
                'You clicked the button!',
                'success'
              )
            return encontrado;
        }
    }
}


function guardarDatos(usuarioDB, storage) {
    const usuario = {
        'name': usuarioDB.nombre,
        'user': usuarioDB.mail,
        'pass': usuarioDB.pass
    }

    storage.setItem('usuario', JSON.stringify(usuario));
}

function saludar(usuario) {
    nombreUsuario.innerHTML = `Bienvenido/a, <span>${usuario.name}</span>`
}


function borrarDatos() {
    localStorage.clear();
    sessionStorage.clear();
}


function recuperarUsuario(storage) {
    let usuarioEnStorage = JSON.parse(storage.getItem('usuario'));
    return usuarioEnStorage;
}


function estaLogueado(usuario) {

    if (usuario) {
        saludar(usuario);
        mostrarInfoPuesto(puestos);
        presentarInfo(toggles, 'd-none');
    }
}

function presentarInfo(array, clase) {
    array.forEach(element => {
        element.classList.toggle(clase);
    });
}

function mostrarInfoPuesto(array) {
    contTarjetas.innerHTML = '';
    
    array.forEach(element => {
        let html = `<div class="card cardPersonal" id="tarjeta${element.nombre}">
                <h3 class="card-header" id="nombrePersonal">Nombre: ${element.nombre}</h3>
                <img src="${element.img}" alt="${element.nombre}" class="card-img-bottom" id="fotoPersonal">
                <div class="card-body">
                    <p class="card-text" id="especiePersonal">puesto: ${element.puesto}</p>
                    <p class="card-text" id="edadPersonal">Edad: ${element.edad} años</p>
                    <p class="card-text" id="pesoPersonal">Antiguedad: ${element.antiguedad} años</p>
                    <p class="card-text" id="pesoPersonal">Sueldo: ${element.sueldo} pesos</p>
                </div>
            </div>`;
        contTarjetas.innerHTML += html;
    });

}


btnLogin.addEventListener('click', (e) => {
    e.preventDefault();

        let data = validarUsuario(usuarios, mailLogin.value, passLogin.value);

        if (!data) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Lo siento, contraseña incorrecta!',
              })
        } else {

            //Revisamos si elige persistir la info aunque se cierre el navegador o no
            if (recordar.checked) {
                guardarDatos(data, localStorage);
                saludar(recuperarUsuario(localStorage));
            } else {
                guardarDatos(data, sessionStorage);
                saludar(recuperarUsuario(sessionStorage));
            }
            //Recién ahora cierro el cuadrito de login
            modal.hide();
            //Muestro la info para usuarios logueados
            mostrarInfoPuesto(puestos);
            presentarInfo(toggles, 'd-none');
        }
   // }
});

btnLogout.addEventListener('click', () => {
    borrarDatos();
    presentarInfo(toggles, 'd-none');
});

window.onload = () => estaLogueado(recuperarUsuario(localStorage)); 

const APIKEY = 'a8f51002fabe40d42111cd2d';
    
const desplegable = document.querySelectorAll('form select'),
    monedaInicial = document.querySelector('#inicial select'),
    monedaFinal = document.querySelector('#monedaFinal'),
    btnConvertir = document.querySelector('#btnConversion'),
    monto = document.querySelector('#monto'),
    conversionTxt = document.querySelector('#conversionTxt'),
    btnInvertirMoneda = document.querySelector('#icono');

const crearSelectsMonedas = async () => {
    const respuesta = await fetch('./js/data.json');
    const dataJson = await respuesta.json();

    desplegable.forEach((element, index) => {
        for (const item of dataJson) {
            let monedaPredet = (index == 0) ? ((item.moneda == 'ARS') ? 'selected' : '') : ((item.moneda == 'USD') ? 'selected' : '');
            let optionHTML = `<option value="${item.moneda}" ${monedaPredet}>${item.moneda}</option>`;
            element.insertAdjacentHTML('beforeend', optionHTML);

        }

        element.addEventListener('change', e => {
            mostrarBandera(e.target);
        })
    });
}

crearSelectsMonedas();

const mostrarBandera = async (element) => {
    const respuesta = await fetch('./js/data.json');
    const dataJson = await respuesta.json();

    for (const item of dataJson) {
        if (item.moneda == element.value) {
            let imagen = element.parentElement.querySelector('img');
            imagen.src = `https://www.countryflagsapi.com/png/${item.pais}`;
        }

    }
}

function obtenerTasaCambio() {
    let montoVal = monto.value;
    if (montoVal == '' || montoVal == '0') {
        monto.value = '1';
        montoVal = 1;
    }

    conversionTxt.innerText = 'Obteniendo información...';


    const URL = `https://v6.exchangerate-api.com/v6/${APIKEY}/latest/${monedaInicial.value}`;



    fetch(URL)
        .then(response => response.json())
        .then(result => {
            console.log(result.conversion_rates);
            let tasaConversion = result.conversion_rates[monedaFinal.value];
            let resultado = (montoVal * tasaConversion).toFixed(2);
            conversionTxt.innerText = `${montoVal} ${monedaInicial.value} = ${resultado} ${monedaFinal.value}`;
        }).catch(() => {
            conversionTxt.innerText = 'Algo salió mal';
        });
}

async function cambiar() {
    let montoVal = monto.value;
    if (montoVal == '' || montoVal == '0') {
        monto.value = '1';
        montoVal = 1;
    }
    conversionTxt.innerText = 'Obteniendo información...';
    const URL = `https://v6.exchangerate-api.com/v6/${APIKEY}/latest/${monedaInicial.value}`;

    try {
        const respuesta = await fetch(URL);
        const data = await respuesta.json();
        //console.log(data.conversion_rates);
        let tasaConversion = data.conversion_rates[monedaFinal.value];
        let resultado = (montoVal * tasaConversion).toFixed(2);
        conversionTxt.innerText = `${montoVal} ${monedaInicial.value} = ${resultado} ${monedaFinal.value}`;

    } catch (e) {
        conversionTxt.innerText = 'Algo salió mal';
        console.log(e);
    }

}


window.onload = () => {

    cambiar();
}

btnConvertir.addEventListener('click', (e) => {
    e.preventDefault();
    cambiar();
})

btnInvertirMoneda.addEventListener('click', () => {
    let temp = monedaInicial.value;
    monedaInicial.value = monedaFinal.value;
    monedaFinal.value = temp;
    mostrarBandera(monedaInicial);
    mostrarBandera(monedaFinal);
    cambiar();
})

