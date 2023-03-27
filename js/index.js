$(function(){
	function firstpage(url){
		$.ajax({
			url:url,
			type:'post',
			data:'',
			success:function(data){
				$('#contenu').html(data);
			}
		})
	}
	firstpage('vue/accueil.html');
	$('body').tagant_recup('controleur/getRepresentants.php');
	$('body').tagant_submit_form('#form_devis');
	$('body').on('click',".sendDevis",function(e){
		var th = $(this);
		var numero = th.attr('name');
		var sequence = th.attr('id');
		if(confirm('Confirmez-vous l\'envoi de ce dévis ?')){
			$.ajax({
				url:"controleur/generate_pdf.php",
				type:'post',
				dataType:'json',
				data:"numero="+numero+'&sequence='+sequence,
				beforeSend:function(){
					$('body .defaultMessageShowResult').attr('style','display:none');
					$( "body .loaderShowResult" ).show();
				},
				success:function(data){
					$( "body .loaderShowResult" ).hide();
					if(data == 'bien envoye'){
						$("body .message").html(
							"<div class='alert alert-success col-xs-12 col-sm-12 col-md-12 col-lg-12'>\
								<center>Dévis bien envoyé !</center>\
							</div>"
						);
						$( "body .message").fadeIn(1000).fadeOut(5000);
					}
				}
			})
		}
	}); 
})
