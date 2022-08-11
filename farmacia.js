Vue.createApp({
    data() {
        return {
            url: 'https://apipetshop.herokuapp.com/api/articulos',
            results: [],
            juguetes: [],
            farmacia: [],
            range: 0,
            preciosFiltrados: [],

            //Mis lineas de CARRITO:
            carrito: [],
            cantidad: 1,
            total_carrito: 0,
            total_carrito_farmacia: 0,
            total_carrito_juguetes: 0,

            // Lineas de DARIO de BUSQUEDA
            farmaciafiltrada: [],
            jueguetefiltrados: [],
            busqueda: "",
        }
    },
    created() {
        fetch(this.url)
            .then((res) => res.json())
            .then((data) => {

                //lineas de DARIO DE BUSQUEDA
                this.results = data.response;
                this.preciosFiltrados = data.response.sort((a, b) => {
                    return a.stock - b.stock;
                }); // ?????
                this.farmacia = this.results.filter((medicamento) => medicamento.tipo === "Medicamento")
                .map(item => {
                    item.isInCart = false
                    return item
                });
                this.farmaciafiltrada = this.farmacia.sort((a, b) => a.stock - b.stock);
                // this.juguetes = this.results.filter((juguete) =>juguete.tipo === "Juguete")
                console.log(this.farmacia);
            })
            .catch(err => console.error(err))
        this.carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    },
    methods: {
        //MIS LINEAS DE CARRITO
        addToCart: function (item) {
            let condicion = this.carrito.some(producto => producto._id === item._id);
            if (!condicion) { //si el id está en el arr
                let aux = { ...item }
                aux.cantidad = 1;
                this.carrito.push(aux);
                this.total_carrito = this.total_carrito + item.precio;
            }
            let itemIndex = this.farmacia.findIndex(element => element._id === item._id)
            this.farmacia[itemIndex].isInCart = true
            localStorage.setItem('carrito', JSON.stringify(this.carrito));
        },
        sumarUno: function (item) {
            let condicion = this.carrito.some(producto => producto._id === item._id);
            if (condicion) { 
                let aux = this.carrito.map(producto => {
                    if (producto._id === item._id && producto.cantidad < item.stock) { 
                        let newArr = { ...producto }
                        newArr.cantidad++;
                        this.total_carrito += producto.precio
                        return newArr
                    }
                    else {
                        console.log("No hay mas productos en stock");
                        return producto
                    }
                })
                this.carrito = aux;
                localStorage.setItem('carrito', JSON.stringify(this.carrito));
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
                        this.total_carrito -= producto.precio
                        localStorage.setItem('carrito', JSON.stringify(this.carrito));
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
            this.total_carrito -= item.precio;
            localStorage.setItem('carrito', JSON.stringify(this.carrito));
        },
        vaciarCarrito: function () {
            this.carrito = [];
            this.total_carrito = 0;
            localStorage.removeItem('carrito');
        },
        buttonCompra: function () {  //Funcion sweetalert
            this.carrito = [];
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
        },
        filtrarPrecios: function(){
            this.preciosFiltrados = this.farmacia.filter(item => item.precio <= this.range)
            this.preciosFiltrados.sort((a, b) => {
                return a.stock - b.stock;
            });
            console.log(this.preciosFiltrados)
        }

    },
    computed: {
        filtrarbusqueda: function () {
            if (document.title === "Farmacia | Mundo Patitas") {
                this.farmaciafiltrada = this.farmacia.filter(medicacion => medicacion.nombre.toLowerCase().includes(this.busqueda.toLowerCase()))
            }
            if (document.title === "Juguetes | Mundo Patitas") {
                this.juguetesfiltrados = this.juguetes.filter(juguete => juguete.nombre.toLowerCase().includes(this.busqueda.toLowerCase()))
            }
        },
        cambiar: function(){
            return this.range
        },
    },
}).mount('#app')