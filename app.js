function getName() {
    // Select dropdown menu id and assign it to a variable
    var dropdownMenu = d3.select('#selDataset');
    // Read "names" values from json file and append into dropdown menu
    d3.json('data/samples.json')
        .then(subject => subject.names
        .forEach(name => dropdownMenu
            .append('option')
            .text(name)
            .property('value'),

            // Initialize page with default metadata and plots   
            getMetadata(subject.names[0]),
            getBar(subject.names[0]),
            getBubble(subject.names[0]),
            getGauge(subject.names[0])
        ),
    );
};
function optionChanged(id) {
    getMetadata(id);
    getBar(id);
    getBubble(id);
    getGauge(id);
};

// Demographic Info
function getMetadata(id) {
    // Read "metadata" from json file for each subject and assign it to a variable
    d3.json('samples.json')
        .then(data => {
        var subjectData = data.metadata
        .filter(subject => subject.id.toString() === id)[0];
        
        // Select demographic info id and assign it to a variable
        var subjectMetadata = d3.select('#sample-metadata');
        // Clear metadata befor displaying new selection data 
        subjectMetadata.html('');
        // Push data into demographic info card
        Object.entries(subjectData)
            .forEach(([key, value]) => subjectMetadata
            .append('p')
            .text(`${key}: ${value}`),
        );
    });
};

getName();

// Bar chart
function getBar(id) {
    // Read data from json file for each sample, assign it to a variable, and plot it
    d3.json('samples.json')
        .then(data => {
        var sortedSample = data.samples
        .filter(sample => sample.id === id)[0];
        console.log(sortedSample);
        // Trace for bar chart that displays each sample top 10 OTU values
        var barTrace = {
            x: sortedSample.sample_values.slice(0,10).reverse(),
            y: sortedSample.otu_ids.slice(0,10).map(otuid => `OTU ${otuid}`).reverse(),
            text: sortedSample.otu_labels.slice(0,10).reverse(),
            hoverlabel: {font: {size: 12}},
            marker: {
                color: [
                    '#001f4d',
                    '#003380',
                    '#0047b3',
                    '#005ce6',
                    '#1a75ff',
                    '#3399ff',
                    '#66a3ff',
                    '#99c2ff',
                    '#b3d9ff',
                    '#e6f0ff'
                ],
                opacity: 1,
            },
            type: 'bar',
            orientation: 'h'
        };
        // Data
        var data = [barTrace];
        // Layout
        var layout = {
            title: {
                text: `Top 10 OTU for Test Subject No. ${id}`,
                font: {
                    family: 'Arial',
                    size: 24,
                    color: 'black'
                },
            },
            //margin: {l: 100, r: 50, t: 50, b: 50},
            height: 600,
            width: 630,
            xaxis: {
                tickwidth: 10,
                tickcolor: '#ffffff',
                tickfont: {family: 'Arial', color: 'darkgrey'},
                title: {
                    text: "Value",
                    font: {
                        family: 'Arial',
                        size: 18,
                        color: 'darkgrey'
                    },
                },
            },
            yaxis: { 
                automargin: true,
                tickwidth: 20,
                tickcolor: '#ffffff',
                tickfont: {family: 'Arial', color: 'darkgrey'},
                title: {
                    text: 'Bacteria ID ',
                    font: {
                        family: 'Arial',
                        size: 18,
                        color: 'darkgrey'
                    },
                },
            },
        };
        // Render the plot to the div tag with id 'bar'
        Plotly.newPlot('bar', data, layout, {
            modeBarButtonsToRemove: [
                'zoom2d',
                'pan2d',
                'select2d',
                'lasso2d',
                'autoScale2d',
                'toggleSpikelines',
                'hoverCompareCartesian'
            ]},
        );
    });
};
