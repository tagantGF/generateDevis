$(function(){
	console.log('version','1.0.0');

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
				success:function(data){
					if(data == 'fait'){
						sessionStorage.setItem('historiqueCmd', JSON.stringify(data));
						th.parent().parent().parent().remove();
						$('body').tagant_recup('controleur/getHistorique.php');
					}
				}
			})
		}
	}); 
})
