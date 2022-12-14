import { EntityConfiguration } from "electrodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const Client = new DynamoDBClient({});

export const Configuration: EntityConfiguration = {
  table: process.env.tableName,
  client: Client,
};

export * as Dynamo from "./dynamo";
