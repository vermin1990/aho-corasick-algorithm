# aho-corasick-algorithm
Aho-Corasick is known as a powerful pattern search algorithm which is used for searching a set of specific patterns throughout a huge tex file.

Developers can take advantage of this powerful algorithm for pattern-matching problems. 
The algorithm has two main parts which will be described in the following.

Automaton Creation

The most important idea behind this algorithm is Automaton Creation phase. From the Aho-Corasick point of view, automaton is a state-machine which is created from a set of patterns (strings). What an automoton does is indecting how different characters of these patterns are connected together. Hence, the automaton can be considered as a graph of characters.

Example: Assume that the items of the following set need to be searched throughout a text file. The JSON structore depicts the graph which is created from the set items. For better underestanding, I strongly recommand to try drawing the graph using the depicted JSON structure.

SET : {'a','aab','aac','bc','bd'}

GRAPH:
{
   "id":0,
   "char":"START NODE",
   "outputs":null,
   "parentNodeId":null,
   "failNodeId":0,
   "children":[      
      {
         "id":1,
         "char":"a",
         "outputs":[
            "a"
         ],
         "parentNodeId":0,
         "failNodeId":0,
         "children":[            
            {
               "id":3,
               "char":"a",
               "outputs":[
                  "a"
               ],
               "parentNodeId":1,
               "failNodeId":1,
               "children":[                  
                  {
                     "id":6,
                     "char":"b",
                     "outputs":[
                        "aab"
                     ],
                     "parentNodeId":3,
                     "failNodeId":2                                         
                  },
                  {
                     "id":7,
                     "char":"c",
                     "outputs":[
                        "aac"
                     ],
                     "parentNodeId":3,
                     "failNodeId":0,                 
                  }
               ]              
            }
         ]        
      },
      {
         "id":2,
         "char":"b",         
         "parentNodeId":0,
         "failNodeId":0,
         "children":[            
            {
               "id":4,
               "char":"c",
               "outputs":[
                  "bc"
               ],
               "parentNodeId":2,
               "failNodeId":0,                                             
            },
            {
               "id":5,
               "char":"d",
               "outputs":[
                  "bd"
               ],
               "parentNodeId":2,
               "failNodeId":0               
            }
         ]         
      }
   ]  
}
