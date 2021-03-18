FROM samfop/php7.3:latest

COPY  ./.docker/vhosts/vhost.conf /etc/apache2/sites-available/000-default.conf
COPY  ./.docker/conf.d/* /etc/supervisor/conf.d/

WORKDIR /var/www/html/marcs_tester
