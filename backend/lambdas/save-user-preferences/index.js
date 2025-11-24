import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log(
    "Event received from API Gateway:",
    JSON.stringify(event, null, 2),
  );

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
    "Access-Control-Allow-Headers":
      "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  };

  try {
    // Para API Gateway, o body vem como string JSON
    let body;
    if (event.body) {
      body = JSON.parse(event.body);
    } else {
      // Se não veio body, tenta pegar diretamente do event (para testes diretos)
      body = event;
    }

    console.log("Parsed body:", body);

    const userId = body.userId;
    console.log("UserID:", userId);

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "userId é obrigatório",
          receivedBody: body,
        }),
      };
    }

    const { keywords, portals } = body;

    const params = {
      TableName: "user-preferences",
      Item: {
        userId,
        keywords: keywords || [],
        portals: portals || [],
        updatedAt: new Date().toISOString(),
      },
    };

    console.log("Saving to DynamoDB:", params);

    await docClient.send(new PutCommand(params));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Preferências salvas com sucesso",
        userId: userId,
        savedData: {
          keywords: params.Item.keywords,
          portals: params.Item.portals,
        },
      }),
    };
  } catch (error) {
    console.error("Erro:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Erro interno do servidor",
        details: error.message,
      }),
    };
  }
};
