<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/html; charset=utf-8");
require_once('../model/bigModelForMe.php');

    $tab = array();
    $devis = getDevis(); 
    foreach($devis->devis as $key=>$val){
        if($val->representant->code != ''){
            $tab[] = $val->representant->nom;
        }
    }
    $tab = array_unique($tab, SORT_REGULAR);
    //tab = preg_replace('#[^a-z]#i',"",$tab);
    sort($tab);
    echo json_encode($tab);
function getDevis(){
    $url = "http://www.quincaillerie-feraud.fr/yzyapi/1.0.0/devis";
    $apiKey = getApi($manager);   // should match with Server key
    // Send request to Server
    $ch2 = curl_init();
    // To save response in a variable from server, set headers;
    curl_setopt( $ch2, CURLOPT_URL, $url);
    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch2, CURLOPT_HTTPHEADER, array(
        "X-API-Key: $apiKey",
        "customer-header2:value2"
    ));
    // Get response
    $responseUsers = curl_exec($ch2);
    curl_close($ch2); 
    // Decode
    $result = json_decode($responseUsers);
    //echo "mon email : ".$clients->client->email;
    return $result;
}
//************************************get api key ************************************* */
function getApi($manager){
    $diff = 0;
    $recup = $manager->selectionUnique2('api',array('*'),"valeur <> ''");
    if(count($recup) > 0){
        $t = $recup[0]->letemps;
        $pp = intval(time());
        $diff = $pp-$t;
    }
   
    if($diff != 0 && $diff < 5*3600){
        return  $recup[0]->valeur;
    }
    else{
        // init curl object        
        $ch = curl_init();
        // define options
        $optArray = array(
            CURLOPT_URL => 'http://www.quincaillerie-feraud.fr/yzyapi/1.0.0/login?username=ITFERAUD&password=PASS4FERO',
            CURLOPT_RETURNTRANSFER => true
        );
        // apply those options
        curl_setopt_array($ch, $optArray);
        // execute request and get response
        $result = curl_exec($ch);
        // also get the error and response code
        $errors = curl_error($ch);
        $response = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        // var_dump($errors);
        // var_dump($response);
        $result = json_decode($result);
        $api_key = $result->api_key;
        $recup2 = $manager->selectionUnique2('api',array('*'),"letemps <> ''");
        if(count($recup2) > 0 && $api_key != ""){
            $table = array(
                'valeur'=>"$api_key",
                'letemps'=>time(),
            );
            $manager->modifier('api',$table,"letemps=$t");
        }else{
            $table = array(
                'valeur'=>"$api_key",
                'letemps'=>time(),
            );
            if($api_key!=""){
                $manager->insertion('api',$table,'');
            }
        }
        return $api_key;
    }
}
//********************************************************************************************************************************** */
?>