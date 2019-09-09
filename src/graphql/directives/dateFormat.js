const dateFormat = require('dateformat');
const { SchemaDirectiveVisitor } = require('apollo-server-express');
const { defaultFieldResolver } = require('graphql');

class DateFormatDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const { format } = this.args;

    field.resolve = async function(...args) {
      const date = await resolve.apply(this, args);

      return dateFormat(date, format);
    };
  }
}

module.exports = DateFormatDirective;
