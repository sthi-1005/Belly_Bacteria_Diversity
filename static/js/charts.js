function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

      //combining the 3 seperate lists into 1 dictionary 

    var dict = [];
    var top10_ids=[];
    var top10_labels=[];
    var top10_values=[];
    for (var j=0; j<ids.length; j++){
      dict.push({'otu_ids': ids[j], 'otu_labels': labels[j], 'sample_values': values[j]})
    };
      //after combining, sort
    var dict_top10 = dict.sort((a,b)=>b.sample_values - a.sample_values);
    console.log(dict_top10);
      // get top 10
    for (var j=0; j<10;j++){
      top10_ids.push("OTU: ".concat(dict[j]["otu_ids"]));
      top10_labels.push(dict[j]["otu_labels"]);
      top10_values.push(dict[j]["sample_values"]);
    }
    console.log(top10_ids);
    console.log(top10_labels);
    console.log(top10_values)

    // 8. Create the trace for the bar chart. 
    var barData = [{
     x: top10_values.reverse(),
     y: top10_ids.reverse(),
     text: top10_labels.reverse(),
     type: 'bar',
     orientation: 'h'

    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {marker:{color: "blue"},
    title: 'Top 10 Bacteria Cultures Found',
    yaxis:{title:{"text":"Top 10 OTU IDs in Sample"}},
    xaxis:{title:{"text":"Count of Sample Value"}}  
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
//   });
// }


// -----------------
// DELIVERABLE #2
// -----------------

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      mode: "markers",
      x: ids,
      y: values,
      text: labels,
      
      marker: {
        color: ids,
        colorscale: "Earth",
        size: values,
        cmin: 0,
        cmax: 3500
      }
    }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis:{title:{"text": "OTU ID"}}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

// -----------------
// DELIVERABLE #3
// -----------------
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    // Create a variable that holds the first sample in the array.
    var filteredMetadata = metadata.filter(sampleObj => sampleObj.id == sample);
    var metaResult = filteredMetadata[0];
    console.log(metaResult)

    // 3. Create a variable that holds the washing frequency.
    var resultWfreq=metaResult['wfreq']
    console.log(resultWfreq)
    console.log("max wfreq:".concat(Math.max(metadata['wFreq'])))
    
    //Get min and max wash freq for gauge charts
    var wfreq = metadata.map(i=>i.wfreq);
    wfreq=Array.from(wfreq,i=>i||0);
    var max_wfreq = wfreq.reduce((a, b) => {
      return (a>b ? a:b);
    })
    var min_wfreq = wfreq.reduce((a, b) => {
      return (a<b ? a:b);
    })

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: resultWfreq,
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [min_wfreq, 10] },
        }
      }
    ];
    
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: { text: "Belly Button Washing Frequency" }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);
    });

}
