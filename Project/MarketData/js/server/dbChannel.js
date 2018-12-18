const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'UW_project';

Mongodb = {
  db: null,
  testConnection: function () {
    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      const db = client.db(dbName);
      client.close();
      console.log("Disconnect successfully to server");
    });
  },
  insertData: function (collection, data) {
    if (data) {
      MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        const dbo = client.db(dbName);
        dbo.collection(collection).insertMany(data, function(err, res) {
          if (err) throw err;
          console.log("Number of documents inserted: " + res.insertedCount);
          client.close();
        });
      });
    }
  },
  findAllData: function(collection, callback){
    MongoClient.connect(url, function(err, client) {
      if (err) throw err;
      var dbo = client.db(dbName);
      dbo.collection(collection).find({}).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        client.close();
      })
    });
  },
  findOneData: function(collection, key, value, callback){
    MongoClient.connect(url, function(err, client) {
      if (err) throw err;
      var dbo = client.db(dbName);
      dbo.collection(collection).find({}, {
        _id: false,
        UserName: true,
        DateTime: false
      }).toArray(function(err, result) {
        if (err) throw err;
        callback(result);
        client.close();
      });
    });
  }
}
