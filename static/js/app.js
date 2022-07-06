function getName() {
    var dropdownMenu = d3.select('#selDataset');
    d3.json('data/samples.json')
        .then(subject => subject.names
        .forEach(name => dropdownMenu
            .append('option')
            .text(name)
            .property('value'),

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
    d3.json('data/samples.json')
        .then(data => {
        var subjectData = data.metadata
        .filter(subject => subject.id.toString() === id)[0];
        
        var subjectMetadata = d3.select('#sample-metadata');
        subjectMetadata.html('');
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
    d3.json('data/samples.json')
        .then(data => {
        var sortedSample = data.samples
        .filter(sample => sample.id === id)[0];
        console.log(sortedSample);
        var barTrace = {
            x: sortedSample.sample_values.slice(0,10).reverse(),
            y: sortedSample.otu_ids.slice(0,10).map(otuid => `OTU ${otuid}`).reverse(),
            text: sortedSample.otu_labels.slice(0,10).reverse(),
            hoverlabel: {font: {size: 12}},
            marker: {
                color: [
                    '#ff0281',
                    '#ff168b',
                    '#ff2a94',
                    '#ff3d9e',
                    '#ff51a8',
                    '#ff65b2',
                    '#ff78bc',
                    '#ff8cc5',
                    '#ff9fcf',
                    '#ffb3d9'
                ],
                opacity: 1,
            },
            type: 'bar',
            orientation: 'h'
        };
        var data = [barTrace];
        var layout = {
            title: {
                text: `Top 10 OTU for Test Subject No. ${id}`,
                font: {
                    family: 'Arial',
                    size: 15,
                    color: 'black'
                
                },
            },
            height: 600,
            width: 730,
            xaxis: {
                tickwidth: 10,
                tickcolor: '#ffffff',
                tickfont: {family: 'Arial', color: 'darkgrey'},
                title: {
                    text: "Value",
                    font: {
                        family: 'Arial',
                        size: 15,
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

// Bubble chart
function getBubble(id) {
    d3.json('data/samples.json')
        .then(data => {
        var sortedSample = data.samples
        .filter(sample => sample.id === id)[0];
        console.log(sortedSample);

        var bubbleTrace = {
            x: sortedSample.otu_ids,
            y: sortedSample.sample_values,
            text: sortedSample.otu_labels,
            mode: "markers",
            marker: {
                size: sortedSample.sample_values,
                color: sortedSample.otu_ids,
                colorscale: [
                    [0, '#b3d1ff'],
                    [0.2, '#b3d1ff'],
                    [0.2, '#1a75ff'],
                    [0.4, '#1a75ff'],
                    [0.4, '#00cc88'],
                    [0.6, '#00cc88'],
                    [0.6, '#ccffcc'],
                    [0.8, '#ccffcc'],
                    [0.8, '#99ff33'],
                    [1.0, '#99ff33'],
                    
                ],
                opacity: 0.8,
                line: {
                    color: '#999999',
                    width: 1
                }
            },
        };
        var data = [bubbleTrace];
        var layout = {
            title: {
                text: `Test Subject No. ${id} Belly Button Biodiversity`,
                font: {
                    family: 'Arial',
                    size: 18,
                    color: 'black'
                },
            },
            height: 520,
            width: 920,
            xaxis: {
                tickcolor: '#ffffff',
                tickfont: {family: 'Arial', color: 'darkgrey'},
                title: {
                    text: 'OTU ID (Bacteria)',
                    font: {
                        family: 'Arial',
                        size: 18,
                        color: 'darkgrey'
                    },
                },
            },
            yaxis: { 
                automargin: true,
                tickcolor: '#ffffff',
                tickfont: {family: 'Arial', color: 'darkgrey'},
                title: {
                    text: 'Sample Value',
                    font: {
                        family: 'Arial',
                        size: 18,
                        color: 'darkgrey'
                    },
                },
            },
        };
        Plotly.newPlot('bubble', data, layout, {
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

// Gauge chart
function getGauge(id) {
    d3.json('data/samples.json')
        .then(data => {
        var subjectData = data.metadata
        .filter(subject => subject.id.toString() === id)[0];
        console.log(subjectData);

        var value = subjectData.wfreq;
        console.log(value);
        var data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                type: 'indicator',
                mode: 'gauge+number',
                value: value,
                title: {
                    text: 'Belly Button Washing Frequency <br><i>Scrubs per Week</i>',
                    font: { size: 24, color: 'black', family: 'Arial'}
                },
                gauge: {
                    axis: { range: [null, 9], tickwidth: 1, tickcolor: 'darkgrey'},
                    bar: { color: '#cccccc', thickness: 0.3},
                    bgcolor: 'white',
                    borderwidth: 0,
                    bordercolor: 'gray',
                    steps: [
                        { range: [0, 1], color: '#d9ffb3'},
                        { range: [1, 2], color: '#bbff99'},
                        { range: [2, 3], color: '#ccffcc'},
                        { range: [3, 4], color: '#00cc88'},
                        { range: [4, 5], color: '#b3d9ff'},
                        { range: [5, 6], color: '#\d9ffb366a3ff'},
                        { range: [6, 7], color: '#e3ffc7'},
                        { range: [7, 8], color: '#edffda'},
                        { range: [8, 9], color: '#f6ffee'}
                    ],
                },
            },
        ];
        var layout = {
            width: 440,
            height: 360,
            margin: { t: 35, r: 15, l: 15, b: 0},
            font: { color: 'darkgrey', family: 'Arial'}
        };
        Plotly.newPlot('gauge', data, layout);
    });
};