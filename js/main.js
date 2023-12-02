
const shopContent = document.getElementById("shopContent");
const verCarrito = document.getElementById("verCarrito");
const modalContainer = document.getElementById("modal-container");
const showAlert = document.getElementById("showAlert");
const cantidadCarrito = document.getElementById("cantidadCarrito");


let carrito = JSON.parse(localStorage.getItem("carrito")) || []; //.parse le quito el formato json y || es una u otra

const getProducts = async () => {
try{
const response = await fetch("data.json");
    const data = await response.json();
    data.forEach((product) => {
        let content = document.createElement("div");
        content.className = "card";
        content.innerHTML = `
        <img src="${product.img}">
        <h3>${product.nombre}</h3> 
        <h3>${product.escuela}</h3>
        <h3>${product.talle}</h3>
        <p class="price">${product.precio} $</p>
    `;
    
        shopContent.append(content); //agrega un elemento al final 
    
        let comprar = document.createElement("button");
        comprar.innerText = "Agregar al carrito";
        comprar.className = "comprar";
    
        content.append(comprar); //agrega un elemento al final 
    
        comprar.addEventListener("click", () => {
            const repeat = carrito.some((repeatProduct) => repeatProduct.id === product.id);
            Swal.fire({ //swet alert 
                position: "top-end",
                imageUrl: product.img,
                imageWidth: 250,
                imageHeight: 250,
                icon: "success",
                title: "Agregado al carrito",
                showConfirmButton: false,
                timer: 1000,
            });
    
            if (repeat) {
                carrito.map((prod) => {
                    if (prod.id === product.id) {
                        prod.cantidad++;
                    }
                });
            } else {
                carrito.push({
                    id: product.id,
                    img: product.img,
                    nombre: product.nombre,
                    escuela: product.escuela,
                    talle: product.talle,
                    precio: product.precio,
                    cantidad: product.cantidad,
                });
                console.log(carrito);
                console.log(carrito.length);
                carritoCounter();
                saveLocal();
            }
        });
    });
}catch(error){
    console.log(error);
}
};

getProducts();



//set item
const saveLocal = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito)); // guardar un json dentro del storage
};

//get item

const pintarCarrito = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "flex";
    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    modalHeader.innerHTML = `
        <h1 class="modal-header-title">Carrito</h1>
    `;
    modalContainer.append(modalHeader);

    const modalbutton = document.createElement("h1");
    modalbutton.innerText = "x";
    modalbutton.className = "modal-header-button";

    modalbutton.addEventListener("click", () => {
        modalContainer.style.display = "none";
    });

    modalHeader.append(modalbutton);

    carrito.forEach((product) => {
        let carritoContent = document.createElement("div");
        carritoContent.className = "modal-content";
        carritoContent.innerHTML = `
        <img src="${product.img}">
        <h3>${product.nombre}</h3>
        <h3>${product.escuela}</h3>
        <h3>${product.talle}</h3>
        <p>${product.precio} $</p>
        <span class="restar"> - </span>
        <p>${product.cantidad}</p>
        <span class="sumar"> + </span>
          <p>Total: ${product.cantidad * product.precio} $</p>
        <span class="delete-product"> 🗑 </span>
        `;

        modalContainer.append(carritoContent);

        let restar = carritoContent.querySelector(".restar");

        restar.addEventListener("click", () => {
            if (product.cantidad !== 1) {
                product.cantidad--;
            }
            saveLocal();
            pintarCarrito();
        });

        let sumar = carritoContent.querySelector(".sumar");
        sumar.addEventListener("click", () => {
            product.cantidad++;
            saveLocal();
            pintarCarrito();
        });

        let eliminar = carritoContent.querySelector(".delete-product");

        eliminar.addEventListener("click", () => {
            eliminarProducto(product.id);
        });
    });

    const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);

    const totalBuying = document.createElement("div");
    totalBuying.className = "total-content";
    totalBuying.innerHTML = `Total a pagar: ${total} $`;
    modalContainer.append(totalBuying);
};

verCarrito.addEventListener("click", pintarCarrito);

const eliminarProducto = (id) => {
    const foundId = carrito.find((element) => element.id === id); //recorre hasta encontra un verdadero

    console.log(foundId);

    carrito = carrito.filter((carritoId) => {
        return carritoId !== foundId; //id diferente
    });

    carritoCounter();
    saveLocal();
    pintarCarrito();
};

const carritoCounter = () => {
    cantidadCarrito.style.display = "block";

    const carritoLength = carrito.length; //numero de elementos 

    localStorage.setItem("carritoLength", JSON.stringify(carritoLength));

    cantidadCarrito.innerText = JSON.parse(localStorage.getItem("carritoLength"));
};

carritoCounter();