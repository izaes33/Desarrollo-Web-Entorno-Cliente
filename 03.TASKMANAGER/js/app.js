/*
 * ============================================================
 * PROYECTO: TASKFLOW
 * Gestión interactiva de tareas mediante eventos JavaScript
 * ============================================================
 *
 * FUNCIONALIDADES:
 *      1. Crear tareas mediante un formulario.
 *      2. Organizar tareas en tres estados:
 *              - Pendiente
 *              - En proceso
 *              - Completada
 *      3. Mover tareas entre estados.
 *      4. Eliminar tareas.
 *      5. Filtrar tareas por prioridad.
 *      6. Buscar tareas por su título.
 *      7. Realizar búsquedas.
 *      8. Utilizar delegación de eventos.
 *      9. Emitir y escuchar eventos personalizados.
 *      10. Optimizar eventos frecuentes con debounce y throttle.
 *
 * CONCEPTOS DE JAVASCRIPT:
 *
 * - Variables const y let.
 * - Arrays y objetos.
 * - Funciones tradicionales y funciones flecha.
 * - Manipulación del DOM.
 * - addEventListener().
 * - Objeto event.
 * - event.target y event.currentTarget.
 * - Métodos closest() y contains().
 * - Operadores lógicos.
 * - Métodos de arrays.
 * - Atributos data-* y dataset.
 * - Temporizadores.
 * - Closures o clausuras.
 * - CustomEvent y dispatchEvent().
 */


// ============================================================
// 1. CONFIGURACIÓN INICIAL
// ============================================================

/*
 * Activamos el modo estricto de JavaScript: Este modo ayuda a detectar determinados errores.
 * Por ejemplo, impide asignar un valor a una variable que no se haya declarado previamente.
 *
 *              (ej. numero = 10;
 *                  produciría un ReferenceError si la variable numero no existiese).
 */

'use strict';


/*-------------------------------------------------------------------------
| FUNCIÓN AUXILIAR $ (ATAJO PARA SELECCIONAR ELEMENTOS DEL DOM)
|--------------------------------------------------------------------------
| Esta línea crea un atajo para no tener que escribir document.querySelector(...)
| una y otra vez al buscar elementos del HTML. 
| En JavaScript, el símbolo $ es un carácter válido más para nombrar variables o 
| funciones (como 'a' o 'x').
|
| 1. DESGLOSE DE LA SINTAXIS:
|    - const $: Creamos una constante llamada '$' que guarda una función.
|    - selector => ...: Es una función flecha que recibe un único parámetro
|      de entrada ('selector', ej. '#titulo', '.tarea' o 'button').
|    - document.querySelector(selector): Tiene un return implícito. Busca en
|      el documento HTML el primer elemento que coincida con ese selector CSS
|      y lo devuelve (o devuelve null si no encuentra ninguno).
|
| 2. EQUIVALENCIA EN FUNCIÓN TRADICIONAL:
|    Escribir la línea de abajo hace exactamente lo mismo que escribir:
|    function $(selector) {
|        return document.querySelector(selector);
|    }
|
| 3. EJEMPLO PRÁCTICO (ANTES vs. DESPUÉS):
|    - Sin el atajo: const titulo = document.querySelector('#titulo');
|    - Con el atajo: const titulo = $('#titulo');
|
| 4. DOS DETALLES IMPORTANTES:
|    - Se aclara que "No estamos utilizando jQuery" porque la librería
|      antigua jQuery hizo famoso el uso de $('...'). Aquí imitamos esa misma
|      comodidad usando únicamente JavaScript puro (Vanilla JS).
|    - Se requiere <script src="app.js" defer></script>? porque el
|      navegador lee el HTML de arriba a abajo. El atributo 'defer' hace que
|      el script espere a que todo el HTML esté cargado antes de ejecutarse,
|      evitando que $() busque etiquetas que aún no existen y devuelva null. */
const $ = selector => document.querySelector(selector);


// ============================================================
// 2. DATOS INICIALES
// ============================================================
/* Array que almacena todas las tareas de la aplicación.
 *
 * Cada elemento del array es un objeto JavaScript.
 *
 * Cada tarea contiene:
 *      id:
 *          Identificador numérico único.
 *      titulo:
 *          Descripción de la tarea.
 *      prioridad:
 *          Puede ser alta, media o baja.
 *      estado:
 *          Puede ser pendiente, en-proceso o completada.
 *
 * Utilizamos const porque no vamos a sustituir el array
 * por otro diferente. Sin embargo, sí podemos modificar su contenido:
 *
 * tareas.push(...)
 * tareas.splice(...)
 * tareas[0].estado = ...
 */

const tareas = [
    {
        id: 1,
        titulo: 'Preparar documentación',
        prioridad: 'alta',
        estado: 'pendiente'
    },
    {
        id: 2,
        titulo: 'Revisar página web',
        prioridad: 'media',
        estado: 'en-proceso'
    },
    {
        id: 3,
        titulo: 'Enviar presupuesto',
        prioridad: 'baja',
        estado: 'completada'
    }
];


/*
 * Identificador que recibirá la próxima tarea: Como ya existen las tareas 1, 2 y 3,
 * comenzamos con el identificador 4. Utilizaremos: id: siguienteId++
 * El operador ++ devuelve el valor actual y después incrementa la variable.
 * Primera ejecución:
 *    Se asigna el ID 4.
 *    siguienteId pasa a valer 5. */
let siguienteId = 4;


/*
 * Variable que almacena el texto de búsqueda: Inicialmente es una cadena vacía.
 * Cuando busqueda está vacía, todas las tareas cumplen el filtro de texto, porque:
 * 'cualquier texto'.includes('') === true
 */
let busqueda = '';


/*
 * Variable preparada para almacenar un AbortController:
 * AbortController permite cancelar manejadores de eventos registrados utilizando una misma señal.
 *
 * Por ejemplo:
 *      seguimiento = new AbortController();
 *      elemento.addEventListener('pointermove', funcion, {
 *          signal: seguimiento.signal
 *      });
 *      seguimiento.abort();
 *
 * Esta variable queda disponible para funcionalidades
 * relacionadas con el seguimiento del puntero.
 */
let seguimiento = null;


/*
 * Array que define los estados posibles de una tarea:
 *
 * El orden de los elementos es importante:
 *      Índice 0: pendiente
 *      Índice 1: en-proceso
 *      Índice 2: completada
 * Este orden permite desplazar tareas utilizando operaciones con los índices.
 * Por ejemplo:
 *      estados[0] -> 'pendiente'
 *      estados[1] -> 'en-proceso'
 *      estados[2] -> 'completada'
 * Para avanzar:
 *          indiceActual + 1
 * Para retroceder:
 *          indiceActual - 1
 */
const estados = [
    'pendiente',
    'en-proceso',
    'completada'
];


// ============================================================
// 3. FUNCIONES AUXILIARES
// ============================================================

/*
 * Muestra un mensaje al usuario.
 * Parámetro: texto: mensaje que queremos mostrar.
 * Localiza el elemento HTML con id="mensaje" y modifica su propiedad textContent
 * textContent inserta texto sin interpretar etiquetas HTML.
 */
function avisar(texto) {
    $('#mensaje').textContent = texto;
}


/*
 * Normaliza una cadena para realizar búsquedas.
 *
 * Objetivo: Permitir que las búsquedas no distingan entre:
 *      - Mayúsculas y minúsculas.
 *      - Vocales acentuadas y no acentuadas.
 *      - Espacios al principio o al final.
 * La letra ñ conserva su identidad.
 *
 * PASO 1:
 * Convertimos las letras ñ y Ñ en caracterestemporales del área de uso privado de Unicode.
 * Esto evita que normalize("NFD") separe la letra ñ en una n y una marca de tilde.
 *
 * PASO 2:
 * normalize("NFD") descompone los caracteres acentuados.
 *
 * Por ejemplo:
 * "á" -> "a" + marca de acento
 *
 * PASO 3:
 * replace() elimina las marcas combinantes.
 * La expresión regular: /[\u0300-\u036f]/g  identifica las marcas Unicode comprendidas
 * en ese intervalo. La bandera g significa que se reemplazan todas las coincidencias.
 *
 * PASO 4:
 * Recuperamos la letra ñ.
 *
 * PASO 5:
 * Convertimos a minúsculas y eliminamos los espacios exteriores.
 * Los caracteres temporales elegidos se reservan para este procesamiento y no deben utilizarse
 * como texto ordinario de las tareas.
 */
function normalizarTexto(texto) {
    return texto
        // Protegemos la letra ñ.
        .replace(/ñ/g, '\uE000')
        .replace(/Ñ/g, '\uE001')
        // Descomponemos los caracteres acentuados.
        .normalize('NFD')
        // Eliminamos las marcas de acentuación.
        .replace(/[\u0300-\u036f]/g, '')
        // Recuperamos la letra ñ.
        .replace(/\uE000/g, 'ñ')
        .replace(/\uE001/g, 'ñ')
        // Convertimos el texto a minúsculas.
        .toLocaleLowerCase('es')
        // Eliminamos espacios al principio y al final.
        .trim();
}


// ============================================================
// 4. OPTIMIZACIÓN DE EVENTOS: DEBOUNCE
// ============================================================
/* debounce controla la frecuencia con la que se ejecuta una función.
 * Se utiliza especialmente con eventos que pueden producirse muchas veces en poco tiempo.
 *      Por ejemplo:
 * - input
 * - keyup
 * - resize
 * Cuando el usuario escribe en un buscador, el evento input se dispara con cada cambio.
 * Si ejecutamos renderizar() inmediatamente, podríamos actualizar la interfaz muchas veces.
 * debounce espera a que transcurra un intervalo sin nuevas llamadas antes de ejecutar la función.
 *      Ejemplo:
 * El usuario escribe:
 * p
 * pr
 * pro
 * prog
 * Si continúa escribiendo antes de que pasen 300 ms, se cancela la ejecución anterior.
 * Cuando deja de escribir durante 300 ms, se ejecuta la búsqueda.
 * PARÁMETROS:
 * fn:
 *    Función cuya ejecución queremos retrasar.
 * ms:
 *    Tiempo de espera en milisegundos.

 * DEVUELVE: Otra función que controla cuándo se ejecuta fn.
 * (Se trata de una función de orden superior: recibe una función y devuelve otra función).
 */

function debounce(fn, ms) {
    // Almacenamos el identificador del temporizador. Esta variable conserva su valor entre llamadas
    // a la función que devolvemos. Esto es posible gracias a una clausura o closure. */
    let id;

    //Devolvemos una función flecha.
    // ...args es un parámetro rest. Permite recoger varios argumentos en un array.
    return (...args) => {

        //Cancelamos el temporizador anterior.
        // Si todavía no había transcurrido el tiempo de espera, su función no llegará a ejecutarse.
        clearTimeout(id);

        /* Creamos un nuevo temporizador.
         * setTimeout recibe:
         *          Una función que debe ejecutarse.
         *          Un tiempo de espera en milisegundos.
         * fn(...args) utiliza el operador spread para transmitir los argumentos originales.
         * setTimeout no garantiza una ejecución exactamente en el milisegundo indicado:
         * la función se ejecutará cuando el navegador pueda atenderla después de la espera. */
        id = setTimeout(() => {
            fn(...args);
        }, ms);
    };
}


// ============================================================
// 5. OPTIMIZACIÓN DE EVENTOS: THROTTLE
// ============================================================
/* throttle limita la frecuencia de ejecución de una función. Se diferencia de debounce en que permite 
ejecutar la función periódicamente mientras continúa la actividad, en lugar de esperar a que termine. 
Esto es útil para eventos que se disparan con mucha frecuencia, como resize, scroll o pointermove.
 *
 * Ejemplo:
 * Si un evento se dispara 100 veces por segundo, throttle puede limitar su ejecución a una vez
 * cada 200 milisegundos.
 *
 * Resulta útil para:
 * - resize
 * - scroll
 * - pointermove
 *
 * PARÁMETROS:
 *          fn:
 *              Función que queremos ejecutar.
 *          ms:
 *              Intervalo mínimo entre ejecuciones.
 *
 * Esta implementación ejecuta inmediatamente la primera llamada permitida y descarta
 * las llamadas que se produzcan durante el intervalo de espera.
 */
function throttle(fn, ms) {

    //Guardamos el instante de la última ejecución.
    // Inicialmente vale cero, lo que permite ejecutar la función inmediatamente la primera vez.
    let ultimo = 0;

    //Devolvemos una función que recibe los argumentos originales y controla la ejecución de fn.
    return (...args) => {

        // Date.now() devuelve el número de milisegundos transcurridos desde el 1 de enero de 1970 UTC.
        const ahora = Date.now();

        // Calculamos el tiempo transcurrido desde la última ejecución.
        //Si ha pasado el intervalo mínimo, permitimos ejecutar la función.
        if (ahora - ultimo >= ms) {
            // Guardamos el instante actual.
            ultimo = ahora;
            // Ejecutamos la función original.
            fn(...args);
        }
    };
}


// ============================================================
// 6. EVENTOS PERSONALIZADOS
// ============================================================
/* Hasta ahora solo hemos usado eventos que ya vienen de fábrica en el navegador:
| 'click' (hacer clic), 'submit' (enviar formulario), 'input' (escribir)...
| En esos casos, el navegador ve que el usuario toca algo y pega un grito automático:
| "¡Eh, han hecho clic!".
|
| Pero, ¿qué pasa si queremos que nuestra app pegue un grito automático cuando
| ocurra algo diferente (por ejemplo, cada vez que añadimos, movemos o
| borramos una tarea)? El navegador no tiene un evento 'tareaBorrada' de fábrica.
| Solución: Nos inventamos nuestro propio evento con `CustomEvent`.
| Funciona exactamente como un sistema de Walkie-Talkies de 2 partes:
|
|   PARTE A -> EL EMISOR (la función `notificarCambio`):
|              Prepara los datos, coge el Walkie-Talkie y grita por el canal
|              'tareas:cambiadas': "¡Oye, aquí tenemos un cambio en las tareas!
|
|   PARTE B -> EL RECEPTOR (`document.addEventListener`):
|              Tiene el Walkie-Talkie encendido en ese mismo canal ('tareas:cambiadas').
|              En cuanto escucha el grito, abre el paquete de datos y los muestra
|              en la consola. */

function notificarCambio() {

    /* PASO 1: CALCULAR LOS DATOS QUE QUEREMOS ENVIAR POR EL WALKIE-TALKIE
     * --------------------------------------------------------------------
     * Antes de emitir el aviso, necesitamos saber cuántas tareas hay en total
     * y cuántas faltan por terminar.
     *
     * 1.1. Total de tareas:
     *      `tareas.length` simplemente cuenta cuántos objetos hay ahora mismo
     *      dentro de nuestro array `tareas`. */
    const total = tareas.length;

    /* 1.2. Tareas que aún NO están terminadas:
     *      Queremos contar tanto las que están 'pendiente' como las que están
     *      'en-proceso' (por eso la variable se llama `tareasNoCompletadas`). */
    const tareasNoCompletadas = tareas.filter(
        tarea => tarea.estado !== 'completada'
    );

    /* PASO 2: FABRICAR EL MENSAJE / EVENTO (`new CustomEvent`)
     * --------------------------------------------------------------------
     * `new CustomEvent(...)` construye nuestro aviso personalizado.
     * Recibe DOS cosas separadas por una coma:
     *
     * 1º PARÁMETRO -> `'tareas:cambiadas'` (El nombre del canal / etiqueta):
     *    Es un texto inventado por nosotros. Se suelen usar dos puntos (:)
     *    por costumbre entre programadores para que quede ordenado (categoría:acción),
     *    pero podría llamarse 'pepe' perfectamente. Lo único obligatorio es que
     *    luego escuchemos exactamente este mismo nombre en el `addEventListener`.
     *
     * 2º PARÁMETRO -> `{ bubbles: true, detail: { ... } }` (El objeto de configuración):
     *    Abriendo llaves `{}` configuramos dos propiedades clave que exige JavaScript:
     *
     *    A) `bubbles: true` (Que el evento "burbujee" o suba hacia arriba):
     *       Como vamos a lanzar el evento desde `<div id="tablero">`, si ponemos
     *       `bubbles: true`, el grito sube como una burbuja de agua hacia sus padres
     *       en el HTML:
     *       `#tablero` ──> `<body>` ──> `<html>` ──> `document`
     *       Si pusiéramos `false`, el grito se quedaría encerrado dentro de `#tablero`
     *       y el `document` (que está arriba del todo) jamás se enteraría.
     *
     *    B) `detail: { ... }` (La mochila con nuestros datos):
     *       `detail` es el nombre oficial de la "mochila" donde `CustomEvent` nos deja
     *       meter la información que queramos enviar. Dentro metemos un objeto con:
     *       - `total`: el número total que calculamos arriba.
     *       - `noCompletadas`: usamos `.length` para enviar el NÚMERO de tareas sin
     *         acabar (ej. 2), en lugar de enviar la lista entera de objetos. */
    const evento = new CustomEvent('tareas:cambiadas', {
        bubbles: true,
        detail: {
            total: total,
            noCompletadas: tareasNoCompletadas.length
        }
    });

    /* PASO 3: PULSAR EL BOTÓN DE ENVIAR (`dispatchEvent`)
     * --------------------------------------------------------------------
     * Hasta la línea anterior solo habíamos "escrito el mensaje", pero nadie
     * lo había enviado todavía.
     * `$('#tablero').dispatchEvent(evento)` coge el elemento `#tablero` del HTML
     * y DISPARA (`dispatch`) el evento desde ahí.
     * Toda esta función `notificarCambio()` se llama desde `renderizar()` (apartado 7.11) 
     * cada vez que se crea, mueve o borra una tarea. */
    $('#tablero').dispatchEvent(evento);
}


/* ========================================================================
 * PARTE B: EL RECEPTOR QUE ESCUCHA EL AVISO (`addEventListener`)
 * ========================================================================
 * Igual que hacíamos `boton.addEventListener('click', ...)` para esperar un clic,
 * aquí ponemos una antena en `document` (el documento entero) esperando a oír
 * nuestro canal inventado `'tareas:cambiadas'`.
 *
 * RECORRIDO COMPLETO CUANDO OCURRE UN CAMBIO:
 * 1. `renderizar()` termina de pintar las tarjetas y llama a `notificarCambio()`.
 * 2. `notificarCambio()` dispara el evento `'tareas:cambiadas'` en `#tablero`.
 * 3. Gracias a `bubbles: true`, el evento sube por el HTML hasta llegar a `document`.
 * 4. Este `document.addEventListener` lo detecta al vuelo y ejecuta la función flecha:
 *    - Recibe el paquete completo en el parámetro `event`.
 *    - `event.type` contiene el nombre del canal ('tareas:cambiadas').
 *    - `event.detail` es la mochila de datos que armamos arriba (`{ total: 3, noCompletadas: 2 }`).
 *    - `event.detail.total` saca el número total (3).
 *    - `event.detail.noCompletadas` saca cuántas faltan por terminar (2). */
document.addEventListener('tareas:cambiadas', event => {
    console.log('Evento recibido:', event.type);
    console.log('Detalles:', event.detail);
    console.log('Total de tareas:', event.detail.total);
    console.log('Tareas no completadas:', event.detail.noCompletadas);
});


// ============================================================
// 7. RENDERIZACIÓN DEL TABLERO
// ============================================================
/* renderizar() es una de las funciones principales de la aplicación: su responsabilidad
 * es actualizar el contenido visual del tablero.
 * PROCESO:
 *      1. Vaciar las columnas.
 *      2. Obtener el filtro de prioridad.
 *      3. Recorrer las tareas.
 *      4. Aplicar los filtros.
 *      5. Crear las tarjetas HTML.
 *      6. Crear los botones de acción.
 *      7. Insertar las tarjetas en sus columnas.
 *      8. Emitir un evento personalizado.
 * 
 * IMPORTANTE: Esta función no elimina tareas del array cuando no cumplen los filtros;
 * simplemente decide qué tareas se representan en el documento HTML. */
function renderizar() {

    // 7.1. LIMPIAR LAS COLUMNAS
    // --------------------------------------------------------
    /* Recorremos los estados posibles y para cada uno localizamos su contenedor HTML.
     * replaceChildren() elimina todos los nodos hijos del contenedor, evitando duplicar
     * las tarjetas cada vez que se actualiza el tablero. */
    for (const estado of estados) {
        $('#' + estado).replaceChildren();
    }

    // 7.2. OBTENER EL FILTRO DE PRIORIDAD
    // --------------------------------------------------------
    // Leemos el valor seleccionado en el desplegable (posibles valores: todas, alta, media, baja).

    const filtro = $('#filtro').value;

    // 7.3. RECORRER TODAS LAS TAREAS
    // --------------------------------------------------------
    // for...of permite recorrer los elementos de un array. En cada iteración, 'tarea' contiene
    // uno de los objetos del array tareas.
    for (const tarea of tareas) {

        // 7.4. FILTRAR POR PRIORIDAD
        // ----------------------------------------------------
        /* Comprobamos dos condiciones unidas con && (AND lógico, ambas deben cumplirse):
         * - filtro !== 'todas': El usuario ha seleccionado una prioridad concreta.
         * - tarea.prioridad !== filtro: La prioridad de la tarea no coincide con la seleccionada.
         * 'continue' termina la iteración actual y pasa a la siguiente tarea (sin eliminarla del array). */
        if (filtro !== 'todas' && tarea.prioridad !== filtro) {
            continue;
        }

        // 7.5. FILTRAR POR TEXTO
        // ----------------------------------------------------
        /* Normalizamos el título de la tarea (ej. "Preparar documentación" -> "preparar documentacion").
         * La variable 'busqueda' ya contiene el texto normalizado del buscador.
         * includes() comprueba si una cadena contiene otra, y el operador ! niega el resultado:
         * si el título NO contiene el texto buscado, omitimos la tarea mediante continue. */
        if (!normalizarTexto(tarea.titulo).includes(busqueda)) {
            continue;
        }

        // 7.6. CREAR LA TARJETA HTML
        // ----------------------------------------------------
        // document.createElement() crea un elemento <article></article> en memoria (aún no insertado en el DOM).
        const tarjeta = document.createElement('article');

        // Asignamos la clase CSS -> <article class="tarea"></article>
        tarjeta.className = 'tarea';

        /* dataset permite trabajar con atributos personalizados data-* (manejados como cadenas)
         * para recuperar información desde el DOM:
         * - tarjeta.dataset.id = tarea.id -> genera data-id="1"
         * - tarjeta.dataset.prioridad = tarea.prioridad -> genera data-prioridad="alta" */
        tarjeta.dataset.id = tarea.id;
        tarjeta.dataset.prioridad = tarea.prioridad;

        // 7.7. CREAR EL TÍTULO
        // ----------------------------------------------------
        // Creamos un encabezado h4 y establecemos su texto con textContent (sin interpretarlo como HTML)[cite: 1].
        const titulo = document.createElement('h4');
        titulo.textContent = tarea.titulo;

        // append() inserta el elemento titulo dentro de la tarjeta: <article class="tarea"><h4>...</h4></article>[cite: 1]
        tarjeta.append(titulo);

        // 7.8. MOSTRAR LA PRIORIDAD
        // ----------------------------------------------------
        // Creamos un elemento <small> para mostrar información secundaria de la tarea.
        const detalle = document.createElement('small');
        detalle.textContent = 'Prioridad: ' + tarea.prioridad;

        // append() permite insertar varios nodos en una misma llamada (el texto de prioridad y un salto <br>).
        tarjeta.append(
            detalle,
            document.createElement('br')
        );

        // 7.9. CREAR LOS BOTONES DE ACCIÓN
        // ----------------------------------------------------
        /* Cada tarjeta tendrá tres botones (Anterior, Siguiente, Eliminar). En lugar de repetir código,
         * recorremos un array de arrays y usamos desestructuración const [accion, texto] en el for...of
         * para extraer el identificador interno ('accion') y el texto visible ('texto') de cada botón. */
        for (const [accion, texto] of [
            ['anterior', '← Anterior'],
            ['siguiente', 'Siguiente →'],
            ['eliminar', 'Eliminar']
        ]) {
            // Creamos un botón HTML y establecemos type="button" para evitar que envíe formularios.
            const boton = document.createElement('button');
            boton.type = 'button';

            // Guardamos la acción en un atributo data-* (ej. data-accion="eliminar") y asignamos su texto visible.
            boton.dataset.accion = accion;
            boton.textContent = texto;

            // indexOf() devuelve la posición del estado actual dentro del array estados (0, 1 o 2).
            const indice = estados.indexOf(tarea.estado);

            /* Desactivamos los botones de movimiento cuando la tarea está en un extremo:
             * - Si está en 'pendiente' (indice === 0), no puede retroceder ('anterior').
             * - Si está en 'completada' (indice === estados.length - 1), no puede avanzar ('siguiente').
             * El botón 'Eliminar' permanece siempre habilitado. */
            boton.disabled = (
                (accion === 'anterior' && indice === 0) ||
                (accion === 'siguiente' && indice === estados.length - 1)
            );

            // Insertamos el botón dentro de la tarjeta.
            tarjeta.append(boton);
        }

        // 7.10. INSERTAR LA TARJETA EN SU COLUMNA
        // ----------------------------------------------------
        // Construimos el selector con el estado de la tarea (ej. '#pendiente') y añadimos la tarjeta con append().
        $('#' + tarea.estado).append(tarjeta);
    }

    // 7.11. NOTIFICAR LA ACTUALIZACIÓN
    // --------------------------------------------------------
    // Al terminar de construir el tablero, emitimos el evento personalizado 'tareas:cambiadas'.
    notificarCambio();
}


// ============================================================
// 8. CREACIÓN DE TAREAS
// ============================================================
/* Registramos un listener para el evento 'submit' del formulario (al pulsar el botón de envío
 * o presionar Enter) para procesar los datos mediante JavaScript sin recargar la página. */
$('#formulario').addEventListener('submit', event => {

    // preventDefault() cancela el envío predeterminado del navegador y evita que se recargue la página.
    // ------------------------------------------------------------------------------------------------
    event.preventDefault();

    // Recuperamos el contenido del campo con .value y eliminamos los espacios exteriores con .trim().
    const titulo = $('#titulo').value.trim();

    /* Comprobamos que el título no esté vacío (!titulo es true si es una cadena vacía '').
     * Si no es válido: mostramos aviso, colocamos el foco en el campo y terminamos con return. */
    if (!titulo) {
        avisar('Introduce un título válido');
        $('#titulo').focus();
        return;
    }

    /* Creamos la nueva tarea y la añadimos al final del array con push():
     * - siguienteId++: asigna el ID actual y luego incrementa la variable para la próxima tarea.
     * - titulo: propiedad abreviada que equivale a escribir titulo: titulo.
     * - estado: las nuevas tareas siempre comienzan en 'pendiente'. */
    tareas.push({
        id: siguienteId++,
        titulo,
        prioridad: $('#prioridad').value,
        estado: 'pendiente'
    });

    // reset() devuelve los controles del formulario a sus valores predeterminados.
    $('#formulario').reset();

    // Actualizamos el contador de caracteres e informamos al usuario.
    $('#contador').textContent = '0/80';
    avisar('Tarea añadida correctamente');

    // Reconstruimos el tablero para mostrar la nueva tarea y devolvemos el foco al campo de título.
    renderizar();
    $('#titulo').focus();
});


// ============================================================
// 9. BÚSQUEDA DE TAREAS CON DEBOUNCE
// ============================================================
/* Creamos una función de búsqueda controlada mediante debounce con 300 ms de espera.
 * Si el usuario sigue escribiendo antes de que pasen 300 ms, se reinicia la espera. */
const buscarConRetraso = debounce(texto => {
    // Convertimos el texto a su versión normalizada (ej. " DOCUMENTACIÓN " -> "documentacion").
    busqueda = normalizarTexto(texto);
    // Actualizamos las tareas visibles en el tablero.
    renderizar();
}, 300);

/* Escuchamos el evento 'input' del buscador (se dispara con cada cambio en el campo).
 * event.target.value contiene el texto actual y se lo pasamos a buscarConRetraso(). */
$('#buscar').addEventListener('input', event => {
    const texto = event.target.value;
    buscarConRetraso(texto);
});


// ============================================================
// 10. FILTRADO POR PRIORIDAD
// ============================================================
/* En el HTML tenemos un menú desplegable (<select id="filtro">) con las
| opciones: "Todas", "Alta", "Media" y "Baja".
| Queremos que, en el mismo instante en que el usuario elija otra opción
| de esa lista, el tablero se repinte mostrando solo las tareas de esa prioridad.
|
| 1. DESGLOSE DE LAS 3 PIEZAS DE LA INSTRUCCIÓN:
|    - $('#filtro'):
|      Seleccionamos el menú desplegable <select id="filtro"> del HTML.
|
|    - .addEventListener('change', ...):
|      Le ponemos un "micrófono" escuchando el evento 'change'.
|      En los desplegables <select>, el evento 'change' salta justo cuando
|      el usuario despliega la lista y hace clic en una opción diferente.
|
|    - renderizar (el segundo parámetro):
|      Es la función que queremos que se ejecute cuando ocurra ese cambio.
|
| 2. LA GRAN DUDA: ¿POR QUÉ ESCRIBIMOS `renderizar` Y NO `renderizar()`?
|    En JavaScript hay una diferencia enorme entre poner o no poner los paréntesis:
|
|    - CON PARÉNTESIS -> `renderizar()`: Significa "¡EJECÚTATE AHORA MISMO!".
|      Si escribiéramos:
|      $('#filtro').addEventListener('change', renderizar()); // <-- ¡ERROR!
|      Nada más abrir la página web, JavaScript llegaría a esta línea, vería
|      los paréntesis `()` y ejecutaría `renderizar()` de golpe sin que el usuario
|      haya tocado el desplegable. Y cuando luego el usuario cambiase el filtro,
|      no pasaría absolutamente nada.
|
|    - SIN PARÉNTESIS -> `renderizar`: Significa "TOMA LA RECETA PARA LUEGO".
|      Al escribir solo el nombre sin `()`, no estamos ejecutando la función;
|      le estamos entregando a `addEventListener` la referencia de la función  y 
|      diciéndole: "Guárdate esta función y NO la ejecutes todavía. Llámala
|      sólo cuando el usuario cambie una opción del desplegable".
|
| 3. RESUMEN:
|    Escribir esta línea corta:
|        $('#filtro').addEventListener('change', renderizar);
|    Hace EXACTAMENTE lo mismo que escribir una función flecha envolviéndola:
|        $('#filtro').addEventListener('change', () => {
|            renderizar();
|        });
| */
$('#filtro').addEventListener('change', renderizar);


// ============================================================
// 11. DELEGACIÓN DE EVENTOS EN EL TABLERO
// ============================================================
/* ¿QUÉ ES LA "DELEGACIÓN DE EVENTOS"?
|--------------------------------------------------------------------------
| Imagina un hotel con 100 habitaciones (nuestras tarjetas de tareas).
| Si quisiéramos saber cuándo alguien pide ayuda, tendríamos dos opciones:
|
|   - OPCIÓN MALA (Sin delegación): Poner un recepcionista dentro de cada
|     habitación, uno al lado de cada botón ("Anterior", "Siguiente", "Eliminar").
|     Problema: Si cada vez que llamamos a `renderizar()` tiramos las habitaciones
|     viejas y construimos habitaciones nuevas, todos esos recepcionistas
|     desaparecen y los botones nuevos dejan de funcionar.
|
|   - OPCIÓN BUENA (Con delegación de eventos): Ponemos UN ÚNICO recepcionista
|     en la puerta principal del edificio (`#tablero`), que nunca se destruye.
|     Cuando alguien pulsa un botón dentro de cualquier habitación, el "grito"
|     del clic sube por las escaleras hasta la recepción (eso se llama
|     "propagación" o "burbujeo"). El recepcionista de `#tablero` escucha el
|     clic y pregunta: "¿Desde qué botón y desde qué habitación han llamado?".
|
| Gracias a esto, aunque creemos 500 tareas nuevas, ¡sus botones funcionarán
| automáticamente desde el primer segundo sin añadirles ningún addEventListener! */

$('#tablero').addEventListener('click', event => {


    // 11.1. IDENTIFICAR EL BOTÓN PULSADO (¿QUIÉN HA GRITADO?)
    // --------------------------------------------------------
    /* Cuando haces clic en cualquier parte del tablero, `event` trae dos pistas clave:
     *   1. `event.target`: Es el punto EXACTO donde cayó la punta del ratón
     *      (puede ser un botón, el título h4, el fondo vacío de la columna...).
     *   2. `event.currentTarget`: Es el dueño del micrófono (siempre `#tablero`).
     *
     * Primera barrera de seguridad: comprobamos que donde se hizo clic sea una
     * etiqueta HTML real (`Element`). Si no lo es, salimos con `return`. */
    if (!(event.target instanceof Element)) {
        return;
    }

    /* ¿Qué hace `.closest('button[data-accion]')`?:
     * Parte desde el punto exacto del clic (`event.target`) y mira si eso es
     * un botón que tenga el atributo `data-accion` (ej. `<button data-accion="eliminar">`).
     * - Si pinchaste en el botón (o en un icono dentro del botón), te devuelve ese `<button>`.
     * - Si pinchaste fuera (en el fondo blanco del tablero o en el título), devuelve `null`. */
    const boton = event.target.closest('button[data-accion]');

    /* Si `boton` es `null` (`!boton`, porque el usuario hizo clic en una zona vacía)
     * o si por algún motivo ese botón no está dentro de `#tablero`, no hacemos nada y salimos. */
    if (!boton || !event.currentTarget.contains(boton)) {
        return;
    }


    // 11.2. LOCALIZAR LA TARJETA (¿DE QUÉ HABITACIÓN VIENE EL CLIC?)
    // --------------------------------------------------------
    /* Ya sabemos que han pulsado un botón (ej. "Eliminar"), pero... ¿el botón "Eliminar"
     * de QUÉ tarea? ¿De la tarea 1, de la 2 o de la 3?
     *
     * Como el `<button>` vive metido dentro de un `<article class="tarea" data-id="2">`,
     * usamos `boton.closest('.tarea')` para mirar "hacia arriba" (hacia sus padres HTML)
     * hasta encontrar la caja `<article class="tarea">` que envuelve a ese botón. */
    const tarjeta = boton.closest('.tarea');

    // Igual que antes: si no encuentra la tarjeta o no está dentro del tablero, salimos.
    if (!tarjeta || !event.currentTarget.contains(tarjeta)) {
        return;
    }


    // 11.3. RECUPERAR EL IDENTIFICADOR (LEER LA MATRÍCULA DE LA TARJETA)
    // --------------------------------------------------------
    /* Cuando creamos la tarjeta en `renderizar()`, le pegamos una pegatina invisible
     * en el HTML con su número de identificación: `<article class="tarea" data-id="2">`.
     *
     * - `tarjeta.dataset.id` lee esa pegatina, pero el HTML siempre nos la da como texto: `"2"`.
     * - Con `Number(...)` la convertimos en un número de verdad: `2`. */
    const id = Number(tarjeta.dataset.id);


    // 11.4. BUSCAR LA TAREA EN EL ARRAY (IR AL ALMACÉN DE DATOS)
    // --------------------------------------------------------
    /* Ahora que sabemos que queremos tocar la tarea con `id = 2`, tenemos que buscar
     * en qué posición (índice 0, 1, 2...) está guardada dentro de nuestro array `tareas`.
     *
     * `findIndex()` funciona igual que el `.find()` que vimos en la barbería, pero en
     * lugar de devolver el objeto entero, devuelve únicamente el NÚMERO DEL CAJÓN (su posición):
     * - Si la encuentra en el segundo cajón, devuelve `1`.
     * - Si no existe en todo el array, devuelve `-1`. */
    const indice = tareas.findIndex(tarea => tarea.id === id);

    // Si devolvió -1 (menor que 0), significa que no encontró la tarea y abortamos.
    if (indice < 0) {
        return;
    }


    // 11.5. RECUPERAR LA ACCIÓN (¿QUÉ BOTÓN DE LOS 3 HA PULSADO?)
    // --------------------------------------------------------
    /* Leemos la pegatina `data-accion` del botón que pulsó el usuario.
     * Solo puede contener una de estas tres palabras:
     *   - `'anterior'`
     *   - `'siguiente'`
     *   - `'eliminar'` */
    const accion = boton.dataset.accion;


    // 11.6. OPCIÓN A: ELIMINAR UNA TAREA
    // --------------------------------------------------------
    /* Si el botón era el de `'eliminar'`, usamos la tijera de los arrays: `.splice()`.
     * `tareas.splice(indice, 1)` significa:
     *   "Ve al cajón número `indice` del array `tareas` y borra `1` elemento". */
    if (accion === 'eliminar') {
        tareas.splice(indice, 1);
        avisar('Tarea eliminada correctamente');
    }


    // 11.7. OPCIÓN B: MOVER UNA TAREA ENTRE COLUMNAS (ESTADOS)
    // --------------------------------------------------------
    /* Si no era eliminar, miramos si el botón pulsado es `'anterior'` o `'siguiente'`.
     * Recuerdemos que arriba del todo tenemos esta lista ordenada de columnas:
     *   const estados = ['pendiente', 'en-proceso', 'completada'];
     *                    Posición 0    Posición 1    Posición 2 */
    else if (accion === 'anterior' || accion === 'siguiente') {

        /* PASO 1: ¿En qué número de columna está la tarea ahora mismo?
         * Si `tareas[indice].estado` es `'en-proceso'`, `estados.indexOf('en-proceso')`
         * busca esa palabra en el array `estados` y nos dice: "Está en la posición 1". */
        const actual = estados.indexOf(tareas[indice].estado);

        /* PASO 2: ¿Sumamos 1 o restamos 1? (Operador ternario `? :`)
         * Es un `if/else` comprimido en una sola línea:
         *   `condición ? valor_si_es_verdad : valor_si_es_mentira`
         * Pregunta: ¿El botón pulsado es `'siguiente'`?
         *   - Si es SÍ (`?`): `desplazamiento` vale `+1` (avanzamos a la derecha).
         *   - Si es NO (`:`): `desplazamiento` vale `-1` (retrocedemos a la izquierda). */
        const desplazamiento = accion === 'siguiente' ? 1 : -1;

        // PASO 3: Calculamos la nueva posición sumando la actual más el desplazamiento (ej. 1 + 1 = 2).
        const nuevoIndice = actual + desplazamiento;

        /* PASO 4: Barrera de seguridad para no salirnos del tablero.
         * Las columnas son 0, 1 y 2. Si `nuevoIndice` da -1 (intentar ir a la izquierda
         * desde 'pendiente') o da 3 (intentar ir a la derecha desde 'completada'), salimos. */
        if (nuevoIndice < 0 || nuevoIndice >= estados.length) {
            return;
        }

        /* PASO 5: Cambiamos el estado de la tarea por el nombre de la nueva columna
         * (ej. `estados[2]` es `'completada'`). */
        tareas[indice].estado = estados[nuevoIndice];
        avisar('Acción realizada: ' + accion);
    }


    // 11.8. DESCARTAR ACCIONES DESCONOCIDAS
    // --------------------------------------------------------
    else {
        return;
    }


    // 11.9. ACTUALIZAR EL TABLERO
    // --------------------------------------------------------
    /* Como ya hemos borrado la tarea o le hemos cambiado su `.estado` en el array `tareas`,
     * llamamos a `renderizar()` para que limpie las columnas y vuelva a pintar todas las
     * tarjetas en su sitio nuevo. */
    renderizar();
});


// 11.10. EDICIÓN RÁPIDA DEL TÍTULO CON DOBLE CLIC (dblclick)
// ============================================================
/* Aquí volvemos a usar el mismo truco del "recepcionista en la puerta" (`#tablero`),
 * pero esta vez escuchando el evento `'dblclick'` (cuando haces doble clic rápido).
 * Objetivo: que al hacer doble clic sobre el título (`<h4>`) de una tarea, puedas cambiarle el nombre. */
$('#tablero').addEventListener('dblclick', event => {

    /* 1. ¿Han hecho doble clic sobre el título `<h4>` de una tarjeta `.tarea`?
     *    Si hicieron doble clic en otro sitio, `titulo` será `null` y salimos con `return`. */
    const titulo = event.target.closest('.tarea h4');

    if (!titulo || !$('#tablero').contains(titulo)) {
        return;
    }

    /* 2. Buscamos a qué tarea pertenece ese título:
     *    - `titulo.closest('.tarea')` sube desde el `<h4>` hasta el `<article class="tarea">`.
     *    - `.dataset.id` lee su matrícula (ej. `"2"`) y `Number(...)` la pasa al número `2`.
     *    - `tareas.find(...)` busca y nos devuelve el objeto completo de esa tarea. */
    const tarea = tareas.find(
        t => t.id === Number(titulo.closest('.tarea').dataset.id)
    );

    if (!tarea) {
        return;
    }

    /* 3. Pedimos el nuevo nombre al usuario:
     *    `prompt(...)` abre una ventanita emergente del navegador con una caja de texto.
     *    - El primer dato (`'Nuevo título: '`) es la pregunta que muestra la ventana.
     *    - El segundo dato (`tarea.titulo`) es el texto que ya sale escrito por defecto
     *      para que el usuario no tenga que escribirlo desde cero. */
    const nuevo = prompt('Nuevo título: ', tarea.titulo);

    /* 4. Validamos lo que ha hecho el usuario en la ventanita:
     *    - Si pulsó el botón "Cancelar", `prompt` devuelve `null`.
     *    - Si borró todo y dejó solo espacios en blanco, `!nuevo.trim()` será `true`.
     *    En cualquiera de los dos casos, abortamos sin cambiar nada. */
    if (nuevo === null || !nuevo.trim()) {
        return;
    }

    /* 5. Guardamos el nuevo título:
     *    - `.trim()` le quita espacios sobrantes a los lados.
     *    - `.slice(0, 80)` corta el texto si supera los 80 caracteres (del carácter 0 al 80).
     *    - Repintamos el tablero con `renderizar()` y mostramos el aviso. */
    tarea.titulo = nuevo.trim().slice(0, 80);
    renderizar();
    avisar('Título actualizado');
});


// ============================================================
// 11.11. ATAJOS DE TECLADO GLOBALES (keydown)
// ============================================================
/* Ponemos una antena en todo el documento (`document`) que salta cada vez que el
 * usuario presiona cualquier tecla del teclado (`'keydown'`).
 * Sirve para añadir dos trucos de comodidad muy típicos de aplicaciones profesionales: */
document.addEventListener('keydown', event => {

    /* TRUCO 1: SALIR DE UN CAMPO PULSANDO LA TECLA 'Escape'
     * - `document.activeElement` nos dice dónde está metido el cursor de escribir ahora mismo.
     * - `.matches('input,select')` comprueba si ese elemento es una caja de texto o un desplegable.
     * - Si el usuario pulsa la tecla `'Escape'` mientras está dentro de una caja de texto,
     *   ejecutamos `.blur()` (lo contrario de `.focus()`), que saca el cursor de la caja. */
    if (
        event.key === 'Escape' &&
        document.activeElement.matches('input,select')
    ) {
        document.activeElement.blur();
        return;
    }

    /* TRUCO 2: IR DIRECTO AL BUSCADOR PULSANDO LA TECLA '/' (como en YouTube o GitHub)
     * - Si el usuario pulsa la barra `'/'`:
     *   1. `event.preventDefault()` evita que se escriba el símbolo `/` dentro del buscador.
     *   2. `$('#buscar').focus()` lleva el cursor directamente a la caja de buscar. */
    if (event.key === '/') {
        event.preventDefault();
        $('#buscar').focus();
    }

    /* PREPARACIÓN DE SEGURIDAD PARA FUTUROS ATAJOS:
     * Comprueba si el usuario está escribiendo dentro de un campo de texto (`editando`)
     * o si está haciendo combinaciones del sistema como Ctrl+C, Alt+Tab o Cmd+V
     * (`altKey`, `ctrlKey`, `metaKey`). Si es así, hace `return` para no interferir. */
    const editando =
        event.target.matches('input,textarea,select') ||
        event.target.isContentEditable;

    if (
        editando ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
    ) {
        return;
    }
});


// ============================================================
// 12. INICIALIZACIÓN DE LA APLICACIÓN
// ============================================================
/* Ejecutamos renderizar() al cargar el script para mostrar las tareas iniciales en pantalla
 * sin esperar a que el usuario realice una acción (limpia columnas, crea tarjetas y botones,
 * las inserta en sus columnas y emite el evento 'tareas:cambiadas'). */
renderizar();
