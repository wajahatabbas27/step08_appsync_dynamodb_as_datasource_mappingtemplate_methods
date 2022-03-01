"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Step08AppsyncDynamodbAsDatasourceMappingtemplateMethodsStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
// import * as sqs from 'aws-cdk-lib/aws-sqs';
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const appsync = require("@aws-cdk/aws-appsync-alpha");
class Step08AppsyncDynamodbAsDatasourceMappingtemplateMethodsStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        //api for dynamodb mapping template
        const api = new appsync.GraphqlApi(this, "GraphqlApi", {
            name: "Step-08-dynamoDb-as-mapping-tool",
            schema: appsync.Schema.fromAsset("graphql/schema.gql"),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.API_KEY,
                    apiKeyConfig: {
                        expires: aws_cdk_lib_1.Expiration.after(aws_cdk_lib_1.Duration.days(365))
                    }
                }
            }
        });
        //url
        new aws_cdk_lib_1.CfnOutput(this, "ApiGraphqlUrl", {
            value: api.graphqlUrl
        });
        //api key 
        new aws_cdk_lib_1.CfnOutput(this, "apiKey", {
            value: api.apiKey || ''
        });
        //DynamoDb Table
        const dynamoDbTable = new dynamodb.Table(this, "DynamoDbTable", {
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING
            }
        });
        //dynamoDb Data Source 
        const DynamoDB_DataSource = api.addDynamoDbDataSource('DataSource', dynamoDbTable);
        //Resolvers by using dynamoDb DataSource
        DynamoDB_DataSource.createResolver({
            typeName: "Mutation",
            fieldName: "createNote",
            requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(appsync.PrimaryKey.partition('id').auto(), ///Create an autoID for your primary Key Id
            appsync.Values.projecting() ///Add Remaining input values
            ),
            responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem() ////Mapping template for a single result item from DynamoDB.
        });
        DynamoDB_DataSource.createResolver({
            typeName: "Query",
            fieldName: "notes",
            requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
            responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList() ///Mapping template to scan a DynamoDB table to fetch all entries. idhar hmesha ResultList aega
        });
        DynamoDB_DataSource.createResolver({
            typeName: "Mutation",
            fieldName: "deleteNote",
            requestMappingTemplate: appsync.MappingTemplate.dynamoDbDeleteItem('id', 'id'),
            responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem() ///Mapping template to scan a DynamoDB table to fetch all entries.   
        });
        DynamoDB_DataSource.createResolver({
            typeName: "Mutation",
            fieldName: "updateNote",
            requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(///Mapping template to save a single item to a DynamoDB table.
            appsync.PrimaryKey.partition('id').is('id'), ///Where id is input ID
            appsync.Values.projecting() ///Add Remaining input values
            ),
            responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem() ////Mapping template for a single result item from DynamoDB.
        });
    }
}
exports.Step08AppsyncDynamodbAsDatasourceMappingtemplateMethodsStack = Step08AppsyncDynamodbAsDatasourceMappingtemplateMethodsStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcDA4X2FwcHN5bmNfZHluYW1vZGJfYXNfZGF0YXNvdXJjZV9tYXBwaW5ndGVtcGxhdGVfbWV0aG9kcy1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0ZXAwOF9hcHBzeW5jX2R5bmFtb2RiX2FzX2RhdGFzb3VyY2VfbWFwcGluZ3RlbXBsYXRlX21ldGhvZHMtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQWlGO0FBRWpGLDhDQUE4QztBQUM5QyxxREFBcUQ7QUFDckQsc0RBQXNEO0FBSXRELE1BQWEsNERBQTZELFNBQVEsbUJBQUs7SUFDckYsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixtQ0FBbUM7UUFDbkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDckQsSUFBSSxFQUFFLGtDQUFrQztZQUN4QyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUM7WUFDdEQsbUJBQW1CLEVBQUU7Z0JBQ25CLG9CQUFvQixFQUFFO29CQUNwQixpQkFBaUIsRUFBRSxPQUFPLENBQUMsaUJBQWlCLENBQUMsT0FBTztvQkFDcEQsWUFBWSxFQUFFO3dCQUNaLE9BQU8sRUFBRSx3QkFBVSxDQUFDLEtBQUssQ0FBQyxzQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDOUM7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILEtBQUs7UUFDTCxJQUFJLHVCQUFTLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUNuQyxLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQVU7U0FDdEIsQ0FBQyxDQUFBO1FBRUYsVUFBVTtRQUNWLElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQzVCLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxJQUFJLEVBQUU7U0FDeEIsQ0FBQyxDQUFBO1FBRUYsZ0JBQWdCO1FBQ2hCLE1BQU0sYUFBYSxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQzlELFlBQVksRUFBRTtnQkFDWixJQUFJLEVBQUUsSUFBSTtnQkFDVixJQUFJLEVBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNO2FBQ3BDO1NBQ0YsQ0FBQyxDQUFBO1FBRUYsdUJBQXVCO1FBQ3ZCLE1BQU0sbUJBQW1CLEdBQUcsR0FBRyxDQUFDLHFCQUFxQixDQUFDLFlBQVksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUVuRix3Q0FBd0M7UUFDeEMsbUJBQW1CLENBQUMsY0FBYyxDQUFDO1lBQ2pDLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUM3RCxPQUFPLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBK0MsMkNBQTJDO1lBQ25JLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQTZELDZCQUE2QjthQUN0SDtZQUNELHVCQUF1QixFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsa0JBQWtCLEVBQUUsQ0FBcUIsNERBQTREO1NBQ3ZKLENBQUMsQ0FBQTtRQUVGLG1CQUFtQixDQUFDLGNBQWMsQ0FBQztZQUNqQyxRQUFRLEVBQUUsT0FBTztZQUNqQixTQUFTLEVBQUUsT0FBTztZQUNsQixzQkFBc0IsRUFBRSxPQUFPLENBQUMsZUFBZSxDQUFDLGlCQUFpQixFQUFFO1lBQ25FLHVCQUF1QixFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsa0JBQWtCLEVBQUUsQ0FBb0IsK0ZBQStGO1NBQ3pMLENBQUMsQ0FBQTtRQUVGLG1CQUFtQixDQUFDLGNBQWMsQ0FBQztZQUNqQyxRQUFRLEVBQUUsVUFBVTtZQUNwQixTQUFTLEVBQUUsWUFBWTtZQUN2QixzQkFBc0IsRUFBRSxPQUFPLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7WUFDOUUsdUJBQXVCLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFxQixxRUFBcUU7U0FDaEssQ0FBQyxDQUFBO1FBRUYsbUJBQW1CLENBQUMsY0FBYyxDQUFDO1lBQ2pDLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUE0Qiw4REFBOEQ7WUFDdkosT0FBTyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUE4Qyx1QkFBdUI7WUFDaEgsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBOEQsNkJBQTZCO2FBQ3ZIO1lBQ0QsdUJBQXVCLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxDQUF1Qiw0REFBNEQ7U0FDekosQ0FBQyxDQUFBO0lBRUosQ0FBQztDQUNGO0FBM0VELG9JQTJFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENmbk91dHB1dCwgRHVyYXRpb24sIEV4cGlyYXRpb24sIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG4vLyBpbXBvcnQgKiBhcyBzcXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNxcyc7XG5pbXBvcnQgKiBhcyBkeW5hbW9kYiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGInO1xuaW1wb3J0ICogYXMgYXBwc3luYyBmcm9tICdAYXdzLWNkay9hd3MtYXBwc3luYy1hbHBoYSc7XG5pbXBvcnQgeyBNYXBwaW5nVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hd3MtYXBwc3luYy1hbHBoYSc7XG5cblxuZXhwb3J0IGNsYXNzIFN0ZXAwOEFwcHN5bmNEeW5hbW9kYkFzRGF0YXNvdXJjZU1hcHBpbmd0ZW1wbGF0ZU1ldGhvZHNTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvL2FwaSBmb3IgZHluYW1vZGIgbWFwcGluZyB0ZW1wbGF0ZVxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcHBzeW5jLkdyYXBocWxBcGkodGhpcywgXCJHcmFwaHFsQXBpXCIsIHtcbiAgICAgIG5hbWU6IFwiU3RlcC0wOC1keW5hbW9EYi1hcy1tYXBwaW5nLXRvb2xcIixcbiAgICAgIHNjaGVtYTogYXBwc3luYy5TY2hlbWEuZnJvbUFzc2V0KFwiZ3JhcGhxbC9zY2hlbWEuZ3FsXCIpLFxuICAgICAgYXV0aG9yaXphdGlvbkNvbmZpZzoge1xuICAgICAgICBkZWZhdWx0QXV0aG9yaXphdGlvbjoge1xuICAgICAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlLkFQSV9LRVksXG4gICAgICAgICAgYXBpS2V5Q29uZmlnOiB7XG4gICAgICAgICAgICBleHBpcmVzOiBFeHBpcmF0aW9uLmFmdGVyKER1cmF0aW9uLmRheXMoMzY1KSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vdXJsXG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCBcIkFwaUdyYXBocWxVcmxcIiwge1xuICAgICAgdmFsdWU6IGFwaS5ncmFwaHFsVXJsXG4gICAgfSlcblxuICAgIC8vYXBpIGtleSBcbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsIFwiYXBpS2V5XCIsIHtcbiAgICAgIHZhbHVlOiBhcGkuYXBpS2V5IHx8ICcnXG4gICAgfSlcblxuICAgIC8vRHluYW1vRGIgVGFibGVcbiAgICBjb25zdCBkeW5hbW9EYlRhYmxlID0gbmV3IGR5bmFtb2RiLlRhYmxlKHRoaXMsIFwiRHluYW1vRGJUYWJsZVwiLCB7XG4gICAgICBwYXJ0aXRpb25LZXk6IHtcbiAgICAgICAgbmFtZTogJ2lkJyxcbiAgICAgICAgdHlwZTogZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkdcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgLy9keW5hbW9EYiBEYXRhIFNvdXJjZSBcbiAgICBjb25zdCBEeW5hbW9EQl9EYXRhU291cmNlID0gYXBpLmFkZER5bmFtb0RiRGF0YVNvdXJjZSgnRGF0YVNvdXJjZScsIGR5bmFtb0RiVGFibGUpO1xuXG4gICAgLy9SZXNvbHZlcnMgYnkgdXNpbmcgZHluYW1vRGIgRGF0YVNvdXJjZVxuICAgIER5bmFtb0RCX0RhdGFTb3VyY2UuY3JlYXRlUmVzb2x2ZXIoe1xuICAgICAgdHlwZU5hbWU6IFwiTXV0YXRpb25cIixcbiAgICAgIGZpZWxkTmFtZTogXCJjcmVhdGVOb3RlXCIsXG4gICAgICByZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBhcHBzeW5jLk1hcHBpbmdUZW1wbGF0ZS5keW5hbW9EYlB1dEl0ZW0oXG4gICAgICAgIGFwcHN5bmMuUHJpbWFyeUtleS5wYXJ0aXRpb24oJ2lkJykuYXV0bygpLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy9DcmVhdGUgYW4gYXV0b0lEIGZvciB5b3VyIHByaW1hcnkgS2V5IElkXG4gICAgICAgIGFwcHN5bmMuVmFsdWVzLnByb2plY3RpbmcoKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy9BZGQgUmVtYWluaW5nIGlucHV0IHZhbHVlc1xuICAgICAgKSxcbiAgICAgIHJlc3BvbnNlTWFwcGluZ1RlbXBsYXRlOiBhcHBzeW5jLk1hcHBpbmdUZW1wbGF0ZS5keW5hbW9EYlJlc3VsdEl0ZW0oKSAgICAgICAgICAgICAgICAgICAgIC8vLy9NYXBwaW5nIHRlbXBsYXRlIGZvciBhIHNpbmdsZSByZXN1bHQgaXRlbSBmcm9tIER5bmFtb0RCLlxuICAgIH0pXG5cbiAgICBEeW5hbW9EQl9EYXRhU291cmNlLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiBcIlF1ZXJ5XCIsXG4gICAgICBmaWVsZE5hbWU6IFwibm90ZXNcIixcbiAgICAgIHJlcXVlc3RNYXBwaW5nVGVtcGxhdGU6IGFwcHN5bmMuTWFwcGluZ1RlbXBsYXRlLmR5bmFtb0RiU2NhblRhYmxlKCksICAgICAgICAgICAgICAgICAgICAgLy8vTWFwcGluZyB0ZW1wbGF0ZSB0byBzY2FuIGEgRHluYW1vREIgdGFibGUgdG8gZmV0Y2ggYWxsIGVudHJpZXMuXG4gICAgICByZXNwb25zZU1hcHBpbmdUZW1wbGF0ZTogYXBwc3luYy5NYXBwaW5nVGVtcGxhdGUuZHluYW1vRGJSZXN1bHRMaXN0KCkgICAgICAgICAgICAgICAgICAgIC8vL01hcHBpbmcgdGVtcGxhdGUgdG8gc2NhbiBhIER5bmFtb0RCIHRhYmxlIHRvIGZldGNoIGFsbCBlbnRyaWVzLiBpZGhhciBobWVzaGEgUmVzdWx0TGlzdCBhZWdhXG4gICAgfSlcblxuICAgIER5bmFtb0RCX0RhdGFTb3VyY2UuY3JlYXRlUmVzb2x2ZXIoe1xuICAgICAgdHlwZU5hbWU6IFwiTXV0YXRpb25cIixcbiAgICAgIGZpZWxkTmFtZTogXCJkZWxldGVOb3RlXCIsXG4gICAgICByZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBhcHBzeW5jLk1hcHBpbmdUZW1wbGF0ZS5keW5hbW9EYkRlbGV0ZUl0ZW0oJ2lkJywgJ2lkJyksICAgICAgICAgICAvLy9NYXBwaW5nIHRlbXBsYXRlIHRvIGRlbGV0ZSBhIHNpbmdsZSBpdGVtIGZyb20gYSBEeW5hbW9EQiB0YWJsZS5cbiAgICAgIHJlc3BvbnNlTWFwcGluZ1RlbXBsYXRlOiBhcHBzeW5jLk1hcHBpbmdUZW1wbGF0ZS5keW5hbW9EYlJlc3VsdEl0ZW0oKSAgICAgICAgICAgICAgICAgICAgIC8vL01hcHBpbmcgdGVtcGxhdGUgdG8gc2NhbiBhIER5bmFtb0RCIHRhYmxlIHRvIGZldGNoIGFsbCBlbnRyaWVzLiAgIFxuICAgIH0pXG5cbiAgICBEeW5hbW9EQl9EYXRhU291cmNlLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICBmaWVsZE5hbWU6IFwidXBkYXRlTm90ZVwiLFxuICAgICAgcmVxdWVzdE1hcHBpbmdUZW1wbGF0ZTogYXBwc3luYy5NYXBwaW5nVGVtcGxhdGUuZHluYW1vRGJQdXRJdGVtKCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vL01hcHBpbmcgdGVtcGxhdGUgdG8gc2F2ZSBhIHNpbmdsZSBpdGVtIHRvIGEgRHluYW1vREIgdGFibGUuXG4gICAgICAgIGFwcHN5bmMuUHJpbWFyeUtleS5wYXJ0aXRpb24oJ2lkJykuaXMoJ2lkJyksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8vV2hlcmUgaWQgaXMgaW5wdXQgSURcbiAgICAgICAgYXBwc3luYy5WYWx1ZXMucHJvamVjdGluZygpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy9BZGQgUmVtYWluaW5nIGlucHV0IHZhbHVlc1xuICAgICAgKSxcbiAgICAgIHJlc3BvbnNlTWFwcGluZ1RlbXBsYXRlOiBhcHBzeW5jLk1hcHBpbmdUZW1wbGF0ZS5keW5hbW9EYlJlc3VsdEl0ZW0oKSAgICAgICAgICAgICAgICAgICAgICAgLy8vL01hcHBpbmcgdGVtcGxhdGUgZm9yIGEgc2luZ2xlIHJlc3VsdCBpdGVtIGZyb20gRHluYW1vREIuXG4gICAgfSlcblxuICB9XG59XG4iXX0=