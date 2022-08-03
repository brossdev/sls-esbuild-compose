import {
  ExecutionContext,
  Request,
  processRequest,
  getGraphQLParameters,
} from "graphql-helix";
import { Context, APIGatewayEvent } from "aws-lambda";
import { GraphQLSchema } from "graphql";
import {
  IExecutableSchemaDefinition,
  makeExecutableSchema,
} from "@graphql-tools/schema";
import { schema } from "./schema";

type HandlerConfig<C> = {
  context?: (request: {
    event: APIGatewayEvent;
    context: Context;
    execution: ExecutionContext;
  }) => Promise<C>;
} & (
  | {
      schema: GraphQLSchema;
    }
  | {
      resolvers: IExecutableSchemaDefinition["resolvers"];
      typeDefs: IExecutableSchemaDefinition["typeDefs"];
    }
);

function createHandler<T>(config: HandlerConfig<T>) {
  const schema =
    "schema" in config
      ? config.schema
      : makeExecutableSchema({
          typeDefs: config.typeDefs,
          resolvers: config.resolvers,
        });

  const handler = async (event: APIGatewayEvent, context: Context) => {
    console.log({ event });
    const request: Request = {
      body: event.body ? JSON.parse(event.body) : undefined,
      query: event.queryStringParameters,
      method: event.httpMethod,
      headers: event.headers,
    };

    const { operationName, query, variables } = getGraphQLParameters(request);

    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema,
      contextFactory: async (execution) => {
        if (config.context) {
          return config.context({
            event: event,
            context,
            execution,
          });
        }
        return undefined;
      },
    });

    if (result.type == "RESPONSE") {
      return {
        statusCode: result.status,
        body: JSON.stringify(result.payload),
        headers: Object.fromEntries(
          result.headers.map((h) => [h.name, h.value])
        ),
      };
    }

    return {
      statusCode: 500,
    };
  };
  return handler;
}

export const graphqlHandler = createHandler({ schema });
