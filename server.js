const express = require("express");
const compression = require("compression");
const pg=require("pg").Pool;
const f=require("fs");
const pool=new pg({host:'ec2-54-217-221-21.eu-west-1.compute.amazonaws.com',
                       database:'d41fi7qtbl8bap',
                       user:'eklebkmnmvnsjj',
                       password:'9715c486d74c3560e40422b91baba81b9bdb2dd09de884f204922a4deb840996',
                       port:'5432',ssl:'true'});

var data;





const _port = process.env.PORT || 5000;
const _app_folder = 'dist/';

const app = express();
app.use(compression());

app.use(express.static(__dirname + '/dist' ));
// ---- SERVE STATIC FILES ---- //
app.post('*.*', express.static(_app_folder, {maxAge: '1y'}));

app.get("/api/test",function(req,res)
{
        pool.query("SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.region_geom)::json As geometry, row_to_json((region_id,responsible)) As properties FROM regions As lg) As f) As fc", (err1, res1) => 
        {
        if(err1) {
                return console.log(err1);
            }
            res.send(res1.rows[0].row_to_json)
        
        f.writeFile("./dist/a.geojson",JSON.stringify(res1.rows[0].row_to_json), function(err) {

            if(err) {
                return console.log(err);
            }
        
            console.log("The file was saved!");
        }); 
        
    
        pool.end()
        })
}
);

// ---- SERVE APPLICATION PATHS ---- //
app.all('*', function (req, res) {
    res.status(200).sendFile(`/`, {root: _app_folder});
});

// ---- START UP THE NODE SERVER  ----
app.listen(_port, function () {
    console.log("Node Express server for " + app.name + " listening on http://localhost:" + _port);
});