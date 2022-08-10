Vue.createApp({
    data() {
        return {
            url: 'https://apipetshop.herokuapp.com/api/articulos',
            results: [],
            juguetes: [],
            farmacia: [],  
            range: 0,
            preciosFiltrados: []
            
    }},
    created(){
            fetch(this.url)
            .then((res) => res.json())
            .then((data) => {
                this.results = data.response;
                this.preciosFiltrados = data.response.sort((a, b) => {
                    return a.stock - b.stock;
                }); // ?????
                console.log(this.results);
            })
            .catch(err => console.error(err))
    },
    methods: {
        filtrarPrecios: function(){
                this.preciosFiltrados = this.farmacia.filter(item => item.precio <= this.range)
                this.preciosFiltrados.sort((a, b) => {
                    return a.stock - b.stock;
                });
                console.log(this.preciosFiltrados)
            }
    },
    computed: {
        filtrarMedicamentos: function(){
            this.farmacia = this.results.filter((medicamento) => medicamento.tipo === "Medicamento")
            this.farmacia.sort((a, b) => {
                return a.stock - b.stock;
            });
        },
        cambiar: function(){
            return this.range
        },
        
        }
           
}).mount('#app')