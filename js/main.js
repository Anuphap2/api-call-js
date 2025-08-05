async function getData() {
    const response = await fetch('https://fakestoreapi.com/products');
    const loading = document.getElementById('loading');
    const productsList = document.getElementById('products-list');

    try {
        if (!response.ok) {
            throw new Error(`เกิดข้อผิดพลาด: ${response.status}`);
        }
        const data = await response.json();
        loading.style.display = 'none';

        data.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td class="border border-gray-300 p-3 text-left">${product.title}</td>
            <td class="border border-gray-300 p-3"><img src="${product.image}" alt="${product.title}"></td>
            <td class="border border-gray-300 p-3 description" title="${product.description}">${product.description}</td>
            <td class="border border-gray-300 p-3">$${product.price.toFixed(2)}</td>
            <td class="border border-gray-300 p-3">${product.category}</td>
          `;
            productsList.appendChild(tr);
        });

        // เตรียมข้อมูลสำหรับ Pie Chart (นับจำนวนสินค้าในแต่ละ category)
        const grouped = _.countBy(data, 'category');
        const categories = Object.keys(grouped);
        const counts = Object.values(grouped);

        // สร้างกราฟ
        const ctx = document.getElementById('categoryChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'จำนวนสินค้า',
                    data: counts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)'
                    ],
                    borderColor: 'white',
                    borderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'จำนวนสินค้าตามหมวดหมู่'
                    }
                }
            }
        });

    } catch (error) {
        loading.textContent = 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
        loading.classList.add('text-red-600');
        console.error(error);
    }
}

getData();