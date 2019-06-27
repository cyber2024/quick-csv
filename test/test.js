let {assert} = require("chai");
let fs = require('fs');
const basic = fs.readFileSync(__dirname+'/basic.csv', 'utf-8');
const complex = fs.readFileSync(__dirname+'/complex.csv', 'utf-8');
describe('quick-csv', async ()=>{
    describe('it processes a well formatted csv', ()=>{
        it('fires callback on start',async ()=>{
            let qcsv = require('../index.js');
            let fires = false;
            qcsv.on(qcsv.events.START, id=>{
                fires = true;
            });
            qcsv.on(qcsv.events.COMPLETE, id=>{
                assert(fires, 'it didnt fire');
            });
            qcsv.parse(basic);
        })
        it('fires callback on progress',async ()=>{
            let qcsv = require('../index.js');
            let fires = false;
            qcsv.on(qcsv.events.PROGRESS, id=>fires = true);
            qcsv.on(qcsv.events.COMPLETE, id=>{
                assert(fires, 'it didnt fire');
            });
            qcsv.parse(basic);
        })
        it('fires callback on complete',(done)=>{
            let qcsv = require('../index.js');
            qcsv.on(qcsv.events.COMPLETE, id=>done());
            qcsv.parse(basic);
        })
        it('parses a basic csv into an array',()=>{
            let qcsv = require('../index.js');
            qcsv.on(qcsv.events.COMPLETE, (id, data)=>{
                assert(Array.isArray(data), 'it should be an array but is '+typeof data);
                assert(data.length == 2, 'it should be 2 rows but is '+data.length);
                assert(data[0].length == 3, 'it should be 3 columns but is '+data[0].length);
                
            });
            qcsv.parse(basic);
        })
        it('parses a basic csv into an object',async ()=>{
            let qcsv = require('../index.js');
            qcsv.on(qcsv.events.COMPLETE, (id, data)=>{
                let {objects} = qcsv.objectify({result:data});
                let {name, age, email} = objects[0];
                assert(name = 'Russ', 'incorrect name: '+name)
                assert(email = 'russ@rusself.com', 'incorrect name: '+email)
                assert(age = 33, 'incorrect name: '+age)
            });
            qcsv.parse(basic);
        })

    })
    describe('it processes a poorly formatted csv', ()=>{
        it('fires callback on start',async ()=>{
            let qcsv = require('../index.js');
            let fires = false;
            qcsv.on(qcsv.events.START, id=>{
                fires = true;
            });
            qcsv.on(qcsv.events.COMPLETE, id=>{
                assert(fires, 'it didnt fire');
            });
            qcsv.parse(complex);
        })
        it('fires callback on progress',async ()=>{
            let qcsv = require('../index.js');
            let fires = false;
            qcsv.on(qcsv.events.PROGRESS, id=>fires = true);
            qcsv.on(qcsv.events.COMPLETE, id=>{
                assert(fires, 'it didnt fire');
            });
            qcsv.parse(complex);
        })
        it('fires callback on complete',(done)=>{
            let qcsv = require('../index.js');
            qcsv.on(qcsv.events.COMPLETE, id=>done());
            qcsv.parse(complex);
        })
        it('parses a basic csv into an array',()=>{
            let qcsv = require('../index.js');
            qcsv.on(qcsv.events.COMPLETE, (id, data)=>{
                console.log(data)
                assert(Array.isArray(data), 'it should be an array but is '+typeof data);
                assert(data.length == 2, 'it should be 2 rows but is '+data.length);
                assert(data[0].length == 3, 'it should be 3 columns but is '+data[0].length);
                
            });
            qcsv.parse(complex);
        })
        it('parses a basic csv into an object',async ()=>{
            let qcsv = require('../index.js');
            qcsv.on(qcsv.events.COMPLETE, (id, data)=>{
                let {objects} = qcsv.objectify({result:data});
                let {name, age, email} = objects[0];
                assert(name = 'Russ', 'incorrect name: '+name)
                assert(email = 'russ@rusself.com', 'incorrect name: '+email)
                assert(age = 33, 'incorrect name: '+age)
            });
            qcsv.parse(complex);
        })

    })
})