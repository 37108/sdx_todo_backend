import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 } from 'uuid';

/**
 * attributes about tasks table
 */
export interface Task {
  user: string;
  id?: string;
  title?: string;
  note?: string;
  completed?: boolean;
  created?: number;
  updated?: number;
}

/**
 * todo task table.
 * attributes are defined by Tasks interface.
 */
export class TasksTable {
  private readonly client: DynamoDB.DocumentClient;
  private readonly table = 'tasks';
  constructor(client: DynamoDB.DocumentClient) {
    this.client = client;
  }

  /**
   * create a new task.
   * @param task task info
   */
  async putNewTask(task: Task): Promise<any> {
    const currentDate = Date.now()
    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: this.table,
      ReturnValues: 'ALL_OLD',
      Item: {
        user: task.user,
        id: v4(),
        created: currentDate,
        updated: currentDate,
        title:task.title,
        note: task.note,
        completed: task.completed,
      }
    }
    await this.client.put(params).promise();
    return params.Item;
  }
}

/**
 * query all tasks sorted by user.
 * @param event API Gateway Proxy Event
 * @param context Lambda Context
 */
export async function handler(event: APIGatewayProxyEventV2, context: Context):Promise<APIGatewayProxyResultV2>{
  if (!event.body) {
    throw new Error('body must be included');
  }
  const body = JSON.parse(event.body);

  const client = new DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    region: 'us-east-1',
  });
  const tasksTable = new TasksTable(client);
  const res = await tasksTable.putNewTask({
    user: body.user,
    title: body.title,
    note: body.note,
    completed: body.completed,
  });
  const response: APIGatewayProxyResultV2 = {
    statusCode: 200,
    isBase64Encoded: false,
    body: JSON.stringify(res),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  }
  return response;
}
