#!/bin/bash
sleep 10
mongo --eval 'rs.initiate({ _id: "rs0", members: [{ _id: 0, host: "mongo-replica:27017" }] })'