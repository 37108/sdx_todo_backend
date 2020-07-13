import { expect as expectCDK, MatchStyle, matchTemplate } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Backend from '../lib/backend';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Backend.BackendStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
