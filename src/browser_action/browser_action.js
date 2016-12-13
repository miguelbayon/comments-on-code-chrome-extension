document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('mensaje').addEventListener('keypress', manejarPulsacionEnter);
	document.getElementById('nueva-correccion').addEventListener('click', botonNuevaCorreccionPulsado);
	document.getElementById("mensaje").focus();
	chrome.storage.local.get('correccion', function (contenidoLocalStorage) {
		$('#correccion-hasta-ahora').html(contenidoLocalStorage.correccion);
	});  

	document.addEventListener('copy', function(e) {
		e.clipboardData.setData('text/html', $('#correccion-hasta-ahora').html());
		e.preventDefault();

	});
});	
	
	
function manejarPulsacionEnter(e) {
	if (e.keyCode == 13 || event.which == 13) {
		event.preventDefault();      

		var correccion = "";
		chrome.storage.local.get('correccion', function (contenidoLocalStorage) {
			correccion += contenidoLocalStorage.correccion;
			chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
				
				if (correccion != "") {
					correccion += '<br>';
				}
				correccion += '* [' + $('#mensaje').val() + '](' + tabs[0].url + ')';
				chrome.storage.local.set({ "correccion": correccion }, function(){
					$('#mensaje').val("");
				});			
				$('#correccion-hasta-ahora').html(correccion);
				document.execCommand('copy');				
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
	$('#mensaje').focus();	
}



