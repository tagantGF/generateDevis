(function($){

	jQuery.fn.tagant_submit_form = function(form_soumis){
		this.on('submit',form_soumis,function(e){
			e.preventDefault();
			var th= $(this);
			console.log('ok','je test');
			//console.log('leNom',sessionStorage.getItem('btnSubmitCliked'));
			var url = th.data('url');
			var nom = th.attr('name');
			var partss = th.serialize();
			var envoyer = true;
			if(form_soumis == '#form_enregistrement'){
				var partss = th.serialize();
				var form_datass = th.serializeArray();
				var mail='';
				var confirmMail='';
				for(var a in form_datass){
					if(form_datass[a]['name'] == 'email'){
						mail = form_datass[a]['value'];
					}else if(form_datass[a]['name'] == 'confirm_email'){
						confirmMail = form_datass[a]['value'];
					}else if(form_datass[a]['name'] == 'pwd'){
						var str = form_datass[a]['value'];
						if(mail != confirmMail){
							envoyer = false;
							$( "body .message").html(
								"<div class='alert alert-warning col-xs-12 col-sm-12 col-md-12 col-lg-12'>\
									<center>Les emails ne correspondent pas !</center>\
								</div>"
							);
							$("body div.message").fadeIn(1000).fadeOut(8000);
						}else if(mail == confirmMail){
							if (str.match( /[0-9]/g) && 
								str.match( /[A-Z]/g) && 
								str.match(/[a-z]/g) && 
								str.match( /[^a-zA-Z\d]/g) &&
								str.length >= 8){
									//fait rien
							}else{
								$( "body .message").html(
									"<div class='alert alert-warning col-xs-12 col-sm-12 col-md-12 col-lg-12'>\
										<center>Le mot de passe entré n'est pas conforme aux règles.</center>\
									</div>"
								);
								$( "body .message").fadeIn(1000).fadeOut(8000);
								envoyer = false;
							} 
						} 
					}
				}
				
			}else if(form_soumis == '#form_connexion'){
				var partss = th.serialize(); 
			}else if(form_soumis == '#form_contact'){
				var partss = th.serialize()+'&token='+sessionStorage.getItem('token')+'&user_num='+sessionStorage.getItem('num_user');
			}else if(form_soumis == '#form_mailClone'){
				var partss = th.serialize()+'&token='+sessionStorage.getItem('token')+'&user_num='+sessionStorage.getItem('num_user');
			}else if(form_soumis == '#form_addLivraison'){
				if(sessionStorage.getItem('num_cmd') == null){
					envoyer = false;
					$( "body .message").html(
						"<div class='alert alert-warning col-xs-12 col-sm-12 col-md-12 col-lg-12'>\
							<center>Veuillez tout d'abord ajouter un article au panier !</center>\
						</div>"
					);
					$( "body .message").fadeIn(1000).fadeOut(8000);
				}else{
					var partss = th.serialize()+'&token='+sessionStorage.getItem('token')+'&num_cmd='+sessionStorage.getItem('num_cmd')+'&user_num='+sessionStorage.getItem('num_user')+'&btn='+sessionStorage.getItem('btnSubmitCliked')+'&idBtn='+sessionStorage.getItem('idBtnSubmitCliked');
					sessionStorage.removeItem('btnSubmitCliked');
				}
			}else if(form_soumis == '#form_info_cp'){
				if(sessionStorage.getItem('num_cmd') == null){
					envoyer = false;
					$( "body .message").html(
						"<div class='alert alert-warning col-xs-12 col-sm-12 col-md-12 col-lg-12'>\
							<center>Veuillez tout d'abord ajouter un article au panier !</center>\
						</div>"
					);
					$( "body .message").fadeIn(1000).fadeOut(8000);
				}else{
					var partss = th.serialize()+'&token='+sessionStorage.getItem('token')+'&num_cmd='+sessionStorage.getItem('num_cmd')+'&user_num='+sessionStorage.getItem('num_user');
				}
			}
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
						if(nom == "enregistrement"){
							if(data == 'Utilisateur existant !'){
								$( "body .message").html(
									"<div class='alert alert-danger col-xs-12 col-sm-12 col-md-12 col-lg-12'>\
										<center>Utilisateur déja existant !</center>\
									</div>"
								);
								$( "body .message").fadeIn(1000).fadeOut(5000);
							}else if(data == 'erreur donnee'){
								$( "body .message").html(
									"<div class='alert alert-danger col-xs-12 col-sm-12 col-md-12 col-lg-12'>\
										<center>Enregistrement impossible veuillez vérifier les données entrées !</center>\
									</div>"
								);
								$( "body .message").fadeIn(1000).fadeOut(5000);
							}else if(data == 'desactive ou code_clt errone !'){
								$( "body .message").html(
									"<div class='alert alert-danger col-xs-12 col-sm-12 col-md-12 col-lg-12'>\
										<center>Compte désactivé ou code client erroné !</center>\
									</div>"
								);
								$( "body .message").fadeIn(1000).fadeOut(5000);
							}else{
								for(var a in data){ 
									if(a == 0){
										for(var b in data[a]){
											for(var c in data[a][b]){
												sessionStorage.setItem(c, data[a][b][c]);
											}
										}
									}else if(a == 1){
										sessionStorage.setItem('token', data[a]);
									}
								}
								$.ajax({
									url:'vue/accueil.html',
									type:'post',
									data:'',
									success:function(data){
										$('#contenu').html(data);
										$('body #navbar_entete').removeAttr('style');
									}
								})
								$('body').tagant_affiche_au_demarage();
							}
						}else if(nom == "connexion"){
							if(data == 'desactive ou code_clt errone !'){
									$( "body .message").html(
										"<div class='alert alert-danger col-xs-12 col-sm-12 col-md-12 col-lg-12'>\
											<center>Compte désactivé ou code client erroné !</center>\
										</div>"
									);
									$( "body .message").fadeIn(1000).fadeOut(3000);
							}else if(data == 'Aucun utilisateur trouve !'){
								$( "body .message").html(
									"<div class='alert alert-danger col-xs-12 col-sm-12 col-md-12 col-lg-12'>\
										<center>Connexion impossible veuillez vérifier les données entrées !</center>\
									</div>"
								);
								$( "body .message").fadeIn(1000).fadeOut(3000);
							}else{
								$('body #navbar_entete').removeAttr('style');
								var url2 = "";
								for(var a in data){
									if(a == 0){
										for(var b in data[a]){
											for(var c in data[a][b]){
												sessionStorage.setItem(c, data[a][b][c]);
												if(c == "role_num" && ['2','3'].includes(data[a][b][c])){
													url2 = 'vue/accueil.html';
												}
											}
										}
									}else if(a == 1){
										sessionStorage.setItem('token', data[a]);
									}
								}
								$.ajax({
									url:url2,
									type:'post',
									data:'',
									success:function(data){
										$('#contenu').html(data);
									}
								})
								$('body').tagant_affiche_au_demarage();
								
							}
						}else if(nom == "contact"){
							$('body .reseteur').trigger('click');
							$( "body .message").html(
								"<div class='alert alert-success col-xs-12 col-sm-12 col-md-12 col-lg-12'>\
									<center>Message bien envoyé !</center>\
								</div>"
							);
							$( "body .message").fadeIn(1000).fadeOut(5000);
						}else if(nom == "adresse_livraison"){
							if(data == 'supprimer'){
								sessionStorage.removeItem('adresseLivraison');
								sessionStorage.removeItem('mesAdresses');
								$("body "+form_soumis+" input.reseteur").trigger('click');

								$('body .okBtnAdLivraison').attr('style','display:none');
								$('body .adLivraisonBtn').trigger('click');

								$('body').tagant_affiche_au_demarage();
							}else{
								$('body .okBtnAdLivraison').removeAttr('style');
								$('body .adLivraisonBtn').trigger('click');
								$( "body .okBtnAdLivraison" ).removeAttr('style');

								var tab = [data['nom'],data['adresse'],data['cp'],data['ville']]; 
								sessionStorage.setItem('adresseLivraison', JSON.stringify(tab));
								$('body').tagant_recup('controleur/getAdresses.php');
							}
						}else if(nom == "info_cp"){
							$('body .okBtnInfoCp').removeAttr('style');
							$('body .infoCpBtn').trigger('click');
							$( "body .okBtnInfoCp" ).removeAttr('style');

							var tab = [data['ref_clt']]; 
							var tab_chantier = [data['chantier']]; 
	 						sessionStorage.setItem('refClt', JSON.stringify(tab));
							sessionStorage.setItem('chantier_code', JSON.stringify(tab_chantier));
						}else if(nom == "devis"){
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