/**
 * todo
 * switching to ddb doc client
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property
 */
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { PutItemInput, QueryInput } from 'aws-sdk/clients/dynamodb';

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
  private readonly db: DynamoDB.DocumentClient;
  private readonly table = 'tasks';
  constructor(db: DynamoDB.DocumentClient) {
    this.db = db;
  }

  /**
   * lists all tasks sorted by user id
   * @param user user id
   */
  async listTasksByUser(user: string): Promise<any[]> {
    const params: QueryInput = {
      TableName: this.table,
      ExpressionAttributeNames:{'#u': 'user'},
      ExpressionAttributeValues: {
        ':value': { S: user},
      },
      KeyConditionExpression: '#u = :value',
    };
    const response = await this.db.query(params).promise();
    if (response.Items == undefined) {
      return []
    };
    return response.Items;
  };

  /**
   * create a new task.
   * @param task task info
   */
  async putNewTask(task: Task): Promise<Task> {
    const currentDate = Date.now()
    const taskID = 'xxxx'
    const params: PutItemInput = {
      TableName: this.table,
      Item: {
        user: {
          S: task.user,
        },
        id: {
          S: taskID,
        },
        created: {
          N: currentDate.toString(),
        },
        updated: {
          N: currentDate.toString(),
        },
        title: {
          S: task.title,
        },
        note: {
          S: task.note,
        },
        completed: {
          BOOL: task.completed,
        },
      }
    }
    await this.db.putItem(params).promise();
    return task;
  }
}

/**
 * query all tasks sorted by user.
 * @param event API Gateway Proxy Event
 * @param context Lambda Context
 */
export async function handler(event: APIGatewayProxyEvent, context: Context):Promise<APIGatewayProxyResult>{
  const db = new DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    region: 'us-east-1',
  });
  const tasksTable = new TasksTable(db);
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
