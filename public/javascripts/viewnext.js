


function TEST(){
	alert("AAA");	

   var i = $('#comment').contents().find(p).value;
	if(i == 1){
		alert("a");
	}else{
		alert(i);
	}

	
}


//-------------------------
//Nextフィールドが更新された場合
//-------------------------

function ifnext(){
	alert("AAA");	
	
//	var e_ifr = document.getElementById('comment');
	//alert(e_ifr.document);
	//var doc = e_ifr.contentWindow.document;
	
	//var e_next = doc.getElementById("next_b").value;
	
//	alert(e_next);
//var j = $('#comment').document.getElementById("next_c").value;
//alert(j);
   var i = $('#comment').contents().getElementById("next_c").value;
	if(i == 1){
		alert("a");
	}else{
		alert(i);
	}

	}

