var DATA_CSV = {};
var chartBar = null;
var chartPizza = null;
var chartLines = null;


function criarGraficoDeBarras(data) {
  const ctx = document.getElementById('barChart').getContext('2d');
  chartBar = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Quantidade de Docentes',
        data: data.values,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function criarGraficoDePizza(data) {
  const ctx = document.getElementById('pieChart').getContext('2d');
  chartPizza = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.values,
        backgroundColor: ["#5056BF", "#65A6FA", "#6D74F2", "#9B57CC", "#00CADC"],
        borderColor: "#FFFFFF",
        borderWidth: 2,
      }]
    }
  });
}

function criarGraficoDeLinhas(data) {
  const ctx = document.getElementById('lineChart').getContext('2d');
  chartLines = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Quantidade de Docentes',
        data: data.values,
        fill: true,
        tension: 0.4,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    }
  });
}

const addSelectOptions = (options) => {
  options.forEach(option => {
    const htmlOption = document.createElement('option');
    htmlOption.value = option;
    htmlOption.innerHTML = option;
    document.getElementById('series').appendChild(htmlOption);
  });
}

function analisarCSV(file) {
  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    complete: function (results) {
      const rawData = results.data;

      const filteredData = rawData.filter(item => item['Medida'] !== undefined);

      const dataByMeasure = filteredData.reduce((acc, item) => {
        const measure = item['Medida'];
        if (!acc[measure]) {
          acc[measure] = { labels: [], values: [] };
        }
        acc[measure].labels.push(item['Medida']);
        acc[measure].values.push(item['Docentes']);
        return acc;
      }, {});

      const seriesDropdown = document.getElementById('series');
      seriesDropdown.innerHTML = '';
      Object.keys(dataByMeasure).forEach(measure => {
        const option = document.createElement('option');
        option.value = measure;
        option.textContent = measure;
        seriesDropdown.appendChild(option);
      });

      
      DATA_CSV = dataByMeasure;

     
      const selectedMeasure = document.getElementById('series').value;

      
      criarGraficoDeBarras(DATA_CSV[selectedMeasure]);
      criarGraficoDeLinhas(DATA_CSV[selectedMeasure]);

      
      updateCharts(selectedMeasure);
    }
  });
}

document.getElementById('csvFile').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) analisarCSV(file);
});

function exportarGrafico() {
  const chartContainer = document.getElementById('barChart');
  var image = chartContainer.toBase64Image();
  const btnDownload = document.getElementById('download');
  btnDownload.href = image;
  btnDownload.download = 'my_file_name.png';
  btnDownload.click();
}

document.getElementById('series').addEventListener('change', function (event) {
  const series = document.getElementById('series');
  const selectedValue = series.options[series.selectedIndex].text;
  updateCharts(selectedValue);
});
criarGraficoDeBarras({ labels: [], values: [] });
criarGraficoDeLinhas({ labels: [], values: [] });
criarGraficoDePizza({ labels: [], values: [] });
function updateCharts(selectedMeasure) {
 
  if (!chartBar) {
    criarGraficoDeBarras({ labels: [], values: [] });
  }

  if (!chartLines) {
    criarGraficoDeLinhas({ labels: [], values: [] });
  }

  if (!chartPizza) {
    criarGraficoDePizza({ labels: [], values: [] });
  }

  
  const chartBarData = {
    labels: DATA_CSV[selectedMeasure].labels,
    values: DATA_CSV[selectedMeasure].values
  };

  chartBar.data.labels = chartBarData.labels;
  chartBar.data.datasets[0].data = chartBarData.values;
  chartBar.update(); 

  const chartPizzaData = DATA_CSV[selectedMeasure].labels.map((label, index) => {
    return { label, value: DATA_CSV[selectedMeasure].values[index] };
  });

  chartPizza.data.labels = chartPizzaData.map(item => item.label);
  chartPizza.data.datasets[0].data = chartPizzaData.map(item => item.value);
  chartPizza.update(); 

  const chartLinesData = {
    labels: DATA_CSV[selectedMeasure].labels,
    values: DATA_CSV[selectedMeasure].values
  };

  chartLines.data.labels = chartLinesData.labels;
  chartLines.data.datasets[0].data = chartLinesData.values;
  chartLines.update(); 
}


