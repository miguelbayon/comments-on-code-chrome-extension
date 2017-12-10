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
        
        var modoMarkdown = false;
		var correccion = "";
        
		chrome.storage.local.get('correccion', function (contenidoLocalStorage) {
			correccion += contenidoLocalStorage.correccion;
			chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
				
				if (modoMarkdown) {                
                    if (correccion != "") {
                        correccion += '<br>';
                    }
                }
                else {
                    if (correccion != "") {
                        correccion += '<br>';
                    }                    
                }
				
				if (modoMarkdown) {
                    correccion += '* [' + $('#mensaje').val() + '](' + tabs[0].url + ')';                    
                }
                else {
                    correccion += tabs[0].url + ": " + $('#mensaje').val() + ".";     
                }
                
				chrome.storage.local.set({ "correccion": correccion }, function(){
					$('#mensaje').val("");
				});			
				$('#correccion-hasta-ahora').html(correccion);
                copyTextToClipboard(correccion);   				
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


function copyTextToClipboard(text) {
        
    chrome.tabs.executeScript({code: "\
        var input = document.createElement('textarea');\
        input.value = '" + text.split('<br>').join('\\n') + "';\
        input.style.cssText = 'opacity:0; position:fixed';\
        document.body.appendChild(input);\
        input.focus();\
        input.select();\
        document.execCommand('Copy');\
        input.remove();\
    "});
}

