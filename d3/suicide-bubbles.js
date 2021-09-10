
(function() {
    
    var width = 2000,
    height = 800;

    var data = ["Alcohol use", "Amphetamine use"]

    var svg = d3.select("#chart")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    
    .append("g")

    .attr("transform", "translate(0,0)")

    

    var radiusScale = d3.scaleSqrt().domain([60,500]).range([10, 30])

    var color = d3.scaleOrdinal(d3.schemeCategory20)
    
    var forceXSep = d3.forceX(function(d){
        if (d.Risk === 'Alcohol use'){
            return 250
        } else if (d.Risk === 'Amphetamine use') {
            return 500
        } else if (d.Risk === 'Cocaine use') {
            return 750
        } else if (d.Risk === 'Illicit drug use') {
            return 1000
        } else if (d.Risk === 'Intimate partner violence') {
            return 1250
        }  else {
            return 1500
        }
    }).strength(0.01)

    var forceXComb = d3.forceX(function(d){
        return (width / 2)
    }).strength(0.01)

    var forceCollide = d3.forceCollide(function(d){
        return radiusScale(d.Self)
    })

    var forceYComb = d3.forceY(function(d){
        return (height / 2)
    }).strength(0.01)
    
    
    // get the bubbles into middle
    var simulation = d3.forceSimulation()
        .force("x", forceXComb)
        .force("y", forceYComb)
        .force("colliding", forceCollide)
        

    d3.queue()
    .defer(d3.csv, "suicide.csv")
    .await(ready)

    


    function ready (error, datapoints){
        var circles = svg.selectAll(".circles")
        .data(datapoints)
        .enter().append("circle")
        .attr("class", "circles")
        .attr("r", function(d){
            return radiusScale(d.Self)
        })
        
        .attr("fill", function(d) { return color(d.Risk); })
        
        .on('click', function(d){
            console.log(d)
        });

        // circles.append("rect")
        // .attr("width", width / 2)
        // .attr("height", height / 2)
        
        var texts = svg.selectAll(".myTexts")
        .data(datapoints)
        .enter()
        .append("text");

        texts.attr("x", function(d){
            if (d.Risk === 'Alcohol use'){
                return 200
            } else if (d.Risk === 'Amphetamine use') {
                return 450
            } else if (d.Risk === 'Cocaine use') {
                return 700
            } else if (d.Risk === 'Illicit drug use') {
                return 950
            } else if (d.Risk === 'Intimate partner violence') {
                return 1200
            }  else {
                return 1450
            }
        })
            .data(datapoints)
            .attr("y", height / 1.2)
            
            .text(function(d) {return d.Risk})
        

        
        
         

    d3.select("#risk").on('click', function(){
        simulation
        .force("x", forceXSep)
        .alphaTarget(0.5)
        .restart()
    })

    d3.select("#combine").on('click', function(){
        simulation
        .force("x", forceXComb)
        .alphaTarget(0.3)
        .restart()
        
    })

    
        
        simulation.nodes(datapoints).on('tick', ticked)

        function ticked() {
            circles
            .attr("cx", function(d){
                return d.x
            })
            .attr("cy", function(d){
                return d.y
            })
        }
    } 
})();