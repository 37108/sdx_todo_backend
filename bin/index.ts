#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import { BackendStack } from '../lib/backend';

const app = new cdk.App();
new BackendStack(app, 'BackendStack');
