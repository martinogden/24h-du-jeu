FROM python:2.7-slim
MAINTAINER Martin Ogden <martin.ogden@gmail.com>

RUN apt-get -y update
# build tools
RUN apt-get install -y gcc dh-autoreconf libpq-dev binutils

# need to install these here before we purge gcc
RUN pip install psycopg2==2.6.2 pillow==3.3.0

# clean up build tools
RUN apt-get purge -y gcc dh-autoreconf

RUN mkdir -p /usr/src
WORKDIR /usr/src
COPY src /usr/src

# configuration
COPY etc/gunicorn.conf /etc/
ENV PYTHONPATH $PYTHONPATH:/usr/src

# install python deps
ADD requirements.txt /usr/src/
RUN pip install -r requirements.txt

# run server
CMD [ "gunicorn", "--config=/etc/gunicorn.conf", "config.wsgi:application" ]
EXPOSE 80