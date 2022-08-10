Vue.createApp({
    data() {
        return {
            url: 'https://apipetshop.herokuapp.com/api/articulos',
            results: [],
            juguetes: [],
            farmacia: [],


            //Mis lineas:
            carrito: [],
            cantidad: 1,
            total_carrito: 0,
            total_carrito_farmacia: 0,
            total_carrito_juguetes: 0

    }},
    created(){
        fetch(this.url)
        .then((res) => res.json())
        .then((data) => {
            this.results = data.response.map(item => {
                item.isInCart = false
                return item
            });
            console.log("this", this.results);
        })
        .catch(err => console.error(err))
},
methods: {
    //MIS LINEAS
    addToCart: function(item){
        let condicion = this.carrito.some(producto => producto._id === item._id);
        if(!condicion){ //si el id está en el arr
            let aux = {...item}
            aux.cantidad = 1;
            this.carrito.push(aux);
            this.total_carrito = this.total_carrito + item.precio;
        } 
        let itemIndex = this.farmacia.findIndex(element => element._id === item._id)
        this.farmacia[itemIndex].isInCart = true
    },
sumarUno: function(item){
        let condicion = this.carrito.some(producto => producto._id === item._id);
        if(condicion){ //si el id está en el arr
            let aux = this.carrito.map(producto => {
                if(producto._id === item._id){
                    let newArr = {...producto}
                    newArr.cantidad++;
                    this.total_carrito += producto.precio
                    return newArr
                }
                else {
                    return producto
                }
            })
            this.carrito = aux;
        } else {
            let aux = {...item}
            aux.cantidad = 1;
            this.carrito.push(aux);
        }
    },
    restarUno: function(item){
        if(item.cantidad > 1){
            let aux = this.carrito.map(producto => {
                if(producto._id === item._id){
                    let newArr = {...producto}
                    newArr.cantidad--;


                    this.total_carrito -= producto.precio
                    return newArr
                }
                else {
                    return producto
                }
            })
            this.carrito = aux;
        }




    },
eliminarItem: function(item){
        this.carrito.splice(item, 1);
        this.cantidad--;
        this.total_carrito = this.total_carrito - item.precio;
                    console.log(this.carrito);
                    console.log(this.cantidad);
                    console.log(this.total_carrito);

    },
    vaciarCarrito: function(){
        this.carrito = [];
        this.cantidad = 0;
        this.total_carrito = 0;
        localStorage.removeItem('carrito', JSON.stringify(this.carrito));
    },

    buttonCompra() {  //Funcion sweetalert
        Swal.fire ({
            title: 'Compra realizada exitosamente',
            text: "¡Gracias por confiar en Mundo Patitas!",
            icon: 'success',
            iconColor: '#fbb67e',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'rgb(105, 198, 158)',
            })
        },
        filtrarMedicamentos: function(){
        console.log("filtarMeds")
        this.farmacia = this.results.filter((medicamento) => medicamento.tipo === "Medicamento")
        this.farmacia.sort((a, b) => {
            return a.stock - b.stock;
        });
        console.log("formattedItems: ", this.farmacia)
    }


},
computed: {
    filtrarMedicamentos: function(){
        console.log("filtarMeds")
        this.farmacia = this.results.filter((medicamento) => medicamento.tipo === "Medicamento")
        this.farmacia.sort((a, b) => {
            return a.stock - b.stock;
        });
        console.log("formattedItems: ", this.farmacia)
    }


    },
}).mount('#app')