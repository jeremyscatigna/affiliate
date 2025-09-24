-- Script pour créer un compte admin
-- 1. D'abord, créez votre compte via /signup avec l'email sos@bettercalljerem.com
-- 2. Ensuite, exécutez ce script dans Supabase SQL Editor

-- Mettre à jour le statut de l'affilié en 'approved'
UPDATE affiliates 
SET status = 'approved' 
WHERE email = 'sos@bettercalljerem.com';

-- Optionnel : Voir votre ID utilisateur
SELECT id, email, name, status 
FROM affiliates 
WHERE email = 'sos@bettercalljerem.com';