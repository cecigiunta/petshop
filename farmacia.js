Vue.createApp({
    data() {
        return {
            url: 'https://apipetshop.herokuapp.com/api/articulos',
            results: [],
            juguetes: [],
            farmacia: [],
            rangeJuguete: 0, //AGREGO RANGO PARA JUGUETES /CARO
            range: 0,
            preciosFiltrados: [],
            preciosFiltradosJuguetes: [],

            //Mis lineas de CARRITO:
            carrito: [],
            cantidad: 1,
            total_carrito: 0,
            total_carrito_farmacia: 0,
            total_carrito_juguetes: 0,

            // Lineas de DARIO de BUSQUEDA
            farmaciafiltrada: [],
            jueguetefiltrados: [], //AGREGO ARRAY PARA GUARDAR JUGUETES FILTRADOS /CARO
            busqueda: "",

            //lineas CARO FAVORITOS
            favoritos: []
        }
    },
    created() {
        fetch(this.url)
            .then((res) => res.json())
            .then((data) => {

                //lineas de DARIO DE BUSQUEDA
                this.results = data.response;
                this.agregarPropiedades(); //AGREGA PROPIEDADES A CADA ITEM
                // this.preciosFiltrados = data.response.sort((a, b) => {
                //     return a.stock - b.stock;
                // }); // ?????
                this.farmacia = this.results.filter((medicamento) => medicamento.tipo === "Medicamento").sort((a, b) => a.stock - b.stock)
                .map(item => {
                    item.isInCart = false
                    return item
                });
                this.getJuguetes();
                this.farmaciafiltrada = this.farmacia
                console.log(this.farmaciafiltrada)
                this.jueguetefiltrados = this.getJuguetes(); //AGREGUE ESTA LINEA PARA QUE SE FILTRE JUGUETSS
                
           
            })
            .catch(err => console.error(err))
        this.carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        this.favoritos = JSON.parse(localStorage.getItem('favoritos'));
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
        //FUNCIONES PARA FAV / CARO
        agregarPropiedades: function() {
            for(item of this.results) {
              if(!this.favoritos?.some(favorito => favorito.nombre === item.nombre)) {
                item.agregar = true;
                item.id = item.nombre.replace(/ /g, "_").slice(0,10).toLowerCase();
                item.idtag = "#"+item.id;
                item.isInCart = false
                
              
              } else {
                item.agregar = false;
                item.id = item.nombre.replace(/ /g, "_").slice(0,10).toLowerCase();
                item.idtag= "#"+item.id;
                item.isInCart = false
              }
            
            }
          },
          getJuguetes: function () {
              this.juguetes = this.results.filter(item => item.tipo === "Juguete").sort((a,b)=> a.stock - b.stock)
          },
      
          agregarFavorito : function(item) {
           if(!this.favoritos?.some(favorito=> favorito.nombre === item.nombre)) {
              this.favoritos?.push(item);
              item.agregar = false;
              localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
               
           }
           this.condicionFav = false;
          },
          quitarFavorito : function(item) {
              item.agregar = true;
              this.favoritos = this.favoritos?.filter(j => j.nombre !== item.nombre)
              this.condicionFav = true;
              localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
          }

    },
    computed: {
        //ESTA FUNCION FILTRA EL RANGO Y FILTRA BUSQUEDA
        filtrarbusqueda: function () {
            if (document.title === "Farmacia | Mundo Patitas") {
                if(this.range >= 240) {
                this.farmaciafiltrada = this.farmacia.filter(medicacion => medicacion.nombre.toLowerCase().includes(this.busqueda.toLowerCase())).filter(item => item.precio <= this.range).sort((a, b) => {
                    return a.stock - b.stock;
                });} else {
                    this.farmaciafiltrada = this.farmacia;
                }
                console.log(this.farmaciafiltrada)
           
            }
            if (document.title === "Juguetes | Mundo Patitas") {
                if(this.rangeJuguete >= 320) {
                    this.juguetefiltrados = this.juguetes.filter(juguete => juguete.nombre.toLowerCase().includes(this.busqueda.toLowerCase())).filter(item=> item.precio <= this.rangeJuguete).sort((a, b) => {
                        return a.stock - b.stock;
                    });} else {
                        this.juguetefiltrados = this.juguetes;
                    }
                console.log(this.juguetefiltrados)
            }
        },
    },
}).mount('#app')