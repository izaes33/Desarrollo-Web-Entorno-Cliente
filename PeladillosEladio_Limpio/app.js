'use strict';

const TIENDA = {
    nombre: 'Peladillos Eladio',
    divisa: 'EUR',
    idioma: 'es-ES',
    edadMinima: 16
};

const SERVICIOS = [
    {
        id: 'clasico',
        name: 'Corte clásico',
        precio: 12,
        duracion: 25,
    },
    {
        id: 'Tupper fade',
        name: 'Corte fade',
        precio: 15,
        duracion: 35,
    },
    {
        id: 'Brocoli',
        name: 'Corte brocoli',
        precio: 20,
        duracion: 15,
    },
];

const EXTRAS = {
    lavado: {
        nombre: 'Lavado gostoso',
        precio: 100
    },
    cejas: {
        nombre: 'Pulido de cejas',
        precio: 3
    },
};

const DESCUENTO_MIEMBROS = 0.05;
const CODIGO_CUPON = 'ELADIO10';
const CUPON_DESCUENTO = 0.10;

const servicesGrid = document.querySelector('#servicesGrid');
const serviceSelect = document.querySelector('#serviceSelect');
const bookingForm = document.querySelector('#bookingForm');
const ticketContent = document.querySelector('#ticketContent');
const formMessage = document.querySelector('#formMessage');

function formatMoney(importe) {
    const formatter = new Intl.NumberFormat(
        TIENDA.idioma,
        {
            style: 'currency',
            currency: TIENDA.divisa
        }
    );
    return formatter.format(importe);
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function buscarServicio(id) {
    return SERVICIOS.find(
        (servicio) => servicio.id === id
    );
}

function renderizarServicios() {
    let cardsHtml = '';
    let optionHtml = `
     <option value="" selected disabled>
        - Selecciona el servicio -
     </option>
    `;

    for (const servicio of SERVICIOS) {
        cardsHtml += `
          <article class="card">
              <h3>${servicio.name}</h3>
              <p>${servicio.duracion} min</p>
              <span class="price">
                  ${formatMoney(servicio.precio)}
              </span>
          </article>
        `;
        optionHtml += `
            <option value="${servicio.id}">
                ${servicio.name} - ${formatMoney(servicio.precio)}
            </option>
        `;
    }

    servicesGrid.innerHTML = cardsHtml;
    serviceSelect.innerHTML = optionHtml;
}

function renderizarServiciosCreate() {
    for (const servicio of SERVICIOS) {
        const article = document.createElement('article');
        article.classList.add('card');

        const title = document.createElement('h3');
        title.textContent = servicio.name;

        const duracion = document.createElement('p');
        duracion.textContent = `${servicio.duracion} min`;

        const precio = document.createElement('span');
        precio.classList.add('price');
        precio.textContent = formatMoney(servicio.precio);

        article.append(
            title,
            duracion,
            precio
        );

        servicesGrid.append(article);
    }
}

function leerFormulario() {
    const datos = new FormData(bookingForm);
    const nombre = String(datos.get('clientName') ?? '').trim();
    const edad = Number(datos.get('age'));
    const extras = datos.getAll('extras').map(String);
    const coupon = String(datos.get('coupon') ?? '').trim().toUpperCase();
    const servicioId = String(datos.get('service') ?? '');
    const dia = String(datos.get('day') ?? '');
    const esMiembro = datos.get('member') === 'on';

    return {
        nombre,
        edad,
        servicioId,
        dia,
        extras,
        coupon,
        esMiembro
    };
}

function validarReserva(reserva) {
    const errores = [];

    if (!reserva.nombre) {
        errores.push('Escribe tu nombre');
    }

    if (Number.isNaN(reserva.edad)) {
        errores.push('La edad debe de ser un número');
    } else if (
        reserva.edad < TIENDA.edadMinima ||
        reserva.edad > 120
    ) {
        errores.push(
            `La edad debe de estar entre ${TIENDA.edadMinima} y 120`
        );
    }

    if (!buscarServicio(reserva.servicioId)) {
        errores.push('El servicio no existe');
    }

    if (!reserva.dia) {
        errores.push('Selecciona un día');
    }

    return errores;
}

function comprobarServicio(id){
    return SERVICIOS.find(
        servicio => servicio.id === id
    );
}

function calcularReserva(reserva) {
    const servicio = buscarServicio(reserva.servicioId);
    let subtotal = servicio?.precio ?? 0;
    const extrasDetalle = [];

    for (const extraID of reserva.extras) {
        const extra = EXTRAS[extraID];
        if (!extra) {
            continue;
        }
        subtotal += extra.precio;
        extrasDetalle.push(extra);
    }

    let porcentajeDescuento = 0;

    if (reserva.esMiembro) {
        porcentajeDescuento += DESCUENTO_MIEMBROS;
    }

    if (reserva.coupon === CODIGO_CUPON) {
        porcentajeDescuento += CUPON_DESCUENTO;
    }

    const descuento = subtotal * porcentajeDescuento;
    const total = subtotal - descuento;

    return {
        servicio,
        extrasDetalle,
        subtotal,
        porcentajeDescuento,
        descuento,
        total
    };
}

function obtenerMensajeEdad(edad){
    if (edad < TIENDA.edadMinima){
        return 'No cumples con la edad mínima';
    } else if (edad >= 65) {
        return ' bienvenido jubilado!';
    } else {
        return 'Contamos contigo!';
    }
}

function obtenerMensajeDia(dia){
    switch (dia) {
        case 'Lunes':
            return 'Empezar a tope la semana!';
        case 'Viernes':
            return 'Acabar a tope la semana!';
        case 'Sábado':
            return 'Bendito sábado!';      
        default:     
            return 'Un buen día para retocarse!'; 
    }
}

function renderizarTicket() {
    const reserva = leerFormulario();
    const resultado = calcularReserva(reserva);
    const nombreServicio =
        resultado.servicio?.name ?? 'Sin seleccionar';
    const nombresExtras = resultado.extrasDetalle
        .map(extra => extra.nombre)
        .join(', ');
    ticketContent.innerHTML = `
            <div class="ticket-row">
                <span>Cliente</span>
                <strong>${escapeHtml(reserva.nombre || 'Sin indicar')} </strong>
            </div>
            <div class="ticket-row">
                <span>Servicio</span>
                <strong>${escapeHtml(nombreServicio)}</strong>
            </div>
            <div class="ticket-row">
                <span>Día</span>
                <strong>${escapeHtml(reserva.dia || 'Sin seleccionar')} </strong>
            </div>
            <div class="ticket-row">
                <span>Extras</span>
                <strong>${escapeHtml(nombresExtras || 'Ninguno')} </strong>
            </div>
            <div class="ticket-row">
                <span>Miembro</span>
                <strong>${reserva.esMiembro ? 'Sí' : 'No'} </strong>
            </div>
            <div class="ticket-row">
                <span>Subtotal</span>
                <strong>${formatMoney(resultado.subtotal)} </strong>
            </div>
            <div class="ticket-row">
                <span>Descuento</span>
                <strong>${formatMoney(resultado.descuento)} </strong>
            </div>
             <div class="ticket-row">
                <span>Total</span>
                <strong>${formatMoney(resultado.total)} </strong>
            </div>  
    `;  
}

bookingForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const reserva = leerFormulario();
    const errores = validarReserva(reserva);
    if (errores.length > 0) {
        formMessage.textContent = errores.join(' ');
        return;
    }
    const resultado = calcularReserva(reserva);
    formMessage.textContent =
     `Reserva preparada para ${reserva.nombre}. ` +
     `Total: ${formatMoney(resultado.total)}. `;
     renderizarTicket();
});

renderizarServicios();