window.addEventListener('load', function() {

//querySelector 与えられたCSSセレクタにマッチする最初の要素を返す
  var input = document.querySelector('input[type=text]');
  var textarea = document.querySelector('textarea');


  //e はイベントハンドラ? submit　が押されるたびに以下が実行される.
  document.querySelector('form').addEventListener('submit', function(e) {
	//テキスト入力フィールドの値に文字列を追加
	  textarea.value += 'あなた> ' + input.value + '\n';

    //XML…は非同期データ通信実現のためのAPI
    var req = new XMLHttpRequest();
    
    //アクセス先を指定　/talkを開く
    req.open('POST', '/talk');
    
    //受信中の進捗状況を調べる
    req.onreadystatechange = function() {
    	//readyState=4ならばsend()が完了　statusにアクセスできる　200が成功
      if (req.readyState == 4 && req.status == 200) {
    	  
    	  //responseText は　受信したデータを文字列として取得
        textarea.value += 'munode> ' + req.responseText + '\n';
        
        //scrollを最下部に.
        textarea.scrollTop = textarea.scrollHeight;
        
        //inputを空に
        input.value = '';
      }
    };
    
    //送信データのコンテンツタイプを設定．　データをURLエンコードして送信？
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    //データの送信
    req.send('input=' + encodeURIComponent(input.value));
    
    //イベントがキャンセル可能ならキャンセル.
    e.preventDefault();
  }, false);
  
  //tokutei の　入力欄にフォーカスを合わせる．
  input.focus();

}, false);