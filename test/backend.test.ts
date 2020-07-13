import { countResources, expect as expectCDK } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Backend from '../lib/backend';

test('Stack has constructor', () => {
    const app = new cdk.App();
    const stack = new Backend.BackendStack(app, 'MyTestStack');

    expectCDK(stack).to(countResources('AWS::DynamoDB::Table', 1));
});
