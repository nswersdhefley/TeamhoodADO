import tl = require('azure-pipelines-task-lib/task');
import {TeamhoodCustomField, TeamhoodTask} from "./TeamhoodTask";
import moment from "moment";
import DurationConstructor = moment.unitOfTime.DurationConstructor;
import * as https from "node:https";
import axios from "axios";



async function run() {
    try {
        const teamhoodapikey: string | undefined = tl.getInput('teamhoodapikey', true);
        const teamhoodbaseurl: string | undefined = tl.getInput('teamhoodbaseurl', true);

        const teamhoodtasktitle: string | undefined = tl.getInput('teamhoodtasktitle', true);
        let payload: TeamhoodTask = {
            title: teamhoodtasktitle ?? "New Task from ADO",
        }

        const teamhoodboardid: string | undefined = tl.getInput('teamhoodboardid', true);
        if (teamhoodboardid && teamhoodboardid !== '') {
            payload.boardId = teamhoodboardid;
        }
        const teamhoodassigneduserid: string | undefined = tl.getInput('teamhoodassigneduserid', false);
        if (teamhoodassigneduserid && teamhoodassigneduserid !== '') {
            payload.assignedUserId = teamhoodassigneduserid;
        }
        const teamhoodownerid: string | undefined = tl.getInput('teamhoodownerid', false);
        if (teamhoodownerid && teamhoodownerid !== '') {
            payload.ownerId = teamhoodownerid;
        }

        const teamhoodrowid: string | undefined = tl.getInput('teamhoodrowid', true);
        if (teamhoodrowid && teamhoodrowid !== '') {
            payload.rowId = teamhoodrowid
        }

        const teamhoodstatusid: string | undefined = tl.getInput('teamhoodstatusid', false);
        if (teamhoodstatusid && teamhoodstatusid !== '') {
            payload.statusId = teamhoodstatusid;
        }

        const teamhooddescription: string | undefined = tl.getInput('teamhooddescription', false);
        if (teamhooddescription && teamhooddescription !== '') {
            payload.description = teamhooddescription
        }

        const teamhoodestimation: string | undefined = tl.getInput('teamhoodestimation', false);
        if (teamhoodestimation && teamhoodestimation !== '') {
            payload.estimation = +teamhoodestimation;
        }
        const teamhoodworkspaceid: string | undefined = tl.getInput('teamhoodworkspaceid', true);
        if (teamhoodworkspaceid && teamhoodworkspaceid !== '') {
            payload.workspaceId = teamhoodworkspaceid;
        }

        /* these need more processing */
        const teamhoodstartdate: string | undefined = tl.getInput('teamhoodstartdate', false);
        if (teamhoodstartdate && teamhoodstartdate !== '') {
            let startMoment = moment();

            let startNumMatches = RegExp(/(\d+)/).exec(teamhoodstartdate);
            if (startNumMatches) {

                let startNum = startNumMatches[0];
                const startParts = teamhoodstartdate.split(startNum);


                if (startParts[0] === '+' && startParts.length === 2) {
                    startMoment = moment().add(+startNum, startParts[1] as DurationConstructor);
                }

                if (startParts[0] === '-' && startParts.length === 2) {
                    startMoment = moment().subtract(+startNum, startParts[1] as DurationConstructor);
                }
            }
            payload.startDate = startMoment.toISOString();

        }


        const teamhoodduedate: string | undefined = tl.getInput('teamhoodduedate', false);
        if (teamhoodduedate && teamhoodduedate !== '') {

            let dueMoment = moment();
            let dueNumMatches = RegExp(/(\d+)/).exec(teamhoodduedate);
            if (dueNumMatches) {
                const dueNum =dueNumMatches[0];
                const dueParts = teamhoodduedate.split(dueNum);

                console.log(teamhoodduedate, dueNum, dueParts)


                if (dueParts[0] === '+' && dueParts.length === 2) {
                    dueMoment = moment().add(+dueNum, dueParts[1] as DurationConstructor);
                }

                if (dueParts[0] === '-' && dueParts.length === 2) {
                    dueMoment = moment().subtract(+dueNum, dueParts[1] as DurationConstructor);
                }
            }
            payload.dueDate = dueMoment.toISOString();

        }

        const teamhoodcustomfields: string | undefined = tl.getInput('teamhoodcustomfields', false);
        if (teamhoodcustomfields && teamhoodcustomfields !== '') {
            const customFields:TeamhoodCustomField[] = []
            const fieldParts = teamhoodcustomfields.split(',').map(part=>part.trim());
            fieldParts.forEach(part => {
                const partParts = part.split(':').map(part => part.trim());
                customFields.push( {"name": partParts[0], "value": partParts[1]} );
            })
            payload.customFields = customFields;
        }

        const teamhoodtags: string | undefined = tl.getInput('teamhoodtags', false);
        if (teamhoodtags && teamhoodtags !== '') {
            payload.tags = teamhoodtags.split(',').map(t=>t.trim());
        }

        if (teamhooddescription) {
            payload.description = teamhooddescription;
        }

        const headers = {
            'X-ApiKey': teamhoodapikey,
            'Content-Type': 'application/json',
        }


        axios.post(teamhoodbaseurl + 'api/v1/items', payload, {
            headers: headers
        }).then( (response)=>{
            console.log(response.data ?? "NO DATA RETURNED");
            tl.setResult(tl.TaskResult.Succeeded);
        }).catch((err)=>{

            console.log(err.toJSON())
            console.log(err)
            tl.setResult(tl.TaskResult.Failed, err.message);
        })


      return;
    }
    catch (err:any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();