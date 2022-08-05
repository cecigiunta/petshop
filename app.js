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





    },
    computed: {

        },            
}).mount('#app')