const OrderEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "Order",
      service: "orders",
    },
    attributes: {
      orderID: {
        type: "string",
        required: true,
        readOnly: true,
      },
      price: {
        type: "number",
        required: true,
      },
    },
    indexes: {
      primary: {
        pk: {
          field: "pk",
          composite: ["orderID"],
        },
        sk: {
          field: "sk",
          composite: [],
        },
      },
      byArticle: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["articleID"],
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

export async function addOrder(orderId: string, price: number) {
  // code insert here
}

export async function orders() {
  // code insert here
}
