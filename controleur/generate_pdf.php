<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/html; charset=utf-8");
require_once('../model/bigModelForMe.php');

    if(isset($_POST)){
            $sequence = $_POST['sequence'];
            $numero = $_POST['numero'];
            generatePdf($numero,$sequence,$manager);
            sendMailFunction($numero);
    }

    function generatePdf($numero,$sequence,$manager){
        $url = "http://www.quincaillerie-feraud.fr/yzyapi/1.0.0/devis/$numero/sequences/$sequence/pdf";
        $apiKey = getApi($manager);
        $fh = fopen("../upload/$numero.pdf", "w");
        $curlCh = curl_init();
        curl_setopt($curlCh, CURLOPT_URL, $url);
        curl_setopt($curlCh, CURLOPT_FILE, $fh);
        curl_setopt($curlCh, CURLOPT_HTTPHEADER, array(
            "X-API-Key: $apiKey",
        ));
        curl_exec ($curlCh);
        curl_close ($curlCh);
    }

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
//************************************get api key ************************************* */

?>