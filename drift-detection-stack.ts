import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { CloudFormationStackDriftDetectionCheck } from 'aws-cdk-lib/aws-config';
import { SnsTopic } from 'aws-cdk-lib/aws-events-targets';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';

export class DriftDetectionStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        const topic = new Topic(this, 'drift-detection-topic', {
            topicName: 'drift-detection-topic',
            displayName: 'Drift detection topic'
        });

        const check = new CloudFormationStackDriftDetectionCheck(this, 'drift-detection-check');
        check.onComplianceChange('topic-event', {
            target: new SnsTopic(topic)
        });

        new CfnOutput(this, 'drift-detection-topic-arn', {
            value: topic.topicArn,
            description: 'Arn of the topic which publishes drifts detection notification',
            exportName: 'drift-detection-topic-arn'
        });
    }
}
