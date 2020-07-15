// CfnAuthorizer
import { HttpApi, HttpMethod, LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2';
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';

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
      code: Code.fromAsset('./'),
    })

    const getTasksInteg = new LambdaProxyIntegration({
      handler: '',
    })

    const api = new HttpApi(this, 'api', {})
    api.addRoutes({
      path: '/tasks',
      methods: [ HttpMethod.GET],
      integration: '',
    })
  }
}
