import * as echarts from "echarts";
import React, { useEffect, useRef } from "react";

// grafico linha cadastros por mês 
const CadastrosPorMesChart: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;
        const chart = echarts.init(chartRef.current);

        chart.setOption({
            tooltip: { trigger: "axis" },
            grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
                axisLine: { lineStyle: { color: "#e5e7eb" } },
                axisLabel: { color: "#9ca3af" },
            },
            yAxis: {
                type: "value",
                axisLabel: { color: "#9ca3af" },
                splitLine: { lineStyle: { color: "#f3f4f6" } },
            },
            series: [
                {
                    name: "Cadastros",
                    type: "line",
                    smooth: true,
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    symbol: "circle",
                    symbolSize: 8,
                    lineStyle: { color: "#7c3aed", width: 2 },
                    itemStyle: { color: "#7c3aed" },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: "rgba(124,58,237,0.3)" },
                            { offset: 1, color: "rgba(250,204,21,0.05)" },
                        ]),
                    },
                },
            ],
        });

        const handleResize = () => chart.resize();
        window.addEventListener("resize", handleResize);
        return () => { chart.dispose(); window.removeEventListener("resize", handleResize); };
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Cadastros por Mês</h2>
            <div ref={chartRef} style={{ width: "100%", height: 280 }} />
        </div>
    );
};

// grafico barra - qtd por localidade
const AlunosPorLocalidadeChart: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;
        const chart = echarts.init(chartRef.current);

        const localidades = [
            "Porto Alegre - RS",
            "Canoas - RS",
            "São Borja - RS",
            "Florianópolis - SC",
            "Chapecó - SC",
            "Xanxerê - SC",
        ];

        const colors = ["#7c3aed", "#ec4899", "#facc15", "#7c3aed", "#ec4899", "#facc15"];

        chart.setOption({
            tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
            grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
            xAxis: {
                type: "value",
                axisLabel: { color: "#9ca3af" },
                splitLine: { lineStyle: { color: "#f3f4f6" } },
            },
            yAxis: {
                type: "category",
                data: localidades,
                axisLine: { lineStyle: { color: "#e5e7eb" } },
                axisLabel: { color: "#374151", fontSize: 12 },
            },
            series: [
                {
                    name: "Alunos",
                    type: "bar",
                    barMaxWidth: 32,
                    data: localidades.map((_, i) => ({
                        value: 0,
                        itemStyle: { color: colors[i], borderRadius: [0, 6, 6, 0] },
                    })),
                    label: {
                        show: true,
                        position: "right",
                        color: "#6b7280",
                        formatter: "{c} alunos",
                    },
                },
            ],
        });

        const handleResize = () => chart.resize();
        window.addEventListener("resize", handleResize);
        return () => { chart.dispose(); window.removeEventListener("resize", handleResize); };
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
                Quantidade de Alunos por Localidade
            </h2>
            <div ref={chartRef} style={{ width: "100%", height: 320 }} />
        </div>
    );
};

// grafico pizza tipo de deficiencia
const TiposDeDeficienciaChart: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;
        const chart = echarts.init(chartRef.current);

        const tipos = [
            { name: "Visual", value: 0, color: "#7c3aed" },
            { name: "Auditiva", value: 0, color: "#facc15" },
            { name: "Física", value: 0, color: "#ec4899" },
            { name: "Intelectual", value: 0, color: "#06b6d4" },
            { name: "Múltipla", value: 0, color: "#10b981" },
            { name: "Outras", value: 0, color: "#f97316" },
        ];

        chart.setOption({
            tooltip: {
                trigger: "item",
                formatter: "{b}: {c} ({d}%)",
            },
            legend: {
                orient: "vertical",
                right: "5%",
                top: "center",
                textStyle: { color: "#374151", fontSize: 12 },
                formatter: (name: string) => {
                    const item = tipos.find((t) => t.name === name);
                    return `${name}   ${item?.value ?? 0}`;
                },
            },
            series: [
                {
                    name: "Tipos de Deficiência",
                    type: "pie",
                    radius: ["45%", "75%"],
                    center: ["35%", "50%"],
                    avoidLabelOverlap: false,
                    label: {
                        show: true,
                        position: "center",
                        formatter: "100%\nTOTAL",
                        color: "#1f2937",
                        fontSize: 16,
                        fontWeight: "bold",
                        lineHeight: 22,
                    },
                    emphasis: {
                        label: { show: true },
                    },
                    data:
                        tipos.every((t) => t.value === 0)
                            ? [{ value: 1, name: "Sem dados", itemStyle: { color: "#e5e7eb" }, label: { formatter: "0\nTOTAL" } }]
                            : tipos.map((t) => ({
                                value: t.value,
                                name: t.name,
                                itemStyle: { color: t.color },
                            })),
                },
            ],
        });

        const handleResize = () => chart.resize();
        window.addEventListener("resize", handleResize);
        return () => { chart.dispose(); window.removeEventListener("resize", handleResize); };
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
                Tipos de Deficiência e Quantidade
            </h2>
            <div ref={chartRef} style={{ width: "100%", height: 300 }} />
        </div>
    );
};

// //Dashboard completo
// const DashboardCharts: React.FC = () => (
//   <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//       <CadastrosPorMesChart />
//       <TiposDeDeficienciaChart />
//     </div>
//     <AlunosPorLocalidadeChart />
//   </div>
// );

// export default DashboardCharts;