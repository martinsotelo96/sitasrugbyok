let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const productos = [
    {
        id: "camisetaTitularR",
        titulo: "Camiseta Titular Rugby",
        precio: 50000,
        img: "../img/camisetatitu.jpg",
    },
    {
        id: "CamisetaSuplenteR",
        titulo: "Camiseta Suplente Rugby",
        precio: 50000,
        img: "../img/camisetasup.jpg",
    },
    {
        id: "camisetaTitularH",
        titulo: "Camiseta Titular Hockey",
        precio: 40000,
        img: "../img/camisetahocky.jpg",
    }
];

const contenedorProductos = document.querySelector("#productos");
const carritoVacio = document.querySelector("#carrito-vacio");
const carritoProductos = document.querySelector("#carrito-productos");
const carritoTotal = document.querySelector("#carrito-total");
const listaProductos = document.getElementById("lista-productos"); 
const btnComprar = document.getElementById("btn-comprar");
const modalCompra = new bootstrap.Modal(document.getElementById('modalCompra'));

productos.forEach((producto) => {
    let div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
        <img class="producto-img" src=${producto.img}>
        <h3>${producto.titulo}</h3>
        <p>$${producto.precio}</p>
    `;

    let button = document.createElement("button");
    button.classList.add("producto-btn");
    button.innerText = "Agregar al carrito";
    button.addEventListener("click", () => {
        agregarAlCarrito(producto);
    });

    div.append(button);
    contenedorProductos.append(div);
});

function actualizarCarrito() {
    if (carrito.length === 0) {
        carritoVacio.classList.remove("d-none");
        carritoProductos.classList.add("d-none");
        listaProductos.innerHTML = ""; 
    } else {
        carritoVacio.classList.add("d-none");
        carritoProductos.classList.remove("d-none");

        carritoProductos.innerHTML = "";
        listaProductos.innerHTML = ""; 

        carrito.forEach((producto) => {
            let div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img src="${producto.img}" alt="${producto.titulo}" width="50" style="margin-right: 10px;">
                <p>Cant: ${producto.cantidad}</p>
                <p>Subt: $${producto.precio * producto.cantidad}</p>
            `;

            let buttonAumentar = document.createElement("button");
            buttonAumentar.classList.add("carrito-producto-btn");
            buttonAumentar.innerText = "⬆";
            buttonAumentar.addEventListener("click", () => {
                aumentarCantidad(producto);
            });
            div.append(buttonAumentar);

            let buttonReducir = document.createElement("button");
            buttonReducir.classList.add("carrito-producto-btn");
            buttonReducir.innerText = "⬇";
            buttonReducir.addEventListener("click", () => {
                reducirCantidad(producto);
            });
            div.append(buttonReducir);

            let button = document.createElement("button");
            button.classList.add("carrito-producto-btn");
            button.innerText = "✖️";
            button.addEventListener("click", () => {
                borrarDelCarrito(producto);
            });

            div.append(button);
            carritoProductos.append(div);

            let li = document.createElement("li");
            li.innerHTML = `
                <img src="${producto.img}" alt="${producto.titulo}" width="30" style="margin-right: 5px;">
                Cant: ${producto.cantidad}, Precio: $${producto.precio * producto.cantidad}
            `;
            listaProductos.appendChild(li);
        });
    }
    actualizarTotal();
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(producto) {
    let itemEncontrado = carrito.find((item) => item.id === producto.id);

    if (itemEncontrado) {
        itemEncontrado.cantidad++;
    } else {
        carrito.push({...producto, cantidad: 1});
    }

    actualizarCarrito();
}

function borrarDelCarrito(producto) {
    let indice = carrito.findIndex((item) => item.id === producto.id);
    if (indice !== -1) {
        carrito.splice(indice, 1);
    }

    actualizarCarrito();
}

function actualizarTotal() {
    let total = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
    carritoTotal.innerText = `$${total}`;
}

function aumentarCantidad(producto) {
    let itemEncontrado = carrito.find((item) => item.id === producto.id);
    if (itemEncontrado) {
        itemEncontrado.cantidad++;
    }

    actualizarCarrito();
}

function reducirCantidad(producto) {
    let itemEncontrado = carrito.find((item) => item.id === producto.id);

    if (itemEncontrado && itemEncontrado.cantidad > 1) {
        itemEncontrado.cantidad--;
        actualizarCarrito();
    } else {
        borrarDelCarrito(itemEncontrado);
    }
}


btnComprar.addEventListener("click", () => {
    if (carrito.length > 0) {
        modalCompra.show();
    } else {
        alert("Tu carrito está vacío. Agrega productos antes de comprar.");
    }
});


document.getElementById("formDatosCompra").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const direccion = document.getElementById("direccion").value;


    alert(`Compra realizada por: ${nombre}, Email: ${email}, Dirección: ${direccion}`);

    carrito = [];
    localStorage.removeItem("carrito");
    actualizarCarrito();
    modalCompra.hide();
});

document.addEventListener("DOMContentLoaded", () => {
    actualizarCarrito();
});
