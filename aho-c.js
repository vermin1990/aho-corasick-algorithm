/* ----------- LOCAL VARIABLES -------------*/
var nodeGeneratedId = 0;
var nodeContainer = [];
var tStart;
var tEnd;
var dictionary;
/*-------------- CLASSES------------------*/
class Result {

    constructor() {
        this.key = "";
        this.startIndex = new Array();
    }
}

class Node {

    constructor(id, char, outputs,parentNodeId, failNodeId, children) {
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

function logDuration(tStart, tEnd, operationName) {
    let tDiff = tEnd - tStart + "MS";
    console.log("[" + operationName + "]: " + tDiff);
}

function createAutomaton() {

    if (dictionary == null || dictionary.length === 0) {

        console.log('The dictionary was empty!');
        return expresssion;
    }

    //Create the root of the tree which is called start node
    let startNode = new Node(nodeGeneratedId, '', null,null, null, []);
    nodeContainer.push(startNode);

    //Populate the tree structor    
    tStart = Date.now();
    populateTree(startNode);
    tEnd = Date.now();
    logDuration(tStart, tEnd, 'Populating tree');
    
    tStart = Date.now();
    drawFailRelations(startNode);
    tEnd = Date.now();
    logDuration(tStart, tEnd, 'Draw Fail Relation');
}

function populateTree(node) {

    let nodeQueue = [node];
    while (nodeQueue.length !== 0) {

        let checkList = [];
        let removedNode = nodeQueue.shift();
        let statement = removedNode.path + removedNode.char;

        for(let i=0;i<dictionary.length;i++){

            if(dictionary[i].startsWith(statement)){

                let newChar ='';
                if(removedNode.id===0){
                    newChar = (dictionary[i])[0];
                }
                else{
                    newChar = (dictionary[i])[removedNode.path.length+1];
                }

                if(newChar===undefined || checkList[newChar.charCodeAt(0)]===true)
                    continue;
                
                checkList[newChar.charCodeAt(0)]=true;
                nodeGeneratedId+=1;
                let child = new Node(nodeGeneratedId,newChar,[],removedNode.id,null,[]);
                child.path = statement;
                
                if(dictionary.includes(child.path+child.char)===true){
                    child.outputs.push(child.path+child.char);
                }

                removedNode.children[newChar.charCodeAt(0)] = child;
                removedNode.childrenIndexes.push(newChar.charCodeAt(0));
                nodeQueue.push(child);
                nodeContainer[child.id]= child;
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

function fileSearch(patterns, context) {

    dictionary = patterns;
    //Create the aho-corasick automaton    
    createAutomaton();    
    console.log(nodeContainer[0]);
}