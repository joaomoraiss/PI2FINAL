var LABELS_CSV = [];
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

      console.log('Dados brutos do CSV:', rawData);

      const filteredData = rawData.filter(item => item['Medida'] !== undefined);

      console.log('Dados filtrados do CSV:', filteredData); // Adicione esta linha
       
      const dataByMeasure = filteredData.reduce((acc, item) => {
        const measure = item['Medida'];
        if (!acc[measure]) {
          acc[measure] = { labels: [], values: [] };
        }
        acc[measure].labels.push(item['Município']);
        acc[measure].values.push(item['Docentes']);
        return acc;
      }, {});
      console.log('Dados agrupados por medida:', dataByMeasure);

      const seriesDropdown = document.getElementById('series');
      seriesDropdown.innerHTML = '';
      Object.keys(dataByMeasure).forEach(measure => {
        const option = document.createElement('option');
        option.value = measure;
        option.textContent = measure;
        seriesDropdown.appendChild(option);
      });

      // Aqui, estou definindo a variável global DATA_CSV para ser utilizada posteriormente
      DATA_CSV = dataByMeasure;

      // Alterei para pegar a medida selecionada pelo usuário
      const selectedMeasure = document.getElementById('series').value;
      
      // Atualizando os gráficos com a medida inicial
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

function updateCharts(selectedMeasure) {
  // Verifique se os gráficos já foram inicializados
  if (!chartBar || !chartPizza || !chartLines) {
    // Se não foram inicializados, crie-os com dados vazios para evitar erros
    criarGraficoDeBarras({ labels: [], values: [] });
    criarGraficoDePizza({ labels: [], values: [] });
    criarGraficoDeLinhas({ labels: [], values: [] });
  }

  // Atualize os dados dos gráficos com base na medida selecionada
  chartBar.data.labels = DATA_CSV[selectedMeasure].labels;
  chartBar.data.datasets[0].data = DATA_CSV[selectedMeasure].values;
  chartBar.update(); // Atualize o gráfico de barras

  chartPizza.data.labels = DATA_CSV[selectedMeasure].labels;
  chartPizza.data.datasets[0].data = DATA_CSV[selectedMeasure].values;
  chartPizza.update(); // Atualize o gráfico de pizza

  chartLines.data.labels = DATA_CSV[selectedMeasure].labels;
  chartLines.data.datasets[0].data = DATA_CSV[selectedMeasure].values;
  chartLines.update(); // Atualize o gráfico de linhas
}

