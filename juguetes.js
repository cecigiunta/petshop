Vue.createApp({
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
      .then((res) => res.json())
      .then((data) => {
        this.results = Array.from(data.response);
        this.agregarPropiedades();
        this.getJuguetes();
        
        
      })
      .catch(error => console.log(error));
      this.favoritos = JSON.parse(localStorage.getItem('favoritos'))
  },
  methods: {
    agregarPropiedades: function() {
      for(item of this.results) {
        if(!this.favoritos?.some(favorito => favorito.nombre === item.nombre)) {
          item.agregar = true;
          item.id = item.nombre.replace(/ /g, "_").toLowerCase();
          item.idtag = "#"+item.nombre;
          item.idtag = item.idtag.replace(/ /g, "_").toLowerCase()
          
        } else {
          item.agregar = false;
          item.id = item.nombre.replace(/ /g, "_").toLowerCase();
          item.idtag= "#"+item.nombre;
          item.idtag = item.idtag.replace(/ /g, "_").toLowerCase()
        }
      
      }
    },
    getJuguetes: function () {
        this.juguetes = this.results.filter(item => item.tipo === "Juguete").sort((a,b)=> a.stock - b.stock)
    },

    agregarFavorito : function(item) {
     if(!this.favoritos?.some(favorito=> favorito.nombre === item.nombre)) {
        this.favoritos?.push(item);
        console.log(this.favoritos);
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
  }
  
}).mount('#app')