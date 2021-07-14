import { types, codes } from "./config";
import robojournalist from "robojournalist";
import { regionThe, ordinal_suffix_of } from './robo_utils_pure_functions.js';
import healthStrings from './robo-strings/health-index-strings.csv';

let healthRoboStrings = {};
healthStrings.forEach(d => {healthRoboStrings[d.varCode] = d.template;});

// A variable to keep track of previous sentence
let intro = true;


function sentGenerator(place, section, topics, pNum) {

    let dataSelect = place
    for (let i = 0; i < topics.length; i++)  {
        dataSelect = dataSelect[topics[i]]
    }
    console.log("data select", dataSelect)
    console.log("Is year change", isXYearChange(dataSelect, topics, "Change3year"))

    let measure = topicify(dataSelect, topics)
    console.log("Topic", measure)

    let roboString = healthRoboStrings["ranking_1_sent"]
    let roboSentence = robojournalist(roboString, {
        Change1year: isXYearChange(dataSelect, topics, "Change1year"),
        Change3year: isXYearChange(dataSelect, topics, "Change3year"),
        Current: isXYearChange(dataSelect, topics, "Current"),
        firstPara: ((pNum==0)|(pNum==3)),
        ladName: place.name,
        ordinalSuffix: ordinal_suffix_of(topics[0]=="data"?dataSelect["Rank"]:dataSelect["hlRank"]),
        rankIsNegative: (topics[1]=="Lowest"),
        regionName: "London",
        londonOrWales: false,
        measure: measure,
        intro: intro,
    })

     console.log("roboSentence", roboSentence)

    return roboSentence;
}

function isXYearChange(dataSelect, topics, change) {
    let trueFalse;

    if (topics[0]=="priority2018") {
        if (change=="Current") {
            if (!dataSelect["hlRankType"].includes("Change")) {
                intro = !(intro==true);
                trueFalse = true
            }
        }
        if (dataSelect["hlRankType"].includes(change)) {
            intro = !(intro==true);
            trueFalse = true
        }
        else {
            trueFalse = false
        }
    }
    if (topics[0]=="data") {
        if (change=="Current") {
            intro = !(intro==true);
            trueFalse = true
        }
        else {
            trueFalse = false
        }
    }
    return trueFalse
}

function sentGenerator2(place, pNum, topics) {
    // console.log("Health topic", topics)

    let dataSelect = place["data"]
    for (let i = 0; i < topics.length; i++)  {
        dataSelect = dataSelect[topics[i]]
    }

    // determine if current or change is higher rank
    let currentChange = currentOrChange(place, topics)

    console.log("dataSelect", dataSelect["Rank"])




    let highLowRank;
    let highLowRankType;
    let highLow;
    if (dataSelect["Rank"]<76) {
        highLowRank = "highestRank";
        highLowRankType = "highestRankType"
        highLow = "Highest"
    }
    if (dataSelect["Rank"]>75) {
        highLowRank = "lowestRank";
        highLowRankType = "lowestRankType"
        highLow = "Lowest"
    }

    let roboString3 = healthRoboStrings["domain_1_sent"]
    let roboSentence3 = robojournalist(roboString3, {
        Change1yearRank: place['priority2018'][highLow][pNum][highLowRankType].includes("Change1year"),
        Change3yearRank: place['priority2018'][highLow][pNum][highLowRankType].includes("Change3year"),
        Current: !place['priority2018'][highLow][pNum][highLowRankType].includes("Change"),
        firstPara: ((pNum==0)|(pNum==3)),
        ladName: place.name,
        ordinalSuffix: ordinal_suffix_of(place['priority2018'][highLow][pNum][highLowRank]),
        rankIsNegative: (highLow=="Lowest"),
        regionName: "London",
        londonOrWales: false,
        measure: place['priority2018'][highLow][pNum]['Measure'].toLowerCase(),
    })

    let roboString4 = healthRoboStrings["domain_2_sent"]
    let roboSentence4 = robojournalist(roboString4, {
        Change1yearRank: place['priority2018'][highLow][pNum][highLowRankType].includes("Change1year"),
        Change3yearRank: place['priority2018'][highLow][pNum][highLowRankType].includes("Change3year"),
        Rank: !place['priority2018'][highLow][pNum][highLowRankType].includes("Change"),
        firstPara: ((pNum==0)|(pNum==3)),
        ladName: place.name,
        ordinalSuffix: ordinal_suffix_of(place['priority2018'][highLow][pNum][highLowRank]),
        rankIsNegative: (highLow=="Lowest"),
        regionName: "London",
        londonOrWales: false,
        measure: place['priority2018'][highLow][pNum]['Measure'].toLowerCase(),
    })

    console.log("currentChange", currentChange)
    let sentence = place.name + " has seen the UK's " + rankify(place, topics, currentChange, dataSelect) +  " " + changify(currentChange) + " in "  + topicify(place, topics, currentChange) + "."

    return  " ";
}

function currentOrChange(place, topics) {

    let dataSelect = place["data"]
    for (let i = 0; i < topics.length; i++)  {
        dataSelect = dataSelect[topics[i]]
    }

    let currentChangeTmp = dataSelect["Change3year Rank"]>dataSelect["Rank"]?(dataSelect["Change1year Rank"]>dataSelect["Rank"]?"current":"oneYear"):(dataSelect["Change1year Rank"]>dataSelect["Change3year Rank"]?"threeYear":"oneYear");

    return currentChangeTmp;
}

function topicify(dataSelect, topics) {
    let topicExpanded;
    if (topics[0]=="data") {
        if (topics[1] == "Overall") {
            topicExpanded = "overall health"
        }
        else if (topics[1] == "Healthy Places") {
            topicExpanded = "environmental factors associated with health"
        }
        else if (topics[1] == "Healthy Lives") {
            topicExpanded = "health-related behaviours"
        }
        else if (topics[1] == "Healthy People") {
            topicExpanded = "health outcomes"
        }
    }
    if (topics[0]=="priority2018") {
        topicExpanded = dataSelect['Measure'].toLowerCase()
    }
    return topicExpanded
}

function parentify(place) {
    let article = (place.parents[place.parents.length - 1].name == "London"| place.parents[place.parents.length - 1].name == "England and Wales"? " " : " the ");
    return article + place.parents[place.parents.length - 1].name;
}

function changify(currentChange) {
    let adjective;
    if (currentChange=="threeYear" | currentChange=="oneYear")  {
        adjective = "greatest improvement";
    }
    else if (currentChange=="current") {
        adjective = "highest";
    }
    return adjective;
}

function rankify(place, topic, currentChange, dataSelect) {

    let rank;
    if (currentChange=="threeYear")  {
        rank = dataSelect["Change3year Rank"];
    }
    else if (currentChange=="oneYear") {
        rank = dataSelect["Change1year Rank"];
    }
    else if (currentChange=="current") {
        rank = dataSelect["Rank"];
    }
    return rank;
}

export { sentGenerator, sentGenerator2 };