'use strict';
import * as SQLite from 'expo-sqlite';

let connection = SQLite.openDatabase('localdata.db');

class DB {
  constructor() {
    if (DB.instance) {
      return DB.instance;
    }
    DB.instance = this;
    return this;
  }

  getConnection() {
    return connection;
  }
}

export default new DB();
