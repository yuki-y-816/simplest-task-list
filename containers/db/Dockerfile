FROM mysql:8.0.33

WORKDIR /home/database

# install goose
RUN curl -fsSL \
    https://raw.githubusercontent.com/pressly/goose/master/install.sh |\
    sh

# copy migration files & pem file to AWS RDS
COPY ./database /home/database
