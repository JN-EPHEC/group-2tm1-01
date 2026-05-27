FROM nginx:alpine

# Copie de la config Nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf

# Nettoyage et copie des fichiers du build
RUN rm -rf /usr/share/nginx/html/*
COPY ./dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]