$(function() {
	$('#chall-upload-form').submit(function() {
		var no = $(this).find('#chall-no');
		var title = $(this).find('#chall-title');
		var category = $(this).find('#chall-category');
		var flag = $(this).find('#chall-flag');
		var score = $(this).find('#chall-score');
		var contents = $(this).find('#chall-contents');

	/*	if (!challenge.val()) {
			challenge.focus();
			return false
		}*/
		if (!/^[\x00-\xFF]{1,10240}$/.test(contents.val())) {
			contents.focus();
			return false
		}
		$.post({
			url: '/chall/edit/',
			data: {
				/*'challenge': challenge.val(),*/
				'no':no.val(),
				'title':title.val(),
				'category':category.val(),
				'flag':flag.val(),
				'score':score.val(),
				'contents': contents.val()
			},
			dataType: 'json',
			success: function(res) {
				switch (res.status) {
					case 'o':
						show_alert('success', '<b>Success!</b> Please wait while you are redirected.');
						location.replace('/chall');
						break;
					case 'l':
						show_alert('warning', '<b>Warning!</b> You\'re not logged in. Please login first.');
						break;
					case 'p':
						show_alert('warning', '<b>Failed!</b> You can\'t upload chall.');
						break;
					case 'e':
						show_alert('warning','<b>Failed!</b> This chall has beed existed!');
						break;
					default:
						show_alert('danger', '<b>Error!</b> Please try again.');
				}
			},
			error: function() {
				show_alert('danger', '<b>Error!</b> Please try again.')
			}
		});
		return false
	});
	$('#del').click(function(){
		var no = $(this).data('no');
		if(confirm("plz confirm."))
			$.post({
				url : '/chall/delete',
				data:{
					'no':no
				},
				dataType:'json',
				success: function(res) {
					switch (res.status) {
						case 'o':
							show_alert('success', '<b>Success!</b> Please wait while you are redirected.');
							location.replace('/writeup');
							break;
						case 'l':
							show_alert('warning', '<b>Warning!</b> You\'re not logged in. Please login first.');
							break;
						case 'n':
							show_alert('warning', '<b>Failed!</b> This writeup isn\'t already exists.');
							break;
						case 'p':
							show_alert('warning', '<b>Failed!</b> You can\'t delete this writeup.');
							break;
						default:
							show_alert('danger', '<b>Error!</b> Please try again.')
					}
				},
				error: function() {
					show_alert('danger', '<b>Error!</b> Please try again.')
				}
			});
		return false;
		
	});
/*	$('.delete-writeup').click(function() {
		var no = $(this).data('no');
		$.post({
			url: '/writeup/delete',
			data: {
				'no': no
			},
			dataType: 'json',
			success: function(res) {
				switch (res.status) {
					case 'o':
						show_alert('success', '<b>Success!</b> Please wait while you are redirected.');
						location.replace('/writeup');
						break;
					case 'l':
						show_alert('warning', '<b>Warning!</b> You\'re not logged in. Please login first.');
						break;
					case 'n':
						show_alert('warning', '<b>Failed!</b> This writeup isn\'t already exists.');
						break;
					case 'p':
						show_alert('warning', '<b>Failed!</b> You can\'t delete this writeup.');
						break;
					default:
						show_alert('danger', '<b>Error!</b> Please try again.')
				}
			},
			error: function() {
				show_alert('danger', '<b>Error!</b> Please try again.')
			}
		});
		return false
	});*/
});
