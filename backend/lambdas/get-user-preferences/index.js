import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log("GET Event completo:", JSON.stringify(event, null, 2));
  console.log("Query String Parameters:", event.queryStringParameters);
  console.log("Raw Query String:", event.rawQueryString);

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
    "Access-Control-Allow-Headers":
      "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  };

  try {
    // Debug completo dos parâmetros
    console.log("Todos os query parameters:", event.queryStringParameters);

    const userId = event.queryStringParameters?.userId;
    console.log("UserID extraído:", userId);

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "userId é obrigatório nos query parameters",
          receivedParams: event.queryStringParameters,
          rawQuery: event.rawQueryString,
        }),
      };
    }

    const params = {
      TableName: "user-preferences",
      Key: { userId },
    };

    console.log("Buscando no DynamoDB:", params);

    const result = await docClient.send(new GetCommand(params));
    console.log("Resultado do DynamoDB:", result);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        preferences: result.Item || {
          keywords: [],
          portals: [],
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
