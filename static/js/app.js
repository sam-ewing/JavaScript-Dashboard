d3.json("samples.json").then((data) => {
    
// Assign selections to variables to simplify data structure
    var names= data.names
    var samples = data.samples
    var metadata = data.metadata
    
    // Populate Dropdown Menu with name values
    var selectValues = d3
        .selectAll("#selDataset")
        .selectAll(`${names.index}`)
        .data(names)
    selectValues
        .enter()
        .append('option')
        .classed(`${names.index}`, true)
        .attr('value', function(d) {
            return d.value;
          })
        .text(function(d) {
            return d;
        })
        .exit()
        .remove()  
        
    // Select all dropdown items and fire updatePlotly on change
    d3.selectAll("#selDataset").on("change", updatePlotly);
    
    function updatePlotly() {
    // CREATE GRAPH
// // // // // // // // // // // // // // // // // // // // // // // // // // // //     
        var dropdownMenu = d3.select("#selDataset");
        var dataset = dropdownMenu.property("value");
        console.log(`Dropdown selection made for ID: ${dataset}`)

        // Function locateData will find the index of the ID number the user selects in the drop-down menu
        function locateData (input) {
            return names.indexOf(input)
        }
        // indexValue will be used to identify the data that matches the ID number via its index number
        var indexValue = locateData(dataset)


        var dataSelection = samples[indexValue] 
        
        var dataSelection_sampleValues = dataSelection.sample_values
        var dataSelection_sampleValues_sliced = dataSelection_sampleValues.slice(0,10).reverse()
       
        var dataSelection_otuIds = dataSelection.otu_ids
        var dataSelection_otuIds_sliced = dataSelection_otuIds.slice(0,10).reverse()


        // Add "OTU" to each of the sliced OTU IDs for use as labels
        var otu_labels_sliced = []
        dataSelection_otuIds_sliced.forEach(otu => otu_labels_sliced.push(`OTU ${otu}`))

        // Create bar graph using Plotly
        var barGraph = {
            x: dataSelection_sampleValues_sliced,
            y: otu_labels_sliced,
            text: otu_labels_sliced,
            type: 'bar',
            orientation: 'h'
        }

        var data1 = [barGraph]

        var layout_barGraph = {
            title: "Top Operational Taxonomic Units (OTUs)",
            barmode: "grouped"
        }

    
        Plotly.newPlot('bar', data1, layout_barGraph);
        


    // INSERT DEMOGRAPHIC INFO
// // // // // // // // // // // // // // // // // // // // // // // // // // // // 
        var demoSelection = metadata[indexValue]
        var demoValueList = [
            `ID: ${demoSelection.id}`,
            `ETHNICITY: ${demoSelection.ethnicity}`,
            `GENDER: ${demoSelection.gender}`,
            `AGE: ${demoSelection.age}`,
            `LOCATION: ${demoSelection.location}`,
            `BB-TYPE: ${demoSelection.bbtype}`,
            `W-FREQ:${demoSelection.wfreq}`
        ]
        
        // Clear any pre-existing information in the table prior to populating with information
        d3.selectAll('.demo-info').remove()
        
        // Select the element and append an unordered list
        var demoTable = d3
        .selectAll('#sample-metadata')
        .append('ul')
        .classed(`demo-info`, true)

        // Populate list
        var demoTableList = demoTable
        .selectAll('demo-record')
        .data(demoValueList)

        demoTableList
        .enter()
        .append('li')
        .classed(`demo-record`, true)
        .attr('value', function(d) {
            return d.value;
            })
        .text(function(d) {
            return d;
        })
        .exit()
        .remove()

    // BUBBLE GRAPH
// // // // // // // // // // // // // // // // // // // // // // // // // // // //      
    // Create text labels for ALL OTUs
    var otu_labels = []
    dataSelection_otuIds.forEach(otu => otu_labels.push(`OTU ${otu}`))

    // Graph creation
        var bubbleGraph = {
            x: dataSelection_otuIds,
            y: dataSelection_sampleValues,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: dataSelection_sampleValues
            }
        };

        var data2 = [bubbleGraph]

        var layout_bubbleGraph = {
            title: 'All Operational Taxonomic Units (OTUs) Recorded',
            xaxis: {
                title: 'OTU ID'
            },
            showlegend: false
        };

        Plotly.newPlot('bubble', data2, layout_bubbleGraph);

        
    // BONUS GAUGE
// // // // // // // // // // // // // // // // // // // // // // // // // // // //                 

        var gaugeData = [
            {
              domain: {
                  x: [0, 1],
                  y: [0, 1]
                },
              value: demoSelection.wfreq,
              title: {
                  text: `Belly Button Washing Frequency | Scrubs per Week`
                },
              type: "indicator",
              mode: "gauge+number",
              delta: {
                  reference: demoSelection.wfreq
                },
              gauge: {
                  axis: {
                      range: [null, 10] 
                    } 
                }
            }
          ];
          
          var layout = {
              width: 500, 
              height: 400
            };
        
          Plotly.newPlot(gauge, gaugeData, layout);

    }

    updatePlotly()
    
}).catch(function(error) {
    console.log(error);
  });
  