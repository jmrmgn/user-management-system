const {
  SchemaDirectiveVisitor,
  AuthenticationError
} = require('apollo-server-express');
const { defaultFieldResolver } = require('graphql');

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = function(...args) {
      const [, , context] = args;
      const user = context.user;
      if (!user) throw new AuthenticationError('Unauthorized');

      return resolve.apply(this, args);
    };
  }
}

module.exports = AuthDirective;
