<?php
class JWT
{
    /**
     * Génération JWT
     * @param array $header Header du token
     * @param array $payload Payload du Token
     * @param string $secret Clé secrète
     * @param int $validity Durée de validité (en secondes)
     * @return string Token
     */
    public function generate(array $header, array $payload,$secret,$validity)
    {
        if($validity > 0){
            $now = new DateTime();
            $expiration = $now->getTimestamp() + $validity;
            $payload['iat'] = $now->getTimestamp();
            $payload['exp'] = $expiration;
        }

        // On encode en base64
        $base64Header = base64_encode(json_encode($header));
        $base64Payload = base64_encode(json_encode($payload));

        // On "nettoie" les valeurs encodées
        // On retire les +, / et =
        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], $base64Header);
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], $base64Payload);

        // On génère la signature
        $secret = base64_encode(SECRET);

        $signature = hash_hmac('sha256', $base64Header . '.' . $base64Payload, $secret, true);

        $base64Signature = base64_encode($signature);

        $signature = str_replace(['+', '/', '='], ['-', '_', ''], $base64Signature);

        // On crée le token
        $jwt = $base64Header . '.' . $base64Payload . '.' . $signature;

        return $jwt;
    }

    /**
     * Vérification du token
     * @param string $token Token à vérifier
     * @param string $secret Clé secrète
     * @return bool Vérifié ou non
     */
    public function check($token,$secret)
    {
        // On récupère le header et le payload
        $header = $this->getHeader($token);
        $payload = $this->getPayload($token);

        // On génère un token de vérification
        $verifToken = $this->generate($header, $payload, $secret, 0);

        return $token === $verifToken;
    }

    /**
     * Récupère le header
     * @param string $token Token
     * @return array Header
     */
    public function getHeader($token)
    {
        // Démontage token
        $array = explode('.', $token);

        // On décode le header
        $header = json_decode(base64_decode($array[0]), true);

        return $header;
    }

    /**
     * Retourne le payload
     * @param string $token Token
     * @return array Payload
     */
    public function getPayload($token)
    {
        // Démontage token
        $array = explode('.', $token);

        // On décode le payload
        $payload = json_decode(base64_decode($array[1]), true);

        return $payload;
    }

    /**
     * Vérification de l'expiration
     * @param string $token Token à vérifier
     * @return bool Vérifié ou non
     */
    public function isExpired($token)
    {
        $payload = $this->getPayload($token);

        $now = new DateTime();

        return $payload['exp'] < $now->getTimestamp();
    }

    /**
     * Vérification de la validité du token
     * @param string $token Token à vérifier
     * @return bool Vérifié ou non
     */
    public function isValid($token)
    {
        return preg_match(
            '/^[a-zA-Z0-9\-\_\=]+\.[a-zA-Z0-9\-\_\=]+\.[a-zA-Z0-9\-\_\=]+$/',
            $token
        ) === 1;
    }
	
	 public function oauth($token)
    {
		$compte = 0;
		require_once '../includes/config.php';

		// On vérifie la validité
		if(!$this->isValid($token)){
			http_response_code(400);
			echo json_encode(['message' => 'Token invalide']);
			$compte-= 1;
		}

		// On vérifie la signature
		if(!$this->check($token, SECRET) && $compte == 0){
			http_response_code(403);
			echo json_encode(['message' => 'Le token est invalide']);
			$compte-= 1;
		}

		// On vérifie l'expiration
		if($this->isExpired($token) && $compte == 0){
			http_response_code(403);
			echo json_encode(['message' => 'Le token a expiré']);
			$compte-= 1;
		}
		return $compte;
    }
}
