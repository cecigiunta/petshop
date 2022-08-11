Vue.createApp({
  data() {
    return {
      results: [],
      juguetes:[],
      favoritos: [],
      condicionFav: true,
      
    }
  },
  mounted() {
    fetch("https://apipetshop.herokuapp.com/api/articulos")
      .then((res) => res.json())
      .then((data) => {
        this.results = Array.from(data.response);
        this.getJuguetes();
        
      })
      .catch(error => console.log(error));
      this.favoritos = JSON.parse(localStorage.getItem('favoritos'))
  },
  methods: {
    agregarPropiedades: function() {
      for(item of this.results) {
        if(!this.favoritos?.some(item => item.nombre === juguete.nombre)) {
          juguete.agregar = true;
          juguete.id = juguete.nombre.replace(/ /g, "_").toLowerCase();
          juguete.idtag = "#"+juguete.nombre;
          juguete.idtag = juguete.idtag.replace(/ /g, "_").toLowerCase()
          
        } else {
          juguete.agregar = false;
          juguete.id = juguete.nombre.replace(/ /g, "_").toLowerCase();
          juguete.idtag= "#"+juguete.nombre;
          juguete.idtag = juguete.idtag.replace(/ /g, "_").toLowerCase()
        }
      
      }
    },

    getJuguetes: function () {
        this.juguetes = this.results.filter(item => item.tipo === "Juguete").sort((a,b)=> a.stock - b.stock)
    },

    agregarFavorito : function(juguete) {
     if(!this.favoritos?.some(item => item.nombre === juguete.nombre)) {
        this.favoritos?.push(juguete);
        console.log(this.favoritos);
        juguete.agregar = false;
        localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
         
     }
     this.condicionFav = false;
    },

    quitarFavorito : function(juguete) {
        juguete.agregar = true;
        this.favoritos = this.favoritos?.filter(j => j.nombre !== juguete.nombre)
        this.condicionFav = true;
        localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
    }
  }
  
}).mount('#app')