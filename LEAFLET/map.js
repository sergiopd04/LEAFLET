// Inicializar el mapa
var mymap = L.map('mapid').setView([38.1658, -0.7702], 14);

// Añadir capa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 20
}).addTo(mymap);

// Inicializar Leaflet Draw
var drawnItems = new L.FeatureGroup();
mymap.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
  draw: {
    polyline: true,
    polygon: false,
    circle: false,
    marker: true,
    circlemarker: false
  },
  edit: {
    featureGroup: drawnItems,
    remove: true
  }
});
mymap.addControl(drawControl);




mymap.on(L.Draw.Event.CREATED, function (event) {
  var layer = event.layer;
  drawnItems.addLayer(layer);

  
  var latlngs = layer.getLatLngs();

  
  var coordenadas = latlngs.map(function(latlng) {
    return {lat: latlng.lat, lng: latlng.lng};
  });

  var cantidadTrazadas = latlngs.length - 1; 
  
  fetch('guardar_linea.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      coordenadas: coordenadas,
      cantidadTrazadas: cantidadTrazadas 
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Coordenadas de la línea guardadas en la base de datos:', data);
  })
  .catch(error => {
    console.error('Error al guardar las coordenadas de la línea:', error);
  });
});

var computerIcon = L.icon({
  iconUrl: 'assets/represent.png',
  iconSize: [40, 40], 
  iconAnchor: [16, 16], 
});

function mostrarLineas() {
  fetch('mostrar_linea.php')
    .then(response => response.json())
    .then(data => {
      data.forEach(function(datos) {
        var latlngs = datos.coordenadas.map(function(coord) {
          return L.latLng(coord.lat, coord.lng);
        });
        var id = datos.id;
        var colores = datos.colores;

        if (colores.length === 0) {
          colores = ['#000000'];
        }

        var polyline = L.polyline(latlngs, {id: id}).addTo(mymap);
        polyline.bindPopup(generarPopup(datos));
        
        // Asignar colores a cada trazada
        for (var i = 0; i < colores.length; i++) {
          var color = colores[i] || '#000000';
          polyline.setStyle({color: color});
        }

        polyline.on('popupopen', function(e) {
          var popup = e.target.getPopup();
          var content = popup.getContent();
          var id = e.target.options.id;

          
          var tempElement = document.createElement('div');
          tempElement.innerHTML = content;

          // Ahora puedes usar querySelector en el elemento temporal
          var guardarBtn = tempElement.querySelector('.guardar-color-btn');

          guardarBtn.addEventListener('click', function() {
            var colorInputs = tempElement.querySelectorAll('.color-input');
            var colores = [];
            colorInputs.forEach(function(input) {
              colores.push(input.value);
            });
            // Aquí puedes enviar los colores a tu backend para guardarlos en la base de datos
            console.log('ID:', id, 'Colores:', colores);
          });
        });

        polyline.on('popupclose', function() {
          // Limpiar los eventos para evitar duplicados
          this.off('popupopen');
        });
      });
    })
    .catch(error => {
      console.error('Error al cargar las líneas:', error);
    });
}


function generarPopup(datos) {
  var cantidadTrazadas = datos.cantidad_trazadas;
  var popupContent = '<div>';
  
  // Mostrar el ID de la trazada
  popupContent += 'ID: ' + datos.id + '';
  
  // Input de color
  for (var i = 1; i <= cantidadTrazadas; i++) {
    popupContent += '<p>Color ' + ': <input type="color" class="color-input" value="' + datos.colores[i - 1] + '"></p>';
  }

  // Textarea para guardar texto
  popupContent += '<p><textarea class="texto-input">' + datos.texto + '</textarea></p>'; 

  if (datos.texto == null){
    datos.texto == "";
  }
  
  popupContent += '</div>';
  
  popupContent += '<p><button class="guardar-color-btn" data-id="' + datos.id + '">Guardar color</button><p>';
  
  popupContent += '<button class="eliminar-btn" data-id="' + datos.id + '">Eliminar</button>';
  
  return popupContent;
}

// Agregar un event listener para el clic del botón guardar-color
document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('guardar-color-btn')) {
    var id = e.target.getAttribute('data-id');
    var colors = [];
    var colorInputs = document.querySelectorAll('.color-input');
    colorInputs.forEach(function(input) {
      colors.push(input.value);
    });
    var texto = document.querySelector('.texto-input').value; // Obtener el valor del textarea
    // Enviar los datos al servidor
    fetch('guardar_color.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        colors: colors,
        texto: texto // Incluir el texto en los datos enviados al servidor
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Manejar la respuesta del servidor si es necesario
    })
    .catch(error => {
      console.error('Error al guardar los colores:', error);
    });
  }
});


document.addEventListener("DOMContentLoaded", function() {
  mostrarLineas();
});



// Función para eliminar la línea
function eliminarLinea(id) {
  var map = mymap;
  map.eachLayer(function(layer) {
    if (layer instanceof L.Polyline && layer.options.id === id) { 
      map.removeLayer(layer); 
      fetch('eliminar_linea.php?id=' + id)
        .then(response => {
          if (response.ok) {
            console.log('La línea con ID ' + id + ' fue eliminada de la base de datos.');
          } else {
            console.error('Error al eliminar la línea de la base de datos.');
          }
        })
        .catch(error => {
          console.error('Error al eliminar la línea de la base de datos:', error);
        });
    }
  });
}


document.addEventListener('click', function(event) {
  if (event.target.classList.contains('eliminar-btn')) {
    var id = event.target.getAttribute('data-id');
    eliminarLinea(id); 
  }
});





