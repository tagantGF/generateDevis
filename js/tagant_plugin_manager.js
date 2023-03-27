(function($){

	jQuery.fn.tagant_submit_form = function(form_soumis){
		this.on('submit',form_soumis,function(e){
			e.preventDefault();
			var th= $(this);
			//console.log('leNom',sessionStorage.getItem('btnSubmitCliked'));
			var url = th.data('url');
			var nom = th.attr('name');
			var partss = th.serialize();
			var envoyer = true;
			if(envoyer){
				$.ajax({
					url:url,
					type:'post',
					dataType:'json',
					data:partss,
					beforeSend:function(){
						$('body .defaultMessageShowResult').attr('style','display:none');
						$( "body .loaderShowResult" ).show();
					},
					success:function(data){
						$( "body .loaderShowResult" ).hide();
						if(nom == "devis"){
							var elements = '';
							for(var j in data){
								if(data[j] != null){
									elements += '<div class="form-group blocDevis col-xs-12 col-sm-12 col-md-12 col-lg-12" style="position: absolute;background-color: #ddd;height: 50px;">\
										<div class="form-group col-md-4 col-sm-4" style="height: 22px;top: 16px;">\
											'+data[j]['numero']+'\
										</div>\
										<div class="form-group col-md-4 col-sm-4" style="height: 22px;top: 16px;">\
											'+data[j]['date_saisie']+'\
										</div>\
										<div class="form-group col-md-4 col-sm-4" style="height: 22px;top: 8px;">\
										<button class="sendDevis btn btn-success" name="'+data[j]['numero']+'" id="'+data[j]['sequence']+'">envoyer</button>\
										</div>\
									</div><br><br><br></br>';
								}
							}
							$("body .listDevis").html(elements);
						}
					},
					error:function(data){
						$( "body .loaderShowResult" ).hide();
						try{
							if(['Le token a expiré','Token invalide','Le token est invalide'].includes(JSON.parse(data['responseText'])['message'])){
								var nb = 5;
								var it = setInterval(function(){
									$("body .message").html(
										"<div class='alert alert-warning col-xs-12 col-sm-12 col-md-12 col-lg-12'>\
											<center>Session trop longtemps restée ouverte.Déconnexion imminente ! <span class='badge badge-primary panier_badge'>"+nb+"</span></center>\
										</div>"
									);
									if(nb == 0){
										clearInterval(it);
										$("body .message").fadeOut(1000);
										$('body #deconnexion').trigger('click');
									}else if(nb == 5){
										$( "body .message").fadeIn(1000);
									}
									nb -= 1;
								},1000)
							}
						}catch(error){
							//console.log('erreur',error);
						}
					}
				})
			}
		})
	}
	jQuery.fn.tagant_recup = function(url){
		$.ajax({
			url:url,
			type:'post',
			data:"",
			dataType:'json',
			beforeSend:function(){
				$('body .defaultMessageShowResult').attr('style','display:none');
				$( "body .loaderShowResult" ).show();
			},
			success:function(data){
				$( "body .loaderShowResult" ).hide();
				if(url == 'controleur/getRepresentants.php'){
					var element = '';
					for(var a in data){
						element += '<option value="'+data[a]+'">'+data[a]+'</option>';
					}
					$( "body .representants").html(element);
				}
			},
			error:function(data){
				$( "body .loaderShowResult" ).hide();
				try{
					if(['Le token a expiré','Token invalide','Le token est invalide'].includes(JSON.parse(data['responseText'])['message'])){
						var nb = 5;
						var it = setInterval(function(){
							$("body .message").html(
								"<div class='alert alert-warning col-xs-12 col-sm-12 col-md-12 col-lg-12'>\
									<center>Session trop longtemps restée ouverte.Déconnexion imminente ! <span class='badge badge-primary panier_badge'>"+nb+"</span></center>\
								</div>"
							);
							if(nb == 0){
								clearInterval(it);
								$("body .message").fadeOut(1000);
								$('body #deconnexion').trigger('click');
							}else if(nb == 5){
								$( "body .message").fadeIn(1000);
							}
							nb -= 1;
						},1000)
					}
				}catch(error){
					//console.log('erreur',error);
				}
			}
		})
	}
	jQuery.fn.tagant_delete = function(codeF,nomImage){
		$.ajax({
			url:'controleur/delete.php',
			type:'post',
			data:'token='+sessionStorage.getItem('token')+'&codeF='+codeF+'&nomImage='+nomImage,
			dataType:'json',
			success:function(data){
				if(data == 'Suppression effectuée'){
					$('body').tagant_search_article(sessionStorage.getItem("search_article_id"));
				}
			}
		})
	}
	jQuery.fn.tagant_droit_access = function(){
		if(['1','2','3','4'].includes(sessionStorage.getItem('role_num'))){
			$("body #compte").removeAttr('style');
			$("body #compte").css({
				'margin-right':'30px'
			});
		}
	}
	jQuery.fn.tagant_affiche_au_demarage = function(){
		if(sessionStorage.getItem('token') != null){
			$('body').tagant_recup('controleur/getPanier.php');
			$('body').tagant_recup('controleur/getChantiers.php');
			$('body').tagant_recup('controleur/mailClone.php');
			$('body').tagant_recup('controleur/getAdresses.php');
			$('body').tagant_recup('controleur/getHistorique.php');
			$('body').tagant_droit_access();
			
		}
	}
	jQuery.fn.tagant_show_objet_size = function(data){
		Object.objsize = function(obj) {
			var size = 0, key;
		  
			for (key in obj) {
				if (obj.hasOwnProperty(key))
				size++;
			}
			return size;
		};
		return Object.objsize(data);
	}
})(jQuery)