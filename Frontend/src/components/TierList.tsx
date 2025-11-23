import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import "../styles/Home.scss";
import Footer from "./Footer";
import LoadingOverlay from "./LoadingOverlay";
import api from "../api/client";

type TierRow = {
  name: string;
  role: string;
  pickRate: string;
  winRate: string;
  banRate: string;
  matches: string;
};

export default function TierList() {
  const [rows, setRows] = useState<TierRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fmtPct = (v: number) => `${(v * (v > 1 ? 0.01 : 1)).toFixed(1)}%`;
  const fmtInt = (v: number) =>
    new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(v);

  const endpoint = useMemo(() => "/api/champions", []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(endpoint);
        const toRow = (d: unknown): TierRow => {
          const o =
            typeof d === "object" && d !== null
              ? (d as Record<string, unknown>)
              : {};
          const num = (v: unknown): number =>
            typeof v === "number" ? v : Number(v ?? 0);
          const str = (v: unknown): string =>
            typeof v === "string" ? v : String(v ?? "");
          return {
            name: str(o.name ?? o.championName),
            role: str(o.role ?? o.position),
            pickRate: str(o.pickRate ?? o.pick_rate),
            winRate: str(o.winRate ?? o.win_rate),
            banRate: str(o.banRate ?? o.ban_rate),
            matches: str(o.matches ?? o.games),
          };
        };
        const list: TierRow[] = Array.isArray(data) ? data.map(toRow) : [];
        setRows(list);
      } catch (err: unknown) {
        const e = err as {
          response?: { status?: number; data?: { error?: string } };
          message?: string;
        };
        if (e?.response?.status === 401) {
          navigate("/login", { replace: true, state: { from: location } });
          return;
        }
        const msg =
          e?.response?.data?.error || e?.message || "Errore di caricamento";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [endpoint]);

  return (
    <section className="home-section">
      <div className="home-intro">
        <h2 className="home-title">META TIER LIST</h2>
        <p>Tabella con dati relativi i champions.</p>
      </div>

      <LoadingOverlay
        loading={loading}
        error={error}
        label="Caricamento Tier List…"
        onRetry={() => window.location.reload()}
      />

      {!loading && !error && (
        <div className="home-cards">
          <div className="home-card-item">
            <Card className="home-card h-100">
              <Card.Header style={{ backgroundColor: "transparent" }}>
                Tier List (Database)
              </Card.Header>
              <Card.Body>
                <Table
                  responsive
                  bordered
                  hover
                  variant="dark"
                  className="mb-0"
                >
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Pick Rate</th>
                      <th>Win Rate</th>
                      <th>Ban Rate</th>
                      <th>Matches</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, idx) => (
                      <tr key={`${r.name}-${idx}`}>
                        <td>{r.name}</td>
                        <td>{r.role}</td>
                        <td>{fmtPct(r.pickRate)}</td>
                        <td>{fmtPct(r.winRate)}</td>
                        <td>{fmtPct(r.banRate)}</td>
                        <td>{fmtInt(r.matches)}</td>
                      </tr>
                    ))}
                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center text-secondary">
                          Nessun dato disponibile.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}

      <div className="footer-center-wrapper">
        <Footer />
      </div>
    </section>
  );
}
