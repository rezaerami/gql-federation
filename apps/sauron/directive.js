const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');
const { defaultFieldResolver } = require('graphql');

function roleDirectiveTransformer(schema, directiveName) {
    const typeDirectiveArgumentMaps = {};
    return mapSchema(schema, {

        // Executes once for each query in the schema
        [MapperKind.TYPE]: (type) => {
            const authDirective = getDirective(schema, type, directiveName)?.[0]
            if (authDirective) {
                typeDirectiveArgumentMaps[type.name] = authDirective
            }
            return undefined
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
            const authDirective =
                getDirective(schema, fieldConfig, directiveName)?.[0] ??
                typeDirectiveArgumentMaps[typeName]
            if (authDirective) {
                const { requires } = authDirective
                if (requires) {
                    const { resolve = defaultFieldResolver } = fieldConfig
                    fieldConfig.resolve = function (source, args, context, info) {
                        const authorized = requires.some(role => context.user.roles.includes(role))
                        if (!authorized) {
                            throw new Error('not authorized')
                        }
                        return resolve(source, args, context, info)
                    }
                    return fieldConfig
                }
            }
        }
    });
}

module.exports = { roleDirectiveTransformer }
