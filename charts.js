function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sample_names = data.names;

    sample_names.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var first_sample = sample_names[0];
    buildCharts(first_sample);
    buildMetadata(first_sample);
  });
}

// Initialize the dashboard
init();

function optionChanged(new_sample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(new_sample);
  buildCharts(new_sample);
  
}

// Demographics Panel  
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata``
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
    var samples_array = samples.filter(sampleObj => sampleObj.id == sample);
    //  Create a variable that filters the metadata array for the object with the desired sample number.
    var meta_array = data.metadata.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var first_sample = samples_array[0]
    // Create a variable that holds the first sample in the metadata array.
    var first_meta = meta_array[0]

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = first_sample.otu_ids;
    var otu_labels = first_sample.otu_labels;
    var sample_values = first_sample.sample_values;
    // Create a variable that holds the washing frequency.
    var wfreq = first_meta.wfreq;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(otu_ids => `OTU ${otu_ids}`).reverse();
     // 8. Create the trace for the bar chart. 
    var bar_data = [{
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];
    // 9. Create the layout for the bar chart.  
    var bar_layout = {
     title: "Top 10 Bacteria Cultures Found",
     margin: {
       l: 100,
       r: 100,
       t: 100,
       b:100
     }
    };
    // 10. Use Plotly to plot the data with the layout.  
    Plotly.newPlot("bar", bar_data, bar_layout);

// Bubble charts.
//create the trace for the bubble chart
    var bubble_data = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];

    // 2. Create the layout for the bubble chart
    var bubble_layout = {
      title: "Bacteria Species per Sample",
      xaxis: {title: "OTU ID"},
      hovermode: "closest",
      showlegend: false
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubble_data, bubble_layout)

    // 4. Create the trace for the gauge chart.
    var gauge_data = [{
      domain: {x: [0,1], y: [0,1]},
      value: wfreq,
      title: {text: "Belly Button Washing Frequency <br> Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null,10]},
        bar: {color: "black"},
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "green"}]
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gauge_layout = {
      width: 500,
      height: 460,
      margin: {t: 0, b: 0}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gauge_data, gauge_layout);
  });
}