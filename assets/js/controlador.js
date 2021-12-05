var usuarios = [];
var stickers = [];
var usuarioSeleccionado = null;
var idChatSeleccionado = null;

function cargarUsuarios() {
  axios({
    method: 'get',
    url: '../../projects/poo-backend-whatsapp/ajax/usuarios',
    responseType: 'json'
  }).then(response => {
    console.log('Usuarios', response);
    usuarios = response.data;
    renderizarUsuarios();
  });
}

function cargarStickers() {
  axios({
    method: 'get',
    url: '../../projects/poo-backend-whatsapp/ajax/stickers/',
    responseType: 'json'
  }).then(response => {
    console.log('Stickers', response);
    stickers = response.data;
  
  });
}

cargarUsuarios();
cargarStickers();

function renderizarUsuarios() {
  for(i=0; i < usuarios.length; i++) {
    document.getElementById('usuarios').innerHTML += 
      `<div class="col-2" onclick="renderizarListaChats(${usuarios[i].id})">
        <img class="rounded-circle my-1" src="assets/profile-pics/${usuarios[i].imagen}">
      </div>`;
  }
}

renderizarUsuarios();

function renderizarListaChats(id) {
  usuarioSeleccionado = id;
  
  axios({
    method: 'get',
    url: '../../projects/poo-backend-whatsapp/ajax/chats/',
    responseType: 'json',
    params: {
      idUsuario: id
    }
  }).then(response => {
    console.log('Chats', response);

    let conversaciones = response.data;
    document.getElementById('lista-chats').innerHTML = '';

    for (let i = 0; i < conversaciones.length; i++) {
      document.getElementById('lista-chats').innerHTML += 
        `<div class="chat p-1 m-2" onclick="mostrarDetalleChat('${conversaciones[i].id}')">
          <div class="img-chat p-3">
          <img src="assets/profile-pics/${conversaciones[i].imagenDestinatario}" class="rounded-circle">
          </div>
          <div class="textos-chat py-3"> <!-- Textos -->
          <div class="d-flex justify-content-between">
          <div><b>${conversaciones[i].nombreDestinatario}</b></div>
          <div>${conversaciones[i].horaUltimoMensaje}</div>
          </div>
          <div class="small">
            ${conversaciones[i].ultimoMensaje}
          </div>
          </div>
        </div>`;
    }
  });
}

function enviarMensaje() {
  let fecha = new Date();
  
  axios(
    {
      method: 'post',
      url: '../../projects/poo-backend-whatsapp/ajax/chats/?id=' + idChatSeleccionado,
      responseType: 'json',
      data: {
          "emisor":  usuarioSeleccionado,
          "receptor": parseInt(idChatSeleccionado.split('-')[2]),
          "mensaje":  document.getElementById('mensaje-input').value,
          "tipo":  "text",
          "hora":  fecha.getHours() + ':' + fecha.getMinutes()
      }
    }
  ).then(response => {
    console.log('Resultado', response);
    mostrarDetalleChat(idChatSeleccionado); 
  });
}

function enviarSticker() {

}

function renderizarContactos() {

}

function mostrarUsuarios() {
  let listaUsuario = document.getElementById('lista-usuarios');
  if (
    listaUsuario.style.display === 'none'
    || !listaUsuario.style.display 
  ) {
    listaUsuario.style.display = 'flex';
  } else {
    listaUsuario.style.display = 'none';
  }
}

function seleccionarOpcion(id, opcionMenu) {
  console.log('Mostrar', id);
  document.getElementById('detalle-chat').style.display = 'none';
  document.getElementById('lista-chats').style.display = 'none';
  document.getElementById('lista-contactos').style.display = 'none';
  document.getElementById(id).style.display = 'block';

  document.querySelectorAll('.menu-option').forEach(etiqueta => {
    etiqueta.classList.remove('activo');
  });
  opcionMenu.classList.add('activo');
}

//Mostrar u ocular los stickers
function toggleStickers() {
  if (
    document.getElementById('stickers').style.display == 'none' 
    || !document.getElementById('stickers').style.display
  ) {
    document.getElementById('stickers').style.display = 'block';
  } else {
    document.getElementById('stickers').style.display = 'none';
  }
}

function mostrarDetalleChat(chatId) {
  idChatSeleccionado = chatId;
  document.getElementById('lista-chats').style.display = 'none';
  document.getElementById('lista-contactos').style.display = 'none';
  document.getElementById('detalle-chat').style.display = 'flex';
  document.getElementById('mensajes').innerHTML  = '';
  
  axios({
    method: 'get',
    url: '../../projects/poo-backend-whatsapp/ajax/chats/',
    params: {
      id: chatId
    },
    responseType: 'json'
  }).then(response => {
    console.log('Chat', response);
    let mensajes = response.data;

    for (let i=0; i<mensajes.length;i++) {

      let mensaje =  '';

      if (mensajes[i].tipo == 'text') {
        mensaje = mensajes[i].mensaje;
      }
      if (mensajes[i].tipo == 'sticker') {
        let resultado = stickers.filter(item => item.id == mensajes[i].sticker)[0];
        mensaje = `<img src="assets/stickers/${resultado.sticker}" style="width: 150px">`;
      }

      document.getElementById('mensajes').innerHTML +=
        `<div class="mensaje ${usuarioSeleccionado == mensajes[i].emisor ? 'enviado' : 'recibido'}">
          ${mensaje}
          <div class="small text-end">${mensajes[i].hora}</div>
        </div>`;
    }
  });


  
}