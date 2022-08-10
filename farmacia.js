Vue.createApp({
    data() {
        return {
            url: 'https://apipetshop.herokuapp.com/api/articulos',
            results: [],
            juguetes: [],
            farmacia: [],
            farmaciafiltrada: [],
            jueguetefiltrados: [],
            noHayProducto: false,
          
            busqueda:"",   
   
    }},
    
    created(){
            fetch(this.url)
            .then((res) => res.json())
            .then((data) => {
                this.results = data.response;
                this.farmaciafiltrada= data.response;
                this.juguetesfiltrados= data.response;
               
                this.farmacia = this.results.filter((medicamento) => medicamento.tipo === "Medicamento")
                this.juguetes = this.results.filter((juguete) =>juguete.tipo === "Juguete")
                console.log(this.noBusqueda)
               
                
            })
            .catch(err => console.error(err))


    },
    methods: {
     
            
    },
       computed: {
            // filtrarMedicamentos: function(){
            //     this.farmacia = this.results.filter((medicamento) => medicamento.tipo === "Medicamento")
            // },
             filtrarbusqueda: function(){
          if(document.title === "Farmacia | Mundo Patitas"){ 

              this.farmaciafiltrada = this.farmacia.filter( medicacion => medicacion.nombre.toLowerCase().includes(this.busqueda.toLowerCase()))
            
              } 
              if (document.title === "Juguetes | Mundo Patitas") {
                this.juguetesfiltrados= this.juguetes.filter( juguete =>juguete.nombre.toLowerCase().includes(this.busqueda.toLowerCase()))
              
                
            } 
          }
             
          
       }
        } ).mount('#app')
    