export * as Resource from "./resource";
import { Dynamo } from "./dynamo";
import { Entity, EntityItem } from "electrodb";
import { ulid } from "ulid";

export const ResourceEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "Resource",
      service: "esbuild",
    },
    attributes: {
      resourceID: {
        type: "string",
        required: true,
        readOnly: true,
      },
      title: {
        type: "string",
        required: true,
      },
      url: {
        type: "string",
        required: true,
      },
    },
    indexes: {
      primary: {
        pk: {
          field: "pk",
          composite: [],
        },
        sk: {
          field: "sk",
          composite: ["resourceID"],
        },
      },
    },
  },
  Dynamo.Configuration
);

const CommentEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "Comment",
      service: "esbuild",
    },
    attributes: {
      commentID: {
        type: "string",
        required: true,
        readOnly: true,
      },
      resourceID: {
        type: "string",
        required: true,
        readOnly: true,
      },
      text: {
        type: "string",
        required: true,
      },
    },
    indexes: {
      primary: {
        pk: {
          field: "pk",
          composite: ["commentID"],
        },
        sk: {
          field: "sk",
          composite: [],
        },
      },
      byResource: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["resourceID"],
        },
        sk: {
          field: "gsi1sk",
          composite: ["commentID"],
        },
      },
    },
  },
  Dynamo.Configuration
);

export function create(title: string, url: string) {
  return ResourceEntity.create({
    resourceID: ulid(),
    title,
    url,
  }).go();
}

export async function list() {
  return ResourceEntity.query.primary({}).go();
}

export async function addComment(resourceID: string, text: string) {
  return CommentEntity.create({
    resourceID,
    commentID: ulid(),
    text,
  }).go();
}

export async function comments(resourceID: string) {
  return CommentEntity.query
    .byResource({
      resourceID,
    })
    .go();
}

export type ResourceEntityType = EntityItem<typeof ResourceEntity>;
export type CommentEntityType = EntityItem<typeof CommentEntity>;
