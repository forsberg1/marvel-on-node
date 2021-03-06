FROM    centos:centos6

# Enable EPEL for Node.js
RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm

RUN     yum install -y npm

WORKDIR /var/www/

RUN npm install -g nodemon

EXPOSE  8080
