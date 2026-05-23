$TTL 86400
@   IN  SOA ns.m1-4.ephec-ti.be. m1-4.ephec-ti.be. (
        2026051506 ; Serial (AnnéeMoisJour + n°)
        3600       ; Refresh
        900        ; Retry
        1209600    ; Expire
        86400 )    ; Minimum

; --- Serveurs de noms (NS) ---
@       IN  NS      ns.m1-4.ephec-ti.be.

; --- Enregistrements A (Pointent vers ton VPS) ---
@       IN  A       91.134.138.211
ns      IN  A       91.134.138.211
www     IN  A       91.134.138.211
api     IN  A       91.134.138.211

; --- Alias (CNAME) ---
blog    IN  CNAME   www

; --- Sécurité---

_acme-challenge.m1-4.ephec-ti.be.  IN  TXT  "Bn3fRgpLyVKfEp85LQBg_U10IJqOAtuznjyxJewP2sk"
_acme-challenge.www.m1-4.ephec-ti.be. IN TXT "O_UQh-xNqUg9O3Duee2fObxs8zG82ejk2TUCkkDbbeM"