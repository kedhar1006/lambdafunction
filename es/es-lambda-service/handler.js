'use strict';
var moment = require('moment');
//import {compareAsc, format} from 'date-fns';

//var elasticsearch = require('elasticsearch');

//var client = new elasticsearch.Clinet({
//  host: 'https://vpc-kibanaes-7hf47ssvnzvtrlmkokag3l4adm.us-east-2.es.amazonaws.com',
//  log: 'error'
//});
const { Client } = require('elasticsearch')
const client = new Client({
  node: 'https://vpc-kibanaes-7hf47ssvnzvtrlmkokag3l4adm.us-east-2.es.amazonaws.com',
  log: 'error'
})

module.exports.es = async (event, context) => {
 for (var i = 0; i < event.Records.length; i++) {
   var record = event.Records[i];
   try {
     console.log(`testResult : ${record.dynamodb.NewImage?.testResult?.S}`)
     if (record.dynamodb.NewImage?.testResult?.S == null || record.dynamodb.NewImage?.testResult?.S == undefined){
       continue;
     }
     if (record.eventName == "INSERT" || record.eventName == "MODIFY") {
       console.log(record.eventName)
       let finaldate;
       if(record.dynamodb.NewImage?.timestampResult?.N != undefined){
        const dynamodate = moment(record.dynamodb.NewImage?.timestampResult?.N, 'X').format('YYYYMMDD HH:mm:ss')
        console.log("hi",dynamodate,"bye")
  //       console.log("Hi",dynamodate,"hi",typeof(dynamodate))

        const year = +dynamodate.substring(0, 4);
        const month = +dynamodate.substring(4, 6);
        const day = +dynamodate.substring(6, 8);
        const hr = +dynamodate.substring(9, 11);
      const min = +dynamodate.substring(12, 14);
      const sec = +dynamodate.substring(15, 17);

      finaldate = new Date(year, month - 1, day, hr,min,sec);

  console.log(finaldate,typeof(finaldate))
       } else {
        const dynamodate = moment(record.dynamodb.NewImage?.timestampUser?.N, 'X').format('YYYYMMDD HH:mm:ss')
        console.log("hi",dynamodate,"bye")
  //       console.log("Hi",dynamodate,"hi",typeof(dynamodate))

        const year = +dynamodate.substring(0, 4);
        const month = +dynamodate.substring(4, 6);
        const day = +dynamodate.substring(6, 8);
        const hr = +dynamodate.substring(9, 11);
      const min = +dynamodate.substring(12, 14);
      const sec = +dynamodate.substring(15, 17);

      finaldate = new Date(year, month - 1, day, hr,min,sec);
       }


 //      console.log(typeof (record.dynamodb.Newimage?.timestampResult?.N, 'X'))
 //     const date = moment(record.dynamodb.NewImage?.timestampResult?.N, 'X').format('yyyyMMdd'T'HHmmss.SSSZ')
 //       const date = moment(record.dynamodb.Newimage?.timestampResult?.N, 'X').format('YYYY/MM/DD hh:mm:ss')
 //       let date
 //        try{
 //             date = new Date(record.dynamodb.NewImage?.timestampResult?.N * 1000).toISOString()
 //           }
 //         catch(e)
 //         {
 //             date = record.dynamodb.NewImage?.timestampResult?.N
 //         }

      const exists = await client.exists({
         index: 'game-of-thrones',
         id: record.dynamodb.NewImage.uuidTestkit.S
        })
      if(!exists) {
       const body = {
        uuidTestkit: record.dynamodb.NewImage.uuidTestkit.S,
        timestampAgent: record.dynamodb.NewImage?.timestampAgent?.N,
        timestampResult: finaldate === undefined ? undefined : new Date(finaldate),
        testResult: record.dynamodb.NewImage?.testResult?.S,
        timestampUser: record.dynamodb.NewImage?.timestampUser?.N,
        txLink: record.dynamodb.NewImage?.txLink?.S,
        profile_name: record.dynamodb.NewImage?.profile_name?.S,
        profile_picture: record.dynamodb.NewImage?.profile_picture?.S,
        profile_clientID: record.dynamodb.NewImage?.profile_clientID?.S,
        profile_lastname: record.dynamodb.NewImage?.profile_lastname?.S,
        Leaves: record.dynamodb.NewImage?.Leaves?.S,
        userId: record.dynamodb.NewImage?.userId?.S,
        urlVpToken : record.dynamodb.NewImage?.urlVpToken?.S,
        VcToken: record.dynamodb.NewImage?.VcToken?.S,
        VpToken: record.dynamodb.NewImage?.VpToken?.S,
        agentId: record.dynamodb.NewImage?.agentId?.S,
       }

       var result = await client.create({
         index: 'testkit-index',
         type: 'Testkit',
 //        id: 'uuidTestkit',
         id: record.dynamodb.NewImage.uuidTestkit.S,
         body
       });
       console.log("=== completed ===");
       console.log(result);
      } else {
        console.log("modify")
        const body = {
 //         uuidTestkit: record.dynamodb.NewImage.uuidTestkit.S,
          timestampAgent: record.dynamodb.NewImage?.timestampAgent?.N,
          timestampResult: finaldate === undefined ? undefined : new Date(finaldate),
          testResult: record.dynamodb.NewImage?.testResult?.S,
          timestampUser: record.dynamodb.NewImage?.timestampUser?.N,
          txLink: record.dynamodb.NewImage?.txLink?.S,
          profile_name: record.dynamodb.NewImage?.profile_name?.S,
          profile_picture: record.dynamodb.NewImage?.profile_picture?.S,
          profile_clientID: record.dynamodb.NewImage?.profile_clientID?.S,
          profile_lastname: record.dynamodb.NewImage?.profile_lastname?.S,
          Leaves: record.dynamodb.NewImage?.Leaves?.S,
          userId: record.dynamodb.NewImage?.userId?.S,
          urlVpToken : record.dynamodb.NewImage?.urlVpToken?.S,
          VcToken: record.dynamodb.NewImage?.VcToken?.S,
          VpToken: record.dynamodb.NewImage?.VpToken?.S,
          agentId: record.dynamodb.NewImage?.agentId?.S,
         }
  
         var result = await client.update({
           index: 'testkit-index',
           type: 'Testkit',
   //        id: 'uuidTestkit',
           id: record.dynamodb.NewImage.uuidTestkit.S,
           body
         });
      }
     }
   }
   catch (err) {
     console.log(err);
   }
 }
 return 'Successfully processed: ${event.Records.length} records.';
};

