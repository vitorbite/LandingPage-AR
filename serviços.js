let serviço;
function abrirServiço(s) {
  console.log(s);
  serviço = document.getElementById(s);
  serviço.style.display = "block";
  serviço.scrollTo({top: 0})
  document.body.style.overflowY = "hidden";
}

function fecharServiço() {
  serviço.style.display = "none";
  document.body.style.overflowY = "scroll";
  document.getElementById('Serviços').style.overflowY = 'hidden';
}
