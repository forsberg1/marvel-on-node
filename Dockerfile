FROM    centos:centos6

# Enable EPEL for Node.js
RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm

RUN     yum install -y npm

RUN yum -y install git


RUN git clone https://github.com/forsberg1/marvel-on-node.git && cd marvel-on-node && git checkout tags/v1.2

# Install app dependencies
RUN cd /marvel-on-node; npm install

EXPOSE  8080
CMD ["node", "/marvel-on-node/server.js"]

