import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

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
   * lists all tasks sorted by user id
   * @param user user id
   */
  async listTasksByUser(user: string): Promise<any[]> {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: this.table,
      ExpressionAttributeNames: {'#u': 'user'},
      ExpressionAttributeValues: {
        ':pk': user,
      },
      KeyConditionExpression: '#u = :pk',
    };
    const response = await this.client.query(params).promise();
    if (response.Items == undefined) {
      return []
    };
    return response.Items;
  };

  /**
   * create a new task.
   * @param task task info
   */
  async putNewTask(task: Task): Promise<any> {
    const currentDate = Date.now()
    const taskID = 'xxxx'
    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: this.table,
      ReturnValues: 'ALL_OLD',
      Item: {
        user: task.user,
        id: taskID,
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
export async function handler(event: APIGatewayProxyEvent, context: Context):Promise<APIGatewayProxyResult>{
  const client = new DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    region: 'us-east-1',
  });
  const tasksTable = new TasksTable(client);
  const res = await tasksTable.listTasksByUser('test'); // switch test to user id from event.
  const response: APIGatewayProxyResult = {
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
