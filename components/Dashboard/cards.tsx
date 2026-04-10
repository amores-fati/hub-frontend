import React from "react";

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    badge: string;
    badgeColor?: "green" | "red" | "purple" | "pink";
}

const StatCard: React.FC<StatCardProps> = ({
    icon,
    label,
    value,
    badge,
    badgeColor = "green",
}) => {
    const badgeStyles: Record<string, string> = {
        green: "text-green-500",
        red: "text-red-400",
        purple: "text-purple-500",
        pink: "text-pink-500",
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 w-56">
            <div className="flex items-start justify-between mb-3">
                <div className="text-gray-400">{icon}</div>
                <span className={`text-sm font-semibold ${badgeStyles[badgeColor]}`}>
                    {badge}
                </span>
            </div>
            <p className="text-sm text-gray-400 mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );
};

const UsersIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4 6v-2m0 0a4 4 0 10-4-4 4 4 0 004 4z" />
    </svg>
);

const AccessibilityIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <circle cx="12" cy="5" r="1.5" />
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 7v5m0 0l-3 5m3-5l3 5M9 10H6m12 0h-3" />
    </svg>
);

const BriefcaseIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
);

const CheckBadgeIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
);

const DashboardCards: React.FC = () => (
    <div className="flex flex-wrap gap-4 p-6 bg-gray-50">
        <StatCard
            icon={<UsersIcon />}
            label="Total de Alunos"
            value="0"
            badge="+0%"
            badgeColor="green"
        />
        <StatCard
            icon={<AccessibilityIcon />}
            label="Alunos PCD"
            value="0"
            badge="0% PCD"
            badgeColor="purple"
        />
        <StatCard
            icon={<BriefcaseIcon />}
            label="Vagas de Emprego"
            value="0"
            badge="0%"
            badgeColor="red"
        />
        <StatCard
            icon={<CheckBadgeIcon />}
            label="Alunos Empregados"
            value="0"
            badge="0% Empreg."
            badgeColor="pink"
        />
    </div>
);

export default DashboardCards;