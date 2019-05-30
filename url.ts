var nonVolatileHashChange = false;
var onHashChanged:Function;

//Public static 
export function init(hashChangedCallback:Function) {
	onHashChanged = hashChangedCallback;
	window.onhashchange = function(e:any) {
		//Non-volatile
		if (nonVolatileHashChange) {
			nonVolatileHashChange = false;
			e.preventDefault();
			e.stopPropagation();
			
		}
		else onHashChanged(e); //Regularly scheduled hash event		
	}
}

export function setHash(val:string) {
	if (window.location.hash.replace('#', '') != val) {
		nonVolatileHashChange = true;
		window.location.hash = val; //This will trigger a hash event
	}	
}

export function getQueryStringVal(name:string, url?:string) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return true;
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

