#!/usr/bin/env bash

echo 'initialize replicaset'
mongosh ${MONGO_INITDB_DATABASE} \
        --authenticationDatabase admin \
        --eval 'rs.initiate();'

echo 'Creating application user and db'
mongosh ${MONGO_INITDB_DATABASE} \
        --authenticationDatabase admin \
        --eval "db.createUser({user: '${MONGO_INITDB_USERNAME}', pwd: '${MONGO_INITDB_PASSWORD}', roles:[{role:'dbOwner', db: '${MONGO_INITDB_DATABASE}'}]});"

echo "Show replicaset status"
mongosh ${MONGO_INITDB_DATABASE} \
        --authenticationDatabase admin \
        --eval 'rs.conf()'
