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
    // Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  console.log(sample)
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObject => sampleObject.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        y: yticks,
        x: values.slice(0, 10).reverse(),
        text: labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
        marker: {color: "teal"}
      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: ids,
      y: values,
      text: labels,
      mode: 'markers',
      marker: {
        color: "teal",
        size: values
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      showlegend: false,
      height: 600,
      width: 900
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // Create a variable that holds the samples array. 
    var samples = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var filteredSample = samples.filter(sampleObj => sampleObj.id == sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var filteredMeta = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the array.
    var firstSample = filteredSample[0];

    // 2. Create a variable that holds the first sample in the metadata array.
    var firstMeta = filteredMeta[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = firstSample.otu_ids;
    var labels = firstSample.otu_labels;
    var values = firstSample.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var washingFreq = firstMeta.wfreq;
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      title: {text: "Belly Button Washing Frequency"},
      text: "Scrubs per Week",
      value: washingFreq,
      domain: { x: [0, 1], y: [0, 1] },
      tickmode: 'auto',
      gauge: {
        bar: { color: "#2bd4aa"},
        axis: { range: [0, 10] },
        steps: [
          { range: [0, 1], color: "#ff0000" },
          { range: [1, 2], color: "#f7590a" },
          { range: [2, 4], color: "#ffff00" },
          { range: [4, 6], color: "#81d929" },
          { range: [6, 8], color: "#4ad030" },
          { range: [8, 10], color: "#00e1ff" }
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600,
      height: 600,
      margin: { t: 0, b: 0 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
