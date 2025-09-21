let vuelosOriginales = [];

async function obtenerVuelos() {
    try {
        const respuesta = await fetch("vuelos.json");
        if (!respuesta.ok) throw new Error("Error al obtener los vuelos");
        const vuelos = await respuesta.json();
        vuelosOriginales = vuelos;
        renderizarVuelos(vuelos);
    } catch (error) {
        console.error(error);
        mostrarModalError("Error al obtener los vuelos", "Por favor, aguarde hasta que se restablezca el sistema. Agradecemos su paciencia.");
    }
}

setInterval(obtenerVuelos, 60000);
obtenerVuelos();

function renderizarVuelos(vuelos) {
    const accionesHTML = document.getElementById("acciones")?.outerHTML || "";
    const tablaHTML = `
        <table>
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Destino</th>
                    <th>Hora de salida</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                ${vuelos.map(vuelo => `
                <tr>
                    <td>${vuelo.codigo}</td>
                    <td>
                        <img src="${vuelo.bandera_url}" alt="${vuelo.destino_pais}" width="30">
                        ${vuelo.destino_ciudad} / ${vuelo.destino_pais}
                    </td>
                    <td>${vuelo.hora_salida}</td>
                    <td><span class="estado ${vuelo.estado.toLowerCase().replace(/\s/g, "-")}">${vuelo.estado}</span></td>
                </tr>
                `).join("")}
            </tbody>
        </table>`;
    document.querySelector("main").innerHTML = accionesHTML + tablaHTML;

    document.getElementById("busqueda").addEventListener("submit", handlerBusquedaCodigo);
    document.getElementById("verTodos").addEventListener("click", () => renderizarVuelos(vuelosOriginales));
}

function handlerBusquedaCodigo(e) {
    e.preventDefault();
    const codigo = document.getElementById("codigoVuelo").value.trim().toUpperCase();
    const vueloEncontrado = vuelosOriginales.find(vuelo => vuelo.codigo.toUpperCase() === codigo);
    if (vueloEncontrado) {
        renderizarVuelos([vueloEncontrado]);
    } else {
        mostrarModalError("Vuelo no encontrado", "El código ingresado no corresponde a ningún vuelo. Verificá e intentá nuevamente.");
    }
}

function mostrarModalError(titulo, mensaje) {
    const modal = document.getElementById("modalError");
    document.getElementById("modalTitulo").innerHTML = titulo;
    document.getElementById("modalTexto").innerHTML = mensaje;
    modal.style.display = "block";

    document.getElementById("cerrarModal").onclick = () => {
        modal.style.display = "none";
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

const toggle = document.getElementById("toggleModo");
const icono = document.getElementById("iconoModo");
let oscuro = false;

toggle.addEventListener("click", () => {
    oscuro = !oscuro;
    document.body.classList.toggle("modo-oscuro", oscuro);

    // Cambiar ícono con animación
    icono.style.opacity = 0;
    setTimeout(() => {
        icono.textContent = oscuro ? "☀️" : "🌙";
        icono.style.opacity = 1;
    }, 150);
});