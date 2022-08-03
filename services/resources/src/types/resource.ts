import { Resource } from "../resource";
import { builder } from "../builder";

const CommentType = builder
  .objectRef<Resource.CommentEntityType>("Comment")
  .implement({
    fields: (t) => ({
      id: t.exposeString("commentID"),
      text: t.exposeString("text"),
    }),
  });

const ResourceType = builder
  .objectRef<Resource.ResourceEntityType>("Resource")
  .implement({
    fields: (t) => ({
      id: t.exposeID("resourceID"),
      title: t.exposeID("title"),
      url: t.exposeID("url"),
      comments: t.field({
        type: [CommentType],
        resolve: (resource) => Resource.comments(resource.resourceID),
      }),
    }),
  });

builder.queryFields((t) => ({
  resources: t.field({
    type: [ResourceType],
    resolve: () => Resource.list(),
  }),
}));

builder.mutationFields((t) => ({
  createResource: t.field({
    type: ResourceType,
    args: {
      title: t.arg.string({ required: true }),
      url: t.arg.string({ required: true }),
    },
    resolve: async (_, args) => Resource.create(args.title, args.url),
  }),
  addComment: t.field({
    type: CommentType,
    args: {
      resourceID: t.arg.string({ required: true }),
      text: t.arg.string({ required: true }),
    },
    resolve: (_, args) => Resource.addComment(args.resourceID, args.text),
  }),
}));
