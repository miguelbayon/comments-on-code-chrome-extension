document.addEventListener('DOMContentLoaded', function () {
/*	chrome.windows.create({
		url:"src/browser_action/panel.html",
		type:"panel",
		width:300,
		height:200
	});	*/
  document.getElementById('mensaje').addEventListener('keypress', manejarPulsacionEnter);
  document.getElementById('nueva-correccion').addEventListener('click', botonNuevaCorreccionPulsado);
  document.getElementById("mensaje").focus();
  chrome.storage.local.get('correccion', function (contenidoLocalStorage) {
	$('#correccion-hasta-ahora').html(contenidoLocalStorage.correccion);
  });  
});	
	
	
function manejarPulsacionEnter(e) {
    if (e.keyCode == 13 || event.which == 13) {
        event.preventDefault();      
        
        var correccion = "";
        chrome.storage.local.get('correccion', function (contenidoLocalStorage) {
			correccion += contenidoLocalStorage.correccion;
			chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
				
				correccion += '<p>* [' + $('#mensaje').val() + '](' + tabs[0].url + ')</p>';
				chrome.storage.local.set({ "correccion": correccion }, function(){
					$('#mensaje').val("");
				});			
				$('#correccion-hasta-ahora').html(correccion);				
			});

        });         

          
        return false;
    }
}

function botonNuevaCorreccionPulsado(e) {
	chrome.storage.local.set({ "correccion": "" }, function(){
	  chrome.storage.local.get('correccion', function (contenidoLocalStorage) {
		$('#correccion-hasta-ahora').html(contenidoLocalStorage.correccion);
	  });		
	});		
}
