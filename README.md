# aho-corasick-algorithm
Aho-Corasick is known as a powerful pattern search algorithm which is used for searching a set of specific patterns throughout a huge tex file.

Developers can take advantage of this powerful algorithm for pattern-matching problems. 
The algorithm has two main parts which will be described in the following.

(Notice: You should read about the algorithm before you proceed the following)
https://en.wikipedia.org/wiki/Aho%E2%80%93Corasick_algorithm

Automaton Creation

The most important idea behind this algorithm is Automaton Creation phase. From the Aho-Corasick point of view, automaton is a state-machine which is created from a set of patterns (strings). What an automoton does is indecting how different characters of these patterns are connected together. Hence, the automaton can be considered as a graph of characters.

Example: Assume that the items of the following set need to be searched throughout a text file. The structore depicts the graph which is created from the set items.

SET:

{'a', 'ab', 'aab', 'aac', 'bc', 'bd'}

GRAPH:

{START NODE, id:0, outputs:{}, failNodeId:0} > { a, id:1, outputs:{'a'}, failNodeId:0} & {b, id:2, outputs:{}, failNodeId:0}

{id:1} > {a, id:3, outputs:{'a'}, failNodeId:1} & {b, id:4, outputs:{'ab'}, failNodeId:2}

{id:2} > {c, id:5, outputs:{'bc'}, failNodeId:0} & {d, id:6, outputs:{'dc'}, failNodeId:0}

{id:3} > {b, id:7, outputs:{'aab'}, failNodeId:4} & {c, id:8, outputs:{'aac'}, failNodeId:0}

There are two functions in the code which create the automaton. These functions are populateTree(startNode) and   drawFailRelations(startNode). The first one reads the mentioned set and adds appropriate nodes to the graph, whereas, the second one determines where a node goes when it is failed throughout the search process.  

Search Process

Simply speaking, this function tries to match the current read character of the text with one of the current node's children. So, if it fails, the current node is shifted upward.  

Example: 

var result = fileSearch(['mahmoud','hossein'],'Last night, mahmoud and hossein were playing nice!');
console.log(result);

Result: 

{key: mahmoud, startIndex: 12}

{key: hossein, startIndex: 24}