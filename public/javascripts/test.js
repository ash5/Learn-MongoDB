$(function(){
	
	
	
	$("#test_button").click(function tmp(){

		$.getJSON('/question/question.json',function(json){
		/*
			for(var i in json){
			 xxx = json[i].model_answer;
			}
		*/
			var answer = json[0].model_answer;
		
       var str_tmp="";
		
		var tmp = $.parseJSON('{"a":1,"b":{"d":1},"c":[1,2],"e":[{"a":1},{"f":6}]}');
		var tmp2 = $.parseJSON('[{"a":"abc"},{"b":[{"a":1},2]}]');
		var tmp3 = $.parseJSON('{"a":{"ccc":{"nn":9}},"b":[2,{"x":4}],"c":{"d":"efg"}}');
		var tmp4 = $.parseJSON('[{"a":1},{"b":1}]');
		
		str_work=MakeHint(answer,5);
		str_tmp=trace(answer);
			//指定した要素のHTMLに指定値をセットする．
			$("#test").html(str_work);				
			$("#question").html(str_tmp);				
			
		});//getJSON end
			
		
	});

});

function MakeHint(s,h){
	  mylog = [];
	  var hint = h;//ヒントレベル
	  var last = 0;	  

	  //ヒントレベルの最大値を求める
	  function getLast(txt, LastLebel){
		    var cnt = LastLebel;		    
		    //array
		    if((typeof txt == 'object') && (txt instanceof Array)){
		      cnt++;
		      if(last < cnt)last=cnt;
		      for(var i = 0; i < txt.length; i++){
		    	  cnt++;
			      if(last < cnt)last=cnt;
		    	  getLast(txt[i], cnt);
		    	  cnt--;
		       }		    
		      //object
		    }else if((typeof txt == 'object')){
		      cnt++;
		      if(last < cnt)last=cnt;
		      for(var i in txt){
		    	  cnt++;
			      if(last < cnt)last=cnt;
		    	  getLast(txt[i], cnt);
		    	  cnt--;
		      }		   
		    }	
		    return last;
	  }  
	  
	  /*ヒントの作成*/
	  //インデントの計算
	  function getIndent(num){
	    var ind = [];
	    while(num){
	      ind.push('  ');
	      num--;
	    }
	    return ind.join('');
	  }
	  
	  //出力用にプッシュ
	  function pushLog(num,str){
		  if(hint >= num)mylog.push(str);
		  return;
	  }
	  
	  //再帰
	  function addLog(txt, defaultIndent, HintLebel){
	    var indent = defaultIndent;
	    var cnt = HintLebel;
	
	    //array
	    if((typeof txt == 'object') && (txt instanceof Array)){
	      indent++;
	      cnt++;
	      pushLog(cnt,'[');
	      for(var i = 0; i < txt.length; i++){
	        mylog.push('\r\n' + getIndent(indent));
	        cnt++;
	        addLog(txt[i], indent, cnt);
	        if(i != txt.length - 1){
	        	pushLog(cnt,',');
	         }
	        cnt--;
	      }
	      mylog.push('\r\n' + getIndent(indent - 1) );
	      pushLog(cnt,']');
	    //object
	    }else if((typeof txt == 'object')){
	      indent++;
	      cnt++;
	      pushLog(cnt,'{');
	      for(var i in txt){
	        mylog.push('\r\n' + getIndent(indent));
	        pushLog(last,'"'+i+'"');//最終ヒント
	        cnt++;
	        pushLog(cnt,':');
	        addLog(txt[i], indent, cnt);
	        pushLog(cnt,',');	 
	        cnt--;
	      }
	      mylog.pop();
	      mylog.push('\r\n' + getIndent(indent - 1) );
	      pushLog(cnt,'}');
	    }else{
	      //mylog.push(txt);
	    }
	  }
	  
	  last = getLast(s,0)+1; //ヒントの最大レベル
	  mylog.push("Last="+last+"\n");//確認用
	  addLog(s, 0, 0);//ヒント作成
	  return mylog.join('');	  
	};


function trace(s){
	  mylog = [];
	  
	  function getIndent(num){
	    var ind = [];
	    while(num){
	      ind.push('  ');
	      num--;
	    }
	    return ind.join('');
	  }
	  function addLog(txt, defaultIndent){
	    var cnt = defaultIndent;
	    //array
	    if((typeof txt == 'object') && (txt instanceof Array)){
	      cnt++;
	      mylog.push('[');
	      for(var i = 0; i < txt.length; i++){
	        mylog.push('\r\n' + getIndent(cnt));
	        addLog(txt[i], cnt);
	        if(i != txt.length - 1){
	          mylog.push(',');
	        }
	      }
	      mylog.push('\r\n' + getIndent(cnt - 1) + ']');
	    //object
	    }else if((typeof txt == 'object')){
	      cnt++;
	      mylog.push('{');
	      for(var i in txt){
	        mylog.push('\r\n' + getIndent(cnt) + i + ':');
	        addLog(txt[i], cnt);
	        mylog.push(',');
	      }
	      mylog.pop();
	      mylog.push('\r\n' + getIndent(cnt - 1) + '}');
	    }else{
	      mylog.push(txt);
	    }
	  }
	
	  addLog(s, 0);
	  return mylog.join('');	  
	};

