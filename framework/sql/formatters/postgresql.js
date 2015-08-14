var lastCommaRegex = /,$/;
var spaceAndRegex = /\sAND$/;

module.exports.delete = function _delete(query) {
  "use strict";

  var inserts = [],
    sql = "";

  sql += "DELETE FROM \"" + query.table + "\"";

  if (query.where) {

    sql = this.where(query.where, sql, inserts);

  }

  if (query.limit) {

    sql += " LIMIT " + parseInt(query.limit);

  }

  return {
    inserts: inserts,
    sql: sql
  };

};

module.exports.insert = function insert(query) {
  "use strict";

  var inserts = [],
    sql = "";

  if (!query.columns.length) {

    throw new Error("No Columns");

  }

  sql += "INSERT INTO \"" + query.table + "\" (";

  query.columns.forEach(function (column) {

    sql += "\"" + column + "\",";

  });

  sql = sql.replace(lastCommaRegex, "");

  sql += ") VALUES ";

  query.rows.forEach(function (row) {

    sql += "(";

    row.forEach(function (value) {

      inserts.push(value);

      sql += "$" + inserts.length + ",";

    });

    sql = sql.replace(lastCommaRegex, "");

    sql += "),";

  });

  sql = sql.replace(lastCommaRegex, "");

  if (query.returning) {

    sql += " RETURNING " + query.returning;

  }

  return {
    inserts: inserts,
    sql: sql
  };

};

module.exports.select = function select(query) {
  "use strict";

  var inserts = [],
    sql = "";

  sql += "SELECT ";

  if (query.columns === "*") {

    sql += query.columns;

  } else {

    query.columns.forEach(function (column) {

      sql += "\"" + column + "\",";

    });

    sql = sql.replace(lastCommaRegex, "");

  }

  sql += " FROM \"" + query.table + "\"";

  if (query.where) {

    sql = this.where(query.where, sql, inserts);

  }

  if (query.limit) {

    sql += " LIMIT " + parseInt(query.limit);

  }

  if (query.offset) {

    sql += " OFFSET " + parseInt(query.offset);

  }

  if (query.forUpdate) {

    sql += " FOR UPDATE";

  }

  return {
    inserts: inserts,
    sql: sql
  };

};

module.exports.update = function update(query) {
  "use strict";

  var inserts = [],
    sql = "";

  sql += "UPDATE \"" + query.table + "\" SET";

  Object.keys(query.set).forEach(function (key) {

    inserts.push(query.set[key]);

    sql += " \"" + key + "\" = ";

    sql += "$" + inserts.length + ",";

  });

  sql = sql.replace(lastCommaRegex, "");

  if (query.where) {

    sql = this.where(query.where, sql, inserts);

  }

  if (query.limit) {

    //sql += " LIMIT " + parseInt(query.limit);

  }

  if (query.returning) {

    sql += " RETURNING " + query.returning;

  }

  return {
    inserts: inserts,
    sql: sql
  };

};

module.exports.where = function (where, sql, inserts) {
  "use strict";

  if (Object.keys(where).length) {

    sql += " WHERE";

    Object.keys(where).forEach(function (key) {

      var comparator = "=", value;

      //console.log("where", key, where[key]);

      if (typeof where[key] === "object") {

        comparator = where[key].comparator;

        value = where[key].value;

      } else {

        value = where[key];

      }

      sql += " \"" + key + "\" " + comparator;

      inserts.push(value);

      sql += " $" + inserts.length + " AND";

    });

    sql = sql.replace(spaceAndRegex, "");

  }

  return sql;

};
