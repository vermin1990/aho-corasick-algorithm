/* ----------- LOCAL VARIABLES -------------*/
var nodeGeneratedId = 0;
var nodeContainer = new Array();
var tree = null;
var tStart;
var tEnd;
/*----------- ------------------------------*/
class Result {

    constructor() {
        this.key="";
        this.startIndex = new Array();
    }

}

class Node {

    constructor(id, char, outputs, parentNodeId, failNodeId, children) {
        this.id = id;
        this.char = char;
        this.outpts = outputs;
        this.parentNodeId = parentNodeId;
        this.failNodeId = failNodeId;
        this.children = children;
        this.path = "";
    }
}


function createExpression(dictionary) {

    let expression = null;

    if (dictionary == null || dictionary.length === 0) {

        console.log('The dictionary was empty!');
        return expresssion;
    }

    //Create the root of the tree which is called start node
    let startNode = new Node(nodeGeneratedId, '', null, null, null, new Array());
    nodeContainer.push(startNode);

    //Generate immediate children of the start node!
    generateStartNodeChildren(startNode, dictionary);

    //start a revursive procedure in order to pouplate the tree
    populateTree(startNode, dictionary);

    //Set all fail relationships
    makeFailRelations(startNode);

    expression = JSON.stringify(startNode);
    console.log(expression);
}

function populateTree(node, dictionary) {

    let children = node.children;

    //TODO : It is a very complex loop!
    for (let i = 0; i < children.length; i++) {

        let currentParent = children[i];
        let statement = currentParent.path + currentParent.char;
        let checkList = new Array();

        for (let j = 0; j < dictionary.length; j++) {

            if (dictionary[j].startsWith(statement)) {

                let pattern = dictionary[j];
                let nextChar = pattern[statement.length];

                if (nextChar === undefined || checkList[nextChar.charCodeAt(0)] === true) {
                    continue;
                }

                checkList[nextChar.charCodeAt(0)] = true;
                nodeGeneratedId += 1;

                let newChild = new Node(nodeGeneratedId, nextChar, new Array(), currentParent.id, null, new Array());
                newChild.path = currentParent.path + currentParent.char;

                for (let z = 0; z < dictionary.length; z++) {
                    if (dictionary[z] === (newChild.path + newChild.char)) {
                        newChild.outpts.push(newChild.path + newChild.char);
                    }
                }

                currentParent.children.push(newChild);
                nodeContainer[newChild.id] = newChild;
            }

        }
        populateTree(currentParent, dictionary);
    }
}

function makeFailRelations(node) {

    let queue = new Array();

    for (let i = 0; i < node.children.length; i++) {
        queue.push(node.children[i]);
    }

    while (queue.length != 0) {

        let selectedNode = queue.shift();

        if ((nodeContainer[selectedNode.parentNodeId]).char === "") {

            selectedNode.failNodeId = selectedNode.parentNodeId;

            for (let i = 0; i < selectedNode.children.length; i++) {
                queue.push(selectedNode.children[i]);
            }
        }
        else {

            //TODO: Bad Practice!
            let isFirstItarate = true;
            let failNode = 0;
            while (failNode != null) {

                //TODO: Bad Practice
                if (isFirstItarate === true) {

                    failNode = nodeContainer[(nodeContainer[selectedNode.parentNodeId]).parentNodeId];
                    isFirstItarate = false;
                }
                else {
                    failNode = nodeContainer[failNode.parentNodeId];

                }

                if (failNode != null) {

                    for (let i = 0; i < failNode.children.length; i++) {

                        if (failNode.children[i].char === selectedNode.char) {

                            selectedNode.failNodeId = failNode.children[i].id;

                            if (failNode.children[i].outpts.length != 0) {

                                for (let j = 0; j < failNode.children[i].outpts.length; j++) {
                                    selectedNode.outpts.push(failNode.children[i].outpts[j]);
                                }
                            }

                            for (let j = 0; j < selectedNode.children.length; j++) {
                                queue.push(selectedNode.children[j]);
                            }

                            failNode = null;
                            break;
                        }
                    }
                }

                //Inner while-loop exit point!
                if (failNode === undefined || failNode == null) {

                    //When no fail node is found for the selected node, just redirect it to the start node!
                    if (selectedNode.failNodeId == null) {

                        selectedNode.failNodeId = nodeContainer[0].id;

                        for (let i = 0; i < selectedNode.children.length; i++) {
                            queue.push(selectedNode.children[i]);
                        }
                    }

                    break;
                }
            }
        }
    }
}

function generateStartNodeChildren(startNode, dictionary) {

    let checkList = new Array();
    for (let i = 0; i < dictionary.length; i++) {

        let pattern = dictionary[i];
        let char = pattern[0]
        let charCode = pattern.charCodeAt(0);

        if (checkList[charCode] === undefined) {

            nodeGeneratedId += 1;

            let child = new Node(nodeGeneratedId, char, new Array(), startNode.id, startNode.id, new Array());
            child.path = startNode.path + startNode.char;

            // TODO : Can we improve the BigO?!
            for (let j = 0; j < dictionary.length; j++) {

                if (char == dictionary[j]) {
                    child.outpts.push(char);
                }
            }
            startNode.children.push(child);
            nodeContainer[child.id] = child;
            checkList[charCode] = true;
        }
    }
}


function fileSearch(patterns, context) {

    // Create the tree before searching operation
    tStart = Date.now();
    createExpression(patterns);
    tEnd = Date.now();
    console.log(tEnd-tStart+"MS Create EXPRESSION");
    
    //Set the cursor index to the start node
    //Set the cursor Node to the start node
    let cursorIndex = 0;
    let cursorNode = nodeContainer[0];
    let results = new Array();
    let hasFound;

    while (cursorIndex < context.length) {

        hasFound = false;
        let indexedChar = context[cursorIndex];

        while (true) {

            for (let i = 0; i < cursorNode.children.length; i++) {

                if (indexedChar === undefined)
                    break;

                if (cursorNode.children[i].char === indexedChar || cursorNode.children[i].char === indexedChar.toLowerCase()) {

                    if (cursorNode.children[i].outpts.length != 0) {

                        for (let j = 0; j < cursorNode.children[i].outpts.length; j++) {

                            let needsNewNode = true;

                            for(let z = 0 ; z<results.length;z++){
                                if(results[z].key === cursorNode.children[i].outpts[j]){

                                    results[z].startIndex.push(cursorIndex - cursorNode.children[i].outpts[j].length+1);
                                    needsNewNode = false;
                                    break;
                                }
                            }

                            if(needsNewNode===true){
                             let result = new Result();
                             result.key = cursorNode.children[i].outpts[j]
                             result.startIndex.push(cursorIndex - cursorNode.children[i].outpts[j].length + 1);
                             results.push(result);
                            }

                        }
                        cursorNode = nodeContainer[cursorNode.children[i].id];
                        hasFound = true;
                        break;

                    }
                    // When cursor node's i children has no outputs, change the cursour node and move the cursor index to
                    // The nex char
                    cursorNode = cursorNode.children[i];
                    cursorIndex += 1;
                    indexedChar = context[cursorIndex];
                    i = -1;
                }
            }

            if (hasFound === true) {
                cursorIndex += 1;
                break;
            }
            else {

                cursorNode = nodeContainer[cursorNode.failNodeId];

                if (cursorNode == null || cursorNode === undefined) {

                    cursorNode = nodeContainer[0];
                    cursorIndex += 1;
                    break;
                }
            }
        }
    }

    nodeGeneratedId = 0;
    nodeContainer = new Array();
    tree = null;

    //Return results immediately!
    return results;
    //let visualResponse = JSON.stringify(results);
    //return visualResponse;
}