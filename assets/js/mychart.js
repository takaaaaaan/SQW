var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['12-21 14:20:25','12-23 11:20:25', '12-25 10:50:11', '12-26 19:40:11', '12-27 12:50:00'],
        datasets: [{
            label: '등급',
            data: [1, 3, 2, 5, 4],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 3
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1, // Y軸の単位を1ずつに
                    color: 'white' // Y軸の文字色を白に
                },
                grid: {
                    color: '#c9d0e0' // Y軸の線の色を白に
                }
            },
            x: {
                ticks: {
                    color: 'white' // X軸の文字色を白に
                },
                grid: {
                    color: '#c9d0e0' // X軸の線の色を白に
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: 'white' // 凡例の文字色を白に
                }
            }
        }
    }
});
