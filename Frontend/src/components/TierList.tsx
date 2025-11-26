import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import "../styles/Home.scss";
import Footer from "./Footer";
import LoadingOverlay from "./LoadingOverlay";
import api from "../api/client";

type TierRow = {
  name: string;
  role: string;
  pickRate: number;
  winRate: number;
  banRate: number;
  matches: number;
};

export default function TierList() {
  const [rows, setRows] = useState<TierRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [champIdByName, setChampIdByName] = useState<Record<string, string>>(
    {}
  );
  const [query, setQuery] = useState<string>("");
  const [sortKey, setSortKey] = useState<
    "name" | "pickRate" | "winRate" | "banRate">(
    "name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const fmtPct = (v: number) => {
    const n = Number.isFinite(v) ? v : 0;
    return `${n.toFixed(2)}%`;
  };

  const fmtInt = (v: number) =>
  Number.isFinite(v) ?
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(v) :
  "0";

  const endpoint = useMemo(() => "/api/meta/tier-list", []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(endpoint);
        const toRow = (d: unknown): TierRow => {
          const o =
          typeof d === "object" && d !== null ?
          d as Record<string, unknown> :
          {};
          const num = (v: unknown): number => {
            if (typeof v === "number") return v;
            if (typeof v === "string") {
              const s = v.trim().replace("%", "").replace(",", ".");
              const n = Number(s);
              return Number.isFinite(n) ? n : 0;
            }
            const n = Number(v ?? 0);
            return Number.isFinite(n) ? n : 0;
          };
          const str = (v: unknown): string =>
          typeof v === "string" ? v : String(v ?? "");
          return {
            name: str(o.name ?? o.championName),
            role: str(o.role ?? o.position),
            pickRate: num(o.pickRate ?? o.pick_rate),
            winRate: num(o.winRate ?? o.win_rate),
            banRate: num(o.banRate ?? o.ban_rate),
            matches: num(o.matches ?? o.games)
          };
        };
        const list: TierRow[] = Array.isArray(data) ? data.map(toRow) : [];
        setRows(list);
      } catch (err: unknown) {
        const e = err as {
          response?: {status?: number;data?: {error?: string;};};
          message?: string;
        };
        if (e?.response?.status === 401) {
          navigate("/login", { replace: true, state: { from: location } });
          return;
        }
        const msg = e?.response?.data?.error || e?.message || "Loading error";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [endpoint]);

  useEffect(() => {
    const CHAMPIONS_DATA_URL =
    "https://ddragon.leagueoflegends.com/cdn/15.22.1/data/en_US/champion.json";
    const loadMapping = async () => {
      try {
        const res = await fetch(CHAMPIONS_DATA_URL);
        if (!res.ok) return;
        const json = await res.json();
        const data =
        json && typeof json === "object" ? (json as any).data : null;
        if (!data || typeof data !== "object") return;
        const map: Record<string, string> = {};
        Object.values(data).forEach((c: any) => {
          if (c && typeof c === "object") {
            const name: string = String(c.name ?? "");
            const id: string = String(c.id ?? "");
            if (name && id) map[name] = id;
          }
        });
        setChampIdByName(map);
      } catch {}
    };
    loadMapping();
  }, []);

  const getIconUrl = (name: string): string | undefined => {
    const id = champIdByName[name];
    return id ?
    `https://ddragon.leagueoflegends.com/cdn/15.22.1/img/champion/${id}.png` :
    undefined;
  };

  const visibleRows = useMemo(() => {
    const filtered = rows.filter((r) =>
    r.name.toLowerCase().includes(query.trim().toLowerCase())
    );
    const cmpStr = (a: string, b: string) =>
    a.localeCompare(b, undefined, { sensitivity: "base" });
    const cmpNum = (a: number, b: number) => a - b;
    const sorted = [...filtered].sort((a, b) => {
      let res = 0;
      switch (sortKey) {
        case "name":
          res = cmpStr(a.name, b.name);
          break;
        case "pickRate":
          res = cmpNum(a.pickRate, b.pickRate);
          break;
        case "winRate":
          res = cmpNum(a.winRate, b.winRate);
          break;
        case "banRate":
          res = cmpNum(a.banRate, b.banRate);
          break;
      }
      return sortDir === "asc" ? res : -res;
    });
    return sorted;
  }, [rows, query, sortKey, sortDir]);

  const toggleSort = (key: "name" | "pickRate" | "winRate" | "banRate") => {
    if (sortKey === key) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortCaret = ({ active }: {active: boolean;}) =>
  <i
    className={`bi ${
    sortDir === "asc" ? "bi-caret-up-fill" : "bi-caret-down-fill"}`
    }
    aria-hidden={!active}
    style={{ marginLeft: 6, opacity: active ? 1 : 0.25 }} />;



  return (
    <section className="home-section">
      <div className="home-intro">
        <h2 className="home-title">META TIER LIST</h2>
        <p>Champions data table.</p>
      </div>

      <div className="home-search" style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search champions..."
          aria-label="Search champion by name"
          className="form-control" />
        
      </div>

      <LoadingOverlay
        loading={loading}
        error={error}
        label="Loading Tier List…"
        onRetry={() => window.location.reload()} />
      

      {!loading && !error &&
      <div className="home-cards">
          <div className="home-card-item">
            <Card className="home-card h-100">
              <Card.Header style={{ backgroundColor: "transparent" }}>
                Tier List
              </Card.Header>
              <Card.Body>
                <Table
                responsive
                bordered
                hover
                variant="dark"
                className="mb-0">
                
                  <thead>
                    <tr>
                      <th
                      role="button"
                      onClick={() => toggleSort("name")}
                      title="Sort by Name">
                      
                        Name
                        <SortCaret active={sortKey === "name"} />
                      </th>
                      <th>Role</th>
                      <th
                      role="button"
                      onClick={() => toggleSort("pickRate")}
                      title="Sort by Pick Rate">
                      
                        Pick Rate
                        <SortCaret active={sortKey === "pickRate"} />
                      </th>
                      <th
                      role="button"
                      onClick={() => toggleSort("winRate")}
                      title="Sort by Win Rate">
                      
                        Win Rate
                        <SortCaret active={sortKey === "winRate"} />
                      </th>
                      <th
                      role="button"
                      onClick={() => toggleSort("banRate")}
                      title="Sort by Ban Rate">
                      
                        Ban Rate
                        <SortCaret active={sortKey === "banRate"} />
                      </th>
                      <th>Matches</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.map((r, idx) =>
                  <tr key={`${r.name}-${idx}`}>
                        <td>
                          <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem"
                        }}>
                        
                            {(() => {
                          const url = getIconUrl(r.name);
                          if (!url) return null;
                          return (
                            <img
                              src={url}
                              alt={`${r.name} icon`}
                              width={28}
                              height={28}
                              onError={(e) => {
                                const svg =
                                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><rect width="100%" height="100%" fill="%23212529"/></svg>';
                                e.currentTarget.src = svg;
                              }} />);


                        })()}
                            {champIdByName[r.name] ?
                        <Link
                          to={`/Champions/${champIdByName[r.name]}`}
                          className="text-decoration-none"
                          aria-label={`Open ${r.name} detail page`}>
                          
                                {r.name}
                              </Link> :

                        <span>{r.name}</span>
                        }
                          </div>
                        </td>
                        <td>{r.role}</td>
                        <td>{fmtPct(r.pickRate)}</td>
                        <td>{fmtPct(r.winRate)}</td>
                        <td>{fmtPct(r.banRate)}</td>
                        <td>{fmtInt(r.matches)}</td>
                      </tr>
                  )}
                    {visibleRows.length === 0 &&
                  <tr>
                        <td colSpan={6} className="text-center text-secondary">
                          No data available.
                        </td>
                      </tr>
                  }
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
        </div>
      }

      <div className="footer-center-wrapper">
        <Footer />
      </div>
    </section>);

}