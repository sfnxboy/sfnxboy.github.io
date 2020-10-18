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
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");

    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

function buildCharts(sample) {
  console.log(sample)
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObject => sampleObject.id == sample);
    var result = resultArray[0];

    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;
    var yticks = ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

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
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    Plotly.newPlot("bar", barData, barLayout);


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

    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      showlegend: false,
      height: 600,
      width: 900
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    var samples = data.samples;
    var filteredSample = samples.filter(sampleObj => sampleObj.id == sample);
    var filteredMeta = data.metadata.filter(sampleObj => sampleObj.id == sample);

    var firstSample = filteredSample[0];

    var firstMeta = filteredMeta[0];

    var ids = firstSample.otu_ids;
    var labels = firstSample.otu_labels;
    var values = firstSample.sample_values;
    var washingFreq = firstMeta.wfreq;

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
    
    var gaugeLayout = { 
      width: 600,
      height: 600,
      margin: { t: 0, b: 0 }
    };

    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}