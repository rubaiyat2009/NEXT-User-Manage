FROM mongo:6.0.10

USER mongodb:mongodb

COPY --chown=999:999 dev-keyfile.key /opt

RUN chmod 400 /opt/dev-keyfile.key

COPY --chown=999:999 ./mongo-init.sh /docker-entrypoint-initdb.d/mongo-init.sh
