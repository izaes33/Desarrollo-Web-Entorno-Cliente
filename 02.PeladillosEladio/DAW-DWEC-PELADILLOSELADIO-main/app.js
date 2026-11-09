/*-------------------------------------------------------------------------
| PELADILLOS ELADIO - RESERVA DE SERVICIOS
|--------------------------------------------------------------------------
| Este archivo JavaScript contiene la lógica de una pequeña aplicación
| para gestionar servicios de una peluquería/barbería. En este código
| vamos a trabajar varios conceptos fundamentales de JavaScript:
|   Modo estricto: 'use strict'
|   Constantes y objetos
|   Arrays de objetos
|   Acceso a propiedades de objetos
|   Selección de elementos del DOM
|   Funciones
|   Intl.NumberFormat para formatear dinero
|   Escape de caracteres HTML
|   Métodos de arrays como find()
|   Funciones flecha
|   Bucles for...of
|   Template literals (plantillas de texto con ` `)
|   Generación dinámica de HTML
| 
| IDEA GENERAL DE LA APLICACIÓN
| --------------------------------
| Tenemos unos DATOS:
|                       TIENDA
|                       SERVICIOS
|                       EXTRAS
|                       DESCUENTOS
|              |
|              v
| Las funciones procesan la información:
|                                       formatMoney()
|                                       escapeHtml()
|                                       buscarServicio()
|                                       renderizarServicios()
|              |
|              v
| JavaScript puede generar/modificar HTML
|              |
|              v
| El usuario ve el resultado en el navegador.
|-------------------------------------------------------------------------- */


/*-------------------------------------------------------------------------
| 1. MODO ESTRICTO
|--------------------------------------------------------------------------
| 'use strict' activa el modo estricto de JavaScript. Hace que JavaScript
| sea menos permisivo con determinados errores. Por ejemplo, sin modo
| estricto podríamos cometer accidentalmente ciertos errores que JavaScript
| intentaría tolerar. Es recomendable utilizarlo para detectar errores
| más fácilmente y escribir código más controlado. */
'use strict';


/*-------------------------------------------------------------------------
| 2. DATOS GENERALES DE LA TIENDA
|--------------------------------------------------------------------------
| Creamos una constante llamada TIENDA. Su valor es un OBJETO. Un objeto
| permite agrupar varios datos relacionados utilizando propiedades:
|     propiedad: valor
| En este caso: nombre, divisa, idioma, edadMinima. Podemos acceder a sus
| propiedades utilizando el punto: TIENDA.nombre, TIENDA.divisa, TIENDA.idioma.
| Ejemplo: console.log(TIENDA.nombre); mostraría: Peladillos Eladio.
| IMPORTANTE: const impide reasignar la referencia de TIENDA:
|     TIENDA = otroObjeto;   // ❌ ERROR
| Pero el objeto sigue siendo mutable: podemos modificar, añadir o
| eliminar sus propiedades internas libremente:
|     TIENDA.edadMinima = 18;           // Modificar propiedad
|     TIENDA.telefono = '912345678';    // Añadir nueva propiedad
|     delete TIENDA.idioma;             // Eliminar propiedad
| (Para hacerlo 100% inmutable usaríamos Object.freeze(TIENDA)). */

const TIENDA = {
    nombre: 'Peladillos Eladio',
    divisa: 'EUR',
    idioma: 'es-ES',
    edadMinima: 16
};


/*-------------------------------------------------------------------------
| 3. ARRAY DE SERVICIOS
|--------------------------------------------------------------------------
| SERVICIOS es un ARRAY. Los corchetes [] indican que estamos creando un
| array: const SERVICIOS = [ ... ]; Cada elemento del array es, a su vez,
| un OBJETO. Por tanto tenemos:
|     ARRAY
|       |
|       +-- OBJETO servicio 1
|       +-- OBJETO servicio 2
|       +-- OBJETO servicio 3
| Cada servicio tiene:
|     id        -> identificador del servicio
|     name      -> nombre que verá el usuario
|     precio    -> precio del servicio
|     duracion  -> duración en minutos
|--------------------------------------------------------------------------
| ACCEDER A UN ELEMENTO DEL ARRAY
|--------------------------------------------------------------------------
| Los arrays comienzan en la posición 0. Por tanto: SERVICIOS[0] obtiene
| el primer objeto. Y: SERVICIOS[0].name obtiene la propiedad "name" del
| primer servicio. Ejemplo: SERVICIOS[0].name resultado: "Corte clásico" */

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


/*-------------------------------------------------------------------------
| 4. OBJETO DE EXTRAS
|--------------------------------------------------------------------------
| EXTRAS también es un objeto. Pero aquí tenemos objetos dentro de otro
| objeto:
|     EXTRAS
|       |
|       +-- lavado
|       |     |
|       |     +-- nombre
|       |     +-- precio
|       |
|       +-- cejas
|             |
|             +-- nombre
|             +-- precio
| Para obtener el nombre del lavado podemos utilizar: EXTRAS.lavado.nombre.
| JavaScript también permite acceder a propiedades utilizando []:
| EXTRAS['lavado'].nombre. Incluso podemos combinar ambas formas:
| EXTRAS.lavado["nombre"]. Las tres expresiones acceden al mismo dato. */

// Diferentes formas de acceder a las propiedades:

// EXTRAS.lavado.nombre
// EXTRAS['lavado'].nombre
// EXTRAS.lavado["nombre"]

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

/*-------------------------------------------------------------------------
| DIFERENCIA PRÁCTICA: ARRAY DE OBJETOS vs. OBJETO DE OBJETOS
|--------------------------------------------------------------------------
| ARRAY DE OBJETOS (SERVICIOS):Las cajas van numeradas (0, 1, 2).
|   Se usa para recorrer o pintar TODA la lista en pantalla.
|   Desventaja: para buscar uno concreto no puedes ir directo, tienes
|   que mirar dentro de caja en caja usando .find(). 
| const SERVICIOS = [ { id: 'clasico', ... }, { ... } ]
|    - Propósito: Listas ordenadas pensadas para recorrer, pintar en el
|      HTML, filtrar o reordenar (mantiene posiciones [0], [1]...).
|    - Recorrido: Directo con for...of, .map(), .filter(), .forEach().
|    - Búsqueda: Más lenta; obliga a recorrer el array con .find():
|      SERVICIOS.find(s => s.id === 'clasico');
|    - Cuándo usarlo: Cuando la prioridad es mostrar todos los elementos
|      en pantalla (tarjetas, desplegables, tablas).
|
| OBJETO DE OBJETOS (EXTRAS): Las cajas tienen etiqueta con nombre
|   ('lavado', 'cejas'). Se usa cuando ya se tiene ese nombre (p. ej: de un
|   checkbox) y se quiere sacar sus datos al instante poniendo EXTRAS['cejas'],
|   sin tener que buscar caja por caja.
| const EXTRAS = { lavado: { ... }, cejas: { ... } }
|    - Propósito: Diccionario o catálogo clave-valor para consultas rápidas.
|    - Búsqueda: Directa e instantánea sabiendo la clave, sin recorrer nada:
|      EXTRAS['lavado'] o EXTRAS.lavado.
|    - Recorrido: Menos directo; requiere Object.keys(), Object.values()
|      u Object.entries() para poder iterarlo.
|    - Cuándo usarlo: Cuando la prioridad es acceder a un elemento concreto
|      por su identificador (ej. sumar precios según los IDs marcados). */


/*-------------------------------------------------------------------------
| 5. CONSTANTES DE DESCUENTOS
|--------------------------------------------------------------------------
| Guardamos valores que utilizaremos posteriormente para realizar cálculos.
| 0.05 representa un 5 % (5 / 100 = 0.05), y 0.10 representa un 10 %
| (10 / 100 = 0.10). Al utilizar constantes evitamos escribir directamente
| números "mágicos" en diferentes lugares del programa. Es mucho más
| comprensible escribir: DESCUENTO_MIEMBROS que encontrar simplemente: 0.05
| sin saber qué representa. */

const DESCUENTO_MIEMBROS = 0.05;
const CODIGO_CUPON = 'ELADIO10';
const CUPON_DESCUENTO = 0.10;


/*-------------------------------------------------------------------------
| 6. OBTENEMOS ELEMENTOS DEL HTML (DOM)
|--------------------------------------------------------------------------
| document representa el documento HTML cargado en el navegador. querySelector()
| permite buscar un elemento dentro de ese documento. Cuando escribimos
| document.querySelector('#servicesGrid') estamos buscando el elemento cuyo
| atributo id sea: id="servicesGrid". El símbolo # significa que estamos
| buscando por ID. Una vez encontrado, guardamos el elemento en una constante
| para poder utilizarlo posteriormente desde JavaScript. Es decir:
|     HTML -> document.querySelector(...) -> constante JavaScript */

const servicesGrid = document.querySelector('#servicesGrid');
const serviceSelect = document.querySelector('#serviceSelect');
const bookingForm = document.querySelector('#bookingForm');
const ticketContent = document.querySelector('#ticketContent');
const formMessage = document.querySelector('#formMessage');


/*-------------------------------------------------------------------------
| 7. FUNCIÓN formatMoney()
|--------------------------------------------------------------------------
| Esta función recibe un número (importe) y devuelve un STRING formateado
| como una cantidad monetaria según el idioma y la divisa configurados.
| Ejemplo: formatMoney(10) podría devolver: "10,00 €". */

function formatMoney(importe) {

/* Creamos el objeto "formatter" con Intl.NumberFormat (herramienta de 
     * JavaScript para formatear números), pasándole dos argumentos:
     * 1. TIENDA.idioma ('es-ES'): indica el formato regional (España).
     * 2. Un objeto de opciones { ... }: donde style: 'currency' indica que es 
     *    formato monetario y currency: TIENDA.divisa ('EUR') define la moneda. */

    const formatter = new Intl.NumberFormat(
        TIENDA.idioma,
        {
            style: 'currency',
            currency: TIENDA.divisa
        }
    );

    /* format() transforma el número al formato correspondiente (ej.
     * formatter.format(10) -> "10,00 €"). return devuelve ese resultado al
     * lugar desde el que se llamó a la función. */
    return formatter.format(importe);
}


/*-------------------------------------------------------------------------
| 8. FUNCIÓN escapeHtml()
|--------------------------------------------------------------------------
| Esta función recibe un valor y prepara determinados caracteres especiales
| para poder mostrarlos como texto dentro de HTML. Primero utilizamos
| String(value) para convertirlo a texto y luego replaceAll() para sustituir:
|     <  ->  &lt;
|     >  ->  &gt;
|     &  ->  &amp;
| Lo que se está aplicando en esta sustitución es la codificación 
| HTML ENTITY (entidades HTML), un estándar de representación de caracteres 
| especiales que se puede consultar en diferentes guías o referencias.
| Esto evita que el texto se interprete como etiquetas HTML o con Js.
| IMPORTANTE: Reemplazamos & PRIMERO, ya que las entidades generadas
| después (&lt;, &gt;, &quot;) contienen &, y si lo hiciéramos al final
| romperíamos las entidades creadas.
|--------------------------------------------------------------------------
| ¿POR QUÉ EL RETURN VA AL PRINCIPIO?
|--------------------------------------------------------------------------
| En esta función, todo el bloque forma una ÚNICA instrucción continua 
| gracias al encadenamiento de métodos (method chaining). Cada .replaceAll() 
| se aplica directamente al resultado del anterior, de manera que la sentencia 
| no termina hasta llegar al punto y coma (;) del final de la última línea.
| Por tanto, el 'return' evalúa y procesa toda la cadena completa de transformaciones 
| antes de devolver el resultado definitivo, evitando tener que crear variables 
| intermedias y haciendo que el código sea más limpio y legible. Además,
| al poner String(value) al principio dentro del 'return', se está transformando 
| el valor inicial de inmediato. 
| Ese resultado convertido a texto es precisamente el que viaja y "alimenta" 
| a todas las líneas y métodos .replaceAll() que vienen a continuación.
|
| Es decir, el efecto es acumulativo y secuencial:
| 1. String(value) convierte el dato de entrada en texto plano.
| 2. El primer .replaceAll() limpia sobre ese texto ya convertido.
| 3. El siguiente .replaceAll() actúa sobre el resultado del anterior, y así 
|       sucesivamente hasta que el 'return' entrega el producto final limpio y seguro. */

function escapeHtml(value) {
    return String(value)
        // & se convierte en &amp;
        .replaceAll('&', '&amp;')
        // < se convierte en &lt;
        .replaceAll('<', '&lt;')
        // > se convierte en &gt;
        .replaceAll('>', '&gt;')
        // " se convierte en &quot;
        .replaceAll('"', '&quot;')
        // ' se convierte en &#039;
        .replaceAll("'", '&#039;');
}


/*-------------------------------------------------------------------------
| 9. FUNCIÓN buscarServicio()
|--------------------------------------------------------------------------
| Esta función recibe por parámetro el ID del servicio que queremos buscar
| (ej. buscarServicio('clasico')) y utiliza el método .find() para recorrer
| el array SERVICIOS hasta dar con el objeto que tenga ese mismo ID.
| Si lo encuentra, devuelve el objeto completo; si no, devuelve undefined. */

function buscarServicio(id) {
    return SERVICIOS.find(

        /* .find() funciona como un bucle automático que examina el array
         * elemento por elemento. Para saber qué buscar, necesita que le 
         * pasemos una función de prueba (aquí usamos una función flecha, 
         * equivalente a una función anónima en PHP):
         *
         * 1. (servicio): Es el parámetro de entrada de la función flecha.
         *    Es una variable temporal que solo vive aquí dentro y que, en
         *    cada vuelta, representa el objeto del array que se está 
         *    revisando en ese momento (primero el corte clásico, luego el fade...).
         *
         * 2. => servicio.id === id: Es la condición (y tiene un return implícito).
         *    Compara el ID del objeto actual (servicio.id) con el ID que 
         *    recibió buscarServicio(id):
         *    - Si da FALSE: .find() pasa a comprobar el siguiente objeto.
         *    - Si da TRUE: .find() detiene la búsqueda inmediatamente y 
         *      devuelve ese objeto 'servicio' completo. */

        (servicio) => servicio.id === id
    );
}


/*-------------------------------------------------------------------------
| 10. FUNCIÓN renderizarServicios()
|--------------------------------------------------------------------------
| Esta función recorre el array SERVICIOS mediante un bucle for...of,
| genera dinámicamente el código HTML de cada servicio (tanto las tarjetas
| informativas como las opciones del desplegable <select>) y finalmente 
| lo inyecta en el documento (DOM) usando la propiedad innerHTML. */
function renderizarServicios() {

    /* 1. INICIALIZACIÓN DE VARIABLES ACUMULADORAS:
     * - cardsHtml comienza como un string vacío ('') donde iremos sumando
     *   las tarjetas (<article>) de cada servicio.
     * - optionHtml comienza ya con la primera etiqueta <option> por defecto
     *   (deshabilitada y seleccionada) para que el usuario vea el texto
     *   "- Selecciona el servicio -" antes de desplegar la lista. */
    let cardsHtml = '';
    let optionHtml = `
     <option value="" selected disabled>
        - Selecciona el servicio -
     </option>
    `;

    /* 2. RECORRIDO DEL ARRAY CON for...of:
     * El bucle for...of recorre SERVICIOS de principio a fin. En cada vuelta,
     * la constante 'servicio' guarda temporalmente el objeto del servicio actual
     * (vuelta 1: Corte clásico, vuelta 2: Corte fade, vuelta 3: Corte brocoli). */
    for (const servicio of SERVICIOS) {

        /* 3. TEMPLATE LITERALS (` `) Y OPERADOR DE ACUMULACIÓN (+=):

         * - Para incrustar variables o funciones de JS dentro de un texto HTML
         *   no sirven las comillas simples ('') ni dobles (""): es obligatorio
         *   usar acentos graves o backticks (` `), también conocidos como
         *   Template Literals o plantillas de texto.
         * 
         * - Con la sintaxis ${expresión} (interpolación) inyectamos los datos
         *   de cada objeto (ej. ${servicio.name}) o el resultado de una función
         *   (ej. ${formatMoney(servicio.precio)}).
         * 
         * - El operador += ("concatenar y asignar") añade el HTML de la vuelta
         *   actual al final de lo que ya hubiera guardado en la variable,
         *   evitando que se sobrescriban y se pierdan los servicios anteriores. */

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

    /* 4. VOLCADO AL DOM (PINTAR EN EL NAVEGADOR):
     * Una vez terminado el bucle, las variables son simples textos largos con
     * etiquetas HTML. Al asignarlos a la propiedad .innerHTML de los elementos
     * del DOM, el navegador interpreta ese texto y dibuja los elementos reales
     * en la página web. */
    servicesGrid.innerHTML = cardsHtml;
    serviceSelect.innerHTML = optionHtml;
}


/*-------------------------------------------------------------------------
| FUNCIÓN: renderizarServiciosCreate()
|--------------------------------------------------------------------------
| OBJETIVO: Recorre el array SERVICIOS y construye las tarjetas HTML creando
| directamente nodos del DOM en memoria mediante document.createElement()
| (una alternativa más segura y estructurada que concatenar texto con innerHTML).
|
| FLUJO DE TRABAJO EN CADA VUELTA:
| 1. Crear el contenedor <article> y añadirle su clase CSS.
| 2. Crear los elementos hijos (<h3>, <p>, <span>) y rellenar su texto.
| 3. Meter los hijos dentro del <article> con append().
| 4. Inyectar el <article> terminado en la página web (servicesGrid). */

function renderizarServiciosCreate() {

    /* RECORRIDO DEL ARRAY CON for...of:
     * En cada vuelta del bucle, la constante 'servicio' guarda el objeto
     * del servicio actual. Usamos 'const' porque dentro de una misma vuelta
     * no reasignamos la variable; en la siguiente vuelta, JavaScript crea
     * una constante nueva automáticamente con el siguiente servicio. */
    for (const servicio of SERVICIOS) {

        /* 1. CREAR EL CONTENEDOR <article> Y SU CLASE CSS:
         * - document.createElement('article') fabrica una etiqueta <article></article>
         *   en la memoria de JavaScript (todavía no es visible en la página web).
         * - article.classList.add('card') le añade el atributo class="card"
         *   para que se le apliquen los estilos CSS (<article class="card"></article>). */
        const article = document.createElement('article');
        article.classList.add('card');

        /* 2. CREAR EL TÍTULO <h3>:
         * - Creamos la etiqueta <h3></h3> en memoria.
         * - Con la propiedad .textContent metemos el nombre del servicio dentro
         *   de la etiqueta (<h3>Corte clásico</h3>).
         * - VENTAJA DE SEGURIDAD: A diferencia de innerHTML, textContent inserta
         *   siempre texto plano (nunca interpreta etiquetas HTML), evitando
         *   inyecciones de código sin necesidad de usar escapeHtml(). */
        const title = document.createElement('h3');
        title.textContent = servicio.name;

        /* 3. CREAR EL PÁRRAFO DE DURACIÓN <p>:
         * - Creamos la etiqueta <p></p> en memoria.
         * - Usamos template literals (` `) para unir la duración numérica con
         *   la palabra "min" y lo asignamos como su contenido de texto (<p>25 min</p>). */
        const duracion = document.createElement('p');
        duracion.textContent = `${servicio.duracion} min`;

        /* 4. CREAR EL ELEMENTO DEL PRECIO <span>:
         * - Creamos un <span></span>, le añadimos la clase CSS 'price' y le
         *   asignamos el precio ya formateado en euros mediante formatMoney()
         *   (<span class="price">12,00 €</span>). */
        const precio = document.createElement('span');
        precio.classList.add('price');
        precio.textContent = formatMoney(servicio.precio);

        /* 5. ENSAMBLAR LA TARJETA (METER LOS HIJOS DENTRO DEL <article>):
         * Hasta aquí teníamos 4 piezas sueltas en memoria (article, title, duracion
         * y precio). Con article.append(...) metemos el título, la duración y el
         * precio dentro de la etiqueta <article>, exactamente en ese orden. */
        article.append(
            title,
            duracion,
            precio
        );

        /* 6. VOLCADO AL DOM (MOSTRAR LA TARJETA EN LA PÁGINA):
         * Ahora que el <article> está completo con sus 3 elementos dentro,
         * lo insertamos como hijo final dentro del contenedor real de la página
         * (servicesGrid). En este instante pasa a ser visible en el navegador. */
        servicesGrid.append(article);

    }

}


/*-------------------------------------------------------------------------
| FUNCIÓN: leerFormulario()
|--------------------------------------------------------------------------
| OBJETIVO: Captura todos los valores que el usuario ha introducido en el
| formulario HTML mediante la herramienta FormData, limpia posibles espacios
| en blanco, convierte cada dato al tipo adecuado (texto, número, array o
| booleano) y los devuelve empaquetados dentro de un único objeto JavaScript.
|
| FLUJO DE TRABAJO:
| Formulario HTML -> new FormData() -> .get() / .getAll() -> Limpieza y
| conversión de tipos -> Objeto literal con los datos de la reserva. */

function leerFormulario() {

    /* 1. CAPTURAR EL FORMULARIO CON FormData:
     * - new FormData(bookingForm) toma una "fotografía" instantánea de todos
     *   los campos del formulario HTML (inputs, selects, checkboxes) que tengan
     *   un atributo 'name' definido (ej. <input name="clientName">).
     * - Guardamos esa información en la constante 'datos', que nos permite
     *   extraer los valores usando los métodos .get() y .getAll(). */
    const datos = new FormData(bookingForm);

    /* 2. LEER Y LIMPIAR EL NOMBRE (lectura de dentro hacia fuera):
     * - String(...): asegura que el valor sea tratado como cadena de texto.     
     * - datos.get('clientName'): busca el valor del <input name="clientName">.
     * - ?? '' (operador de coalescencia nula): si el campo no existiera y
     *   devolviese null o undefined, usa un texto vacío ('') por seguridad.
     * - .trim(): elimina los espacios en blanco sobrantes al principio y al
     *   final. */
    const nombre = String(datos.get('clientName') ?? '').trim();

    /* 3. LEER Y CONVERTIR LA EDAD A NÚMERO:
     * - Los formularios HTML entregan siempre los datos como texto (por ejemplo,
     *   "25" en lugar del número 25).
     * - Con Number(...) convertimos ese texto a un número real para poder hacer
     *   comparaciones matemáticas después. Si el usuario escribió letras no
     *   válidas, Number() devolverá NaN (Not a Number). */
    const edad = Number(datos.get('age'));

    /* 4. OBTENER EL ARRAY DE EXTRAS SELECCIONADOS (.getAll y .map(String))
       - datos.getAll('extras'): Recoge TODOS los checkboxes marcados que tengan
|        name="extras" y los agrupa en un array (ej. ['lavado', 'cejas']), o []
|        si no se marcó ninguno. (Si usáramos .get(), solo nos daría el primero).
|
|      - ¿QUÉ HACE .map(String) Y POR QUÉ CONVERTIR A STRING?:
|         1. String() es una función de JS que convierte cualquier dato a texto
|            (ej: String(123) -> '123').
|         2. .map() es un método que recorre el array elemento por elemento, le
|             aplica una función a cada uno y devuelve un array nuevo con el resultado.
|         3. Al escribir .map(String), le decimos a JS: "pasa por cada elemento del
|            array y aplícale String() para garantizar que todos sean texto plano".
|            (Es la forma abreviada de escribir: .map(item => String(item))).
|         4. ¿Por qué se hace si un checkbox ya devuelve texto? Porque FormData
|            también puede contener archivos (objetos File) si hubiera un input de
|            tipo file. Con .map(String) blindamos el código asegurándonos al 100%
|            de que el array solo contiene cadenas de texto (strings). */
    const extras = datos.getAll('extras').map(String);

    /* 5. OBTENER Y NORMALIZAR EL CÓDIGO DE CUPÓN:
     * - Obtenemos el valor del campo 'coupon' (o '' si es nulo).
     * - .trim() quita espacios accidentales a los lados.
     * - .toUpperCase() convierte todo a MAYÚSCULAS. Así, aunque el usuario
     *   escriba " eladio10 " en minúsculas, lo transformamos en "ELADIO10"
     *   para que coincida exactamente con nuestra constante CODIGO_CUPON. */
    const coupon = String(datos.get('coupon') ?? '').trim().toUpperCase();

    /* 6. OBTENER EL IDENTIFICADOR DEL SERVICIO:
     * - Recupera el atributo 'value' de la opción elegida en el desplegable
     *   <select name="service"> (ej. 'clasico').
     * - Guardamos solo su ID (y no el precio) porque luego usaremos ese ID
     *   para buscar el objeto completo en nuestro array SERVICIOS. */
    const servicioId = String(datos.get('service') ?? '');

    /* 7. OBTENER EL DÍA SELECCIONADO:
     * - Extrae el valor elegido en el desplegable <select name="day"> (ej. 'Lunes').
     * - Si el usuario no ha elegido ningún día todavía, el valor será ''. */
    const dia = String(datos.get('day') ?? '');

    /* 8. COMPROBAR SI ES MIEMBRO (CONVERTIR A BOOLEANO):
     * - En un checkbox sin atributo value específico (<input type="checkbox" name="member">),
     *   FormData devuelve 'on' si está marcado o null si está desmarcado.
     * - Al compararlo con === 'on', transformamos esa respuesta en un valor
     *   booleano puro: true (si está marcado) o false (si no lo está). */
    const esMiembro = datos.get('member') === 'on';

    /* 9. DEVOLVER TODOS LOS DATOS AGRUPADOS EN UN OBJETO:
     * - Empaquetamos las 7 variables dentro de un objeto literal { ... }
     *   directamente con los nombres de las variables, sin escribir pares
     *   explícitos "clave: valor" (ej. evitando poner nombre: nombre).
     * - Esta forma abreviada de agrupar datos se utiliza cuando la
     *   estructura que devuelve la función es fija (siempre
     *   tiene el mismo número de elementos, el mismo tipo de datos y el mismo
     *   orden), lo que resulta más rápido y limpio de escribir que definir
     *   manualmente una colección clave-valor tradicional.
     * - Si la estructura fuera variable (por ejemplo, si algunos campos como
     *   'dia' pudieran omitirse o cambiar), sería más seguro especificar
     *   explícitamente el diccionario clave-valor.
     * - Al llamar más adelante a leerFormulario(), guardaremos este objeto
     *   en una constante (ej. const reserva = leerFormulario()) para recorrer
     *   o acceder a sus propiedades fácilmente. */
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


/*-------------------------------------------------------------------------
| FUNCIÓN: validarReserva()
|--------------------------------------------------------------------------
| OBJETIVO: Comprobar que los datos introducidos por el usuario cumplen con
| las reglas de la aplicación antes de procesar la reserva.
|
| - RECIBE: El objeto 'reserva' (que viene de leerFormulario() con los datos
|   del cliente y del servicio: nombre, edad, servicioId, dia...).
| - DEVUELVE: Un array ('errores') con los textos de todos los fallos encontrados:
|   * Si todo está bien -> devuelve un array vacío: []
|   * Si hay fallos     -> devuelve ej.: ['Escribe tu nombre', 'Selecciona un día']
|
| ¿POR QUÉ USAMOS UN ARRAY Y VARIOS 'if' INDEPENDIENTES?:
| Porque el usuario puede equivocarse en varias cosas a la vez (dejar el
| nombre en blanco Y no elegir día). Al usar 'if' separados en lugar de
| 'else if', el código revisa todos los campos de arriba a abajo y mete
| todos los fallos encontrados dentro del array para mostrarlos juntos. */
function validarReserva(reserva) {

    /* 1. CREAR EL ARRAY DE ERRORES (LA "CESTA" DE FALLOS):
     * Inicializamos una lista vacía []. Empezamos asumiendo que no hay errores;
     * si alguna prueba de abajo falla, meteremos el mensaje aquí con .push(). */
    const errores = [];

    /* 2. COMPROBAR EL NOMBRE (OPERADOR DE NEGACIÓN '!'):
     * - En JavaScript, un texto vacío ('') se considera equivalente a falso (falsy).
     * - El símbolo '!' delante (!reserva.nombre) invierte ese valor y se lee
     *   como "SI NO HAY nombre" (es decir, si el usuario lo dejó en blanco).
     * - Si está vacío, la condición se cumple y .push() añade el mensaje al final
     *   del array 'errores'. */
    if (!reserva.nombre) {
        //Utilizamos push() en vez de add() para añadir un nuevo elemento al final del array 'errores', y no al principio.
        errores.push('Escribe tu nombre');
    }

    /* 3. COMPROBAR LA EDAD (DOS FILTROS CON if / else if):
     * - PRIMERA PRUEBA: Number.isNaN(reserva.edad) comprueba si la edad NO es
     *   un número válido (NaN = Not a Number, por ejemplo si escribió letras).
     * - SEGUNDA PRUEBA (else if): Si sí es un número, miramos que sea coherente
     *   usando el operador '||' (O lógico): si la edad es menor que la mínima
     *   permitida (16) O es mayor de 120 años, añadimos el aviso de error. */
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

    /* 4. COMPROBAR QUE EL SERVICIO ELEGIDO EXISTE:
     * - Llamamos a nuestra función buscarServicio(reserva.servicioId).
     * - Si el usuario eligió un servicio válido, devuelve el objeto del servicio;
     *   si no eligió ninguno (o no existe), devuelve 'undefined' (que es falsy).
     * - Al poner '!' delante (!buscarServicio(...)), preguntamos: "¿NO se ha
     *   encontrado ningún servicio?". Si no existe, guardamos el error. */
    if (!buscarServicio(reserva.servicioId)) {
        errores.push('El servicio no existe');
    }

    /* 5. COMPROBAR QUE SE HA SELECCIONADO UN DÍA:
     * - Igual que con el nombre: si el usuario no eligió día en el desplegable,
     *   reserva.dia vale '' (vacío). Con !reserva.dia ("si no hay día")
     *   detectamos el fallo y añadimos el mensaje al array. */
    if (!reserva.dia) {
        errores.push('Selecciona un día');
    }

    /* 6. DEVOLVER LA LISTA DE ERRORES:
     * - Entregamos el array 'errores' a quien llamó a la función.
     * - Más adelante, el programa mirará cuántos elementos tiene este array
     *   (errores.length): si tiene 0, procesará la reserva; si tiene más de 0,
     *   mostrará los mensajes de error en pantalla. */
    return errores;
}


function comprobarServicio(id){
    return SERVICIOS.find(
        servicio => servicio.id === id
    );
}


/*-------------------------------------------------------------------------
| FUNCIÓN: calcularReserva()
|--------------------------------------------------------------------------
| OBJETIVO: Calcular todos los importes de la reserva (subtotal, descuentos
| y total) a partir de las elecciones del usuario, sin modificar en ningún
| momento los datos originales de SERVICIOS, EXTRAS ni de la propia reserva.
|
| - RECIBE: El objeto 'reserva' (que viene de leerFormulario() con servicioId,
|   extras, esMiembro, coupon...).
| - DEVUELVE: Un nuevo objeto con todo el desglose financiero y los objetos
|   completos del servicio y de los extras para poder pintar el ticket después. */

function calcularReserva(reserva) {

    /* PASO 1. BUSCAR EL SERVICIO ELEGIDO:
     * - Usamos nuestra función buscarServicio() pasándole el ID que eligió el
     *   usuario (ej. 'clasico').
     * - Nos devuelve el objeto completo del servicio ({ id, name, precio, duracion })
     *   o 'undefined' si el usuario aún no ha seleccionado ninguno en el formulario. */
    const servicio = buscarServicio(reserva.servicioId);

    /* PASO 2. OBTENER EL PRECIO INICIAL (SUBTOTAL):
     * - Declaramos 'subtotal' con 'let' (y no con 'const') porque su valor irá
     *   aumentando más abajo cuando le sumemos los extras, o disdminuyendo si hubiera descuentos.
     * - ENCADENAMIENTO OPCIONAL (?.): Si 'servicio' existe, servicio?.precio
     *   saca su precio. Pero si 'servicio' es undefined (porque aún no
     *   se eligió ninguno), el '?.' evita que el programa se rompa con un error
     *   y devuelve 'undefined'.
     * - COALESCENCIA NULA (?? 0): Si la parte izquierda dio 'undefined', el '?? 0'
     *   pone un 0 por defecto para poder seguir sumando sin que salte NaN. */
    let subtotal = servicio?.precio ?? 0;

    /* Creamos un array vacío donde iremos guardando los objetos completos de los
     * extras seleccionados (ej. { nombre: 'Pulido de cejas', precio: 3 }) para
     * luego poder mostrar sus nombres en el ticket final. */
    const extrasDetalle = [];

    /* PASO 3 Y 4. RECORRER Y SUMAR LOS EXTRAS SELECCIONADOS:
     * - reserva.extras es un array con los textos de los checkboxes marcados
     *   (por ejemplo: ['lavado', 'cejas']).
     * - Con for...of sacamos cada texto en la variable 'extraID' vuelta a vuelta. */
    for (const extraID of reserva.extras) {

        /* ¿QUÉ SIGNIFICA "EXTRAS[extraID]" Y POR QUÉ USAMOS CORCHETES?
            nuestro catálogo de extras en el código se estructura:
                    const EXTRAS = {
                        lavado: { nombre: 'Lavado gostoso', precio: 100 },
                        cejas:  { nombre: 'Pulido de cejas', precio: 3 }
                    };
            'EXTRAS' NO es un array (no usa corchetes por fuera ni se numera como [0], [1]),
            sino que es un **Objeto Literal** (un diccionario de tipo clave: valor).
            ¿CÓMO FUNCIONA EXTRAS[extraID]?:
            1. El bucle `for...of` nos va dando en cada vuelta el texto del extra que
                marcó el usuario en el formulario (por ejemplo, la palabra 'lavado' o 'cejas'),
                y la guarda en la variable `extraID`.
            2. Como 'EXTRAS' es un objeto, podemos buscar dentro de él usando la 
                notación de corchetes `EXTRAS[extraID]` (que es exactamente igual a escribir 
                `EXTRAS['lavado']` o `EXTRAS.lavado`).
            3. JavaScript coge esa clave, va directo a la "caja" con ese nombre dentro 
                del objeto EXTRAS, y rescata el objeto interno con su nombre y su precio 
                (guardándolo en la constante `extra`), ahorrándonos tener que usar 
                métodos de búsqueda lentos como `.find()`. */            
        const extra = EXTRAS[extraID];

        /* Comprobación de seguridad: si por algún motivo el extraID no existiera
         * dentro de nuestro catálogo EXTRAS (!extra), la palabra 'continue' salta
         * inmediatamente a la siguiente vuelta del bucle ignorando las líneas de abajo. */
        if (!extra) {
            continue;
        }

        /* Si el extra es válido, sumamos su precio a lo que ya llevara 'subtotal'
         * (subtotal += extra.precio equivale a: subtotal = subtotal + extra.precio). */
        subtotal += extra.precio;

        /* Y guardamos el objeto completo de ese extra en nuestra lista 'extrasDetalle'. */
        extrasDetalle.push(extra);
    }

    /* PASO 5, 6 Y 7. CALCULAR LOS DESCUENTOS ACUMULABLES:
     * - Empezamos con el porcentaje a 0 (usamos 'let' porque puede cambiar).
     * - Usamos dos 'if' independientes porque los descuentos son acumulables:
     *   1. Si el checkbox de miembro está activo (true), sumamos 0.05 (5%).
     *   2. Si el cupón escrito coincide con CODIGO_CUPON ('ELADIO10'), sumamos 0.10 (10%).
     *   (Si cumple ambos, porcentajeDescuento valdrá 0.15, es decir, un 15%). */
    let porcentajeDescuento = 0;

    if (reserva.esMiembro) {
        porcentajeDescuento += DESCUENTO_MIEMBROS;
    }

    if (reserva.coupon === CODIGO_CUPON) {
        porcentajeDescuento += CUPON_DESCUENTO;
    }

    /* PASO 8. CALCULAR EL DINERO DESCONTADO Y EL TOTAL A PAGAR:
     * - Multiplicamos el subtotal por el tanto por uno (ej. 15 € * 0.15 = 2.25 € de ahorro).
     * - Restamos ese descuento al subtotal para obtener el precio final ('total'). */
    const descuento = subtotal * porcentajeDescuento;

    const total = subtotal - descuento;

    /* PASO 9. DEVOLVER TODOS LOS RESULTADOS EMPAQUETADOS:
     * Retornamos un objeto literal usando la sintaxis abreviada con todas las
     * piezas calculadas para que renderizarTicket() y el formulario puedan mostrarlas. */
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