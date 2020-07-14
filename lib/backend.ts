import * as ddb from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const tasksTable = new ddb.Table(this, 'tasks', {
      tableName: 'tasks',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: 'user',
        type: ddb.AttributeType.STRING,
      },
      sortKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    })
  }
}
