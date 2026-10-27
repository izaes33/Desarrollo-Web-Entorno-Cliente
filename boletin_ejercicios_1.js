// =========================================================================
// BOLETÍN DE EJERCICIOS - JAVASCRIPT I
// Variables, tipos, ámbito, operadores y conversiones
// =========================================================================

// -------------------------------------------------------------------------
// Ejercicio 1: const y let
// -------------------------------------------------------------------------
console.log('--- EJERCICIO 1: const y let ---');
// Usamos const para valores que no van a cambiar y let para los que sí cambiarán (como la edad o el curso).
const nombreAlumno = 'Juan Pérez';
let edad = 20;
const centro = 'IES Ejemplo';
let curso = '1º DAW';

// 1. Muestra todas las variables por consola
console.log('Nombre:', nombreAlumno);
console.log('Edad:', edad);
console.log('Centro:', centro);
console.log('Curso:', curso);

// 2. Simula que ha pasado un año y modifica edad
edad = edad + 1;

// 3. Vuelve a mostrarla
console.log('Edad tras un año:', edad);

// 4. Razonamiento: Si intentásemos reasignar una variable declarada con const
// (por ejemplo: nombreAlumno = 'Pedro';), JavaScript lanzaría un error de ejecución:
// TypeError: Assignment to constant variable, ya que const impide la reasignación.


// -------------------------------------------------------------------------
// Ejercicio 2: Identificando tipos
// -------------------------------------------------------------------------
console.log('\n--- EJERCICIO 2: Identificando tipos ---');
const producto = 'Champú';
const precio = 12.5;
const disponible = true;
let datoDesconocido;
const datoSinValor = null;

console.log('Producto:', producto);
console.log('Tipo:', typeof producto);

console.log('Precio:', precio);
console.log('Tipo:', typeof precio);

console.log('Disponible:', disponible);
console.log('Tipo:', typeof disponible);

console.log('Dato desconocido:', datoDesconocido);
console.log('Tipo:', typeof datoDesconocido);

console.log('Dato sin valor:', datoSinValor);
console.log('Tipo:', typeof datoSinValor); // Nota: typeof null devuelve 'object' por un comportamiento histórico de JS


// -------------------------------------------------------------------------
// Ejercicio 3: ¿Qué tipo será?
// -------------------------------------------------------------------------
console.log('\n--- EJERCICIO 3: ¿Qué tipo será? ---');
const a = 25;
const b = '25';
const c = true;
let d;
const e = null;
const f = [1, 2, 3];
const g = {
    nombre: 'Eladio'
};

console.log(typeof a); // 'number'
console.log(typeof b); // 'string'
console.log(typeof c); // 'boolean'
console.log(typeof d); // 'undefined'
console.log(typeof e); // 'object'
console.log(typeof f); // 'object' (los arrays en JS son de tipo object)
console.log(typeof g); // 'object'


// -------------------------------------------------------------------------
// Ejercicio 4: Tipado dinámico
// -------------------------------------------------------------------------
console.log('\n--- EJERCICIO 4: Tipado dinámico ---');
let resultado = 10;
console.log('Valor:', resultado);
console.log('Tipo:', typeof resultado);

resultado = 'Diez';
console.log('Valor:', resultado);
console.log('Tipo:', typeof resultado);

resultado = true;
console.log('Valor:', resultado);
console.log('Tipo:', typeof resultado);

resultado = null;
console.log('Valor:', resultado);
console.log('Tipo:', typeof resultado);


// -------------------------------------------------------------------------
// Ejercicio 5: Ámbito de bloque
// -------------------------------------------------------------------------
console.log('\n--- EJERCICIO 5: Ámbito de bloque ---');
/*
Respuestas al análisis:
1. ¿Qué console.log() funcionarán?
   Funcionarán los tres console.log() dentro del bloque if(true) y el primer console.log(nombre) fuera del if.
2. ¿Cuáles producirán un error?
   Producirán un error (ReferenceError: edad/ciudad is not defined) los console.log(edad) y console.log(ciudad) que están fuera del bloque if.
3. ¿Por qué?
   Porque las variables declaradas con const y let tienen ámbito de bloque (block scope): solo existen dentro de las llaves { } donde fueron declaradas.
*/

// Código corregido para que no produzca ningún error (declarando las variables en el ámbito superior):
const nombreEj5 = 'Ana';
const edadEj5 = 24;
let ciudadEj5 = 'Lorca';

if (true) {
    console.log(nombreEj5);
    console.log(edadEj5);
    console.log(ciudadEj5);
}

console.log(nombreEj5);
console.log(edadEj5);
console.log(ciudadEj5);


// -------------------------------------------------------------------------
// Ejercicio 6: Calculadora básica
// -------------------------------------------------------------------------
console.log('\n--- EJERCICIO 6: Calculadora básica ---');
let numero1 = 20;
let numero2 = 6;

console.log('Suma:', numero1 + numero2);
console.log('Resta:', numero1 - numero2);
console.log('Multiplicación:', numero1 * numero2);
console.log('División:', numero1 / numero2);
console.log('Resto:', numero1 % numero2);

// Cambiamos los números para comprobar que sigue funcionando
numero1 = 15;
numero2 = 3;
console.log('--- Tras cambiar los números (15 y 3) ---');
console.log('Suma:', numero1 + numero2);
console.log('Resta:', numero1 - numero2);
console.log('Multiplicación:', numero1 * numero2);
console.log('División:', numero1 / numero2);
console.log('Resto:', numero1 % numero2);


// -------------------------------------------------------------------------
// Ejercicio 7: Pares e impares
// -------------------------------------------------------------------------
console.log('\n--- EJERCICIO 7: Pares e impares ---');
const numPar1 = 8;
const numPar2 = 17;
const numPar3 = 24;

console.log(`¿${numPar1} es par?`, numPar1 % 2 === 0);
console.log(`¿${numPar2} es par?`, numPar2 % 2 === 0);
console.log(`¿${numPar3} es par?`, numPar3 % 2 === 0);


// -------------------------------------------------------------------------
// Ejercicio 8: El peligro del +
// -------------------------------------------------------------------------
console.log('\n--- EJERCICIO 8: El peligro del + ---');
console.log(10 + 5);     // Predicción: 15 (number)
console.log('10' + 5);   // Predicción: '105' (string)
console.log(10 + '5');   // Predicción: '105' (string)
console.log('10' + '5'); // Predicción: '105' (string)
console.log(10 - 5);     // Predicción: 5 (number)
console.log('10' - 5);   // Predicción: 5 (number)
console.log(10 * '5');   // Predicción: 50 (number)

/*
Explicación:
1. ¿Por qué '10' + 5 no produce 15?
   Porque el operador '+' sirve tanto para sumar números como para concatenar cadenas de texto (strings). Si uno de los operandos es un string, prioriza la concatenación.
2. ¿Por qué el comportamiento de '-' (y '*') es diferente?
   Porque los operadores '-' y '*' son exclusivamente matemáticos; no existen para cadenas de texto, por lo que obligan a convertir los operandos a números.
3. ¿Qué está haciendo JavaScript automáticamente?
   Está realizando una conversión implícita de tipos (coerción de tipos).
*/


// -------------------------------------------------------------------------
// Ejercicio 9: Conversión explícita
// -------------------------------------------------------------------------
console.log('\n--- EJERCICIO 9: Conversión explícita ---');
const precioEj9 = '25';
const gastosEnvioEj9 = 5;

const precioConvertido = Number(precioEj9);
console.log(precioConvertido + gastosEnvioEj9); // Muestra 30

console.log('Tipo de precio antes de convertirlo:', typeof precioEj9);
console.log('Tipo del valor convertido:', typeof precioConvertido);


// -------------------------------------------------------------------------
// Ejercicio 10: Number(), String() y Boolean()
// -------------------------------------------------------------------------
console.log('\n--- EJERCICIO 10: Number(), String() y Boolean() ---');

// 1. '123' -> number
const orig1 = '123';
const conv1 = Number(orig1);
console.log('Valor original:', orig1, '| Tipo original:', typeof orig1);
console.log('Valor convertido:', conv1, '| Tipo convertido:', typeof conv1);

// 2. 25 -> string
const orig2 = 25;
const conv2 = String(orig2);
console.log('Valor original:', orig2, '| Tipo original:', typeof orig2);
console.log('Valor convertido:', conv2, '| Tipo convertido:', typeof conv2);

// 3. true -> string
const orig3 = true;
const conv3 = String(orig3);
console.log('Valor original:', orig3, '| Tipo original:', typeof orig3);
console.log('Valor convertido:', conv3, '| Tipo convertido:', typeof conv3);

// 4. 1 -> boolean
const orig4 = 1;
const conv4 = Boolean(orig4);
console.log('Valor original:', orig4, '| Tipo original:', typeof orig4);
console.log('Valor convertido:', conv4, '| Tipo convertido:', typeof conv4);

// 5. 0 -> boolean
const orig5 = 0;
const conv5 = Boolean(orig5);
console.log('Valor original:', orig5, '| Tipo original:', typeof orig5);
console.log('Valor convertido:', conv5, '| Tipo convertido:', typeof conv5);

// 6. 'hola' -> boolean
const orig6 = 'hola';
const conv6 = Boolean(orig6);
console.log('Valor original:', orig6, '| Tipo original:', typeof orig6);
console.log('Valor convertido:', conv6, '| Tipo convertido:', typeof conv6);

// 7. '' (cadena vacía) -> boolean
const orig7 = '';
const conv7 = Boolean(orig7);
console.log('Valor original:', orig7, '| Tipo original:', typeof orig7);
console.log('Valor convertido:', conv7, '| Tipo convertido:', typeof conv7);


// -------------------------------------------------------------------------
// Ejercicio 11: Comparaciones
// -------------------------------------------------------------------------
console.log('\n--- EJERCICIO 11: Comparaciones ---');
let edadEj11 = 17;

console.log('--- Con edad = 17 ---');
console.log('¿Es mayor de 18?:', edadEj11 > 18);
console.log('¿Es menor de 18?:', edadEj11 < 18);
console.log('¿Tiene exactamente 17 años?:', edadEj11 === 17);
console.log('¿Tiene 16 o más años?:', edadEj11 >= 16);
console.log('¿Tiene menos de 65?:', edadEj11 < 65);

edadEj11 = 25;
console.log('--- Con edad = 25 ---');
console.log('¿Es mayor de 18?:', edadEj11 > 18);
console.log('¿Es menor de 18?:', edadEj11 < 18);
console.log('¿Tiene exactamente 17 años?:', edadEj11 === 17);
console.log('¿Tiene 16 o más años?:', edadEj11 >= 16);
console.log('¿Tiene menos de 65?:', edadEj11 < 65);


// -------------------------------------------------------------------------
// Ejercicio 12: == frente a ===
// -------------------------------------------------------------------------
console.log('\n--- EJERCICIO 12: == frente a === ---');
console.log(5 == '5');      // true
console.log(5 === '5');     // false
console.log(10 == '10');    // true
console.log(10 === '10');   // false
console.log(0 == false);    // true
console.log(0 === false);   // false

/*
Respuestas:
- ¿Cuál es la diferencia entre == y ===?
  '==' (igualdad débil) compara el valor convirtiendo los tipos automáticamente si son distintos.
  '===' (igualdad estricta) compara tanto el valor como el tipo de dato sin hacer conversiones.
- ¿Cuál utilizaremos normalmente en nuestro código?
  Utilizaremos '===' (igualdad estricta) para evitar errores inesperados por conversiones automáticas.
*/


// -------------------------------------------------------------------------
// Ejercicio 13: Operador &&
// -------------------------------------------------------------------------
console.log('\n--- EJERCICIO 13: Operador && ---');
let edadEj13 = 20;
let tieneEntrada = true;

let puedeEntrar = edadEj13 >= 18 && tieneEntrada;
console.log('20 años / tiene entrada:', puedeEntrar); // true

// Caso 2: 20 años / no tiene entrada
edadEj13 = 20;
tieneEntrada = false;
puedeEntrar = edadEj13 >= 18 && tieneEntrada;
console.log('20 años / no tiene entrada:', puedeEntrar); // false

// Caso 3: 16 años / tiene entrada
edadEj13 = 16;
tieneEntrada = true;
puedeEntrar = edadEj13 >= 18 && tieneEntrada;
console.log('16 años / tiene entrada:', puedeEntrar); // false

// Caso 4: 16 años / no tiene entrada
edadEj13 = 16;
tieneEntrada = false;
puedeEntrar = edadEj13 >= 18 && tieneEntrada;
console.log('16 años / no tiene entrada:', puedeEntrar); // false


// -------------------------------------------------------------------------
// Ejercicio 14: Operador ||
// -------------------------------------------------------------------------
console.log('\n--- EJERCICIO 14: Operador || ---');
let esSocioEj14 = false;
let tieneCupon = true;

let tieneDescuento = esSocioEj14 || tieneCupon;
console.log('Socio: false | Cupón: true  -> Descuento:', tieneDescuento); // true

// Probamos las demás combinaciones:
esSocioEj14 = true;
tieneCupon = true;
tieneDescuento = esSocioEj14 || tieneCupon;
console.log('Socio: true  | Cupón: true  -> Descuento:', tieneDescuento); // true

esSocioEj14 = true;
tieneCupon = false;
tieneDescuento = esSocioEj14 || tieneCupon;
console.log('Socio: true  | Cupón: false -> Descuento:', tieneDescuento); // true

esSocioEj14 = false;
tieneCupon = false;
tieneDescuento = esSocioEj14 || tieneCupon;
console.log('Socio: false | Cupón: false -> Descuento:', tieneDescuento); // false


// -------------------------------------------------------------------------
// Ejercicio 15: Operador !
// -------------------------------------------------------------------------
console.log('\n--- EJERCICIO 15: Operador ! ---');
const estaCerrado = false;
const estaAbierto = !estaCerrado;

console.log('¿Está cerrado?', estaCerrado);
console.log('¿Está abierto?', estaAbierto);

console.log('Invertir true (!true):', !true);
console.log('Invertir false (!false):', !false);


// -------------------------------------------------------------------------
// Ejercicio 16: Tienda (Integración)
// -------------------------------------------------------------------------
console.log('\n--- EJERCICIO 16: Tienda ---');
const nombreProducto = 'Teclado';
const precioTexto = '40';
const gastosEnvio = 5;
const esSocio = true;
const descuentoSocio = 10;

// 1. Convierte precioTexto a número
const precioNumero = Number(precioTexto);

// 2. Calcula precio + gastos
const precioConGastos = precioNumero + gastosEnvio;

// 3. Comprueba si el cliente es socio
const comprobacionSocio = esSocio === true;

// 4. Calcula mediante operaciones cuánto pagaría aplicando el descuento
const totalConDescuento = precioConGastos - descuentoSocio;

// 5. Muestra todos los datos mediante console.log()
console.log('Producto:', nombreProducto);
console.log('Precio base:', precioNumero);
console.log('Gastos de envío:', gastosEnvio);
console.log('Precio + gastos:', precioConGastos);
console.log('¿Es socio?:', comprobacionSocio);
console.log('Descuento de socio:', descuentoSocio);
console.log('Total a pagar con descuento:', totalConDescuento);

// 6. Utiliza typeof para demostrar que has convertido correctamente el precio
console.log('Tipo de precioTexto original:', typeof precioTexto);
console.log('Tipo de precioNumero convertido:', typeof precioNumero);


// -------------------------------------------------------------------------
// Ejercicio 17: Ficha de alumno
// -------------------------------------------------------------------------
console.log('\n--- EJERCICIO 17: Ficha de alumno ---');
const nombreAlum = 'Laura';
const apellidosAlum = 'Gómez Sánchez';
let edadAlum = 19;
let notaAlum = 8.5;
let estaMatriculado = true;
let telefonoAlum = '600123456';
const asignaturasAlum = ['Programación', 'Bases de Datos', 'Entornos de Desarrollo'];

console.log('Nombre completo:', nombreAlum + ' ' + apellidosAlum);
console.log('Edad:', edadAlum);
console.log('Nota:', notaAlum);
console.log('¿Está matriculado?:', estaMatriculado);
console.log('Tipo de la nota:', typeof notaAlum);
console.log('¿Asignaturas es un array?:', Array.isArray(asignaturasAlum));

// Modifica posteriormente la nota y vuelve a mostrarla
notaAlum = 9.2;
console.log('Nota modificada:', notaAlum);


// -------------------------------------------------------------------------
// Ejercicio 18: Detecta y corrige los errores
// -------------------------------------------------------------------------
console.log('\n--- EJERCICIO 18: Detecta y corrige los errores ---');
/*
Problemas identificados:
1. `nombre = 'Ana';` -> Error (TypeError): se intenta reasignar `nombre`, que fue declarada con `const`. Se corrige declarándola con `let`.
2. `const precioFinal = precio + 5;` -> Problema lógico: `precio` es el string `'15'`, por lo que `'15' + 5` concatena y da `'155'` en vez de `20`. Se corrige usando `Number(precio) + 5`.
3. `console.log(edad === 20);` -> Da `false` porque `edad` es el string `'20'` y se compara estrictamente (`===`) con el número `20`. Se corrige convirtiendo `edad` con `Number(edad) === 20`.
4. `console.log(mensaje);` fuera del `if` -> Error (ReferenceError): `mensaje` se declaró con `const` dentro del bloque `if (true) { ... }`, por lo que no existe fuera de él. Se corrige declarando o mostrando la variable dentro del mismo ámbito.
*/

let nombreEj18 = 'María';
const edadEj18 = '20';
const precioEj18 = '15';

nombreEj18 = 'Ana';

const precioFinal = Number(precioEj18) + 5;
console.log('Precio final:', precioFinal); // 20

console.log(Number(edadEj18) === 20); // true

const mensaje = 'Operación terminada';
if (true) {
    console.log('Nombre actualizado:', nombreEj18);
}
console.log(mensaje);


// -------------------------------------------------------------------------
// Ejercicio 19: ¿Qué mostrará la consola?
// -------------------------------------------------------------------------
console.log('\n--- EJERCICIO 19: ¿Qué mostrará la consola? ---');
const a19 = 10;
const b19 = '10';
let c19 = 5;

console.log(a19 + c19);     // 1. Muestra: 15
console.log(a19 + b19);     // 2. Muestra: '1010'
console.log(a19 === b19);   // 3. Muestra: false
console.log(a19 == b19);    // 4. Muestra: true

c19 = c19 + 5;
console.log(c19);           // 5. Muestra: 10
console.log(typeof c19);    // 6. Muestra: 'number'
console.log(a19 >= c19);    // 7. Muestra: true

const activo = true;
const permiso = false;

console.log(activo && permiso); // 8. Muestra: false
console.log(activo || permiso); // 9. Muestra: true
console.log(!activo);           // 10. Muestra: false


// -------------------------------------------------------------------------
// Ejercicio 20: Mini reto: Peladillos Eladio
// -------------------------------------------------------------------------
console.log('\n--- EJERCICIO 20: Mini reto: Peladillos Eladio ---');
const nombreCliente = 'Manolo';
const edadIntroducida = '17';
const precioCorte = 15;
const precioBarba = 8;
const esSocioEladio = true;
const descuentoSocioEladio = 3;

const edadConvertida = Number(edadIntroducida);
const esMayorDeEdad = edadConvertida >= 18;
const precioCorteMasBarba = precioCorte + precioBarba;
const compruebaSocio = esSocioEladio === true;
const precioConDescuento = precioCorteMasBarba - descuentoSocioEladio;

console.log('Cliente:', nombreCliente);
console.log('Edad:', edadConvertida);
console.log('Tipo de la edad original:', typeof edadIntroducida);
console.log('Tipo después de convertir:', typeof edadConvertida);
console.log('¿Es mayor de edad?:', esMayorDeEdad);
console.log('Precio corte + barba:', precioCorteMasBarba + ' €');
console.log('¿Es socio?:', compruebaSocio);
console.log('Precio con descuento:', precioConDescuento + ' €');
