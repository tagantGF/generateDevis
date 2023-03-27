<?php
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
//require 'vendor/autoload.php';

require '../PHPMailer/src/Exception.php';
 
/* Classe-PHPMailer */
require '../PHPMailer/src/PHPMailer.php';
/* Classe SMTP nécessaire pour établir la connexion avec un serveur SMTP */
require '../PHPMailer/src/SMTP.php';

//Create an instance; passing `true` enables exceptions
function sendMailFunction($numero){
    try {
        $mail = new PHPMailer(true);
        $mail->isSMTP();    //Send using SMTP
        $mail->SMTPAuth = true;   
        //Server settings
        $mail->SMTPDebug = 0;  //SMTP::DEBUG_SERVER;                      //Enable verbose debug output
        $mail->Host = 'smtp.office365.com';                     //Set the SMTP server to send through
        //                                //Enable SMTP authentication
        $mail->Username = 'info-feraud@groupe-feraud.com';                     //SMTP username
        $mail->Password = 'Quy84635';                               //SMTP password
       
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;            //Enable implicit TLS encryption
        $mail->Port = 587;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
       
        //Recipients
        $mail->setFrom('info-feraud@groupe-feraud.com', "Groupe-Feraud");
       
        $mail->addAddress("y.bijaoui@groupe-feraud.com", 'Yohan');     //Add a recipient
        $mail->addBCC("falahometest@gmail.com", 'franck');     //Add a recipient
        //$mail->addBCC('l.abidh@groupe-feraud.com');


        //$mail->addAddress('j.caline@groupe-feraud.com');               //Name is optional
        //$mail->addReplyTo('info@example.com', 'Information');
       
        //$mail->addCC('Suivi-livraison@groupe-feraud.com');
        //$mail->addBCC('y.bijaoui@groupe-feraud.com');
    
        //Attachments
         $mail->addAttachment("$numero.pdf");         //Add attachments
        // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name
    
        //Content
        $mail->isHTML(true);                                  //Set email format to HTML
        $mail->Subject = "Dévis N° $numero";

        $mail->Body =  "Veuillez trouver joint le dévis numéro $numero,<br><br>
                        ";
                        //$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';
        $mail->send();
        //echo 'Message has been sent';
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}

?>