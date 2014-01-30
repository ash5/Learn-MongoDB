

$(function(){
	
	//$("#start").click({id:0},getQuestion);

	$("#start").click($.getScript("/javascripts/test.js",tmp));

	function getQuestion(q){
	
		var json_file = '/question/question.json';
		var i = q.data.id;

		$.getJSON(json_file,function(json){
			//textはテキスト部分の書き換え
			$("#mondai").text("問題"+json[i].q_id+"は"+json[i].sentence+"\r\n");
		});
	}
});