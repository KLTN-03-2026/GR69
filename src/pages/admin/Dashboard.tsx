import { useEffect, useState } from "react";
import { adminDashboardService } from "../../services/admin/adminDashboadService";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend } from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend
);
function Dashboard() {
    const [data, setData] = useState<any>(null);
    const [month, setMonth] = useState(new Date().getMonth() + 1);

    useEffect(() => {
        fetchDashboard();
    }, [month]);

    const fetchDashboard = async () => {
        try {
            const res = await adminDashboardService.dashboard({ month });
            console.log(month);
            setData(res.data);
            console.log(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    if (!data) return <div>Loading...</div>;
    const stats = data.stats;

    const revenueOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return (
                            "Doanh thu: " +
                            Number(context.raw).toLocaleString() +
                            " đ"
                        );
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value: any) {
                        return Number(value).toLocaleString();
                    },
                },
                grid: {
                    color: "#e5e7eb",
                    borderDash: [5, 5],
                },
            },
        },
    };
    const commonOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom" as const,
            },
        },
        animation: {
            duration: 1000,
        },
    };

    const getLabel = (status: string) => {
        switch (status) {
            case "pending":
                return "Chờ xử lý";
            case "processing":
                return "Đang xử lý";
            case "shipping":
                return "Đang giao";
            case "delivered":
                return "Hoàn thành";
            case "cancelled":
                return "Đã huỷ";
            default:
                return status;
        }
    };

    const revenueChart = {
        labels: data.daily_revenue.map(
            (item: any) => `Ngày ${item.day}`
        ),
        datasets: [
            {
                label: "Doanh thu",
                data: data.daily_revenue.map((item: any) => item.revenue),
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59,130,246,0.2)",
                tension: 0.4,
                fill: true,
                pointRadius: 4,
            },
        ],
    };

    const totalRevenueTop = data.top_products.reduce(
        (sum: number, item: any) => sum + Number(item.revenue || 0),
        0
    );

    const getColorByStatus = (status: string) => {
        switch (status) {
            case "pending":
                return "#f1c40f";
            case "processing":
                return "#3498db";
            case "shipping":
                return "#9b59b6";
            case "delivered":
                return "#2ecc71";
            case "cancelled":
                return "#e74c3c";
            default:
                return "#95a5a6";
        }
    };

    const statusChart = {
        labels: data.orders_by_status.map((item: any) =>
            getLabel(item.status)
        ),
        datasets: [
            {
                data: data.orders_by_status.map((item: any) => item.count),
                backgroundColor:
                    data?.orders_by_status?.map((item: any) =>
                        getColorByStatus(item.status)
                    ) || [],
                borderWidth: 1,
            },
        ],
    };
    return (
        <>
            <div>
                <div className="page-title">Tổng quan (Dashboard)</div>
                <div className="container-fluid px-4 mb-4">
                    <div className="row g-4">
                        <div className="col-xl-3 col-lg-6">
                            <div className="stat-card modern">
                                <div className="icon blue">
                                    <i className="fas fa-dollar-sign"></i>
                                </div>
                                <div className="content">
                                    <h2>{Number(stats.total_revenue).toLocaleString()} đ</h2>
                                    <p>Tổng doanh thu</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6">
                            <div className="stat-card modern">
                                <div className="icon green">
                                    <i className="fas fa-shopping-cart"></i>
                                </div>
                                <div className="content">
                                    <h2>{stats.total_orders}</h2>
                                    <p>Đơn hàng</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6">
                            <div className="stat-card modern">
                                <div className="icon yellow">
                                    <i className="fas fa-box"></i>
                                </div>
                                <div className="content">
                                    <h2>{stats.total_products}</h2>
                                    <p>Sản phẩm</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6">
                            <div className="stat-card modern">
                                <div className="icon purple">
                                    <i className="fas fa-users"></i>
                                </div>
                                <div className="content">
                                    <h2>{stats.total_customers}</h2>
                                    <p>Khách hàng</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="container-fluid px-4 mt-4">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="chart-card">
                                <div className="chart-header">
                                    <h5>Doanh thu</h5>
                                    <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                                        <option value="1">Tháng 1</option>
                                        <option value="2">Tháng 2</option>
                                        <option value="3">Tháng 3</option>
                                        <option value="4">Tháng 4</option>
                                        <option value="5">Tháng 5</option>
                                        <option value="6">Tháng 6</option>
                                        <option value="7">Tháng 7</option>
                                        <option value="8">Tháng 8</option>
                                        <option value="9">Tháng 9</option>
                                        <option value="10">Tháng 10</option>
                                        <option value="11">Tháng 11</option>
                                        <option value="12">Tháng 12</option>
                                    </select>
                                </div>
                                <Line data={revenueChart} options={revenueOptions} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h5>Trạng thái đơn hàng</h5>
                            <div className="doughnut-wrapper">
                                <Doughnut data={statusChart} options={commonOptions} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="dashboard-section">
                    <h5>Top sản phẩm bán chạy</h5>
                    <div className="product-header">
                        <div className="left">Sản phẩm</div>
                        <div className="right">
                            <span>Doanh thu</span>
                            <span>%</span>
                        </div>
                    </div>

                    <div className="product-list">
                        {data.top_products.map((item: any) => {
                            const percent = totalRevenueTop
                                ? (Number(item.revenue || 0) / totalRevenueTop) * 100
                                : 0;
                            return (
                                <div key={item.id} className="product-item">
                                    <div className="product-info">
                                        <div className="info">
                                            <div className="name">{item.name}</div>
                                            <div className="category">
                                                {item.category?.name || "Không có danh mục"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="product-stats">
                                        <div className="revenue">
                                            {Number(item.revenue || 0).toLocaleString()} đ
                                        </div>

                                        <div className="percent">
                                            {percent.toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="dashboard-section">
                    <h5>Đơn hàng gần đây</h5>
                    <div className="product-header">
                        <div className="left">ID</div>
                        <div className="right">
                            <span>Giá trị đơn hàng</span>
                        </div>
                    </div>
                    <ul className="list-box">
                        {data.recent_orders.map((item: any) => (
                            <li key={item.id} className="list-item">
                                <span className="name">#{item.id}</span>
                                <span className="value">
                                    {Number(item.total_amount).toLocaleString()} đ
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Dashboard;