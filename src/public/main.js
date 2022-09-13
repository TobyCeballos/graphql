const sockets = io.connect()

function addProduct(e) {
    const product = {
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        stock: document.getElementById("stock").value,
        description: document.getElementById("description").value,
        thumbnail: document.getElementById("thumbnail").value
    }
    document.getElementById("name").value = ""
    document.getElementById("price").value = ""
    document.getElementById("stock").value = ""
    document.getElementById("description").value = ""
    document.getElementById("thumbnail").value = ""
    sockets.emit("new-product", product);
    return false
}

function render(data) {
    try {
        if(data.length > 0) {
            const html = data.map((elem, index) => {
                return(`
                <div class="card m-2" style="width: 18rem;">
                    <div class="overflow-hidden text-center" style="max-width: 18rem; max-height: 200px;">
                        <img class="mh-100" src="${elem.thumbnail}" class="card-img-top" alt="...">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${elem.name}</h5>
                        <p class="card-text">${elem.description}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Stock: ${elem.stock}</li>
                        <li class="list-group-item">Codigo: ${elem.id}</li>
                        <li class="list-group-item">Precio: $ ${elem.price}</li>
                    </ul>
                    <div class="d-flex card-body">
                        <a href="#" class="btn btn-primary w-50">Comprar</a>
                        <a href="/carritos/Tobi/productos/${elem.id}" style="height: 50px" class="btn btn-outlined-secondary material-symbols-outlined">add_shopping_cart</a>
                        <a href="/delete/${elem.id}" class="btn btn-outline-danger material-symbols-outlined">delete</a>
                    </div>
                </div>`)
            }).join(" ")
            document.getElementById("product").innerHTML = html
        } else {
            const htmlErr = `<h3 class="prod__error">No se encontraron productos :/</h3>`
            document.getElementById('product').innerHTML = htmlErr
        }
    } catch (error) {
        console.error(error)
    }
}

sockets.on("product", function(data) {render(data)})


///


function addMessage(a) {
    let date = new Date();
    const message = {
        email: document.getElementById("username").value,
        text: document.getElementById("text").value,
        fecha: date.toLocaleDateString(),
        hora: date.toLocaleTimeString(),
    }
    document.getElementById("text").value = "";
    sockets.emit("new-message", message);
    return false
}

function renders(dato) {
    try {
        if(dato.length > 0){
            const html2 = dato.map((element) => {
                return(`
                <div class="row">
                    <div class="col-2">
                        <p class="fs-6 color__darkblue">${element.email} :</p>
                    </div>
                    <div class="col-8 gx-0">
                        <p class="fs-6 text-start">${element.text}</p>
                    </div>
                    <div class="col gx-0">
                        <p class="fs-6 text-primary text-end">[${element.hora} - ${element.fecha}]</p>
                    </div>
                </div>`)
            }).join(" ")
        
            document.getElementById("messages").innerHTML = html2
        } else {
            const errHtml = `<p class="chat__err">Aún no hay mensajes :( ¡Sé el primero en enviar uno!</p>`
            
            document.getElementById("messages").innerHTML = errHtml
        }
        
    } catch (err) {
        console.log(err)
    }
}

sockets.on("messages", function(dato) {renders(dato)})
