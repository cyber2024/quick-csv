const qcsv = (function(){
    let events = {
      COMPLETE: 'COMPLETE',
      START: 'START',
      PROGRESS: 'PROGRESS'
    } 
    let subscriptions = {};
    let serial = 0;
    function on(eventName, fn){
        //progress, data, end
        if(typeof fn !== "function")
            throw "callback must be a function."
        subscriptions[eventName] = fn;
    }
    function emit(event, id, data){
        if(typeof subscriptions[event] === 'function')
            subscriptions[event](id, data);
    }
    function parse(file){
        let id = serial++;
        emit(events.START, id);
        return parseFile(file,'csv', id)
    }
    function progress(val, id){
        val = Math.floor(val*100);
        emit(events.PROGRESS,id, val+'%');
    }
    function parseFile(file, type, id){
        return new Promise((resolve, reject)=>{
          let startTime= new Date().getTime();
          let result = [];
          result.push([]);
          let minCols = 0;
          let  i = 0;
          let cellCharCount = 0;
          let rows = 0;
          let cols = 0;
          let currentCell = '';
          let headerColumnCount = 0;
          let ignoreActionChars = false;
          let errors = null;
          let length = file.length;
          let progressPercent = Math.ceil(length/100);
          
          let char = '';
          let prevChar = undefined;
          let specialChars = ['/','"',"'",'\n','\r'];

          while ((char = file[i]) != undefined) {
            if(i % progressPercent == 0)
                progress(i/length);
            // if(cellCharCount == 0 && char != '"'){
            //   currentCell += '"';
            // }
            cellCharCount++;
            if(char == '"') {
              ignoreActionChars = !ignoreActionChars;
              currentCell += '"'
            } else {
              if (char==',' && !ignoreActionChars) {
                if(result[rows] == undefined)
                  result.push([]);
                // if(file[i-1] != '"')
                //   currentCell += '"'
                cellCharCount = 0;
                result[rows][cols] = currentCell;
                currentCell = "";
                cols++;
              } else if ((/[\n]/.test(char) && !ignoreActionChars) || file[i] == undefined) {
                result[rows][cols] = currentCell;
                cols++;
                cols=0; 
                rows++;
                currentCell = "";
                cellCharCount = 0;
              } else {
                if(!/[\r"]/.test(char)){
                  currentCell += char;
                }
              }
            }
            i++;
          }
          if(errors){
            reject({id, errors});
          }
          // console.log(result[0].length, result[1].length)

          emit(events.COMPLETE, id, result);
          resolve({id, elapsed: new Date().getTime()-startTime, result, type});
        });
    }

    function objectify(file){
      const array = file.result;
      const headings = array[0];
      const data = array.slice(1,);
      let result = [];
      data.forEach((row, index)=>{
          let obj = {};
          row.forEach((element,index)=>{
              const heading = headings[index];
              obj[heading] = element;
          })
          result.push(obj);
      });
      file.objects = result;
      return {objects: result};
  }

    return {
        on,
        parse,
        objectify,
        events
    }
})();

module.exports = qcsv;
