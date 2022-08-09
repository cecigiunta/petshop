Vue.createApp({
    data() {
        return {
            url: 'https://apipetshop.herokuapp.com/api/articulos',
            results: [],
            juguetes: [],
            farmacia: [],          
            
    }},
    created(){
            fetch(this.url)
            .then((res) => res.json())
            .then((data) => {
                this.results = data.response;
                console.log(this.results);
            })
            .catch(err => console.error(err))
    },
    methods: {
        buttonSuccess() {
            Swal.fire ({
                title: '¡Mensaje enviado!',
                text: "Gracias por escribirnos",
                icon: 'success',
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: 'rgb(9, 177, 9)',
                // showCancelButton: true,
                })
            }
    },
    computed: {

        },            
}).mount('#app')