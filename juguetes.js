const { createApp } = Vue

createApp({
  data() {
    return {
      results: [],
      juguetes:[],
      favoritos: [],
      condicionFav: true,
      
    }
  },
  created() {
    fetch("https://apipetshop.herokuapp.com/api/articulos")
      .then(res => res.json())
      .then(datos => {
        this.results = Array.from(datos.response);
        this.getJuguetes();
        console.log(this.juguetes)
        
      })
      .catch(error => console.log(error));
      this.favoritos = JSON.parse(localStorage.getItem('favoritos'))
  },
  methods: {
    getJuguetes: function () {
        this.juguetes = this.results.filter(item => item.tipo == "Juguete").sort((a,b)=> a.stock - b.stock)
        for(juguete of this.juguetes) {
          if(!this.favoritos.some(item => item.nombre === juguete.nombre)){
            juguete.añadir = true;
            juguete.id = juguete.nombre.replace(/ /g, "_").toLowerCase();
            juguete.idtag = "#"+juguete.nombre;
            juguete.idtag = juguete.idtag.replace(/ /g, "_").toLowerCase()
            
          } else {
            juguete.añadir = false;
            juguete.id = juguete.nombre.replace(/ /g, "_").toLowerCase();
            juguete.idtag= "#"+juguete.nombre;
            juguete.idtag = juguete.idtag.replace(/ /g, "_").toLowerCase()
          }
          
        } 
    },
    agregarFavorito : function(juguete) {
     if(!this.favoritos.some(item => item.nombre === juguete.nombre)) {
        this.favoritos.push(juguete);
        juguete.añadir = false;
        localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
         
     }
     this.condicionFav = false;
    },
    quitarFavorito : function(juguete) {
        juguete.añadir = true;
        this.favoritos = this.favoritos.filter(j => j.nombre !== juguete.nombre)
        this.condicionFav = true;
        localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
    }
  },
  computed: {
    
  }
}).mount('#app')