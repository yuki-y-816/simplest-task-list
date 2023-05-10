FROM mysql:8.0.33

WORKDIR /home/database

# install goose
RUN curl -fsSL \
    https://raw.githubusercontent.com/pressly/goose/master/install.sh |\
    sh

# copy migration files
COPY ./database /home/database
