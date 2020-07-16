import { HttpApi, HttpMethod, LambdaProxyIntegration /**CfnAuthorizer**/ } from '@aws-cdk/aws-apigatewayv2';
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { resolve } from 'path';

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const tasksTable = new Table(this, 'tasks', {
      tableName: 'tasks',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: 'user',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
    })


    const getTasks = new Function(this, 'getTasksFunction', {
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: Code.fromAsset(resolve(__dirname, '../lambda/tasks_by_user/'),),
    })

    const getTasksIntegration = new LambdaProxyIntegration({
      handler: getTasks,
    })

    const api = new HttpApi(this, 'api', {})
    api.addRoutes({
      path: '/task',
      methods: [ HttpMethod.GET],
      integration: getTasksIntegration,
    })
  }
}
