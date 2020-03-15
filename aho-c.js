/* ----------- LOCAL VARIABLES -------------*/
var nodeGeneratedId = 0;
var nodeContainer = [];
var dictionary;
/*-------------- CLASSES------------------*/
class Result {
    constructor() {
        this.key = "";
        this.startIndex = [];
    }
}
class Node {
    constructor(id, char, outputs, parentNodeId, failNodeId, children) {
        this.id = id;
        this.char = char;
        this.outputs = outputs;
        this.parentNodeId = parentNodeId;
        this.failNodeId = failNodeId;
        this.children = children;
        this.childrenIndexes = [];
        this.path = '';
    }
}
/*--------------- FUCNTIONS--------------*/

function createAutomaton() {

    if (dictionary == null || dictionary.length === 0) {
        
        console.log('The dictionary was empty!');
        return expresssion;
    }

    //Create the root of the tree which is called start node
    let startNode = new Node(nodeGeneratedId, '', null, null, null, []);
    nodeContainer.push(startNode);

    //Populate the tree structor       
    populateTree(startNode);

    //Draw all fail relations
    drawFailRelations(startNode);
}

function populateTree(node) {

    let nodeQueue = [node];
    while (nodeQueue.length !== 0) {

        let checkList = [];
        let removedNode = nodeQueue.shift();
        let statement = removedNode.path + removedNode.char;

        for (let i = 0; i < dictionary.length; i++) {

            if (dictionary[i].startsWith(statement)) {

                let newChar = '';
                if (removedNode.id === 0) {
                    newChar = (dictionary[i])[0];
                }
                else {
                    newChar = (dictionary[i])[removedNode.path.length + 1];
                }

                if (newChar === undefined || checkList[newChar.charCodeAt(0)] === true)
                    continue;

                checkList[newChar.charCodeAt(0)] = true;
                nodeGeneratedId += 1;
                let child = new Node(nodeGeneratedId, newChar, [], removedNode.id, null, []);
                child.path = statement;

                if (dictionary.includes(child.path + child.char) === true) {
                    child.outputs.push(child.path + child.char);
                }

                removedNode.children[newChar.charCodeAt(0)] = child;
                removedNode.childrenIndexes.push(newChar.charCodeAt(0));
                nodeQueue.push(child);
                nodeContainer[child.id] = child;
            }
        }
    }
}

function drawFailRelations(node) {
    //Initiate the queue of nodes
    let nodeQueue = [];

    for (let i = 0; i < node.childrenIndexes.length; i++) {
        nodeQueue.push(node.children[node.childrenIndexes[i]]);
    }

    while (nodeQueue.length !== 0) {

        let removedNode = nodeQueue.shift();

        //Nodes which are immediate children of the start node 
        //has the start node as their fail node
        if ((nodeContainer[removedNode.parentNodeId]).char === '') {

            removedNode.failNodeId = removedNode.parentNodeId;
        }

        else {

            //Initiate the first ancestor node
            ancestor = nodeContainer[(nodeContainer[removedNode.parentNodeId]).parentNodeId];
            while (ancestor !== undefined) {

                //This ancestor does not have any correspondent children
                //So, replace the current ancestor with an older one                
                if (ancestor.children[removedNode.char.charCodeAt(0)] === undefined) {
                    ancestor = nodeContainer[ancestor.parentNodeId];
                }
                //This ancestor has a child which corresponds with the removed node
                //So, fill the removed node failId with the found child id
                else {

                    removedNode.failNodeId = (ancestor.children[removedNode.char.charCodeAt(0)]).id;

                    //It means that removed node also contains the outputs of its failNode
                    for (let i = 0; i < (ancestor.children[removedNode.char.charCodeAt(0)]).outputs.length; i++) {
                        removedNode.outputs.push((ancestor.children[removedNode.char.charCodeAt(0)]).outputs[i]);
                    }
                    break;
                }
            }

            //If no fail node has been found for the removed node,
            //Set the start node as its fail node
            if (removedNode.failNodeId == null) {
                removedNode.failNodeId = 0;
            }
        }

        for (let i = 0; i < removedNode.childrenIndexes.length; i++) {
            nodeQueue.push(removedNode.children[removedNode.childrenIndexes[i]]);
        }
    }
}

function searchContext(startNode, context) {
    let cursorIndex = 0;
    let cursorNode = startNode;
    let results = [];    

    while (cursorIndex < context.length) {

        let currentCharCode = (context[cursorIndex]).charCodeAt(0);
        while (true) {

            if (cursorNode.children[currentCharCode] !== undefined) {

                for (let i = 0; i < cursorNode.children[currentCharCode].outputs.length; i++) {
                    let result = new Result();
                    result.key = cursorNode.children[currentCharCode].outputs[i];
                    result.startIndex.push(cursorIndex - (cursorNode.children[currentCharCode].outputs[i]).length + 1);
                    results.push(result);
                }

                cursorNode = cursorNode.children[currentCharCode];
                cursorIndex+=1;
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
    //Reset all golbal variables for consecutive search operations    
    nodeContainer = [];
    nodeGeneratedId = 0;
    dictionary = null;
    return results;
}

function fileSearch(patterns, context) {

    dictionary = patterns;
    //Create the aho-corasick automaton    
    createAutomaton();
    return searchContext(nodeContainer[0], context);    
}