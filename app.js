Vue.createApp({
    data() {
        return {
            results: [],
            farmacia: [],
            juguetes: [],
            favoritos: [],
            condicionFav: true,
            carrito: localStorage.getItem('carrito') ? JSON.parse(localStorage.getItem('carrito')) : [],
            cantidad: 1,
            total_carrito: 0,
            busqueda: "",
            farmaciafiltrada: [],
            juguetesFiltrados: [],
            rangeJuguete: 0,
            range: 0,
        }
    },
    created() {
        fetch("https://apipetshop.herokuapp.com/api/articulos")
            .then(res => res.json())
            .then(datos => {
                this.results = Array.from(datos.response).map(item => {
                    item.isInCart = false
                    return item
                }),
                this.agregarPropiedades();

                if(document.title === 'Juguetes | Mundo Patitas'){
                    this.getJuguetes();
                    this.juguetesFiltrados = this.juguetes
                }
                if(document.title === 'Farmacia | Mundo Patitas'){
                    this.farmacia = this.results.filter((medicamento) => medicamento.tipo === "Medicamento"),
                    this.farmaciafiltrada = this.farmacia.sort((a, b) => a.stock - b.stock)
                }
            })
            .catch(error => console.log(error));
        this.favoritos = JSON.parse(localStorage.getItem('favoritos'))
        this.carrito = JSON.parse(localStorage.getItem('carrito')) || []
        this.total_carrito = localStorage.getItem('total') || 0
    },
    methods: {
        getJuguetes: function () {
            this.juguetes = this.results.filter(item => item.tipo === "Juguete").sort((a, b) => a.stock - b.stock)
            for (juguete of this.juguetes) {
                if (!this.favoritos?.some(item => item.nombre === juguete.nombre)) {
                    juguete.agregar = true;
                    juguete.id = juguete.nombre.replace(/ /g, "_").toLowerCase();
                    juguete.idtag = "#" + juguete.nombre;
                    juguete.idtag = juguete.idtag.replace(/ /g, "_").toLowerCase()
                } else {
                    juguete.agregar = false;
                    juguete.id = juguete.nombre.replace(/ /g, "_").toLowerCase();
                    juguete.idtag = "#" + juguete.nombre;
                    juguete.idtag = juguete.idtag.replace(/ /g, "_").toLowerCase()
                }
            }
        },
        agregarFavorito: function (juguete) {
            if (!this.favoritos?.some(item => item.nombre === juguete.nombre)) {
                this.favoritos?.push(juguete);
                juguete.agregar = false;
                localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
            }
            this.condicionFav = false;
        },
        quitarFavorito: function (juguete) {
            juguete.agregar = true;
            this.favoritos = this.favoritos?.filter(j => j.nombre !== juguete.nombre)
            this.condicionFav = true;
            localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
        },
        addToCart: function (item) {
            let condicion = this.carrito.some(producto => producto._id === item._id);
            if (!condicion) {
                let aux = { ...item }
                aux.cantidad = 1;
                this.carrito.push(aux);
                this.total_carrito = parseInt(this.total_carrito) + parseInt(item.precio);
            }
            if(document.title === "Juguetes | Mundo Patitas"){
            let itemIndex = this.juguetes.findIndex(element => element._id === item._id)
            this.juguetes[itemIndex].isInCart = true
            }
            if(document.title === "Farmacia | Mundo Patitas"){
            let itemIndex = this.farmacia.findIndex(element => element._id === item._id)
            this.farmacia[itemIndex].isInCart = true
            }
            localStorage.setItem('carrito', JSON.stringify(this.carrito));
            localStorage.setItem('total', this.total_carrito);
        },
        sumarUno: function (item) {
            let condicion = this.carrito.some(producto => producto._id === item._id);
            if (condicion) {
                let aux = this.carrito.map(producto => {
                    if (producto._id === item._id && producto.cantidad < item.stock) {
                        let newArr = { ...producto }
                        newArr.cantidad++;
                        this.total_carrito = parseInt(this.total_carrito) + parseInt(item.precio);
                        return newArr
                    }
                    else {
                        return producto
                    }
                })
                this.carrito = aux;
                localStorage.setItem('carrito', JSON.stringify(this.carrito));
                localStorage.setItem('total', this.total_carrito);
            } else {
                let aux = { ...item }
                aux.cantidad = 1;
                this.carrito.push(aux);
            }
        },
        restarUno: function (item) {
            if (item.cantidad > 1) {
                let aux = this.carrito.map(producto => {
                    if (producto._id === item._id) {
                        let newArr = { ...producto }
                        newArr.cantidad--;
                        this.total_carrito = parseInt(this.total_carrito) - parseInt(item.precio);
                        localStorage.setItem('carrito', JSON.stringify(this.carrito));
                        localStorage.setItem('total', this.total_carrito);
                        return newArr
                    }
                    else {
                        return producto
                    }
                })
                this.carrito = aux;
                localStorage.setItem('carrito', JSON.stringify(this.carrito));

            } else {
                this.eliminarItem(item);
            }
        },
        eliminarItem: function (item) {
            let aux = this.carrito.filter(producto => producto._id !== item._id);
            this.carrito = aux;
            this.total_carrito = parseInt(this.total_carrito) - parseInt(item.precio * item.cantidad);
            localStorage.setItem('carrito', JSON.stringify(this.carrito));
            localStorage.setItem('total', this.total_carrito);
        },
        vaciarCarrito: function () {
            this.carrito = [];
            this.total_carrito = 0;
            localStorage.removeItem('carrito');
            localStorage.removeItem('total');
        },
        buttonSwal: function () {  //Sweetalert
            this.carrito = [];
            this.total_carrito = 0;
            Swal.fire({
                title: 'Compra realizada exitosamente',
                text: "¡Gracias por confiar en Mundo Patitas!",
                icon: 'success',
                iconColor: '#fbb67e',
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: 'rgb(105, 198, 158)',
            })
            localStorage.removeItem('carrito');
            localStorage.removeItem('total');
        },
        buttonSuccess (){
            Swal.fire({
                title: '¡Mensaje enviado exitosamente!',
                text: 'Gracias por escribirnos :)',
                icon: 'success',
                iconColor: '#fbb67e',
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: 'rgb(105, 198, 158)',
            })
        },
        agregarPropiedades: function () {
            for (item of this.results) {
                if (!this.favoritos?.some(favorito => favorito.nombre === item.nombre)) {
                    item.agregar = true;
                    item.id = item.nombre.replace(/ /g, "_").slice(0, 10).toLowerCase();
                    item.idtag = "#" + item.id;
                } else {
                    item.agregar = false;
                    item.id = item.nombre.replace(/ /g, "_").slice(0, 10).toLowerCase();
                    item.idtag = "#" + item.id;
                }
            }
        },
    },
    computed: {
        filtrarbusqueda: function () {
            if (document.title === "Farmacia | Mundo Patitas") {
                if(this.range >= 240) {
                this.farmaciafiltrada = this.farmacia.filter(medicacion => medicacion.nombre.toLowerCase().includes(this.busqueda.toLowerCase())).filter(item => item.precio <= this.range).sort((a, b) => {
                    return a.stock - b.stock;
                });} else {
                    this.farmaciafiltrada = this.farmacia.filter(medicacion => medicacion.nombre.toLowerCase().includes(this.busqueda.toLowerCase()));
                }
            }
            if (document.title === "Juguetes | Mundo Patitas") {
                if(this.rangeJuguete >= 320) {
                    this.juguetesFiltrados = this.juguetes.filter(juguete => juguete.nombre.toLowerCase().includes(this.busqueda.toLowerCase())).filter(item=> item.precio <= this.rangeJuguete).sort((a, b) => {
                        return a.stock - b.stock;
                    });} else {
                        this.juguetesFiltrados = this.juguetes.filter(juguete => juguete.nombre.toLowerCase().includes(this.busqueda.toLowerCase()));
                    }
            }
        },
    }
}).mount('#app')