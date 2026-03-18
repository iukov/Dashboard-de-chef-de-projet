import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BarChart3, CalendarDays, CircleAlert, Search, TrendingUp, Wallet } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { useMemo, useState } from "react";

export default function DashboardProjet() {
  const [search, setSearch] = useState("");
  const projets = [
    { projet: "Site Web Corporate", estimation: 20, tempsReel: 24, marge: 18, deadline: "2026-04-20", statut: "Risque" },
    { projet: "Intranet Groupe", estimation: 40, tempsReel: 38, marge: 24, deadline: "2026-05-15", statut: "OK" },
    { projet: "Application Mobile", estimation: 60, tempsReel: 72, marge: 12, deadline: "2026-06-01", statut: "Retard" },
    { projet: "Campagne CRM", estimation: 28, tempsReel: 26, marge: 30, deadline: "2026-04-10", statut: "OK" },
    { projet: "Refonte E-commerce", estimation: 90, tempsReel: 104, marge: 14, deadline: "2026-05-30", statut: "Risque" },
    { projet: "Portail RH", estimation: 36, tempsReel: 31, marge: 27, deadline: "2026-04-28", statut: "OK" },
  ];

  const projetsEnrichis = useMemo(() => {
    return projets
      .map((p) => ({
        ...p,
        ecart: Math.round(((p.tempsReel - p.estimation) / p.estimation) * 100),
      }))
      .filter((p) => p.projet.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const total = projetsEnrichis.length || 1;
  const ok = projetsEnrichis.filter((p) => p.statut === "OK").length;
  const risque = projetsEnrichis.filter((p) => p.statut === "Risque").length;
  const retard = projetsEnrichis.filter((p) => p.statut === "Retard").length;
  const margeMoyenne = Math.round(
    projetsEnrichis.reduce((sum, p) => sum + p.marge, 0) / total
  );
  const ecartMoyen = Math.round(
    projetsEnrichis.reduce((sum, p) => sum + p.ecart, 0) / total
  );

  const statutStyle = {
    OK: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Risque: "bg-amber-50 text-amber-700 border-amber-200",
    Retard: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const ecartStyle = (ecart) => {
    if (ecart <= 10) return "text-emerald-600";
    if (ecart <= 20) return "text-amber-600";
    return "text-rose-600";
  };

  const chartData = projetsEnrichis.map((p) => ({
    projet: p.projet.length > 14 ? `${p.projet.slice(0, 14)}…` : p.projet,
    Estimation: p.estimation,
    "Temps réel": p.tempsReel,
  }));

  const pieData = [
    { name: "OK", value: ok },
    { name: "Risque", value: risque },
    { name: "Retard", value: retard },
  ].filter((d) => d.value > 0);

  const pieColors = ["#10b981", "#f59e0b", "#f43f5e"];

  const prochainsDeadlines = [...projetsEnrichis]
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 4);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
              Pilotage & performance
            </p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Dashboard Projets
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
              Vue consolidée des estimations, temps réels, marges, échéances et alertes projet.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="border-slate-800 bg-white/5 backdrop-blur">
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Période</p>
                <p className="mt-2 text-lg font-semibold">Mars 2026</p>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-white/5 backdrop-blur">
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Mise à jour</p>
                <p className="mt-2 text-lg font-semibold">Automatique / manuelle</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard title="Projets suivis" value={projetsEnrichis.length} icon={<BarChart3 className="h-5 w-5" />} helper="Portefeuille actif" />
          <KpiCard title="Marge moyenne" value={`${margeMoyenne}%`} icon={<Wallet className="h-5 w-5" />} helper="Rentabilité moyenne" />
          <KpiCard title="Écart moyen" value={`${ecartMoyen > 0 ? "+" : ""}${ecartMoyen}%`} icon={<TrendingUp className="h-5 w-5" />} helper="Estimation vs réel" valueClassName={ecartStyle(ecartMoyen)} />
          <KpiCard title="Projets en alerte" value={risque + retard} icon={<CircleAlert className="h-5 w-5" />} helper="Risque + retard" />
        </div>

        <div className="mb-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <Card className="border-slate-800 bg-white/5 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-white">Charge projet</CardTitle>
                <p className="mt-1 text-sm text-slate-400">Comparatif estimation vs temps réel</p>
              </div>
            </CardHeader>
            <CardContent className="h-[360px] pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="projet" stroke="#94a3b8" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 16, color: "#fff" }} />
                  <Bar dataKey="Estimation" radius={[8, 8, 0, 0]} fill="#38bdf8" />
                  <Bar dataKey="Temps réel" radius={[8, 8, 0, 0]} fill="#a78bfa" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-white/5 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl text-white">Répartition des statuts</CardTitle>
              <p className="text-sm text-slate-400">Lecture instantanée du portefeuille</p>
            </CardHeader>
            <CardContent>
              <div className="h-[230px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={4}>
                      {pieData.map((entry, index) => (
                        <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 16, color: "#fff" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid gap-3">
                {pieData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: pieColors[index % pieColors.length] }} />
                      <span className="text-sm text-slate-300">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <Card className="border-slate-800 bg-white/5 backdrop-blur">
            <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-xl text-white">Suivi détaillé</CardTitle>
                <p className="mt-1 text-sm text-slate-400">Tableau de pilotage par projet</p>
              </div>
              <div className="relative w-full md:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un projet..."
                  className="border-slate-700 bg-slate-950/70 pl-9 text-slate-100 placeholder:text-slate-500"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-3 text-sm">
                  <thead>
                    <tr className="text-left text-slate-400">
                      <th className="px-4">Projet</th>
                      <th className="px-4">Estimation</th>
                      <th className="px-4">Temps réel</th>
                      <th className="px-4">Écart</th>
                      <th className="px-4">Marge</th>
                      <th className="px-4">Deadline</th>
                      <th className="px-4">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projetsEnrichis.map((p) => (
                      <tr key={p.projet} className="bg-slate-900/80 text-slate-200 shadow-[0_0_0_1px_rgba(51,65,85,0.8)]">
                        <td className="rounded-l-2xl px-4 py-4 font-medium text-white">{p.projet}</td>
                        <td className="px-4 py-4">{p.estimation}h</td>
                        <td className="px-4 py-4">{p.tempsReel}h</td>
                        <td className={`px-4 py-4 font-semibold ${ecartStyle(p.ecart)}`}>
                          {p.ecart > 0 ? "+" : ""}
                          {p.ecart}%
                        </td>
                        <td className="px-4 py-4">{p.marge}%</td>
                        <td className="px-4 py-4">{formatDate(p.deadline)}</td>
                        <td className="rounded-r-2xl px-4 py-4">
                          <Badge variant="outline" className={`rounded-full px-3 py-1 ${statutStyle[p.statut]}`}>
                            {p.statut}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-slate-800 bg-white/5 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                  <CalendarDays className="h-5 w-5 text-cyan-300" />
                  Échéances proches
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {prochainsDeadlines.map((p) => (
                  <div key={p.projet} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{p.projet}</p>
                        <p className="mt-1 text-sm text-slate-400">Deadline : {formatDate(p.deadline)}</p>
                      </div>
                      <Badge variant="outline" className={statutStyle[p.statut]}>
                        {p.statut}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-white/5 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl text-white">Lecture management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                <p>
                  <span className="font-semibold text-white">Priorité 1 :</span> arbitrer les projets en retard ou avec un écart supérieur à 20%.
                </p>
                <p>
                  <span className="font-semibold text-white">Priorité 2 :</span> sécuriser les jalons proches pour éviter un décalage global du portefeuille.
                </p>
                <p>
                  <span className="font-semibold text-white">Prochaine étape :</span> connecter cette vue à ton Excel ou à Make pour actualisation automatique.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, helper, icon, valueClassName = "text-white" }) {
  return (
    <Card className="border-slate-800 bg-white/5 backdrop-blur">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className={`mt-2 text-3xl font-semibold ${valueClassName}`}>{value}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">{helper}</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-3 text-cyan-300">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
