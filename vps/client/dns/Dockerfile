FROM internetsystemsconsortium/bind9:9.18

# On copie tes fichiers de configuration dans le conteneur
COPY named.conf /etc/bind/named.conf
COPY named.conf.local /etc/bind/named.conf.local
# On copie tes zones (le dossier complet)
COPY zones/ /var/lib/bind/

# On s'assure que Bind a les droits sur ses fichiers
RUN chown -R bind:bind /etc/bind/ /var/lib/bind/

# On lance le service avec les bons drapeaux
CMD ["-g", "-c", "/etc/bind/named.conf", "-u", "bind"]